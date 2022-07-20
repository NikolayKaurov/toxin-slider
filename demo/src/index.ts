import $ from 'jquery';

import '../../src/toxin-slider';
import '../../src/toxin-slider.scss';

import './index.scss';

$('.js-container').toxinSlider({
  start: -10,
  step: 4,
  end: 11,
  from: 1,
  to: 4,
  hasTwoValues: true,
  isVertical: true,
  units: '',
  // progressBarHidden: true,
  // tooltipHidden: true,
  // scaleHidden: true,
});
