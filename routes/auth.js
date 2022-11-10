const express = require('express'); // Import express
const { register, login, getMe } = require('../controllers/auth'); // Import register controller
const { protect } = require('../middleware/auth'); // Import protect middleware

const router = express.Router(); // Create a router

router.post('/register', register); // POST /api/v1/auth/register
router.post('/login', login); // POST /api/v1/auth/login
router.get('/me', protect, getMe); // GET /api/v1/auth/me

module.exports = router; // Export the router
