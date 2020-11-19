const { createGetUsers } = require('./get-users.js');

const createUser = ({ core, sequelize }) => {
  const getUsers = createGetUsers({
    core,
    sequelize,
  });

  return {
    getUsers,
  };
};

module.exports = { createUser };
