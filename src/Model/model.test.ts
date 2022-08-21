import BigNumber from 'bignumber.js';

import Model from './Model';

describe('Model', () => {
  const model = new Model({ typeMessage: 'options' });

  const start = Math.round(Math.random() * 1000);
  const end = Math.round(Math.random() * 1000);

  const tooBigStep = -1001;

  describe('after creation', () => {
    test('must have a method "update"', () => {
      expect(typeof model.update).toBe('function');
    });
  });

  describe('when updated', () => {
    test('must take any start and end values', () => {
      expect(model.update({
        start,
        end,
        typeMessage: 'options',
      }).start.toNumber()).toEqual(start);
      expect(model.state.end.toNumber()).toEqual(end);
    });

    test('should normalize the step value', () => {
      expect(model.update({
        step: tooBigStep,
        typeMessage: 'options',
      }).step.toNumber()).toEqual(Math.abs(end - start));

      expect(model.update({
        step: -1,
        typeMessage: 'options',
      }).step.toNumber()).toEqual(1);
    });

    test('should normalize the scale step value', () => {
      expect(model.update({
        typeMessage: 'options',
        start: 10,
        end: 0,
        step: 3,
        from: -8,
        scaleStep: 4,
      }).scaleStep.toNumber()).toEqual(Math.abs(3));

      expect(model.update({
        typeMessage: 'options',
        scaleStep: -9,
      }).scaleStep.toNumber()).toEqual(Math.abs(9));

      expect(model.update({
        typeMessage: 'options',
        step: 0,
        scaleStep: -6.66,
      }).scaleStep.toNumber()).toEqual(Math.abs(6.66));
    });

    test('should normalize thumb value', () => {
      expect(model.update({
        typeMessage: 'options',
        start: 10,
        end: 0,
        step: 3,
        from: -8,
      }).from.toNumber()).toEqual(0);

      expect(model.update({
        typeMessage: 'options',
        from: 19,
      }).from.toNumber()).toEqual(10);

      expect(model.update({
        typeMessage: 'options',
        from: 9,
      }).from.toNumber()).toEqual(10);

      expect(model.update({
        typeMessage: 'options',
        from: 8,
      }).from.toNumber()).toEqual(7);

      expect(model.update({
        typeMessage: 'options',
        from: 3,
      }).from.toNumber()).toEqual(4);

      expect(model.update({
        typeMessage: 'options',
        from: 2.45,
      }).from.toNumber()).toEqual(1);

      expect(model.update({
        typeMessage: 'options',
        from: 0.51,
      }).from.toNumber()).toEqual(1);

      expect(model.update({
        typeMessage: 'options',
        from: 0.49,
      }).from.toNumber()).toEqual(0);

      const fraction = Math.random();
      expect(model.update({
        typeMessage: 'options',
        from: fraction,
        step: 0,
      }).from.toNumber()).toEqual(fraction);

      expect(model.update({
        typeMessage: 'options',
        start: 0,
        end: 10,
        step: 3,
        from: -7,
      }).from.toNumber()).toEqual(0);

      expect(model.update({
        typeMessage: 'options',
        from: 16,
      }).from.toNumber()).toEqual(10);

      expect(model.update({
        typeMessage: 'options',
        from: 9.6,
      }).from.toNumber()).toEqual(10);

      expect(model.update({
        typeMessage: 'options',
        from: 9.4,
      }).from.toNumber()).toEqual(9);

      expect(model.update({
        typeMessage: 'options',
        from: 1,
      }).from.toNumber()).toEqual(0);

      expect(model.update({
        typeMessage: 'options',
        from: 2.45,
      }).from.toNumber()).toEqual(3);

      expect(model.update({
        typeMessage: 'options',
        from: 4.44,
      }).from.toNumber()).toEqual(3);

      expect(model.update({
        typeMessage: 'options',
        from: 5.55,
      }).from.toNumber()).toEqual(6);
    });

    test('should sort thumb values', () => {
      expect(model.update({
        start: 0,
        end: 10,
        from: 6,
        to: 3,
        hasTwoValues: true,
        typeMessage: 'options',
      }).from.toNumber()).toEqual(3);

      expect(model.state.to.toNumber()).toEqual(6);

      expect(model.update({
        start: 10,
        end: 0,
        from: 4,
        to: 7,
        typeMessage: 'options',
      }).from.toNumber()).toEqual(7);

      expect(model.state.to.toNumber()).toEqual(4);
    });

    test('should correctly handle thumb drag messages', () => {
      expect(model.update({
        innerOffset: new BigNumber(52),
        wrapperSize: new BigNumber(601),
        value: new BigNumber(4),
        typeMessage: 'dragMessage',
      }).from.toNumber()).toEqual(10);
      expect(model.state.to.toNumber()).toEqual(7);

      expect(model.update({
        innerOffset: new BigNumber(442),
        wrapperSize: new BigNumber(601),
        value: new BigNumber(10),
        typeMessage: 'dragMessage',
      }).from.toNumber()).toEqual(7);
      expect(model.state.to.toNumber()).toEqual(4);

      model.update({
        typeMessage: 'options',
        hasTwoValues: false,
      });

      expect(model.update({
        innerOffset: new BigNumber(17),
        wrapperSize: new BigNumber(33),
        value: new BigNumber(7),
        typeMessage: 'dragMessage',
      }).from.toNumber()).toEqual(4);
      expect(model.state.to.toNumber()).toEqual(4);
    });

    test('should correctly handle thumb keyboard messages', () => {
      model.update({
        typeMessage: 'options',
        hasTwoValues: true,
      });

      expect(model.update({
        moveDirection: -1,
        value: new BigNumber(4),
        typeMessage: 'moveMessage',
      }).from.toNumber()).toEqual(7);
      expect(model.state.to.toNumber()).toEqual(4);

      expect(model.update({
        moveDirection: 1,
        value: new BigNumber(4),
        typeMessage: 'moveMessage',
      }).from.toNumber()).toEqual(7);
      expect(model.state.to.toNumber()).toEqual(1);

      expect(model.update({
        moveDirection: -1,
        value: new BigNumber(0),
        typeMessage: 'moveMessage',
      }).from.toNumber()).toEqual(7);
      expect(model.state.to.toNumber()).toEqual(1);
    });

    test('should correctly handle bar messages', () => {
      model.update({
        typeMessage: 'options',
        hasTwoValues: true,
      });

      expect(model.update({
        size: new BigNumber(90),
        clickPoint: new BigNumber(55),
        typeMessage: 'barMessage',
      }).from.toNumber()).toEqual(7);
      expect(model.state.to.toNumber()).toEqual(4);

      expect(model.update({
        size: new BigNumber(442),
        clickPoint: new BigNumber(61),
        typeMessage: 'barMessage',
      }).from.toNumber()).toEqual(10);
      expect(model.state.to.toNumber()).toEqual(4);

      model.update({
        typeMessage: 'options',
        hasTwoValues: false,
      });

      expect(model.update({
        size: new BigNumber(442),
        clickPoint: new BigNumber(400),
        typeMessage: 'barMessage',
      }).from.toNumber()).toEqual(1);
      expect(model.state.to.toNumber()).toEqual(4);
    });

    test('should correctly handle scale messages', () => {
      model.update({
        typeMessage: 'options',
        hasTwoValues: true,
      });

      expect(model.update({
        typeMessage: 'scaleMessage',
        scaleValue: new BigNumber(10),
      }).from.toNumber()).toEqual(10);
      expect(model.state.to.toNumber()).toEqual(1);

      expect(model.update({
        typeMessage: 'scaleMessage',
        scaleValue: new BigNumber(7),
      }).from.toNumber()).toEqual(7);
      expect(model.state.to.toNumber()).toEqual(1);
    });
  });

  describe('upon request', () => {
    test('must report their parameters', () => {
      model.update({
        typeMessage: 'options',
        start: 6,
        end: 66,
        step: -3,
        from: 59,
        to: 10,
        hasTwoValues: true,
        isVertical: false,
        scaleHidden: false,
        scaleStep: -6,
        tooltipHidden: false,
        progressBarHidden: false,
        thumbsAreRestricted: false,
        name: 'test-slider',
        units: '%',
      });

      expect(model.getOptions()).toEqual({
        start: 6,
        end: 66,
        step: 3,
        from: 9,
        to: 60,
        hasTwoValues: true,
        isVertical: false,
        scaleHidden: false,
        scaleStep: 6,
        tooltipHidden: false,
        progressBarHidden: false,
        thumbsAreRestricted: false,
        name: 'test-slider',
        units: '%',
      });

      model.update({
        typeMessage: 'options',
        start: 10000,
        end: 1000,
        step: 500,
        from: 4691,
        to: 7777,
        hasTwoValues: false,
        isVertical: true,
        scaleHidden: true,
        scaleStep: 111,
        tooltipHidden: true,
        progressBarHidden: true,
        thumbsAreRestricted: true,
        name: 'slider-test',
        units: 'тугриков',
      });

      expect(model.getOptions()).toEqual({
        start: 10000,
        end: 1000,
        step: 500,
        from: 4500,
        to: 8000,
        hasTwoValues: false,
        isVertical: true,
        scaleHidden: true,
        scaleStep: 500,
        tooltipHidden: true,
        progressBarHidden: true,
        thumbsAreRestricted: true,
        name: 'slider-test',
        units: 'тугриков',
      });
    });
  });
});
