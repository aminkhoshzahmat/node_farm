/**
 * _ will return last result
 * REPL --> Read Eval Print Loop
 * node > tab > global variables
 * String. > tab > methods
 * add modules (contains many objects, const variable = require('module_name'))
 * In php you got 1 new thread for each user, but in Nodejs we only have 1 thread!!!
 *   This is why we use so many callback functions in Node.js
 * Solution to callback hell: Using promises or Async/Await
 * arrow function `this` keyword points to it's parent, but normal function has it's own `this`
 * nodemon is just a wrapper around `node index.js` command watching *.*
 * we cannot use local dev dependencies in terminal, we have to access them through the npm scripts
 * we can omit the `run` keyword when calling `npm <run> <command>` --> npm start
 * 2 types of packages we can install are simple/regular dependencies OR development dependencies
 */

// Node core modules
const fs = require("fs");
const http = require("http");
const url = require("url");

// Our custom module
const replaceTemplate = require("./modules/replace-template");

// npm packages
const slugify = require("slugify");
// ====================================================
// Files
// Blocking, Synchronous way code execution
// Synchronous means blocking io
// // Asynchronous means non-blocking io !=m  callbacks
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');

// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}. \nCreated on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut)
// console.log('File written!');

// ====================================================
// Files
// Non-Blocking, ASynchronous way code execution

// So Nodejs start to read start.txt file, and when it's done it goes for callback function.
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('Error 🔥!')
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written :D')
//             })
//         });
//     });
// });
// console.log('Will read file!');

// ====================================================
// Http module - SERVER
// Routing is something can be very complicated, we a tool for that called Express, but for simple use we can use `url` module.
// Note: when we use browser, it requests automatically for `/favicon.co`. test http localhost:8000 and browser.
// __dirname --> prints the current directory name
// res.end(value) --> value should be > of type string or an instance of Buffer

// at the first load, block to load all data.
// Keep in mind that if there are 100M time request, then `server` section hits 100M time
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  // Hits every time request send to server
  // const pathname = req.url; // this way we can access to url, but hard to parse qs, here we can use url module to make it easier to use.
  const { query, pathname } = url.parse(req.url, true);

  //Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join(""); // with join makes it a string.
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
  } else {
    // res.writeHead(404); // set http status code
    res.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "hello-world",
    }); // also send headers
    res.end("<h1>Page not  found</h1>");
  }
});
// It goes in event loop, won't give prompt back to you.
server.listen(8000, "localhost", () => {
  console.log("Listening to request on port 8000");
});
