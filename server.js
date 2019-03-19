// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express     = require('express');        // call express
var app         = express();                 // define our app using express
var bodyParser  = require('body-parser');
var hbs         = require('express-hbs');
var path        = require('path');
var moment        = require('moment');
var Controllers = require('./controllers/controllers.js');
const logger = require('./logger.js');
logger.useSlackBot = process.env.ENVIRONMENT === 'production'; //true if production, false otherwise

// var Parse       =  require('parse/node');
var soleConfig  = require('./sole-config.js');

var port = process.env.PORT || 8080;                 // set our port

console.log('Meaningless change to test circle ci!');

// connect to parse server
// Parse.initialize(soleConfig.appId);
// Parse.serverURL = soleConfig.serverUrl;

var sessionToken = null; //initiatize this variable so we can use it globally

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
var router = express.Router();              // get an instance of the express Router

// home route
// NOTE: this is where we can add in some welcome content. eg on first load
//       redirect to a intro screen. Or after completing your 5 SOLE, give some
//       nice encouraging message, etc etc
router.route('/')
  .get((req, res) => {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    //check if user needs to complete profile
    // if so, show them the compete profile view
    Controllers.User.isProfileComplete(sessionToken).then(profileIsCompleted=>{
      if (!profileIsCompleted) {
        res.redirect('/complete-profile?sesh='+ sesh);
      } else {
        res.redirect('/home?sesh='+ sesh);
      }
    });
  });

// on routes that end in /stats/
router.route('/slackbot/users-range')
  .post((req, res)=> {
    let numberOfDays = 1;
    if (req.body.text) {
      numberOfDays = Number(req.body.text); //convert string to integer
    }
    Controllers.Stats.usersRange(numberOfDays).then(responseMessage => {
      res.render('stats', {layout: 'blank.hbs', statsMessage: responseMessage}); //display slack-friendly webpage
    });
  });

// ----------------------------------------------------
router.route('/slackbot/users-today')
  .post((req, res)=> {
    Controllers.Stats.usersToday().then(responseMessage => {
      res.render('stats', {layout: 'blank.hbs', statsMessage: responseMessage}); //display slack-friendly webpage
    });
  });

router.route('/slackbot/users-range-detail')
  .post((req, res)=> {
    let numberOfDays = 1;
    if (req.body.text) {
      numberOfDays = Number(req.body.text); //convert string to integer
    }
    Controllers.Stats.usersRangeDetail(numberOfDays).then(responseMessage => {
      res.render('stats', {layout: 'blank.hbs', statsMessage: responseMessage}); //display slack-friendly webpage
    });
  });


//on routes that end in /random-picture
// ----------------------------------------------------
router.route('/random-picture')
  .get((req, res)=> {
    const pic = Controllers.Test.randomPicture();
    res.sendFile('images/test-images/'+pic,{root: __dirname + '/public/'});
  });


router.route('/home')
  .get((req,  res)=>{
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    var homeData = {soles: [],questions:[]};


    Controllers.User.getRoleData(sessionToken).then((roleData)=>{
      homeData.roleData = roleData;
      homeData.sesh = sesh;
      homeData.config = soleConfig;

      if (roleData.isRingleader){
        return Controllers.User.getMyRings(sessionToken).then((rings)=>{
          homeData.rings = rings;
          res.render('home', homeData); //display view with question data
        }).catch((err)=>{
          logger.error('Error getting ring for user!', err);
        });
      }
      else {
        res.render('home', homeData); //display view with question data
      }

    }).catch((err)=>{
      logger.error('Error getting roleData for user!', err);

      res.redirect('/home');
    });

  });

//temporary static route for making the view for approving soles
router.route('/pending-soles')
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    const adminData = {
      sesh: sesh,
      config: soleConfig,
      layout: 'default.hbs',
      totalSoles: 666
    };

    Controllers.Admin.getPendingSoles(sessionToken).then(soles=>{
      soles.forEach(sole=>{
        sole.question.shortText = sole.question.text.substring(0,10);
        sole.reflectionDate = moment(sole.reflectionDate, 'YYYYMMDD').fromNow();
      });

      adminData.soles = soles;
      adminData.totalSoles = soles.length;
      res.render('admin-pending-soles', adminData);
    }).catch(err=>{
      res.redirect('/home?sesh=' + sesh);
    });
  })

