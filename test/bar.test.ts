import $ from 'jquery';
import BigNumber from 'bignumber.js';

import Bar from '../src/bar';

describe('Bar', () => {
  const $wrapper = $('<div></div>');

  const bar = new Bar({ $wrapper, isVertical: false });

  $('body').append($wrapper);

  const $bar = $('div.toxin-slider__bar', $wrapper);

  describe('when created', () => {
    test('should append its html-element to the wrapper', () => {
      // expect($wrapper.html()).toEqual('<div class="toxin-slider__bar"></div>');
      expect($bar.length).toEqual(1);
    });

    test('must have a method "update"', () => {
      expect(typeof bar.update).toBe('function');
    });

    test('must have a property "isVertical"', () => {
      expect(typeof bar.isVertical).toBe('boolean');
    });

    test('must store its jquery-object', () => {
      expect(typeof bar.$bar).toBe('object');
    });
  });

  describe('when updated', () => {
    let isVertical = Math.random() > 0.5;

    beforeEach(() => {
      bar.update(isVertical);
    });

    afterEach(() => {
      isVertical = !isVertical;
    });

    test('should update the property "isVertical"', () => {
      expect(bar.isVertical).toEqual(isVertical);
    });

    test('should update the property "isVertical" (repeat with inverted property)', () => {
      expect(bar.isVertical).toEqual(isVertical);
    });
  });

  describe('when clicked on', () => {
    /*  This constant should be duplicated in the stylesheet ../src/toxin-slider.scss: $thumb-length
        and the file ../src/bar.ts: const thumbLength */
    const thumbLength = new BigNumber(16);
    const halfThumbLength = thumbLength.dividedBy(2);

    const sizeX = new BigNumber(100);
    const sizeY = new BigNumber(150);

    const clickPointX = Math.round(Math.random() * sizeX.toNumber());
    const clickPointY = Math.round(Math.random() * sizeY.toNumber());

    const triggerEvent = $.Event('mousedown');

    bar.$bar.css({
      width: `${sizeX.toNumber()}px`,
      height: `${sizeY.toNumber()}px`,
    });

    let receivedMessage: BarMessage = {
      typeMessage: 'barMessage',
      size: new BigNumber(-1),
      clickPoint: new BigNumber(-1),
    };

    $wrapper.on('toxin-slider.update', handleBarClicking);

    describe('in vertical state', () => {
      beforeEach(() => {
        bar.update(true);
      });

      test('should send the correct message if clicked anywhere', () => {
        triggerEvent.clientY = sizeY.toNumber() - clickPointY;
        bar.$bar.trigger(triggerEvent);

        expect(receivedMessage.size.isEqualTo(sizeY.minus(thumbLength))).toEqual(true);
        expect(receivedMessage.clickPoint.isEqualTo(
          normalizeClickPoint(new BigNumber(clickPointY), sizeY),
        )).toEqual(true);
      });

      test('should send the correct message if the click is near the start', () => {
        triggerEvent.clientY = sizeY.minus(halfThumbLength).plus(1).toNumber();
        bar.$bar.trigger(triggerEvent);

        expect(receivedMessage.size.isEqualTo(sizeY.minus(thumbLength))).toEqual(true);
        expect(receivedMessage.clickPoint.isEqualTo(0)).toEqual(true);
      });

      test('should send the correct message if the click is near the end', () => {
        triggerEvent.clientY = 0;
        bar.$bar.trigger(triggerEvent);

        expect(receivedMessage.size.isEqualTo(sizeY.minus(thumbLength))).toEqual(true);
        expect(receivedMessage.clickPoint.isEqualTo(sizeY.minus(thumbLength))).toEqual(true);
      });
    });

    describe('in horizontal state', () => {
      beforeEach(() => {
        bar.update(false);
      });

      test('should send the correct message if clicked anywhere', () => {
        triggerEvent.clientX = clickPointX;
        bar.$bar.trigger(triggerEvent);

        expect(receivedMessage.size.isEqualTo(sizeX.minus(thumbLength))).toEqual(true);
        expect(receivedMessage.clickPoint.isEqualTo(
          normalizeClickPoint(new BigNumber(clickPointX), sizeX),
        )).toEqual(true);
      });

      test('should send the correct message if the click is near the start', () => {
        triggerEvent.clientX = halfThumbLength.minus(1).toNumber();
        bar.$bar.trigger(triggerEvent);

        expect(receivedMessage.size.isEqualTo(sizeX.minus(thumbLength))).toEqual(true);
        expect(receivedMessage.clickPoint.isEqualTo(0)).toEqual(true);
      });

      test('should send the correct message if the click is near the end', () => {
        triggerEvent.clientX = sizeX.toNumber();
        bar.$bar.trigger(triggerEvent);

        expect(receivedMessage.size.isEqualTo(sizeX.minus(thumbLength))).toEqual(true);
        expect(receivedMessage.clickPoint.isEqualTo(sizeX.minus(thumbLength))).toEqual(true);
      });
    });

    function handleBarClicking(event: JQuery.TriggeredEvent, message: BarMessage) {
      receivedMessage = message;
    }

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
