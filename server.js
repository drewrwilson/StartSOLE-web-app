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
var soleConfig = require('./sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

const username = process.argv[2]; //1st parameter after node test-parse.js USERNAME PASSWORD
const password = process.argv[3]; //2nd parameter after node test-parse.js USERNAME PASSWORD
//note username is email address

var sessionToken = null;
Parse.User.enableUnsafeCurrentUser();
Parse.User.logIn(username, password)
    .done((user)=>{
    Parse.Cloud.run("platform.set", {
    app	: "web",
    build: "2.0",
    info: "development for now"
}).then(data=>{
    console.log('Logged in!');
console.log('\n---\n');
sessionToken = Parse.User.current().getSessionToken();
console.log('current user token: ', sessionToken);
console.log('\n---\n');
console.log('Check out StartSOLE2 locally at:\n');
console.log('http://localhost:'+port+'?'+sessionToken.replace(':', '='));
console.log('\n---\n');
})

})
.catch((err)=>{
    console.log('error logging in', err);
})

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
// NOTE: this is where we can add in some welcome content. eg on first load
//       redirect to a intro screen. Or after completing your 5 SOLE, give some
//       nice encouraging message, etc etc
router.route('/')
    .get((req, res) => {

    var homeData = {soles: [],questions:[]};

Controllers.Question.getAll("sessionToken")
    .then((questions)=>{
    console.log('questions', questions);
console.log('got all questions:');
console.log(questions);
console.log('---');
homeData.questions.mine = questions.questions;

Controllers.Question.getFavorites(sessionToken.r)
    .then((favoriteQuestions)=>{
    console.log('got fav questions:');
console.log(favoriteQuestions);
console.log('---');
homeData.questions.favorites = favoriteQuestions;

res.render('home', homeData); //display view with question data
})
.catch((err)=>{
    console.log('error getting fav questions!', err);
})
})
.catch((err)=>{
    console.log('error getting questions!', err);
});

});


// static route for History of SOLE
router.route('/history')
    .get((req, res)=> {
        res.render('history');
    });

// static route for History of SOLE
router.route('/how')
    .get((req, res)=> {
        res.render('how-to-sole');
    });

// static route for History of SOLE
router.route('/terms-of-use')
    .get((req, res)=> {
        res.render('terms-of-use');
    });

// static route for History of SOLE
router.route('/privacy')
    .get((req, res)=> {
        res.render('privacy');
    });

// routes for resources
router.route('/resources')
    .get((req, res)=> {
        var resources = Controllers.Resource.getAll();
        res.render('resources', {resources: resources});
    });

// static route for community map
router.route('/map')
    .get((req, res)=> {
        res.render('map');
    });

// routes for profile
// ----------------------------------------------------
router.route('/profile')

// profile view
    .get((req, res) => {
    Controllers.User.getProfileData(sessionToken)
    .then((profileData) => {
    res.render('profile', profileData);
});

});

// routes for user registration
// ----------------------------------------------------
router.route('/register')

// profile view
    .get((req, res)=> {
        res.render('register');
    });

// routes for user registration
// ----------------------------------------------------
router.route('/login')

// profile view
    .get((req, res)=> {
        res.render('login');
    });

// routes for soles
// ----------------------------------------------------
router.route('/soles')

// get all the soles (accessed at GET http://localhost:8080/api/soles)
    .get((req, res)=> {
        Controllers.Sole.getAll(sessionToken)
            .then(soles=>{
            console.log('All soles', JSON.stringify(soles));
        res.render('soles', soles);
    })
        .catch(err=>{
            console.log('oops! error!', err);
    })

    });

// on routes that end in /soles/:sole_id
// ----------------------------------------------------
router.route('/soles/:id')
// get the sole with that id (accessed at GET http://localhost:8080/api/soles/:sole_id)
    .get((req, res)=> {
        Controllers.Sole.getByID(req.params.id, sessionToken)
            .then((singleSole) => {
            //in case the id of the sole is invalid
            console.log(JSON.stringify(singleSole.sole));
        res.render('soles-single', singleSole);
    })
        .catch((err)=>{console.log('error!', err);})
    });
// on routes that end in /soles/:sole_id
// ----------------------------------------------------
router.route('/soles/:id/edit')
// get the sole with that id (accessed at GET http://localhost:8080/api/soles/:sole_id)
    .get((req, res)=> {
        Controllers.Sole.getByID(req.params.id, sessionToken).then((singleSole) => {
            console.log("single sole!!!");
            console.log(singleSole);
            console.log("*************");
            console.log(JSON.stringify(singleSole.sole.materials));
            console.log(JSON.stringify(singleSole.sole.target_observations));
            res.render('soles-add', singleSole);
    });
    });

// on routes that end in /soles/add/
// ----------------------------------------------------
router.route('/sole-create')
// view for adding a new sole
    .get((req, res)=> {
        res.render('soles-add');
    })
    .post((req, res)=>{
      console.log(req.body);
      // let sole = {
      //   //values from the frontend
      //     subject
      //     grade
      //     class_label //optional
      //     question_id
      //     planned_date,
      //     planned_time,
      //     planned_duration,
      //     num_groups
      //     target_observations
      //     materials
      //     num_students
      //     num_devices
      //     group_organization
      //     group_sharing
      //     self_assessment
      //     content_objective
      //     time_question
      //     time_investigate
      //     time_review
      //     close
      // }
      // Controllers.Sole.add(req.body, sessionToken).then(questionID=>{
      //   console.log(questionID);
      //   res.redirect('/questions/'+questionID);
      // });
      res.json(req.body);
    });

//this route is just for testing:
router.route('/test-sole-create')
// view for adding a new sole
    .get((req, res)=> {
        var exampleSole = {
            state: "planned",//this is hardcoded on the backend
            plan_state: 6, //this is hardcoded on the backend
            subject: "top.english",
            grade: "edu.12",
            class_label: "World History", //optional: could be empty
            question: "What if there were no rules or laws in the local community?",
            question_id: "EFePpFvBuo",
            planned_date: "Jun 18, 2018",
            planned_time: "09:59 AM",
            planned_duration: 100,
            num_groups: 5,
            target_observations: [
                "session.observation.collaborating",
                "session.observation.technology",
                "session.observation.respectful"
            ],
            materials: [
                "material.poster_paper",
                "material.physical",
                "material.other"
            ],
            num_students: 20,
            num_devices: 5,
            group_organization: true,
            group_sharing: false,
            self_assessment: true,
            content_objective: "objective.content.deepen",
            use_app: true,//collected from the form
            time_question : 300,
            time_investigate : 4350,
            time_review : 750,
            time_close : 600,
        };
        Controllers.Sole.add(exampleSole).then(soleID=>{
            console.log(soleID);
            res.redirect('/soles/'+soleID);
        })
    });

// on routes that end in /questions
// ----------------------------------------------------
router.route('/questions')
// get all the soles (accessed at GET http://localhost:8080/questions)
    .get((req, res)=> {

        if (req.query.q) {
            Controllers.Question.findByText(req.query.q, sessionToken).then((foundQuestions) => {
                console.log(JSON.stringify(foundQuestions));
            res.render('questions', foundQuestions);
        });
        } else if (req.query.tags) {
            Controllers.Question.findByTags(req.query.tags, sessionToken).then((foundQuestions) => {
                //todo probably need to do some processing on tags to convert it from a string to an array of tags
                console.log(JSON.stringify(foundQuestions));
            res.render('questions', foundQuestions);
        });
        } else {
            Controllers.Question.getAll(sessionToken).then((allQuestions)=>{
                res.render('questions', allQuestions);
        });
        }
    });

//add a question
router.route('/questions/add')
    .get((req, res)=> {
        res.render('questions-add');
    });
// on routes that end in /questions/:id
// ----------------------------------------------------
router.route('/questions/:id')
// get the question data with a given id
    .get((req, res)=> {
        Controllers.Question.getByID(req.params.id).then((questionData) => {
            console.log(JSON.stringify(questionData));
        res.render('questions-single', questionData);
    });
    });

router.route('/questions/:id/favorite')
// favorite a question with a given id
    .get((req, res)=> {
        Controllers.Question.favorite(req.params.id).then((questionData) => {
            console.log(JSON.stringify(questionData));
        // res.render('questions-single', questionData);
        res.redirect('/questions/'+req.params.id);
    });
    });

// REGISTER OUR ROUTES -------------------------------
app.use('/', router);

// serve static content
app.use(express.static(path.join(__dirname, 'public')));

// START THE SERVER
// =============================================================================
app.listen(port);
