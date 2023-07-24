const express = require("express");
const log = require("../controllers/log.controller");

const router = express.Router();

router.route("/").post(log.create).get(log.findAll);

router.route("/:id").get(log.findOne);

module.exports = router;