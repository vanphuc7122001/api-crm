const express = require('express');
const cycles = require('../controllers/cycle.controller');

const router = express.Router();

router.route('/')
    .post(cycles.create)
    .get(cycles.findAll)
    .delete(cycles.deleteAll)

router.route('/:id')
    .put(cycles.update)
    .get(cycles.findOne)
    .delete(cycles.deleteOne)

module.exports = router;


