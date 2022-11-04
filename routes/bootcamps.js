const express = require('express'); // Import express
const router = express.Router(); // Create router
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
} = require('../controllers/bootcamps'); // Import bootcamps controller

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius); // Get bootcamps within a radius

router.route('/').get(getBootcamps).post(createBootcamp); // Create routes for get all bootcamps and create new bootcamp
router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp); // Create routes for get single bootcamp, update bootcamp, and delete bootcamp

module.exports = router;
