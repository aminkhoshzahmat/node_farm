const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
/**
 * DATA: for testing purpose
 */
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

/**
 * Validation
 */
exports.checkID = (req, res, next, val) => {
  console.log(`Validation checked for ${val}`);
  if (req.params.id * 1 > tours.length) {
    // don't forget to return
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }
  next();
};

/**
 * Middleware for aliasing
 */
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

/**
 * Route Handlers
 */
exports.getAllTours = catchAsync(async (req, res, next) => {
  // Create the query
  const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
  // Execute the query
  const tours = await features.query; // execute the query

  res.status(200).json({
    status: 'success',
    results: tours.length, // It's not in JSend specification, but helps when we are dealing with arrays
    requestedAt: req.zart,
    data: {
      tours,
    },
  });
});

/**
 * Async & Await video 88 > 04:00
 * instead of `Tour.create({}).then` which returns a promise,
 * we can put async at the beginning of the function and put await behind the `await Tour.create({})`
 * NOTE:
 * - To catch errors for async/await we should use try & catch
 * - Everything in req. body that is not related to our schema (tour) will not save and will ignored.
 * - Validation works behind the scene because of our schema
 * - We need next here because of error handler.
 */
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    date: {
      tour: newTour,
    },
  });
});

/**
 * req.body > what we sent through postman
 * req.params > what we get from route like :id
 */
exports.getTour = catchAsync(async (req, res, next) => {
  // Tour.findOne({_id: req.params.id})
  const tour = await Tour.findById(req.params.id); // a shorter way of findOne
  res.status(200).json({
    status: 'success',
    date: {
      tour: tour,
    },
  });
});

/**
 * With {new: true} > we return the updated document
 * Note: runValidators > Can check like maxlength,... (Validations)
 */
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return the modified document rather than the original.
    runValidators: true, // Mongoose also supports validation for update(), updateOne(), updateMany(), and findOneAndUpdate()
  });
  res.status(201).json({
    status: 'success',
    date: {
      tour,
      // tour: tour, // Thanks to ES6 > short string is enough
    },
  });
});

/**
 * 204 returns nothing
 */
exports.deleteTour = catchAsync(async (req, res, next) => {
  // In RESTful API, it's a common practice not to send back any data.
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

/**
 * Select all by difficulty which is not easy and average is more than 4.5 and sort by avgPrice
 */
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: '$difficulty',
        // _id: '$ratingAverage',
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $avg: '$price' },
        maxPrice: { $avg: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    {
      $match: { _id: { $ne: 'EASY' } },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: stats,
  });
});

/**
 * How many tours there are for each of the month in a given year
 * @param req
 * @param res
 */
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numToursStarts: 1 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    data: {
      plan,
    },
  });
});

// NOTE: Instead of adding all these functions one by one, we can use 'exports.function name' behind each function
