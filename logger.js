const soleConfig  = require('./sole-config.js');
const winston = require('winston');
const sprintf = require("sprintf-js").sprintf;
const microTime = require("performance-now");
const slackBot = new require('slack')({token:soleConfig.slackToken});
const hostEnv = require('os');

function timestamp() {
  const now = new Date();
  return sprintf("%04d.%02d.%02d %02d:%02d:%02d.%03d [%d]", now.getFullYear(), now.getMonth()+1, now.getDate(),
    now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds(), process.pid);
}

const levels = {fix: 0, fatal: 1, error: 2, warning: 3, info: 4, perf: 5, test: 6, trace: 7};
const colors = {fix:"black", fatal: "red", error: "red", warning: "red", info: "black", perf: "blue", test: "yellow", trace: "magenta"};

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({timestamp: timestamp, level: "trace", colorize: true, stderrLevels: []}),
    new (winston.transports.File)({timestamp: timestamp, level: "fix", filename:"logs/fixes.log", json:false})
  ],
  levels: levels
});

winston.addColors(colors);

module.exports = {

  useSlackBot: true,

  restore:function() {
    return module.exports;
  },

  silent: {
    restore:function() { return module.exports },
    log:function() {},
    info:function() {},
    warning:function() {},
    error:function() {},
    test:function() {},
    fatal:function() {},
    debug:function() {},
    dump:function() {},
    perf:function() {},
  },

  log: function () {
    logger.info.apply(this, arguments);
  },

  info: function () {
    logger.info.apply(this, arguments);
  },

  warning: function () {
    logger.warning.apply(this, arguments);
  },

  error: function () {
    logger.error.apply(this, arguments);
    this.slackbot.apply(this, arguments);
  },

  fatal: function () {
    logger.fatal.apply(this, arguments);
    this.slackbot.apply(this, arguments);
  },

  test: function () {
    logger.test.apply(this, arguments);
  },

  debug: function () {
    logger.trace.apply(this, arguments);
  },

  dump: function (tag, obj) {
    logger.trace(tag + ": ", obj);
  },

  perf(t0, msg) {
    const t1 = microTime();
    if(t0) {
      let t=((t1 - t0).toFixed(4));
      let txt = msg + " => " + t + " msec";
      logger.perf(txt);
      if(t>5000) {
        this.slackbot("WARNING - HIGH LATENCY: " + txt);
      }
    }
    return t1;
  },

  fix: function () {
    logger.fix.apply(this, arguments);
  },

  slackbot: function (msg) {
    if (this.useSlackBot) {
      let txt = "(" + hostEnv.userInfo().username + ") " + [...arguments].join(",");
      slackBot.chat.postMessage({
        channel: soleConfig.slackChannel,
        text: txt,
      });
    }
  },
};