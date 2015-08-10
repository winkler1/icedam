import shallowEqual from 'react-pure-render/shallowEqual';

function deepFreeze(obj) {
  var propNames = Object.getOwnPropertyNames(obj);

  propNames.forEach(function (name) {
    var prop = obj[name];
    if (typeof prop === 'object' && !Object.isFrozen(prop)) {
      deepFreeze(prop);
    }
  });
  Object.freeze(obj);
}

// Make a freezer function that will cache its last results.
/*eslint block-scoped-var:0*/
/*eslint no-console:0*/
export function makeFreezer() {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    var lastObj,
      lastFrozen,
      name = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0],
      totalSerializeTime = 0;
  }

  return function (obj) {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      var logActions = false;
      var logger = logActions ? console.log : (() => {});

      if (shallowEqual(lastObj, obj)) {
        logger(`+1 cached ${name}`);
        return lastFrozen;
      }
      lastObj = obj;

      // Clone and deep freeze the object.
      var startTime = new Date();
      lastFrozen = JSON.parse(JSON.stringify(obj));
      var elapsed = new Date().getTime() - startTime.getTime();
      logger(`FREEZE ${name}: freezing took ${elapsed}`);
      totalSerializeTime += elapsed;
      deepFreeze(lastFrozen);

      return lastFrozen;
    }
    return obj;
  };
}
