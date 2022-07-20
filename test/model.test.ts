import Model from '../src/model';

describe('Model test', () => {
  const model = new Model({});

  const start = Math.round(Math.random() * 1000);
  const end = Math.round(Math.random() * 1000);

  const tooBigStep = 1001;
  const wrongStepSign = start < end ? -1 : 1;
  const tooBigStepWithWrongSign = tooBigStep * wrongStepSign;

  test('Model creation test', () => {
    expect(typeof model.update).toBe('function');
  });

  test('Model update test: added start and end of scale', () => {
    expect(model.update({ start, end })).toEqual({
      start,
      end,
      step: 0,
      from: start < end ? start : end,
      to: start < end ? start : end,
      hasTwoValues: false,
    });
  });

  test('Model update test: normalize step', () => {
    expect(model.update({ step: tooBigStep }).step).toEqual(end - start);
    expect(model.update({ step: wrongStepSign }).step).toEqual(
      end === start ? 0 : -wrongStepSign,
    );
    expect(model.update({ step: tooBigStepWithWrongSign }).step).toEqual(end - start);
  });

  test('Model update test: normalize value', () => {
    expect(model.update({
      start: 10,
      end: 0,
      step: 3,
      from: -8,
    }).from).toEqual(0);
    expect(model.update({ from: 19 }).from).toEqual(10);
    expect(model.update({ from: 9 }).from).toEqual(10);
    expect(model.update({ from: 8 }).from).toEqual(7);
    expect(model.update({ from: 3 }).from).toEqual(4);
    expect(model.update({ from: 2.45 }).from).toEqual(1);
    expect(model.update({ from: 0.51 }).from).toEqual(1);
    expect(model.update({ from: 0.49 }).from).toEqual(0);

    const fraction = Math.random();
    expect(model.update({ from: fraction, step: 0 }).from).toEqual(fraction);

    expect(model.update({
      start: 0,
      end: 10,
      step: 3,
      from: -7,
    }).from).toEqual(0);
    expect(model.update({ from: 16 }).from).toEqual(10);
    expect(model.update({ from: 9.6 }).from).toEqual(10);
    expect(model.update({ from: 9.4 }).from).toEqual(9);
    expect(model.update({ from: 1 }).from).toEqual(0);
    expect(model.update({ from: 2.45 }).from).toEqual(3);
    expect(model.update({ from: 4.44 }).from).toEqual(3);
    expect(model.update({ from: 5.55 }).from).toEqual(6);
  });

  test('Model update test: sort values', () => {
    expect(model.update({ from: 6, to: 3, hasTwoValues: true })).toEqual({
      start: 0,
      end: 10,
      step: 3,
      from: 3,
      to: 6,
      hasTwoValues: true,
    });

    expect(model.update({
      start: 10,
      end: 0,
      from: 4,
      to: 7,
    })).toEqual({
      start: 10,
      end: 0,
      step: -3,
      from: 7,
      to: 4,
      hasTwoValues: true,
    });
  });

  test('Model update test: handle drag message', () => {
    expect(model.update({ innerOffset: 52, wrapperSize: 601, value: 4 })).toEqual({
      start: 10,
      end: 0,
      step: -3,
      from: 10,
      to: 7,
      hasTwoValues: true,
    });

    expect(model.update({ innerOffset: 442, wrapperSize: 601, value: 10 })).toEqual({
      start: 10,
      end: 0,
      step: -3,
      from: 7,
      to: 4,
      hasTwoValues: true,
    });

    model.update({ hasTwoValues: false });

    expect(model.update({ innerOffset: 17, wrapperSize: 33, value: 7 })).toEqual({
      start: 10,
      end: 0,
      step: -3,
      from: 4,
      to: 4,
      hasTwoValues: false,
    });
  });

  test('Model update test: handle bar click message', () => {
    model.update({ hasTwoValues: true });

    expect(model.update({ size: 90, clickPoint: 70 })).toEqual({
      start: 10,
      end: 0,
      step: -3,
      from: 4,
      to: 1,
      hasTwoValues: true,
    });

    expect(model.update({ size: 442, clickPoint: 61 })).toEqual({
      start: 10,
      end: 0,
      step: -3,
      from: 10,
      to: 1,
      hasTwoValues: true,
    });

    model.update({ hasTwoValues: false });

    expect(model.update({ size: 442, clickPoint: 307 })).toEqual({
      start: 10,
      end: 0,
      step: -3,
      from: 4,
      to: 1,
      hasTwoValues: false,
    });
  });

  test('Model update test: handle keyboard move message', () => {
    model.update({ hasTwoValues: true });

    expect(model.update({ moveDirection: -1, value: 4 })).toEqual({
      start: 10,
      end: 0,
      step: -3,
      from: 7,
      to: 1,
      hasTwoValues: true,
    });

    expect(model.update({ moveDirection: 1, value: 1 })).toEqual({
      start: 10,
      end: 0,
      step: -3,
      from: 7,
      to: 0,
      hasTwoValues: true,
    });

    expect(model.update({ moveDirection: -1, value: 0 })).toEqual({
      start: 10,
      end: 0,
      step: -3,
      from: 7,
      to: 1,
      hasTwoValues: true,
    });
  });

  test('Model update test: handle scale click message', () => {
    model.update({ hasTwoValues: true });

    expect(model.update({ scaleValue: 10 })).toEqual({
      start: 10,
      end: 0,
      step: -3,
      from: 10,
      to: 1,
      hasTwoValues: true,
    });

    expect(model.update({ scaleValue: 7 })).toEqual({
      start: 10,
      end: 0,
      step: -3,
      from: 7,
      to: 1,
      hasTwoValues: true,
    });
  });

  test('Model update test: receive new state', () => {
    expect(model.update({
      start: 6,
      end: 66,
      step: -3,
      from: 10,
      to: 59,
      hasTwoValues: true,
    })).toEqual({
      start: 6,
      end: 66,
      step: 3,
      from: 9,
      to: 60,
      hasTwoValues: true,
    });

    expect(model.update({
      start: 10000,
      end: 1000,
      step: 500,
      from: 4691,
      to: 7777,
      hasTwoValues: false,
    })).toEqual({
      start: 10000,
      end: 1000,
      step: -500,
      from: 4500,
      to: 8000,
      hasTwoValues: false,
    });
  });
});
