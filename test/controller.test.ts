import $ from 'jquery';

import Model from '../src/model';
import View from '../src/view';
import Controller from '../src/controller';

describe('Controller test', () => {
  const model = new Model({ typeMessage: 'options' });
  const view = new View({
    $outerWrapper: $(),
    state: model.state,
  });
  const controller = new Controller({ model, view });

  test('Controller creation test', () => {
    expect(controller.model instanceof Model).toBe(true);
    expect(controller.view instanceof View).toBe(true);
  });

  test('Handle update test', () => {
    const event = $.Event('toxin-slider.update');
    controller.view.$toxinSlider.trigger(event, {
      start: 92,
      end: 223,
    });

    expect(controller.model.state.start.toNumber()).toEqual(92);
    expect(controller.model.state.end.toNumber()).toEqual(223);
  });
});
