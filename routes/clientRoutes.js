const config = require("../config/config.json");
const ClientController = require("../controllers/ClientController");
const clientController = new ClientController();

const express = require("express");
const router = express.Router();

const apiVersion = config.apiVersion;

router.get(apiVersion + '/clients/books', (req, res, next) => clientController.getTakenBooks(req, res, next));

module.exports = router;