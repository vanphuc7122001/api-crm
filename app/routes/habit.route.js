const express = require('express');
const habits = require('../controllers/habit.controller');

const router = express.Router();

router.route('/')
    .post(habits.create)
    .get(habits.findAll)
    .delete(habits.deleteAll)

router.route('/:id')
    .put(habits.update)
    .get(habits.findOne)
    .delete(habits.deleteOne)

module.exports = router;

