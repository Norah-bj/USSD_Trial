// src/middlewares/errorHandler.js

// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error occurred:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
  });

  // Send user-friendly USSD response
  res.status(500).send("END Habaye ikosa. Ongera ugerageze nyuma.");
};

// 404 Not Found handler
export const notFoundHandler = (req, res) => {
  console.warn(`⚠️ 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).send("END Serivisi ntabwo yabonetse.");
};
