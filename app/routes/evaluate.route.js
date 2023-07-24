const express = require("express");
const evaluates = require("../controllers/evaluate.controller");

const router = express.Router();

router.route("/").post(evaluates.create).get(evaluates.findAll);

router
  .route("/:id")
  .put(evaluates.update)
  .get(evaluates.findOne)
  .delete(evaluates.deleteOne);

module.exports = router;
