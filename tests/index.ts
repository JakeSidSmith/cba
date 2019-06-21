import * as cba from 'cba';

describe('cba', () => {
  const exportedFunctions = [
    'Canvas',
    'connect',
    'createElement',
    'createStore',
    'render',
  ];

  it(`should export ${exportedFunctions} functions, and a default containing the same functions`, () => {
    expect(Object.keys(cba)).toEqual([...exportedFunctions, 'default']);

    exportedFunctions.forEach(key => {
      expect(typeof (cba as any)[key]).toBe('function');
    });

    expect(typeof cba.default).toBe('object');

    exportedFunctions.forEach(key => {
      expect((cba as any)[key]).toBe((cba.default as any)[key]);
    });
  });
});
