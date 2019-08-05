const express     = require('express'),
      middlewares = require('../middleware/middlewares.js'),
      Controllers = require('../controllers/controllers.js'),
      soleConfig  = require('../sole-config.js'),
      router      = express.Router();

router.use(middlewares.isAuth);

/**
 * ====================================
 * default routes
 * ====================================
 */

//TODO: refactor. this is messy. UPDATE 2019-05-10 Still messy. -DW
router.route('/')
//get all the questions
  .get(async (req, res, next) => {
    const rings = await Controllers.User.getMyRings(req.sessionToken);

    let isPA = false;
    rings.forEach(ring => {
      if (ring.rdn === 'us.pa') {
       isPA = true;
      }
    });

    if (req.query.q) { //TODO: might be a better way to check if this exists
      try {
        const foundQuestions = await Controllers.Question.findByText(req.query.q, req.sessionToken);
        foundQuestions.config = soleConfig;
        res.render('questions', foundQuestions);
      } catch (err) {
        err.userMessage = 'Could not find questions by text search. Search text: ' + req.query.q;
        err.postToSlack = true;
        next(err);
      }
    } else if (req.query.tags) { //TODO: check if this variable exists, possible fail if it isnt defined
      try {
        let foundQuestions = await Controllers.Question.findByTags(req.query.tags, req.sessionToken);
        //TODO: probably need to do some processing on tags to convert it from a string to an array of tags
        foundQuestions.config = soleConfig;
        res.render('questions', foundQuestions);
      } catch (err) {
        err.userMessage = 'Could not find question by tags. Search tags: ' + req.query.tags; //TODO: check if defined
        err.postToSlack = true;
        next(err);
      }
    } else {
      res.render('questions', {
        config: soleConfig,
        isPA: isPA
      });
    }
  });

//TODO: this is messy af. refactor. UPDATE 2019-05-10: still messy. Getting better tho. -DW
router.route('/mine')
  .get(async (req,  res) => {
    const fav = req.query.fav; //optional query parameter to set fav tab as active //TODO: check if defined
    let myQuestionsData = {soles: [], questions:[], fav: fav};
    try {
      const questions = await Controllers.Question.getAll(req.sessionToken);
      myQuestionsData.questions.mine = questions.questions;//TODO: WTF, DREW! WHAT. THE. FUCK! QUESTIONS.QUESTIONS?? WTF.WTF 2019-05-10 -DW
      const favoriteQuestions = await Controllers.Question.getFavorites(req.sessionToken);
      try {
        myQuestionsData.questions.favorites = favoriteQuestions;
        myQuestionsData.config = soleConfig;
        res.render('questions-mine', myQuestionsData); //display view with question data
      } catch (err) {
        err.userMessage = 'Could not get your favorited questions.';
        err.postToSlack = true;
        next(err);
      }
    } catch (err) {
      err.userMessage = 'Could not get list of questions.';
      err.postToSlack = true;
      next(err);
    }
  });

//add a question
router.route('/new')
  .get((req, res, next) => { //doesn't need to be async because this view doesn't require any data or Parse calls
    res.render('questions-add', {config: soleConfig});
  })
  .post(async (req, res, next) => {
    const tags = req.body.tags.split(','); //TODO: check if defined, could fail if not defined
    const newQuestion = {
      text: req.body.text, //TODO: check if defined, could fail if not defined
      source: req.body.source, //TODO: check if defined, could fail if not defined
      tags: tags
    };
    try {
      const questionID = await Controllers.Question.add(newQuestion.text, newQuestion.tags, newQuestion.source, req.sessionToken);
      res.redirect('/questions/' + questionID);
    } catch (err) {
      err.userMessage = 'Could not add question.';
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/:id')
//get the question data with a given id
  .get(async (req, res, next) => {
    try {
      let questionData = await Controllers.Question.getByID(req.params.id, req.sessionToken);
      questionData.favorited = req.query.fav; //is true if question was just favorited //TODO: check if defined, could fail if not defined
      questionData.config = soleConfig;
      questionData.question.favorited = true;
      const roleData = await Controllers.User.getRoleData(req.sessionToken); //TODO: check if defined, could fail if not defined
      try {
        questionData.roleData = roleData;
        res.render('questions-single', questionData);
      } catch (err) {
        err.userMessage = 'Could not get role data.';
        err.postToSlack = true;
        next(err);
      }
    } catch (err) {
      err.userMessage = 'Could not find SOLE question. Question id: ' + req.params.id; //TODO: check if defined, could fail if not defined
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/:id/favorite')
//favorite a question with a given id
  .get(async (req, res, next) => {
    try {
      const questionData = await Controllers.Question.favorite(req.params.id, req.sessionToken);
      res.redirect('/questions/'+req.params.id+'?fav=true'); //TODO: check if defined, could fail if not defined
    } catch (err) {
      err.userMessage = 'Could not favorite this question. Question id: ' + req.params.id; //TODO: check if defined, could fail if not defined
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/:id/delete-tag/:rdn')
//remove a tag from a question
  .get(async (req, res, next) => {
    try {
      const questionData = await Controllers.Question.deleteTag(req.params.id, req.params.rdn, req.sessionToken); //TODO: check if defined, could fail if not defined
      res.redirect('/questions/' + req.params.id); //TODO: check if defined, could fail if not defined
    } catch (err) {
      err.userMessage = 'Could not delete a tag. Question id: ' + req.params.id + ' and tag id: ' + req.params.rdn; //TODO: check if defined, could fail if not defined
      err.postToSlack = true;
      next(err);
    }
  });

module.exports = router;