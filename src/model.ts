import BigNumber from 'bignumber.js';

import { Message, ModelState, Options } from './toxin-slider-interface';

export default class Model {
  state: ModelState = {
    start: new BigNumber(0),
    end: new BigNumber(0),
    step: new BigNumber(0),
    from: new BigNumber(0),
    to: new BigNumber(0),
    hasTwoValues: false,
  };

  private modulo = new BigNumber(0);

  // private stepSign: -1 | 1 = 1;

  constructor(options: Options) {
    this.update(options);
  }

  update(message: Message): ModelState {
    const {
      start,
      end,
      step,
      from,
      to,
      hasTwoValues,
    } = this.state;
    const { modulo } = this;

    const assignToNearest = (between: BigNumber) => {
      if (hasTwoValues) {
        if (from.minus(between).abs().comparedTo(to.minus(between).abs()) === -1) {
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
        const { size, clickPoint } = message;

        const newValue = this.normalizeValue(
          end.minus(start).multipliedBy(clickPoint).dividedBy(size).plus(start),
        );
    }

    if (isBarMessage(message)) {
      const { size, clickPoint } = message;

      const newValue = this.normalizeValue((clickPoint * (end - start)) / size + start);

      assignToNearest(newValue);

      return this.sortValues();
    }

    if (isMoveMessage(message)) {
      const { moveDirection, value } = message;

      const isSpecialCase = (modulo !== 0) && (value === end) && (moveDirection === -1);

      const newValue = isSpecialCase
        ? end - modulo
        : value + step * moveDirection;

      assignToCongruent(this.normalizeValue(newValue), value);

      return this.sortValues();
    }

    if (isScaleMessage(message)) {
      const { scaleValue } = message;

      assignToNearest(scaleValue);

      return this.sortValues();
    }

    if (!isDragMessage(message)) {
      this.state = { ...this.state, ...message };

      return this.normalizeState();
    }

    const { innerOffset, wrapperSize, value } = message;

    const newValue = this.normalizeValue((innerOffset * (end - start)) / wrapperSize + start);

    assignToCongruent(newValue, value);

    return this.sortValues();
  }

  normalizeState(): ModelState {
    const {
      from = 0,
      to = 0,
    } = this.state;

    this.modulo = this.normalizeStep().getModulo();

    this.state.from = this.normalizeValue(from);
    this.state.to = this.normalizeValue(to);

    return this.sortValues();
  }

  normalizeStep(): Model {
    const {
      start = 0,
      end = 0,
      step = 0,
    } = this.state;

    if (Math.abs(step) > Math.abs(end - start)) {
      this.state.step = end - start;
    } else {
      const isCorrectStepSign = (end > start && step > 0) || (end < start && step < 0);

      if (!isCorrectStepSign) {
        this.state.step = -1 * step;
      }
    }

    return this;
  }

  normalizeValue(raw: BigNumber): BigNumber {
    const { start, end, step } = this.state;
    const { modulo } = this;

    if (start.isGreaterThan(end)) {
      if (raw.isGreaterThan(start)) {
        return new BigNumber(start);
      }

      if (raw.isLessThan(end)) {
        return new BigNumber(end);
      }

      if (!step.isZero()) {
        if (raw.isLessThan(end.minus(modulo.dividedBy(2)))) {
          return new BigNumber(end);
        }

        const endMinusModulo = end.minus(modulo);

        if (raw.isLessThan(endMinusModulo)) {
          return endMinusModulo;
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

    if (step !== 0) {
      if (raw > (end - modulo / 2)) {
        return end;
      }

      if (raw > (end - modulo)) {
        return end - modulo;
      }

      return start + step * Math.round((raw - start) / step);
    }

    return raw;
  }

  sortValues(): ModelState {
    const {
      start = 0,
      end = 0,
      from = 0,
      to = 0,
      hasTwoValues = false,
    } = this.state;

    if (hasTwoValues) {
      if (start > end) {
        if (from < to) {
          [this.state.from, this.state.to] = [to, from];
        }
      } else if (from > to) {
        [this.state.from, this.state.to] = [to, from];
      }
    }

    return this.state;
  }

  getModulo(): number {
    const {
      start = 0,
      end = 0,
      step = 0,
    } = this.state;

    if (step === 0) {
      return 0;
    }

    return end - start - step * Math.floor((end - start) / step);
  }
}

function isDragMessage(message: Message): message is DragMessage {
  return (message as DragMessage).innerOffset !== undefined;
}

function isBarMessage(message: Message): message is BarMessage {
  return (message as BarMessage).size !== undefined;
}

function isMoveMessage(message: Message): message is MoveMessage {
  return (message as MoveMessage).moveDirection !== undefined;
}

function isScaleMessage(message: Message): message is ScaleMessage {
  return (message as ScaleMessage).scaleValue !== undefined;
}
