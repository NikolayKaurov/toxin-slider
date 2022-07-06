interface EmptyPlugin {
  (): JQuery;
}

interface JQuery {
  emptyPlugin: EmptyPlugin;
}
