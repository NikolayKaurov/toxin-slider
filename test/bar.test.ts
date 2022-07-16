import $ from 'jquery';

import Bar from '../src/bar';

describe('Bar test', () => {
  const sizeX = 100;
  const sizeY = 150;

  const $wrapper = $('<div></div>');

  const bar = new Bar({ $wrapper, isVertical: false });

  $('body').append($wrapper);

  test('Bar creation test', () => {
    expect($wrapper.html()).toEqual('<div class="toxin-slider__bar js-toxin-slider__bar"></div>');
    expect(typeof bar.update).toBe('function');
  });

  test('Bar update test', () => {
    for (let i = 0; i < 3; i += 1) {
      const isVertical = Math.random() > 0.5;
      bar.update(isVertical);
      expect(bar.isVertical).toEqual(isVertical);
    }
  });

  test('Bar send message about clicking test', () => {
    bar.$bar.css({
      width: `${sizeX}px`,
      height: `${sizeY}px`,
    });

    const clickPointX = Math.round(Math.random() * sizeX);
    const clickPointY = Math.round(Math.random() * sizeY);

    const triggerEvent = $.Event('mousedown');
    triggerEvent.clientX = clickPointX;
    triggerEvent.clientY = sizeY - clickPointY;

    let receivedMessage: BarMessage = {
      size: -1,
      clickPoint: -1,
    };

    $wrapper.on('toxin-slider.update', handleBarClicking);

    function handleBarClicking(event: JQuery.TriggeredEvent, message: BarMessage) {
      receivedMessage = message;
    }

    bar.update(false);
    bar.$bar.trigger(triggerEvent);

    expect(receivedMessage.size).toEqual(sizeX);
    expect(receivedMessage.clickPoint).toEqual(clickPointX);

    bar.update(true);
    bar.$bar.trigger(triggerEvent);

    expect(receivedMessage.size).toEqual(sizeY);
    expect(receivedMessage.clickPoint).toEqual(clickPointY);
  });
});
