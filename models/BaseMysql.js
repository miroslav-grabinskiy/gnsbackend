const mysql = require("../libs/Mysql");

class BaseMysql{
  constructor() {
    this._sequelize = mysql.getSequelize();
  }

  getInstance() {
    return this._schema;
  }

  create(queryOptions) {
    return this.getInstance().create(queryOptions);
  }

  findAll(queryOptions) {
    return this.getInstance().findAll(queryOptions);
  }

  findOne(queryOptions) {
    return this.getInstance().findOne(queryOptions);
  }

  findById(queryOptions) {
    return this.getInstance().findById(queryOptions);
  }
}

module.exports = BaseMysql;