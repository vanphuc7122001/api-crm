const express = require('express');
const customerWorks = require('../controllers/customer_work.controller');

const router = express.Router();

router.route('/')
    .post(customerWorks.create)
    .get(customerWorks.findAll)

router.route('/:id')
    .put(customerWorks.update)
    .get(customerWorks.findOne)
    .delete(customerWorks.deleteOne)

module.exports = router;

