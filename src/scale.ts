import $ from 'jquery';

const scaleHTML = '<div class="toxin-slider__scale"></div>';
const itemHTML = '<div class="toxin-slider__scale-item"></div>';
const valueHTML = '<div class="toxin-slider__scale-value"></div>';
const innerWrapperHTML = '<div class="toxin-slider__scale-inner-wrapper"></div>';

export default class Scale {
  readonly $scale: JQuery;

  state: ScaleState = {
    start: 0,
    end: 0,
    step: 0,
    hidden: false,
    units: '',
  };

  constructor(options: { $wrapper: JQuery; state: ScaleState }) {
    const { $wrapper, state } = options;

    this.$scale = $(scaleHTML);
    $wrapper.append(this.$scale);

    this.update(state);
  }

  update(state: ScaleState) {
    const scaleChange = (
      (this.state.start !== state.start)
      || (this.state.end !== state.end)
      || (this.state.step !== state.step)
    );

    if (scaleChange) {
      this.$scale.empty().append(getInnerScale(state));
      this.state = { ...this.state, ...state };
    }

    if (state.hidden) {
      this.$scale.addClass('toxin-slider__scale_hidden');
    } else {
      this.$scale.removeClass('toxin-slider__scale_hidden');
    }
  }
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
          $(valueHTML).text(
            `${new Intl.NumberFormat('ru-RU').format(cycleValue)}${units}`,
          ),
        ),
    );

  let i = 1;

  do {
    cycleValue = start + scaleStep * i;

    const $item = $(itemHTML);

    const specialCase = (cycleValue === end - modulo) && (cycleValue !== end);
    if (specialCase) {
      $item.addClass('toxin-slider__scale-item_penult');
    }

    const outOfScale = (
      cycleValue > start && cycleValue > end
    ) || (
      cycleValue < start && cycleValue < end
    );
    if (outOfScale) {
      cycleValue = end;
      $item.css({
        'flex-grow': (2 * modulo) / step,
        'flex-basis': '0',
      });
    }

    $innerScale
      .append(
        $item
          .append(
            $(valueHTML).text(
              `${new Intl.NumberFormat('ru-RU').format(cycleValue)}${units}`,
            ),
          ),
      );

    i += 1;
  } while (cycleValue !== end);

  return $innerScale;
}
