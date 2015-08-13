var makeFreezer;

/* eslint no-inner-declarations:0 */
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  const shallowEqual = require('react-pure-render/shallowEqual');

  function deepFreeze(obj) {
    Object.keys(obj).forEach(function (name) {
      const prop = obj[name];
      if (prop !== null && typeof prop === 'object' && !Object.isFrozen(prop)) {
        deepFreeze(prop);
      }
    });
    Object.freeze(obj);
  }

  function log() {
    // console.log(arguments);
  }

  // Make a freezer function that will cache its last results.
  makeFreezer = function (name = '') {
    var lastInput,
      lastOutput,
      totalSerializeTime = 0;

    return function (obj) {
      if (shallowEqual(lastInput, obj)) {
        log(`+1 cached ${name}`);
        return lastOutput;
      }

      // Clone and deep freeze the object.
      const startTime = new Date();
      lastInput = obj;
      lastOutput = JSON.parse(JSON.stringify(obj));
      const elapsed = new Date().getTime() - startTime.getTime();
      log(`FREEZE ${name}: freezing took ${elapsed}`);
      totalSerializeTime += elapsed;
      deepFreeze(lastOutput);

      return lastOutput;
    };
  };
} else { // PRODUCTION.

  makeFreezer = function () {
    return function (obj) {
      return obj;
    };
  };
}

module.exports = {makeFreezer};