/*
        ToDo:
        * pass sesh token back and forth
        * connect it to Webapp.js
        * check for isAdmin and add a link to the homepage if isAdmin
         */

  .post((req, res)=> {
    const sesh = req.body.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res) : false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string
    const requestSocialMedia = (req.body.socialMediaCheck == 'true') ? true : false;//true if we need to request Social Media Approval via email, false otherwise
    // const email = req.body.email;
    // const pdfUrl = req.body.pdfUrl;
    // const question req.body.question;

    if (req.body.action === 'approve') {
      Controllers.Admin.approveSole(req.body.soleId, req.body.comment, requestSocialMedia, sessionToken).then(soleId=>{
        res.redirect('/pending-soles?sesh=' + sesh);
      });
    } else if (req.body.action === 'reject') {
      Controllers.Admin.rejectSole(req.body.soleId, req.body.comment, sessionToken).then(soleId=>{
        res.redirect('/pending-soles?sesh=' + sesh);
      });
    } else {
      logger.error('Error. Got a malformed post without reject or approve.');
    }
  });

// route for Admin Page
router.route('/admin')
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    const adminData = {sesh: sesh};
    adminData.config = soleConfig;
    adminData.layout = 'no-footer.hbs';

    Controllers.User.getRoleData(sessionToken).then((roleData)=>{
      adminData.roleData = roleData;
      if(!roleData.isAdmin){
        res.redirect('/home?sesh=' + sesh);
      }
      else {
        Controllers.User.adminSummaryData().then((summaryData)=>{
          adminData.usersToday = summaryData;
          res.render('admin', adminData);
        });
      }
    }).catch((err)=>{
      res.redirect('/home?sesh=' + sesh);
    });
  });

// route for browsing all SOLEs.  Admin only
router.route('/admin/browse-soles')
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    const adminData = {sesh: sesh};
    adminData.config = soleConfig;

    Controllers.User.getRoleData(sessionToken).then((roleData)=>{
      adminData.roleData = roleData;
      if(!roleData.isAdmin){
        res.redirect('/home');
      }
      else {
        res.render('admin-browse-soles', adminData);
      }
    }).catch((err)=>{
      res.redirect('/home');
    });
  });

// route for browsing all SOLEs.  Admin only
router.route('/admin/browse-users')
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    const adminData = {sesh: sesh};
    adminData.config = soleConfig;

    Controllers.User.getRoleData(sessionToken).then((roleData)=>{
      adminData.roleData = roleData;
      if(!roleData.isAdmin){
        res.redirect('/home');
      }
      else {
        res.render('admin-browse-users', adminData);
      }
    }).catch((err)=>{
      res.redirect('/home');
    });
  });

// route for browsing upcoming conferences and events.  Admin only
router.route('/admin/events')
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    const adminData = {sesh: sesh};
    adminData.config = soleConfig;

    Controllers.User.getRoleData(sessionToken).then((roleData)=>{
      adminData.roleData = roleData;
      if(!roleData.isAdmin){
        res.redirect('/home');
      }
      else {
        res.render('admin-conferences-and-events', adminData);
      }
    }).catch((err)=>{
      res.redirect('/home');
    });
  });

// static route for History of SOLE
router.route('/history')
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    const viewData = {sesh: sesh};
    viewData.config = soleConfig;
    res.render('history', viewData);
  });

// static route for History of SOLE
router.route('/how')
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    const viewData = {sesh: sesh};
    viewData.config = soleConfig;
    res.render('how-to-sole', viewData);
  });

// static route for ToS
router.route('/terms-of-use')
  .get((req, res)=> {
    res.render('terms-of-use', {layout: 'no-sidebar.hbs', config: soleConfig});
  });

// static route for privacy
router.route('/privacy')
  .get((req, res)=> {
    res.render('privacy', {layout: 'no-sidebar.hbs', config: soleConfig});
  });

// static route for email verification success
router.route('/verify-email-success')
  .get((req, res)=> {
    const email = req.query.email;
    res.render('verify-email-success', {layout: 'no-sidebar.hbs', config: soleConfig, email: email});
  });

// static route for email verification failure
router.route('/verify-email-failure')
  .get((req, res)=> {
    const email = req.query.email;
    res.render('verify-email-failure', {layout: 'no-sidebar.hbs', config: soleConfig, email: email});
  });

