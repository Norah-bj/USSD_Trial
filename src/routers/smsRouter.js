// src/routes/smsRouter.js
import express from "express";
import {
  handleIncomingSMS,
  handleDeliveryReport,
  sendEmergencyConfirmation,
  sendDistressAlert,
  sendEmergencyUpdate,
  notifyRescueTeam,
  sendWelcomeSMS,
} from "../controllers/smsController.js";

const router = express.Router();

/**
 * Webhook for incoming SMS
 * POST /sms/incoming
 */
router.post("/incoming", handleIncomingSMS);

/**
 * Webhook for delivery reports
 * POST /sms/delivery-report
 */
router.post("/delivery-report", handleDeliveryReport);

/**
 * Optional: test endpoints to manually send SMS from backend
 */
router.post("/emergency-confirmation", async (req, res) => {
  const { phoneNumber, emergencyType, referenceId } = req.body;
  const result = await sendEmergencyConfirmation(phoneNumber, emergencyType, referenceId);
  res.json(result);
});

router.post("/distress-alert", async (req, res) => {
  const { phoneNumber, location } = req.body;
  const result = await sendDistressAlert(phoneNumber, location);
  res.json(result);
});

router.post("/emergency-update", async (req, res) => {
  const { phoneNumber, referenceId, status } = req.body;
  const result = await sendEmergencyUpdate(phoneNumber, referenceId, status);
  res.json(result);
});

router.post("/notify-team", async (req, res) => {
  const { teamNumbers, emergencyType, location, reporterPhone } = req.body;
  const result = await notifyRescueTeam(teamNumbers, emergencyType, location, reporterPhone);
  res.json(result);
});

router.post("/welcome", async (req, res) => {
  const { phoneNumber, name } = req.body;
  const result = await sendWelcomeSMS(phoneNumber, name);
  res.json(result);
});

export default router;
