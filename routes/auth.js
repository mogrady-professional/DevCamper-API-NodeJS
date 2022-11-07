const express = require('express'); // Import express
const { register } = require('../controllers/auth'); // Import register controller

const router = express.Router(); // Create a router

router.post('/register', register); // POST /api/v1/auth/register

module.exports = router; // Export the router
