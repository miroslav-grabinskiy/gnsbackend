const Sequelize = require("sequelize");
const config = require("../config/config.json");
const mysql = require("mysql");

const options = config.mysql;
const MODELS_DIR = "../models/";

class Mysql {
  constructor() {
    this._db = null;
    this._sequelize = new Sequelize(options.database, options.user,
      options.password, {
        host: options.host,
        dialect: "mysql",
        operatorsAliases: false,
        logging: false
      }
    );
  }

  getSequelize() {
    return this._sequelize;
  }

  init(cb) {
    this.connect(err => {
      if (err) {
        console.error(err);
      }
      return cb(err);
    });
  }

  connect(cb) {
    this._db = mysql.createPool(options);
    this._db.getConnection((err, connection) => {
      if (connection) {
        connection.release();
      }
      return cb(err);
    });
  }
}

const db = new Mysql();

db.init((err) => console.error(err));

module.exports = db;