/**
 * - Each JavaScript file is treated as a separate module;
 * - Node.js uses the CommonJS module system: require(), exports or module.exports
 * - ES module system is used in browsers: import/export
 * - There have been attempts to bring ES modules to node.js (.mjs)
 *
 *
 * What happens when we require() a Module:
 *  - Resolving & Loading (9.png)
 *  - Wrapping > Node.js runtime takes the code of our module and puts it inside the IIFE (10.png)
 *      - Giving developers access to all these variables (require, __dirname,...)
 *      - It keeps the top-level variables that we define in our modules private, so only scoped only to the current module, instead
 *        of leaking everything into the global object. Each module gets its own scoped variables.
 *  - Execution
 *  - Returning Exports
 *  - Caching
 *      - After the first time they are loaded
 *      - If you require the same module multiple times, you'll always get the same result,
 *        and the code and module is actually only executed in the first call.
 *      - Subsequent require, will load from cache.
 */

/**
 * So this means that we are really in a FUNCTION :D, IIFE
 * There are 5 arguments in IIFE of wrapper function: (10.png)
 *      0: exports
 *      1: require
 *      2: module
 *      3: __filename
 *      4: __dirname
 */
console.log(arguments);
console.log('------------------------');

/**
 * '(function (exports, require, module, __filename, __dirname) { });'
 */
console.log(require('module').wrapper);
console.log('------------------------');

/**
 * module.exports
 */
const C = require('./test-module-1'); // we can drop .js extension.
const calc1 = new C();
console.log(calc1.add(2, 5));

/**
 * exports (just a shorthand of module.exports)
 */
const calc2 = require('./test-module-2');
console.log(calc2.add(3, 9));
console.log(calc2);

// We may not need to require all of the module
// destructuring (es6 feature), names should be exactly like the requiring object
const { add, multiply } = require('./test-module-2');
console.log(add(5, 6));

/**
 * Caching test
 */
require('./test-module-3')();
require('./test-module-3')();
