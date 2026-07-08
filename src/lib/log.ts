import {
  ansiColorFormatter,
  configureSync,
  getConsoleSink,
} from "@logtape/logtape";

configureSync({
  reset: true,
  sinks: {
    console: getConsoleSink({
      formatter: ansiColorFormatter,
    }),
  },
  loggers: [
    {
      category: "loshmi-control-panel",
      lowestLevel: "info",
      sinks: ["console"],
    },
    {
      category: "logtape",
      lowestLevel: "warning",
      sinks: ["console"],
    },
  ],
});
