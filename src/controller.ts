import Model from './model';
import View from './view';
import { Message } from './toxin-slider-interface';

export default class Controller {
  readonly model;

  readonly view;

  constructor(options: { model: Model, view: View }) {
    const { model, view } = options;
    const { $toxinSlider } = view;

    this.model = model;
    this.view = view;

    $toxinSlider.on('toxin-slider.update', this, handleSliderUpdate);
  }
}

function handleSliderUpdate(event: JQuery.TriggeredEvent, message: Message) {
  if (!(event.data instanceof Controller)) {
    return;
  }

  const { model, view } = event.data;
  const { $toxinSlider } = view;

  view.update({ ...view.state, ...model.update(message) });

  $toxinSlider.trigger('toxin-slider.slide', view.state);
}
