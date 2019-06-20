import {
  flatten,
  isElementArray,
  isNodeArray,
  shallowCompare,
} from '../../src/internal/utils';

describe('isElementArray', () => {
  it('should return true if the input is an array', () => {
    expect(isElementArray([])).toBe(true);
  });

  it('should return false if the input is not an array', () => {
    expect(isElementArray(undefined)).toBe(false);
  });
});

describe('isNodeArray', () => {
  it('should return true if the input is an array', () => {
    expect(isNodeArray([])).toBe(true);
  });

  it('should return false if the input is not an array', () => {
    expect(isNodeArray(undefined)).toBe(false);
  });
});

describe('flatten', () => {
  it('should flatten any depth of arrays into a single array', () => {
    const nestedArrays = ['foo', 'bar', [['baz']], ['123', ['456', ['789']]]];

    expect(flatten(nestedArrays)).toEqual([
      'foo',
      'bar',
      'baz',
      '123',
      '456',
      '789',
    ]);
  });
});

describe('shallowCompare', () => {
  it('should return false when 2 objects share the same values', () => {
    expect(shallowCompare({ foo: 'bar' }, { foo: 'bar' })).toBe(false);
  });

  it('should return true when an objects value differs', () => {
    expect(shallowCompare({ foo: 'bar' }, { foo: 'baz' })).toBe(true);
  });

  it('should return true when the second object is missing a key', () => {
    expect(shallowCompare<{}>({ foo: 'bar', baz: null }, { foo: 'bar' })).toBe(
      true
    );
  });

  it('should return true when the first object is missing a key', () => {
    expect(shallowCompare<{}>({ foo: 'bar' }, { foo: 'bar', baz: null })).toBe(
      true
    );
  });
});
