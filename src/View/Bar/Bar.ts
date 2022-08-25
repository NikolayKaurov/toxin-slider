import $ from 'jquery';
import BigNumber from 'bignumber.js';

/*  This constant should be duplicated in the stylesheet ../../toxin-slider.scss: $thumb-length
    and the test file ./bar.test.ts: const thumbLength */
const thumbLength = new BigNumber(16);

const halfThumbLength = thumbLength.dividedBy(2);

const barHTML = '<div class="toxin-slider__bar js-toxin-slider__bar"></div>';

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
    ? new BigNumber($bar.outerHeight() ?? 0)
    : new BigNumber($bar.outerWidth() ?? 0);

  const rawClickPoint = isVertical
    ? new BigNumber(
      ($bar.offset()?.top ?? 0) - window.scrollY + rawSize.toNumber() - (event?.clientY ?? 0),
    )
    : new BigNumber((event?.clientX ?? 0) + window.scrollX - ($bar.offset()?.left ?? 0));

  const size = rawSize.minus(thumbLength);

  const clickPoint = (() => {
    if (rawClickPoint.isLessThan(halfThumbLength)) {
      return new BigNumber(0);
    }

    if (rawClickPoint.isGreaterThan(size.plus(halfThumbLength))) {
      return new BigNumber(size);
    }

    return rawClickPoint.minus(halfThumbLength);
  })();

  $bar.trigger('toxin-slider.update', {
    size,
    clickPoint,
    typeMessage: 'barMessage',
  });
}
