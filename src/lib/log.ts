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
      category: ["api-routes"],
      lowestLevel: "info",
      sinks: ["console"],
    },
    {
      category: ["api-lib"],
      lowestLevel: "info",
      sinks: ["console"],
    },
    {
      category: ["ui-routes"],
      lowestLevel: "info",
      sinks: ["console"],
    },
    {
      category: ["ui-lib"],
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
