import BigNumber from 'bignumber.js';

interface JQuery {
  toxinSlider: ToxinSlider;
}

interface ToxinSlider {
  (options: Options): JQuery;
}

interface ThumbState {
  value: BigNumber;
  position: BigNumber;
  isVertical: boolean;
  hidden: boolean;
  tooltipHidden: boolean;
  units: string;
}

interface DragData {
  position: DragPosition;
  innerOffset: BigNumber;
  wrapperPosition: BigNumber;
  wrapperSize: BigNumber;
  minRestriction: BigNumber;
  maxRestriction: BigNumber;
}

type DragPosition = BigNumber | null;

interface DragMessage {
  typeMessage: 'dragMessage';
  innerOffset: BigNumber;
  wrapperSize: BigNumber;
  value: BigNumber;
}

interface MoveMessage {
  typeMessage: 'moveMessage';
  moveDirection: MoveDirection;
  value: BigNumber;
}

type MoveDirection = -1 | 0 | 1;

interface ProgressBarState {
  min: BigNumber;
  max: BigNumber;
  isVertical: boolean;
  hidden: boolean;
}

interface BarMessage {
  typeMessage: 'barMessage';
  size: BigNumber;
  clickPoint: BigNumber;
}

interface ScaleState {
  start: BigNumber;
  end: BigNumber;
  step: BigNumber;
  hidden: boolean;
  units: string;
}

interface ScaleMessage {
  typeMessage: 'scaleMessage';
  scaleValue: BigNumber;
}

interface SliderState {
  start: BigNumber;
  end: BigNumber;
  step: BigNumber;
  from: BigNumber;
  to: BigNumber;
  hasTwoValues: boolean;
  isVertical: boolean;
  progressBarHidden: boolean;
  tooltipHidden: boolean;
  scaleHidden: boolean;
  name: string;
  units: string;
}

interface Options {
  typeMessage: 'options';
  start?: number | string;
  end?: number | string;
  step?: number | string;
  from?: number | string;
  to?: number | string;
  hasTwoValues?: boolean;
  isVertical?: boolean;
  progressBarHidden?: boolean;
  tooltipHidden?: boolean;
  scaleHidden?: boolean;
  name?: string;
  units?: string;
}

type Message = Options | BarMessage | DragMessage | MoveMessage | ScaleMessage;
