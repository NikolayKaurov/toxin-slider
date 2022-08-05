import $ from 'jquery';
import BigNumber from 'bignumber.js';

import { ScaleState } from './toxin-slider-interface';

const scaleHTML = '<div class="toxin-slider__scale"></div>';
const itemHTML = '<div class="toxin-slider__scale-item"></div>';
const valueHTML = '<div class="toxin-slider__scale-value js-toxin-slider__scale-value"></div>';
const innerWrapperHTML = '<div class="toxin-slider__scale-inner-wrapper"></div>';

export default class Scale {
  readonly $scale: JQuery;

  state: ScaleState = {
    start: new BigNumber(NaN),
    end: new BigNumber(NaN),
    step: new BigNumber(NaN),
    hidden: false,
    units: '',
  };

  constructor(options: { $wrapper: JQuery; state: ScaleState }) {
    const { $wrapper, state } = options;

    this.$scale = $(scaleHTML);
    $wrapper.append(this.$scale);

    this.$scale.on('mousedown', '.toxin-slider__scale-value', this, handleScaleMousedown);

    this.update(state);
  }

  update(state: ScaleState) {
    const scaleShouldBeUpdated = (
      (this.state.start !== state.start)
      || (this.state.end !== state.end)
      || (this.state.step !== state.step)
    );

    if (scaleShouldBeUpdated) {
      this.$scale.empty().append(getInnerScale(state));
    }

    this.state = { ...this.state, ...state };

    if (state.hidden) {
      this.$scale.addClass('toxin-slider__scale_hidden');
    } else {
      this.$scale.removeClass('toxin-slider__scale_hidden');
    }

    return this;
  }
}

function handleScaleMousedown(event: JQuery.TriggeredEvent) {
  if (!(event.data instanceof Scale)) {
    return;
  }

  const { $scale } = event.data;
  const scaleValue = new BigNumber($(event.target).attr('data-value') ?? '');

  $scale.trigger('toxin-slider.update', {
    scaleValue,
    typeMessage: 'scaleMessage',
  });
}

function getInnerScale(state: ScaleState): JQuery {
  const {
    start,
    end,
    step,
    units,
  } = state;

  const scope = end.minus(start);

  const direction = scope.isNegative() ? -1 : 1;

  /* If the step is zero, the scale consists of extreme values only */
  const scaleStep = step.isZero()
    ? new BigNumber(scope)
    : new BigNumber(step).multipliedBy(direction);

  const modulo = step.isZero()
    ? new BigNumber(0)
    : scope.modulo(step);

  const endMinusModulo = end.minus(modulo);

  /* const format = {
    decimalSeparator: ',',
    groupSeparator: ' ',
    groupSize: 3,
    suffix: units,
  };
  BigNumber.config({ FORMAT: format }); */

  let cycleValue = start;
  const $innerScale = $(innerWrapperHTML)
    .append(
      $(itemHTML)
        .append(
          $(valueHTML)
            .text(cycleValue.toFormat())
            .attr('data-value', cycleValue.toNumber()),
        )
        // an invisible element is needed as a spacer
        .append(
          $(valueHTML)
            .text(cycleValue.toFormat())
            .addClass('toxin-slider__scale-value_invisible'),
        )
        .css(
          {
            'flex-grow': scaleStep.abs().toNumber(),
            'flex-basis': 0,
          },
        ),
    );

  do {
    cycleValue = cycleValue.plus(scaleStep);

    const $item = $(itemHTML);

    const isSpecialCase = (cycleValue.isEqualTo(endMinusModulo)) && (!cycleValue.isEqualTo(end));

    const outOfScale = (
      cycleValue.isGreaterThan(start) && cycleValue.isGreaterThan(end)
    ) || (
      cycleValue.isLessThan(start) && cycleValue.isLessThan(end)
    );

    if (isSpecialCase) {
      $item
        .addClass('toxin-slider__scale-item_penult')
        .css(
          {
            'flex-grow': scaleStep.abs().toNumber(),
            'flex-basis': 0,
          },
        );
    } else if (cycleValue.isEqualTo(end)) {
      $item.css({
        'flex-grow': scaleStep.abs().toNumber(),
        'flex-basis': 0,
      });
    } else if (outOfScale) {
      cycleValue = new BigNumber(end);
      $item.css({
        'flex-grow': modulo.abs().multipliedBy(2).toNumber(),
        'flex-basis': 0,
      });
    } else {
      $item.css({
        'flex-grow': scaleStep.abs().multipliedBy(2).toNumber(),
        'flex-basis': 0,
      });
    }

    // an invisible element is needed as a spacer
    if (cycleValue.isEqualTo(end)) {
      $item.append(
        $(valueHTML)
          .text(cycleValue.toFormat())
          .addClass('toxin-slider__scale-value_invisible'),
      );
    }

    $innerScale
      .append(
        $item
          .append(
            $(valueHTML)
              .text(cycleValue.toFormat())
              .attr('data-value', cycleValue.toNumber()),
          ),
      );
  } while (!cycleValue.isEqualTo(end));

  return $innerScale;
}
