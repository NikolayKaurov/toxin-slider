import $ from 'jquery';

import Model from './model';
import View from './view';
import Controller from './controller';

$.fn.toxinSlider = function toxinSlider(this: JQuery, state: ViewState): JQuery {
  return this.each((index, outerWrapper) => {
    const $outerWrapper = $(outerWrapper);
    const $toxinSlider = $('.js-toxin-slider', $outerWrapper);

    if ($toxinSlider.length > 0) {
      $toxinSlider.trigger('toxin-slider.update', state);
    } else {
      const { name = '' } = state;
      const sliderName = index > 0 ? `${name}-${index}` : name;
      const sliderState = { ...state, ...{ name: sliderName } };

      const model = new Model(sliderState);

      const view = new View({
        $outerWrapper,
        state: model.state,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const controller = new Controller({ model, view });
    }
  });
};
