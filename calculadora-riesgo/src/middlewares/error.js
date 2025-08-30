/**
 * Error handling middleware
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Default error
  let status = 500;
  let message = 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    message = err.message;
  } else if (err.name === 'SyntaxError' && err.status === 400) {
    status = 400;
    message = 'Invalid JSON';
  }

  res.status(status).json({
    message,
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}

/**
 * 404 handler for unmatched routes
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    message: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
}; 