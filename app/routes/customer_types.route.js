const express = require('express');
const customerTypes = require('../controllers/customer_types.controller');

const router = express.Router();

router.route('/')
    .post(customerTypes.create)
    .get(customerTypes.findAll)

router.route('/:id')
    .put(customerTypes.update)
    .get(customerTypes.findOne)
    .delete(customerTypes.deleteOne)

module.exports = router;




