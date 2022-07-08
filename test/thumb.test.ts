import $ from 'jquery';

import Thumb from '../src/thumb';

describe('Thumb test', () => {
  test('Thumb creation test', () => {
    const thumb = new Thumb({
      $wrapper: $(),
      state: {
        value: 0,
        position: 0,
        isVertical: false,
        hidden: false,
        tooltipIsHidden: false,
      },
    });

    expect(thumb.state).toEqual({
      value: 0,
      position: 0,
      isVertical: false,
      hidden: false,
      tooltipIsHidden: false,
    });
  });
});
