// Express Custom Error Handler
// https://expressjs.com/en/guide/error-handling.html

const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err }; // Copy err object
  error.message = err.message; // Set error message

  // Log to console for dev
  console.log(err.stack.red);
  //   console.log(err.name);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404); // Create a new ErrorResponse object; pass in the message and the status code
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
