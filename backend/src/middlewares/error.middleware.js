import { error as errorResponse } from '../utils/response.js';

/**
 * Global error handler. Logs error and returns clean message.
 */
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || null;

  // Detailed logging for debugging
  console.error(`Error at ${req.method} ${req.originalUrl}:`, err.stack || err);

  // Use standardized response helper
  return errorResponse(res, message, status, details);
};

export default errorHandler;
