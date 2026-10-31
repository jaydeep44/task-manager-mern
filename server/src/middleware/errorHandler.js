export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}
export function errorHandler(error, req, res, next) {
  console.error(error);
  if (error.name === "ValidationError") return res.status(400).json({ success: false, message: Object.values(error.errors).map(e => e.message).join(", ") });
  if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid identifier." });
  res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error." });
}
