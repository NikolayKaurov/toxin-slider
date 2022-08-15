import $ from 'jquery';
import BigNumber from 'bignumber.js';

const scaleHTML = '<div class="toxin-slider__scale js-toxin-slider__scale"></div>';
const itemHTML = '<div class="toxin-slider__scale-item js-toxin-slider__scale-item"></div>';
const valueHTML = '<div class="toxin-slider__scale-value js-toxin-slider__scale-value"></div>';
const innerWrapperHTML = '<div class="toxin-slider__scale-inner-wrapper js-toxin-slider__scale-inner-wrapper"></div>';

const format = {
  decimalSeparator: ',',
  groupSeparator: ' ',
  groupSize: 3,
  suffix: '',
};

const decimalPlaces = 5;

// font width to height ratio
const fontWidth = 0.5;

// If the scale step is zero, the number of scale divisions is a power of 2, maximum 16
const defaultNumDivisions = 16;

export default class Scale {
  readonly $scale: JQuery;

  state: ScaleState = {
    start: new BigNumber(NaN),
    end: new BigNumber(NaN),
    step: new BigNumber(NaN),
    isVertical: false,
    hidden: false,
    units: '',
  };

  constructor(options: { $wrapper: JQuery; state: ScaleState }) {
    const { $wrapper, state } = options;

    this.$scale = $(scaleHTML);
    $wrapper.append(this.$scale);

    this.$scale.on('mousedown', '.js-toxin-slider__scale-value', this, handleScaleMousedown);

    this.update(state);
  }

  update(state: ScaleState) {
    const {
      start,
      end,
      step,
      units,
      isVertical,
    } = this.state;

    const scaleShouldBeUpdated = (
      !start.isEqualTo(state.start)
      || !end.isEqualTo(state.end)
      || !step.isEqualTo(state.step)
      || (units !== state.units)
      || (isVertical !== state.isVertical)
    );

    if (scaleShouldBeUpdated) {
      this.state = { ...state };
      this.$scale.empty().append(this.getInnerScale());
    }

    if (state.hidden) {
      this.$scale.addClass('toxin-slider__scale_hidden');
    } else {
      this.$scale.removeClass('toxin-slider__scale_hidden');
    }

    return this;
  }

  getInnerScale(): JQuery {
    const {
      start,
      end,
      step,
      units,
    } = this.state;

    const scaleStep = this.getScaleStep();

    const scope = end.minus(start);

    const modulo = step.isZero()
      ? new BigNumber(0)
      : scope.modulo(step);

    const endMinusModulo = end.minus(modulo);

    const fmt = { ...format, ...{ suffix: units } };

    let cycleValue = new BigNumber(start);
    const $innerScale = $(innerWrapperHTML)
      .append(
        $(itemHTML)
          .append(
            $(valueHTML)
              .text(cycleValue.dp(decimalPlaces).toFormat(fmt))
              .attr('data-value', cycleValue.toNumber()),
          )
          // an invisible element is needed as a spacer
          .append(
            $(valueHTML)
              .text(cycleValue.dp(decimalPlaces).toFormat(fmt))
              .addClass('toxin-slider__scale-value_invisible'),
          )
          .css(
            {
              'flex-grow': scaleStep.abs().toNumber(),
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
            },
          );
      } else if (cycleValue.isEqualTo(end)) {
        $item
          .css({
            'flex-grow': scaleStep.abs().toNumber(),
          });
      } else if (outOfScale) {
        cycleValue = new BigNumber(end);
        $item
          .css({
            'flex-grow': modulo.abs().multipliedBy(2).toNumber(),
          });
      } else {
        $item
          .css({
            'flex-grow': scaleStep.abs().multipliedBy(2).toNumber(),
          });
      }

      // an invisible element is needed as a spacer
      if (cycleValue.isEqualTo(end)) {
        $item.append(
          $(valueHTML)
            .text(cycleValue.dp(decimalPlaces).toFormat(fmt))
            .addClass('toxin-slider__scale-value_invisible'),
        );
      }

      $innerScale
        .append(
          $item
            .append(
              $(valueHTML)
                .text(cycleValue.dp(decimalPlaces).toFormat(fmt))
                .attr('data-value', cycleValue.toNumber()),
            ),
        );
    } while (!cycleValue.isEqualTo(end));

