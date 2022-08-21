import $ from 'jquery';
import BigNumber from 'bignumber.js';

import ProgressBar from './Progress-bar';

describe('Progress-bar', () => {
  const $wrapper = $('<div></div>');
  $('body').append($wrapper);

  let min = new BigNumber(62);
  let max = new BigNumber(71);

  if (min.isGreaterThan(max)) {
    [min, max] = [max, min];
  }

  const progressBar = new ProgressBar({
    $wrapper,
    state: {
      min,
      max,
      isVertical: true,
      hidden: true,
    },
  });

  const $progressBar = $('div.js-toxin-slider__progress-bar', $wrapper);

  describe('after creation', () => {
    test('should append its html-element to the wrapper', () => {
      expect($progressBar.length).toEqual(1);
    });

    test('must have a method "update"', () => {
      expect(typeof progressBar.update).toBe('function');
    });
  });

  describe('after update', () => {
    const state: ProgressBarState = {
      min: new BigNumber(Math.round(Math.random() * 100)),
      max: new BigNumber(Math.round(Math.random() * 100)),
      isVertical: Math.round(Math.random()) === 0,
      hidden: Math.round(Math.random()) === 0,
    };

    if (state.min.isGreaterThan(state.max)) {
      [state.min, state.max] = [state.max, state.min];
    }

    let axis = state.isVertical ? 'Y' : 'X';

    beforeEach(() => {
      progressBar.update(state);
    });

    afterEach(() => {
      state.min = new BigNumber(Math.round(Math.random() * 100));
      state.max = new BigNumber(Math.round(Math.random() * 100));
      state.isVertical = !state.isVertical;
      axis = state.isVertical ? 'Y' : 'X';
      state.hidden = !state.hidden;

      if (state.min.isGreaterThan(state.max)) {
        [state.min, state.max] = [state.max, state.min];
      }
    });

    test('should be properly positioned', () => {
      expect($progressBar.css('transform'))
        .toEqual(`translate(${
          axis === 'X' ? state.min.toNumber() : -50
        }%, ${
          axis === 'X' ? -50 : 100 - state.max.toNumber()
        }%) scale${axis}(${
          state.max.minus(state.min).toNumber()
        }%)`);
    });

    test('should be properly positioned on other axis', () => {
      expect($progressBar.css('transform'))
        .toEqual(`translate(${
          axis === 'X' ? state.min.toNumber() : -50
        }%, ${
          axis === 'X' ? -50 : 100 - state.max.toNumber()
        }%) scale${axis}(${
          state.max.minus(state.min).toNumber()
        }%)`);
    });

    test('must appear or hide', () => {
      expect($progressBar.hasClass('toxin-slider__progress-bar_hidden')).toEqual(state.hidden);
    });

    test('must appear or hide (repeated with inversion)', () => {
      expect($progressBar.hasClass('toxin-slider__progress-bar_hidden')).toEqual(state.hidden);
    });
  });
});
