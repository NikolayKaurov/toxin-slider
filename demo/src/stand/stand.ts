import $ from 'jquery';

import '../../../src/toxin-slider';

class Stand {
  $stand: JQuery;

  $container: JQuery;

  $form: JQuery;

  $start: JQuery;

  $end: JQuery;

  $step: JQuery;

  $scaleStep: JQuery;

  $from: JQuery;

  $to: JQuery;

  $hasTwoValues: JQuery;

  $isVertical: JQuery;

  $progressBarHidden: JQuery;

  $tooltipHidden: JQuery;

  $scaleHidden: JQuery;

  $thumbsAreRestricted: JQuery;

  $units: JQuery;

  $lamp: JQuery;

  constructor(stand: HTMLElement) {
    this.$stand = $(stand);
    this.$container = $('.js-stand__container', this.$stand);
    this.$form = $('form.js-stand__form', this.$stand);
    this.$start = $('input.js-stand__input[name="start"]', this.$form);
    this.$end = $('input.js-stand__input[name="end"]', this.$form);
    this.$step = $('input.js-stand__input[name="step"]', this.$form);
    this.$scaleStep = $('input.js-stand__input[name="scale-step"]', this.$form);
    this.$from = $('input.js-stand__input[name="from"]', this.$form);
    this.$to = $('input.js-stand__input[name="to"]', this.$form);
    this.$hasTwoValues = $('input.js-stand__input[name="has-two-values"]', this.$form);
    this.$isVertical = $('input.js-stand__input[name="is-vertical"]', this.$form);
    this.$thumbsAreRestricted = $('input.js-stand__input[name="thumbs-are-restricted"]', this.$form);
    this.$progressBarHidden = $('input.js-stand__input[name="progress-bar-hidden"]', this.$form);
    this.$tooltipHidden = $('input.js-stand__input[name="tooltip-hidden"]', this.$form);
    this.$scaleHidden = $('input.js-stand__input[name="scale-hidden"]', this.$form);
    this.$units = $('input.js-stand__input[name="units"]', this.$form);
    this.$lamp = $('.js-stand__lamp', this.$stand);

    this.$container.on('toxin-slider.slide', this, handleContainerSlide);
    this.$form.on('submit', this, handleFormSubmit);

    this.$container.toxinSlider({
      start: this.$container.attr('data-start'),
      end: this.$container.attr('data-end'),
      step: this.$container.attr('data-step'),
      scaleStep: this.$container.attr('data-scale-step'),
      from: this.$container.attr('data-from'),
      to: this.$container.attr('data-to'),
      hasTwoValues: this.$container.attr('data-has-two-values') !== undefined,
      isVertical: this.$container.attr('data-is-vertical') !== undefined,
      thumbsAreRestricted: this.$container.attr('data-thumbs-are-restricted') !== undefined,
      progressBarHidden: this.$container.attr('data-progress-bar-hidden') !== undefined,
      tooltipHidden: this.$container.attr('data-tooltip-hidden') !== undefined,
      scaleHidden: this.$container.attr('data-scale-hidden') !== undefined,
      units: this.$container.attr('data-units'),
      name: this.$container.attr('data-name'),
    });
  }
}

function handleContainerSlide(event: JQuery.TriggeredEvent, options: OutsideOptions) {
  if (!(event.data instanceof Stand)) {
    return;
  }

  const stand = event.data;

  const {
    start = 0,
    end = 0,
    step = 0,
    scaleStep = 0,
    from = 0,
    to = 0,
    hasTwoValues = false,
    thumbsAreRestricted = false,
    isVertical = false,
    progressBarHidden = false,
    tooltipHidden = false,
    scaleHidden = false,
    units = '',
  } = options;

  const {
    $start,
    $end,
    $step,
    $scaleStep,
    $from,
    $to,
    $hasTwoValues,
    $isVertical,
    $progressBarHidden,
    $tooltipHidden,
    $scaleHidden,
    $thumbsAreRestricted,
    $units,
    $lamp,
  } = stand;

  $start.val(start);
  $end.val(end);
  $step.val(step);
  $scaleStep.val(scaleStep);
  $from.val(from);
  $to.val(to);
  $to.prop('disabled', !hasTwoValues);
  $hasTwoValues.prop('checked', hasTwoValues);
  $thumbsAreRestricted.prop('checked', thumbsAreRestricted);
  $isVertical.prop('checked', isVertical);
  $progressBarHidden.prop('checked', progressBarHidden);
  $tooltipHidden.prop('checked', tooltipHidden);
  $scaleHidden.prop('checked', scaleHidden);
  $units.val(units);

  $lamp.addClass('stand__lamp_enabled');
  setTimeout(() => $lamp.removeClass('stand__lamp_enabled'), 300);
}

function handleFormSubmit(event: JQuery.TriggeredEvent) {
  if (!(event.data instanceof Stand)) {
    return;
  }

  event.preventDefault();

  const stand = event.data;

  const {
    $container,
    $start,
    $end,
    $step,
    $scaleStep,
    $from,
    $to,
    $hasTwoValues,
    $isVertical,
    $progressBarHidden,
    $tooltipHidden,
    $scaleHidden,
    $thumbsAreRestricted,
    $units,
  } = stand;

  $container.toxinSlider({
    start: Number($start.val()),
    end: Number($end.val()),
    step: Number($step.val()),
    scaleStep: Number($scaleStep.val()),
    from: Number($from.val()),
    to: Number($to.val()),
    hasTwoValues: $hasTwoValues.prop('checked') === true,
    isVertical: $isVertical.prop('checked') === true,
    thumbsAreRestricted: $thumbsAreRestricted.prop('checked') === true,
    progressBarHidden: $progressBarHidden.prop('checked') === true,
    tooltipHidden: $tooltipHidden.prop('checked') === true,
    scaleHidden: $scaleHidden.prop('checked') === true,
    units: String($units.val()),
  });
}

$('.js-stand').each((index, stand) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const jsStand = new Stand(stand);
});