    return $innerScale;
  }

  getScaleStep(): BigNumber {
    const {
      start,
      end,
      step,
      isVertical,
    } = this.state;

    const scope = end.minus(start);

    const direction = scope.isNegative() ? -1 : 1;

    const unsignedScope = scope.abs();

    const size = isVertical
      ? new BigNumber(this.$scale.outerHeight() ?? 0)
      : new BigNumber(this.$scale.outerWidth() ?? 0);

    const maxValueSize = this.getMaxValueSize();

    let numberDivisions = size.dividedToIntegerBy(maxValueSize.isLessThan(1) ? 1 : maxValueSize);

    if (numberDivisions.isLessThan(1)) {
      numberDivisions = new BigNumber(1);
    }

    const perfectNumberDivisions = step.isZero()
      ? new BigNumber(defaultNumDivisions) // If the slider step is 0, the scale step is forced
      : unsignedScope.dividedToIntegerBy(step);

    if (perfectNumberDivisions.isLessThanOrEqualTo(numberDivisions)) {
      numberDivisions = new BigNumber(perfectNumberDivisions);
    } else {
      while (!perfectNumberDivisions.modulo(numberDivisions).isZero()) {
        numberDivisions = numberDivisions.minus(1);
      }
    }

    return unsignedScope.minus(step.isZero() ? 0 : unsignedScope.modulo(step))
      .dividedBy(numberDivisions)
      .multipliedBy(direction);
  }

  getMaxValueSize(): BigNumber {
    const { isVertical } = this.state;
    const { $scale } = this;

    const lineHeight = parseInt($scale.css('line-height'), 10);
    const fontSize = parseInt($scale.css('font-size'), 10);

    if (isVertical) {
      return new BigNumber(Number.isNaN(lineHeight) ? 1 : lineHeight);
    }

    return this.getMaxValueLength()
      .multipliedBy(new BigNumber(Number.isNaN(fontSize) ? 1 : fontSize))
      .multipliedBy(fontWidth);
  }

  getMaxValueLength(): BigNumber {
    const {
      start,
      end,
      step,
      units,
    } = this.state;

    const hasMinus = start.isNegative() || end.isNegative()
      ? 1
      : 0;

    const unitsLength = units.length;

    const startAbs = start.abs();
    const endAbs = end.abs();
    // step is considered greater than or equal to zero
    const stepAbs = step.isZero()
      // If the slider step is 0, the scale step is forced
      ? end.minus(start).abs().dividedBy(defaultNumDivisions)
      : step;

    const startInteger = startAbs.integerValue(BigNumber.ROUND_FLOOR);
    const endInteger = endAbs.integerValue(BigNumber.ROUND_FLOOR);
    const stepInteger = stepAbs.integerValue(BigNumber.ROUND_FLOOR);

    const integerLength = startInteger.isGreaterThan(endInteger)
      ? startInteger.toFormat(format).length
      : endInteger.toFormat(format).length;

    const startFractionLength = startAbs.minus(startInteger)
      .dp(decimalPlaces)
      .toFormat(format)
      .length - 1; // Zero at the beginning of a fraction does not count
    const endFractionLength = endAbs.minus(endInteger)
      .dp(decimalPlaces)
      .toFormat(format)
      .length - 1;
    const stepFractionLength = stepAbs.minus(stepInteger)
      .dp(decimalPlaces)
      .toFormat(format)
      .length - 1;

    const fractionLength = (() => {
      if (startFractionLength > endFractionLength) {
        if (startFractionLength > stepFractionLength) {
          return startFractionLength;
        }

        return stepFractionLength;
      }

      if (endFractionLength > stepFractionLength) {
        return endFractionLength;
      }

      return stepFractionLength;
    })();

    return new BigNumber(integerLength)
      .plus(fractionLength)
      .plus(hasMinus)
      .plus(unitsLength)
      .plus(1); // One additional character, as a space between scale values
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
