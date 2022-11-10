const express = require('express'); // Import express
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps'); // Import bootcamps controller

const Bootcamp = require('../models/Bootcamp'); // Import Bootcamp model
const advancedResults = require('../middleware/advancedResults'); // Import advancedResults middleware

// Include other resource routers
const courseRouter = require('./courses'); // Import courses router
const router = express.Router(); // Create router

const { protect, authorize } = require('../middleware/auth'); // Import protect middleware

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter); // Use courses router

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius); // Get bootcamps within a radius

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload); // Upload photo for bootcamp

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp); // Get all bootcamps, Create new bootcamp
router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp); // Create routes for get single bootcamp, update bootcamp, and delete bootcamp

module.exports = router;
