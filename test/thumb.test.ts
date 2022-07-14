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
        tooltipHidden: false,
      },
    });

    expect($wrapper.html()).toEqual('<div class="toxin-slider__thumb js-toxin-slider__thumb" tabindex="0" style="transform: translateX(-100%);"><div class="toxin-slider__thumb-tooltip js-toxin-slider__thumb-tooltip">0</div></div>');
    expect(thumbA.getPosition()).toEqual(0);
    expect(thumbA.getDirection()).toEqual(0);

    const thumbB = new Thumb({
      $wrapper,
      state: {
        value: 17,
        position: 91,
        isVertical: true,
        hidden: true,
        tooltipHidden: true,
      },
    });

    expect($wrapper.html()).toEqual('<div class="toxin-slider__thumb js-toxin-slider__thumb" tabindex="0" style="transform: translateX(-100%);"><div class="toxin-slider__thumb-tooltip js-toxin-slider__thumb-tooltip">0</div></div><div class="toxin-slider__thumb js-toxin-slider__thumb toxin-slider__thumb_hidden" tabindex="0" style="transform: translateY(-91%);"><div class="toxin-slider__thumb-tooltip js-toxin-slider__thumb-tooltip toxin-slider__thumb-tooltip_hidden">17</div></div>');
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
        tooltipHidden: false,
      },
    });

    const { $thumb, $tooltip } = thumb;

    for (let i = 0; i < 10; i += 1) {
      const value = Math.round(Math.random() * 100);
      const position = Math.round(Math.random() * 100);
      const isVertical = Math.round(Math.random()) === 0;
      const axis = isVertical ? 'Y' : 'X';
      const hidden = Math.round(Math.random()) === 0;
      const tooltipHidden = Math.round(Math.random()) === 0;

      thumb.update({
        value,
        position,
        isVertical,
        hidden,
        tooltipHidden,
      });

      expect($tooltip.text()).toEqual(value.toString(10));
      expect($thumb.css('transform')).toEqual(`translate${axis}(${
        axis === 'X' ? position - 100 : -position
      }%)`);
      expect($thumb.hasClass('toxin-slider__thumb_hidden')).toEqual(hidden);
      expect($tooltip.hasClass('toxin-slider__thumb-tooltip_hidden')).toEqual(tooltipHidden);
    }
  });
});

describe('Thumb drag test', () => {
  const wrapperSizeX = 100;
  const wrapperSizeY = 100;

  const $wrapper = $('<div></div>')
    .css({
      width: `${wrapperSizeX}px`,
      height: `${wrapperSizeY}px`,
    });
  $('body').append($wrapper);

  const state = {
    value: 0,
    position: 0,
    isVertical: false,
    hidden: false,
    tooltipHidden: false,
  };

  const draggingThumb = new Thumb({ $wrapper, state });
  const { $thumb: $draggingThumb } = draggingThumb;

  const update = () => draggingThumb.update(state);
  $wrapper.on('toxin-slider.thumb.drag', update);

  const event = $.Event('mousedown');

  beforeEach(() => {
    event.type = 'mousedown';
    event.clientX = wrapperSizeX;
    event.clientY = wrapperSizeY;

    $draggingThumb.trigger(event);

    event.type = 'mousemove';
  });

  afterEach(() => {
    event.type = 'mouseup';
    $draggingThumb.trigger(event);
  });

  test('Thumb simple horizontal drag test', () => {
    for (let i = 0; i < 3; i += 1) {
      const position = Math.round(Math.random() * 100);

      event.clientX = wrapperSizeX + position * (wrapperSizeX / 100);
      $draggingThumb.trigger(event);

      expect(draggingThumb.getPosition()).toEqual(position);
      expect($draggingThumb.css('transform')).toEqual(`translateX(${position - 100}%)`);
    }
  });

  test('Thumb horizontal drag over left border test', () => {
    event.clientX = wrapperSizeX / 2;
    $draggingThumb.trigger(event);

    expect(draggingThumb.getPosition()).toEqual(0);
    expect($draggingThumb.css('transform')).toEqual('translateX(-100%)');
  });

  test('Thumb horizontal drag over right border test', () => {
    event.clientX = wrapperSizeX * 3;
    $draggingThumb.trigger(event);

    expect(draggingThumb.getPosition()).toEqual(100);
    expect($draggingThumb.css('transform')).toEqual('translateX(0%)');
  });

  test('Thumb simple vertical drag test', () => {
    state.isVertical = true;

    for (let i = 0; i < 3; i += 1) {
      const position = Math.round(Math.random() * 100);

      event.clientY = 2 * wrapperSizeY - position * (wrapperSizeY / 100);
      $draggingThumb.trigger(event);

      expect(draggingThumb.getPosition()).toEqual(position);
      expect($draggingThumb.css('transform')).toEqual(`translateY(${-position}%)`);
    }
  });

  test('Thumb vertical drag over top border test', () => {
    state.isVertical = true;

    event.clientY = wrapperSizeY / 2;
    $draggingThumb.trigger(event);

    expect(draggingThumb.getPosition()).toEqual(100);
    expect($draggingThumb.css('transform')).toEqual('translateY(-100%)');
  });

  test('Thumb vertical drag over bottom border test', () => {
    state.isVertical = true;

    event.clientY = wrapperSizeY * 3;
    $draggingThumb.trigger(event);

    expect(draggingThumb.getPosition()).toEqual(0);
    expect($draggingThumb.css('transform')).toEqual('translateY(0%)');
  });
});
