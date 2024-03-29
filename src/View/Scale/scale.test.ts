import $ from 'jquery';
import BigNumber from 'bignumber.js';

import Scale from './Scale';

describe('Scale', () => {
  const $wrapper = $('<div></div>');

  const state: ScaleState = {
    start: new BigNumber(1),
    end: new BigNumber(11),
    step: new BigNumber(3),
    hidden: Math.round(Math.random()) === 0,
    isVertical: false,
    units: '$',
  };

  const scale = new Scale({ $wrapper, state });

  const $scale = $('div.js-toxin-slider__scale', $wrapper);

  $scale.css({
    width: '1000px',
    height: '1000px',
    'font-size': '10px',
    'line-height': '15px',
  });

  describe('when created', () => {
    test('should append its html-element to the wrapper', () => {
      expect($scale.length).toEqual(1);
    });

    test('must have a method "update"', () => {
      expect(typeof scale.update).toBe('function');
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

  describe('in horizontal state', () => {
    beforeEach(() => {
      $scale.css({
        width: '290px',
        'font-size': '10px',
      });

      state.start = new BigNumber(-1);
      state.end = new BigNumber(32.3);
      state.step = new BigNumber(5.55);
      state.units = ' руб.';
      state.isVertical = false;
      scale.update(state);
    });

    test('should limit the density of values', () => {
      expect($('.js-toxin-slider__scale-value', $scale).text())
        .toEqual('-1 руб.-1 руб.10,1 руб.21,2 руб.32,3 руб.32,3 руб.');
    });
  });

  describe('in vertical state', () => {
    beforeEach(() => {
      $scale.css({
        height: '85px',
        'line-height': '15px',
      });

      state.start = new BigNumber(-2);
      state.end = new BigNumber(31.3);
      state.step = new BigNumber(5.55);
      state.units = ' коп.';
      state.isVertical = true;
      scale.update(state);
    });

    test('should limit the density of values', () => {
      expect($('.js-toxin-slider__scale-value', $scale).text())
        .toEqual('-2 коп.-2 коп.9,1 коп.20,2 коп.31,3 коп.31,3 коп.');
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

    beforeEach(() => {
      state.start = new BigNumber(10);
      state.end = new BigNumber(30);
      state.step = new BigNumber(5);
      state.units = '';
      scale.update(state);
    });

    test('must send the correct message', () => {
      $($('.js-toxin-slider__scale-value', $scale).get()[3]).trigger(triggerEvent);
      expect(receivedMessage.scaleValue.toNumber()).toEqual(20);
    });
  });
});
