// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express     = require('express');        // call express
var app         = express();                 // define our app using express
var bodyParser  = require('body-parser');
var hbs         = require('express-hbs');
var path        = require('path');
var Controllers = require('./controllers/controllers.js');

var Parse       =  require('parse/node');
var soleConfig  = require('./sole-config.js');

console.log("serverURL:", soleConfig.serverUrl);
// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

var sessionToken = null; //initiatize this variable so we can use it globally

// ******************
// handlebars helpers
// ******************

hbs.registerHelper('ifEquals',
    function(a, b, opts) {
        if (a == b) {
            return opts.fn(this)
        } else {
            return opts.inverse(this)
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
    return (array.indexOf(value) > -1) ? options.fn( this ) : "";
});

hbs.registerHelper("log", function(something) {
    console.log(something);
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


var port = process.env.PORT || 8080;        // set our port

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
      console.log('what happened??');

      sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string
      console.log("sessionToken", sessionToken);
      var homeData = {soles: [],questions:[]};
      console.log('before getall questions');
      Controllers.Question.getAll(sessionToken).then((questions)=>{
        console.log('questions', questions);
        console.log('got all questions:');
        console.log(questions);
        console.log('---');
        homeData.questions.mine = questions.questions;

        Controllers.Question.getFavorites(sessionToken).then((favoriteQuestions)=>{
          console.log('got fav questions:');
          console.log(favoriteQuestions);
          console.log('---');
          homeData.questions.favorites = favoriteQuestions;
          homeData.sesh = sesh;
          res.render('home', homeData); //display view with question data
        }).catch((err)=>{
          console.log('error getting fav questions!', err);
          res.redirect('/login');
        })
      }).catch((err)=>{
        console.log('error getting all questions!', err);
        res.redirect('/login');
      });

});


// static route for History of SOLE
router.route('/history')
    .get((req, res)=> {
      const sesh = req.query.sesh; //get the sesh token string from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
      sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

      const viewData = {sesh: sesh};
      res.render('history', viewData);
    });

// static route for History of SOLE
router.route('/how')
    .get((req, res)=> {
      const sesh = req.query.sesh; //get the sesh token string from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
      sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

      const viewData = {sesh: sesh};
      res.render('how-to-sole', viewData);
    });

// static route for History of SOLE
router.route('/terms-of-use')
    .get((req, res)=> {
      res.render('terms-of-use', {layout: 'no-sidebar.hbs'});
    });

// static route for History of SOLE
router.route('/privacy')
    .get((req, res)=> {
      res.render('privacy', {layout: 'no-sidebar.hbs'});
    });

// routes for resources
router.route('/resources')
    .get((req, res)=> {
      const sesh = req.query.sesh; //get the sesh token string from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
      sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

      Controllers.Resource.getAll().then(resources=>{
        const viewData = {
          resources: resources,
          sesh: sesh
        }
        res.render('resources', viewData);
      })

    });

// static route for community map
router.route('/map')
    .get((req, res)=> {
      const sesh = req.query.sesh; //get the sesh token string from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
      sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

      const viewData = {sesh: sesh};
      res.render('map', viewData);
    });

// routes for profile
// ----------------------------------------------------
router.route('/profile')

// profile view
    .get((req, res) => {
      const sesh = req.query.sesh; //get the sesh token string from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
      sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

      Controllers.User.getProfileData(sessionToken)
      .then((profileData) => {
        profileData.sesh = sesh;
        res.render('profile', profileData);
      });

    })
    .post((req, res)=> {
        const sesh = req.body.sesh; //get the sesh token string from the query param
        (!sesh || sesh === undefined) ? res.redirect('/login') : false; //if the sesh token doesn't exist in the URL, redirect to /login
        sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string
        console.log('req.body',req.body);
        console.log('sessionToken', sessionToken);
        // TODO: refactor so this accept explicit param instead of of req.body
        Controllers.User.updateProfileData(req.body, sessionToken).then(user=>{
            // res.redirect('/soles');
            res.redirect('/soles?sesh='+sesh);
        }).catch((err)=>{
            console.log('error updating user', err);
            res.redirect('/login')
        })

    });

// routes for user registration
// ----------------------------------------------------
router.route('/register')

// register view
    .get((req, res)=> {
        res.render('register', {layout: 'no-sidebar.hbs'});
    });

//route for logging out
router.route('/logout')
  .get((req, res)=> {
    res.render('logout', {layout: 'no-sidebar.hbs'});
  })

// routes for logging in
// ----------------------------------------------------
router.route('/login')

// profile view
    .get((req, res)=> {
      res.render('login', {layout: 'prelogin.hbs'});
    })

// static route for completing profile
router.route('/complete-profile')
    .get((req, res) => {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    Controllers.User.getProfileData(sessionToken)
        .then((profileData) => {
          console.log("PROFIIIIILE");
          console.log(JSON.stringify(profileData));
          if( profileData.user.firstName && profileData.user.lastName ) {
            console.log("got first and last");
          } else {
            console.log("don't have mah data!");
            profileData.user.firstName = req.query.firstname;
            profileData.user.lastName = req.query.lastname;
          }

          profileData.sesh = sesh;
          console.log('profileData', profileData);
          res.render('complete-profile', {
              layout: 'prelogin.hbs',
              profile: profileData
          });
        });

});



// routes for soles
// ----------------------------------------------------
router.route('/soles')

// get all the soles
    .get((req, res)=> {
      const sesh = req.query.sesh; //get the sesh token string from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
      sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

        Controllers.Sole.getAll(sessionToken)
          .then(soles=>{
          console.log('All soles', JSON.stringify(soles));
          soles.sesh = sesh;
          res.render('soles', soles);
        }).catch(err=>{
          console.log('oops! error getting all soles!', err);
          // res.redirect('/login')
        })

    });

// on routes that end in /soles/:sole_id
// ----------------------------------------------------
router.route('/soles/:id')
// get the sole with that id
    .get((req, res)=> {
      const sesh = req.query.sesh; //get the sesh token string from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
      sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

      Controllers.Sole.getByID(req.params.id, sessionToken)
          .then((singleSole) => {
            //in case the id of the sole is invalid
            console.log(JSON.stringify(singleSole.sole));
            singleSole.sesh = sesh;
            res.render('soles-single', singleSole);
          }).catch((err)=>{
            console.log('error!', err);
            res.redirect('/login')
          })
    });


// on routes that end in /soles/:sole_id
// ----------------------------------------------------
router.route('/soles/:id/download-plan')
// get the sole with that id
    .get((req, res)=> {


    Controllers.Sole.downloadPlan(req.params.id, sessionToken)
    .then((url) => {
      //in case the id of the sole is invalid

      // var baseUrl = 'http://localhost:1339/soleapp/files/';


        var baseUrl = 'https://api.staging.startsole.net/sole/files/';

      // var file = baseUrl + url;
      // res.download(file); // Set disposition and send it.

      res.redirect(baseUrl+url);
      // res.render('soles-single', singleSole);
    })
    .catch((err)=>{
      console.log('error!', err);
      res.redirect('/login')
    })
  });

// on routes that end in /soles/:sole_id
// ----------------------------------------------------
router.route('/soles/:id/edit')
// get the sole with that id
    .get((req, res)=> {
      const sesh = req.query.sesh; //get the sesh token string from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
      sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

        Controllers.Sole.getByID(req.params.id, sessionToken).then((singleSole) => {
            singleSole.sesh = sesh;
            res.render('soles-add', singleSole);
          }).catch((err)=>{
            console.log('error!', err);
            res.redirect('/login')
          })
    });

// on routes that end in /soles/add/
// ----------------------------------------------------
router.route('/sole-create')
// view for adding a new sole
    .get((req, res)=> {
      const sesh = req.query.sesh; //get the sesh token string from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
      sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string
      var viewData = {sesh: sesh}
      res.render('soles-add', viewData);
    })
    .post((req, res)=>{
      const sesh = req.body.sesh; //get the sesh token string from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
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
      (req.body.student_organizer == 'on') ? materials.push('material.student_organizer') : false;
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
      }

console.log("SOLE ID!");
console.log(req.body.sole_id);

        if(req.body.sole_id){
            Controllers.Sole.add(sole, sessionToken, true).then(soleID=>{
                console.log("UPDATING and existing SOLE with this ID:");
                console.log(soleID);
            res.redirect('/soles/?sesh='+sesh);
        }).catch((err)=>{
                console.log('error saving sole', err);
            res.redirect('/login')
        })
        }
        else {
            Controllers.Sole.add(sole, sessionToken, false).then(soleID=>{
                console.log("SAVING a NEW SOLE with this ID:");
                console.log(soleID);
            res.redirect('/soles/?sesh='+sesh);
        }).catch((err)=>{
                console.log('error saving sole', err);
            res.redirect('/login')
        })
        }




    });

