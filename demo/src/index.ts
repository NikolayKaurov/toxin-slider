import $ from 'jquery';

import '../../src/toxin-slider';
import '../../src/toxin-slider.scss';

import './index.scss';

const $config1 = $('.js-config-1');
const $container1 = $('.js-container-1');
const $start1 = $('.input[name="start-1"]', $config1);
const $end1 = $('.input[name="end-1"]', $config1);
const $step1 = $('.input[name="step-1"]', $config1);
const $from1 = $('.input[name="from-1"]', $config1);
const $to1 = $('.input[name="to-1"]', $config1);
const $hasTwoValues1 = $('input[name="hasTwoValues-1"]', $config1);
const $isVertical1 = $('input[name="isVertical-1"]', $config1);
const $scaleHidden1 = $('input[name="scaleHidden-1"]', $config1);
const $progressBarHidden1 = $('input[name="progressBarHidden-1"]', $config1);
const $tooltipHidden1 = $('input[name="tooltipHidden-1"]', $config1);

$container1.on('toxin-slider.slide', handleContainer1Slide);
function handleContainer1Slide(event: JQuery.TriggeredEvent, options: OutsideOptions) {
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
  } = options;

  $start1.val(Math.round(Number(start) * 1000) / 1000);
  $end1.val(Math.round(Number(end) * 1000) / 1000);
  $step1.val(Math.round(Number(step) * 1000) / 1000);
  $from1.val(Math.round(Number(from) * 1000) / 1000);
  $to1.val(Math.round(Number(to) * 1000) / 1000);
  $to1.prop('disabled', !hasTwoValues);
  $hasTwoValues1.prop('checked', hasTwoValues);
  $isVertical1.prop('checked', isVertical);
  $scaleHidden1.prop('checked', scaleHidden);
  $progressBarHidden1.prop('checked', progressBarHidden);
  $tooltipHidden1.prop('checked', tooltipHidden);
}

$config1.on('submit', handleConfig1submit);
function handleConfig1submit(event: JQuery.TriggeredEvent) {
  event.preventDefault();
  $container1.toxinSlider({
    start: Number($start1.val()),
    step: Number($step1.val()),
    end: Number($end1.val()),
    from: Number($from1.val()),
    to: Number($to1.val()),
    hasTwoValues: $hasTwoValues1.prop('checked') === true,
    isVertical: $isVertical1.prop('checked') === true,
    progressBarHidden: $progressBarHidden1.prop('checked') === true,
    tooltipHidden: $tooltipHidden1.prop('checked') === true,
    scaleHidden: $scaleHidden1.prop('checked') === true,
  });
}

const $config2 = $('.js-config-2');
const $container2 = $('.js-container-2');
const $start2 = $('.input[name="start-2"]', $config2);
const $end2 = $('.input[name="end-2"]', $config2);
const $step2 = $('.input[name="step-2"]', $config2);
const $from2 = $('.input[name="from-2"]', $config2);
const $to2 = $('.input[name="to-2"]', $config2);
const $hasTwoValues2 = $('input[name="hasTwoValues-2"]', $config2);
const $isVertical2 = $('input[name="isVertical-2"]', $config2);
const $scaleHidden2 = $('input[name="scaleHidden-2"]', $config2);
const $progressBarHidden2 = $('input[name="progressBarHidden-2"]', $config2);
const $tooltipHidden2 = $('input[name="tooltipHidden-2"]', $config2);

$container2.on('toxin-slider.slide', handleContainer2Slide);
function handleContainer2Slide(event: JQuery.TriggeredEvent, options: OutsideOptions) {
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
  } = options;

  $start2.val(Math.round(Number(start) * 1000) / 1000);
  $end2.val(Math.round(Number(end) * 1000) / 1000);
  $step2.val(Math.round(Number(step) * 1000) / 1000);
  $from2.val(Math.round(Number(from) * 1000) / 1000);
  $to2.val(Math.round(Number(to) * 1000) / 1000);
  $to2.prop('disabled', !hasTwoValues);
  $hasTwoValues2.prop('checked', hasTwoValues);
  $isVertical2.prop('checked', isVertical);
  $scaleHidden2.prop('checked', scaleHidden);
  $progressBarHidden2.prop('checked', progressBarHidden);
  $tooltipHidden2.prop('checked', tooltipHidden);
}

$config2.on('submit', handleConfig2submit);
function handleConfig2submit(event: JQuery.TriggeredEvent) {
  event.preventDefault();
  $container2.toxinSlider({
    start: Number($start2.val()),
    step: Number($step2.val()),
    end: Number($end2.val()),
    from: Number($from2.val()),
    to: Number($to2.val()),
    hasTwoValues: $hasTwoValues2.prop('checked') === true,
    isVertical: $isVertical2.prop('checked') === true,
    progressBarHidden: $progressBarHidden2.prop('checked') === true,
    tooltipHidden: $tooltipHidden2.prop('checked') === true,
    scaleHidden: $scaleHidden2.prop('checked') === true,
  });
}

const $config3 = $('.js-config-3');
const $container3 = $('.js-container-3');
const $start3 = $('.input[name="start-3"]', $config3);
const $end3 = $('.input[name="end-3"]', $config3);
const $step3 = $('.input[name="step-3"]', $config3);
const $from3 = $('.input[name="from-3"]', $config3);
const $to3 = $('.input[name="to-3"]', $config3);
const $hasTwoValues3 = $('input[name="hasTwoValues-3"]', $config3);
const $isVertical3 = $('input[name="isVertical-3"]', $config3);
const $scaleHidden3 = $('input[name="scaleHidden-3"]', $config3);
const $progressBarHidden3 = $('input[name="progressBarHidden-3"]', $config3);
const $tooltipHidden3 = $('input[name="tooltipHidden-3"]', $config3);

