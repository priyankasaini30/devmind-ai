// Central error-handling middleware. Must be registered LAST in app.js,
// after all routes, so Express routes errors here automatically.
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const isOperational = err.isOperational || false;
  
    // Log full detail server-side always; only show safe messages to the client.
    console.error(`[${new Date().toISOString()}] Error:`, err.message);
    if (!isOperational) {
      console.error(err.stack);
    }
  
    res.status(statusCode).json({
      success: false,
      message: isOperational ? err.message : "Something went wrong. Please try again.",
    });
  };
  
  module.exports = errorHandler;