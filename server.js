const path = require('path');
const express = require('express'); // Import express
const dotenv = require('dotenv'); // Import dotenv
const colors = require('colors'); // Import colors
const fileupload = require('express-fileupload'); // Import express-fileupload
const cookieParser = require('cookie-parser'); // Import cookie-parser
// Custom Logger
// const logger = require('./middleware/logger'); // Import logger middleware
// Morgan HTTP request logger middleware for node.js
const morgan = require('morgan'); // Import morgan
const errorHandler = require('./middleware/error'); // Import error handler middleware
const connectDB = require('./config/db'); // Import connectDB

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

const app = express(); // Create express app

// Connect to database
connectDB();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Use morgan middleware
  // app.use(logger); // Custom logger middleware
}

// Body parser
app.use(express.json());

// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
console.log(path.join(__dirname, 'public'));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

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
