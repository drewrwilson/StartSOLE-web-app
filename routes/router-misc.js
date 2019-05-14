const express = require('express');
let router = express.Router();
const middlewares = require('../middleware/middlewares.js');
const Controllers = require('../controllers/controllers.js');
const soleConfig  = require('../sole-config.js');

/**
 * ====================================
 * misc routes, not intended for users
 * ====================================
 */
router.route('/random-picture')
  .get((req, res, next) => {
    const pic = Controllers.Test.randomPicture();
    res.sendFile('images/test-images/'+pic,{root: __dirname + '/../public/'});
  });

router.route('/dashboard')
  .get(middlewares.isAuth, (req, res, next) => {
    if (req.query.ring) {
      Controllers.Dashboard.getDashboardData(req.query.ring, req.sessionToken)
        .then(dashboard => {
          res.render('dashboard', {
            config: soleConfig,
            dashboard: dashboard
          });
        }).catch(err => {
        err.userMessage = 'Could not load dashboard data.';
        err.postToSlack = true;
        next(err);
      });
    } else {
      err.userMessage = 'Ring does not exist: ' + req.query.ring;
      err.postToSlack = true;
      next(err);
    }
  });

module.exports = router;