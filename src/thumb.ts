import $ from 'jquery';

const thumbHTML = '<div class="toxin-slider__thumb" tabindex="0"></div>';
const tooltipHTML = '<div class="toxin-slider__thumb-tooltip"></div>';

export default class Thumb {
  $wrapper: JQuery;

  $thumb: JQuery;

  $tooltip: JQuery;

  state: ThumbState = {
    value: 0,
    position: 0,
    isVertical: false,
    hidden: false,
    tooltipIsHidden: false,
  };

  constructor(options: { $wrapper: JQuery; state: ThumbState }) {
    const { $wrapper, state } = options;

    this.$tooltip = $(tooltipHTML);
    this.$thumb = $(thumbHTML).append(this.$tooltip);
    this.$wrapper = $wrapper.append(this.$thumb);

    this.update(state);
  }

  update(state: ThumbState) {
    this.state = state;

    const axis = state.isVertical ? 'Y' : 'X';
    this.$tooltip.text(state.value);
    this.$thumb.css('transform', `translate${axis}(${state.position}%)`);
  }
}
