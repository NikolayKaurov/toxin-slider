import $ from 'jquery';

const thumbHTML = '<div class="toxin-slider__thumb js-toxin-slider__thumb" tabindex="0"></div>';
const tooltipHTML = '<div class="toxin-slider__thumb-tooltip js-toxin-slider__thumb-tooltip"></div>';

const enum MoveDirection {
  back = -1,
  stop,
  forward,
}

export default class Thumb {
  readonly $wrapper: JQuery;

  readonly $thumb: JQuery;

  readonly $tooltip: JQuery;

  state: ThumbState = {
    value: 0,
    position: 0,
    isVertical: false,
    hidden: false,
    tooltipIsHidden: false,
  };

  drag: DragData = {
    position: null as DragPosition,
    innerOffset: 0,
    wrapperPosition: 0,
    wrapperSize: 0,
    minRestriction: 0,
    maxRestriction: 0,
  };

  /* This property describes thumb movement using the KEYBOARD
  and is named using the word MOVE instead of DRAG by design. */
  moveDirection: MoveDirection = MoveDirection.stop;

  constructor(options: { $wrapper: JQuery; state: ThumbState }) {
    const { $wrapper, state } = options;

    this.$tooltip = $(tooltipHTML);
    this.$thumb = $(thumbHTML).append(this.$tooltip);
    this.$wrapper = $wrapper.append(this.$thumb);

    this.$thumb.on('mousedown', { thumb: this }, handleThumbMousedown);

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
    return this.drag.position === null ? this.state.position : this.drag.position;
  }

  getDirection(): MoveDirection {
    return this.moveDirection;
  }

  sendDragMessage() {
    this.$thumb.trigger(
      'toxin-slider.thumb.drag',
      {
        innerOffset: this.drag.innerOffset,
        wrapperSize: this.drag.wrapperSize,
        value: this.state.value,
      },
    );

    return this;
  }

  private position(): Thumb {
    const axis = this.state.isVertical ? 'Y' : 'X';
    const position = this.drag.position === null ? this.state.position : this.drag.position;

    this.$thumb.css('transform', `translate${axis}(${
      axis === 'X' ? position : 100 - position
    }%)`);

    return this;
  }
}

function handleThumbMousedown(event: JQuery.TriggeredEvent) {
  const { thumb } = event.data as { thumb: Thumb };
  const {
    $thumb,
    $wrapper,
    state,
    drag,
  } = thumb;

  if (state.isVertical) {
    drag.wrapperPosition = $wrapper.offset()?.top ?? 0;
    drag.wrapperSize = $wrapper.outerHeight() ?? 0;
  } else {
    drag.wrapperPosition = $wrapper.offset()?.left ?? 0;
    drag.wrapperSize = $wrapper.outerWidth() ?? 0;
  }

  const grabPoint = state.isVertical
    ? (event.clientY ?? 0) - ($thumb.offset()?.top ?? 0)
    : (event.clientX ?? 0) - ($thumb.offset()?.left ?? 0);

  drag.minRestriction = grabPoint + drag.wrapperPosition;
  drag.maxRestriction = drag.minRestriction + drag.wrapperSize;

  $thumb.addClass('toxin-slider__thumb_draggable');

  $(document).on('mousemove pointermove', { thumb }, handleThumbMousemove);
  $(document).on('mouseup pointerup', { thumb }, handleThumbMouseup);
}

function handleThumbMousemove(event: JQuery.TriggeredEvent) {
  const { thumb } = event.data as { thumb: Thumb };
  const { state, drag } = thumb;

  const mousePosition = state.isVertical
    ? (event.clientY ?? 0)
    : (event.clientX ?? 0);

  if (mousePosition < drag.minRestriction) {
    drag.innerOffset = state.isVertical
      ? drag.wrapperSize
      : 0;
  } else if (mousePosition > drag.maxRestriction) {
    drag.innerOffset = state.isVertical
      ? 0
      : drag.wrapperSize;
  } else {
    drag.innerOffset = state.isVertical
      ? drag.maxRestriction - mousePosition
      : mousePosition - drag.minRestriction;
  }

  drag.position = (100 * drag.innerOffset) / drag.wrapperSize;

  thumb.sendDragMessage();
}

function handleThumbMouseup(event: JQuery.TriggeredEvent) {
  const { thumb } = event.data as { thumb: Thumb };
  const { $thumb, drag } = thumb;

  $(document).off('mousemove pointermove', handleThumbMousemove);
  $(document).off('mouseup pointerup', handleThumbMouseup);

  drag.position = null;

  $thumb.removeClass('toxin-slider__thumb_draggable');

  thumb.sendDragMessage();
}
