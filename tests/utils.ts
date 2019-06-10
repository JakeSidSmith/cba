import { flatten, isElementArray, isNodeArray } from '../src/utils';

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
