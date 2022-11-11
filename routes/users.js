const express = require('express'); // Import express
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/users'); // Import users controller
const User = require('../models/User'); // Import User model
const advancedResults = require('../middleware/advancedResults'); // Import advancedResults middleware
const { protect, authorize } = require('../middleware/auth'); // Import protect and authorize middleware

const router = express.Router({ mergeParams: true }); // Create a router

router.use(protect); // Use protect middleware
router.use(authorize('admin')); // Use authorize middleware

router.route('/').get(advancedResults(User), getUsers).post(createUser); // GET /api/v1/auth/users, POST /api/v1/auth/users

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser); // GET /api/v1/auth/users/:id, PUT /api/v1/auth/users/:id, DELETE /api/v1/auth/users/:id

module.exports = router; // Export the router
