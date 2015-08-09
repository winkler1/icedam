// No build process or `npm install` for now, just copy into your project.
import shallowEqual from "react-pure-render/shallowEqual";

function deepFreeze(obj) {
  var propNames = Object.getOwnPropertyNames(obj);

  propNames.forEach(function (name) {
    var prop = obj[name];
    if (typeof prop == 'object' && !Object.isFrozen(prop))
      deepFreeze(prop);
  });
  Object.freeze(obj);
}

// Make a freezer function that will cache its last results.
function makeFreezer() {
  if (process.env.NODE_ENV === "development") {
    var lastObj,
      lastFrozen,
      name = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0],
      totalSerializeTime = 0;
  }

  return function (obj) {
    if (process.env.NODE_ENV === "development") {
      var logActions = true;

      if (shallowEqual(lastObj, obj)) {
        logActions && console.log('+1 cached ' + name);
        return lastFrozen;
      }
      lastObj = obj;

      // Clone and deep freeze the object.
      var startTime = new Date();
      lastFrozen = JSON.parse(JSON.stringify(obj));
      var elapsed = new Date().getTime() - startTime.getTime();
      logActions && console.log("FREEZE " + name + ": freezing took " + elapsed);
      totalSerializeTime += elapsed;
      deepFreeze(lastFrozen);

      return lastFrozen;
    }
    return obj;
  }
}

module.exports = makeFreezer;