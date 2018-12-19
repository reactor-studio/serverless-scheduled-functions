const { scheduled, scheduleHandler } = require('./scheduler');
const ScheduledFunctions = require('./plugin.js');

module.exports.scheduleHandler = scheduleHandler;
module.exports.scheduled = scheduled;

module.exports = ScheduledFunctions;