/**
 * Observable pattern
 */

const EventEmitter = require('events');
const http = require('http');

/**
 *  super > when extending a super class, then we get access to all the methods of the parent class.
 */
class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sales();

myEmitter.on('newSale', () => {
  console.log('There was a new sale!');
});

myEmitter.on('newSale', () => {
  console.log('Customer name: Jonas');
});

myEmitter.on('newSale', (stock) => {
  console.log(`There are now ${stock} items left in stock.`);
});

myEmitter.emit('newSale', 9);

////////////////////////////////////////////

const server = http.createServer();

server.on('request', (req, res) => {
  console.log('Request received!');
  console.log(req.url);
  res.end('Request received');
});

server.on('request', (req, res) => {
  console.log('Another request');
});

server.on('close', () => {
  console.log('Server closed');
});

// app won't shutdown, because I/O happening here, event loop won't stop.
server.listen(8000, 'localhost', () => {
  console.log('Waiting for request...');
});
