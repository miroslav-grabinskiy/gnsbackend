const config = require("../config/config.json");
const isAdmin = require("../middlewares/isAdmin");
const AuthorController = require("../controllers/AuthorController");
const authorController = new AuthorController();

const express = require("express");
const router = express.Router();

const apiVersion = config.apiVersion;

router.get(apiVersion + '/authors', (req, res, next) => authorController.getList(req, res, next));
router.post(apiVersion + '/authors', isAdmin, (req, res, next) => authorController.add(req, res, next));

module.exports = router;