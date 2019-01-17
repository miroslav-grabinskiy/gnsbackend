const ClientModel = require("../models/ClientModel");
const AuthorsToBooksModel = require("../models/AuthorsToBooksModel");
const BookModel = require("../models/BookModel");
const passport = require("passport");

class ClientController {
  constructor() {
    this._clientModel = new ClientModel();
    this._bookModel = new BookModel();
    this._authorsToBooksModel = new AuthorsToBooksModel();
  }

  async getTakenBooks(req, res, next) {
    try {
      const clientId = req.session.passport.user;
      const takenBooks = await this._bookModel.getClientBooks(clientId);

      const authorsDirty = await Promise.all(takenBooks.map(book => this._authorsToBooksModel.getAuthors(book.id)));

      const authors = authorsDirty.map(author => {
        const stringifiedAuthor = JSON.stringify(author[0]);
        if (stringifiedAuthor) {
          return JSON.parse(stringifiedAuthor);
        } else {
          return []
        }
      });

      const books = takenBooks.map((book, index) => {
        book = JSON.parse(JSON.stringify(book.dataValues));
        book.authors = authors[index];

        return book;
      });

      res.send(books);
    } catch(err) {
      next(err);
    }
  }
  
  async registration(req, res, next) {
    try {
      const clientToSave = req.body;
      clientToSave.isAdmin = false;
      
      const client = await this._clientModel.create(clientToSave);

      req.login(client, (err) => {
        if (err) {
          return next(err);
        }

        res.status(201).send();
      });
    } catch(err) {
      next(err);
    }
  }
  
  async login(req, res, next) {
    const name = req.body.name;
    const password = req.body.password;

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next({code: 400, message: [user, "Cannot log in", info]});
      }

      req.login(user, err => {
        res.status(201).send();
      });
    })(req, res, next);
  }

  async logout(req, res, next) {
    req.logout();

    return res.send();
  }

  async info(req, res, next) {
    const userId = req.session.passport.user;
    console.log('uid', userId);

    let user = await this._clientModel.findById(userId);

    console.log([user, req.session]);

    res.send({ user: user });
  }
}

module.exports = ClientController;