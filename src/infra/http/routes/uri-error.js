const {
  errorCodes: { badRequestErrorCode },
  ApiError,
} = require('../utils/response');

const createUriErrorRoute = () => (error, req, res, next) => {
  if (!(error instanceof URIError)) {
    next(error);
    return;
  }

  const apiError = new ApiError({
    code: badRequestErrorCode,
    message: error.message,
  });
  next(apiError);
};

module.exports = { createUriErrorRoute };
