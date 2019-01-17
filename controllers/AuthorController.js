const AuthorModel = require("../models/AuthorModel");

class AuthorController {
  constructor() {
    this._authorModel = new AuthorModel();
  }

  async getList(req, res, next) {
    try {
      const list = await this._authorModel.findAll();
      res.json(list);
    } catch(err) {
      next(err);
    }
  }

  async add(req, res, next) {
    try {
      const author = req.body;
      await this._authorModel.create(author);

      res.status(201).send();
    } catch(err) {
      next(err);
    }
  }
}

module.exports = AuthorController;