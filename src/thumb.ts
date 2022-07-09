import $ from 'jquery';

const thumbHTML = '<div class="toxin-slider__thumb js-toxin-slider__thumb" tabindex="0"></div>';
const tooltipHTML = '<div class="toxin-slider__thumb-tooltip js-toxin-slider__thumb-tooltip"></div>';

const enum MoveDirection {
  back,
  stop,
  forward,
}

export default class Thumb {
  private readonly $wrapper: JQuery;

  private readonly $thumb: JQuery;

  private readonly $tooltip: JQuery;

  private state: ThumbState = {
    value: 0,
    position: 0,
    isVertical: false,
    hidden: false,
    tooltipIsHidden: false,
  };

  private dragPosition: DragPosition = null;

  private moveDirection: MoveDirection = MoveDirection.stop;

  constructor(options: { $wrapper: JQuery; state: ThumbState }) {
    const { $wrapper, state } = options;

    this.$tooltip = $(tooltipHTML);
    this.$thumb = $(thumbHTML).append(this.$tooltip);
    this.$wrapper = $wrapper.append(this.$thumb);

    this.update(state);
  }

  update(state: ThumbState): Thumb {
    this.state = state;

    this.position();

    this.$tooltip.text(state.value);

    if (state.hidden) {
      this.$thumb.addClass('toxin-slider__thumb_hidden');
    } else {
      this.$thumb.removeClass('toxin-slider__thumb_hidden');
    }

    if (state.tooltipIsHidden) {
      this.$tooltip.addClass('toxin-slider__thumb-tooltip_hidden');
    } else {
      this.$tooltip.removeClass('toxin-slider__thumb-tooltip_hidden');
    }

    return this;
  }

  getPosition(): number {
    return this.dragPosition === null ? this.state.position : this.dragPosition;
  }

  getDirection(): MoveDirection {
    return this.moveDirection;
  }

  private position(): Thumb {
    const axis = this.state.isVertical ? 'Y' : 'X';
    const position = this.dragPosition === null ? this.state.position : this.dragPosition;

    this.$thumb.css('transform', `translate${axis}(${position}%)`);

    return this;
  }
}
