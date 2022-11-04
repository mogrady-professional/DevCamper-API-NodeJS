const Bootcamp = require('../models/Bootcamp'); // Bootcamp model
const ErrorResponse = require('../utils/errorResponse'); // Error Handler
const asyncHandler = require('../middleware/async'); // Async handler middleware
const geocoder = require('../utils/geocoder'); // Geocoder

// @desc   Get all bootcamps
// @route  GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query }; // Copy req.query

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  console.log(reqQuery);

  // Create query string
  let queryStr = JSON.stringify(reqQuery); // Convert req.query to a string

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  ); // Replace gt, gte, lt, lte, in with $gt, $gte, $lt, $lte, $in

  console.log(queryStr);

  query = Bootcamp.find(JSON.parse(queryStr)); // Find bootcamps based on the query string

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' '); // Split the fields by commas and join them with a space
    query = query.select(fields); // Select the fields
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' '); // Split the fields by commas and join them with a space
    query = query.sort(sortBy); // Sort the fields
  } else {
    query = query.sort('-createdAt'); // Sort by date created in descending order
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1; // Convert the page to an integer; if it's not a number, default to 1
  const limit = parseInt(req.query.limit, 10) || 25; // Convert the limit to an integer; if it's not a number, default to 25
  const startIndex = (page - 1) * limit; // Calculate the start index
  const endIndex = page * limit; // Calculate the end index
  const total = await Bootcamp.countDocuments(); // Get the total number of bootcamps

  query = query.skip(startIndex).limit(limit); // Skip the start index and limit the number of results

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  const bootcamps = await query; // Execute the query

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

// @desc   Get single bootcamp
// @route  GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  //   console.log(req.params.id); // Log the id to the console

  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    //   return res.status(400).json({ success: false });
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc   Create new bootcamp
// @route  POST /api/v1/bootcamps
// @access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc   Update bootcamp
// @route  PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    //   return res.status(400).json({ success: false });
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc   Delete bootcamp
// @route  DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    //   return res.status(400).json({ success: false });
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});

// @desc  Get bootcamps within a radius
// @route  GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