// routes for resources
router.route('/resources')
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    Controllers.Resource.getAll().then(resources=>{
      const viewData = {
        resources: resources,
        sesh: sesh,
        config: soleConfig
      };
      res.render('resources', viewData);
    });

  });

// static route for community map
router.route('/map')
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    const viewData = {sesh: sesh};
    viewData.config = soleConfig;
    res.render('map', viewData);
  });

// routes for profile
// ----------------------------------------------------
router.route('/profile')

// profile view
  .get((req, res) => {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    Controllers.User.getProfileData(sessionToken)
      .then((profileData) => {
        profileData.sesh = sesh;
        profileData.config = soleConfig;
        res.render('profile', profileData);
      });

  })
  .post((req, res)=> {
    const sesh = req.body.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res) : false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    // TODO: refactor so this accept explicit param instead of of req.body
    Controllers.User.updateProfileData(req.body.subjects || false,
      req.body.grades || false,
      req.body.role || false,
      req.body.firstName || false,
      req.body.lastName || false,
      false,
      false,
      false,
      false,
      sessionToken)
      .then(user=>{
        res.redirect('/soles?sesh='+sesh);
      }).catch((err)=>{
        logger.error('Error updating user', err);
        res.render('fail', {
          layout: 'no-sidebar.hbs',
          sesh: sesh,//not neccesary and we might not have this, but what the heck let's send it jjuust in case
          config: soleConfig,
          error: 'Updating user'
        });
      });

  });

// routes for user registration
// ----------------------------------------------------
router.route('/register')

// register view
  .get((req, res)=> {
    res.render('register', {layout: 'no-sidebar.hbs', config: soleConfig});
  });

//route for logging out
router.route('/logout')
  .get((req, res)=> {
    res.render('logout', {layout: 'no-sidebar.hbs', config: soleConfig});
  });

// routes for logging in
// ----------------------------------------------------
router.route('/login')
// login vieww
  .get((req, res)=> {
    const email = req.query.email;
    res.render('login', {layout: 'prelogin.hbs', config: soleConfig, email: email});
  });

// route for completing profile
router.route('/complete-profile')
  .get((req, res) => {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    Controllers.User.getProfileData(sessionToken)
      .then((profileData) => {

        if( profileData.user.firstName && profileData.user.lastName ) {
        } else {
          profileData.user.firstName = req.query.firstname;
          profileData.user.lastName = req.query.lastname;
        }

        profileData.sesh = sesh;
        res.render('complete-profile', {
          layout: 'no-sidebar.hbs',
          profile: profileData,
          sesh: sesh,
          config: soleConfig
        });

      });

  })
  .post((req, res)=>{

    const sesh = req.body.sesh; //get the sesh token string from the POST param
    (!sesh || sesh === undefined) ? res.redirect('/error') : false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    Controllers.User.updateProfileData(req.body.subjects,
      req.body.grades,
      req.body.role,
      req.body.firstName,
      req.body.lastName,
      req.body.schoolName,
      req.body.schoolAddress,
      req.body.schoolPlaceID,
      'jur.' + req.body.schoolState.toLowerCase(), //need to add 'jur.' to the string and lowercase it to make it work with the database
      sessionToken)
      .then(user=>{
        Controllers.User.completedProfile(sessionToken);
        res.redirect('/soles?sesh='+sesh);
      }).catch((err)=>{
        logger.error('Error completing user profile', err);
        res.redirect('/error?sesh='+sesh);
      });
  });

// routes for soles
// ----------------------------------------------------
router.route('/soles')

// get all the soles
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    Controllers.Sole.getAll(sessionToken)
      .then(soles=>{
        soles.sesh = sesh;
        soles.config = soleConfig;
        res.render('soles', soles);
      }).catch(err=>{
        showErrorPage('Could not get list of SOLEs.', sesh, res);
      });

  });

// on routes that end in /soles/:sole_id
// ----------------------------------------------------
router.route('/soles/:id')
// get the sole with that id
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    Controllers.Sole.getByID(req.params.id, sessionToken)
      .then((singleSole) => {
        //in case the id of the sole is invalid
        singleSole.sesh = sesh;
        singleSole.config = soleConfig;
        res.render('soles-single', singleSole);
      }).catch((err)=>{
        showErrorPage('Could not get a SOLE.', sesh, res);
      });
  });


