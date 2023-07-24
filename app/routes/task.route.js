const express = require('express');
const tasks = require('../controllers/task.controller');

const router = express.Router();

router.route('/')
    .post(tasks.create)
    .get(tasks.findAll)
    .delete(tasks.deleteAll)

router.route('/:id')
    .put(tasks.update)
    .get(tasks.findOne)
    .delete(tasks.deleteOne)

module.exports = router;

