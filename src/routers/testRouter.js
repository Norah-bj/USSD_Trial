// src/routes/testRouter.js
import express from "express";
import {
  testSendSMS,
  testEmergencySMS,
  testDistressSMS,
} from "../controllers/testController.js";

const router = express.Router();

/**
 * Test sending any custom SMS
 * POST /test/send-sms
 * Body: { phoneNumber, message }
 */
router.post("/send-sms", testSendSMS);

/**
 * Test sending predefined emergency SMS
 * POST /test/send-emergency-sms
 * Body: { phoneNumber }
 */
router.post("/send-emergency-sms", testEmergencySMS);

/**
 * Test sending distress alert SMS
 * POST /test/send-distress-sms
 * Body: { phoneNumber }
 */
router.post("/send-distress-sms", testDistressSMS);

export default router;
