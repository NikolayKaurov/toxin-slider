import $ from 'jquery';

import '../../src/toxin-slider';
import '../../src/toxin-slider.scss';

import './index.scss';

$('.js-container').toxinSlider();

/*
$('.js-toxin-slider__thumb').on('mousedown', click);

function click(event: JQuery.TriggeredEvent) {
  console.log(event.clientX);
}
*/
