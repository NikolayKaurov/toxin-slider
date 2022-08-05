import BigNumber from 'bignumber.js';

import {
  SliderState,
  Options,
  Message,
  BarMessage, MoveMessage, DragMessage,
} from './toxin-slider-interface';

export default class Model {
  state: SliderState = {
    start: new BigNumber(0),
    end: new BigNumber(0),
    step: new BigNumber(0),
    from: new BigNumber(0),
    to: new BigNumber(0),
    hasTwoValues: false,
    isVertical: false,
    progressBarHidden: false,
    tooltipHidden: false,
    scaleHidden: false,
    name: 'undefined-name',
    units: '',
  };

  private endMinusModulo = new BigNumber(0);

  private endMinusHalfModulo = new BigNumber(0);

  private scope = new BigNumber(0);

  private direction: 1 | -1 = 1;

  constructor(options: Options) {
    this.update(options);
  }

  update(message: Message): SliderState {
    const { from, to, hasTwoValues } = this.state;

    const assignToNearest = (between: BigNumber) => {
      if (hasTwoValues) {
        if (from.minus(between).abs().isLessThan(to.minus(between).abs())) {
          this.state.from = between;
        } else {
          this.state.to = between;
        }
      } else {
        this.state.from = between;
      }
    };

    const assignToCongruent = (between: BigNumber, comparable: BigNumber) => {
      if (hasTwoValues) {
        if (comparable.isEqualTo(from)) {
          this.state.from = between;
        } else {
          this.state.to = between;
        }
      } else {
        this.state.from = between;
      }
    };

    switch (message.typeMessage) {
      case 'barMessage':
        assignToNearest(this.getValueFromBar(message));
        return this.state;
      case 'scaleMessage':
        assignToNearest(message.scaleValue);
        return this.state;
      case 'moveMessage':
        assignToCongruent(this.getValueFromMove(message), message.value);
        return this.sortValues();
      case 'dragMessage':
        assignToCongruent(this.getValueFromDrag(message), message.value);
        return this.sortValues();
      case 'options':
        return this
          .setOptions(message)
          .normalizeState();
      default:
        return message;
    }
  }

  private normalizeState(): SliderState {
    const {
      start,
      end,
      from,
      to,
    } = this.state;

    this.scope = end.minus(start);

    this.direction = this.scope.isNegative() ? -1 : 1;

    const { endMinusModulo, endMinusHalfModulo } = this
      .normalizeStep()
      .getModuloValues();

    this.endMinusModulo = endMinusModulo;
    this.endMinusHalfModulo = endMinusHalfModulo;

    this.state.from = this.normalizeValue(from);
    this.state.to = this.normalizeValue(to);

    return this.sortValues();
  }

  private normalizeStep(): Model {
    const { step } = this.state;
    const { scope } = this;

    const unsignedScope = scope.abs();
    const unsignedStep = step.abs();

    this.state.step = unsignedStep.isGreaterThan(unsignedScope)
      ? unsignedScope
      : unsignedStep;

    return this;
  }

  private normalizeValue(raw: BigNumber): BigNumber {
    const { start, end, step } = this.state;
    const { endMinusModulo, endMinusHalfModulo, direction } = this;

    if (direction === -1) {
      if (raw.isGreaterThan(start)) {
        return new BigNumber(start);
      }

      if (raw.isLessThan(end)) {
        return new BigNumber(end);
      }

      if (!step.isZero()) {
        if (raw.isLessThan(endMinusHalfModulo)) {
          return new BigNumber(end);
        }

        if (raw.isLessThan(endMinusModulo)) {
          return new BigNumber(endMinusModulo);
        }

        return raw
          .minus(start)
          .dividedBy(step)
          .integerValue()
          .multipliedBy(step)
          .plus(start);
      }

      return raw;
    }

    if (raw.isLessThan(start)) {
      return new BigNumber(start);
    }

    if (raw.isGreaterThan(end)) {
      return new BigNumber(end);
    }

    if (!step.isZero()) {
      if (raw.isGreaterThan(endMinusHalfModulo)) {
        return new BigNumber(end);
      }

      if (raw.isGreaterThan(endMinusModulo)) {
        return new BigNumber(endMinusModulo);
      }

      return raw
        .minus(start)
        .dividedBy(step)
        .integerValue()
        .multipliedBy(step)
        .plus(start);
    }

    return raw;
  }

