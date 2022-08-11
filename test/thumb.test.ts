import $ from 'jquery';
import BigNumber from 'bignumber.js';

import Thumb from '../src/thumb';

describe('Thumb', () => {
  const $wrapper = $('<div></div>');
  $('body').append($wrapper);

  const value = new BigNumber(17);
  const position = new BigNumber(91);

  const thumb = new Thumb({
    $wrapper,
    state: {
      value,
      position,
      restriction: new BigNumber(0),
      isVertical: true,
      hidden: true,
      tooltipHidden: true,
      units: 'units',
    },
  });

  const $thumb = $('div.js-toxin-slider__thumb', $wrapper);
  const $tooltip = $('div.js-toxin-slider__thumb-tooltip', $wrapper);

  describe('after creation', () => {
    test('should append its html-element to the wrapper', () => {
      expect($thumb.length).toEqual(1);
    });

    test('must have a method "update"', () => {
      expect(typeof thumb.update).toBe('function');
    });

    test('must be in the correct state', () => {
      expect(thumb.state).toEqual({
        value,
        position,
        isVertical: true,
        hidden: true,
        tooltipHidden: true,
        units: 'units',
      });
    });
  });

  describe('after update', () => {
    const newValue = Math.round(Math.random() * 100);
    const newPosition = Math.round(Math.random() * 100);
    let isVertical = Math.round(Math.random()) === 0;
    let axis = isVertical ? 'Y' : 'X';
    let hidden = Math.round(Math.random()) === 0;
    let tooltipHidden = Math.round(Math.random()) === 0;

    beforeEach(() => {
      thumb.update({
        isVertical,
        hidden,
        tooltipHidden,
        restriction: new BigNumber(0),
        value: new BigNumber(newValue),
        position: new BigNumber(newPosition),
        units: '$',
      });
    });

    afterEach(() => {
      isVertical = !isVertical;
      axis = isVertical ? 'Y' : 'X';
      hidden = !hidden;
      tooltipHidden = !tooltipHidden;
    });

    test('should show value in tooltip', () => {
      expect($tooltip.text()).toEqual(`${newValue}$`);
    });

    test('should be properly positioned', () => {
      expect($thumb.css('transform')).toEqual(`translate${axis}(${
        axis === 'X' ? newPosition - 100 : -1 * newPosition
      }%)`);
    });

    test('should be properly positioned on the other axis', () => {
      expect($thumb.css('transform')).toEqual(`translate${axis}(${
        axis === 'X' ? newPosition - 100 : -1 * newPosition
      }%)`);
    });

    test('should appear or show', () => {
      expect($thumb.hasClass('toxin-slider__thumb_hidden')).toEqual(hidden);
    });

    test('should appear or show (repeat with inversion)', () => {
      expect($thumb.hasClass('toxin-slider__thumb_hidden')).toEqual(hidden);
    });

    test('should hide or show the tooltip', () => {
      expect($tooltip.hasClass('toxin-slider__thumb-tooltip_hidden')).toEqual(tooltipHidden);
    });

    test('should hide or show the tooltip (repeat with inversion)', () => {
      expect($tooltip.hasClass('toxin-slider__thumb-tooltip_hidden')).toEqual(tooltipHidden);
    });
  });

  describe('when dragging with the mouse', () => {
    const wrapperSizeX = 100;
    const wrapperSizeY = 200;

    $wrapper.css({
      width: `${wrapperSizeX}px`,
      height: `${wrapperSizeY}px`,
    });

    const event = $.Event('mousedown');

    const state = { ...thumb.state };
    const thumbValue = state.value.toNumber();

    let receivedMessage: DragMessage = {
      typeMessage: 'dragMessage',
      innerOffset: new BigNumber(NaN),
      wrapperSize: new BigNumber(NaN),
      value: new BigNumber(NaN),
    };

    const update = (triggeredEvent: JQuery.TriggeredEvent, message: DragMessage) => {
      receivedMessage = message;
      thumb.update(state);
    };
    $wrapper.on('toxin-slider.update', update);

    describe('along the horizontal axis', () => {
      const dragPosition = Math.round(Math.random() * 100);

      beforeEach(() => {
        state.isVertical = false;
        thumb.update(state);

        event.type = 'mousedown';
        event.clientX = wrapperSizeX;
        $thumb.trigger(event);
        event.type = 'mousemove';
      });

      afterEach(() => {
        event.type = 'mouseup';
        $thumb.trigger(event);
      });

      test('should be correctly positioned', () => {
        event.clientX = wrapperSizeX + dragPosition * (wrapperSizeX / 100);
        $thumb.trigger(event);

        expect(thumb.getPosition().toNumber()).toEqual(dragPosition);
        expect($thumb.css('transform')).toEqual(`translateX(${dragPosition - 100}%)`);
      });

      test('must send the correct message', () => {
        expect(receivedMessage.typeMessage).toEqual('dragMessage');
        expect(receivedMessage.wrapperSize.toNumber()).toEqual(wrapperSizeX);
        expect(receivedMessage.innerOffset.toNumber()).toEqual(dragPosition * (wrapperSizeX / 100));
        expect(receivedMessage.value.toNumber()).toEqual(thumbValue);
      });

      test('must not cross the left border', () => {
        event.clientX = wrapperSizeX / 2;
        $thumb.trigger(event);

        expect(thumb.getPosition().toNumber()).toEqual(0);
        expect($thumb.css('transform')).toEqual('translateX(-100%)');
      });

      test('must not cross the right border', () => {
        event.clientX = wrapperSizeX * 3;
        $thumb.trigger(event);

        expect(thumb.getPosition().toNumber()).toEqual(100);
        expect($thumb.css('transform')).toEqual('translateX(0%)');
      });
    });

    describe('along the vertical axis', () => {
      const dragPosition = Math.round(Math.random() * 100);

      beforeEach(() => {
        state.isVertical = true;
        thumb.update(state);

        event.type = 'mousedown';
        event.clientY = wrapperSizeY;
        $thumb.trigger(event);
        event.type = 'mousemove';
      });

      afterEach(() => {
        event.type = 'mouseup';
        $thumb.trigger(event);
      });

      test('should be correctly positioned', () => {
        event.clientY = 2 * wrapperSizeY - dragPosition * (wrapperSizeY / 100);
        $thumb.trigger(event);

        expect(thumb.getPosition().toNumber()).toEqual(dragPosition);
        expect($thumb.css('transform')).toEqual(`translateY(${-1 * dragPosition}%)`);
      });

      test('must send the correct message', () => {
        expect(receivedMessage.typeMessage).toEqual('dragMessage');
        expect(receivedMessage.wrapperSize.toNumber()).toEqual(wrapperSizeY);
        expect(receivedMessage.innerOffset.toNumber()).toEqual(dragPosition * (wrapperSizeY / 100));
        expect(receivedMessage.value.toNumber()).toEqual(thumbValue);
      });

      test('must not cross the top border', () => {
        event.clientY = wrapperSizeY / 2;
        $thumb.trigger(event);

        expect(thumb.getPosition().toNumber()).toEqual(100);
        expect($thumb.css('transform')).toEqual('translateY(-100%)');
      });

      test('must not cross the bottom border', () => {
        event.clientY = wrapperSizeY * 3;
        $thumb.trigger(event);

        expect(thumb.getPosition().toNumber()).toEqual(0);
        expect($thumb.css('transform')).toEqual('translateY(0%)');
      });
    });
  });

  describe('when a key is pressed', () => {
    const left = 37;
    const up = 38;
    const right = 39;
    const down = 40;

    const thumbValue = thumb.state.value.toNumber();

    let moveMessage: MoveMessage = {
      typeMessage: 'moveMessage',
      moveDirection: 0,
      value: new BigNumber(0),
    };

    function handleMoveMessage(triggeredEvent: JQuery.TriggeredEvent, message: MoveMessage) {
      moveMessage = message;
    }

    $wrapper.on('toxin-slider.update', handleMoveMessage);

    const event = $.Event('keydown');

    afterEach(() => {
      event.type = 'keyup';
      thumb.$thumb.trigger(event);
      event.type = 'keydown';
    });

    test('should send the correct message (key left)', () => {
      event.keyCode = left;
      $thumb.trigger(event);

      expect(moveMessage.typeMessage).toEqual('moveMessage');
      expect(moveMessage.value.toNumber()).toEqual(thumbValue);
      expect(moveMessage.moveDirection).toEqual(-1);
    });

    test('should send the correct message (key up)', () => {
      event.keyCode = up;
      $thumb.trigger(event);

      expect(moveMessage.typeMessage).toEqual('moveMessage');
      expect(moveMessage.value.toNumber()).toEqual(thumbValue);
      expect(moveMessage.moveDirection).toEqual(1);
    });

    test('should send the correct message (key down)', () => {
      event.keyCode = down;
      $thumb.trigger(event);

      expect(moveMessage.typeMessage).toEqual('moveMessage');
      expect(moveMessage.value.toNumber()).toEqual(thumbValue);
      expect(moveMessage.moveDirection).toEqual(-1);
    });

    test('should send the correct message (key right)', () => {
      event.keyCode = right;
      $thumb.trigger(event);

      expect(moveMessage.typeMessage).toEqual('moveMessage');
      expect(moveMessage.value.toNumber()).toEqual(thumbValue);
      expect(moveMessage.moveDirection).toEqual(1);
    });
  });

  describe('when the key is not pressed', () => {
    test('should report its stop', () => {
      expect(thumb.getDirection()).toEqual(0);
    });
  });
});
