import $ from 'jquery';

$.fn.emptyPlugin = function plugin(this: JQuery): JQuery {
  return this.append('<div class="empty-plugin">This is new plugin!!!</div>');
};
