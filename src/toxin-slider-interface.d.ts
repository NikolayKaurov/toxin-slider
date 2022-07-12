interface ToxinSlider {
  (): JQuery;
}

interface JQuery {
  toxinSlider: ToxinSlider;
}

type DragPosition = number | null;

interface DragData {
  position: DragPosition;
  innerOffset: number;
  wrapperPosition: number;
  wrapperSize: number;
  minRestriction: number;
  maxRestriction: number;
}

interface ThumbState {
  value: number;
  position: number;
  isVertical: boolean;
  hidden: boolean;
  tooltipIsHidden: boolean;
}

interface ProgressBarState {
  min: number;
  max: number;
  isVertical: boolean;
  hidden: boolean;
}
