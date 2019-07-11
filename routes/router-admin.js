const express     = require('express'),
      middlewares = require('../middleware/middlewares.js'),
      Controllers = require('../controllers/controllers.js'),
      soleConfig  = require('../sole-config.js'),
      moment      = require('moment'),
      router      = express.Router();

router.use(middlewares.isAuth);
//TODO: add a middleware here that requires a user to be admin

/**
 * ====================================
 * admin routes
 * ====================================
 */



router.route('/')
  .get((req, res, next) => {
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
  .get((req, res, next) => {
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
  .post((req, res, next) => {
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
  .get((req, res, next) => {
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
  .get((req, res, next) => {
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
  .get((req, res, next) => {
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


/**
 * route for managing questions.
 */
router.route('/questions')
  .get(async (req, res, next) => {
    try {
      const text = "dance";
      const tags = "";
      const questions = await Controllers.Admin.getLeaflessQuestions(tags, text, req.sessionToken);
      res.render('admin/questions', {
        questions:questions,
        config:soleConfig
      });
    }
    catch(err) {
      err.userMessage = 'Error getting role data for admin user.';
      next(err);
    }
  })
  .post(async (req, res, next) => {
    const tag = req.body.selectedTag ? req.body.selectedTag : undefined;
    let questions = req.body.questions ? req.body.questions : undefined;

    if (req.body.action === 'addTag') {
      await Controllers.Admin.bulkAddTagToQuestions(questions, tag, req.sessionToken);
      res.redirect('/admin/questions');
    } else if (req.body.action === 'removeTag') {
      await Controllers.Admin.bulkRemoveTagToQuestions(questions, tag, req.sessionToken);
      res.redirect('/admin/questions');
    } else {
      err.userMessage = 'Failed on a bulk tag edit action';
      err.postToSlack = true;
      next(err);
    }
  });

module.exports = router;