import $ from 'jquery';

import Thumb from './thumb';
import ProgressBar from './progress-bar';
import Bar from './bar';

const toxinSliderHTML = '<div class="toxin-slider js-toxin-slider"></div>';
const innerWrapperHTML = '<div class="toxin-slider__inner-wrapper js-toxin-slider__inner-wrapper"></div>';

export default class View {
  readonly $toxinSlider: JQuery;

  thumbA: Thumb;

  thumbB: Thumb;

  progressBar: ProgressBar;

  bar: Bar;

  state: ViewState = {
    start: 0,
    end: 0,
    step: 0,
    from: 0,
    to: 0,
    hasTwoValues: false,
    isVertical: false,
    progressBarHidden: false,
    tooltipHidden: false,
  };

  constructor(options: { $outerWrapper: JQuery, state: ViewState }) {
    const { $outerWrapper, state } = options;

    this.state = { ...this.state, ...state };

    const {
      from = 0,
      to = 0,
      hasTwoValues = false,
      isVertical = false,
      progressBarHidden = false,
      tooltipHidden = false,
    } = this.state;

    const $innerWrapper = $(innerWrapperHTML);
    const { min, max } = this.calculateRange();

    this.thumbA = new Thumb({
      $wrapper: $innerWrapper,
      state: {
        isVertical,
        tooltipHidden,
        value: hasTwoValues ? from : NaN,
        position: min,
        hidden: !hasTwoValues,
      },
    });

    this.thumbB = new Thumb({
      $wrapper: $innerWrapper,
      state: {
        isVertical,
        tooltipHidden,
        value: hasTwoValues ? to : from,
        position: max,
        hidden: false,
      },
    });

    this.progressBar = new ProgressBar({
      $wrapper: $innerWrapper,
      state: {
        min,
        max,
        isVertical,
        hidden: progressBarHidden,
      },
    });

    this.$toxinSlider = $(toxinSliderHTML);

    if (!hasTwoValues) {
      this.$toxinSlider.addClass('toxin-slider_range_single');
    }

    if (isVertical) {
      this.$toxinSlider.addClass('toxin-slider_direction_vertical');
    }

    this.$toxinSlider.append($innerWrapper);

    this.bar = new Bar({
      isVertical,
      $wrapper: this.$toxinSlider,
    });

    $outerWrapper.append(this.$toxinSlider);
  }

  update(state: ViewState): View {
    return this;
  }

  calculateRange(): { min: number; max: number; } {
    const {
      start = 0,
      end = 0,
      from = 0,
      to = 0,
      hasTwoValues = false,
    } = this.state;

    const scope = end - start;

    if (scope === 0) {
      return {
        min: 0,
        max: 0,
      };
    }

    const min = hasTwoValues
      ? (from - start) / scope
      : 0;

    const max = hasTwoValues
      ? (to - start) / scope
      : (from - start) / scope;

    return { min, max };
  }

  sortThumbs(): View {
    const {
      start = 0,
      end = 0,
      from = 0,
      to = 0,
      hasTwoValues = false,
    } = this.state;
    const { thumbA, thumbB } = this;

    if (hasTwoValues) {
      if (thumbA.getPosition() > thumbB.getPosition()) {
        [this.thumbA, this.thumbB] = [thumbB, thumbA];
      } else if (
        thumbA.getPosition() === thumbB.getPosition()
        &&
      )
    }
  }
}
