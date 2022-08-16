interface ToxinSlider {
  (outsideOptions: OutsideOptions): JQuery;
}

interface JQuery {
  toxinSlider: ToxinSlider;
}

type Big = import('bignumber.js').BigNumber;

interface ThumbState {
  value: Big;
  position: Big;
  restriction: Big;
  isVertical: boolean;
  hidden: boolean;
  tooltipHidden: boolean;
  units: string;
}

interface DragData {
  position: DragPosition;
  innerOffset: Big;
  wrapperPosition: Big;
  wrapperSize: Big;
  minRestriction: Big;
  maxRestriction: Big;
  restriction: Big;
}

type DragPosition = Big | null;

interface DragMessage {
  typeMessage: 'dragMessage';
  innerOffset: Big;
  wrapperSize: Big;
  value: Big;
}

interface MoveMessage {
  typeMessage: 'moveMessage';
  moveDirection: MoveDirection;
  value: Big;
}

type MoveDirection = -1 | 0 | 1;

interface ProgressBarState {
  min: Big;
  max: Big;
  isVertical: boolean;
  hidden: boolean;
}

interface BarMessage {
  typeMessage: 'barMessage';
  size: Big;
  clickPoint: Big;
}

interface ScaleState {
  start: Big;
  end: Big;
  step: Big;
  hidden: boolean;
  isVertical: boolean;
  units: string;
}

interface ScaleMessage {
  typeMessage: 'scaleMessage';
  scaleValue: Big;
}

interface SliderState {
  start: Big;
  end: Big;
  step: Big;
  from: Big;
  to: Big;
  hasTwoValues: boolean;
  isVertical: boolean;
  progressBarHidden: boolean;
  tooltipHidden: boolean;
  scaleHidden: boolean;
  scaleStep: Big;
  thumbsAreRestricted: boolean;
  name: string;
  units: string;
}

interface OutsideOptions {
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
  scaleStep?: number | string;
  thumbsAreRestricted?: boolean;
  name?: string;
  units?: string;
}

interface Options extends OutsideOptions {
  typeMessage: 'options';
}

type Message = Options | BarMessage | DragMessage | MoveMessage | ScaleMessage;
