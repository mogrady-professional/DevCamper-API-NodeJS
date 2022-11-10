const express = require('express'); // Import express
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth'); // Import register controller
const { protect } = require('../middleware/auth'); // Import protect middleware

const router = express.Router(); // Create a router

router.post('/register', register); // POST /api/v1/auth/register
router.post('/login', login); // POST /api/v1/auth/login
router.get('/me', protect, getMe); // GET /api/v1/auth/me
router.post('/forgotpassword', forgotPassword); // POST /api/v1/auth/forgotpassword
router.put('/resetpassword/:resettoken', resetPassword); // PUT /api/v1/auth/resetpassword/:resettoken

module.exports = router; // Export the router
