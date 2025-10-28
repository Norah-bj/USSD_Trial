// src/controllers/testSMSController.js
import { sendSMS } from "../services/smsService.js";
import { SMS_CONFIG, EMERGENCY_TYPES, SMS_TEMPLATES } from "../config/constants.js";

/**
 * Test endpoint to send a custom SMS
 * POST /test/send-sms
 * Body: { phoneNumber: "+250788123456", message: "Your message here" }
 */
export const testSendSMS = async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ success: false, error: "Phone number is required" });
    }
    if (!message) {
      return res.status(400).json({ success: false, error: "Message is required" });
    }

    const result = await sendSMS(phoneNumber, message, SMS_CONFIG.SENDER_ID);

    return res.status(result.success ? 200 : 500).json({
      success: result.success,
      message: result.success ? "SMS sent successfully" : "Failed to send SMS",
      data: result.data || result.error,
    });
  } catch (error) {
    console.error("Error in testSendSMS:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Test endpoint to send a predefined emergency confirmation SMS
 * POST /test/send-emergency-sms
 * Body: { phoneNumber: "+250788123456", type: "pregnant" }
 */
export const testEmergencySMS = async (req, res) => {
  try {
    const { phoneNumber, type = "pregnant" } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ success: false, error: "Phone number is required" });
    }

    const emergencyType = EMERGENCY_TYPES[type.toUpperCase()] || type;
    const referenceId = `ML${Date.now().toString().slice(-8)}`; // Example: ML12345678
    const message = SMS_TEMPLATES.EMERGENCY_CONFIRMATION(emergencyType, referenceId);

    const result = await sendSMS(phoneNumber, message, SMS_CONFIG.SENDER_ID);

    return res.status(result.success ? 200 : 500).json({
      success: result.success,
      message: result.success ? "Emergency SMS sent successfully" : "Failed to send emergency SMS",
      referenceId,
      data: result.data || result.error,
    });
  } catch (error) {
    console.error("Error in testEmergencySMS:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Test endpoint to send a distress alert SMS
 * POST /test/send-distress-sms
 * Body: { phoneNumber: "+250788123456", location: "Kigali, Rwanda" }
 */
export const testDistressSMS = async (req, res) => {
  try {
    const { phoneNumber, location = "Unknown Location" } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ success: false, error: "Phone number is required" });
    }

    const message = SMS_TEMPLATES.DISTRESS_ALERT(location);
    const result = await sendSMS(phoneNumber, message, SMS_CONFIG.SENDER_ID);

    return res.status(result.success ? 200 : 500).json({
      success: result.success,
      message: result.success ? "Distress SMS sent successfully" : "Failed to send distress SMS",
      data: result.data || result.error,
    });
  } catch (error) {
    console.error("Error in testDistressSMS:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
