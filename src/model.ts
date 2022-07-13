export default class Model {
  private state: ModelState;

  constructor(state: ModelState) {
    const {
      start = 0,
      end = 0,
      step = 0,
      from = 0,
      to = 0,
      range = 'single',
    } = state;

    this.state = {
      start,
      end,
      step,
      from,
      to,
      range,
    };

    this.normalizeState();
  }

  normalizeState(): Model {
    const {
      start = 0,
      end = 0,
      step = 0,
      from = 0,
      to = 0,
      range = 'single',
    } = this.state;

    if (Math.abs(step) > Math.abs(end - start)) {
      this.state.step = end - start;
    } else {
      const isCorrectStepSign = (end > start && step > 0) || (end < start && step < 0);

      if (!isCorrectStepSign) {
        this.state.step = -1 * step;
      }
    }

    this.state.from = this.normalizeValue(from);
    this.state.to = this.normalizeValue(to);

    if (range === 'double') {
      if (start > end) {
        if (this.state.from < this.state.to) {
          [this.state.from, this.state.to] = [this.state.to, this.state.from];
        }
      } else if (this.state.from > this.state.to) {
        [this.state.from, this.state.to] = [this.state.to, this.state.from];
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

    if (start > end) {
      if (raw > start) {
        return start;
      }

      if (raw < end) {
        return end;
      }

      if (step !== 0) {
        const modulo = start - end + step * Math.floor((end - start) / step);

        if (raw < (end + modulo / 2)) {
          return end;
        }

        if (raw < (end + modulo)) {
          return end + modulo;
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
      const modulo = end - start - step * Math.floor((end - start) / step);

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
}
