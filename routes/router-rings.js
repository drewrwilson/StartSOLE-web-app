const express     = require('express'),
      middlewares = require('../middleware/middlewares.js'),
      Controllers = require('../controllers/controllers.js'),
      soleConfig  = require('../sole-config.js'),
      router      = express.Router();

router.use(middlewares.isAuth);

/**
 * ====================================
 * rings routes
 * ====================================
 */
router.route('/')
  .get(async (req, res, next) => {
    try {
      const rings = await Controllers.User.getAllRings(req.sessionToken);
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
  .get(async (req, res, next) => {
    try {
      const dashboard = await Controllers.Ring.getDashboardData(req.params.id, req.sessionToken);
      if(dashboard.rdn === "us.pa"){
        console.log("Pennsylvannia!");
        dashboard.rings = await Controllers.User.getAllRings(req.sessionToken);
      }
      res.render('dashboard', {
        config: soleConfig,
        includeChartJS: true,
        includeTableSorter: true,
        ringId: req.params.id,
        dashboard: dashboard
      });
    } catch (err) {
      err.userMessage = 'Could not load dashboard data for ring: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/:id/educators-growth')
  .get(async (req, res, next) => {
    try {
      const dashboardData = await Controllers.Ring.getDashboardData(req.params.id, req.sessionToken);
      res.render('partials/rings/dashboard-card-educators-growth.hbs', {
        layout: 'single-card',
        config: soleConfig,
        includeChartJS: true,
        ringId: req.params.id,
        dashboard: dashboardData
      });
    } catch (err) {
      err.userMessage = 'Could not load dashboard data for ring: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/:id/educators-by-grade')
  .get(async (req, res, next) => {
    try {
      const dashboardData = await Controllers.Ring.getDashboardData(req.params.id, req.sessionToken);
      res.render('partials/rings/dashboard-card-educators-by-grade.hbs', {
        layout: 'single-card',
        config: soleConfig,
        includeChartJS: true,
        ringId: req.params.id,
        dashboard: dashboardData
      });
    } catch (err) {
      err.userMessage = 'Could not load dashboard data for ring: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/:id/soles-by-grade')
  .get(async (req, res, next) => {
    try {
      const dashboardData = await Controllers.Ring.getDashboardData(req.params.id, req.sessionToken);
      res.render('partials/rings/dashboard-card-soles-by-grade.hbs', {
        layout: 'single-card',
        config: soleConfig,
        includeChartJS: true,
        ringId: req.params.id,
        dashboard: dashboardData
      });
    } catch (err) {
      err.userMessage = 'Could not load dashboard data for ring: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    }
  });
router.route('/:id/soles-growth')
  .get(async (req, res, next) => {
    try {
      const dashboardData = await Controllers.Ring.getDashboardData(req.params.id, req.sessionToken);
      res.render('partials/rings/dashboard-card-soles-growth.hbs', {
        layout: 'single-card',
        config: soleConfig,
        includeChartJS: true,
        ringId: req.params.id,
        dashboard: dashboardData
      });
    } catch (err) {
      err.userMessage = 'Could not load dashboard data for ring: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/:id/educators-by-subject')
  .get(async (req, res, next) => {
    try {
      const dashboardData = await Controllers.Ring.getDashboardData(req.params.id, req.sessionToken);
      res.render('partials/rings/dashboard-card-educators-by-subject.hbs', {
        layout: 'single-card',
        config: soleConfig,
        includeChartJS: true,
        ringId: req.params.id,
        dashboard: dashboardData
      });
    } catch (err) {
      err.userMessage = 'Could not load dashboard data for ring: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/:id/soles-by-subject')
  .get(async (req, res, next) => {
    try {
      const dashboardData = await Controllers.Ring.getDashboardData(req.params.id, req.sessionToken);
      res.render('partials/rings/dashboard-card-soles-by-subject.hbs', {
        layout: 'single-card',
        config: soleConfig,
        includeChartJS: true,
        ringId: req.params.id,
        dashboard: dashboardData
      });
    } catch (err) {
      err.userMessage = 'Could not load dashboard data for ring: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/:id/schools')
  .get(async (req, res, next) => {
    try {
      const dashboardData = await Controllers.Ring.getDashboardData(req.params.id, req.sessionToken);
      res.render('partials/rings/dashboard-card-table-of-schools.hbs', {
        layout: 'single-card',
        config: soleConfig,
        includeTableSorter: true,
        ringId: req.params.id,
        dashboard: dashboardData
      });
    } catch (err) {
      err.userMessage = 'Could not load dashboard data when attempting to show school table for ring: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    }
  });
module.exports = router;