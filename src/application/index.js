const { createUser } = require('./user/index.js');

const createApplication = ({ sequelize }) => {
  const users = createUser({
    sequelize,
  });

  return { users };
};

module.exports = { createApplication };
