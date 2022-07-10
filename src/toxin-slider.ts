import $ from 'jquery';

import Thumb from './thumb';

const toxinSliderHTML = '<div class="toxin-slider"></div>';
const innerWrapperHTML = '<div class="toxin-slider__inner-wrapper"></div>';

$.fn.toxinSlider = function toxinSlider(this: JQuery): JQuery {
  const $innerWrapper = $(innerWrapperHTML);

  const state = {
    value: 11,
    position: 0,
    isVertical: false,
    hidden: false,
    tooltipIsHidden: false,
  };

  const thumb = new Thumb({
    state,
    $wrapper: $innerWrapper,
  });

  const $toxinSlider = $(toxinSliderHTML).append($innerWrapper);

  $innerWrapper.on('toxin-slider.thumb.drag', update);

  function update() {
    thumb.update(state);
  }

  return this.append($toxinSlider);
};
