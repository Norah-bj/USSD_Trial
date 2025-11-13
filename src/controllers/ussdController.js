// src/controllers/ussdController.js
import { getUssdMenus } from "../config/ussdMenus.js";
import pool from "../config/database.js";
import { sessionManager } from "../utils/sessionManager.js";
import { EMERGENCY_TYPE_LABELS } from "../config/constants.js";
import { t } from "../config/i18n.js";
import {
  sendEmergencyConfirmation,
  sendDistressAlert,
} from "./smsController.js";
import {
  reportEmergency,
  // getUserEmergencies,
  triggerDistressAlert,
  // getPosts,
} from "../services/backendApiService.js";
import { getEmergencyGuidance } from "../services/aiService.js";

/**
 * Language handlers - set language and redirect to main menu
 */
export const languageHandlers = {
  rw: async (userData) => {
    sessionManager.setLanguage(userData.sessionId, "rw");
    const menus = getUssdMenus("rw");
    return menus.main.text;
  },
  en: async (userData) => {
    sessionManager.setLanguage(userData.sessionId, "en");
    const menus = getUssdMenus("en");
    return menus.main.text;
  },
  
  // ----------------------
  // 🟢 Persist user info updates
  updateSuccess: async (userData) => {
    try {
      const session = sessionManager.getSession(userData.sessionId);
      const formData = session?.formData || {};
      const lastKey = session?.lastInputKey;

      if (!lastKey) {
        return `END ${t("responses.invalid_option", {}, userData.locale || "rw")}`;
      }

      const columnMap = {
        updateLocation: { column: "location", value: formData.updateLocation },
        updateInsurance: { column: "insurance", value: formData.updateInsurance },
        updateId: { column: "nationalid", value: formData.updateId },
        updateHealthCenter: { column: "healthcenter", value: formData.updateHealthCenter },
        updatePregnancyMonths: { column: "pregnancymonths", value: formData.updatePregnancyMonths },
      };

      const mapping = columnMap[lastKey];
      if (!mapping || mapping.value == null || mapping.value === "") {
        return `END ${t("responses.invalid_option", {}, userData.locale || "rw")}`;
      }

      const query = `UPDATE users SET ${mapping.column} = $1 WHERE phonenumber = $2 RETURNING *;`;
      const values = [mapping.value, userData.phoneNumber];

      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
        return `END ${t("responses.unable_to_load", { item: "user" }, userData.locale || "rw")}`;
      }

      // clear the consumed input
      const newFormData = { ...formData };
      delete newFormData[lastKey];
      sessionManager.setSession(userData.sessionId, { formData: newFormData, lastInputKey: null });

      return `END ${t("update_info.update_success", {}, userData.locale || "rw")}`;
    } catch (err) {
      console.error("❌ Error updating user info:", err);
      return `END ${t("responses.unable_to_load", { item: "update" }, userData.locale || "rw")}`;
    }
  },
};

/**
 * Generate a unique reference ID for emergencies
 */
const generateReferenceId = () => `ML${Date.now().toString().slice(-8)}`;

/**
 * Get emergency type from user session and menu choices
 */
const getEmergencyTypeFromSession = (sessionId, text) => {
  const levels = text.split("*");
  for (let i = 0; i < levels.length; i++) {
    const choice = levels[i];
    if (EMERGENCY_TYPE_LABELS[choice]) {
      return EMERGENCY_TYPE_LABELS[choice];
    }
  }
  return { type: "other", label: "Emergency" };
};

/**
 * Terminal handlers - end USSD session actions
 */
