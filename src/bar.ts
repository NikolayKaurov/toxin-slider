import $ from 'jquery';

/* This constant should be duplicated in the stylesheet ./toxin-slider.scss: $thumb-length
and the test file ../test/bar.test.ts: const thumbLength */
const thumbLength = 16;

const halfThumbLength = thumbLength / 2;

const barHTML = '<div class="toxin-slider__bar"></div>';

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
    ? ($bar.outerHeight() ?? 0)
    : ($bar.outerWidth() ?? 0);

  const clickPoint = isVertical
    ? ($bar.offset()?.top ?? 0) - window.scrollY + size - (event?.clientY ?? 0)
    : (event?.clientX ?? 0) + window.scrollX - ($bar.offset()?.left ?? 0);

  $bar.trigger('toxin-slider.update', {
    size: normalizeSize(),
    clickPoint: normalizeClickPoint(),
  });

  function normalizeSize(): number {
    return size - thumbLength;
  }

  function normalizeClickPoint(): number {
    if (clickPoint < halfThumbLength) {
      return 0;
    }

    if (clickPoint > size - halfThumbLength) {
      return size - thumbLength;
    }

    return clickPoint - halfThumbLength;
  }
}
