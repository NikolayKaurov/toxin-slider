interface ToxinSlider {
  (): JQuery;
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

interface JQuery {
  toxinSlider: ToxinSlider;
}
