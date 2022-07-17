import $ from 'jquery';

import '../../src/toxin-slider';
import '../../src/toxin-slider.scss';

import './index.scss';

$('.js-container').toxinSlider({
  start: 0,
  step: 1000,
  end: 10000,
  from: 17,
  to: 29,
  hasTwoValues: true,
  isVertical: true,
  units: 'кг.',
  // progressBarHidden: true,
  // tooltipHidden: true,
});
