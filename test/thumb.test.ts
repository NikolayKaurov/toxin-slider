import $ from 'jquery';

import Thumb from '../src/thumb';

describe('Thumb setup test', () => {
  const $wrapper = $('<div></div>');
  $('body').append($wrapper);

  beforeEach(() => {
    $wrapper.html('');
  });

  test('Thumb creation test', () => {
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
    expect(thumbA.getDirection()).toEqual(0);

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
    expect(thumbB.getDirection()).toEqual(0);
  });

  test('Thumb update test', () => {
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

    const { $thumb, $tooltip } = thumb;

    for (let i = 0; i < 3; i += 1) {
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
    }
  });
});

describe('Thumb drag test', () => {
  const wrapperSizeX = 100;
  const wrapperSizeY = 100;
  const margin = 100;

  const $wrapper = $('<div></div>')
    .css({
      width: `${wrapperSizeX}px`,
      height: `${wrapperSizeY}px`,
      margin: `${margin}px`,
    });
  $('body').append($wrapper);

  const state = {
    value: 0,
    position: 50,
    isVertical: false,
    hidden: false,
    tooltipIsHidden: false,
  };

  const draggingThumb = new Thumb({ $wrapper, state });
  const { $thumb: $draggingThumb } = draggingThumb;

  const update = () => draggingThumb.update(state);
  $wrapper.on('toxin-slider.thumb.drag', update);

  const event = $.Event('mousedown');

  beforeEach(() => {
    event.type = 'mousedown';
    event.clientX = 100;
    event.clientY = 100;

    $draggingThumb.trigger(event);

    event.type = 'mousemove';
  });

  afterEach(() => {
    event.type = 'mouseup';
    $draggingThumb.trigger(event);
  });

  test('Thumb simple horizontal drag test', () => {
    event.clientX = margin + 27;
    $draggingThumb.trigger(event);

    expect(draggingThumb.getPosition()).toEqual(27);
    expect($draggingThumb.css('transform')).toEqual(`translateX(${27}%)`);
  });
});
