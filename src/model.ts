export default class Model {
  state: ModelState = {
    start: 0,
    end: 0,
    step: 0,
    from: 0,
    to: 0,
    hasTwoValues: false,
  };

  private modulo = 0;

  constructor(state: ModelState) {
    this.update(state);
  }

  update(message: Message): ModelState {
    const {
      start = 0,
      end = 0,
      step = 0,
      from = 0,
      to = 0,
      hasTwoValues = false,
    } = this.state;
    const { modulo } = this;

    const assignToNearest = (between: number) => {
      if (hasTwoValues) {
        if (Math.abs(from - between) < Math.abs(to - between)) {
          this.state.from = between;
        } else {
          this.state.to = between;
        }
      } else {
        this.state.from = between;
      }
    };

    const assignToCongruent = (between: number, comparable: number) => {
      if (hasTwoValues) {
        if (comparable === from) {
          this.state.from = between;
        } else {
          this.state.to = between;
        }
      } else {
        this.state.from = between;
      }
    };

    if (isBarMessage(message)) {
      const { size, clickPoint } = message;

      const newValue = this.normalizeValue((clickPoint * (end - start)) / size + start);

      assignToNearest(newValue);

      return this.sortValues();
    }

    if (isMoveMessage(message)) {
      const { moveDirection, value } = message;

      const specialCase = (modulo !== 0) && (value === end) && (moveDirection === -1);

      const newValue = specialCase
        ? end - modulo
        : value + step * moveDirection;

      assignToCongruent(this.normalizeValue(newValue), value);

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

  normalizeValue(raw: number): number {
    const {
      start = 0,
      end = 0,
      step = 0,
    } = this.state;
    const { modulo } = this;

    if (start > end) {
      if (raw > start) {
        return start;
      }

      if (raw < end) {
        return end;
      }

      if (step !== 0) {
        if (raw < (end - modulo / 2)) {
          return end;
        }

        if (raw < (end - modulo)) {
          return end - modulo;
        }

        return start + step * Math.round((raw - start) / step);
      }

      return raw;
    }

    if (raw < start) {
      return start;
    }

    if (raw > end) {
      return end;
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
