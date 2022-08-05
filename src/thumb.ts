import $ from 'jquery';
import BigNumber from 'bignumber.js';

import { ThumbState, DragData, MoveDirection } from './toxin-slider-interface';

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
    } = state;

    this.position();

    /* const format = {
      decimalSeparator: ',',
      groupSeparator: ' ',
      groupSize: 3,
      suffix: units,
    };
    BigNumber.config({ FORMAT: format }); */

    this.$tooltip.text(value.toFormat());

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

  $wrapper.addClass('toxin-slider__inner-wrapper_draggable');
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
  const { drag, $wrapper } = thumb;

  $(document).off('mousemove pointermove', handleThumbMousemove);
  $(document).off('mouseup pointerup', handleThumbMouseup);

  drag.position = null;

  thumb.sendDragMessage();

  $wrapper.removeClass('toxin-slider__inner-wrapper_draggable');
}

function handleThumbKeydown(event: JQuery.TriggeredEvent) {
  const { thumb } = event.data as { thumb: Thumb };
  const { $wrapper } = thumb;
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

  $wrapper.addClass('toxin-slider__inner-wrapper_draggable');
}

function handleThumbKeyup(event: JQuery.TriggeredEvent) {
  const { thumb } = event.data as { thumb: Thumb };
  const { $wrapper } = thumb;

  thumb.moveDirection = MoveDirection.stop;

  $wrapper.removeClass('toxin-slider__inner-wrapper_draggable');
}
