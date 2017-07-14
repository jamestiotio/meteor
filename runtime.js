require("meteor-babel-helpers");
require("reify/lib/runtime").enable(module.constructor);

require("meteor-promise").makeCompatible(
  global.Promise = global.Promise ||
    require("promise/lib/es6-extensions"),
  require("fibers")
);

// If Promise.asyncApply is defined, use it to wrap calls to
// regeneratorRuntime.async so that the entire async function will run in
// its own Fiber, not just the code that comes after the first await.
if (typeof Promise.asyncApply === "function") {
  var regeneratorRuntime = require("babel-runtime/regenerator");
  var realAsync = regeneratorRuntime.async;
  regeneratorRuntime.async = function (innerFn) {
    return Promise.asyncApply(realAsync, regeneratorRuntime, arguments);
  };
}
