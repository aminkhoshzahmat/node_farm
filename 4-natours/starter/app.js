const express = require('express');
const fs = require('fs');

const app = express();
/**
 * This is a middleware stands between request and response.
 */
app.use(express.json());
const port = 3000;

/**
 * If no route found, express will handle it with default not route found.
 * Add headers to response like .json --> Content-Type: application/json, X-Powered-By: Express
 */

// app.get('/', (req, res) => {
//   //   res.status(200).send('Hello from the server side');
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length, // It's not in JSend specification, but helps when we are dealing with arrays
    data: {
      tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
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
});

/**
 * /:id/:x/:y?  > with ? we can make a variable optional in URL
 */
app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'tour data',
    },
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
