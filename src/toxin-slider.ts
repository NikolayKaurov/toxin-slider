import $ from 'jquery';

import Thumb from './thumb';
import ProgressBar from './progress-bar';

const toxinSliderHTML = '<div class="toxin-slider"></div>';
const innerWrapperHTML = '<div class="toxin-slider__inner-wrapper"></div>';

$.fn.toxinSlider = function toxinSlider(this: JQuery): JQuery {
  const $innerWrapper = $(innerWrapperHTML);

  const stateA = {
    value: 75,
    position: 75,
    isVertical: false,
    hidden: false,
    tooltipIsHidden: false,
  };

  const thumbA = new Thumb({
    state: stateA,
    $wrapper: $innerWrapper,
  });

  const stateB = { ...stateA };
  stateB.position = 25;
  stateB.value = 25;

  const thumbB = new Thumb({
    state: stateB,
    $wrapper: $innerWrapper,
  });

  const progressBar = new ProgressBar({
    $wrapper: $innerWrapper,
    state: {
      min: stateB.position,
      // min: 0,
      max: stateA.position,
      isVertical: false,
      hidden: false,
    },
  });

  const $toxinSlider = $(toxinSliderHTML).append($innerWrapper);

  $innerWrapper.on('toxin-slider.thumb.drag', update);

  $toxinSlider.on('mousedown', () => console.log('MOUSE!'));

  function update() {
    thumbA.update(stateA);
    thumbB.update(stateB);
    progressBar.update({
      min: thumbB.getPosition(),
      // min: 0,
      max: thumbA.getPosition(),
      // min: 0,
      // max: 10,
      isVertical: false,
      hidden: false,
    });
  }

  return this.append($toxinSlider);
};
