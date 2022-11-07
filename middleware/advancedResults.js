const advancedResults = (model, populate) => async (req, res, next) => {
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

  // Finding resource
  query = model.find(JSON.parse(queryStr)); // Find coruses from bootcamps

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
  const total = await model.countDocuments(); // Get the total number of bootcamps

  query = query.skip(startIndex).limit(limit); // Skip the start index and limit the number of results

  if (populate) {
    query = query.populate(populate);
  }

  // Execute query
  const results = await query;

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

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
