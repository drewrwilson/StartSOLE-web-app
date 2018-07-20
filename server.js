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

// var Parse       =  require('parse/node');
var soleConfig  = require('./sole-config.js');

var port = process.env.PORT || 8080;                 // set our port

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
          homeData.config = soleConfig;
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
      viewData.config = soleConfig;
      res.render('history', viewData);
    });

// static route for History of SOLE
router.route('/how')
    .get((req, res)=> {
      const sesh = req.query.sesh; //get the sesh token string from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
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

// routes for resources
router.route('/resources')
    .get((req, res)=> {
      const sesh = req.query.sesh; //get the sesh token string from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
      sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

      Controllers.Resource.getAll().then(resources=>{
        const viewData = {
          resources: resources,
          sesh: sesh,
          config: soleConfig
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
      viewData.config = soleConfig;
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
        profileData.config = soleConfig;
        res.render('profile', profileData);
      });

    })
    .post((req, res)=> {
      const sesh = req.body.sesh; //get the sesh token string from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login') : false; //if the sesh token doesn't exist in the URL, redirect to /login
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
          console.log('error updating user', err);
          res.redirect('/error?sesh='+sesh)
        })

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
  })

// routes for logging in
// ----------------------------------------------------
router.route('/login')
// login vieww
    .get((req, res)=> {
      res.render('login', {layout: 'prelogin.hbs', config: soleConfig});
    })

// route for completing profile
router.route('/complete-profile')
    .get((req, res) => {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    Controllers.User.getProfileData(sessionToken)
        .then((profileData) => {
          console.log("get Profile Data");
          console.log(JSON.stringify(profileData));
          if( profileData.user.firstName && profileData.user.lastName ) {
            console.log("got first and last");
          } else {
            console.log("don't have first name and last name from db! seting them from the query param");
            profileData.user.firstName = req.query.firstname;
            profileData.user.lastName = req.query.lastname;
          }

          profileData.sesh = sesh;
          console.log('profileData', profileData);
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
        console.log('error completing user profile', err);
        res.redirect('/error?sesh='+sesh);
      })
  })

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
          soles.config = soleConfig;
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
            console.log(JSON.stringify(singleSole));
            singleSole.sesh = sesh;
            singleSole.config = soleConfig;
            res.render('soles-single', singleSole);
          }).catch((err)=>{
            console.log('error!', err);
            res.redirect('/login')
          })
    });


// on routes that end in /soles/:sole_id/download-plan
// ----------------------------------------------------
router.route('/soles/:id/download-plan')
// get the sole with that id
    .get((req, res)=> {
      const sesh = req.query.sesh; //get the sesh token string from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
      sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

      var id = req.params.id;
      var type = "plan";

    Controllers.Sole.downloadDocument(id, type, sessionToken)
    .then((url) => {
      res.redirect(soleConfig.baseURL+url);
    })
    .catch((err)=>{
      res.redirect('/error?sesh=' + sesh)
    })
  });


