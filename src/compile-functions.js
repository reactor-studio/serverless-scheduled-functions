const _ = require('lodash');
const { getFunctions } = require('./scheduled');

module.exports = serverless => {
  const functions = getFunctions();

  const provider = serverless.getProvider('aws');
  const { service } = serverless.service;
  const stage = provider.getStage();
  const handler = _.get(serverless, 'service.custom.scheduled.handler');
  const environment = _.get(serverless, 'service.custom.scheduled.environment');

  return _.reduce(
    functions,
    (settings, func, name) => {
      serverless.cli.consoleLog(
        `[Scheduled functions] Compiling function with name: ${name}`
      );
      const options = _.isString(func.options)
        ? { rate: func.options }
        : func.options;
      return {
        ...settings,
        [func.name]: {
          handler,
          name: `${service}-${stage}-${name}`,
          environment: { ...environment, ...options.environment },
          timeout: options.timeout || 300,
          events: [
            {
              schedule: {
                input: { name },
                rate: options.rate,
              },
            },
          ],
        },
      };
    },
    {}
  );
};
