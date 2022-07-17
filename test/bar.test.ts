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

  test('Bar send clicking message test', () => {
    /* This constant should be duplicated in the stylesheet ../src/toxin-slider.scss: $thumb-length
    and the file ../src/bar.ts: const thumbLength */
    const thumbLength = 16;
    const halfThumbLength = thumbLength / 2;

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

    expect(receivedMessage.size).toEqual(sizeX - thumbLength);
    expect(receivedMessage.clickPoint).toEqual(normalizeClickPoint(clickPointX, sizeX));

    triggerEvent.clientX = halfThumbLength - 1;
    bar.$bar.trigger(triggerEvent);

    expect(receivedMessage.clickPoint).toEqual(0);

    triggerEvent.clientX = sizeX;
    bar.$bar.trigger(triggerEvent);

    expect(receivedMessage.clickPoint).toEqual(sizeX - thumbLength);

    bar.update(true);
    bar.$bar.trigger(triggerEvent);

    expect(receivedMessage.size).toEqual(sizeY - thumbLength);
    expect(receivedMessage.clickPoint).toEqual(normalizeClickPoint(clickPointY, sizeY));

    function normalizeClickPoint(point: number, size: number): number {
      if (point < halfThumbLength) {
        return 0;
      }

      if (point > size - halfThumbLength) {
        return size - thumbLength;
      }

      return point - halfThumbLength;
    }
  });
});
