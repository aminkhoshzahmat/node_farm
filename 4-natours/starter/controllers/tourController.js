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
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  console.log(req.zart);
  res.status(200).json({
    status: 'success',
    results: tours.length, // It's not in JSend specification, but helps when we are dealing with arrays
    requestedAt: req.zart,
    data: {
      tours,
    },
  });
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
      status: 'failed',
      message: 'Invalid data sent',
    });
  }
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1; // convert it to number with * 1
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

exports.updateTour = (req, res) => {
  const tour = tours.find((el) => el.id === req.body.id);
  const duration = req.body.duration;
  const updatedTour = { ...tour, duration };

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'tour data',
    },
  });
};

exports.deleteTour = (req, res) => {
  // const tour = tours.find((el) => el.id === id);
  // const duration = req.body.duration;
  // const updatedTour = { ...tour, duration };

  /**
   * 204 returns nothing
   */
  res.status(204).json({
    status: 'success',
    data: {
      tour: { name: 'amin' },
    },
  });
};

// NOTE: Instead of adding all these functions one by one, we can use 'exports.function name' behind each function
