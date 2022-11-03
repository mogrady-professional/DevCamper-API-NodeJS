const express = require('express'); // Import express
const dotenv = require('dotenv'); // Import dotenv
const colors = require('colors'); // Import colors
// Custom Logger
// const logger = require('./middleware/logger'); // Import logger middleware
// Morgan HTTP request logger middleware for node.js
const morgan = require('morgan'); // Import morgan
const errorHandler = require('./middleware/error'); // Import error handler middleware
const connectDB = require('./config/db'); // Import connectDB

// Load Route files
const bootcamps = require('./routes/bootcamps');

const app = express(); // Create express app

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Use morgan middleware
  // app.use(logger); // Custom logger middleware
}

// Body parser
app.use(express.json());

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

// Use Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Run server
const server = app.listen(process.env.PORT, () => {
  console.log(
    colors.yellow.underline(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
  );

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold.underline);
    // Close server & exit process
    server.close(() => process.exit(1)); // 1 = exit with failure
  });
});
