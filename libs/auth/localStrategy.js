const LocalStrategy = require('passport-local').Strategy;
const ClientModel = require("../../models/ClientModel");

const clientModel = new ClientModel();

const localStrategy = new LocalStrategy(
  {
    usernameField: 'name',
    passwordField: 'password'
  },
  async (username, password, done) => {
    try {
      const user = await clientModel.authenticate(username, password);

      if (user) {
        done(null, user)
      } else {
        done(null, false, { message: 'Incorrect username or password'})
      }
    } catch (e) {
      done(null, false, { message: 'Incorrect username or password'});
    }
  }
);

module.exports = localStrategy;