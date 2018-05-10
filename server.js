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

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// home route
router.get('/', function(req, res) {
  var homeData = Controllers.Home.getHomeData();
  res.render('home', homeData);
});


// static route for History of SOLE
router.get('/history', function(req, res) {
  res.render('history');
});

// static route for History of SOLE
router.get('/howto', function(req, res) {
  res.render('howto');
});

// static route for History of SOLE
router.get('/resources', function(req, res) {
  res.render('resources');
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

  // on routes that end in /soles
  // ----------------------------------------------------
  router.route('/questions')

    // get all the soles (accessed at GET http://localhost:8080/api/soles)
    .get(function(req, res) {
      const allQuestions = [{name: 'question name',  author: 'drew'}]
      res.json(allQuestions);
    });

    // on routes that end in /soles/:sole_id
    // ----------------------------------------------------
    router.route('/questions/:id')
        // get the sole with that id (accessed at GET http://localhost:8080/api/soles/:sole_id)
        .get(function(req, res) {
          const singleQuestion = {name: 'What is up?', author: 'Drew', id: req.params.id};
          res.json(singleQuestion);
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
