import $ from 'jquery';

const barHTML = '<div class="toxin-slider__bar js-toxin-slider__bar"></div>';

export default class Bar {
  readonly $bar: JQuery;

  isVertical = false;

  constructor(options: { $wrapper: JQuery, isVertical: boolean }) {
    const { $wrapper, isVertical } = options;

    this.$bar = $(barHTML);
    $wrapper.append(this.$bar);

    this.$bar.on('mousedown', { bar: this }, handleBarMousedown);

    this.update(isVertical);
  }

  update(isVertical: boolean) {
    this.isVertical = isVertical;

    return this;
  }
}

function handleBarMousedown(event: JQuery.TriggeredEvent) {
  const { bar } = event.data as { bar: Bar };
  const { $bar, isVertical } = bar;

  const size = isVertical
    ? $bar.outerHeight() ?? 0
    : $bar.outerWidth() ?? 0;

  const clickPoint = isVertical
    ? ($bar.offset()?.top ?? 0) + size - (event?.clientY ?? 0)
    : (event?.clientX ?? 0) - ($bar.offset()?.left ?? 0);

  $bar.trigger('toxin-slider.bar.clicking', { size, clickPoint });
}
