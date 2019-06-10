import { isElementArray, isNodeArray } from '../src/utils';

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
