import $ from 'jquery';

const progressBarHTML = '<div class="toxin-slider__progress-bar js-toxin-slider__progress-bar"></div>';

export default class ProgressBar {
  readonly $progressBar: JQuery;

  constructor(options: { $wrapper: JQuery; state: ProgressBarState }) {
    const { $wrapper, state } = options;

    this.$progressBar = $(progressBarHTML);
    $wrapper.append(this.$progressBar);

    this.update(state);
  }

  update(state: ProgressBarState): ProgressBar {
    this.$progressBar.css(
      'transform',
      state.isVertical
        ? `translate(-50%, ${100 - state.max}%) scaleY(${state.max - state.min}%)`
        : `translate(${state.min}%, -50%) scaleX(${state.max - state.min}%)`,
    );

    if (state.hidden) {
      this.$progressBar.addClass('toxin-slider__progress-bar_hidden');
    } else {
      this.$progressBar.removeClass('toxin-slider__progress-bar_hidden');
    }

    return this;
  }
}
