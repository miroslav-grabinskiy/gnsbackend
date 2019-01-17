const Sequelize = require("sequelize");
const BaseMysql = require("./BaseMysql");

const AuthorModel = require("./AuthorModel");
const authorModel = new AuthorModel();

const tableName = "authors_to_books";

class AuthorsToBooksModel extends BaseMysql {
  constructor() {
    super();

    const AuthorsToBooks = this._sequelize.define("AuthorsToBooks", {
      id: {
        type: Sequelize.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      author_id: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false
      },
      book_id: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false
      }
    }, {
      tableName: tableName,
      timestamps: false
    });

    AuthorsToBooks.associate = (models) => {
      AuthorsToBooks.belongsToMany(models.Authors, {
        through: 'authors_to_books',
        as: 'authors',
        foreignKey: 'author_id'
      });
    };

    this._schema = AuthorsToBooks;
  }

  async addRelation(authorId, bookId) {
    return this._schema.create({
      author_id: authorId,
      book_id: bookId
    })
  }

  async getAuthors(bookId) {
    const model = authorModel.getInstance();
    return this._sequelize.query(
      `SELECT 
        authors_to_books.author_id, 
        authors.surname
      FROM authors_to_books
        LEFT JOIN authors
      ON authors_to_books.author_id = authors.id
      WHERE authors_to_books.book_id = ${bookId}`
    )
  }
}

module.exports = AuthorsToBooksModel;
