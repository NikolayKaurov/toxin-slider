import $ from 'jquery';

const scaleHTML = '<div class="toxin-slider__scale"></div>';
const itemHTML = '<div class="toxin-slider__scale-item"></div>';
const valueHTML = '<div class="toxin-slider__scale-value js-toxin-slider__scale-value"></div>';
const innerWrapperHTML = '<div class="toxin-slider__scale-inner-wrapper"></div>';

export default class Scale {
  readonly $scale: JQuery;

  state: ScaleState = {
    start: NaN,
    end: NaN,
    step: NaN,
    hidden: false,
    units: '',
  };

  constructor(options: { $wrapper: JQuery; state: ScaleState }) {
    const { $wrapper, state } = options;

    this.$scale = $(scaleHTML);
    $wrapper.append(this.$scale);

    this.$scale.on(
      'mousedown',
      '.toxin-slider__scale-value',
      { $scale: this.$scale },
      handleScaleMousedown,
    );

    this.update(state);
  }

  update(state: ScaleState) {
    const isNewState = (
      (this.state.start !== state.start)
      || (this.state.end !== state.end)
      || (this.state.step !== state.step)
    );

    if (isNewState) {
      this.$scale.empty().append(getInnerScale(state));
      this.state = { ...this.state, ...state };
    }

    if (state.hidden) {
      this.$scale.addClass('toxin-slider__scale_hidden');
    } else {
      this.$scale.removeClass('toxin-slider__scale_hidden');
    }

    return this;
  }
}

function handleScaleMousedown(event: JQuery.TriggeredEvent) {
  const { $scale } = event.data as { $scale: JQuery };
  const scaleValue = Number($(event.target).attr('data-value'));

  $scale.trigger('toxin-slider.update', { scaleValue });
}

function getInnerScale(options: {
  start: number;
  end: number;
  step: number;
  units?: string;
}): JQuery {
  const {
    start,
    end,
    step,
    units = '',
  } = options;

  /* If the step is zero, the scale consists of extreme values only */
  const scaleStep = step === 0 ? end - start : step;

  const modulo = step === 0 ? 0 : end - start - step * Math.floor((end - start) / step);

  let cycleValue = start;
  const $innerScale = $(innerWrapperHTML)
    .append(
      $(itemHTML)
        .append(
          $(valueHTML)
            .text(
              `${new Intl.NumberFormat('ru-RU').format(cycleValue)}${units}`,
            )
            .attr('data-value', cycleValue),
        )
        // an invisible element is needed as a spacer
        .append(
          $(valueHTML)
            .text(
              `${new Intl.NumberFormat('ru-RU').format(cycleValue)}${units}`,
            )
            .addClass('toxin-slider__scale-value_invisible'),
        )
        .css(
          {
            'flex-grow': Math.abs(scaleStep),
            'flex-basis': '0',
          },
        ),
    );

  let i = 1;

  do {
    cycleValue = start + scaleStep * i;

    const $item = $(itemHTML);

    const isSpecialCase = (cycleValue === end - modulo) && (cycleValue !== end);
    const outOfScale = (
      cycleValue > start && cycleValue > end
    ) || (
      cycleValue < start && cycleValue < end
    );

    if (isSpecialCase) {
      $item
        .addClass('toxin-slider__scale-item_penult')
        .css(
          {
            'flex-grow': Math.abs(scaleStep),
            'flex-basis': '0',
          },
        );
    } else if (cycleValue === end) {
      $item.css({
        'flex-grow': Math.abs(scaleStep),
        'flex-basis': '0',
      });
    } else if (outOfScale) {
      cycleValue = end;
      $item.css({
        'flex-grow': Math.abs(2 * modulo),
        'flex-basis': '0',
      });
    } else {
      $item.css({
        'flex-grow': Math.abs(2 * scaleStep),
        'flex-basis': '0',
      });
    }

    // an invisible element is needed as a spacer
    if (cycleValue === end) {
      $item.append(
        $(valueHTML)
          .text(
            `${new Intl.NumberFormat('ru-RU').format(cycleValue)}${units}`,
          )
          .addClass('toxin-slider__scale-value_invisible'),
      );
    }

    $innerScale
      .append(
        $item
          .append(
            $(valueHTML)
              .text(
                `${new Intl.NumberFormat('ru-RU').format(cycleValue)}${units}`,
              )
              .attr('data-value', cycleValue),
          ),
      );

    i += 1;
  } while (cycleValue !== end);

  return $innerScale;
}
