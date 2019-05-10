const express = require('express');
let router = express.Router();
const middlewares = require('../middleware/middlewares.js');
const Controllers = require('../controllers/controllers.js');
const soleConfig  = require('../sole-config.js');

/**
 * ====================================
 * slackbot routes
 * ====================================
 */
router.route('/users-range')
  .post((req, res, next) => {
    let numberOfDays = 1;
    if (req.body.text) {
      numberOfDays = Number(req.body.text); //convert string to integer
    }
    Controllers.Stats.usersRange(numberOfDays).then(responseMessage => {
      res.render('slackbot/stats', {layout: 'blank.hbs', statsMessage: responseMessage}); //display slack-friendly webpage
    }).catch(err => {
      err.userMessage = 'Failed to get users range data.';
      next(err);
    });
  });

// ----------------------------------------------------
router.route('/users-today')
  .post((req, res, next) => {
    Controllers.Stats.usersToday().then(responseMessage => {
      res.render('slackbot/stats', {layout: 'blank.hbs', statsMessage: responseMessage}); //display slack-friendly webpage
    }).catch(err => {
      err.userMessage = 'Failed to get users today data.';
      next(err);
    });
  });

router.route('/users-range-detail')
  .post((req, res, next) => {
    let numberOfDays = 1;
    if (req.body.text) {
      numberOfDays = Number(req.body.text); //convert string to integer
    }
    Controllers.Stats.usersRangeDetail(numberOfDays).then(responseMessage => {
      res.render('slackbot/stats', {layout: 'blank.hbs', statsMessage: responseMessage}); //display slack-friendly webpage
    }).catch(err => {
      err.userMessage = 'Failed to get users range detail.';
      next(err);
    });
  });

module.exports = router;