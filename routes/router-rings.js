const express     = require('express'),
      middlewares = require('../middleware/middlewares.js'),
      Controllers = require('../controllers/controllers.js'),
      soleConfig  = require('../sole-config.js');
let router = express.Router();
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
      }); //show home page with ring data
    } catch(err) {
      err.userMessage = 'Failed to get ring data for user.';
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/:id')
  .get(middlewares.isAuth, (req, res, next) => {
    if (req.params.id) {
      Controllers.Dashboard.getDashboardData(req.params.id, req.sessionToken)
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
      err.userMessage = 'Ring does not exist: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    }
  });

module.exports = router;