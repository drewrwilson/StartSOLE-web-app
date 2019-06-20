const express     = require('express'),
      Controllers = require('../controllers/controllers.js'),
      router      = express.Router();
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