$container3.on('toxin-slider.slide', handleContainer3Slide);
function handleContainer3Slide(event: JQuery.TriggeredEvent, options: OutsideOptions) {
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
  } = options;

  $start3.val(Math.round(Number(start) * 1000) / 1000);
  $end3.val(Math.round(Number(end) * 1000) / 1000);
  $step3.val(Math.round(Number(step) * 1000) / 1000);
  $from3.val(Math.round(Number(from) * 1000) / 1000);
  $to3.val(Math.round(Number(to) * 1000) / 1000);
  $to3.prop('disabled', !hasTwoValues);
  $hasTwoValues3.prop('checked', hasTwoValues);
  $isVertical3.prop('checked', isVertical);
  $scaleHidden3.prop('checked', scaleHidden);
  $progressBarHidden3.prop('checked', progressBarHidden);
  $tooltipHidden3.prop('checked', tooltipHidden);
}

$config3.on('submit', handleConfig3submit);
function handleConfig3submit(event: JQuery.TriggeredEvent) {
  event.preventDefault();
  $container3.toxinSlider({
    start: Number($start3.val()),
    step: Number($step3.val()),
    end: Number($end3.val()),
    from: Number($from3.val()),
    to: Number($to3.val()),
    hasTwoValues: $hasTwoValues3.prop('checked') === true,
    isVertical: $isVertical3.prop('checked') === true,
    progressBarHidden: $progressBarHidden3.prop('checked') === true,
    tooltipHidden: $tooltipHidden3.prop('checked') === true,
    scaleHidden: $scaleHidden3.prop('checked') === true,
  });
}

const $config4 = $('.js-config-4');
const $container4 = $('.js-container-4');
const $start4 = $('.input[name="start-4"]', $config4);
const $end4 = $('.input[name="end-4"]', $config4);
const $step4 = $('.input[name="step-4"]', $config4);
const $from4 = $('.input[name="from-4"]', $config4);
const $to4 = $('.input[name="to-4"]', $config4);
const $hasTwoValues4 = $('input[name="hasTwoValues-4"]', $config4);
const $isVertical4 = $('input[name="isVertical-4"]', $config4);
const $scaleHidden4 = $('input[name="scaleHidden-4"]', $config4);
const $progressBarHidden4 = $('input[name="progressBarHidden-4"]', $config4);
const $tooltipHidden4 = $('input[name="tooltipHidden-4"]', $config4);

$container4.on('toxin-slider.slide', handleContainer4Slide);
function handleContainer4Slide(event: JQuery.TriggeredEvent, options: OutsideOptions) {
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
  } = options;

  $start4.val(Math.round(Number(start) * 1000) / 1000);
  $end4.val(Math.round(Number(end) * 1000) / 1000);
  $step4.val(Math.round(Number(step) * 1000) / 1000);
  $from4.val(Math.round(Number(from) * 1000) / 1000);
  $to4.val(Math.round(Number(to) * 1000) / 1000);
  $to4.prop('disabled', !hasTwoValues);
  $hasTwoValues4.prop('checked', hasTwoValues);
  $isVertical4.prop('checked', isVertical);
  $scaleHidden4.prop('checked', scaleHidden);
  $progressBarHidden4.prop('checked', progressBarHidden);
  $tooltipHidden4.prop('checked', tooltipHidden);
}

$config4.on('submit', handleConfig4submit);
function handleConfig4submit(event: JQuery.TriggeredEvent) {
  event.preventDefault();
  $container4.toxinSlider({
    start: Number($start4.val()),
    step: Number($step4.val()),
    end: Number($end4.val()),
    from: Number($from4.val()),
    to: Number($to4.val()),
    hasTwoValues: $hasTwoValues4.prop('checked') === true,
    isVertical: $isVertical4.prop('checked') === true,
    progressBarHidden: $progressBarHidden4.prop('checked') === true,
    tooltipHidden: $tooltipHidden4.prop('checked') === true,
    scaleHidden: $scaleHidden4.prop('checked') === true,
  });
}

$container1.toxinSlider({
  start: -4,
  step: 2,
  end: 14,
  from: 1,
  to: 10,
  hasTwoValues: true,
  units: ' коп.',
  scaleHidden: true,
  name: 'slider-1',
  thumbsAreRestricted: true,
});

$container2.toxinSlider({
  start: -40,
  step: 5,
  end: 50,
  from: 20,
  to: 10,
  isVertical: true,
  units: ' °C',
  tooltipHidden: true,
  name: 'thermometer',
  thumbsAreRestricted: true,
});

$container3.toxinSlider({
  start: 19,
  step: 3.25,
  end: 0,
  from: 1,
  to: 10,
  hasTwoValues: true,
  units: '',
  name: 'slider-2',
  thumbsAreRestricted: true,
});

$container4.toxinSlider({
  start: 80,
  step: 1,
  end: 105,
  from: 81,
  to: 102,
  hasTwoValues: true,
  units: '',
  name: 'slider-3',
  isVertical: true,
  thumbsAreRestricted: true,
});
