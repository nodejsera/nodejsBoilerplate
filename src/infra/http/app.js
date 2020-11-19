const express = require('express');
const path = require('path');
const cors = require('cors');
const httpAuth = require('express-http-auth');
const bodyParser = require('body-parser');
const bodyParserJsonError = require('express-body-parser-json-error');
const config = require('../../config.js');

const { createUsersRoute } = require('./routes/users/index.js');
const { createCore } = require('../../core/index.js');
const { createApplication } = require('../../application/index.js');
const { createNotFoundRoute } = require('./routes/not-found.js');
const { createUriErrorRoute } = require('./routes/uri-error.js');
const { createErrorRoute } = require('./routes/error.js');
const { createBruteforce } = require('./utils/bruteforce.js');

const createApp = ({
  reportError,
  // config: { cors: { origin: corsOrigin } } = config,
  sequelize = {},
  application = {},
  core,
  config: { cors: { origin: corsOrigin } } = config,
}) => {
  core = core || createCore({ sequelize }); // eslint-disable-line no-param-reassign
  // eslint-disable-next-line no-param-reassign
  application = {
    ...createApplication({ sequelize, core }),
    ...application,
  };

  const app = express();
  const bruteforce = createBruteforce({ sequelize, reportError });
  const notFoundRoute = createNotFoundRoute();
  const uriErrorRoute = createUriErrorRoute();
  const errorRoute = createErrorRoute({ reportError });

  const usersRoute = createUsersRoute({
    core,
    application,
    bruteforce,
    config,
  });

  if (config.docs.username && config.docs.password) {
    app.use('/docs', [
      httpAuth.realm('Docs'),
      ({ username, password }, res, next) => {
        if (
          username !== config.docs.username ||
          password !== config.docs.password
        ) {
          res.sendStatus(401);
          return;
        }
        next();
      },
    ]);
  }
  app.use('/docs', express.static(path.resolve(__dirname, '../../../apidoc')));

  app.use(
    cors({
      origin: corsOrigin,
      methods: ['POST', 'GET', 'PATCH', 'DELETE', 'PUT'],
      exposedHeaders: ['Content-Length', 'x-access-token'],
    }),
  );

  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    app.set('trust proxy', true);
  }

  app.use(bodyParser.json());
  app.use(bodyParserJsonError());

  app.use('/users', usersRoute);
  app.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    // Send the response body as "Hello World"
    res.end('Node boilerplate!!\n');
  });

  app.use(notFoundRoute);
  app.use(uriErrorRoute);
  app.use(errorRoute);

  return app;
};

module.exports = { createApp };
