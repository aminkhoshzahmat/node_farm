const Tour = require('../models/tourModel');
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
 * Route Handlers
 */
exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query); // Thanks to express!
    // const tours = await Tour.find(req.query); // parameters and args are exactly fit.
    // const tours = await Tour.find(); // find all
    // const tours = await Tour.find({ // how to filter with mongoose
    //   duration: 5,
    //   difficulty: 'easy'
    // });
    // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

    // 1A) Filtering
    const queryObj = { ...req.query }; // shallow copy
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryStr = JSON.parse(queryStr);

    // Create the query
    let query = Tour.find(queryStr); // create query

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy); // sort=price | sort=-price
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Field limiting
    // We can deselect permanently in schema > select: false
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1; // * 1 convert to ing, | default value
    const limit = req.query.limit * 1 || 100; // perPage
    const skip = (page - 1) * limit; // limit
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numTours = Tour.countDocuments(); // return total records
      if (skip >= numTours) throw new Error("This page doesn't exists"); // show in > res.status(404).json
    }

    // Execute the query
    // const query = Tour.find(queryObj); // create query
    const tours = await query; // execute the query
    // query.sort().select().skip().limit()

    // localhost:3000/api/v1/tours?duration[gte]=5&difficulty=easy&page=1
    // { duration: { gte: '5' }, difficulty: 'easy', page: '1' }
    // { difficulty: 'easy', duration: {$gte: 5} }

    // console.log(req.query, queryObj);
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

// NOTE: Instead of adding all these functions one by one, we can use 'exports.function name' behind each function