  private sortValues(): SliderState {
    const { from, to, hasTwoValues } = this.state;
    const { direction } = this;

    if (hasTwoValues) {
      if (direction === -1) {
        if (from.isLessThan(to)) {
          [this.state.from, this.state.to] = [to, from];
        }
      } else if (from.isGreaterThan(to)) {
        [this.state.from, this.state.to] = [to, from];
      }
    }

    return this.state;
  }

  private getModuloValues(): { endMinusModulo: BigNumber; endMinusHalfModulo: BigNumber } {
    const { end, step } = this.state;
    const { scope } = this;

    if (step.isZero()) {
      return {
        endMinusModulo: new BigNumber(end),
        endMinusHalfModulo: new BigNumber(end),
      };
    }

    const modulo = scope.modulo(step);

    const endMinusModulo = end.minus(modulo);
    const endMinusHalfModulo = end.minus(modulo.dividedBy(2));

    return { endMinusModulo, endMinusHalfModulo };
  }

  private getValueFromBar(message: BarMessage): BigNumber {
    const { size, clickPoint } = message;
    const { start } = this.state;
    const { scope } = this;

    return this.normalizeValue(
      scope.multipliedBy(clickPoint).dividedBy(size).plus(start),
    );
  }

  private getValueFromMove(message: MoveMessage): BigNumber {
    const { moveDirection, value } = message;
    const { step, end } = this.state;
    const { direction, endMinusModulo } = this;

    const isSpecialCase = (!endMinusModulo.isEqualTo(end))
      && (value.isEqualTo(end))
      && (moveDirection === -1);

    return isSpecialCase
      ? new BigNumber(endMinusModulo)
      : this.normalizeValue(
        value.plus(step.multipliedBy(direction).multipliedBy(moveDirection)),
      );
  }

  private getValueFromDrag(message: DragMessage): BigNumber {
    const { innerOffset, wrapperSize } = message;
    const { start } = this.state;
    const { scope } = this;

    return this.normalizeValue(
      scope.multipliedBy(innerOffset).dividedBy(wrapperSize).plus(start),
    );
  }

  private setOptions(options: Options): Model {
    const {
      start,
      end,
      step,
      from,
      to,
      hasTwoValues,
      isVertical,
      progressBarHidden,
      tooltipHidden,
      scaleHidden,
      name,
      units,
    } = options;
    const { state } = this;

    if (start !== undefined) {
      state.start = new BigNumber(start);
    }

    if (end !== undefined) {
      state.end = new BigNumber(end);
    }

    if (step !== undefined) {
      state.step = new BigNumber(step);
    }

    if (from !== undefined) {
      state.from = new BigNumber(from);
    }

    if (to !== undefined) {
      state.to = new BigNumber(to);
    }

    if (hasTwoValues !== undefined) {
      state.hasTwoValues = hasTwoValues;
    }

    if (isVertical !== undefined) {
      state.isVertical = isVertical;
    }

    if (progressBarHidden !== undefined) {
      state.progressBarHidden = progressBarHidden;
    }

    if (tooltipHidden !== undefined) {
      state.tooltipHidden = tooltipHidden;
    }

    if (scaleHidden !== undefined) {
      state.scaleHidden = scaleHidden;
    }

    if (name !== undefined) {
      state.name = name;
    }

    if (units !== undefined) {
      state.units = units;
    }

    return this;
  }
}
