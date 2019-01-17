const ClientModel = require("../models/ClientModel");
const clientModel = new ClientModel();

const admin = {
  name: "admin",
  password: "password",
  photoUrl: "test",
  isAdmin: true
};

const client = clientModel.create(admin)
  .then(res => console.log("admin registered, name: admin, password: password"))
  .catch(err => console.log(err));
