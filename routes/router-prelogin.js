const express     = require('express'),
      soleConfig  = require('../sole-config.js'),
      logger      = require('../logger.js'),
      util        = require ('util'),
      Controllers = require('../controllers/controllers.js'),
      router      = express.Router();

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
      msg += '\n*Info:* ' + util.inspect(req.body.info);
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


// static route for ToS
router.route('/terms-of-use')
  .get((req, res, next) => {
    res.render('page-terms-of-use', {layout: 'no-sidebar.hbs', config: soleConfig});
  });

// static route for privacy
router.route('/privacy')
  .get((req, res, next) => {
    res.render('page-privacy', {layout: 'no-sidebar.hbs', config: soleConfig});
  });

// static route for email verification success
router.route('/verify-email-success')
  .get((req, res, next) => {
    const email = req.query.email; //TODO: check if email exists
    res.render('verify-email-success', {layout: 'no-sidebar.hbs', config: soleConfig, email: email});
  });

// static route for email verification failure
router.route('/verify-email-failure')
  .get((req, res, next) => {
    const email = req.query.email; //TODO: check if email exists
    res.render('verify-email-failure', {layout: 'no-sidebar.hbs', config: soleConfig, email: email});
  });

module.exports = router;