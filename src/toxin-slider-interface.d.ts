interface ToxinSlider {
  (): JQuery;
}

type DragPosition = number | null;

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
