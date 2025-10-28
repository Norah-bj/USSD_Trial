// src/config/backendApi.js
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Backend API Configuration
export const BACKEND_API_CONFIG = {
  BASE_URL: process.env.BACKEND_API_URL || "http://localhost:3000",
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    "Content-Type": "application/json",
  },
};

// Backend API Endpoints for MotherLink
export const BACKEND_ENDPOINTS = {
  // Registration endpoints
  CREATE_PREGNANT_USER: "/ussd/register/pregnant",
  CREATE_MOTHER_USER: "/ussd/register/mother",
  GET_USER: "/ussd/user",
  UPDATE_USER_INFO: "/ussd/update-info",

  // Emergency endpoints
  REPORT_EMERGENCY: "/ussd/report-emergency",
  GET_EMERGENCIES: "/ussd/emergencies",
  GET_USER_EMERGENCIES: "/ussd/user-emergencies",
  GET_EMERGENCY_BY_ID: "/ussd/emergency",

  // Distress endpoints
  TRIGGER_DISTRESS: "/ussd/distress",

  // AI Assistance endpoints
  GET_AI_GUIDANCE: "/ussd/ai-assistance",
  SUBMIT_CUSTOM_QUESTION: "/ussd/ai-assistance/custom-question",

  // Community posts (if needed in future)
  GET_POSTS: "/ussd/posts",
  GET_POST_BY_ID: "/ussd/posts/",

  // Settings & Config endpoints
  GET_SETTINGS: "/ussd/settings",
};
