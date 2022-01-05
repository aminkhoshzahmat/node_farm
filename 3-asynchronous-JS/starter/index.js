const fs = require('fs');
const superagent = require('superagent');

// 1. callback hell

// fs.readFile(`${__dirname}/dog.txt`, 'utf-8', (err, data) => {
//   console.log(`Breed: ${data}`);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .end((err, res) => {
//       if (err) return console.log(err.message);
//       console.log(res.body.message);

//       fs.writeFile('dog-img.txt', res.body.message, (err) => {
//         console.log('Random dog image save to file!');
//       });
//      });
// });

// ------------------------------------------------------------------------------
// From callback hell (triangle callbacks) changed to better style with promises
// ------------------------------------------------------------------------------

// Promisify read file function
const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('I could not find that file');
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('could not write to file');
      resolve('success');
    });
  });
};

// callback hell [Solved] with Promisify
/**
readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);
    return writeFilePro('dog-img.txt', res.body.message);
  })
  .then(() => {
    console.log('Random dog image save to file!');
  })
  .catch((err) => {
    console.log(er);
  });
*/

// 3. Much better than promises, we have async / await in ES8
/**
 * It won't block the event loop, and return a promise,
 * inside async function we can have one or more await expression,
 * but we don't have catch for error handling, so we can use try and catch.
 * It helps us to see our code synchronous.
 * It will run in the background.
 * Async function return promise automatically.
 */
// const getDocPic = async () => {
//   try {
//     // await will stop execution at this point to complete this promise is resolved
//     const data = await readFilePro(`${__dirname}/dog.txt`);
//     console.log(`Breed: ${data}`);

//     const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//     console.log(res.body.message);

//     await writeFilePro('dog-img.txt', res.body.message);
//     console.log('Random dog image save to file!');
//   } catch (err) {
//     console.log(err);
//     throw err; // THIS WILL MARK PROMISE AS REJECTED
//   }
//   return '2: READY 🐕';
// };

// console.log('1: Will get dog pics!');
// console.log(getDocPic()); // JS will offload this to the background, and this line return promise because it's async, and it returns promise.
// console.log('2: Done getting dog pics');

// Changed to below ----^

// console.log('1: Will get dog pics!');
// getDocPic()
//   .then((x) => {
//     console.log(x);
//     console.log('3: Done getting dog pics');
//   })
//   .catch((err) => {
//     console.log('Error 🔥');
//   });

// Another solution changed to below -----^

// (async () => {
//   try {
//     console.log('1: Will get dog pics!');
//     const x = await getDocPic();
//     console.log(x);
//     console.log('3: Done getting dog pics');
//   } catch (err) {
//     console.log('Error 🔥');
//   }
// })();

// ==========================================================
// ==========================================================
// ==========================================================
// ==========================================================
// Waiting for Multiple Promises Simultaneously.

const getDocPic = async () => {
  try {
    // await will stop execution at this point to complete this promise is resolved
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const resPro1 = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    const resPro2 = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    const resPro3 = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);

    const all = await Promise.all([resPro1, resPro2, resPro3]);
    const imgs = all.map((el) => el.body.message);
    console.log(imgs);

    await writeFilePro('dog-img.txt', imgs.join('\n'));
    console.log('Random dog image save to file!');
  } catch (err) {
    console.log(err);
    throw err; // THIS WILL MARK PROMISE AS REJECTED
  }
  return '2: READY 🐕';
};

console.log(getDocPic(0));
