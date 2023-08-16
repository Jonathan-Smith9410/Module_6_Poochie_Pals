var express = require('express');
const logger = require('../lib/logger');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  logger('GET /');

  res.render('index', { title: 'Poochie Pals', current_user: req.session.user });
});

module.exports = router;
