const express = require('express');
const companyKHs = require('../controllers/company_KH.controller');

const router = express.Router();

router.route('/')
    .post(companyKHs.create)
    .get(companyKHs.findAll)
    .delete(companyKHs.deleteAll)

router.route('/:id')
    .put(companyKHs.update)
    .get(companyKHs.findOne)
    .delete(companyKHs.deleteOne)

module.exports = router;


