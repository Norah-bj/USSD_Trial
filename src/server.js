import dotenv from "dotenv";
dotenv.config();

import express from "express";
import ussdRouter from "./routers/ussdRouter.js";
import smsRouter from "./routers/smsRouter.js";
import testRouter from "./routers/testRouter.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
// import { i18n } from "./config/i18n.js";
// import "./config/database.js";


const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "success",
    message: "MotherLink & SMS Server is Running!",
    version: "1.0.0",
    endpoints: {
      ussd: "/ussd",
      sms_incoming: "/sms/incoming",
      sms_delivery: "/sms/delivery-reports",
      test_sms: "/test/send-sms",
      test_emergency: "/test/send-emergency-sms",
      test_distress: "/test/send-distress-sms",
    },
  });
});

// Routers with proper prefixes
app.use("/ussd", ussdRouter);
app.use("/sms", smsRouter);
app.use("/test", testRouter);

// Error handling middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MotherLink Server running on port ${PORT}`);
  console.log(`📱 USSD endpoint: http://localhost:${PORT}/ussd`);
  console.log(`📧 SMS incoming: http://localhost:${PORT}/sms/incoming`);
  console.log(`📊 SMS delivery: http://localhost:${PORT}/sms/delivery-reports`);
  console.log(`🧪 Test SMS endpoints: /test/send-sms, /test/send-emergency-sms, /test/send-distress-sms`);
});

export default app;
