import $ from 'jquery';

import '../../src/toxin-slider';
import '../../src/toxin-slider.scss';

import './index.scss';

$('.js-container').toxinSlider({
  start: 3,
  // step: 1,
  end: 100,
  from: 17,
  to: 29,
  hasTwoValues: true,
  // isVertical: true,
  // progressBarHidden: true,
  // tooltipHidden: true,
});
