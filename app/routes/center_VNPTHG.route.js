const express = require('express');
const centerVNPTHGs = require('../controllers/center_VNPTHG.controller');

const router = express.Router();

router.route('/')
    .post(centerVNPTHGs.create)
    .get(centerVNPTHGs.findAll)
    .delete(centerVNPTHGs.deleteAll)

router.route('/:id')
    .put(centerVNPTHGs.update)
    .get(centerVNPTHGs.findOne)
    .delete(centerVNPTHGs.deleteOne)

module.exports = router;

