import $ from 'jquery';
import BigNumber from 'bignumber.js';

import Bar from '../src/bar';

describe('Bar test', () => {
  const sizeX = new BigNumber(100);
  const sizeY = new BigNumber(150);

  const $wrapper = $('<div></div>');

  const bar = new Bar({ $wrapper, isVertical: false });

  $('body').append($wrapper);

  test('Bar creation test', () => {
    expect($wrapper.html()).toEqual('<div class="toxin-slider__bar"></div>');
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
    const thumbLength = new BigNumber(16);
    const halfThumbLength = thumbLength.dividedBy(2);

    bar.$bar.css({
      width: `${sizeX.toNumber()}px`,
      height: `${sizeY.toNumber()}px`,
    });

    const clickPointX = Math.round(Math.random() * sizeX.toNumber());
    const clickPointY = Math.round(Math.random() * sizeY.toNumber());

    const triggerEvent = $.Event('mousedown');
    triggerEvent.clientX = clickPointX;
    triggerEvent.clientY = sizeY.toNumber() - clickPointY;

    let receivedMessage: BarMessage = {
      typeMessage: 'barMessage',
      size: new BigNumber(-1),
      clickPoint: new BigNumber(-1),
    };

    $wrapper.on('toxin-slider.update', handleBarClicking);

    function handleBarClicking(event: JQuery.TriggeredEvent, message: BarMessage) {
      receivedMessage = message;
    }

    bar.update(false);
    bar.$bar.trigger(triggerEvent);

    expect(receivedMessage.size.isEqualTo(sizeX.minus(thumbLength))).toEqual(true);
    expect(receivedMessage.clickPoint.isEqualTo(
      normalizeClickPoint(new BigNumber(clickPointX), sizeX),
    )).toEqual(true);

    triggerEvent.clientX = halfThumbLength.minus(1).toNumber();
    bar.$bar.trigger(triggerEvent);

    expect(receivedMessage.clickPoint.isEqualTo(0)).toEqual(true);

    triggerEvent.clientX = sizeX.toNumber();
    bar.$bar.trigger(triggerEvent);

    expect(receivedMessage.clickPoint.isEqualTo(sizeX.minus(thumbLength))).toEqual(true);

    bar.update(true);
    bar.$bar.trigger(triggerEvent);

    expect(receivedMessage.size.isEqualTo(sizeY.minus(thumbLength))).toEqual(true);
    expect(receivedMessage.clickPoint.isEqualTo(
      normalizeClickPoint(new BigNumber(clickPointY), sizeY),
    )).toEqual(true);

    function normalizeClickPoint(point: BigNumber, size: BigNumber): BigNumber {
      if (point.isLessThan(halfThumbLength)) {
        return new BigNumber(0);
      }

      if (point.isGreaterThan(size.minus(halfThumbLength))) {
        return size.minus(thumbLength);
      }

      return point.minus(halfThumbLength);
    }
  });
});
