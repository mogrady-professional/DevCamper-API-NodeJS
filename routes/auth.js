const express = require('express'); // Import express
const { register, login } = require('../controllers/auth'); // Import register controller

const router = express.Router(); // Create a router

router.post('/register', register); // POST /api/v1/auth/register
router.post('/login', login); // POST /api/v1/auth/login

module.exports = router; // Export the router
