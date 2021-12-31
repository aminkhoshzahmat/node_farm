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
 */
