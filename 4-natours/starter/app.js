/**
 * - If no route found, express will handle it with default not route found.
 * - Add headers to response like .json --> Content-Type: application/json, X-Powered-By: Express
 * - /:id/:x/:y?  > with ? we can make a variable optional in URL
 *
 */

/**
 * Require modules
 */
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

/**
 * Setup Server and Middleware,
 * Everything is middleware, event routers
 * All the middlewares together that we use in our app, is called MIDDLEWARE STACK
 */
const app = express();
const port = 3000;

/**
 * Middleware
 */
app.use(express.json()); //  To get access to the request body on the request object, This is a middleware stands between request and response.
app.use(morgan('dev'));

/**
 * - Custom Middleware
 * - Never forget to call next(), because without that response will stop at this moment, it won't pass it to next middleware in Middleware stack.
 * - The priority of middlewares are important, they can run step by step after each other. (e.g. put it after routes.)
 *   because middleware cycle will finish.
 */
app.use((req, res, next) => {
  console.log('hello from middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  req.zart = new Date().toISOString();
  next();
});

/**
 * DATA
 */
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

/**
 * Route Handlers
 */
const getAllTours = (req, res) => {
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

const createTour = (req, res) => {
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

const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1; // convert it to number with * 1
  const tour = tours.find((el) => el.id === id);

  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;
  if (!tours) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid',
    });
  }

  const tour = tours.find((el) => el.id === id);
  const duration = req.body.duration;
  const updatedTour = { ...tour, duration };

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'tour data',
    },
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  if (!tours) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid',
    });
  }

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

/**
 * API Routes
 */
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

/**
 * Start the Server
 */
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
