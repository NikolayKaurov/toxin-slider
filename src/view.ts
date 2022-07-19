import $ from 'jquery';

import Thumb from './thumb';
import ProgressBar from './progress-bar';
import Bar from './bar';
import Scale from './scale';

const toxinSliderHTML = '<div class="toxin-slider js-toxin-slider"></div>';
const innerWrapperHTML = '<div class="toxin-slider__inner-wrapper"></div>';
const inputHTML = '<input type="number" class="toxin-slider__input">';

export default class View {
  readonly $toxinSlider: JQuery;

  readonly $from: JQuery;

  readonly $to: JQuery;

  thumbA: Thumb;

  thumbB: Thumb;

  progressBar: ProgressBar;

  scale: Scale;

  private readonly bar: Bar;

  state: ViewState = {
    start: 0,
    end: 0,
    step: 0,
    from: 0,
    to: 0,
    hasTwoValues: false,
    isVertical: false,
    progressBarHidden: false,
    scaleHidden: false,
    tooltipHidden: false,
    units: '',
    name: 'undefined-name',
  };

  constructor(options: { $outerWrapper: JQuery, state: ViewState }) {
    const { $outerWrapper, state } = options;

    this.state = { ...this.state, ...state };
    const {
      start = 0,
      end = 0,
      step = 0,
      from = 0,
      to = 0,
      hasTwoValues = false,
      isVertical = false,
      progressBarHidden = false,
      tooltipHidden = false,
      scaleHidden = false,
      units = '',
      name = 'undefined-name',
    } = this.state;

    const $innerWrapper = $(innerWrapperHTML);

    const { min, max } = this.calculateRange();

    this.thumbA = new Thumb({
      $wrapper: $innerWrapper,
      state: {
        isVertical,
        tooltipHidden,
        units,
        value: from,
        position: min,
        hidden: !hasTwoValues,
      },
    });

    this.thumbB = new Thumb({
      $wrapper: $innerWrapper,
      state: {
        isVertical,
        tooltipHidden,
        units,
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

    this.bar = new Bar({
      isVertical,
      $wrapper: this.$toxinSlider,
    });

    this.$from = $(inputHTML)
      .attr('name', `${name}-from`)
      .val(from);
    this.$to = $(inputHTML)
      .attr('name', `${name}-to`)
      .val(to);

    this.$toxinSlider
      .append($innerWrapper)
      .append(this.$from)
      .append(this.$to);

    this.scale = new Scale({
      $wrapper: this.$toxinSlider,
      state: {
        start,
        end,
        step,
        units,
        hidden: scaleHidden,
      },
    });

    $outerWrapper.append(this.$toxinSlider);
  }

  update(state: ViewState): View {
    this.state = { ...this.state, ...state };
    const {
      from = 0,
      to = 0,
      hasTwoValues = false,
      isVertical = false,
      progressBarHidden = false,
      tooltipHidden = false,
      units = '',
    } = this.state;

    this.$from.val(from);
    this.$to.val(to);

    if (!hasTwoValues) {
      this.$toxinSlider.addClass('toxin-slider_range_single');
    } else {
      this.$toxinSlider.removeClass('toxin-slider_range_single');
    }

    if (isVertical) {
      this.$toxinSlider.addClass('toxin-slider_direction_vertical');
    } else {
      this.$toxinSlider.removeClass('toxin-slider_direction_vertical');
    }

    const { min, max } = this.sortThumbs().calculateRange();
    const {
      thumbA,
      thumbB,
      progressBar,
      bar,
    } = this;

    thumbA.update({
      isVertical,
      tooltipHidden,
      units,
      value: from,
      position: min,
      hidden: !hasTwoValues,
    });

    thumbB.update({
      isVertical,
      tooltipHidden,
      units,
      value: hasTwoValues ? to : from,
      position: max,
      hidden: false,
    });

    progressBar.update({
      isVertical,
      min: thumbA.getPosition(),
      max: thumbB.getPosition(),
      hidden: progressBarHidden,
    });

    bar.update(isVertical);

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
      ? (100 * (from - start)) / scope
      : 0;

    const max = hasTwoValues
      ? (100 * (to - start)) / scope
      : (100 * (from - start)) / scope;

    return { min, max };
  }

  sortThumbs(): View {
    const { hasTwoValues = false } = this.state;
    const { thumbA, thumbB } = this;

    if (hasTwoValues) {
      if (thumbA.getPosition() > thumbB.getPosition()) {
        [this.thumbA, this.thumbB] = [thumbB, thumbA];
      } else if (thumbA.getPosition() === thumbB.getPosition()) {
        if (thumbA.getDirection() > thumbB.getDirection()) {
          [this.thumbA, this.thumbB] = [thumbB, thumbA];
        }
      }
    }

    return this;
  }
}
