import $ from 'jquery';
import BigNumber from 'bignumber.js';

import Scale from '../src/scale';

describe('Scale', () => {
  const $wrapper = $('<div></div>');

  const state: ScaleState = {
    start: new BigNumber(1),
    end: new BigNumber(11),
    step: new BigNumber(3),
    hidden: Math.round(Math.random()) === 0,
    units: '$',
  };

  const scale = new Scale({ $wrapper, state });

  const $scale = $('div.js-toxin-slider__scale', $wrapper);

  describe('when created', () => {
    test('should append its html-element to the wrapper', () => {
      expect($scale.length).toEqual(1);
    });

    test('must have a method "update"', () => {
      expect(typeof scale.update).toBe('function');
    });

    test('should show the correct set of values', () => {
      expect($('.js-toxin-slider__scale-value', $scale).text()).toEqual('1$1$4$7$10$11$11$');
    });
  });

  describe('when updated', () => {
    beforeEach(() => {
      scale.update(state);
    });

    afterEach(() => {
      state.start = new BigNumber(10);
      state.end = new BigNumber(30);
      state.step = new BigNumber(5);
      state.hidden = !state.hidden;
      state.units = '';
    });

    test('must appear or hide', () => {
      expect($scale.hasClass('toxin-slider__scale_hidden')).toEqual(state.hidden);
    });

    test('must appear or hide (repeat with inversion)', () => {
      expect($scale.hasClass('toxin-slider__scale_hidden')).toEqual(state.hidden);
    });

    test('should show the correct set of new values', () => {
      expect($('.js-toxin-slider__scale-value', $scale).text()).toEqual('10101520253030');
    });
  });

  describe('after clicking on the scale division', () => {
    const triggerEvent = $.Event('mousedown');

    let receivedMessage: ScaleMessage = {
      typeMessage: 'scaleMessage',
      scaleValue: new BigNumber(NaN),
    };

    $wrapper.on('toxin-slider.update', handleScaleClicking);

    function handleScaleClicking(event: JQuery.TriggeredEvent, message: ScaleMessage) {
      receivedMessage = message;
    }

    $($('.js-toxin-slider__scale-value', $scale).get()[3]).trigger(triggerEvent);

    test('must send the correct message', () => {
      expect(receivedMessage.scaleValue.toNumber()).toEqual(7);
    });
  });
});