// on routes that end in /soles/:sole_id/download-plan
// ----------------------------------------------------
router.route('/soles/:id/download-plan')
// get the sole with that id
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    var id = req.params.id;
    var type = 'plan';

    Controllers.Sole.downloadDocument(id, type, sessionToken)
      .then((url) => {
        res.redirect(soleConfig.baseURL+url);
      })
      .catch((err)=>{
        res.redirect('/error?sesh=' + sesh);
      });
  });


// on routes that end in /soles/:sole_id/download-summary
// ----------------------------------------------------
router.route('/soles/:id/download-summary')
// get the sole with that id
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    var id = req.params.id;
    var type = 'summary';

    Controllers.Sole.downloadDocument(id, type, sessionToken)
      .then((url) => {
        res.redirect(soleConfig.baseURL+url);
      })
      .catch((err)=>{
        res.redirect('/error?sesh=' + sesh);
      });
  });

// on routes that end in /soles/:sole_id/copy
// 1. get the data from a SOLE
// 2. send it to create SOLE with that data
// ----------------------------------------------------
router.route('/soles/:id/copy')
  .get((req,res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    Controllers.Sole.copy(req.params.id, sessionToken).then(soleID=>{
      res.redirect('/soles/?sesh=' + sesh);
    });

  });


// on routes that end in /soles/:sole_id/edit
// ----------------------------------------------------
router.route('/soles/:id/edit')
// get the sole with that id
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    Controllers.Sole.getByID(req.params.id, sessionToken).then((singleSole) => {
      singleSole.sesh = sesh;
      singleSole.config = soleConfig;
      res.render('soles-add', singleSole);
    }).catch((err)=>{
      showErrorPage('Failed to get SOLE session from the server', sesh, res);
    });
  })
  .post((req, res)=> {
    //TODO: make this reusable for copying

    const sesh = req.body.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

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

    Controllers.Sole.update(id, sole, sessionToken).then(soleID=>{
      res.redirect('/soles/?sesh='+sesh);
    }).catch((err)=>{
      showErrorPage('Could not save SOLE session.', sesh, res);
    });


  });

//on routes that end in /soles/:sole_id/delete
router.route('/soles/:id/delete')
// get the sole with that id
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    Controllers.Sole.getByID(req.params.id, sessionToken).then((singleSole) => {
      singleSole.sesh = sesh;
      singleSole.config = soleConfig;
      res.render('soles-delete', singleSole);
    }).catch((err)=>{
      showErrorPage('Could not get SOLE session from the server. Try again later.', sesh, res);

    });
  })
  .post((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string
    Controllers.Sole.delete(req.body.soleID, sessionToken).then(soleID=>{
      res.redirect('/soles/?sesh='+sesh);
    });
  });


// on routes that end in /soles/:sole_id/reflect
// ----------------------------------------------------
router.route('/soles/:id/reflect')
// get the sole with that id
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    Controllers.Sole.getByID(req.params.id, sessionToken).then((singleSole) => {
      singleSole.sesh = sesh;
      singleSole.config = soleConfig;
      res.render('soles-reflect', singleSole);
    }).catch((err)=>{
      showErrorPage('Coud not get SOLE session from the server.', sesh, res);
    });
  });

router.route('/sole-reflect')
  .post((req, res)=>{
    const sesh = req.body.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    var reflection = {
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


    Controllers.Sole.saveReflection(reflection, sessionToken).then(soleID=>{
      res.redirect('/soles/'+soleID+'?sesh='+sesh);
    });

  });



// on routes that end in /soles/add/
// ----------------------------------------------------
router.route('/sole-create')
// view for adding a new sole
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    const question = req.query.question; //get the ID of desired question from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    var viewData = {sesh: sesh};
    viewData.config = soleConfig;

    //if a question is present get it and attach to viewData as part of a SOLE
    if(question){
      Controllers.Question.getByID(question, sessionToken).then((questionData) => {
        viewData.sole = {question: questionData};
        res.render('soles-add', viewData);
      }).catch((err)=>{
        showErrorPage('Could not load question with id: ' + question, sesh , res);
      });
    }
    else {
      res.render('soles-add', viewData);
    }
  })
  .post((req, res)=>{
    const sesh = req.body.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

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


    Controllers.Sole.add(sole, sessionToken).then(soleID=>{
      res.redirect('/soles/?sesh='+sesh);
    }).catch((err)=>{
      showErrorPage('Could not save SOLE session', sesh, res);
    });

  });

