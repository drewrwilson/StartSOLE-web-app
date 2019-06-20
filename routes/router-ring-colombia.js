const express     = require('express'),
      soleConfig  = require('../sole-config.js'),
      router      = express.Router();

/**
 * ====================================
 * ring routes: Colombia
 * ====================================
 */

const ringData = {
  fullName: 'SOLE Colombia', // full name in human-readable format
  slug: 'Colombia', // the name in the database
  language: 'es', // language for ring (this is an ok idea, maybe change later)
  logo: 'sole-colombia-logo-just-text.png'  // logo in /public/images/logos/ directory
};

soleConfig.language = ringData.language; //all users in colombia ring set cookie language to 'es'

router.route('/colombia')
  .get((req, res, next) => {
    res.redirect('/colombia/register/');
  });

router.route('/colombia/register')
  .get((req, res, next) => {
    req.setLocale(ringData.language); //"hard-code" this route to be defaultly in spanish
    res.render('register', {
      layout: 'no-sidebar.hbs',
      ring: ringData,
      config: soleConfig,
      isColombia: true
    });
  });

// route for logging in (spanish)
router.route('/colombia/login')
  .get((req, res, next) => {
    //this is a special case. this code is similar to the middlewares.isAuth function, but we do
    //it here because we want to redirect someone to /home if they're already logged in.
    const sessionToken = req.cookies ? req.cookies.sessionToken : undefined;
    if (sessionToken) {
      res.redirect('/home');
    } else {
      const email = req.query.email;
      req.setLocale(ringData.language); //"hard-code" this route to be defaultly in spanish
      res.render('login', {
        layout: 'prelogin.hbs',
        config: soleConfig,
        ring: ringData,
        email: email
      });
    }
  });

module.exports = router;