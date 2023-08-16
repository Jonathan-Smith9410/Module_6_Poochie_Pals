var express = require('express');
const { User } = require('../models/user');
const logger = require('../lib/logger');
var router = express.Router();

/* GET signUp page. */
router.get('/', function (req, res, next) {
  res.render('sign-up', { title: 'Poochie Pals', current_user: req.session.user });
});

router.post('/', async (req, res) => {
  const newUser = User.build({
    full_name: req.body.full_name,
    username: req.body.username,
    email: req.body.email,
    user_type: req.body.user_type,
    pet_name: req.body.pet_name,
    password: req.body.password
  });

  try {
    await newUser.save();
    res.redirect('/');
  } catch (error) {
    // Send this error to the logs S3 bucket
    logger(`Failed to create user with signup params:
                  username=${newUser.username} full_name=${newUser.full_name}
                  email=${newUser.email}`);
    logger(error);

    res.redirect('/');
  }
});

module.exports = router;
