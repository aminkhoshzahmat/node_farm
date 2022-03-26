/**
 * we should return a function, not the execution.
 * express should execute it while route is hitting, so to do that, we make another function
 * then return it.
 * (err) => next(err) ===> simplified to ===> next, because JS give the `err` output to the next input.
 * because async returns a promise, then with catch we can get the errors. (.catch)
 */
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
