const express = require('express'); // Import express
const dotenv = require('dotenv'); // Import dotenv
const colors = require('colors'); // Import colors

// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express(); // Create express app

// Body parser
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Run server
app.listen(process.env.PORT, () => {
  console.log(
    colors.red.underline(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
  );
});
