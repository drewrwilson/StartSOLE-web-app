// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
const express     = require('express');        // call express
const app         = express();                 // define our app using express
const bodyParser  = require('body-parser');
const hbs         = require('express-hbs');
const path        = require('path');
const moment        = require('moment');
const Controllers = require('./controllers/controllers.js');
const cookieParser = require('cookie-parser');
const logger = require('./logger.js');
logger.useSlackBot = process.env.ENVIRONMENT === 'production'; //true if production, false otherwise

const soleConfig  = require('./sole-config.js');

const port = process.env.PORT || 8080;                 // set our port

// ******************
// handlebars helpers
// ******************

hbs.registerHelper('ifEquals',
  function(a, b, opts) {
    if (a == b) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  }
);

hbs.registerHelper('select', function(selected, options) {
  return options.fn(this).replace(
    new RegExp(' value=\"' + selected + '\"'),
    '$& selected="selected"');
});

hbs.registerHelper('contains', function( value, array, options ){
  array = ( array instanceof Array ) ? array : [array];
  return (array.indexOf(value) > -1) ? options.fn( this ) : '';
});

hbs.registerHelper('log', function(something) {
  logger.log(something);
});

// ******************
// set up the webserver
// ******************
// set the view engine
app.set('view engine', 'hbs');

// configure the view engine
app.engine('hbs', hbs.express4({
  defaultLayout: __dirname + '/views/layouts/default.hbs',
  partialsDir: __dirname + '/views/partials',
  layoutsDir: __dirname + '/views/layouts'
}));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ******************
// routes for webserver
// ******************

// =============================================================================
const router = express.Router();              // get an instance of the express Router

router.use(cookieParser());

// middleware function to check if a user is logged in
// if not logged in, redirect to login page
function isAuth (req, res, next) {
  const sessionToken = req.cookies ? req.cookies.sessionToken : undefined;

  if (sessionToken) {
    //check if sessionToken is valid or parse calls might fail
    req.sessionToken = sessionToken;
    next();
  } else {
    res.redirect('/login');
  }
}

//middleware to check if this is colombia, if so set language to es otherwise language is en
function setLanguage (req, res, next) {
  //how to identify a user as spanish-speaking or not
  //check if language is in cookie
  //if not, looks up if a user is in colombia ring
  //if they are, set a cookie variable for 'es'
  //(TODO: build a frontend button that sets cookie language to 'es')
  //show spanish

  const language = req.cookies ? req.cookies.language: undefined; //check if language is saved in the cookie

  if (language) {
    req.language = language; //remove slash
    next();
  } else {
    Controllers.User.getMyRings(req.sessionToken).then(rings => {
      if (rings && rings.filter(ring => ring.name === 'Colombia') && !rings.filter(ring => ring.name === 'SOLE Team')) {
        req.language = 'es'; //this is the name of the directory where the language views are
        next();
      } else {
        //default is none, later the default should be 'en/'
        req.language = 'en'; //since the views are in the same directory, no value needed
        next();
      }
    });
  }
}

/**
 * logs an error to the backend and sends a human-readable message to a slack channel
 * @param err error object
 * @param req request object from express
 * @param res response object from express
 * @param next express function to advance to the next middleware function
 */
function logErrors (err, req, res, next) {
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
}

/**
 * shows the user an error page with human-readable text
 * @param err error object
 * @param req request object from express
 * @param res response object from express
 * @param next express function to advance to the next middleware function
 */
function errorHandler (err, req, res, next) {
  res.render('fail', {
    layout: 'no-sidebar.hbs',
    error: err.userMessage || 'Oops! Something went wrong.',
    config: soleConfig
  });
}

/**
 *
 * @param errorMessage string human-readable error text that will be displayed to the user
 * @param err json object the error object from parse
 * @param originUrl string the URL where the err originated
 * @param sessionToken string sessionToken when the error happened
 * @param next function for advancing to the next middleware
 * @param postToSlack boolean make true if you want to post this error to slack
 */
function showError ({userMessage, err, originUrl, sessionToken, next, postToSlack}) {
  if (postToSlack) {
    logger.error();
  }
  next(err);
}

// home route
// NOTE: this is where we can add in some welcome content. eg on first load
//       redirect to a intro screen. Or after completing your 5 SOLE, give some
//       nice encouraging message, etc etc
router.route('/')
  .get(isAuth, (req, res, next) => {
    Controllers.User.isProfileComplete(req.sessionToken).then(profileIsCompleted => {
      res.redirect(profileIsCompleted ? '/home' : '/complete-profile');
    }).catch(err => {
      err.userMessage = 'Failed to check if users profile is complete';
      err.postToSlack = true;
      
      next(err);
    });
  });

