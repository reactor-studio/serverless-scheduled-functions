const path = require('path');
const fs = require('fs-extra');
const compileFunctions = require('./compile-functions.js');
const { scheduled, scheduleHandler } = require('./scheduled');
const _ = require('lodash');

class ScheduledFunctions {
  constructor(serverless, options) {
    this.serverless = serverless;

    this.commands = {
      'scheduled': {
        lifecycleEvents: [
          'setupFunctions'
        ],
        usage: 'Registers lambdas referenced in code as @scheduled'
      },
    };

    this.hooks = {
      'before:package:setupProviderConfiguration': this.addFunctions.bind(this),
      'before:logs:logs': this.addFunctions.bind(this),
      'before:offline:start:init': this.addFunctions.bind(this),
      'before:offline:start': this.addFunctions.bind(this),
    };

    this.environmentVariables = {}

  }

  registerFunctions() {
    const configPath = _.get(this, 'serverless.service.custom.scheduled.path');
    const functionsPaths = path.join(this.serverless.config.servicePath, configPath);
    require('@babel/register');
    require(functionsPaths);
  }

  addFunctions() {
    this.registerFunctions();

    const funcs = _.get(this, 'serverless.service.functions') || {};
    const mergedFunctions = Object.assign(funcs, compileFunctions(this.serverless));

    _.set(this, 'serverless.service.functions', mergedFunctions);

    return Promise.resolve();
  }
}

ScheduledFunctions.scheduled = scheduled;
ScheduledFunctions.scheduleHandler = scheduleHandler;

module.exports = ScheduledFunctions;
