import $ from 'jquery';

import '../../src/toxin-slider';
import '../../src/toxin-slider.scss';

import './index.scss';

$('.js-container').toxinSlider();

/*
$('.js-toxin-slider__thumb').on('mousedown', click);

function click(event: JQuery.TriggeredEvent) {
  event.stopPropagation();
  console.log(event.clientX);
}
*/

/*
function clickContainer(event: JQuery.TriggeredEvent) {
  console.log(`КОНТЕЙНЕР: ${event.clientX}`);
}
*/
