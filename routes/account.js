var express = require('express');
const { User } = require('../models/user');
var router = express.Router();

router.get('/:userId', async (req, res, next) => {
  const user = await User.findByPk(req.params.userId);

  if (user) {
    res.render('account', { user: user, title: 'Poochie Pals', current_user: req.session.user });
  } else {
    res.redirect('/');
  }
});

module.exports = router;