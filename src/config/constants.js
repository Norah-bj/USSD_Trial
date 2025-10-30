// Application constants
export const APP_CONFIG = {
  NAME: "MotherLink",
  VERSION: "1.0.0",
  DEFAULT_LANGUAGE: "rw", // Kinyarwanda as default
};

// MotherLink menu options
export const MAIN_MENU = {
  REGISTRATION: 1,
  UPDATE_INFO: 2,
  ASK_QUESTION: 3,
  DISTRESS: 4,
  AI_ASSISTANCE: 5,
  SETTINGS: 6,
  GO_BACK: 0,
};

// Emergency types for mothers
export const EMERGENCY_TYPES = {
  PREGNANT: "pregnant",
  MOTHER: "mother",
  CHILD: "child",
  OTHER: "other",
};

// Emergency type labels
export const EMERGENCY_TYPE_LABELS = {
  1: { type: "pregnant", label: "Umubyeyi utwite" },
  2: { type: "mother", label: "Umubyeyi wabyaye" },
  3: { type: "child", label: "Umwana" },
  4: { type: "other", label: "Ikindi" },
};

// Hotline numbers for further assistance
export const HOTLINES = {
  POLICE: "112",
  FIRE: "111",
  AMBULANCE: "912",
};

// Supported languages
export const LANGUAGES = {
  KINYARWANDA: "rw",
  ENGLISH: "en",
};

// SMS Configuration
export const SMS_CONFIG = {
  SENDER_ID: "MotherLink", // Approved sender ID
  MAX_LENGTH: 160,         // Standard SMS length
  ENABLE_DELIVERY_REPORTS: true,
  SMS_API_URL: process.env.SMS_API_URL || "https://api.africastalking.com/version1/messaging",
  API_KEY: process.env.SMS_API_KEY || "your-africastalking-api-key",
};

export const SMS_TEMPLATES = {
  EMERGENCY: "MotherLink Emergency",
  DISTRESS: "MotherLink Distress Alert",
};

// Session timeout (milliseconds)
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