// on routes that end in /stats/
router.route('/slackbot/users-range')
  .post((req, res, next) => {
    let numberOfDays = 1;
    if (req.body.text) {
      numberOfDays = Number(req.body.text); //convert string to integer
    }
    Controllers.Stats.usersRange(numberOfDays).then(responseMessage => {
      res.render('stats', {layout: 'blank.hbs', statsMessage: responseMessage}); //display slack-friendly webpage
    }).catch(err => {
      err.userMessage = 'Failed to get users range data.';
      next(err);
    });
  });

// ----------------------------------------------------
router.route('/slackbot/users-today')
  .post((req, res, next) => {
    Controllers.Stats.usersToday().then(responseMessage => {
      res.render('stats', {layout: 'blank.hbs', statsMessage: responseMessage}); //display slack-friendly webpage
    }).catch(err => {
      err.userMessage = 'Failed to get users today data.';
      next(err);
    });
  });

router.route('/slackbot/users-range-detail')
  .post((req, res, next) => {
    let numberOfDays = 1;
    if (req.body.text) {
      numberOfDays = Number(req.body.text); //convert string to integer
    }
    Controllers.Stats.usersRangeDetail(numberOfDays).then(responseMessage => {
      res.render('stats', {layout: 'blank.hbs', statsMessage: responseMessage}); //display slack-friendly webpage
    }).catch(err => {
      err.userMessage = 'Failed to get users range detail.';
      next(err);
    });
  });

//on routes that end in /random-picture
// ----------------------------------------------------
router.route('/random-picture')
  .get((req, res, next) => {
    const pic = Controllers.Test.randomPicture();
    res.sendFile('images/test-images/'+pic,{root: __dirname + '/public/'});
  });

router.route('/home')
  .get(isAuth, setLanguage, (req, res, next) => {
    soleConfig.language = req.language;
    Controllers.User.getRoleData(req.sessionToken).then(roleData => {
      let homeData = {
        soles: [],
        questions: [],
        roleData: roleData,
        config: soleConfig,
      };

      if (roleData.isRingleader) {
        return Controllers.User.getMyRings(req.sessionToken).then(rings => {
          homeData.rings = rings;
          res.render(req.language + '/home', homeData); //show home page with ring data
        }).catch(err => {
          err.userMessage = 'Failed to ring data for user.';
          err.postToSlack = true;
          next(err);
        });
      } else {
        res.render(req.language + '/home', homeData); //show home page but no ring data
      }
    }).catch(err => {
      err.userMessage = 'Failed to role data for user.';
      err.postToSlack = true;
      
      next(err);
    });
  });

