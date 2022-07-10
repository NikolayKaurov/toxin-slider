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
    return this.dragPosition === null ? this.state.position : this.dragPosition;
  }

  getDirection(): MoveDirection {
    return this.moveDirection;
  }

  getDragRestriction(): {
    wrapperPosition: number;
    wrapperSize: number;
    isVertical: boolean;
  } {
    const { isVertical } = this.state;

    if (isVertical) {
      const wrapperPosition = this.$wrapper.offset()?.top ?? 0;
      const wrapperSize = this.$wrapper.outerHeight() ?? 0;

      return { wrapperPosition, wrapperSize, isVertical };
    }

    const wrapperPosition = this.$wrapper.offset()?.left ?? 0;
    const wrapperSize = this.$wrapper.outerWidth() ?? 0;

    return { wrapperPosition, wrapperSize, isVertical };
  }

  setDragPosition(dragPosition: DragPosition) {
    this.dragPosition = dragPosition;

    return this;
  }

  sendDragMessage(options?: { innerOffset: number, wrapperSize: number }) {
    const parameters = options !== undefined
      ? {
        ...options,
        value: this.state.value,
      }
      : {};

    this.$thumb.trigger('toxin-slider.thumb.drag', parameters);

    return this;
  }

  private position(): Thumb {
    const axis = this.state.isVertical ? 'Y' : 'X';
    const position = this.dragPosition === null ? this.state.position : this.dragPosition;

    this.$thumb.css('transform', `translate${axis}(${position}%)`);

    return this;
  }
}

function handleThumbMousedown(event: JQuery.TriggeredEvent) {
  const $thumb = $(event.target);
  const { thumb } = event.data as { thumb: Thumb };
  const { wrapperPosition, wrapperSize, isVertical } = thumb.getDragRestriction();

  const grabPoint = isVertical
    ? ($thumb.offset()?.top ?? 0) - (event.clientY ?? 0)
    : ($thumb.offset()?.left ?? 0) - (event.clientX ?? 0);

  const minRestriction = grabPoint + wrapperPosition;
  const maxRestriction = minRestriction + wrapperSize;

  $(document).on(
    'mousemove pointermove',
    {
      thumb,
      minRestriction,
      maxRestriction,
      wrapperSize,
      isVertical,
    },
    handleThumbMousemove,
  );

  $(document).on(
    'mouseup pointerup',
    { thumb },
    handleThumbMouseup,
  );
}

function handleThumbMousemove(event: JQuery.TriggeredEvent) {
  const {
    thumb,
    minRestriction,
    maxRestriction,
    wrapperSize,
    isVertical,
  } = event.data as {
    thumb: Thumb;
    minRestriction: number;
    maxRestriction: number;
    wrapperSize: number;
    isVertical: boolean;
  };

  const dragPosition = isVertical
    ? (event.clientY ?? 0)
    : (event.clientX ?? 0);

  const getInnerOffset = () => {
    if (dragPosition < minRestriction) {
      return 0;
    }

    if (dragPosition > maxRestriction) {
      return wrapperSize;
    }

    return dragPosition - minRestriction;
  };

  const innerOffset = getInnerOffset();

  thumb
    .setDragPosition((100 * innerOffset) / wrapperSize)
    .sendDragMessage({ innerOffset, wrapperSize });
}

function handleThumbMouseup(event: JQuery.TriggeredEvent) {
  $(document).off('mousemove pointermove', handleThumbMousemove);
  $(document).off('mouseup pointerup', handleThumbMouseup);

  const { thumb } = event.data as { thumb: Thumb };

  thumb
    .setDragPosition(null)
    .sendDragMessage();
}
