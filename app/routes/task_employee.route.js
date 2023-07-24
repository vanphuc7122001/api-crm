const express = require("express");
const task_employees = require("../controllers/task_employee.controller");

const router = express.Router();

router.route("/").post(task_employees.create).get(task_employees.findAll);
router.route("/del").post(task_employees.deleteOne);
router.route("/:id").get(task_employees.findOne);

module.exports = router;
