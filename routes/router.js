const express     = require('express'),
      middlewares = require('../middleware/middlewares.js'),
      Controllers = require('../controllers/controllers.js'),
      soleConfig  = require('../sole-config.js'),
      router      = express.Router();

/**
 * ====================================
 * default routes
 * ====================================
 */

/**
 * root route (heh, heh)
 */
router.route('/')
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      const profileIsCompleted = await Controllers.User.isProfileComplete(req.sessionToken);
      res.redirect(profileIsCompleted ? '/home' : '/profile/complete');
    } catch(err) {
      err.userMessage = 'Failed to check if users profile is complete';
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/home')
  .get(middlewares.isAuth, middlewares.setLanguage, async (req, res, next) => {
    soleConfig.language = req.language;
    try {
      const roleData = await Controllers.User.getRoleData(req.sessionToken);
      let homeData = {
        soles: [],
        questions: [],
        roleData: roleData,
        config: soleConfig,
      };

      return Controllers.User.getAllRings(req.sessionToken).then(rings => {
          homeData.rings = rings;
          res.render('home', homeData); //show home page with ring data
      }).catch(err => {
          err.userMessage = 'Failed to ring data for user.';
          err.postToSlack = true;
          next(err);
      });
    } catch (err) {
      err.userMessage = 'Failed to role data for user.';
      err.postToSlack = true;
      next(err);
    }
  });

// static route for History of SOLE
router.route('/history')
  .get(middlewares.isAuth, (req, res, next) => {
    res.render('page-history', {config: soleConfig});
  });

// static route for History of SOLE
router.route('/how')
  .get(middlewares.isAuth, (req, res, next) => {
    res.render('page-how-to-sole', {config: soleConfig});
  });


// routes for resources
router.route('/resources')
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      const resources = await Controllers.Resource.getAll();
      res.render('page-resources', {
        resources: resources,
        config: soleConfig
      });
    } catch (err) {
      err.userMessage = 'Error getting resources.';
      err.postToSlack = true;
      next(err);
    }
  });

module.exports = router;