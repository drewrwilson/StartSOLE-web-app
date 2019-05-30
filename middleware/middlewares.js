const soleConfig      = require('../sole-config.js'),
      logger          = require('../logger.js'),
      Controllers     = require('../controllers/controllers.js');

function getParseErrorCode (err) {
  if (err.message && err.message.code) {
    return err.message.code;
  } else if (err.code) {
    return err.code;
  } else {
    return undefined;
  }
}

module.exports = {
  /**
   * Middleware. Check if a user is logged in before showing any routes that require
   * authentication. If user is not logged in, redirect to login page.
   * @param req
   * @param res
   * @param next
   */
  isAuth: (req, res, next) => {
    const sessionToken = req.cookies ? req.cookies.sessionToken : undefined;
    if (sessionToken) {
      //TODO: check if sessionToken is valid or parse calls might fail
      req.sessionToken = sessionToken;
      next();
    } else {
      res.redirect('/login?originalUrl='+req.originalUrl);
    }
  },
  /**
   * middleware to set language for user. right now this starts by checking if the language is
   * already set in cookie. if so, set language to the cookie language. if not, check the ring
   * to see if there's a language set in for the ring. right now this just works for the colombia
   * ring, but in the future we'll have language associated with the user in the backend and a way
   * to change it in the webapp and save it in the cookie.
   * @param req
   * @param res
   * @param next
   */
  setLanguage: async (req, res, next) => {
    //const language = req.cookies ? req.cookies.language: undefined; //check if language is saved in the cookie
    if (req.sessionToken) {
      try {
        const language = await Controllers.User.getLanguage(req.sessionToken);
        req.language = language;
        req.setLocale(language);
        res.cookie('language',language);
        next();
      } catch (err) {
        err.userMessage = 'Some kind of language error';
        next(err);
      };
    } else {
      //if we don't have a sessionToken, eg if we're just viewing static pages like privacy or terms-of-service
      next();
    }
  },
  /**
   * logs an error to the backend and sends a human-readable message to a slack channel
   * @param err error object
   * @param req request object from express
   * @param res response object from express
   * @param next express function to advance to the next middleware function
   */
  logErrors: (err, req, res, next) => {
    err.sessionToken = req.sessionToken ? req.sessionToken: undefined;
    err.originalUrl = req.originalUrl ? req.originalUrl: undefined;

    if (err.postToSlack) {
      logger.error({
        userMessage: err.userMessage,
        serverCode: err.code,
        serverMessage: err.message,
        originalUrl: err.originalUrl,
        sessionToken: err.sessionToken
      });
    } else {
      logger.warning(err); //record in the backend log but don't post to slack
    }
    next(err);
  },
  /**
   * shows the user an error page with human-readable text
   * @param err error object
   * @param req request object from express
   * @param res response object from express
   * @param next express function to advance to the next middleware function
   */
  errorHandler: (err, req, res, next) => {
    if (getParseErrorCode(err) === 209) {
      // error 209 is a Parse error meaning invalid token
      res.render('logout', {
        layout: 'no-sidebar.hbs',
        config: soleConfig,
        errorMessage: 'Error. Session expired. Please log back in.'
      });
    } else {
      res.status(404);
      res.render('fail', {
        layout: 'no-sidebar.hbs',
        error: err.userMessage || 'Oops! Something went wrong.',
        config: soleConfig
      });
    }
  },
  getRings: (err, req, res, next) => {
    const rings = req.cookies ? req.cookies.rings: undefined; //check if ring is saved in the cookie
    if (rings) {
      req.rings = rings; //set rings to be an array in req, so we can use it in the other routes
      next();
    } else if (req.sessionToken) {
      Controllers.User.getMyRings(req.sessionToken).then(rings => {
        req.rings = rings; //set rings to be an array in req, so we can use it in the other routes
        next();
      }).catch(err => {
        err.userMessage = 'Error getting rings for user';
        next(err);
      })
    } else {
      //if we don't have a sessionToken, then we also don't have a ring eg if we're just viewing static pages like privacy or terms-of-service
      next();
    }
  }
};