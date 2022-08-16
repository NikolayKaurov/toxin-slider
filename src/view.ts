import $ from 'jquery';
import BigNumber from 'bignumber.js';

import Thumb from './thumb';
import ProgressBar from './progress-bar';
import Bar from './bar';
import Scale from './scale';

const toxinSliderHTML = '<div class="toxin-slider js-toxin-slider"></div>';
const innerWrapperHTML = '<div class="toxin-slider__inner-wrapper js-toxin-slider__inner-wrapper"></div>';
const inputHTML = '<input type="number" class="toxin-slider__input js-toxin-slider__input">';

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
      from,
      to,
      hasTwoValues,
      isVertical,
      progressBarHidden,
      tooltipHidden,
      scaleHidden,
      scaleStep,
      thumbsAreRestricted,
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
        restriction: thumbsAreRestricted ? max : new BigNumber(0),
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
        restriction: thumbsAreRestricted ? min : new BigNumber(0),
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
      .attr(
        'name',
        hasTwoValues ? `${name}-from` : `${name}`,
      )
      .val(from.toNumber());

    this.$to = $(inputHTML)
      .attr('name', `${name}-to`)
      .val(to.toNumber());

    this.$toxinSlider
      .append($innerWrapper)
      .append(this.$from)
      .append(this.$to);

    $outerWrapper.append(this.$toxinSlider);

    /*  The scale is appended to the slider AFTER appending the slider to the outer wrapper
        so that when the scale is displayed, the font size and scale dimensions can be computed */
    this.scale = new Scale({
      $wrapper: this.$toxinSlider,
      state: {
        start,
        end,
        units,
        isVertical,
        hidden: scaleHidden,
        step: scaleStep,
      },
    });

    this.$toxinSlider.trigger('toxin-slider.slide', state);
  }

  update(state: SliderState): View {
    const {
      start,
      end,
      from,
      to,
      hasTwoValues,
      isVertical,
      progressBarHidden,
      tooltipHidden,
      scaleHidden,
      scaleStep,
      thumbsAreRestricted,
      units,
      name,
    } = state;

    this.$from
      .attr(
        'name',
        hasTwoValues ? `${name}-from` : `${name}`,
      )
      .val(from.toNumber());

    this.$to
      .attr('name', `${name}-to`)
      .val(to.toNumber());

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
      restriction: thumbsAreRestricted ? max : new BigNumber(0),
      hidden: !hasTwoValues,
    });

    thumbB.update({
      isVertical,
      tooltipHidden,
      units,
      value: hasTwoValues ? to : from,
      position: max,
      restriction: thumbsAreRestricted ? min : new BigNumber(0),
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
      units,
      isVertical,
      hidden: scaleHidden,
      step: scaleStep,
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
