// No build process or `npm install` for now, just copy into your project.
import shallowEqual from "react-pure-render/shallowEqual";

// Make a freezer function that will cache its last results.
function makeFreezer() {
  if (process.env.NODE_ENV === "development") {
    var lastObj,
      lastFrozen,
      name = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0],
      serializeTime = 0;
  }

  return function (obj) {
    if (process.env.NODE_ENV === "development") {
      var logActions = false;

      if (shallowEqual(lastObj, obj)) {
        logActions && console.log('+1 cached ' + name);
        return lastFrozen;
      }
      var startTime = new Date();
      var clone = JSON.parse(JSON.stringify(obj));
      var elapsed = new Date().getTime() - startTime.getTime();
      logActions && console.log("FREEZE " + name + ": freezing took " + elapsed);
      serializeTime += elapsed;
      var frozen = Object.freeze(clone);
      lastObj = obj;
      lastFrozen = frozen;

      return frozen;
    }
    return obj;
  }
}

module.exports = makeFreezer;