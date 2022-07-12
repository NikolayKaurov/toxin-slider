import $ from 'jquery';

import Thumb from './thumb';

const toxinSliderHTML = '<div class="toxin-slider"></div>';
const innerWrapperHTML = '<div class="toxin-slider__inner-wrapper"></div>';

$.fn.toxinSlider = function toxinSlider(this: JQuery): JQuery {
  const $innerWrapper = $(innerWrapperHTML);

  const stateA = {
    value: 11,
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

  const thumbB = new Thumb({
    state: stateB,
    $wrapper: $innerWrapper,
  });

  const $toxinSlider = $(toxinSliderHTML).append($innerWrapper);

  $innerWrapper.on('toxin-slider.thumb.drag', update);

  function update() {
    thumbA.update(stateA);
    thumbB.update(stateB);
  }

  return this.append($toxinSlider);
};
