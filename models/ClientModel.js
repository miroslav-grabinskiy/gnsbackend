const Sequelize = require("sequelize");
const crypto = require("crypto");
const BaseMysql = require("./BaseMysql");

const tableName = "clients";

class ClientModel extends BaseMysql {
  constructor() {
    super();

    const Clients = this._sequelize.define("Client", {
      id: {
        type: Sequelize.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      hashedPassword: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true
        }
      },
      salt: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true
        }
      },
      password: {
        type: Sequelize.VIRTUAL,
        set: function (password) {
          this._plainPassword = password;
          this.salt = Math.random() + '';
          this.hashedPassword = this.encryptPassword(password);
        },
        get: function() {return this._plainPassword; },
        validate: {
          notEmpty: true,
          isLongEnough: function (val) {
            if (val.length < 7) {
              throw new Error("Please choose a longer password")
            }
          }
        }
      },
      photoUrl: {
        type: Sequelize.DataTypes.STRING(1024),
        allowNull: false
      },
      name: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      isAdmin: {
        type: Sequelize.DataTypes.TINYINT
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.NOW
      },
      booksTakenCount: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0
      }
    }, {
      tableName: tableName,
      timestamps: false
    });

    Clients.prototype.checkPassword = function(password) {
      return this.encryptPassword(password) === this.dataValues.hashedPassword;
    };

    Clients.prototype.encryptPassword = function(password) {
      return crypto.createHmac('sha1', this.dataValues.salt).update(password).digest('hex');
    };

    Clients.associate = (models) => {
      Clients.belongsToMany(models.Books, {
        through: 'clients_to_books',
        as: 'books',
        foreignKey: 'client_id'
      });
    };

    this._schema = Clients;
  }

  async takeBook(clientId, booksTakenCount) {
    return this._schema.update({
      booksTakenCount: booksTakenCount + 1
    }, {
      where: {
        id: clientId
      }
    });
  }

  async returnBook(clientId, booksTakenCount) {
    return this._schema.update({
      booksTakenCount: booksTakenCount - 1
    }, {
      where: {
        id: clientId
      }
    });
  }

  async authenticate(name, password) {
    const client = await this._schema.find({
      where: {
        name
      }
    });

    if (!client) {
      return Promise.reject();
    }

    if (!client.checkPassword(password)) {
      return Promise.reject();
    }

    return client;
  }
}

module.exports = ClientModel;
