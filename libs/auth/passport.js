const ClientModel = require("../../models/ClientModel");
const clientModel = new ClientModel();

const localStrategy = require("./localStrategy");

module.exports = passport => {
  passport.use("local", localStrategy);

  passport.serializeUser((user, done) => {
    done(null, user.id)
  });

  passport.deserializeUser(async (id, done) => {
    let user = await clientModel.findById(id);

    done(null, user)
  })
};