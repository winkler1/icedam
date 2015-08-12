var deepFreeze, shallowEqual;

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  shallowEqual = require('react-pure-render/shallowEqual');

  deepFreeze = function (obj) {
    var propNames = Object.keys(obj);

    propNames.forEach(function (name) {
      var prop = obj[name];
      if (prop !== null && typeof prop === 'object' && !Object.isFrozen(prop)) {
        deepFreeze(prop);
      }
    });
    Object.freeze(obj);
  };
}

// Make a freezer function that will cache its last results.
/*eslint block-scoped-var:0*/
/*eslint no-console:0*/
export function makeFreezer() {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    var lastInput,
      lastOutput,
      name = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0],
      totalSerializeTime = 0;
  }

  return function (obj) {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      var logActions = false;
      var logger = logActions ? console.log : (() => {});

      if (shallowEqual(lastInput, obj)) {
        logger(`+1 cached ${name}`);
        return lastOutput;
      }
      lastInput = obj;

      // Clone and deep freeze the object.
      var startTime = new Date();
      lastOutput = JSON.parse(JSON.stringify(obj));
      var elapsed = new Date().getTime() - startTime.getTime();
      logger(`FREEZE ${name}: freezing took ${elapsed}`);
      totalSerializeTime += elapsed;
      deepFreeze(lastOutput);

      return lastOutput;
    }
    return obj;
  };
}
