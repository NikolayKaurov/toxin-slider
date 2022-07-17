import $ from 'jquery';

import Model from '../src/model';
import View from '../src/view';
import Controller from '../src/controller';

describe('View test', () => {
  const state = {
    start: 14,
    end: 102,
    step: 5,
    from: 19,
    to: 24,
    isVertical: true,
    hasTwoValues: false,
    progressBarHidden: false,
    tooltipHidden: false,
    units: 'mm.',
  };

  const model = new Model(state);

  const view = new View({
    state: model.state,
    $outerWrapper: $(),
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const controller = new Controller({
    model,
    view,
  });

  const {
    $toxinSlider,
    $from,
    $to,
    thumbA,
    thumbB,
    progressBar,
  } = view;
  const { $thumb: $thumbA, $tooltip: $tooltipA } = thumbA;
  const { $tooltip: $tooltipB } = thumbB;
  const { $progressBar } = progressBar;
  const event = $.Event('toxin-slider.update');

  test('View creation test', () => {
    expect(typeof view.update).toEqual('function');
    expect($from.val()).toEqual('19');
    expect($to.val()).toEqual('24');
    expect(thumbA.getPosition()).toEqual(0);
    expect(thumbB.getPosition()).toEqual(500 / 88);
    expect($tooltipA.text()).toEqual('19mm.'); // This thumb is hidden because the slider has a single range
    expect($tooltipB.text()).toEqual('19mm.');
    expect($tooltipA.hasClass('toxin-slider__thumb-tooltip_hidden')).toEqual(false);
    expect($tooltipB.hasClass('toxin-slider__thumb-tooltip_hidden')).toEqual(false);
    expect($thumbA.hasClass('toxin-slider__thumb_hidden')).toEqual(true);
    expect($progressBar.hasClass('toxin-slider__progress-bar_hidden')).toEqual(false);
    expect($toxinSlider.hasClass('toxin-slider_direction_vertical')).toEqual(true);
    expect($toxinSlider.hasClass('toxin-slider_range_single')).toEqual(true);
  });

  test('View update state #1', () => {
    $toxinSlider.trigger(event, {
      start: 300,
      end: 363,
      step: 7,
      from: 310,
      to: 353,
      isVertical: false,
      hasTwoValues: true,
      progressBarHidden: true,
      tooltipHidden: true,
      units: 'sec.',
    });

    expect($from.val()).toEqual('307');
    expect($to.val()).toEqual('356');
    expect(thumbA.getPosition()).toEqual(100 / 9);
    expect(thumbB.getPosition()).toEqual(800 / 9);
    expect($tooltipA.text()).toEqual('307sec.');
    expect($tooltipB.text()).toEqual('356sec.');
    expect($tooltipA.hasClass('toxin-slider__thumb-tooltip_hidden')).toEqual(true);
    expect($tooltipB.hasClass('toxin-slider__thumb-tooltip_hidden')).toEqual(true);
    expect($thumbA.hasClass('toxin-slider__thumb_hidden')).toEqual(false);
    expect($progressBar.hasClass('toxin-slider__progress-bar_hidden')).toEqual(true);
    expect($toxinSlider.hasClass('toxin-slider_direction_vertical')).toEqual(false);
    expect($toxinSlider.hasClass('toxin-slider_range_single')).toEqual(false);
  });

  test('View update state #2', () => {
    $toxinSlider.trigger(event, {
      start: 600,
      end: 600,
      step: 7,
      from: 310,
      to: 353,
      isVertical: true,
      hasTwoValues: false,
      progressBarHidden: false,
      tooltipHidden: false,
      units: '$',
    });

    expect($from.val()).toEqual('600');
    expect($to.val()).toEqual('600');
    expect(thumbA.getPosition()).toEqual(0);
    expect(thumbB.getPosition()).toEqual(0);
    expect($tooltipA.text()).toEqual('600$');
    expect($tooltipB.text()).toEqual('600$');
    expect($tooltipA.hasClass('toxin-slider__thumb-tooltip_hidden')).toEqual(false);
    expect($tooltipB.hasClass('toxin-slider__thumb-tooltip_hidden')).toEqual(false);
    expect($thumbA.hasClass('toxin-slider__thumb_hidden')).toEqual(true);
    expect($progressBar.hasClass('toxin-slider__progress-bar_hidden')).toEqual(false);
    expect($toxinSlider.hasClass('toxin-slider_direction_vertical')).toEqual(true);
    expect($toxinSlider.hasClass('toxin-slider_range_single')).toEqual(true);
  });

  test('View update state #3', () => {
    $toxinSlider.trigger(event, {
      start: 800,
      end: 900,
      step: 10,
      from: 844,
      to: 822,
    });

    expect($from.val()).toEqual('840');
    expect($to.val()).toEqual('820');
    expect(thumbA.getPosition()).toEqual(0);
    expect(thumbB.getPosition()).toEqual(40);
    expect($tooltipA.text()).toEqual('840$');
    expect($tooltipB.text()).toEqual('840$');

    $toxinSlider.trigger(event, {
      hasTwoValues: true,
    });

    expect($from.val()).toEqual('820');
    expect($to.val()).toEqual('840');
    expect(thumbA.getPosition()).toEqual(20);
    expect(thumbB.getPosition()).toEqual(40);
    expect($tooltipA.text()).toEqual('820$');
    expect($tooltipB.text()).toEqual('840$');
  });

  test('View update state #4', () => {
    $toxinSlider.trigger(event, {
      innerOffset: 57,
      wrapperSize: 100,
      value: 820,
    });

    expect($from.val()).toEqual('840');
    expect($to.val()).toEqual('860');
    expect(thumbA.getPosition()).toEqual(40);
    expect(thumbB.getPosition()).toEqual(60);
    expect($tooltipA.text()).toEqual('840$');
    expect($tooltipB.text()).toEqual('860$');
  });
});
