import { t } from "./i18n.js";

/**
 * Generate USSD menu text with translations
 * @param {string} locale - Current locale
 * @returns {Object} USSD menus with translated text
 */
export const getUssdMenus = (locale = "en") => {
  return {
    // ===============================
    // EXISTING MENUS (keep yours here)
    // ===============================

    // 🆕 MOTHERLINK MAIN FLOW
    welcome: {
      text: `CON ${t("welcome.title", {}, locale)}
    ${t("welcome.select_language", {}, locale)}
    1. ${t("welcome.kinyarwanda", {}, locale)}
    2. ${t("welcome.english", {}, locale)}
    `,
      options: {
        1: "main",
        2: "main",
      },
    },

    main: {
      text: `CON ${t("main.title", {}, locale)}
    1. ${t("main.registration", {}, locale)}
    2. ${t("main.update_info", {}, locale)}
    3. ${t("main.ask_question", {}, locale)}
    4. ${t("main.distress", {}, locale)}
    5. ${t("main.ai_assistance", {}, locale)}
    6. ${t("main.settings", {}, locale)}
    0. ${t("common.go_back", {}, locale)}
    `,
      options: {
        1: "registration",
        2: "updateInfo",
        3: "askQuestion",
        4: "distress",
        5: "aiAssistance",
        6: "settings",
        0: "welcome",
      },
    },

    // 🟢 Registration Flow
    registration: {
      text: `CON ${t("registration.title", {}, locale)}
    1. ${t("registration.pregnant", {}, locale)}
    2. ${t("registration.mother", {}, locale)}
    0. ${t("common.go_back", {}, locale)}
    `,
      options: {
        1: "regStepName",
        2: "regStepName",
        0: "main",
      },
    },

    regStepName: {
      text: `CON ${t("registration.step_name", {}, locale)}`,
      options: {
        "*": "regStepId",
      },
      acceptsInput: true,
    },

    regStepId: {
      text: `CON ${t("registration.step_id", {}, locale)}`,
      options: {
        "*": "regStepInsurance",
      },
      acceptsInput: true,
    },

    regStepInsurance: {
      text: `CON ${t("registration.step_insurance", {}, locale)}`,
      options: {
        "*": "regStepLocation",
      },
      acceptsInput: true,
    },

    regStepLocation: {
      text: `CON ${t("registration.step_location", {}, locale)}`,
      options: {
        "*": "regStepPregnancyMonths",
      },
      acceptsInput: true,
    },

    regStepPregnancyMonths: {
      text: `CON ${t("registration.step_pregnancy_months", {}, locale)}`,
      options: {
        "*": "regStepHealthCenter",
      },
      acceptsInput: true,
    },

    regStepHealthCenter: {
      text: `CON ${t("registration.step_health_center", {}, locale)}`,
      options: {
        "*": "regStepConsent",
      },
      acceptsInput: true,
    },

    regStepConsent: {
      text: `CON ${t("registration.confirm_consent", {}, locale)}
    1. ${t("common.confirm", {}, locale)}
    2. ${t("common.cancel", {}, locale)}
    `,
      options: {
        1: "registrationComplete",
        2: "main",
      },
    },

    registrationComplete: {
      text: `END ${t("registration.registration_complete", { id: "12345" }, locale)}`,
      options: {},
    },

    // 🟡 Update Info
    updateInfo: {
      text: `CON ${t("update_info.menu", {}, locale)}`,
      options: {
        1: "updateLocation",
        2: "updateInsurance",
        3: "updateId",
        4: "updateHealthCenter",
        5: "updatePregnancyMonths",
        6: "main",
      },
    },

    updateLocation: {
      text: `CON ${t("update_info.update_location", {}, locale)}`,
      options: {
        "*": "updateSuccess",
      },
      acceptsInput: true,
    },

    updateInsurance: {
      text: `CON ${t("update_info.update_insurance", {}, locale)}
    1. ${t("common.confirm", {}, locale)}
    2. ${t("common.cancel", {}, locale)}
    `,
      options: {
        1: "updateSuccess",
        2: "main",
      },
    },

    updateId: {
      text: `CON ${t("update_info.update_id", {}, locale)}`,
      options: {
        "*": "updateSuccess",
      },
      acceptsInput: true,
    },

    updateHealthCenter: {
      text: `CON ${t("update_info.update_health_center", {}, locale)}`,
      options: {
        "*": "updateSuccess",
      },
      acceptsInput: true,
    },

    updatePregnancyMonths: {
      text: `CON ${t("update_info.update_pregnancy_months", {}, locale)}`,
      options: {
        "*": "updateSuccess",
      },
      acceptsInput: true,
    },

    updateSuccess: {
      text: `END ${t("update_info.update_success", {}, locale)}`,
      options: {},
    },

    // 🔵 Ask Question
    askQuestion: {
      text: `CON ${t("ai_assistance.custom_prompt", {}, locale)}`,
      options: {
        "*": "aiResponse",
      },
      acceptsInput: true,
    },

    aiResponse: {
      text: `END ${t("ai_assistance.guidance_title", {}, locale)}: ${t("ai_assistance.getting_guidance", {}, locale)}`,
      options: {},
    },

    // 🔴 Distress Alert
    distress: {
      text: `CON ${t("distress.message", {}, locale)}
    1. ${t("distress.confirm", {}, locale)}
    0. ${t("distress.cancel", {}, locale)}
    `,
      options: {
        1: "distressConfirmed",
        0: "main",
      },
    },

    distressConfirmed: {
      text: `END ${t("responses.distress_activated", { reference: "ML123" }, locale)}`,
      options: {},
    },

    // 🟣 AI Health Tips
    aiAssistance: {
      text: `CON ${t("ai_assistance.select_category", {}, locale)}
    1. ${t("ai_assistance.diet", {}, locale)}
    2. ${t("ai_assistance.mental", {}, locale)}
    3. ${t("ai_assistance.child", {}, locale)}
    4. ${t("ai_assistance.consultations", {}, locale)}
    5. ${t("ai_assistance.custom", {}, locale)}
    0. ${t("ai_assistance.go_back", {}, locale)}
    `,
      options: {
        1: "aiResponse",
        2: "aiResponse",
        3: "aiResponse",
        4: "aiResponse",
        5: "askQuestion",
        0: "main",
      },
    },

    // ⚙️ Settings
    settings: {
      text: `CON ${t("settings.title", {}, locale)}
    1. ${t("settings.change_language", {}, locale)}
    2. ${t("settings.terms_of_service", {}, locale)}
    3. ${t("settings.privacy_policy", {}, locale)}
    0. ${t("common.go_back", {}, locale)}
    `,
      options: {
        1: "languages",
        2: "terms",
        3: "privacy",
        0: "main",
      },
    },

    languages: {
      text: `CON ${t("languages.title", {}, locale)}
    1. ${t("languages.english", {}, locale)}
    2. ${t("languages.kinyarwanda", {}, locale)}
    0. ${t("common.go_back", {}, locale)}
    `,
      options: {
        1: "en",
        2: "rw",
        0: "settings",
      },
    },
  };
};

// Default export for backward compatibility
export const ussdMenus = getUssdMenus("en");
