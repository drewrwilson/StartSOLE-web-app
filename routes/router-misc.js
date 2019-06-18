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

module.exports = router;