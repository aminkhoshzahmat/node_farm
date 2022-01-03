/**
 * Streams
 *      - Used to process (read and write) data piece by piece (chunks), without completing the whole read or write operation, and
 *      therefore without keeping the data in memory.
 *      - Perfect for handling large volumes of dta, for example videos;
 *      - More efficient data processing in terms of memory (no need to keep all data in memory) and time (we don't have to wait
 *        until all the data is available)
 *
 * Note: Streams are instances of the EventEmitter class!
 *
 * Types of streams:
 *      - Readable Streams > Streams from which we can read (consume) data > http requests - event (data, end) - functions (pipe, read)
 *      - Writeable Streams
 *      - Duplex Streams > Streams that are both readable and writeable > net web socket
 *      - Transform Streams > Duplex streams that transform data as it is written or read. > zlip Gzip
 */

const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  // Solution 1, load entire file in memory then it can send the data (we stored it in a variable called data)
  // Problem with this solution is for big files, and ton of request hitting the server.
  //   fs.readFile('test-file.txt', 'utf-8', (err, data) => {
  //     if (err) console.log(err);
  //     res.end(data);
  //   });
  //
  // Solution 2: Streams
  // As we sent each chunk of data, we send it to client as a readable streams.
  // Problem with this approach, our readable stream to read a file from the dist, is much much faster than actually
  // sending the result with the response writeable stream over the network. and this will overwhelm the response stream which can not handle
  // all this incoming data so fast. and this problem called `Back pressure`
  // So in this case, back pressure happens when the response cannot send the data nearly as fast as it is receiving it form the file.
  //   const readable = fs.createReadStream('test-file.txt');
  //   readable.on('data', (chunk) => {
  //     res.write(chunk);
  //   });
  //   readable.on('end', () => {
  //     res.end();
  //   });
  //   readable.on('error', (err) => {
  //     console.log(err);
  //     res.statusCode = 404;
  //     res.end('File not found');
  //   });
  //
  // Solution 3
  // use pipe operator, which is available on all readable streams, and it allows us to pipe the output of a readable stream
  // right into the input of a writeable stream.
  const readable = fs.createReadStream('test-file.txt');
  readable.pipe('output.txt');
});

server.listen(8000, 'localhost', () => {
  console.log('Listening...');
});
