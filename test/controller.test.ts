import $ from 'jquery';

import Model from '../src/model';
import View from '../src/view';
import Controller from '../src/controller';

describe('Controller', () => {
  const $outerWrapper = $('<div></div>');

  const model = new Model({ typeMessage: 'options' });
  const view = new View({
    $outerWrapper,
    state: model.state,
  });
  const controller = new Controller({ model, view });

  const $from = $('input[name="undefined-name"]', $outerWrapper);
  const $to = $('input[name="undefined-name-to"]', $outerWrapper);

  const triggerEvent = $.Event('toxin-slider.update');

  $outerWrapper.on('toxin-slider.slide', handleSlide);

  let receivedOptions: OutsideOptions = {};

  function handleSlide(event: JQuery.TriggeredEvent, outsideOptions: OutsideOptions) {
    receivedOptions = outsideOptions;
  }

  describe('when created', () => {
    test('must store a reference to the Model instance', () => {
      expect(controller.model instanceof Model).toBe(true);
    });
    test('must store a reference to the View instance', () => {
      expect(controller.view instanceof View).toBe(true);
    });
  });

  describe('when handles the update event', () => {
    test('should update the View based on the state of the updated Model', () => {
      controller.view.$toxinSlider.trigger(triggerEvent, {
        typeMessage: 'options',
        start: 90,
        step: 2,
        from: 93,
        to: 95,
        end: 100,
      });

      expect(Number($from.val())).toEqual(94);
      expect(Number($to.val())).toEqual(96);
    });

    test('should send outside slider parameters', () => {
      expect(receivedOptions).toEqual({
        start: 90,
        step: 2,
        from: 94,
        to: 96,
        end: 100,
        hasTwoValues: false,
        isVertical: false,
        progressBarHidden: false,
        tooltipHidden: false,
        scaleHidden: false,
        units: '',
        name: 'undefined-name',
      });
    });
  });
});
