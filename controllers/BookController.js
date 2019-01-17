const BookModel = require("../models/BookModel");
const ClientModel = require("../models/ClientModel");
const AuthorModel = require("../models/AuthorModel");
const AuthorsToBooksModel = require("../models/AuthorsToBooksModel");

class BookController {
  constructor() {
    this._bookModel = new BookModel();
    this._clientModel = new ClientModel();
    this._authorModel = new AuthorModel();
    this._authorsToBooksModel = new AuthorsToBooksModel();
  }

  async getList(req, res, next) {
    try {
      const list = await this._bookModel.findAll({
        where: {
          client_id: null
        }
      });

      const authorsDirty = await Promise.all(list.map(book => this._authorsToBooksModel.getAuthors(book.id)));

      const authors = authorsDirty.map(author => {
        const stringifiedAuthor = JSON.stringify(author[0]);
        if (stringifiedAuthor) {
          return JSON.parse(stringifiedAuthor);
        } else {
          return []
        }
      });

      const books = list.map((book, index) => {
        book = JSON.parse(JSON.stringify(book.dataValues));
        book.authors = authors[index];

        return book;
      });

      res.json(books);
    } catch(err) {
      next(err);
    }
  }

  async add(req, res, next) {
    try {
      const book = req.body;
      book.client_id = null;
      const authorIds = req.body.authorIds;

      if (!authorIds || !(authorIds instanceof Array)) {
        return next({code:400, message: "authors should be array"});
      }

      const authors = await Promise.all(
        authorIds.map(authorId => this._authorModel.findById(authorId))
      );

      if (!authors.every(author => !!author)) {
        return next({code:400, message: "incorrect authorId"});
      }

      const savedBook = await this._bookModel.create(book);

      const bookId = savedBook.dataValues.id;

      const relationPromises = authorIds.map(
        authorId => this._authorsToBooksModel.addRelation(authorId, bookId)
      );

      await Promise.all(relationPromises);

      res.status(201).send();
    } catch(err) {
      next(err);
    }
  }

  async takeBook(req, res, next) {
    try {
      const clientId = req.session.passport.user;
      const bookId = req.params.bookId;

      const clientResult = await this._clientModel.findById(clientId);
      const client = clientResult.dataValues;
      console.log(client);
      const clientBooksTakenCount = client.booksTakenCount;

      if (clientBooksTakenCount > 4) {
        return next({code: 400, message: 'maximum books taked'});
      }

      const canTakeBook = await this._bookModel.canTakeBook(bookId);

      if (!canTakeBook) {
        return next({code: 400, message: 'book is not available'});
      }

      await this._bookModel.takeBook(clientId, bookId);
      await this._clientModel.takeBook(clientId, clientBooksTakenCount);

      res.status(200).send();
    } catch(err) {
      next(err);
    }
  }

  async returnBook(req, res, next) {
    try {
      const clientId = req.session.passport.user;
      const bookId = req.params.bookId;
      
      const isBookTaken = await this._bookModel.isBookTaken(clientId, bookId);

      if (!isBookTaken) {
        return next({code: 400, message: 'book was not taken'});
      }

      await this._bookModel.returnBook(clientId, bookId);
      await this._clientModel.returnBook(clientId, clientBooksTakenCount);

      res.status(200).send();
    } catch(err) {
      next(err);
    }
  }
}

module.exports = BookController;