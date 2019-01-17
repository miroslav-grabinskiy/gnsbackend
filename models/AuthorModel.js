const Sequelize = require("sequelize");
const BaseMysql = require("./BaseMysql");

const tableName = "authors";

class AuthorModel extends BaseMysql {
  constructor() {
    super();

    const Authors = this._sequelize.define("Author", {
      id: {
        type: Sequelize.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.DataTypes.STRING(1024),
        allowNull: false
      },
      surName: {
        type: Sequelize.DataTypes.STRING(1024),
        allowNull: false
      }
    }, {
      tableName: tableName,
      timestamps: false
    });

     Authors.associate = (models) => {
       Authors.belongsToMany(models.Books, {
         through: 'authors_to_books',
         as: 'authors',
         foreignKey: 'author_id'
       });
     };

    this._schema = Authors;

  }
}

module.exports = AuthorModel;
