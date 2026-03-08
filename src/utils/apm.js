// init APM must be before any other module
var apm = require('elastic-apm-node').start();
module.exports = { apm };
