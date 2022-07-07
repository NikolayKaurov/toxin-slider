import $ from 'jquery';

$.fn.toxinSlider = function toxinSlider(this: JQuery): JQuery {
  return this.append('<span class="toxin-slider">toxin-slider</span>');
};
