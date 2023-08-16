var express = require('express');
const { User, sequelize } = require('../models/user');
const logger = require('../lib/logger');
var router = express.Router();

/* GET signUp page. */
router.get('/', function (req, res, next) {
  res.render('sign-in', { title: 'Poochie Pals', current_user: req.session.user });
});

router.post('/', async (req, res) => {
  // Login
  try {
    const users = await sequelize.query(
      `SELECT * FROM Users WHERE email = '${req.body.email}' AND password = '${req.body.password}';`,
      {
        model: User,
        mapToModel: true
      });


    if (users.length > 0) {
        const user = users[0];

        logger("New sign in in as " + user.email);

        req.session.user = user;
        res.redirect('/');
    } else {
        // Invalid password
        res.redirect('/sign-in');
    }
  } catch (error) {
    // Send this error to the logs S3 bucket
    logger(`Failed to login with email: 
                  email=${req.body.email}`);
    res.redirect('/sign-in');
  }
});

module.exports = router;