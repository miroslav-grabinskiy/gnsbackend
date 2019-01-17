const express = require("express");
const bodyParser = require("body-parser");
const passport   = require("passport");
const session    = require("cookie-session");

const authMiddleware = require("../middlewares/auth");
const passportInit = require("../libs/auth/passport");

const config = require("../config/config");

const routeFiles = [
  "../routes/authorRoutes",
  "../routes/authRoutes",
  "../routes/bookRoutes",
  "../routes/clientRoutes"
];

class Server {
  constructor() {
    this._app = express();
  }

  init() {
    this._initMiddlewares();
    this._initRoutes();
    this._initPassport();
    this._initErrorHandler();
  }

  start() {
    const port = config.port;

    this._app.listen(port, () => {
      console.log(`started on port ${port}`);
    });
  }

  _initRoutes() {
    routeFiles.forEach(path => {
      const routes = require(path);

      this._app.use(routes);
    });
  }
  
  _initMiddlewares() {
    this._app.use(bodyParser.urlencoded({ extended: true }));
    this._app.use(bodyParser.json());


    /*this._app.use(session({
      secret: config.session.secret,
      resave: true,
      saveUninitialized:true
    }));*/

    this._app.use(session({
      name: 'mysession',
      keys: ['vueauthrandomkey'],
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }));

    this._app.use(passport.initialize());
    this._app.use(passport.session());
    this._app.use(authMiddleware);
  }

  _initPassport() {
    passportInit(passport);
  }

  _initErrorHandler() {
    this._app.use((err, req, res, next) => {
      const statusCode = err.code || 500;

      console.log(err);
      res.status(statusCode).json(err);
    });
  }
}

module.exports = Server;