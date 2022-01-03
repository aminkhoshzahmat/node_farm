/**
 *  Node
 *  V8 > V8 is an open-source JavaScript engine developed by the Chromium Project for Google Chrome and Chromium web browsers.
 *  Libuv > libuv is a multi-platform C library that provides support for asynchronous I/O based on event loops.
 *
 * Node.js Process (Instance of a program in execution on a computer)
 *  Single thread (sequence of instructions)
 *    1- Initialize program
 *    2- Execute "top-level" code
 *    3- Require modules
 *    4- Register event callbacks
 *    5- Start Event Loop
 *
 * Thread Pool (provided by libuv)
 *    Where heavy tasks can run (tasks can block the event loop because of their heavy work, so they pass into thread pool)
 *    4 default thread pool > can maximize to 128
 *    Event loop can offloading tasks to thread pool for heavy/expensive tasks (resource intensive)
 *      - File system APIs
 *      - Cryptography
 *      - Compression
 *      - DNS lookups
 *
 *
 * Top-level code, is a code which is not in any callback functions
 *
 *
 *
 * Event Loop (Orchestration, receive event, call their callback function, offload expensive tasks)
 *    All the application code that is inside callback functions (non-top-top-level code)
 *    Node.js is build around callback functions
 *    Event-driven architecture
 *      - Events are emitted
 *      - Event loops picks them up
 *      - Callback are called
 *    EVENT LOOP DOES THE ORCHESTRATION
 *    Makes Asynchronous possible
 *
 * Event Loop in detail (inside event loop, as phases)
 *  START (Each phase has a callback queue, which are the callbacks coming from the events that event loop receives)
 *    Expired timer callbacks (phase 2, takes care of callbacks of expired timers, like setTimeout function)
 *    I/O polling and callbacks
 *    setImmediate callbacks
 *    Close callbacks (shutdown if nothing to do, clean up)
 *      wait for any pending timers or I/O tasks, if none then start exiting, if yes go for another tick (cycle again from top to bottom)
 *    -------------------------------------Exception for all these phases --^
 *      If there are any callbacks in one of these two queues to be processed, they will be executed right after current phase of the event loop finishes,
 *      instead of waiting for the entire loop to finish
 *     - PROCESS.NEXT TICK() "QUEUE" (when we really really need to execute a certain callback right after the current event loop phase)
 *          it's like setImmediate, but setImmediate only run after I/O phase.
 *     - OTHER MICRO TASKS "QUEUE" (Resolved promises)
 *
 * Tick > one cycle of the event loop
 *
 * Don't when using nodejs:
 *  - Don't use sync versions of functions in fs, crypto and zlib modules in your callback functions
 *  - Don't perform complex calculations (e.g. loops inside loops)
 *  - Be careful with JSON in large objects
 *  - Don't use too complex regular expressions (e.g. nested quantifiers)
 *
 * Event > keep observing (observable pattern)
 */

const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 5; // Change pool size

// These 3 can execute at the same time (in no particular order), each time they can be first or second.
// They are not actually in I/O cycle, so it's not running inside of event loop, because it's not running inside of any callback functions.
// These 3 actually have nothing to do with event loop, because they are not actually running inside of event loop just yet.
setTimeout(() => console.log('Timer 1 finished'), 0);
setImmediate(() => console.log('Immediate 1 finished'));
fs.readFile('test-file.txt', 'utf-8', () => {
  // this is the last one, just because of time consuming task.
  console.log('I/O finished');
  console.log('-------------------(till here nothing was in event loop)');

  setTimeout(() => console.log('Timer 2 finished'), 0);
  setTimeout(
    () => console.log('Timer 3 finished - although planned for 3 seconds, but waited for others to complete'),
    3000
  );
  setImmediate(() => console.log('Immediate 2 finished'));

  process.nextTick(() => console.log('Process.nextTick')); // Run Immediately, part of Micro task queue, can run after each phase, not an entire tick

  // Size of the thread pool is 4 by default.
  // add sync to block the execution process, no longer run in event loop, no longer off loaded to the thread pool
  crypto.pbkdf2Sync('password', 'salt', 200000, 1024, 'sha512');
  console.log(Date.now() - start, 'Sync Password encrypted');

  crypto.pbkdf2Sync('password', 'salt', 200000, 1024, 'sha512');
  console.log(Date.now() - start, 'Sync Password encrypted');

  console.log('------------------- finished sync tasks (blocking entire execution');

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password encrypted');
  });
  crypto.pbkdf2('password', 'salt', 200000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password encrypted');
  });
});

console.log('Hello from the top-level code');
