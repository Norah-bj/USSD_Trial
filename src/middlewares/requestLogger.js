// src/middlewares/requestLogger.js

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);

  // USSD-specific logging
  if (req.path === "/ussd" && req.body) {
    console.log("📲 USSD Request:", {
      sessionId: req.body.sessionId,
      phoneNumber: req.body.phoneNumber,
      text: req.body.text,
    });
  }

  // You can add more API-specific logs here, e.g., /sms callbacks

  next();
};
