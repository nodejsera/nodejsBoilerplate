const check = require('express-validator');
const { validateInput } = require('../../utils/validate-input.js');
const {
  toApiResponse,
  ApiError,
  errorCodes: { emailAlreadyExistsErrorCode },
} = require('../../utils/response.js');
const { EmailAlreadyExistsError } = require('../../../../common/errors.js');

const createAddUserRoute = ({
  router,
  core: {
    userCore: { addUser },
  },
  bruteforce,
}) => {
  /**
   * @api {post} /user/addUser Add user
   * @apiName AddUser
   * @apiGroup User
   *
   * @apiParam { email } email
   *
   */
  router.post(
    '/addUser',
    bruteforce.getMiddleware({ key: '/users/addUser' }),
    [check.body('email').isEmail()],
    validateInput,
    toApiResponse(async ({ body: { email } }) => {
      try {
        await addUser({ email });

        return { status: 204, data: null };
      } catch (error) {
        if (error instanceof EmailAlreadyExistsError) {
          throw new ApiError({
            status: 422,
            code: emailAlreadyExistsErrorCode,
            message: 'Email already exists.',
          });
        }
        throw error;
      }
    }),
  );

  return router;
};

module.exports = { createAddUserRoute };
