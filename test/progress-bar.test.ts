import $ from 'jquery';

import ProgressBar from '../src/progress-bar';

describe('Progress-bar test', () => {
  const $wrapper = $('<div></div>');
  $('body').append($wrapper);

  beforeEach(() => {
    $wrapper.html('');
  });

  test('Progress-bar creation test', () => {
    const progressBarA = new ProgressBar({
      $wrapper,
      state: {
        min: 62,
        max: 71,
        isVertical: true,
        hidden: true,
      },
    });

    expect($wrapper.html()).toEqual('<div class="toxin-slider__progress-bar toxin-slider__progress-bar_hidden" style="transform: translate(-50%, 29%) scaleY(9%);"></div>');
    expect(progressBarA.$progressBar.css('transform')).toEqual('translate(-50%, 29%) scaleY(9%)');
    expect(progressBarA.$progressBar.hasClass('toxin-slider__progress-bar_hidden')).toEqual(true);
  });

  test('Progress-bar update test', () => {
    const state = {
      min: 0,
      max: 0,
      isVertical: true,
      hidden: true,
    };

    const progressBarB = new ProgressBar({ $wrapper, state });

    for (let i = 0; i < 10; i += 1) {
      state.min = Math.round(Math.random() * 100);
      state.max = Math.round(Math.random() * 100);
      state.hidden = Math.round(Math.random()) === 0;
      state.isVertical = Math.round(Math.random()) === 0;

      const axis = state.isVertical ? 'Y' : 'X';

      if (state.min > state.max) {
        [state.min, state.max] = [state.max, state.min];
      }

      progressBarB.update(state);

      expect(progressBarB.$progressBar.css('transform'))
        .toEqual(`translate(${
          axis === 'X' ? state.min : -50
        }%, ${
          axis === 'X' ? -50 : 100 - state.max
        }%) scale${axis}(${
          state.max - state.min
        }%)`);

      expect(progressBarB.$progressBar.hasClass('toxin-slider__progress-bar_hidden')).toEqual(state.hidden);
    }
  });
});
