const express = require("express");
const unit = require("../controllers/unit.controller");

const router = express.Router();

router.route("/").post(unit.create).get(unit.findAll).delete(unit.deleteAll);

router.route("/:id").put(unit.update).get(unit.findOne).delete(unit.deleteOne);
router.route("/dep/:depId").get(unit.findAllUnitOfADep);

module.exports = router;