
![](http://c1.staticflickr.com/3/2576/4197921511_bde31964d3_m.jpg)

Friends don't let friends mutate.
 
![](IceDam.gif)

![Screencast](https://www.youtube.com/watch?v=fPA_u4_iyK8)

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

```
import makeFreezer from "./freezer";
var freeze = makeFreezer();

function mapStateToProps(state)  {
  return freeze({
    products: state.products
  });
}

var App = connect(mapStateToProps)(App)
```

### What about ImmutableJS?

Sure, you could use a full-blown immutable library. Downsides: you have to use its APIs, which are often awkward.

### What about speed?

In production: Nothing. No freezing.

In dev (`process.env.NODE_ENV === 'development'`): when data structures change, cloning has a slight cost, usually well under a millisecond.



Image Credit: [skekonk](https://www.flickr.com/photos/skedonk/4197921511/)
