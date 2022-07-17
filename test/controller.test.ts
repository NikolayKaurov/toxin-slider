import $ from 'jquery';

import Model from '../src/model';
import View from '../src/view';
import Controller from '../src/controller';

describe('Controller test', () => {
  const model = new Model({});
  const view = new View({
    $outerWrapper: $(),
    state: {
      start: 33,
      end: 79,
    },
  });
  const controller = new Controller({ model, view });

  test('Controller creation test', () => {
    expect(typeof controller.model).toBe('object');
    expect(typeof controller.view).toBe('object');
  });

  test('Handle update test', () => {
    const event = $.Event('toxin-slider.update');
    controller.view.$toxinSlider.trigger(event, {
      start: 92,
      end: 223,
    });

    expect(controller.view.state.start).toEqual(92);
    expect(controller.view.state.end).toEqual(223);
  });
});
