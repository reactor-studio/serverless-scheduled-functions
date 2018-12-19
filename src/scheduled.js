const fs = require('fs');
const _ = require('lodash');

class Scheduler {
  constructor() {
    this.functions = {};
    this.register = this.register.bind(this);
    this.getFunctions = this.getFunctions.bind(this);
    this.runFunction = this.runFunction.bind(this);
  }

  register(name, options) {
    return wrapped => {
      this.functions[_.camelCase(name)] = {
        function: wrapped,
        name: _.camelCase(name),
        options,
      };
    };
  }

  getFunctions() {
    return this.functions;
  }

  runFunction() {
    return event => {
      this.functions[event.name].function(event);
    };
  }
}

const scheduler = new Scheduler();

module.exports.scheduled = scheduler.register;
module.exports.getFunctions = scheduler.getFunctions;
module.exports.scheduleHandler = scheduler.runFunction;
