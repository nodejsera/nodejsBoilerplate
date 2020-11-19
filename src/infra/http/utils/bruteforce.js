const ExpressBrute = require('express-brute');
const ExpressBruteStoreSequelize = require('express-brute-store-sequelize');
const {
  errorCodes: { tooManyRequestsErrorCode },
  ApiError,
} = require('./response.js');
const {
  ff: { httpBruteProtection },
} = require('../../../config');

const createBruteforce = ({
  sequelize,
  reportError,
  minWait = 500,
  freeRetries = 3,
}) => {
  if (!httpBruteProtection) {
    return { getMiddleware: () => (req, res, next) => next() };
  }

  const options = {
    minWait,
    freeRetries,
    handleStoreError: ({ message, parent, next }) => {
      const error = new Error(message);
      error.parent = parent;

      if (next) {
        next(error);
      } else {
        reportError(error);
      }
    },
    failCallback: (req, resp, next, nextValidRequestDate) => {
      const error = new ApiError({
        code: tooManyRequestsErrorCode,
        details: { nextValidRequestDate },
      });
      next(error);
    },
  };
  const store = new ExpressBruteStoreSequelize(sequelize.db);
  return new ExpressBrute(store, options);
};

module.exports = { createBruteforce };
