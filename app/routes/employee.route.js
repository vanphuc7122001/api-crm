const express = require('express');
const employees = require('../controllers/employee.controller');

const router = express.Router();

router.route('/')
    .post(employees.create)
    .get(employees.findAll)
    .delete(employees.deleteAll)

router.route('/:id')
    .put(employees.update)
    .get(employees.findOne)
    .delete(employees.deleteOne)

module.exports = router;

