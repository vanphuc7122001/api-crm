const express = require('express');
const accounts = require('../controllers/account.controller');

const router = express.Router();

router.route('/')
    .post(accounts.create)
    .get(accounts.findAll)
    .delete(accounts.deleteAll)

router.route('/:id')
    .put(accounts.update)
    .get(accounts.findOne)
    .delete(accounts.deleteOne)

router.route('/login')
    .post(accounts.login)
module.exports = router;

