import Model from '../Model/Model';
import View from '../View/View';

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

  view.update(model.update(message));

  $toxinSlider.trigger('toxin-slider.slide', model.getOptions());
}
