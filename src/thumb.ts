import $ from 'jquery';

const thumbHTML = '<div class="toxin-slider__thumb" tabindex="0"></div>';
const tooltipHTML = '<div class="toxin-slider__thumb-tooltip"></div>';

const left = 37;
const up = 38;
const right = 39;
const down = 40;

enum MoveDirection {
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
    tooltipHidden: false,
    units: '',
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
    this.$thumb.on('keydown', { thumb: this }, handleThumbKeydown);
    this.$thumb.on('keyup', { thumb: this }, handleThumbKeyup);

    this.update(state);
  }

  update(state: ThumbState): Thumb {
    this.state = { ...this.state, ...state };

    this.position();

    this.$tooltip.text(`${new Intl.NumberFormat('ru-RU').format(state.value)}${state.units ?? ''}`);

    if (state.hidden) {
      this.$thumb.addClass('toxin-slider__thumb_hidden');
    } else {
      this.$thumb.removeClass('toxin-slider__thumb_hidden');
    }

    if (state.tooltipHidden) {
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

  sendDragMessage(): Thumb {
    this.$thumb.trigger(
      'toxin-slider.update',
      {
        innerOffset: this.drag.innerOffset,
        wrapperSize: this.drag.wrapperSize,
        value: this.state.value,
      },
    );

    return this;
  }

  sendMoveMessage(): Thumb {
    this.$thumb.trigger(
      'toxin-slider.update',
      {
        moveDirection: this.getDirection(),
        value: this.state.value,
      },
    );

    return this;
  }

  private position(): Thumb {
    const axis = this.state.isVertical ? 'Y' : 'X';
    const position = this.getPosition();

    this.$thumb.css('transform', `translate${axis}(${
      axis === 'X' ? (position - 100) : (-1 * position)
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

  const thumbPosition = state.isVertical
    ? ($thumb.offset()?.top ?? 0)
    : ($thumb.offset()?.left ?? 0);

  const thumbSize = state.isVertical
    ? ($thumb.outerHeight() ?? 0)
    : ($thumb.outerWidth() ?? 0);

  const mousePosition = state.isVertical
    ? (event.clientY ?? 0)
    : (event.clientX ?? 0);

  const grabPoint = mousePosition - thumbPosition - thumbSize;

  drag.minRestriction = grabPoint + drag.wrapperPosition;
  drag.maxRestriction = drag.minRestriction + drag.wrapperSize;

  drag.innerOffset = state.isVertical
    ? drag.wrapperPosition - thumbPosition
    : thumbPosition + thumbSize - drag.wrapperPosition;

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
  const { drag } = thumb;

  $(document).off('mousemove pointermove', handleThumbMousemove);
  $(document).off('mouseup pointerup', handleThumbMouseup);

  drag.position = null;

  thumb.sendDragMessage();
}

function handleThumbKeydown(event: JQuery.TriggeredEvent) {
  const { thumb } = event.data as { thumb: Thumb };
  const { keyCode } = event;

  if (keyCode === up || keyCode === right) {
    thumb.moveDirection = MoveDirection.forward;
  } else if (keyCode === down || keyCode === left) {
    thumb.moveDirection = MoveDirection.back;
  }

  if (thumb.getDirection() !== MoveDirection.stop) {
    event.preventDefault();
    thumb.sendMoveMessage();
  }
}

function handleThumbKeyup(event: JQuery.TriggeredEvent) {
  const { thumb } = event.data as { thumb: Thumb };

  thumb.moveDirection = MoveDirection.stop;
}
