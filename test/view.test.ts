import $ from 'jquery';
import BigNumber from 'bignumber.js';

import View from '../src/view';

describe('View', () => {
  const state: SliderState = {
    start: new BigNumber(14),
    end: new BigNumber(114),
    step: new BigNumber(25),
    from: new BigNumber(39),
    to: new BigNumber(64),
    isVertical: true,
    hasTwoValues: true,
    progressBarHidden: false,
    tooltipHidden: false,
    scaleHidden: false,
    name: 'test',
    units: 'mm.',
  };

  const $outerWrapper = $('<div></div>');

  const view = new View({ $outerWrapper, state });

  const $bar = $('div.js-toxin-slider__bar', $outerWrapper);
  const $progressBar = $('div.js-toxin-slider__progress-bar', $outerWrapper);
  const $scale = $('div.js-toxin-slider__scale', $outerWrapper);
  const $thumbs = $('div.js-toxin-slider__thumb', $outerWrapper);
  const $slider = $('div.js-toxin-slider', $outerWrapper);
  const $from = $('input.js-toxin-slider__input[name="test-from"]', $outerWrapper);
  const $to = $('input.js-toxin-slider__input[name="test-to"]', $outerWrapper);

  describe('after creation', () => {
    test('should create slider html-element', () => {
      expect($slider.length).toEqual(1);
    });

    test('should create bar html-element', () => {
      expect($bar.length).toEqual(1);
    });

    test('should create progress-bar html-element', () => {
      expect($progressBar.length).toEqual(1);
    });

    test('should create scale html-element', () => {
      expect($scale.length).toEqual(1);
    });

    test('should create thumbs html-elements', () => {
      expect($thumbs.length).toEqual(2);
    });

    test('should create a field for the value of "from"', () => {
      expect($from.length).toEqual(1);
    });

    test('should create a field for the value of "to"', () => {
      expect($to.length).toEqual(1);
    });

    test('must pass the correct property "isVertical" to bar', () => {
      expect(view.bar.isVertical).toEqual(true);
    });

    test('should correctly position the progress-bar', () => {
      expect($progressBar.css('transform'))
        .toEqual('translate(-50%, 50%) scaleY(25%)');
    });

    test('must pass the correct parameters to the scale', () => {
      expect($('.js-toxin-slider__scale-value', $scale).text())
        .toEqual('14mm.14mm.39mm.64mm.89mm.114mm.114mm.');
    });

    test('must correctly position the thumbs', () => {
      expect(view.thumbA.getPosition().toNumber()).toEqual(25);
      expect(view.thumbB.getPosition().toNumber()).toEqual(50);
    });

    test('must enter the correct values to the input fields', () => {
      expect($from.val()).toEqual('39');
      expect($to.val()).toEqual('64');
    });
  });

  describe('after updating with the specified parameters', () => {
    beforeEach(() => {
      state.start = new BigNumber(100);
      state.end = new BigNumber(200);
      state.step = new BigNumber(30);
      state.from = new BigNumber(130);
      state.to = new BigNumber(160);
      state.isVertical = false;
      state.hasTwoValues = false;
      state.progressBarHidden = true;
      state.tooltipHidden = true;
      state.scaleHidden = true;
      state.name = 'test';
      state.units = ' sec.';

      view.update(state);
    });

    test('must pass the correct property "isVertical" to bar', () => {
      expect(view.bar.isVertical).toEqual(false);
    });

    test('should correctly position the progress-bar', () => {
      expect($progressBar.css('transform'))
        .toEqual('translate(0%, -50%) scaleX(30%)');
    });

    test('should hide the progress-bar', () => {
      expect($progressBar.hasClass('toxin-slider__progress-bar_hidden'))
        .toEqual(true);
    });

    test('must pass the correct parameters to the scale', () => {
      expect($('.js-toxin-slider__scale-value', $scale).text())
        .toEqual('100 sec.100 sec.130 sec.160 sec.190 sec.200 sec.200 sec.');
    });

    test('should hide the scale', () => {
      expect($scale.hasClass('toxin-slider__scale_hidden'))
        .toEqual(true);
    });

    test('must correctly position the thumbs', () => {
      expect(view.thumbA.getPosition().toNumber()).toEqual(0);
      expect(view.thumbB.getPosition().toNumber()).toEqual(30);
    });

    test('should hide one thumb', () => {
      expect(view.thumbA.$thumb.hasClass('toxin-slider__thumb_hidden'))
        .toEqual(true);
      expect(view.thumbB.$thumb.hasClass('toxin-slider__thumb_hidden'))
        .toEqual(false);
    });

    test('should hide tooltips', () => {
      expect(view.thumbA.$tooltip.hasClass('toxin-slider__thumb-tooltip_hidden'))
        .toEqual(true);
      expect(view.thumbB.$tooltip.hasClass('toxin-slider__thumb-tooltip_hidden'))
        .toEqual(true);
    });

    test('must enter the correct values to the input fields', () => {
      expect($from.val()).toEqual('130');
      expect($to.val()).toEqual('160');
    });
  });

  describe('after updating with different parameters', () => {
    beforeEach(() => {
      state.start = new BigNumber(200);
      state.end = new BigNumber(300);
      state.step = new BigNumber(40);
      state.from = new BigNumber(240);
      state.to = new BigNumber(280);
      state.isVertical = true;
      state.hasTwoValues = true;
      state.progressBarHidden = false;
      state.tooltipHidden = false;
      state.scaleHidden = false;
      state.name = 'test';
      state.units = 'руб.';

      view.update(state);
    });

    test('must pass the correct property "isVertical" to bar', () => {
      expect(view.bar.isVertical).toEqual(true);
    });

    test('should correctly position the progress-bar', () => {
      expect($progressBar.css('transform'))
        .toEqual('translate(-50%, 20%) scaleY(40%)');
    });

    test('should show the progress-bar', () => {
      expect($progressBar.hasClass('toxin-slider__progress-bar_hidden'))
        .toEqual(false);
    });

    test('must pass the correct parameters to the scale', () => {
      expect($('.js-toxin-slider__scale-value', $scale).text())
        .toEqual('200руб.200руб.240руб.280руб.300руб.300руб.');
    });

    test('should show the scale', () => {
      expect($scale.hasClass('toxin-slider__scale_hidden'))
        .toEqual(false);
    });

    test('must correctly position the thumbs', () => {
      expect(view.thumbA.getPosition().toNumber()).toEqual(40);
      expect(view.thumbB.getPosition().toNumber()).toEqual(80);
    });

    test('should show both thumbs', () => {
      expect(view.thumbA.$thumb.hasClass('toxin-slider__thumb_hidden'))
        .toEqual(false);
      expect(view.thumbB.$thumb.hasClass('toxin-slider__thumb_hidden'))
        .toEqual(false);
    });

    test('should show tooltips', () => {
      expect(view.thumbA.$tooltip.hasClass('toxin-slider__thumb-tooltip_hidden'))
        .toEqual(false);
      expect(view.thumbB.$tooltip.hasClass('toxin-slider__thumb-tooltip_hidden'))
        .toEqual(false);
    });

    test('must enter the correct values to the input fields', () => {
      expect($from.val()).toEqual('240');
      expect($to.val()).toEqual('280');
    });
  });
});
