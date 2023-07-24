const express = require("express");
const status_apps = require("../controllers/status_app.controller");

const router = express.Router();

router.route("/").post(status_apps.create)
.get(status_apps.findAll);

router
  .route("/:id")
  .put(status_apps.update)
  .get(status_apps.findOne)
  .delete(status_apps.deleteOne);

module.exports = router;
