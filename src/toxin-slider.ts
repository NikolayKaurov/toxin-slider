import $ from 'jquery';

import Model from './model';
import View from './view';
import Controller from './controller';

$.fn.toxinSlider = function toxinSlider(this: JQuery, state: ViewState): JQuery {
  const model = new Model(state);

  const view = new View({
    state: model.state,
    $outerWrapper: this,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const controller = new Controller({ model, view });

  return this;
};
