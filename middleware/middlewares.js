const soleConfig  = require('../sole-config.js');

module.exports = {
  /**
   * Middleware. Check if a user is logged in before showing any routes that require
   * authentication. If user is not logged in, redirect to login page.
   * @param req
   * @param res
   * @param next
   */
  isAuth: function (req, res, next) {
    const sessionToken = req.cookies ? req.cookies.sessionToken : undefined;
    if (sessionToken) {
      //TODO: check if sessionToken is valid or parse calls might fail
      req.sessionToken = sessionToken;
      next();
    } else {
      res.redirect('/login');
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
  setLanguage: function (req, res, next) {
    const language = req.cookies ? req.cookies.language: undefined; //check if language is saved in the cookie
    if (language) {
      req.language = language; //set i18n language here in stead of putting it in the req
      next();
    } else if (req.sessionToken) {
      Controllers.User.getLanguage(req.sessionToken).then(language => {
        req.language = language; //set i18n language here instead of putting it in the req
        next();
      }).catch(err => {
        err.userMessage = 'Some kind of language error';
        next(err);
      })
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
  logErrors: function (err, req, res, next) {
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
  errorHandler: function (err, req, res, next) {
    res.status(404);
    res.render('fail', {
      layout: 'no-sidebar.hbs',
      error: err.userMessage || 'Oops! Something went wrong.',
      config: soleConfig
    });
  }
}