// on routes that end in /questions
// ----------------------------------------------------
router.route('/questions')
// get all the soles
    .get((req, res)=> {

      const sesh = req.query.sesh; //get the sesh token string from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
      sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

        if (req.query.q) {
          Controllers.Question.findByText(req.query.q, sessionToken).then((foundQuestions) => {
            console.log(JSON.stringify(foundQuestions));
            foundQuestions.sesh = sesh;
            res.render('questions', foundQuestions);
          }).catch((err)=>{
            console.log('error!', err);
            res.redirect('/login')
          });
        } else if (req.query.tags) {
            Controllers.Question.findByTags(req.query.tags, sessionToken).then((foundQuestions) => {
              //todo probably need to do some processing on tags to convert it from a string to an array of tags
              console.log(JSON.stringify(foundQuestions));
              foundQuestions.sesh = sesh;
              res.render('questions', foundQuestions);
            }).catch((err)=>{
              console.log('error!', err);
              res.redirect('/login')
            });
        } else {
          viewData = {sesh: sesh};
          res.render('questions', viewData);
        }
    });

//add a question
router.route('/questions/add')
    .get((req, res)=> {
      const sesh = req.query.sesh; //get the sesh token string from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
      sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

      const viewData = {sesh: sesh};
      res.render('questions-add', viewData);
    })
    // TODO: add post route here to save question to DB
    .post((req, res)=>{
      console.log('body', req.body);
      const sesh = req.body.sesh; //get the sesh token string from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
      sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string


      let tags = req.body.tags.split(',');
      console.log('tags', tags);

      var newQuestion = {
        text: req.body.text,
        source: req.body.source,
        tags: tags
      }
      Controllers.Question.add(newQuestion.text, newQuestion.tags, newQuestion.source, sessionToken).then(questionID=>{
        console.log('added new question with id: ' + questionID);
        res.redirect('/questions/'+questionID+'?sesh='+sesh);
      }).catch((err)=>{
        console.log('error adding question!', err);
        res.redirect('/login')
      })

    });

