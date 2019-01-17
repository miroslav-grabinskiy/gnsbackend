const config = require("../config/config.json");
const ClientController = require("../controllers/ClientController");
const clientController = new ClientController();

const express = require("express");
const router = express.Router();

const apiVersion = config.apiVersion;

router.post(apiVersion + "/registration", (req, res, next) => clientController.registration(req, res, next));
router.post(apiVersion + "/login", (req, res, next) => clientController.login(req, res, next));
router.get(apiVersion + "/logout", (req, res, next) => clientController.logout(req, res, next));

module.exports = router;