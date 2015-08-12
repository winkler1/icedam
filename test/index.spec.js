import expect from 'expect';
import assert from 'assert';
import {makeFreezer} from '../src';


describe('Freezer', () => {
  var freeze;
  beforeEach(function () {
    freeze = makeFreezer();
  });

  it('Returns an equivalent, frozen array', function () {
    var input = [1, 2, 3];
    var output = freeze(input);
    expect(input).toNotBe(output);
    expect(input).toEqual(output);
    assert(Object.isFrozen(output));
    expect(()=> output.push(4)).toThrow(TypeError);
    expect(()=> output[0] = 99).toThrow(TypeError);
    expect(()=> output.pop()).toThrow(TypeError);
    expect(()=> output.reverse()).toThrow(TypeError);
  });

  it('Can freeze a big object', function () {
    // Array with 100K elements takes 4 ms to serialize and deserialize.
    var input = [];
    for (var x = 0; x < 10000; ++x) {
      input.push(x);
    }
    var output = freeze(input);
    expect(input).toNotBe(output);
    expect(input).toEqual(output);
    assert(Object.isFrozen(output));
  });

  it('Returns an equivalent, frozen object', function () {
    var input = {a: 1};
    var output = freeze(input);
    expect(input).toNotBe(output);
    expect(input).toEqual(output);
    assert(Object.isFrozen(output));

    expect(()=> output.a = 2).toThrow(TypeError);
    expect(()=> delete output.a).toThrow(TypeError);
  });

  it('Caches result', function () {
    var input = [1, 2, 3];
    var output1 = freeze(input);
    var output2 = freeze(input);
    expect(output1).toEqual(output2);  // objects are equivalent
    assert(output1 === output2);      // ...and same underlying objec.
  });

  it('Strips functions', function () {
    var input = {a: 1, fn: () => 1};
    var output = freeze(input);

    expect(Object.keys(output)).toEqual(['a']);
  });

  it('Handles null', function () {
    var input = {a: null};
    var output = freeze(input);

    expect(Object.keys(output)).toEqual(['a']);
    expect(output.a).toBe(null);
  });

  it('Removes non-enumerable properties', function () {
    var input = {};
    Object.defineProperties(input, {
      a: {enumerable: true, value: 'a'},
      b: {enumerable: false, value: 'b'}
    });
    var output = freeze(input);
    expect(Object.keys(output)).toEqual(['a']);
  });

  it('Handles nested objects', function () {
    var input = {
      person: {
        address: {
          street: '15 Main St',
          city: 'Boston',
          zip: {
            main: '12345',
            '+4': '6789'
          }
        },
        name: {
          first: 'Jacob',
          middle: 'Mr.',
          last: 'Winkler'
        }
      }
    };
    var output = freeze(input);

    expect(output.person.name.first).toEqual('Jacob');
    expect(input).toEqual(output);
    expect(input).toNotBe(output);
  });
});
