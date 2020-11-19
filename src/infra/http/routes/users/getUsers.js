const check = require('express-validator');

const { toApiResponse } = require('../../utils/response.js');
const { toPagination } = require('../../utils/pagination.js');

const createGetUsersRoute = ({
  router,
  application: {
    users: { getUsers },
  },
  config: { origin },
}) => {
  /**
   * @api {get} /users/getUsers Get users
   * @apiName GetUsers
   * @apiGroup User
   *
   * @apiSuccess (200) {users} Users.
   */
  router.get(
    '/getUsers',
    [
      check
        .query('perPage')
        .isInt({ min: 1, max: 100 })
        .toInt()
        .optional(),
      check
        .query('page')
        .isInt({ min: 1 })
        .toInt()
        .optional(),
      check
        .query('sort')
        .isString()
        .isIn(['email'])
        .optional(),
      check
        .query('orderBy')
        .isString()
        .isIn(['desc', 'asc'])
        .optional(),
    ],
    toApiResponse(async req => {
      const {
        query: { perPage = 100, page = 1, sort = 'email', orderBy = 'desc' },
      } = req;
      const { rows, count } = await getUsers({
        page,
        perPage,
        sort,
        orderBy,
      });

      return toPagination(req, rows, count, origin);
    }),
  );

  return router;
};

module.exports = { createGetUsersRoute };
