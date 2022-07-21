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
function handleContainer1Slide(event: JQuery.TriggeredEvent, state: ViewState) {
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
  } = state;

  $start1.val(start);
  $end1.val(end);
  $step1.val(step);
  $from1.val(from);
  $to1.val(to);
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

$container1.toxinSlider({
  start: -14,
  step: 0.1,
  end: 14,
  from: 1,
  to: 10,
  hasTwoValues: true,
  // isVertical: true,
  units: '',
  // progressBarHidden: true,
  // tooltipHidden: true,
  scaleHidden: true,
  name: 'slider-1',
});
