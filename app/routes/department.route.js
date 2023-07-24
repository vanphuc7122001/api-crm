const express = require("express");
const department = require("../controllers/department.controller");

const router = express.Router();

router
  .route("/")
  .post(department.create)
  .get(department.findAll)
  .delete(department.deleteAll);

router
  .route("/:id")
  .put(department.update)
  .get(department.findOne)
  .delete(department.deleteOne);
router.route("/center/:centerId").get(department.findAllDepOfACenter);

module.exports = router;