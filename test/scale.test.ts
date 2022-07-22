import $ from 'jquery';

import Scale from '../src/scale';

describe('Scale creation test', () => {
  const $wrapper = $('<div></div>');

  const scale = new Scale({
    $wrapper,
    state: {
      start: 1,
      end: 11,
      step: 3,
      hidden: false,
      units: '$',
    },
  });

  const { $scale } = scale;

  test('Scale creation test', () => {
    expect(typeof scale.update).toBe('function');
    expect($scale.hasClass('toxin-slider__scale_hidden')).toEqual(false);
    // common scale text: '1$' + '1$' + '4$' + '7$' + '10$' + '11$' + '11$'
    // the first and last element contain invisible double-spacers
    expect($('.js-toxin-slider__scale-value', $scale).text()).toEqual('1$1$4$7$10$11$11$');
  });

  test('Scale update test', () => {
    scale.update({
      start: 10,
      end: 30,
      step: 5,
      hidden: false,
    });
    // common scale text: '10' + '10' + '15' + '20' + '25' + '30' + '30'
    // the first and last element contain invisible double-spacers
    // eslint-disable-next-line fsd/jq-cache-dom-elements
    expect($('.js-toxin-slider__scale-value', $scale).text()).toEqual('10101520253030');

    scale.update({
      start: 23,
      end: 2,
      step: -4,
      hidden: true,
      units: '%',
    });
    expect($scale.hasClass('toxin-slider__scale_hidden')).toEqual(true);
    // common scale text: '23%' + '23%' + '19%' + '15%' + '11%' + '7%' + '3%' + '2%' + '2%'
    // the first and last element contain invisible double-spacers
    expect($('.js-toxin-slider__scale-value', $scale).text()).toEqual('23%23%19%15%11%7%3%2%2%');
  });

  test('Scale send message test', () => {
    const triggerEvent = $.Event('mousedown');

    let receivedMessage: ScaleMessage = {
      scaleValue: NaN,
    };

    $wrapper.on('toxin-slider.update', handleScaleClicking);

    function handleScaleClicking(event: JQuery.TriggeredEvent, message: ScaleMessage) {
      receivedMessage = message;
    }

    $($('.js-toxin-slider__scale-value', $scale).get()[4]).trigger(triggerEvent);

    expect(receivedMessage.scaleValue).toEqual(11);
  });
});
