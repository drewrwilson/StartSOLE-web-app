// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var hbs        = require('express-hbs');
var path       = require('path');
var Controllers       = require('./controllers/controllers.js');

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

// ROUTES FOR APP
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// home route
router.route('/')
  .get(function(req, res) {
    var homeData = Controllers.Home.getHomeData();
    res.render('home', homeData);
  });


// static route for History of SOLE
router.route('/history')
  .get(function(req, res) {
    res.render('history');
  });

// static route for History of SOLE
router.route('/howto')
  .get(function(req, res) {
    res.render('howto');
  });

// static route for History of SOLE
router.route('/resources')
  .get(function(req, res) {
    res.render('resources');
  });

// static route for History of SOLE
router.route('/map')
  .get(function(req, res) {
    res.render('map');
  });

  // on routes that end in /soles
  // ----------------------------------------------------
  router.route('/profile')

    // get all the soles (accessed at GET http://localhost:8080/api/soles)
    .get(function(req, res) {
      var profileData = Controllers.User.getProfileData();
      res.render('profile', profileData);
    });


// on routes that end in /soles
// ----------------------------------------------------
router.route('/soles')

  // get all the soles (accessed at GET http://localhost:8080/api/soles)
  .get(function(req, res) {
    const allSoles = [{name: 'sole name',  author: 'drew'}]
    res.json(allSoles);
  });

  // on routes that end in /soles/:sole_id
  // ----------------------------------------------------
  router.route('/soles/:id')
      // get the sole with that id (accessed at GET http://localhost:8080/api/soles/:sole_id)
      .get(function(req, res) {
        const singleSole = {id: req.params.id};
        res.json(singleSole);
      });

  // on routes that end in /questions
  // ----------------------------------------------------
  router.route('/questions')

    // get all the soles (accessed at GET http://localhost:8080/api/soles)
    .get(function(req, res) {
      var recentQuestions = Controllers.Question.getRecent();
      res.render('questions', recentQuestions);
    });

    //add a question
    router.route('/questions/add')
      .get(function(req, res) {
        res.render('questions-add');
      });
    // on routes that end in /questions/:id
    // ----------------------------------------------------
    router.route('/questions/:id')
      // get the question data with a given id
      .get(function(req, res) {
        var questionData = Controllers.Question.getByID(req.params.id);
        res.render('questions-single', questionData);
      });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);

// serve static content
app.use(express.static(path.join(__dirname, 'public')));

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