// on routes that end in /soles/:sole_id/download-summary
// ----------------------------------------------------
router.route('/soles/:id/download-summary')
// get the sole with that id
  .get((req, res)=> {
  const sesh = req.query.sesh; //get the sesh token string from the query param
(!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

var id = req.params.id;
var type = "summary";

Controllers.Sole.downloadDocument(id, type, sessionToken)
  .then((url) => {
  res.redirect(soleConfig.baseURL+url);
})
.catch((err)=>{
  res.redirect('/error?sesh=' + sesh)
})
});

// on routes that end in /soles/:sole_id/copy
// 1. get the data from a SOLE
// 2. send it to create SOLE with that data
// ----------------------------------------------------
router.route('/soles/:id/copy')
  .get((req,res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

    console.log('req.params.id ', req.params.id);

    Controllers.Sole.copy(req.params.id, sessionToken).then(soleID=>{
      console.log('soleID new copy: ', soleID);
      res.redirect('/soles/?sesh=' + sesh);
    });

})


// on routes that end in /soles/:sole_id/edit
// ----------------------------------------------------
router.route('/soles/:id/edit')
// get the sole with that id
    .get((req, res)=> {
      const sesh = req.query.sesh; //get the sesh token string from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
      sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

        Controllers.Sole.getByID(req.params.id, sessionToken).then((singleSole) => {
            singleSole.sesh = sesh;
            singleSole.config = soleConfig;
            res.render('soles-add', singleSole);
          }).catch((err)=>{
            console.log('error!', err);
            res.redirect('/login')
          })
    })
.post((req, res)=> {
    //TODO: make this reusable for copying

    console.log("sole-edit post!");
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

    let id = req.body.sole_id;

    Controllers.Sole.update(id, sole, sessionToken).then(soleID=>{
        console.log("UPDATING an EXISTING SOLE with this ID:");
        console.log(id);
    res.redirect('/soles/?sesh='+sesh);
    }).catch((err)=>{
        console.log('error saving sole', err);
    res.redirect('/login')
    })


});

//on routes that end in /soles/:sole_id/delete
router.route('/soles/:id/delete')
// get the sole with that id
    .get((req, res)=> {
    const sesh = req.query.sesh; //get the sesh token string from the query param
(!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

Controllers.Sole.getByID(req.params.id, sessionToken).then((singleSole) => {
    singleSole.sesh = sesh;
    singleSole.config = soleConfig;
    res.render('soles-delete', singleSole);
    }).catch((err)=>{
        console.log('error!', err);
    res.redirect('/login')
    })
})
.post((req, res)=> {
    console.log("Tryna delete a SOLE!",req.body.soleID);
    const sesh = req.query.sesh; //get the sesh token string from the query param
    (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
    sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string
    Controllers.Sole.delete(req.body.soleID, sessionToken).then(soleID=>{
        console.log('deleted SOLE',soleID);
        res.redirect('/soles/?sesh='+sesh);
    });
});


// on routes that end in /soles/:sole_id/reflect
// ----------------------------------------------------
router.route('/soles/:id/reflect')
// get the sole with that id
    .get((req, res)=> {
      const sesh = req.query.sesh; //get the sesh token string from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
      sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

      Controllers.Sole.getByID(req.params.id, sessionToken).then((singleSole) => {
          singleSole.sesh = sesh;
          singleSole.config = soleConfig;
      res.render('soles-reflect', singleSole);
      }).catch((err)=>{
          console.log('error!', err);
      res.redirect('/login')
      })
    });

router.route('/sole-reflect')
.post((req, res)=>{
  const sesh = req.body.sesh; //get the sesh token string from the query param
  (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
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
      help_why: req.body.help_why, //session.help_why
      notes: req.body.notes //session.reflection.notes
  };


  Controllers.Sole.saveReflection(reflection, sessionToken).then(soleID=>{
    res.redirect('/soles/'+soleID+'?sesh='+sesh);
  })

  console.log('req.body', JSON.stringify(req.body));

});



// on routes that end in /soles/add/
// ----------------------------------------------------
router.route('/sole-create')
// view for adding a new sole
    .get((req, res)=> {
      const sesh = req.query.sesh; //get the sesh token string from the query param
      const question = req.query.question; //get the ID of desired question from the query param
      (!sesh || sesh === undefined) ? res.redirect('/login'): false; //if the sesh token doesn't exist in the URL, redirect to /login
      sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string
      var viewData = {sesh: sesh}
      viewData.config = soleConfig;

      //if a question is present get it and attach to viewData as part of a SOLE
      if(question){
          Controllers.Question.getByID(question, sessionToken).then((questionData) => {
            viewData.sole = {question: questionData};
            res.render('soles-add', viewData);
          }).catch((err)=>{
              console.log('error! oh noes!', err);
              // res.render('soles-add', viewData);
          })
      }
      else {
        res.render('soles-add', viewData);
      }
    })
    .post((req, res)=>{

    console.log("sole-create post!");
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


            Controllers.Sole.add(sole, sessionToken).then(soleID=>{
                console.log("SAVING a NEW SOLE with this ID:");
                console.log(soleID);
            res.redirect('/soles/?sesh='+sesh);
        }).catch((err)=>{
                console.log('error saving sole', err);
            res.redirect('/login')
        })

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
            foundQuestions.config = soleConfig;
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
              foundQuestions.config = soleConfig;
              res.render('questions', foundQuestions);
            }).catch((err)=>{
              console.log('error!', err);
              res.redirect('/login')
            });
        } else {
          viewData = {sesh: sesh};
          viewData.config = soleConfig;
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
      viewData.config = soleConfig;
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
          questionData.config = soleConfig;
          questionData.question.favorited = true;
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

        Controllers.Question.favorite(req.params.id, sessionToken).then((questionData) => {
          console.log(JSON.stringify(questionData));
          res.redirect('/questions/'+req.params.id+'?sesh='+sesh);
        }).catch((err)=>{
          console.log('error!', err);
          res.redirect('/login')
        });
    });

// static route for fail cases (404)
router.route('/error')
  .get((req, res)=> {
  const sesh = req.query.sesh; //get the sesh token string from the query param
  sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

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
  sessionToken = Controllers.Helper.seshToSessionToken(sesh); //convert sesh to sessionToken string

  res.render('fail', {
    layout: 'no-sidebar.hbs',
    sesh: sesh,//not neccesary and we might not have this, but what the heck let's send it jjuust in case
    config: soleConfig
  });
});


// START THE SERVER
// =============================================================================
app.listen(port);

console.log(".d8888. d888888b  .d8b.  d8888b. d888888b .d8888.  .d88b.  db      d88888b ");
console.log("88'  YP `~~88~~' d8' `8b 88  `8D `~~88~~' 88'  YP .8P  Y8. 88      88'     ");
console.log("`8bo.      88    88ooo88 88oobY'    88    `8bo.   88    88 88      88ooooo ");
console.log("  `Y8b.    88    88~~~88 88`8b      88      `Y8b. 88    88 88      88~~~~~ ");
console.log("db   8D    88    88   88 88 `88.    88    db   8D `8b  d8' 88booo. 88.     ");
console.log("`8888Y'    YP    YP   YP 88   YD    YP    `8888Y'  `Y88P'  Y88888P Y88888P \n");


console.log('Server running. You can view it locally at http://localhost:' + port);