// on routes that end in /questions/:id
// ----------------------------------------------------
router.route('/questions/:id')
// get the question data with a given id
    .get((req, res)=> {
      const sesh = req.query.sesh; //get the sesh token string from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
      sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string
      console.log("sessionToken", sessionToken);

        Controllers.Question.getByID(req.params.id, sessionToken).then((questionData) => {
          console.log(JSON.stringify(questionData));
          questionData.sesh = sesh;
          res.render('questions-single', questionData);
        }).catch((err)=>{
          console.log('error! oh noes!', err);
          res.redirect('/login')
        })
    });

router.route('/questions/:id/favorite')
// favorite a question with a given id
    .get((req, res)=> {
      const sesh = req.query.sesh; //get the sesh token string from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
      sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

        Controllers.Question.favorite(req.params.id).then((questionData) => {
          console.log(JSON.stringify(questionData));
          res.redirect('/questions/'+req.params.id);
        }).catch((err)=>{
          console.log('error!', err);
          res.redirect('/login')
        });
    });

// REGISTER OUR ROUTES -------------------------------
app.use('/', router);

// serve static content
app.use(express.static(path.join(__dirname, 'public')));

// START THE SERVER
// =============================================================================
app.listen(port);

console.log('Server running. You can view it locally at http://localhost:' + port);
