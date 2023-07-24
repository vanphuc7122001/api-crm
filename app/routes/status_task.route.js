const express = require("express");
const status_tasks = require("../controllers/status_task.controller");

const router = express.Router();

router.route("/").post(status_tasks.create).get(status_tasks.findAll);

router
  .route("/:id")
  .put(status_tasks.update)
  .get(status_tasks.findOne)
  .delete(status_tasks.deleteOne);

module.exports = router;
