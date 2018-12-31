const path = require('path');
const fs = require('fs-extra');
const compileFunctions = require('./compile-functions.js');
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
    const funcs = _.get(this, 'serverless.service.functions') || {};
    const mergedFunctions = Object.assign(funcs, compileFunctions(this.serverless));
    
    this.registerFunctions();

    _.set(this, 'serverless.service.functions', mergedFunctions);

    return Promise.resolve();
  }
}

module.exports = ScheduledFunctions;
