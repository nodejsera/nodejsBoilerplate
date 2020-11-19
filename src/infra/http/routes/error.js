// const newrelic = require('newrelic');
const {
  errorCodes: { internalServerErrorCode },
  ApiError,
} = require('../utils/response.js');

// eslint-disable-next-line no-unused-vars
const createErrorRoute = ({ reportError }) => (error, req, res, next) => {
  const errorExpected = error instanceof ApiError;

  if (!errorExpected) {
    reportError(error, req);
  }

  const { status, code, message, details } = errorExpected
    ? error
    : new ApiError({
        code: internalServerErrorCode,
      });

  // stringify details, because newrelic seems not to add custom parameters that are of type object
  // newrelic.addCustomAttributes({ code, details: JSON.stringify(details) });

  res.status(status);
  res.send({
    success: false,
    status,
    error: {
      code,
      message,
      details,
    },
  });
};

module.exports = { createErrorRoute };
