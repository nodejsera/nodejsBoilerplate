module.exports = {
  up: (queryInterface, { DATE, STRING, INTEGER }) =>
    queryInterface.createTable('ExpressBrutes', {
      key: {
        type: STRING,
        primaryKey: true,
      },
      lifetime: DATE,
      firstRequest: DATE,
      lastRequest: DATE,
      count: INTEGER,
      createdAt: {
        allowNull: false,
        type: DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DATE,
      },
    }),
  down: queryInterface => queryInterface.dropTable('ExpressBrutes'),
};
