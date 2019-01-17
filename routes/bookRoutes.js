const config = require("../config/config.json");
const isAdmin = require("../middlewares/isAdmin");
const BookController = require("../controllers/BookController");
const bookController = new BookController();

const express = require("express");
const router = express.Router();

const apiVersion = config.apiVersion;

router.get(apiVersion + '/books', (req, res, next) => bookController.getList(req, res, next));
router.post(apiVersion + '/books', isAdmin, (req, res, next) => bookController.add(req, res, next));

router.put(apiVersion + '/books/:bookId/take', (req, res, next) => bookController.takeBook(req, res, next));
router.put(apiVersion + '/books/:bookId/return', (req, res, next) => bookController.returnBook(req, res, next));

module.exports = router;