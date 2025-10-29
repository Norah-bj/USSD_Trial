// src/services/backendApiService.js
import axios from "axios";
import { BACKEND_API_CONFIG, BACKEND_ENDPOINTS } from "../config/backendApi.js";

// Initialize Axios client
const apiClient = axios.create({
  baseURL: BACKEND_API_CONFIG.BASE_URL,
  timeout: BACKEND_API_CONFIG.TIMEOUT,
  headers: BACKEND_API_CONFIG.HEADERS,
});

// Interceptors (for logging)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      `❌ Response Error: ${error.response?.status || "Network Error"} ${
        error.config?.url
      }`
    );
    return Promise.reject(error);
  }
);

/* -----------------------------------------------------
   👩🏾‍🍼 USER REGISTRATION & PROFILE MANAGEMENT
------------------------------------------------------ */

/**
 * Register a new pregnant user
 * @param {Object} userData
 */
export const registerPregnantUser = async (userData) => {
  try {
    const res = await apiClient.post(
      BACKEND_ENDPOINTS.CREATE_PREGNANT_USER,
      userData
    );
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error registering pregnant user:", error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

/**
 * Register a new mother user
 * @param {Object} userData
 */
export const registerMotherUser = async (userData) => {
  try {
    const res = await apiClient.post(
      BACKEND_ENDPOINTS.CREATE_MOTHER_USER,
      userData
    );
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error registering mother user:", error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

/**
 * Get user info by phone number
 * @param {string} phoneNumber
 */
export const getUser = async (phoneNumber) => {
  try {
    const res = await apiClient.get(BACKEND_ENDPOINTS.GET_USER, {
      params: { phoneNumber },
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error getting user info:", error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

/**
 * Update user information
 * @param {Object} updateData
 */
export const updateUserInfo = async (updateData) => {
  try {
    const res = await apiClient.put(BACKEND_ENDPOINTS.UPDATE_USER_INFO, updateData);
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error updating user info:", error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

/* -----------------------------------------------------
   🚨 EMERGENCY & DISTRESS
------------------------------------------------------ */

export const reportEmergency = async (emergencyData) => {
  try {
    const res = await apiClient.post(
      BACKEND_ENDPOINTS.REPORT_EMERGENCY,
      emergencyData
    );
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error reporting emergency:", error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

export const getEmergencies = async (params = {}) => {
  try {
    const res = await apiClient.get(BACKEND_ENDPOINTS.GET_EMERGENCIES, { params });
    return { success: true, data: res.data?.data || [] };
  } catch (error) {
    console.error("Error fetching emergencies:", error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

export const getEmergencyById = async (emergencyId) => {
  try {
    const res = await apiClient.get(
      `${BACKEND_ENDPOINTS.GET_EMERGENCY_BY_ID}/${emergencyId}`
    );
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error fetching emergency:", error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

export const getUserEmergencies = async (phoneNumber) => {
  try {
    const res = await apiClient.get(BACKEND_ENDPOINTS.GET_USER_EMERGENCIES, {
      params: { phoneNumber },
    });
    return { success: true, data: res.data?.data || [] };
  } catch (error) {
    console.error("Error fetching user emergencies:", error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

export const triggerDistressAlert = async (distressData) => {
  try {
    const res = await apiClient.post(
      BACKEND_ENDPOINTS.TRIGGER_DISTRESS,
      distressData
    );
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error triggering distress:", error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

/* -----------------------------------------------------
   🧠 AI ASSISTANCE
------------------------------------------------------ */

export const getAIGuidance = async (query) => {
  try {
    const res = await apiClient.get(BACKEND_ENDPOINTS.GET_AI_GUIDANCE, {
      params: { query },
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error getting AI guidance:", error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

export const submitCustomQuestion = async (questionData) => {
  try {
    const res = await apiClient.post(
      BACKEND_ENDPOINTS.SUBMIT_CUSTOM_QUESTION,
      questionData
    );
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error submitting custom question:", error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

/* -----------------------------------------------------
   ⚙️ SETTINGS
------------------------------------------------------ */

export const getSettings = async () => {
  try {
    const res = await apiClient.get(BACKEND_ENDPOINTS.GET_SETTINGS);
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error fetching settings:", error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};