// on routes that end in /questions
// ----------------------------------------------------
router.route('/questions')
// get all the soles
  .get((req, res)=> {

    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    if (req.query.q) {
      Controllers.Question.findByText(req.query.q, sessionToken).then((foundQuestions) => {
        foundQuestions.sesh = sesh;
        foundQuestions.config = soleConfig;
        res.render('questions', foundQuestions);
      }).catch((err)=>{
        showErrorPage('Could not find question by text search.', sesh, res);
      });
    } else if (req.query.tags) {
      Controllers.Question.findByTags(req.query.tags, sessionToken).then((foundQuestions) => {
        //todo probably need to do some processing on tags to convert it from a string to an array of tags
        foundQuestions.sesh = sesh;
        foundQuestions.config = soleConfig;
        res.render('questions', foundQuestions);
      }).catch((err)=>{
        showErrorPage('Could not find question by tags.', sesh, res);
      });
    } else {
      viewData = {sesh: sesh};
      viewData.config = soleConfig;
      res.render('questions', viewData);
    }
  });


// on routes that end in /questions/mine
// ----------------------------------------------------
router.route('/questions/mine')
  .get((req,  res)=>{
    const sesh = req.query.sesh; //get the sesh token string from the query param
    const fav = req.query.fav; //optional query parameter to set fav tab as active
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    var myQuestionsData = {soles: [], questions:[], sesh: sesh, fav: fav};

    Controllers.Question.getAll(sessionToken).then((questions)=>{
      myQuestionsData.questions.mine = questions.questions;

      Controllers.Question.getFavorites(sessionToken).then((favoriteQuestions)=>{
        myQuestionsData.questions.favorites = favoriteQuestions;

        myQuestionsData.sesh = sesh;
        myQuestionsData.config = soleConfig;
        res.render('my-questions', myQuestionsData); //display view with question data

      }).catch((err)=>{
        showErrorPage('Could not get your favorited questions.', sesh, res);

      });
    }).catch((err)=>{
      showErrorPage('Could not get list of SOLEs.', sesh, res);
    });
  });

//add a question
router.route('/questions/add')
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    const viewData = {sesh: sesh};
    viewData.config = soleConfig;
    res.render('questions-add', viewData);
  })
// TODO: add post route here to save question to DB
  .post((req, res)=>{
    const sesh = req.body.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    let tags = req.body.tags.split(',');

    var newQuestion = {
      text: req.body.text,
      source: req.body.source,
      tags: tags
    };
    Controllers.Question.add(newQuestion.text, newQuestion.tags, newQuestion.source, sessionToken).then(questionID=>{
      res.redirect('/questions/'+questionID+'?sesh='+sesh);
    }).catch((err)=>{
      showErrorPage('Could not add question', sesh, res);
    });

  });

// on routes that end in /questions/:id
// ----------------------------------------------------
router.route('/questions/:id')
// get the question data with a given id
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    const favorited = req.query.fav; //is true if question was just favorited
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    Controllers.Question.getByID(req.params.id, sessionToken).then((questionData) => {
      questionData.sesh = sesh;
      questionData.favorited = favorited;
      questionData.config = soleConfig;
      questionData.question.favorited = true;
      Controllers.User.getRoleData(sessionToken).then((roleData)=>{
        questionData.roleData = roleData;
        res.render('questions-single', questionData);
      })
        .catch((err)=>{
          showErrorPage('Could not get roleData for user.', sesh, res);
        });
    }).catch((err)=>{
      showErrorPage('Could not get SOLE session.', sesh, res);
    });
  });

router.route('/questions/:id/favorite')
// favorite a question with a given id
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    Controllers.Question.favorite(req.params.id, sessionToken).then((questionData) => {
      res.redirect('/questions/'+req.params.id+'?fav=true&sesh='+sesh);
    }).catch((err)=>{
      showErrorPage('Could not favorite this question.', sesh, res);
    });
  });

