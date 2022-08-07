import Model from '../src/model';
import BigNumber from "bignumber.js";

describe('Model test', () => {
  const model = new Model({ typeMessage: 'options' });

  const start = Math.round(Math.random() * 1000);
  const end = Math.round(Math.random() * 1000);

  const tooBigStep = -1001;

  test('Model creation test', () => {
    expect(typeof model.update).toBe('function');
  });

  test('Model update test: added start and end of scale', () => {
    expect(model.update({
      start,
      end,
      step: tooBigStep,
      typeMessage: 'options',
    }).start.toNumber()).toEqual(start);

    expect(model.state.end.toNumber()).toEqual(end);
    expect(model.state.from.toNumber()).toEqual(start > end ? end : start);
    expect(model.state.to.toNumber()).toEqual(start > end ? start : end);
  });

  test('Model update test: normalize step', () => {
    expect(model.state.step.toNumber()).toEqual(Math.abs(end - start));

    expect(model.update({
      step: -1,
      typeMessage: 'options',
    }).step.toNumber()).toEqual(1);
  });

  test('Model update test: normalize value', () => {
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

  test('Model update test: sort values', () => {
    expect(model.update({
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

  test('Model update test: handle drag message', () => {
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

  test('Model update test: handle bar click message', () => {
    model.update({
      typeMessage: 'options',
      hasTwoValues: true,
    });

    expect(model.update({
      size: new BigNumber(90),
      clickPoint: new BigNumber(70),
      typeMessage: 'barMessage',
    }).from.toNumber()).toEqual(4);
    expect(model.state.to.toNumber()).toEqual(1);

    expect(model.update({
      size: new BigNumber(442),
      clickPoint: new BigNumber(61),
      typeMessage: 'barMessage',
    }).from.toNumber()).toEqual(10);
    expect(model.state.to.toNumber()).toEqual(1);

    model.update({
      typeMessage: 'options',
      hasTwoValues: false,
    });

    expect(model.update({
      size: new BigNumber(442),
      clickPoint: new BigNumber(307),
      typeMessage: 'barMessage',
    }).from.toNumber()).toEqual(4);
    expect(model.state.to.toNumber()).toEqual(1);
  });

  test('Model update test: handle keyboard move message', () => {
    model.update({
      typeMessage: 'options',
      hasTwoValues: true,
    });

    expect(model.update({
      moveDirection: -1,
      value: new BigNumber(4),
      typeMessage: 'moveMessage',
    }).from.toNumber()).toEqual(7);
    expect(model.state.to.toNumber()).toEqual(1);

    expect(model.update({
      moveDirection: 1,
      value: new BigNumber(1),
      typeMessage: 'moveMessage',
    }).from.toNumber()).toEqual(7);
    expect(model.state.to.toNumber()).toEqual(0);

    expect(model.update({
      moveDirection: -1,
      value: new BigNumber(0),
      typeMessage: 'moveMessage',
    }).from.toNumber()).toEqual(7);
    expect(model.state.to.toNumber()).toEqual(1);
  });

  test('Model update test: handle scale click message', () => {
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

  test('Model update test: receive new state', () => {
    model.update({
      typeMessage: 'options',
      start: 6,
      end: 66,
      step: -3,
      from: 10,
      to: 59,
      hasTwoValues: true,
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
      tooltipHidden: false,
      progressBarHidden: false,
      name: 'undefined-name',
      units: '',
    });

    model.update({
      typeMessage: 'options',
      start: 10000,
      end: 1000,
      step: 500,
      from: 4691,
      to: 7777,
      hasTwoValues: false,
    });

    expect(model.getOptions()).toEqual({
      start: 10000,
      end: 1000,
      step: 500,
      from: 4500,
      to: 8000,
      hasTwoValues: false,
      isVertical: false,
      scaleHidden: false,
      tooltipHidden: false,
      progressBarHidden: false,
      name: 'undefined-name',
      units: '',
    });
  });
});
