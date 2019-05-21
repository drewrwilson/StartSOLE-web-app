const express     = require('express'),
      middlewares = require('../middleware/middlewares.js'),
      Controllers = require('../controllers/controllers.js'),
      soleConfig  = require('../sole-config.js'),
      moment      = require('moment');
let router = express.Router();

/**
 * ====================================
 * admin routes
 * ====================================
 */

router.route('/')
  .get(middlewares.isAuth, (req, res, next) => {
    Controllers.User.getRoleData(req.sessionToken).then(roleData => {
      if (!roleData.isAdmin) { //TODO: make a middleware for isAdmin
        res.redirect('/home');
      } else {
        Controllers.User.adminSummaryData(req.sessionToken).then(summaryData => {
          res.render('admin/admin', {
            config: soleConfig,
            layout: 'no-footer.hbs',
            roleData: roleData,
            usersToday: summaryData
          });
        });
      }
    }).catch(err => {
      err.userMessage = 'Error getting role data for admin user.';
      next(err);
    });
  });
/**
 * route for viewing and approving soles
 */
router.route('/pending-soles')
  .get(middlewares.isAuth, (req, res, next) => {
    Controllers.Admin.getPendingSoles(req.sessionToken).then(soles => {
      //format the shortText and date for each sole
      soles.forEach(sole => {
        sole.question.shortText = sole.question.text.substring(0,10);
        sole.reflectionDate = moment(sole.reflectionDate, 'YYYYMMDD').fromNow();
      });

      //render the view
      res.render('admin/admin-pending-soles', {
        config: soleConfig,
        layout: 'default.hbs',
        totalSoles: soles.length,
        soles: soles
      });
    }).catch(err => {
      err.userMessage = 'Failed to get pending soles for admin approval.';
      err.postToSlack = true;

      next(err);
    });
  })
  .post(middlewares.isAuth, (req, res, next) => {
    const requestSocialMedia = (req.body.socialMediaCheck == 'true');//true if we need to request Social Media Approval via email, false otherwise
    if (req.body.action === 'approve') {
      Controllers.Admin.approveSole(req.body.soleId, req.body.comment, requestSocialMedia, req.sessionToken).then(soleId => {
        res.redirect('/admin/pending-soles');
      });
    } else if (req.body.action === 'reject') {
      Controllers.Admin.rejectSole(req.body.soleId, req.body.comment, req.sessionToken).then(soleId => {
        res.redirect('/admin/pending-soles');
      });
    } else {
      err.userMessage = 'Got a malformed post without reject or approve.';
      err.postToSlack = true;
      next(err);
    }
  });

/**
 * route for browsing all SOLEs, regardless of user
 */
router.route('/browse-soles')
  .get(middlewares.isAuth, (req, res, next) => {
    Controllers.User.getRoleData(req.sessionToken).then(roleData => {
      if(!roleData.isAdmin) {
        res.redirect('/home');
      } else {
        res.render('admin/admin-browse-soles', {
          config: soleConfig,
          roleData: roleData
        });
      }
    }).catch(err => {
      err.userMessage = 'Error getting role data for admin user.';
      next(err);
    });
  });

/**
 * route for browsing all users
 */
router.route('/browse-users')
  .get(middlewares.isAuth, (req, res, next) => {
    Controllers.User.getRoleData(req.sessionToken).then(roleData => {
      if(!roleData.isAdmin){
        res.redirect('/home');
      } else {
        res.render('admin/admin-browse-users', {
          config: soleConfig,
          roleData: roleData
        });
      }
    }).catch(err => {
      err.userMessage = 'Error getting role data for admin user.';
      next(err);
    });
  });

/**
 * route for browsing upcoming conferences and events.
 */
router.route('/events')
  .get(middlewares.isAuth, (req, res, next) => {
    Controllers.User.getRoleData(req.sessionToken).then(roleData => {
      if(roleData.isAdmin || roleData.isAmbassador) { //TODO: replace with middleware later
        res.render('admin/admin-conferences-and-events');
      } else {
        res.render('admin/admin-conferences-and-events', {
          config: soleConfig,
          roleData: roleData
        });
      }
    }).catch(err => {
      err.userMessage = 'Error getting role data for admin user.';
      next(err);
    });
  });

module.exports = router;