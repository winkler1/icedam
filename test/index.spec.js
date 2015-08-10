import expect from 'expect';
import assert from 'assert';
import {makeFreezer} from '../src';

describe('Freezer', () => {
  it('Returns an equivalent, frozen array', function () {
    var freeze = makeFreezer();
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
    var freeze = makeFreezer();
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
    var freeze = makeFreezer();
    var input = {a: 1};
    var output = freeze(input);
    expect(input).toNotBe(output);
    expect(input).toEqual(output);
    assert(Object.isFrozen(output));

    expect(()=> output.a = 2).toThrow(TypeError);
    expect(()=> delete output.a).toThrow(TypeError);
  });

  it('Caches result', function () {
    var freeze = makeFreezer();
    var input = [1, 2, 3];
    var output1 = freeze(input);
    var output2 = freeze(input);
    expect(output1).toEqual(output2);  // objects are equivalent
    assert(output1 === output2);      // ...and same underlying objec.
  });
});
