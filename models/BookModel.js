const Sequelize = require("sequelize");
const BaseMysql = require("./BaseMysql");

const tableName = "books";

class BookModel extends BaseMysql {
  constructor() {
    super();

    const Books = this._sequelize.define("Book", {
      id: {
        type: Sequelize.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.DataTypes.STRING(1024),
        allowNull: false
      },
      releaseAt: {
        type: Sequelize.DataTypes.DATE
      },
      client_id: {
        type: Sequelize.DataTypes.INTEGER,
      }
    }, {
      tableName: tableName,
      timestamps: false
    });
    
    this._schema = Books;
  }

  async isBookTaken(clientId, bookId) {
    const book = await this._schema.findById(bookId);

    if (!book || !book.dataValues) {
      return false;
    }

    return book.client_id === clientId;
  }

  async getClientBooks(clientId) {
    return this._schema.findAll({
      where: {
        client_id: clientId
      }
    });
  }

  async canTakeBook(bookId) {
    const book = await this._schema.findById(bookId);

    if (!book) {
      return Promise.reject();
    }

    return !book.client_id
  }

  async takeBook(clientId, bookId) {
    return this._schema.update(
      {client_id: clientId},
      {where: {id: bookId}}
    );
  }

  async returnBook(clientId, bookId) {
    return this._schema.update(
      {client_id: null},
      {where: {id: bookId}}
    );
  }
}

module.exports = BookModel;
