interface ToxinSlider {
  (): JQuery;
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
