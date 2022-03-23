const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
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
exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

/**
 * Async & Await video 88 > 04:00
 * instead of `Tour.create({}).then` which returns a promise,
 * we can put async at the beginning of the function and put await behind the `await Tour.create({})`
 * NOTE:
 * - To catch errors for async/await we should use try & catch
 * - Everything in req.body that is not related to our schema (tour) will not save and will ignored.
 * - Validation works behind the scene because of our schema
 *
 */
exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save(); // an easier way is create() method

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      date: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
      // message: 'Invalid data sent',
    });
  }
};

/**
 * req.body > what we sent through postman
 * req.params > what we get from route like :id
 */
exports.getTour = async (req, res) => {
  try {
    // Tour.findOne({_id: req.params.id})
    const tour = await Tour.findById(req.params.id); // a shorter way of findOne
    res.status(200).json({
      status: 'success',
      date: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

/**
 * With {new: true} > we return the updated document
 */
exports.updateTour = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

/**
 * 204 returns nothing
 */
exports.deleteTour = async (req, res) => {
  try {
    // In RESTful API, it's a common practice not to send back any data.
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err,
    });
  }
};

/**
 * Select all by difficulty which is not easy and average is more than 4.5 and sort by avgPrice
 */
exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err,
    });
  }
};

/**
 * How many tours there are for each of the month in a given year
 * @param req
 * @param res
 */
exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// NOTE: Instead of adding all these functions one by one, we can use 'exports.function name' behind each function
