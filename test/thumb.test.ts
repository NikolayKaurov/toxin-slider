import $ from 'jquery';

import Thumb from '../src/thumb';

describe('Thumb test', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div>
        <div class="js-wrapper"></div>
      </div>`;
  });

  test('Thumb creation test', () => {
    const $wrapper = $('.js-wrapper');

    const thumbA = new Thumb({
      $wrapper,
      state: {
        value: 0,
        position: 0,
        isVertical: false,
        hidden: false,
        tooltipIsHidden: false,
      },
    });

    expect($wrapper.html()).toEqual('<div class="toxin-slider__thumb js-toxin-slider__thumb" tabindex="0" style="transform: translateX(0%);"><div class="toxin-slider__thumb-tooltip js-toxin-slider__thumb-tooltip">0</div></div>');
    expect(thumbA.getPosition()).toEqual(0);
    expect(thumbA.getDirection()).toEqual(1);

    const thumbB = new Thumb({
      $wrapper,
      state: {
        value: 17,
        position: 91,
        isVertical: true,
        hidden: true,
        tooltipIsHidden: true,
      },
    });

    expect($wrapper.html()).toEqual('<div class="toxin-slider__thumb js-toxin-slider__thumb" tabindex="0" style="transform: translateX(0%);"><div class="toxin-slider__thumb-tooltip js-toxin-slider__thumb-tooltip">0</div></div><div class="toxin-slider__thumb js-toxin-slider__thumb toxin-slider__thumb_hidden" tabindex="0" style="transform: translateY(91%);"><div class="toxin-slider__thumb-tooltip js-toxin-slider__thumb-tooltip toxin-slider__thumb-tooltip_hidden">17</div></div>');
    expect(thumbB.getPosition()).toEqual(91);
    expect(thumbB.getDirection()).toEqual(1);
  });

  test('Thumb update test', () => {
    const $wrapper = $('.js-wrapper');

    const thumb = new Thumb({
      $wrapper,
      state: {
        value: 0,
        position: 0,
        isVertical: false,
        hidden: false,
        tooltipIsHidden: false,
      },
    });

    const $thumb = $('.js-toxin-slider__thumb');
    const $tooltip = $('.js-toxin-slider__thumb-tooltip');

    const value = Math.round(Math.random() * 100);
    const position = Math.round(Math.random() * 100);
    const isVertical = Math.round(Math.random()) === 0;
    const axis = isVertical ? 'Y' : 'X';
    const hidden = Math.round(Math.random()) === 0;
    const tooltipIsHidden = Math.round(Math.random()) === 0;

    thumb.update({
      value,
      position,
      isVertical,
      hidden,
      tooltipIsHidden,
    });

    expect($tooltip.text()).toEqual(value.toString(10));
    expect($thumb.css('transform')).toEqual(`translate${axis}(${position}%)`);
    expect($thumb.hasClass('toxin-slider__thumb_hidden')).toEqual(hidden);
    expect($tooltip.hasClass('toxin-slider__thumb-tooltip_hidden')).toEqual(tooltipIsHidden);
  });
});
