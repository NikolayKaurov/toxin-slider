import Model from './model';
import View from './view';

export default class Controller {
  readonly model;

  readonly view;

  constructor(options: { model: Model, view: View }) {
    const { model, view } = options;
    const { $toxinSlider } = view;

    this.model = model;
    this.view = view;

    $toxinSlider.on('toxin-slider.update', { model, view }, handleSliderUpdate);
  }
}

function handleSliderUpdate(event: JQuery.TriggeredEvent, message: DragMessage) {
  const { model, view } = event.data as { model: Model; view: View };

  view.update({ ...view.state, ...model.update(message) });
}
