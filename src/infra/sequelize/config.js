require('dotenv').config(); // eslint-disable-line no-unused-expressions
const yn = require('yn');
const highlightSql = require('sequelize-log-syntax-colors');
const { format } = require('sql-formatter');
const { Op } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const DOCKER_TEST_DATABASE_URL =
  'postgres://postgres:ucreate@localhost:5436/nodejs_boilerplate_test';

const operatorsAliases = Op; // https://github.com/sequelize/sequelize/issues/8417#issuecomment-355123149
const dialect = 'postgres';
const username = 'postgres';
const password = 'postgres';
const config = {
  development: {
    dialect,
    username,
    password,
    url: process.env.DATABASE_URL,
    sync: true,
    logging: text => console.log(highlightSql(format(text))), // eslint-disable-line no-console,
    ssl: yn(process.env.DATABASE_SSL),
    dialectOptions: {
      ssl: yn(process.env.DATABASE_SSL),
    },
    rollbarAccessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    reportErrorRequest: true,
  },
  test: {
    dialect,
    username,
    password,
    url: process.env.TEST_DATABASE_URL,
    sync: process.env.SYNC_DATABASE || false,
    logging: false,
    operatorsAliases,
    ssl: false,
    dialectOptions: {
      ssl: false,
    },
  },
  production: {
    dialect,
    username,
    password,
    url: process.env.DATABASE_URL,
    sync: false,
    logging: false,
    ssl: true,
    dialectOptions: {
      ssl: true,
    },
    rollbarAccessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    reportErrorRequest: true,
  },
};

module.exports = config;
module.exports.config = config[env];
