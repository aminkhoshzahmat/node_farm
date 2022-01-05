const express = require('express');

const app = express();
const port = 3000;

/**
 * If no route found, express will handle it with default not route found.
 * Add headers to response like .json --> Content-Type: application/json, X-Powered-By: Express
 */

app.get('/', (req, res) => {
  //   res.status(200).send('Hello from the server side');
  res
    .status(200)
    .json({ message: 'Hello from the server side', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint...');
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
