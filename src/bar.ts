import BigNumber from 'bignumber.js';

/*  This constant should be duplicated in the stylesheet ./toxin-slider.scss: $thumb-length
    and the test file ../test/bar.test.ts: const thumbLength */
const thumbLength = new BigNumber(16);

const halfThumbLength = thumbLength.dividedBy(2);

const barHTML = '<div class="toxin-slider__bar"></div>';

export default class Bar {
  readonly $bar: JQuery;

  isVertical = false;

  constructor(options: { $wrapper: JQuery, isVertical: boolean }) {
    const { $wrapper, isVertical } = options;

    this.$bar = $(barHTML);
    $wrapper.append(this.$bar);

    this.$bar.on('mousedown', this, handleBarMousedown);

    this.update(isVertical);
  }

  update(isVertical: boolean) {
    this.isVertical = isVertical;

    return this;
  }
}

function handleBarMousedown(event: JQuery.TriggeredEvent) {
  if (!(event.data instanceof Bar)) {
    return;
  }

  const { $bar, isVertical } = event.data;

  const rawSize = isVertical
    ? ($bar.outerHeight() ?? 0)
    : ($bar.outerWidth() ?? 0);

  const rawClickPoint = isVertical
    ? ($bar.offset()?.top ?? 0) - window.scrollY + rawSize - (event?.clientY ?? 0)
    : (event?.clientX ?? 0) + window.scrollX - ($bar.offset()?.left ?? 0);

  const size = new BigNumber(rawSize);
  const normalizedSize = size.minus(thumbLength);
  const clickPoint = new BigNumber(rawClickPoint);

  $bar.trigger('toxin-slider.update', {
    size: normalizedSize,
    clickPoint: normalizeClickPoint(),
  });

  function normalizeClickPoint(): BigNumber {
    if (clickPoint.isLessThan(halfThumbLength)) {
      return new BigNumber(0);
    }

    if (clickPoint.isGreaterThan(size.minus(halfThumbLength))) {
      return new BigNumber(normalizedSize);
    }

    return clickPoint.minus(halfThumbLength);
  }
}
