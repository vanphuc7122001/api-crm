const express = require('express');
const events = require('../controllers/event.controller');

const router = express.Router();

router.route('/')
    .post(events.create)
    .get(events.findAll)
    .delete(events.deleteAll)

router.route('/:id')
    .put(events.update)
    .get(events.findOne)
    .delete(events.deleteOne)

module.exports = router;

