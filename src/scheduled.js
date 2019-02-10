const fs = require('fs');
const _ = require('lodash');

/**
 * This class is used to manage all scheduled functions.
 * It provides an interface to register and run scheduled
 * function with certain name. It is exposed outside of this
 * package just as its methods.
 */
class Scheduler {
  constructor() {
    this.functions = {};
    this.register = this.register.bind(this);
    this.getFunctions = this.getFunctions.bind(this);
    this.runFunction = this.runFunction.bind(this);
  }
  /**
   * Higher order function which registers a function the the scheduler
   * @param  {string} name - Name of the function, that parameter will be used to name the lambda
   * @param  {string|object} options - in case of string it is consider as rate
   * of the schedule lambda event. Otherwise options should be object with "rate" property.
   * All other properties of the options object will be used to configure lambda e.g. timeout.
   */
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

  /**
   * This function creates a generic lambda handler for all registered functions.
   */
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
module.exports.scheduler = scheduler;
