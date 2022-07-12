import $ from 'jquery';

const progressBarHTML = '<div class="toxin-slider__progress-bar js-toxin-slider__progress-bar"></div>';

export default class ProgressBar {
  private readonly $progressBar: JQuery;

  constructor(options: { $wrapper: JQuery; state: ProgressBarState }) {
    const { $wrapper, state } = options;

    this.$progressBar = $(progressBarHTML);
    $wrapper.append(this.$progressBar);

    this.update(state);
  }

  update(state: ProgressBarState): ProgressBar {
  /*
    if (state.isVertical) {
      this.$progressBar.css(
        'transform',
        `translate(-50%, ${100 - state.max}%) scaleY(${state.max - state.min}%)`,
      );
    } else {
      this.$progressBar.css(
        'transform',
        `translate(${state.min}%, -50%) scaleX(${state.max - state.min}%)`,
      );
    }
  */

    this.$progressBar.css(
      'transform',
      state.isVertical
        ? `translate(-50%, ${100 - state.max}%) scaleY(${state.max - state.min}%)`
        : `translate(${state.min}%, -50%) scaleX(${state.max - state.min}%)`,
    );

    return this;
  }
}
