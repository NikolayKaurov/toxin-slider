import $ from 'jquery';
import BigNumber from 'bignumber.js';

const format = {
  decimalSeparator: ',',
  groupSeparator: ' ',
  groupSize: 3,
  suffix: '',
};

const thumbHTML = '<div class="toxin-slider__thumb" tabindex="0"></div>';
const tooltipHTML = '<div class="toxin-slider__thumb-tooltip"></div>';

const left = 37;
const up = 38;
const right = 39;
const down = 40;

const moveDirection: { back: MoveDirection; stop: MoveDirection; forward: MoveDirection; } = {
  back: -1,
  stop: 0,
  forward: 1,
};

export default class Thumb {
  readonly $wrapper: JQuery;

  readonly $thumb: JQuery;

  readonly $tooltip: JQuery;

  state: ThumbState = {
    value: new BigNumber(0),
    position: new BigNumber(0),
    isVertical: false,
    hidden: false,
    tooltipHidden: false,
    units: '',
  };

  drag: DragData = {
    position: null,
    innerOffset: new BigNumber(0),
    wrapperPosition: new BigNumber(0),
    wrapperSize: new BigNumber(0),
    minRestriction: new BigNumber(0),
    maxRestriction: new BigNumber(0),
  };

  /* This property describes thumb movement using the KEYBOARD
  and is named using the word MOVE instead of DRAG by design. */
  moveDirection: MoveDirection = moveDirection.stop;

  constructor(options: { $wrapper: JQuery; state: ThumbState }) {
    const { $wrapper, state } = options;

    this.$tooltip = $(tooltipHTML);
    this.$thumb = $(thumbHTML).append(this.$tooltip);
    this.$wrapper = $wrapper.append(this.$thumb);

    this.$thumb.on('mousedown pointerdown', this, handleThumbMousedown);
    this.$thumb.on('keydown', this, handleThumbKeydown);
    this.$thumb.on('keyup', this, handleThumbKeyup);

    this.update(state);
  }

  update(state: ThumbState): Thumb {
    this.state = { ...this.state, ...state };

    const {
      value,
      hidden,
      tooltipHidden,
      units,
    } = state;

    this.position();

    format.suffix = units;

    this.$tooltip.text(value.toFormat(format));

    if (hidden) {
      this.$thumb.addClass('toxin-slider__thumb_hidden');
    } else {
      this.$thumb.removeClass('toxin-slider__thumb_hidden');
    }

    if (tooltipHidden) {
      this.$tooltip.addClass('toxin-slider__thumb-tooltip_hidden');
    } else {
      this.$tooltip.removeClass('toxin-slider__thumb-tooltip_hidden');
    }

    return this;
  }

  getPosition(): BigNumber {
    return this.drag.position === null ? this.state.position : this.drag.position;
  }

  getDirection(): MoveDirection {
    return this.moveDirection;
  }

  sendDragMessage(): Thumb {
    this.$thumb.trigger(
      'toxin-slider.update',
      {
        typeMessage: 'dragMessage',
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
        typeMessage: 'moveMessage',
        moveDirection: this.getDirection(),
        value: this.state.value,
      },
    );

    return this;
  }

  private position(): Thumb {
    const axis = this.state.isVertical ? 'Y' : 'X';
    const position = this.getPosition();

    const hundred = new BigNumber(100);

    this.$thumb.css('transform', `translate${axis}(${
      axis === 'X' ? (position.minus(hundred).toNumber()) : (position.negated().toNumber())
    }%)`);

    return this;
  }
}