//temporary static route for making the view for approving soles
router.route('/pending-soles')
  .get(isAuth, (req, res, next) => {
    Controllers.Admin.getPendingSoles(req.sessionToken).then(soles => {
      //format the shortText and date for each sole
      soles.forEach(sole => {
        sole.question.shortText = sole.question.text.substring(0,10);
        sole.reflectionDate = moment(sole.reflectionDate, 'YYYYMMDD').fromNow();
      });

      //render the view
      res.render('admin-pending-soles', {
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

/*
        ToDo:
        * connect it to Webapp.js
        * check for isAdmin and add a link to the homepage if isAdmin
         */

  .post(isAuth, (req, res, next) => {
    const requestSocialMedia = (req.body.socialMediaCheck == 'true');//true if we need to request Social Media Approval via email, false otherwise
    if (req.body.action === 'approve') {
      Controllers.Admin.approveSole(req.body.soleId, req.body.comment, requestSocialMedia, req.sessionToken).then(soleId => {
        res.redirect('/pending-soles');
      });
    } else if (req.body.action === 'reject') {
      Controllers.Admin.rejectSole(req.body.soleId, req.body.comment, req.sessionToken).then(soleId => {
        res.redirect('/pending-soles');
      });
    } else {
      err.userMessage = 'Got a malformed post without reject or approve.';
      err.postToSlack = true;
      
      next(err);
    }
  });

// route for Admin Page
router.route('/admin')
  .get(isAuth, (req, res, next) => {
    Controllers.User.getRoleData(req.sessionToken).then(roleData => {
      if (!roleData.isAdmin) { //TODO: make a middleware for isAdmin
        res.redirect('/home');
      } else {
        Controllers.User.adminSummaryData().then(summaryData => {
          res.render('admin', {
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

// route for browsing all SOLEs.  Admin only
router.route('/admin/browse-soles')
  .get(isAuth, (req, res, next) => {
    Controllers.User.getRoleData(req.sessionToken).then(roleData => {
      if(!roleData.isAdmin) {
        res.redirect('/home');
      } else {
        res.render('admin-browse-soles', {
          config: soleConfig,
          roleData: roleData
        });
      }
    }).catch(err => {
      err.userMessage = 'Error getting role data for admin user.';
      next(err);
    });
  });

// route for browsing all SOLEs.  Admin only
router.route('/admin/browse-users')
  .get(isAuth, (req, res, next) => {
    Controllers.User.getRoleData(req.sessionToken).then(roleData => {
      if(!roleData.isAdmin){
        res.redirect('/home');
      } else {
        res.render('admin-browse-users', {
          config: soleConfig,
          roleData: roleData
        });
      }
    }).catch(err => {
      err.userMessage = 'Error getting role data for admin user.';
      next(err);
    });
  });

// route for browsing upcoming conferences and events.  Admin only
router.route('/admin/events')
  .get(isAuth, (req, res, next) => {
    Controllers.User.getRoleData(req.sessionToken).then(roleData => {
      if(roleData.isAdmin || roleData.isAmbassador) { //TODO: replace with middleware later
        res.render('admin-conferences-and-events', adminData);
      } else {
        res.render('admin-conferences-and-events', {
          config: soleConfig,
          roleData: roleData
        });
      }
    }).catch(err => {
      err.userMessage = 'Error getting role data for admin user.';
      next(err);
    });
  });

// static route for History of SOLE
router.route('/history')
  .get((req, res, next) => {
    res.render('history', {config: soleConfig});
  });

// static route for History of SOLE
router.route('/how')
  .get((req, res, next) => {
    res.render('how-to-sole', {config: soleConfig});
  });

// static route for ToS
router.route('/terms-of-use')
  .get((req, res, next) => {
    res.render('terms-of-use', {layout: 'no-sidebar.hbs', config: soleConfig});
  });

// static route for privacy
router.route('/privacy')
  .get((req, res, next) => {
    res.render('privacy', {layout: 'no-sidebar.hbs', config: soleConfig});
  });

// static route for email verification success
router.route('/verify-email-success')
  .get(setLanguage, (req, res, next) => {
    const email = req.query.email;
    res.render(req.language + '/verify-email-success', {layout: 'no-sidebar.hbs', config: soleConfig, email: email});
  });

// static route for email verification failure
router.route('/verify-email-failure')
  .get(setLanguage, (req, res, next) => {
    const email = req.query.email;
    res.render(req.language + '/verify-email-failure', {layout: 'no-sidebar.hbs', config: soleConfig, email: email});
  });

// routes for resources
router.route('/resources')
  .get((req, res, next) => {
    Controllers.Resource.getAll().then(resources => {
      res.render('resources', {
        resources: resources,
        config: soleConfig
      });
    }).catch(err => {
      err.userMessage = 'Error getting resources.';
      err.postToSlack = true;
      
      next(err);
    });
  });

// routes for profile
// ----------------------------------------------------
router.route('/profile')

// profile view
  .get(isAuth, setLanguage, (req, res, next) => {
    Controllers.User.getProfileData(req.sessionToken)
      .then(profileData => {
        profileData.config = soleConfig;
        res.render(req.language + '/profile', profileData);
      }).catch(err => {
        err.userMessage = 'Error getting profile data.';
        err.postToSlack = true;
        
        next(err);
      });
  })
  //TODO: this is a mess, come back to this to make it more consistent with the rest of the app
  .post(isAuth, (req, res, next) => {
    Controllers.User.updateProfileData(req.body.subjects || false,
      req.body.grades || false,
      req.body.role || false,
      req.body.firstName || false,
      req.body.lastName || false,
      false,
      false,
      false,
      false,
      req.sessionToken)
      .then(user => {
        res.redirect('/soles');
      }).catch(err => {
        err.userMessage = 'Error updating user profile.';
        err.postToSlack = true;
        
        next(err);
      });
  });

// routes for user registration
// ----------------------------------------------------
router.route('/register')
  .get((req, res, next) => {
    res.render('en/'+ 'register', {
      layout: 'no-sidebar.hbs',
      config: soleConfig
    });
  });

//route for logging out
router.route('/logout')
  .get((req, res, next) => {
    res.render('logout', {
      layout: 'no-sidebar.hbs',
      config: soleConfig
    });
  });

// route for logging in
router.route('/login')
  .get((req, res, next) => {
    //this is a special case. this code is similar to the isAuth function, but we do
    //it here because we want to redirect someone to /home if they're already logged in.
    const sessionToken = req.cookies ? req.cookies.sessionToken : undefined;

    if (sessionToken) {
      res.redirect('/home');
    } else {
      const email = req.query.email;
      res.render('login', {
        layout: 'prelogin.hbs',
        config: soleConfig,
        email: email
      });
    }

  });

// route for completing profile
//TODO: there are lots of possible fail scenarios here. eg if profileData.user is undefined. Or if req.query.firstname is undefined
router.route('/complete-profile')
  .get(isAuth, setLanguage, (req, res, next) => {
    Controllers.User.getProfileData(req.sessionToken).then(profileData => {
      if (profileData.user.firstName && profileData.user.lastName) {
        console.log('um, hi. whats this all about?');
      } else {
        profileData.user.firstName = req.query.firstname;
        profileData.user.lastName = req.query.lastname;
      }
      res.render(req.language + '/complete-profile', {
        layout: 'no-sidebar.hbs',
        profile: profileData,
        config: soleConfig
      });
    }).catch(err => {
      err.userMessage = 'Error getting user profile data.';
      err.postToSlack = true;
      
      next(err);
    });
  })
  //TODO: test that this still works
  .post(isAuth, (req, res, next) =>{
    Controllers.User.updateProfileData(
      req.body.subjects,
      req.body.grades,
      req.body.role,
      req.body.firstName,
      req.body.lastName,
      req.body.schoolName,
      req.body.schoolAddress,
      req.body.schoolPlaceID,
      'jur.' + req.body.schoolState.toLowerCase(), //need to add 'jur.' to the string and lowercase it to make it work with the database
      req.sessionToken).then(user => {
      Controllers.User.completedProfile(req.sessionToken);
      res.redirect('/soles');
    }).catch(err => {
      err.userMessage = 'Error completing user profile.';
      err.postToSlack = true;
      
      next(err);
    });
  });

// routes for soles
// ----------------------------------------------------
router.route('/soles')
// get all the soles
  .get(isAuth, setLanguage, (req, res, next) => {
    Controllers.Sole.getAll(req.sessionToken)
      .then(soles=>{
        soles.config = soleConfig;
        res.render(req.language + '/soles', soles);
      }).catch(err => {
        err.userMessage = 'Could not get list of SOLEs.';
        err.postToSlack = true;
        
        next(err);
      });
  });

// on routes that end in /soles/:sole_id
// ----------------------------------------------------
router.route('/soles/:id')
// get the sole with that id
  .get(isAuth, setLanguage, (req, res, next) => {
    Controllers.Sole.getByID(req.params.id, req.sessionToken).then(singleSole => {
      //in case the id of the sole is invalid
      singleSole.config = soleConfig;
      res.render(req.language + '/soles-single', singleSole);
    }).catch(err => {
      err.userMessage = 'Could not get SOLE. SOLE id: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    });
  });

// on routes that end in /soles/:sole_id/download-plan
// ----------------------------------------------------
router.route('/soles/:id/download-plan')
// get the sole with that id
  .get(isAuth, (req, res, next) => {
    const id = req.params.id;
    const type = 'plan';
    Controllers.Sole.downloadDocument(id, type, req.sessionToken)
      .then(url => {
        res.redirect(soleConfig.baseURL+url);
      }).catch(err => {
        err.userMessage = 'Failed to download lesson plan. SOLE id: ' + req.params.id;
        err.postToSlack = true;
        next(err);
      });
  });

// on routes that end in /soles/:sole_id/download-summary
// ----------------------------------------------------
router.route('/soles/:id/download-summary')
// get the sole with that id
  .get(isAuth, (req, res, next) => {
    const id = req.params.id;
    const type = 'summary';
    Controllers.Sole.downloadDocument(id, type, req.sessionToken)
      .then(url => {
        res.redirect(soleConfig.baseURL+url);
      }).catch(err => {
        err.userMessage = 'Failed to download summary. SOLE id: ' + req.params.id;
        err.postToSlack = true;
        next(err);
      });
  });


// on routes that end in /soles/:sole_id/copy
// 1. get the data from a SOLE
// 2. send it to create SOLE with that data
// ----------------------------------------------------
router.route('/soles/:id/copy')
  .get(isAuth, (req,res) => {
    Controllers.Sole.copy(req.params.id, req.sessionToken).then(soleID => {
      res.redirect('/soles');
    }).catch(err => {
      err.userMessage = 'Failed to copy SOLE. SOLE id: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    });
  });

// on routes that end in /soles/:sole_id/edit
// ----------------------------------------------------
router.route('/soles/:id/edit')
// get the sole with that id
  .get(isAuth, setLanguage, (req, res, next) => {
    Controllers.Sole.getByID(req.params.id, req.sessionToken).then(singleSole => {
      singleSole.config = soleConfig;
      res.render(req.language + '/soles-add', singleSole);
    }).catch(err => {
      err.userMessage = 'Failed to get SOLE session from the server.';
      err.postToSlack = true;
      next(err);
    });
  })
  .post(isAuth, (req, res, next) => {
    //TODO: make this reusable for copying
    //push observations into this array if any are set to 'on'
    let targetObservations = [];
    (req.body.collaborating == 'on') ? targetObservations.push('session.observation.collaborating') : false;
    (req.body.technology == 'on') ? targetObservations.push('session.observation.technology'): false;
    (req.body.respectful == 'on') ? targetObservations.push('session.observation.respectful') : false;
    (req.body.desire == 'on') ? targetObservations.push('session.observation.desire') : false;
    (req.body.vocabulary == 'on') ? targetObservations.push('session.observation.vocabulary') : false;
    (req.body.help_learn == 'on') ? targetObservations.push('session.observation.help_learn') : false;
    (req.body.help_technology == 'on') ? targetObservations.push('session.observation.help_technology') : false;

    //push materials into this array if any are set to 'on'
    let materials = [];
    (req.body.writing_tools == 'on') ? materials.push('material.writing_tools') : false;
    (req.body.poster_paper == 'on') ? materials.push('material.poster_paper') : false;
    (req.body.physical == 'on') ? materials.push('material.physical') : false;
    (req.body.sole_organizer == 'on') ? materials.push('material.sole_organizer') : false;
    (req.body.other == 'on') ? materials.push('material.other') : false;

    let sole = {
      //values from the frontend
      question: req.body.question,
      subject: req.body.subject,
      grade: req.body.grade,
      class_label: req.body.class_label, //optional
      planned_date: req.body.planned_date,
      planned_time: req.body.planned_time,
      planned_duration: req.body.planned_duration,
      num_groups: req.body.num_groups,
      target_observations: targetObservations,
      grouporganization: (req.body.grouporganization == 'on') ? true : false,
      groupsharing: (req.body.groupsharing == 'on') ? true : false,
      self_assessment: (req.body.self_assessment == 'on') ? true : false,
      useapp: (req.body.useapp == 'on') ? true : false,
      materials: materials,
      num_students: req.body.num_students,
      num_devices: req.body.num_devices,
      content_objective: req.body.content_objective
    };

    let id = req.body.sole_id;

    Controllers.Sole.update(id, sole, req.sessionToken).then(soleID=>{
      res.redirect('/soles');
    }).catch(err =>{
      err.userMessage = 'Could not save SOLE. SOLE id: ' + id;
      err.postToSlack = true;
      next(err);
    });

  });

//on routes that end in /soles/:sole_id/delete
router.route('/soles/:id/delete')
// get the sole with that id
  .get(isAuth, setLanguage, (req, res, next) => {
    Controllers.Sole.getByID(req.params.id, req.sessionToken).then(singleSole => {
      singleSole.config = soleConfig;
      res.render(req.language + '/soles-delete', singleSole);
    }).catch(err => {
      err.userMessage = 'Could not delete SOLE session from the server. SOLE id: ' + req.param.id;
      err.postToSlack = true;
      next(err);
    });
  })
  .post(isAuth, (req, res, next) => {
    Controllers.Sole.delete(req.body.soleID, req.sessionToken).then(soleID => {
      res.redirect('/soles');
    }).catch(err => {
      err.userMessage = 'Could not delete SOLE. SOLE id: ' + req.body.soleID;
      err.postToSlack = true;
      next(err);
    });
  });

// on routes that end in /soles/:sole_id/reflect
// ----------------------------------------------------
router.route('/soles/:id/reflect')
// get the sole with that id
  .get(isAuth, setLanguage, (req, res, next) => {
    Controllers.Sole.getByID(req.params.id, req.sessionToken).then(singleSole => {
      singleSole.config = soleConfig;
      res.render(req.language + '/soles-reflect', singleSole);
    }).catch(err => {
      err.userMessage = 'Could not get SOLE session from the server. SOLE id: ' + req.param.id;
      err.postToSlack = true;
      next(err);
    });
  });

router.route('/sole-reflect')
  .post(isAuth, (req, res, next) =>{
    const reflection = {
      id: req.body.soleID,
      achieved: req.body.content_objective_achieved, //session.reflection.content_objective.achieved
      achieved_why: req.body.content_objective_achieved_why, //session.reflection.content_objective.notes
      type_of_thinking: req.body.dok, //session.reflection.type_of_thinking
      type_of_thinking_why: req.body.dok_why, //session.reflection.type_of_thinking.notes
      percent_engaged: req.body.percent_engaged, //reflection.engagement
      percent_collaboration: req.body.percent_collaboration, //reflection.collaboration
      percent_technology: req.body.percent_technology, //reflection.technology
      percent_communication: req.body.percent_communication, //reflection.communication
      ground_rules: req.body.ground_rules, //reflection.ground_rules
      need_help: req.body.need_help, //reflection.need_help
      help_text: req.body.help_text, //session.help_text
      notes: req.body.notes //session.reflection.notes
    };

    Controllers.Sole.saveReflection(reflection, req.sessionToken).then(soleID => {
      res.redirect('/soles/'+soleID);
    }).catch(err => {
      err.userMessage = 'Could not save reflection. SOLE id: ' + req.body.soleID;
      err.postToSlack = true;
      next(err);
    });
  });

// on routes that end in /soles/add/
// ----------------------------------------------------
router.route('/sole-create')
// view for adding a new sole
  .get(isAuth, setLanguage, (req, res, next) => {
    const question = req.query.question; //get the ID of desired question from the query param
    viewData = {
      config: soleConfig,
      sole: {}
    };
    //if a question is present get it and attach to viewData as part of a SOLE
    if (question) {
      Controllers.Question.getByID(question, req.sessionToken).then((questionData) => {
        viewData.sole.question = questionData;
        res.render(req.language + '/soles-add',viewData);
      }).catch(err => {
        err.userMessage = 'Could not load question with id: ' + question;
        err.postToSlack = true;
        next(err);
      });
    } else {
      res.render(req.language + '/soles-add', viewData);
    }
  })
  .post(isAuth, (req, res, next) =>{
    //push observations into this array if any are set to 'on'
    let targetObservations = [];
    (req.body.collaborating == 'on') ? targetObservations.push('session.observation.collaborating') : false;
    (req.body.technology == 'on') ? targetObservations.push('session.observation.technology'): false;
    (req.body.respectful == 'on') ? targetObservations.push('session.observation.respectful') : false;
    (req.body.desire == 'on') ? targetObservations.push('session.observation.desire') : false;
    (req.body.vocabulary == 'on') ? targetObservations.push('session.observation.vocabulary') : false;
    (req.body.help_learn == 'on') ? targetObservations.push('session.observation.help_learn') : false;
    (req.body.help_technology == 'on') ? targetObservations.push('session.observation.help_technology') : false;

    //push materials into this array if any are set to 'on'
    let materials = [];
    (req.body.writing_tools == 'on') ? materials.push('material.writing_tools') : false;
    (req.body.poster_paper == 'on') ? materials.push('material.poster_paper') : false;
    (req.body.physical == 'on') ? materials.push('material.physical') : false;
    (req.body.sole_organizer == 'on') ? materials.push('material.sole_organizer') : false;
    (req.body.other == 'on') ? materials.push('material.other') : false;

    let sole = {
      //values from the frontend
      question: req.body.question,
      subject: req.body.subject,
      grade: req.body.grade,
      class_label: req.body.class_label, //optional
      planned_date: req.body.planned_date,
      planned_time: req.body.planned_time,
      planned_duration: req.body.planned_duration,
      num_groups: req.body.num_groups,
      target_observations: targetObservations,
      grouporganization: (req.body.grouporganization == 'on') ? true : false,
      groupsharing: (req.body.groupsharing == 'on') ? true : false,
      self_assessment: (req.body.self_assessment == 'on') ? true : false,
      useapp: (req.body.useapp == 'on') ? true : false,
      materials: materials,
      num_students: req.body.num_students,
      num_devices: req.body.num_devices,
      content_objective: req.body.content_objective
    };

    Controllers.Sole.add(sole, req.sessionToken).then(soleID=>{
      res.redirect('/soles');
    }).catch(err => {
      err.userMessage = 'Could not save SOLE session.';
      err.postToSlack = true;
      next(err);
    });
  });

// on routes that end in /questions
// ----------------------------------------------------
//TODO: refactor. this is messy.
router.route('/questions')
// get all the soles
  .get(isAuth, setLanguage, (req, res, next) => {
    if (req.query.q) {
      Controllers.Question.findByText(req.query.q, req.sessionToken).then((foundQuestions) => {
        foundQuestions.config = soleConfig;
        res.render(req.language + '/questions', foundQuestions);
      }).catch(err => {
        err.userMessage = 'Could not find questions by text search. Search text: ' + req.query.q;
        err.postToSlack = true;
        next(err);
      });
    } else if (req.query.tags) {
      Controllers.Question.findByTags(req.query.tags, req.sessionToken).then((foundQuestions) => {
        //todo probably need to do some processing on tags to convert it from a string to an array of tags
        foundQuestions.config = soleConfig;
        res.render(req.language + '/questions', foundQuestions);
      }).catch(err => {
        err.userMessage = 'Could not find question by tags. Search tags: ' + req.query.tags;
        err.postToSlack = true;
        next(err);
      });
    } else {
      res.render(req.language + '/questions', {config:soleConfig});
    }
  });

// on routes that end in /questions/mine
// ----------------------------------------------------
//TODO: this is messy af. refactor
router.route('/questions/mine')
  .get(isAuth, setLanguage, (req,  res) => {
    const fav = req.query.fav; //optional query parameter to set fav tab as active
    let myQuestionsData = {soles: [], questions:[], fav: fav};
    Controllers.Question.getAll(req.sessionToken).then(questions => {
      myQuestionsData.questions.mine = questions.questions;
      Controllers.Question.getFavorites(req.sessionToken).then((favoriteQuestions) =>{
        myQuestionsData.questions.favorites = favoriteQuestions;
        myQuestionsData.config = soleConfig;
        res.render(req.language + '/my-questions', myQuestionsData); //display view with question data
      }).catch(err => {
        err.userMessage = 'Could not get your favorited questions.';
        err.postToSlack = true;
        next(err);
      });
    }).catch(err => {
      err.userMessage = 'Could not get list of questions.';
      err.postToSlack = true;
      next(err);
    });
  });

//add a question
router.route('/questions/add')
  .get(isAuth, setLanguage, (req, res, next) => {
    res.render(req.language + '/questions-add', {config: soleConfig});
  })
// TODO: add post route here to save question to DB
  .post(isAuth, (req, res, next) => {
    let tags = req.body.tags.split(',');
    const newQuestion = {
      text: req.body.text,
      source: req.body.source,
      tags: tags
    };
    Controllers.Question.add(newQuestion.text, newQuestion.tags, newQuestion.source, req.sessionToken).then(questionID=>{
      res.redirect('/questions/'+questionID);
    }).catch(err =>{
      err.userMessage = 'Could not add question.';
      err.postToSlack = true;
      next(err);
    });
  });

// on routes that end in /questions/:id
// ----------------------------------------------------
router.route('/questions/:id')
// get the question data with a given id
  .get(isAuth, (req, res, next) => {
    const favorited = req.query.fav; //is true if question was just favorited
    Controllers.Question.getByID(req.params.id, req.sessionToken).then(questionData => {
      questionData.favorited = favorited;
      questionData.config = soleConfig;
      questionData.question.favorited = true;
      Controllers.User.getRoleData(req.sessionToken).then(roleData => {
        questionData.roleData = roleData;
        res.render('questions-single', questionData);
      }).catch(err => {
        showError({
          userMessage: 'Could not get role data.',
          err: err,
          next: next,
          postToSlack: true
        });
      });
    }).catch(err => {
      err.userMessage = 'Could not find SOLE question. Question id: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    });
  });


router.route('/questions/:id/favorite')
// favorite a question with a given id
  .get(isAuth, (req, res, next) => {
    Controllers.Question.favorite(req.params.id, req.sessionToken).then(questionData => {
      res.redirect('/questions/'+req.params.id+'?fav=true');
    }).catch(err => {
      err.userMessage = 'Could not favorite this question. Question id: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    });
  });

router.route('/questions/:id/delete-tag/:rdn')
// remove a tag from a question
  .get(isAuth, (req, res, next) => {
    Controllers.Question.deleteTag(req.params.id, req.params.rdn, req.sessionToken).then((questionData) => {
      res.redirect('/questions/' + req.params.id);
    }).catch(err => {
      err.userMessage = 'Could not delete a tag. Question id: ' + req.params.id + ' and tag id: ' + req.params.rdn;
      err.postToSlack = true;
      next(err);
    });
  });

// routes for admin dashboard
// ----------------------------------------------------
router.route('/dashboard')

// gets data to build a simple dashboard
  .get(isAuth, setLanguage, (req, res, next) => {
    if (req.query.ring) {
      Controllers.Dashboard.getDashboardData(req.query.ring, req.sessionToken)
        .then(dashboard => {
          res.render(req.language + '/dashboard', {
            config: soleConfig,
            dashboard: dashboard
          });
        }).catch(err => {
          err.userMessage = 'Could not load dashboard data.';
          err.postToSlack = true;
          next(err);
        });
    } else {
      err.userMessage = 'Ring does not exist: ' + req.query.ring;
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/questions/:id/approve')

// approve a single question
  .get(isAuth, (req, res, next) => {
    Controllers.Question.approve(req.params.id, req.sessionToken).then(questionData => {
      res.redirect('/dashboard/question-approval');
    }).catch(err => {
      err.userMessage = 'Could not approve a question with id: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    });
  });

router.route('/questions/:id/reject')

// reject a single question
  .get(isAuth, (req, res, next) => {
    Controllers.Question.reject(req.params.id, req.sessionToken).then(questionData => {
      res.redirect('/dashboard/question-approval');
    }).catch(err => {
      err.userMessage = 'Could not reject a question.';
      err.postToSlack = true;
      next(err);
    });
  });

// approve a single SOLE
router.route('/soles/:id/approve')
  .get(isAuth, (req, res, next) => {
    Controllers.Sole.approve(req.params.id, req.sessionToken).then(soleData => {
      res.redirect('/dashboard/sole-approval');
    }).catch(err => {
      err.userMessage = 'Could not approve a SOLE with id: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    });
  });

router.route('/soles/:id/reject')
// reject a single SOLE
  .get(isAuth, (req, res, next) => {
    Controllers.Sole.reject(req.params.id, req.sessionToken).then(soleData => {
      res.redirect('/dashboard/sole-approval');
    }).catch(err => {
      err.userMessage = 'Could not reject a SOLE with id: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    });
  });

// static route for fail cases (404)
router.route('/error')
  .get(setLanguage, (req, res, next) => {
    res.render('/fail', {
      layout: 'no-sidebar.hbs',
      config: soleConfig
    });
  });

// REGISTER OUR ROUTES -------------------------------
app.use('/', router);

// serve static content
app.use(express.static(path.join(__dirname, 'public')));

// enable error logging (for logging errors for troubleshooting)
app.use(logErrors);

// enable error handler (showing the user an error)
app.use(errorHandler);


//custom 404 page
app.get('*', function(req, res, next){
  const err = {
    userMessage: '404. This page does not exist.',
    req: req
  };
  errorHandler(err, req, res, next)
});

// START THE SERVER
// =============================================================================

logger.log('\n\n/^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ \n');
logger.log('           Ring: ' + soleConfig.ring);
logger.log('    Environment: ' + soleConfig.environment);
logger.log('   Database URL: ' + soleConfig.serverUrl);
logger.log('Facebook App ID: ' + soleConfig.facebookAppID);
logger.log('      Google UA: ' + soleConfig.googleAnalyticsUA);
logger.log(' Google AdWords: ' + soleConfig.googleAdWordsID);
logger.log(' Slack API Token: ' + soleConfig.slackToken);
logger.log(' Slack Channel: ' + soleConfig.slackChannel);
logger.log('\n/^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ \n\n');

app.listen(port);

logger.log('.d8888. d888888b  .d8b.  d8888b. d888888b .d8888.  .d88b.  db      d88888b ');
logger.log('88\'  YP `~~88~~\' d8\' `8b 88  `8D `~~88~~\' 88\'  YP .8P  Y8. 88      88\'     ');
logger.log('`8bo.      88    88ooo88 88oobY\'    88    `8bo.   88    88 88      88ooooo ');
logger.log('  `Y8b.    88    88~~~88 88`8b      88      `Y8b. 88    88 88      88~~~~~ ');
logger.log('db   8D    88    88   88 88 `88.    88    db   8D `8b  d8\' 88booo. 88.     ');
logger.log('`8888Y\'    YP    YP   YP 88   YD    YP    `8888Y\'  `Y88P\'  Y88888P Y88888P \n');

logger.log('Server running. You can view it locally at http://localhost:' + port);