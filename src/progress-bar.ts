import $ from 'jquery';
import BigNumber from 'bignumber.js';

const progressBarHTML = '<div class="toxin-slider__progress-bar"></div>';

export default class ProgressBar {
  readonly $progressBar: JQuery;

  constructor(options: { $wrapper: JQuery; state: ProgressBarState }) {
    const { $wrapper, state } = options;

    this.$progressBar = $(progressBarHTML);
    $wrapper.append(this.$progressBar);

    this.update(state);
  }

  update(state: ProgressBarState): ProgressBar {
    const {
      min,
      max,
      isVertical,
      hidden,
    } = state;

    const hundred = new BigNumber(100);

    this.$progressBar.css(
      'transform',
      isVertical
        ? `translate(-50%, ${hundred.minus(max).toNumber()}%) scaleY(${max.minus(min).toNumber()}%)`
        : `translate(${min.toNumber()}%, -50%) scaleX(${max.minus(min).toNumber()}%)`,
    );

    if (hidden) {
      this.$progressBar.addClass('toxin-slider__progress-bar_hidden');
    } else {
      this.$progressBar.removeClass('toxin-slider__progress-bar_hidden');
    }

    return this;
  }
}
