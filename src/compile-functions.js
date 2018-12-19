const { getFunctions } = require('./scheduled');

module.exports = serverless => {
  const functions = getFunctions();

  const provider = serverless.getProvider('aws');
  const service = serverless.service.service;
  const stage = provider.getStage();
  const handler = _.get(this, 'service.custom.scheduled.handler');

  return _.reduce(
    functions,
    (settings, func, name) => {
      const options = func.options;
      return {
        ...settings,
        [func.name]: {
          handler,
          name: `${service}-${stage}-${name}`,
          events: [
            {
              schedule: {
                rate: options,
                input: { name },
              },
            },
          ],
        },
      };
    },
    {},
  );
};