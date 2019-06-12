const express     = require('express'),
      middlewares = require('../middleware/middlewares.js'),
      Controllers = require('../controllers/controllers.js'),
      soleConfig  = require('../sole-config.js');
let router        = express.Router();
/**
 * ====================================
 * profile routes
 * ====================================
 */
router.route('/')
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      const profileData = await Controllers.User.getProfileData(req.sessionToken);
      profileData.config = soleConfig;
      res.render('profile', profileData);
    } catch (err) {
      err.userMessage = 'Error getting profile data.';
      err.postToSlack = true;
      next(err);
    }
  })
  .post(middlewares.isAuth, async (req, res, next) => {
    try {
      await Controllers.User.updateProfileData({
        subjects: req.body.subjects ? req.body.subjects : false,
        grades: req.body.grades ? req.body.grades : false,
        role: req.body.role ? req.body.role : false,
        firstName: req.body.firstName ? req.body.firstName  : false,
        lastName: req.body.lastName ? req.body.lastName : false,
        schoolName: req.body.schoolName ? req.body.schoolName : false,
        schoolAddress: req.body.schoolAddress ? req.body.schoolAddress : false,
        schoolPlaceID: req.body.schoolPlaceID ? req.body.schoolPlaceID : false,
        schoolState: req.body.schoolState ? 'jur.' + req.body.schoolState.toLowerCase() : false //need to add 'jur.' to the string and lowercase it to make it work with the database
      }, req.sessionToken);

      //if the post came from complete your profile page, trigger and event on the backend and also redirect to /home
      if (req.body.src === 'completeProfilePage') {
        Controllers.User.completedProfile(req.sessionToken);
        res.redirect('/home');
      } else {
        res.redirect('/profile');
      }
    } catch (err) {
      err.userMessage = 'Error updating user profile.';
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/manage-emails')
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      const subscriptions = await Controllers.User.getEmailSubscriptions(req.sessionToken);
      res.render('partials/profile/profile-card-manage-emails', {
          layout: 'default.hbs',
          subscriptions: subscriptions,
          config: soleConfig
        });
    } catch (err) {
      err.userMessage = 'Error getting profile manage email data.';
      err.postToSlack = true;
      next(err);
    }
  })
  .post(middlewares.isAuth, async (req, res, next) => {
    try {
      const subscriptions = {
        ceuDoc: req.body.ceuDoc === "on",
        questionTips: req.body.questionTips === "on",
        planningDoc: req.body.planningDoc === "on",
        summaryDoc: req.body.summaryDoc === "on",
        reflectionReminders: req.body.reflectionReminders === "on"
      };
      await Controllers.User.setEmailSubscriptions(req.sessionToken, subscriptions);
      res.redirect('/profile');
    } catch (err) {
      err.userMessage = 'Error updating email notifications.';
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/about-me')
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      const profileData = await Controllers.User.getProfileData(req.sessionToken);
      profileData.config = soleConfig;
      res.render('partials/profile/profile-card-about-me', profileData);
    } catch (err) {
      err.userMessage = 'Error displaying about me profile page.';
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/complete')
  /**
   *
   * if there's a first name and last name in the query param, prepopulate it with those values
   * if not, put in the first name and last name stored in the user profile (empty if undefined)
   *
   */
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      let profileData = await Controllers.User.getProfileData(req.sessionToken);
      profileData.user.firstName = req.query.firstname ? req.query.firstname: undefined;
      profileData.user.lastName = req.query.lastname ? req.query.lastname: undefined;
      soleConfig.ring = req.query.ring ? req.query.ring: undefined;
      if (soleConfig.ring === 'Colombia') {
        soleConfig.colombia = true;
        req.setLocale('es');
      } else {
        soleConfig.colombia = false;
      }
      soleConfig.language = req.language;
      res.render('complete-profile', {
        layout: 'no-sidebar.hbs',
        profile: profileData,
        config: soleConfig
      });
    } catch (err) {
      err.userMessage = 'Error getting user profile data.';
      err.postToSlack = true;
      next(err);
    }
  });

module.exports = router;