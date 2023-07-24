const express = require('express');
const customer_events = require('../controllers/customer_event.controller');

const router = express.Router();

router.route('/')
    .post(customer_events.create)
    .get(customer_events.findAll)

router.route('/:id')
    .get(customer_events.findOne)
    .post(customer_events.deleteOne)

module.exports = router;

