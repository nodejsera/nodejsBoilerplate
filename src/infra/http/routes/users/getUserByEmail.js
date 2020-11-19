const check = require('express-validator');
// const { validateInput } = require('../../utils/validate-input.js');
const {
  toApiResponse,
  ApiError,
  errorCodes: { notFoundErrorCode },
} = require('../../utils/response.js');

const { JobNotFoundError } = require('../../../../common/errors.js');

const createGetUserByEmailRoute = ({
  router,
  core: {
    userCore: { getUserByEmail },
  },
}) => {
  /**
   * @api {get} /user/getUsersByEmail Get user by email
   * @apiName GetUser
   * @apiGroup User
   *
   * @apiSuccess (200) {user} User
   */
  router.get(
    '/getUserByEmail',
    [check.param('email').isEmail()],
    toApiResponse(async () => {
      try {
        const user = await getUserByEmail();

        return { status: 200, data: user };
      } catch (error) {
        if (error instanceof JobNotFoundError) {
          throw new ApiError({
            status: 404,
            code: notFoundErrorCode,
            message: 'User not found.',
          });
        }
        throw error;
      }
    }),
  );

  return router;
};

module.exports = { createGetUserByEmailRoute };
