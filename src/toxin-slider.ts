import $ from 'jquery';

$.fn.toxinSlider = function toxinSlider(this: JQuery): JQuery {
  return this.append(`
    <div class="toxin-slider">
      <div class="toxin-slider__inner-wrapper">
        <div class="toxin-slider__thumb" style="left: 100%;">
        </div>
      </div>
    </div>
  `);
};
