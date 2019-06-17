import { createElement } from 'cba';

describe('createElement', () => {
  it('should construct an element object from a function, props, and children', () => {
    const Foo = () => undefined;

    const children = [
      createElement<{}>(() => undefined, { bar: '456' }),
      createElement<{}>(() => undefined, { baz: '789' }),
    ];

    expect(createElement(Foo, { foo: '123' }, ...children)).toEqual({
      type: Foo,
      props: {
        foo: '123',
        children,
      },
    });
  });
});
