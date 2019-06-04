const express = require('express');
let router = express.Router();
const middlewares = require('../middleware/middlewares.js');
const Controllers = require('../controllers/controllers.js');
const soleConfig  = require('../sole-config.js');
const logger = require('../logger.js');
const util = require ('util');


router.route('/register')
  .get((req, res, next) => {
    res.render('register', {
      layout: 'no-sidebar.hbs',
      config: soleConfig
    });
  });

//route for logging out
router.route('/logout')
  .get((req, res, next) => {
    res.render('logout', {
      layout: 'no-sidebar.hbs',
      config: soleConfig
    });
  });

router.route('/google-login-error')
  .post((req, res) => {
    let msg = '*Someone just tried to login with google, but it did not work.*';
    msg += '\n*Here\'s the error we got:* ' + util.inspect(req.body.error);
    msg += '\n*Header data:* ' + util.inspect(req.headers);
    logger.slackbotSimple(msg);
  });

// route for logging in
router.route('/login')
  .get((req, res, next) => {
    //this is a special case. this code is similar to the middlewares.isAuth function, but we do
    //it here because we want to redirect someone to /home if they're already logged in.
    const sessionToken = req.cookies ? req.cookies.sessionToken : undefined;
    if (sessionToken) {
      if (req.query.originalUrl) {
        res.redirect(req.query.originalUrl);
      } else {
        res.redirect('/home');
      }

    } else {
      res.render('login', {
        layout: 'prelogin.hbs',
        config: soleConfig,
        email: req.query.email,
        originalUrl: req.query.originalUrl
      });
    }
  });


module.exports = router;