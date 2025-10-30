// src/controllers/ussdController.js
import { getUssdMenus } from "../config/ussdMenus.js";
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
  en: async (userData) => {
    sessionManager.setLanguage(userData.sessionId, "en");
    const menus = getUssdMenus("en");
    return menus.main.text;
  },
  rw: async (userData) => {
    sessionManager.setLanguage(userData.sessionId, "rw");
    const menus = getUssdMenus("rw");
    return menus.main.text;
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
  const session = sessionManager.getSession(userData.sessionId);
  const locale = session?.language || "rw";
  const ussdMenus = getUssdMenus(locale);

  if (text === "") return ussdMenus.welcome.text;

  let currentMenu = "welcome";

for (let i = 0; i < levels.length; i++) {
  const choice = levels[i];
  const menu = ussdMenus[currentMenu];

  if (!menu) return `END ${t("responses.invalid_option", {}, locale)}`;

  let nextStep = menu.options?.[choice];

  // 🧠 NEW: If user typed text and menu accepts input, use wildcard route
  if (!nextStep && menu.acceptsInput && menu.options?.["*"]) {
    nextStep = menu.options["*"];
  }

  if (!nextStep) return `END ${t("responses.invalid_option", {}, locale)}`;

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
  const response = await handleUSSDRequest(text, userData);

  res.set("Content-Type", "text/plain");
  res.send(response);
};
