const express = require('express');
const customer_habits = require('../controllers/customer_habit.controller');

const router = express.Router();

router.route('/')
    .post(customer_habits.create)
    .get(customer_habits.findAll)

router.route('/:id')
    .get(customer_habits.findOne)
    .post(customer_habits.deleteOne)


module.exports = router;

