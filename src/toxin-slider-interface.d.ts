interface JQuery {
  toxinSlider: ToxinSlider;
}

interface ToxinSlider {
  (state: ViewState): JQuery;
}

interface ThumbState {
  value: number;
  position: number;
  isVertical: boolean;
  hidden: boolean;
  tooltipHidden: boolean;
  units?: string;
}

interface DragData {
  position: DragPosition;
  innerOffset: number;
  wrapperPosition: number;
  wrapperSize: number;
  minRestriction: number;
  maxRestriction: number;
}

type DragPosition = number | null;

interface DragMessage {
  innerOffset: number;
  wrapperSize: number;
  value: number;
}

interface MoveMessage {
  moveDirection: number;
  value: number;
}

interface ProgressBarState {
  min: number;
  max: number;
  isVertical: boolean;
  hidden: boolean;
}

interface BarMessage {
  size: number;
  clickPoint: number;
}

interface ScaleState {
  start: number;
  end: number;
  step: number;
  hidden: boolean;
  units?: string;
}

interface ScaleMessage {
  scaleValue: number;
}

interface ModelState {
  start?: number;
  end?: number;
  step?: number;
  from?: number;
  to?: number;
  hasTwoValues?: boolean;
}

interface ViewState extends ModelState {
  isVertical?: boolean;
  progressBarHidden?: boolean;
  tooltipHidden?: boolean;
  scaleHidden?: boolean;
  units?: string;
  name?: string;
}

type Message = ViewState | BarMessage | DragMessage | MoveMessage | ScaleMessage;