router.route('/questions/:id/delete-tag/:rdn')
// remove a tag from a question
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    Controllers.Question.deleteTag(req.params.id, req.params.rdn, sessionToken).then((questionData) => {
      res.redirect('/questions/'+req.params.id+'?sesh='+sesh);
    }).catch((err)=>{
      showErrorPage('Could not delete a tag.', sesh, res);
    });
  });


// routes for admin dashboard
// ----------------------------------------------------
router.route('/dashboard')

// gets data to build a simple dashboard
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    const ringID = req.query.ring; //get the ring ID string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res) : false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    const viewData = {
      sesh: sesh,
      config: soleConfig
    };

    Controllers.Dashboard.getDashboardData(ringID, sessionToken)
      .then(dashboard=>{
        viewData.dashboard = dashboard;
        res.render('dashboard', viewData);
      }).
      catch(err => {
        showErrorPage('Could not get dashboard data', sesh, res);
      });


  });

// routes for question approval
// ----------------------------------------------------
router.route('/dashboard/question-approval')

// get all the unapproved questions
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    Controllers.Question.getUnapproved(sessionToken)
      .then(questions=>{
        questions.sesh = sesh;
        questions.config = soleConfig;
        res.render('dashboard-question-approval', questions);
      }).catch(err=>{
        showErrorPage('Could not retrieve unapproved questions', sesh, res);
      });

  });

router.route('/questions/:id/approve')

// approve a single question
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    Controllers.Question.approve(req.params.id, sessionToken).then((questionData) => {
      res.redirect('/dashboard/question-approval?sesh='+sesh);
    }).catch((err)=>{
      showErrorPage('Could not approve a question.', sesh, res);
    });
  });

router.route('/questions/:id/reject')

// reject a single question
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    Controllers.Question.reject(req.params.id, sessionToken).then((questionData) => {
      res.redirect('/dashboard/question-approval?sesh='+sesh);
    }).catch((err)=>{
      showErrorPage('Could not reject a question.', sesh, res);

    });
  });

// routes for SOLE approval
// ----------------------------------------------------
router.route('/dashboard/sole-approval')

// get all the unapproved SOLEs
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    Controllers.Sole.getUnapproved(sessionToken)
      .then(soles=>{
        soles.sesh = sesh;
        soles.config = soleConfig;
        res.render('dashboard-sole-approval', soles);
      }).catch(err=>{
        showErrorPage('Could not retrieve unapproved soles', sesh, res);
      });

  });

router.route('/soles/:id/approve')

// approve a single SOLE
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    Controllers.Sole.approve(req.params.id, sessionToken).then((soleData) => {
      res.redirect('/dashboard/sole-approval?sesh='+sesh);
    }).catch((err)=>{
      showErrorPage('Could not approve a SOLE.', sesh, res);

    });
  });

router.route('/soles/:id/reject')

// reject a single SOLE
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? showErrorPage('Oops, session token missing. Please login.', false, res): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    Controllers.Sole.reject(req.params.id, sessionToken).then((soleData) => {
      res.redirect('/dashboard/sole-approval?sesh='+sesh);
    }).catch((err)=>{
      showErrorPage('Could not reject a SOLE.', sesh, res);
    });
  });


// static route for fail cases (404)
router.route('/error')
  .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    // var errorText = 'This is example error text.';

    res.render('fail', {
      layout: 'no-sidebar.hbs',
      sesh: sesh,//not neccesary and we might not have this, but what the heck let's send it jjuust in case
      config: soleConfig
    });
  });


// REGISTER OUR ROUTES -------------------------------
app.use('/', router);

// serve static content
app.use(express.static(path.join(__dirname, 'public')));



//custom 404 page
app.get('*', function(req, res){
  const sesh = req.query.sesh; //get the sesh token string from the query param

  showErrorPage('Oops, something went wrong. Try logging in again.', sesh, res);
});

/*
    redirects a user to the error page, shows them a little more info about what went wrong
    param:
        * errorMessage - string, short text about what went wrong
        * sesh - string, the session token
        * res - object from the router
    returns:
        * nothing
 */
function showErrorPage (errorMessage, sesh, res) {
  logger.error(errorMessage + ' sesh: ' + sesh);
  res.render('fail', {
    layout: 'no-sidebar.hbs',
    error: errorMessage,
    sesh: sesh,//not neccesary and we might not have this, but what the heck let's send it jjuust in case
    config: soleConfig
  });
}


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