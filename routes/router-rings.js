const express     = require('express'),
      middlewares = require('../middleware/middlewares.js'),
      Controllers = require('../controllers/controllers.js'),
      soleConfig  = require('../sole-config.js'),
      router      = express.Router();
/**
 * ====================================
 * rings routes
 * ====================================
 */
router.route('/')
  .get(middlewares.isAuth, async (req, res, next) => {
    //some ring display like what rings you're in
    try {
      const rings = await Controllers.User.getMyRings(req.sessionToken);
      res.render('rings', {
        config: soleConfig,
        rings: rings
      });
    } catch(err) {
      err.userMessage = 'Failed to get ring data for user.';
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/:id')
  .get(middlewares.isAuth, async (req, res, next) => {
    if (req.params.id) {
      try {
        const dashboard = await Controllers.Ring.getDashboardData(req.params.id, req.sessionToken);
        res.render('dashboard', {
          config: soleConfig,
          dashboard: dashboard
        });
      } catch (err) {
        err.userMessage = 'Could not load dashboard data for ring: ' + req.params.id;
        err.postToSlack = true;
        next(err);
      }
    } else {
      err.userMessage = 'Ring does not exist: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    }
  });

module.exports = router;