// src/services/smsServiceHandler.js
import { sendSMS, sendBulkSMS } from "../services/smsService.js";
import { SMS_CONFIG, EMERGENCY_TYPES } from "../config/constants.js";

/**
 * SMS Templates for MotherLink
 */
export const SMS_TEMPLATES = {
  EMERGENCY_CONFIRMATION: (type, referenceId) =>
    `Murakoze! Ikibabaje ${type} cyatanzwe.\nNomero: ${referenceId}\nAbakiza bazaza vuba. Witonde!`,
  DISTRESS_ALERT: (location) =>
    `AKAGA GAKOMEYE! Ubutabazi buza aho uri: ${location || "Unknown"}. Komera kandi witondere.`,
  EMERGENCY_UPDATE: (referenceId, status) =>
    `Ikibabaje cyawe (Nomero: ${referenceId}) cyavuguruwe: ${status}`,
  RESCUE_TEAM_DISPATCH: (type, location, reporterPhone) =>
    `Emergency: ${type} aho: ${location}\nReported by: ${reporterPhone}. Genda ubikemure vuba!`,
  WELCOME: (name) =>
    `Murakaza neza kuri MotherLink, ${name}! Turishimira ko uri kumwe natwe mu gufasha ababyeyi.`,
};

/**
 * Send emergency confirmation SMS to user
 */
export const sendEmergencyConfirmation = async (phoneNumber, emergencyType, referenceId) => {
  try {
    const typeLabel = EMERGENCY_TYPES[emergencyType.toUpperCase()] || emergencyType;
    const message = SMS_TEMPLATES.EMERGENCY_CONFIRMATION(typeLabel, referenceId);
    return await sendSMS(phoneNumber, message, SMS_CONFIG.SENDER_ID);
  } catch (error) {
    console.error("Failed to send emergency confirmation:", error);
    throw error;
  }
};

/**
 * Send distress alert SMS to user
 */
export const sendDistressAlert = async (phoneNumber, location = "Unknown") => {
  try {
    const message = SMS_TEMPLATES.DISTRESS_ALERT(location);
    return await sendSMS(phoneNumber, message, SMS_CONFIG.SENDER_ID);
  } catch (error) {
    console.error("Failed to send distress alert:", error);
    throw error;
  }
};

/**
 * Send emergency status update SMS to user
 */
export const sendEmergencyUpdate = async (phoneNumber, referenceId, status) => {
  try {
    const message = SMS_TEMPLATES.EMERGENCY_UPDATE(referenceId, status);
    return await sendSMS(phoneNumber, message, SMS_CONFIG.SENDER_ID);
  } catch (error) {
    console.error("Failed to send emergency update:", error);
    throw error;
  }
};

/**
 * Notify rescue team via bulk SMS
 */
export const notifyRescueTeam = async (teamNumbers, emergencyType, location, reporterPhone) => {
  try {
    const typeLabel = EMERGENCY_TYPES[emergencyType.toUpperCase()] || emergencyType;
    const message = SMS_TEMPLATES.RESCUE_TEAM_DISPATCH(typeLabel, location, reporterPhone);
    return await sendBulkSMS(teamNumbers, message, SMS_CONFIG.SENDER_ID);
  } catch (error) {
    console.error("Failed to notify rescue team:", error);
    throw error;
  }
};

/**
 * Send welcome SMS to a new user
 */
export const sendWelcomeSMS = async (phoneNumber, name = "User") => {
  try {
    const message = SMS_TEMPLATES.WELCOME(name);
    return await sendSMS(phoneNumber, message, SMS_CONFIG.SENDER_ID);
  } catch (error) {
    console.error("Failed to send welcome SMS:", error);
    throw error;
  }
};

/**
 * Handle incoming SMS (webhook)
 */
export const handleIncomingSMS = async (req, res) => {
  try {
    const { from, to, text, date, id } = req.body;

    console.log("Incoming SMS:", { from, to, text, date, id });

    // TODO: 
    // 1. Parse incoming text to determine USSD command or step
    // 2. Store user message in DB
    // 3. Trigger any appropriate SMS response or USSD flow

    res.status(200).send("SMS received");
  } catch (error) {
    console.error("Error handling incoming SMS:", error);
    res.status(500).send("Error processing SMS");
  }
};

/**
 * Handle SMS delivery reports (webhook)
 */
export const handleDeliveryReport = async (req, res) => {
  try {
    const { id, status, phoneNumber, networkCode, failureReason } = req.body;

    console.log("SMS Delivery Report:", { id, status, phoneNumber, networkCode, failureReason });

    // TODO:
    // 1. Update SMS delivery status in DB
    // 2. Retry failed messages if necessary
    // 3. Log failure reasons for monitoring

    res.status(200).send("Delivery report received");
  } catch (error) {
    console.error("Error handling delivery report:", error);
    res.status(500).send("Error processing delivery report");
  }
};
