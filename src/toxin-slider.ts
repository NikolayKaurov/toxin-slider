import $ from 'jquery';

// import Thumb from './thumb';

const toxinSliderHTML = '<div class="toxin-slider"></div>';
const innerWrapperHTML = '<div class="toxin-slider__inner-wrapper"></div>';

$.fn.toxinSlider = function toxinSlider(this: JQuery): JQuery {
  const $innerWrapper = $(innerWrapperHTML);
  const $toxinSlider = $(toxinSliderHTML).append($innerWrapper);

  return this.append($toxinSlider);
};
