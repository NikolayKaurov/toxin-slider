import $ from 'jquery';
import BigNumber from 'bignumber.js';

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

  readonly progressBar: ProgressBar;

  readonly scale: Scale;

  readonly bar: Bar;

  constructor(options: { $outerWrapper: JQuery, state: SliderState }) {
    const { $outerWrapper, state } = options;

    const {
      start,
      end,
      step,
      from,
      to,
      hasTwoValues,
      isVertical,
      progressBarHidden,
      tooltipHidden,
      scaleHidden,
      units,
      name,
    } = state;

    const $innerWrapper = $(innerWrapperHTML);

    const { min, max } = calculateRange(state);

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

    if (!hasTwoValues && !progressBarHidden) {
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
      .val(from.toNumber());
    this.$to = $(inputHTML)
      .attr('name', `${name}-to`)
      .val(to.toNumber());

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

    this.$toxinSlider.trigger('toxin-slider.slide', state);
  }

  update(state: SliderState): View {
    const {
      start,
      end,
      step,
      from,
      to,
      hasTwoValues,
      isVertical,
      progressBarHidden,
      tooltipHidden,
      scaleHidden,
      units,
    } = state;

    this.$from.val(from.toNumber());
    this.$to.val(to.toNumber());

    if (!hasTwoValues && !progressBarHidden) {
      this.$toxinSlider.addClass('toxin-slider_range_single');
    } else {
      this.$toxinSlider.removeClass('toxin-slider_range_single');
    }

    if (isVertical) {
      this.$toxinSlider.addClass('toxin-slider_direction_vertical');
    } else {
      this.$toxinSlider.removeClass('toxin-slider_direction_vertical');
    }

    this.sortThumbs(state);

    const { min, max } = calculateRange(state);

    const {
      thumbA,
      thumbB,
      progressBar,
      bar,
      scale,
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

    scale.update({
      start,
      end,
      step,
      units,
      hidden: scaleHidden,
    });

    return this;
  }

  sortThumbs(state: SliderState): View {
    const { hasTwoValues } = state;
    const { thumbA, thumbB } = this;

    if (hasTwoValues) {
      if (thumbA.getPosition().isGreaterThan(thumbB.getPosition())) {
        [this.thumbA, this.thumbB] = [thumbB, thumbA];
      } else if (thumbA.getPosition().isEqualTo(thumbB.getPosition())) {
        if (thumbA.getDirection() > thumbB.getDirection()) {
          [this.thumbA, this.thumbB] = [thumbB, thumbA];
        }
      }
    }

    return this;
  }
}

function calculateRange(state: SliderState): { min: BigNumber; max: BigNumber; } {
  const {
    start,
    end,
    from,
    to,
    hasTwoValues,
  } = state;

  const scope = end.minus(start);

  if (scope.isZero()) {
    return {
      min: new BigNumber(0),
      max: new BigNumber(0),
    };
  }

  const min = hasTwoValues
    ? from.minus(start).multipliedBy(100).dividedBy(scope)
    : new BigNumber(0);

  const max = hasTwoValues
    ? to.minus(start).multipliedBy(100).dividedBy(scope)
    : from.minus(start).multipliedBy(100).dividedBy(scope);

  return { min, max };
}