function handleThumbMousedown(event: JQuery.TriggeredEvent) {
  if (!(event.data instanceof Thumb)) {
    return;
  }

  const {
    $thumb,
    $wrapper,
    state,
    drag,
  } = event.data;

  if (state.isVertical) {
    drag.wrapperPosition = new BigNumber($wrapper.offset()?.top ?? 0);
    drag.wrapperSize = new BigNumber($wrapper.outerHeight() ?? 0);
  } else {
    drag.wrapperPosition = new BigNumber($wrapper.offset()?.left ?? 0);
    drag.wrapperSize = new BigNumber($wrapper.outerWidth() ?? 0);
  }

  const thumbPosition = state.isVertical
    ? new BigNumber($thumb.offset()?.top ?? 0)
    : new BigNumber($thumb.offset()?.left ?? 0);

  const thumbSize = state.isVertical
    ? new BigNumber($thumb.outerHeight() ?? 0)
    : new BigNumber($thumb.outerWidth() ?? 0);

  const mousePosition = state.isVertical
    ? new BigNumber(event.clientY ?? 0)
    : new BigNumber(event.clientX ?? 0);

  const grabPoint = mousePosition.minus(thumbPosition).minus(thumbSize);

  drag.minRestriction = grabPoint.plus(drag.wrapperPosition);
  drag.maxRestriction = drag.minRestriction.plus(drag.wrapperSize);

  drag.innerOffset = state.isVertical
    ? drag.wrapperPosition.minus(thumbPosition)
    : thumbPosition.plus(thumbSize).minus(drag.wrapperPosition);

  $(document).on('mousemove pointermove', event.data, handleThumbMousemove);
  $(document).on('mouseup pointerup', event.data, handleThumbMouseup);

  $wrapper.addClass('toxin-slider__inner-wrapper_draggable');
}

function handleThumbMousemove(event: JQuery.TriggeredEvent) {
  if (!(event.data instanceof Thumb)) {
    return;
  }

  const thumb = event.data;
  const { state, drag } = thumb;

  const mousePosition = state.isVertical
    ? new BigNumber(event.clientY ?? 0)
    : new BigNumber(event.clientX ?? 0);

  if (mousePosition.isLessThan(drag.minRestriction)) {
    drag.innerOffset = state.isVertical
      ? new BigNumber(drag.wrapperSize)
      : new BigNumber(0);
  } else if (mousePosition.isGreaterThan(drag.maxRestriction)) {
    drag.innerOffset = state.isVertical
      ? new BigNumber(0)
      : new BigNumber(drag.wrapperSize);
  } else {
    drag.innerOffset = state.isVertical
      ? drag.maxRestriction.minus(mousePosition)
      : mousePosition.minus(drag.minRestriction);
  }

  drag.position = drag.innerOffset.multipliedBy(100).dividedBy(drag.wrapperSize);

  thumb.sendDragMessage();
}

function handleThumbMouseup(event: JQuery.TriggeredEvent) {
  if (!(event.data instanceof Thumb)) {
    return;
  }

  const thumb = event.data;
  const { drag, $wrapper } = thumb;

  $(document).off('mousemove pointermove', handleThumbMousemove);
  $(document).off('mouseup pointerup', handleThumbMouseup);

  drag.position = null;

  thumb.sendDragMessage();

  $wrapper.removeClass('toxin-slider__inner-wrapper_draggable');
}

function handleThumbKeydown(event: JQuery.TriggeredEvent) {
  if (!(event.data instanceof Thumb)) {
    return;
  }

  const thumb = event.data;
  const { $wrapper } = thumb;
  const { keyCode } = event;

  if (keyCode === up || keyCode === right) {
    thumb.moveDirection = moveDirection.forward;
  } else if (keyCode === down || keyCode === left) {
    thumb.moveDirection = moveDirection.back;
  }

  if (thumb.getDirection() !== moveDirection.stop) {
    event.preventDefault();
    thumb.sendMoveMessage();
  }

  $wrapper.addClass('toxin-slider__inner-wrapper_draggable');
}

function handleThumbKeyup(event: JQuery.TriggeredEvent) {
  if (!(event.data instanceof Thumb)) {
    return;
  }

  const thumb = event.data;
  const { $wrapper } = thumb;

  thumb.moveDirection = moveDirection.stop;

  $wrapper.removeClass('toxin-slider__inner-wrapper_draggable');
}