export const terminalHandlers = {
    // ----------------------
  // 🟢 Registration complete: save to Neon DB
  registrationComplete: async (userData) => {
    try {
      const session = sessionManager.getSession(userData.sessionId);
      const formData = session?.formData || {};

      const newUser = {
        name: formData.regStepName || "",
        nationalId: formData.regStepId || "",
        insurance: formData.regStepInsurance || "",
        location: formData.regStepLocation || "",
        pregnancyMonths: formData.regStepPregnancyMonths || "",
        healthCenter: formData.regStepHealthCenter || "",
        phoneNumber: userData.phoneNumber,
      };

      const query = `
        INSERT INTO users (name, nationalid, insurance, location, pregnancymonths, healthcenter, phonenumber)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
      const values = [
        newUser.name,
        newUser.nationalId,
        newUser.insurance,
        newUser.location,
        newUser.pregnancyMonths,
        newUser.healthCenter,
        newUser.phoneNumber,
      ];

      const result = await pool.query(query, values);
      console.log("🟢 New user saved:", result.rows[0]);

      sessionManager.clearSession(userData.sessionId);
      return `END Murakoze! Kwiyandikisha byagenze neza.`;

    } catch (err) {
      if (err.code === "23505") {
        console.log("⚠️ User already registered:", userData.phoneNumber);
        return `END Ubusanzwe wariyandikishije. Murakoze!`;
      } else {
        console.error("❌ Error saving registration:", err);
        return `END Habaye ikibazo mu kubika amakuru yawe.`;
      }
    }
  },


  // ----------------------
  // 🟢 Submit emergency

  submitEmergency: async (userData) => {
    try {
      const referenceId = generateReferenceId();
      const emergencyInfo = getEmergencyTypeFromSession(
        userData.sessionId,
        userData.text
      );

      const session = sessionManager.getSession(userData.sessionId);
      const additionalInfo = session?.additionalInfo || "";

      const emergencyData = {
        phoneNumber: userData.phoneNumber,
        emergencyType: emergencyInfo.type,
        referenceId,
        description: additionalInfo || `${emergencyInfo.label} reported`,
        location: "Unknown", // TODO: integrate location if available
        status: "pending",
        reportedAt: new Date().toISOString(),
      };

      const backendResult = await reportEmergency(emergencyData);

      if (backendResult.success) {
        sessionManager.setSession(userData.sessionId, {
          lastEmergency: {
            referenceId,
            type: emergencyInfo.type,
            phoneNumber: userData.phoneNumber,
            backendId: backendResult.data?.id,
          },
        });

        await sendEmergencyConfirmation(
          userData.phoneNumber,
          emergencyInfo.label,
          referenceId
        );

        return `END Murakoze! ${emergencyInfo.label} yawe yatanzwe.\nReference: ${referenceId}\nUbufasha burimo kugutegereza.`;
      } else {
        return `END Ikibazo cyatanzwe. Reference: ${referenceId}. Ubufasha burimo kugutegereza.`;
      }
    } catch (error) {
      console.error("Error submitting emergency:", error);
      const fallbackRef = generateReferenceId();
      return `END Ikibazo cyatanzwe. Reference: ${fallbackRef}. Ubufasha burimo kugutegereza.`;
    }
  },

  // ----------------------
  // 🟢 Confirm distress

  confirmDistress: async (userData) => {
    try {
      const referenceId = generateReferenceId();
      const distressData = {
        phoneNumber: userData.phoneNumber,
        message: "Akaga gakomeye!",
        location: "Unknown",
      };

      const backendResult = await triggerDistressAlert(distressData);

      if (backendResult.success) {
        sessionManager.setSession(userData.sessionId, {
          distressAlert: { referenceId, phoneNumber: userData.phoneNumber },
        });

        await sendDistressAlert(userData.phoneNumber, "Location not set");

        return `END AKAGA GAKOMEYE KEMEWE!\nReference: ${referenceId}\nUbufasha burimo kugutegereza.`;
      } else {
        return `END AKAGA GAKOMEYE KEMEWE!\nReference: ${referenceId}\nUbufasha burimo kugutegereza.`;
      }
    } catch (error) {
      console.error("Error confirming distress:", error);
      const fallbackRef = generateReferenceId();
      return `END AKAGA GAKOMEYE KEMEWE! Reference: ${fallbackRef}. Ubufasha burimo kugutegereza.`;
    }
  },

  // ----------------------
  // 🟢 Get AI guidance

  getAIGuidance: async (userData) => {
    try {
      const locale = userData.locale || "en";
      const result = await getEmergencyGuidance(null, null, locale);

      if (result.success) {
        return `END ${t("ai_assistance.guidance_title", {}, locale)}\n\n${result.guidance}\n\nItegure kandi ube amahoro.`;
      } else {
        return `END ${t("ai_assistance.guidance_title", {}, locale)}\n\nNtibyakunze kubona inama za AI.`;
      }
    } catch (error) {
      console.error("Error getting AI guidance:", error);
      return `END ${t("responses.unable_to_load", { item: "AI guidance" }, "en")}`;
    }
  },
};

/**
 * Main USSD request handler
 */
export const handleUSSDRequest = async (text, userData) => {
  const levels = text.split("*");
  let session = sessionManager.getSession(userData.sessionId);

  // create new session if not found
  if (!session) {
    session = { sessionId: userData.sessionId, formData: {}, language: "rw" };
    sessionManager.setSession(userData.sessionId, session);
  }

  const locale = session.language || "rw";
  const ussdMenus = getUssdMenus(locale);

  if (text === "") return ussdMenus.welcome.text;

  let currentMenu = "welcome";

  for (let i = 0; i < levels.length; i++) {
    const choice = levels[i];
    const menu = ussdMenus[currentMenu];

    if (!menu) return `END ${t("responses.invalid_option", {}, locale)}`;

    let nextStep = menu.options?.[choice];

    // If user types input and menu accepts input, use wildcard route
    if (!nextStep && menu.acceptsInput && menu.options?.["*"]) {
      nextStep = menu.options["*"];
    }

    if (!nextStep) return `END ${t("responses.invalid_option", {}, locale)}`;

    // Store input safely
    if (menu.acceptsInput) {
      session.formData = session.formData || {};
      session.formData[currentMenu] = choice;
      // Track which menu captured the last input
      session.lastInputKey = currentMenu;
      sessionManager.setSession(userData.sessionId, session);
    }

    if (languageHandlers[nextStep]) return await languageHandlers[nextStep](userData);

    if (terminalHandlers[nextStep]) {
      userData.text = text;
      userData.locale = locale;
      return await terminalHandlers[nextStep](userData);
    }

    if (ussdMenus[nextStep]) {
      currentMenu = nextStep;
      if (i === levels.length - 1) return ussdMenus[nextStep].text;
    }
  }

  return `END ${t("responses.invalid_option", {}, locale)}`;
};


/**
 * USSD webhook controller
 */
export const ussdHandler = async (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;
  const userData = { sessionId, serviceCode, phoneNumber };

  // respond quickly (<5s)
  handleUSSDRequest(text, userData)
    .then((response) => {
      res.set("Content-Type", "text/plain");
      res.send(response);
    })
    .catch((err) => {
      console.error(err);
      res.set("Content-Type", "text/plain");
      res.send("END An error occurred. Please try again later.");
    });
};

