
![](http://c1.staticflickr.com/3/2576/4197921511_bde31964d3_m.jpg)

Friends don't let friends mutate.

### What's This?

Ice Dam: a very lightweight library to freeze data. Data is frozen at the __edge__, where your Flux container sends it to views.

### Why?

To prevent accidental mutation and bugs.

### Show me the code!
For Redux, you wrap a component in a `connect` function. Its first argument is a selector.

```
function mapStateToProps(state)  {
  return {
    products: state.products
  };
}

var App = connect(mapStateToProps)(App)
```

Adding __freeze__ will call `Object.freeze` in development

`npm install --save icedam`

```
import {makeFreezer} from 'icedam';
var freeze = makeFreezer();

function mapStateToProps(state)  {
  return freeze({
    products: state.products
  });
}

var App = connect(mapStateToProps)(App)
```

### Demos
 
![](IceDam.gif)

[Screencast](https://www.youtube.com/watch?v=fPA_u4_iyK8)

### What about an library for immutability?

Using an immutable library means commiting to using it throughout your stack. You'll have to change coding style, teach all your developers, and call `toJS()` when passing data. If your only concern is preventing views from mutating data, that might be too much.

### What about speed?

In production: No cost. No freezing.

In dev (`process.env.NODE_ENV === 'development'`): when data structures change, cloning has a slight cost, usually well under a millisecond.

IceDam only clones objects when they have changed (!shallowEqual).



Image Credit: [skekonk](https://www.flickr.com/photos/skedonk/4197921511/)
