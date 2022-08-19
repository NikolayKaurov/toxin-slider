import $ from 'jquery';

import Model from './Model/Model';
import View from './View/View';
import Controller from './Controller/Controller';

$.fn.toxinSlider = function toxinSlider(this: JQuery, outsideOptions: OutsideOptions): JQuery {
  return this.each((index, outerWrapper) => {
    const $outerWrapper = $(outerWrapper);
    const $toxinSlider = $('.js-toxin-slider', $outerWrapper);

    const options: Options = {
      typeMessage: 'options',
      ...outsideOptions,
    };

    if ($toxinSlider.length > 0) {
      $toxinSlider.trigger('toxin-slider.update', options);
    } else {
      const { name = 'undefined-name' } = options;
      const sliderName = index > 0 ? `${name}-${index}` : name;
      const sliderOptions = { ...options, ...{ name: sliderName } };

      const model = new Model(sliderOptions);

      const view = new View({
        $outerWrapper,
        state: model.state,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const controller = new Controller({ model, view });
    }
  });
};
