const fs = require('fs');

/**
 * DATA
 */
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

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
 * Create a checkBody middleware
 * Check if body contains the name and price property
 * If not, send back 400 (bad request)
 * Add it to the post handler stack
 */
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  // If everything was ok, then we go to the next middleware.
  next();
};

exports.createTour = (req, res) => {
  console.log(req.body);
  const newID = tours[tours.length - 1].id - 1;
  const newTour = Object.assign({ id: newID }, req.body);
  tours.push(newTour);
  /**
   * - Because we are in callback function, that is going to run in the event loop,
   * so we can never ever block the event loop, so we use writeFile, not writeFileSync.
   * - So we want to pass a callback function that is going to be processed in the background and
   * as soon as it's ready it's going put its event in one of the event loop queue which is going to be handled as soon as event loop passes that phase.
   */
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success',
      date: {
        tour: newTour,
      },
    });
  });
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
