// Custom Logger
// @desc Log request to console
const logger = (req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`.blue
  );
  next();
};

module.exports = logger;
