import $ from 'jquery';

import '../../src/toxin-slider';
import '../../src/toxin-slider.scss';

import './index.scss';

$('.js-container').toxinSlider({
  start: 0,
  step: 50,
  end: 330,
  from: 17,
  to: 29,
  hasTwoValues: true,
  // isVertical: true,
  units: 'кг.',
  // progressBarHidden: true,
  // tooltipHidden: true,
});
