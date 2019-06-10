const express = require('express');
let router = express.Router();
const middlewares = require('../middleware/middlewares.js');
const Controllers = require('../controllers/controllers.js');
const soleConfig  = require('../sole-config.js');

/**
 * ====================================
 * default routes
 * ====================================
 */

/**
 * root route (heh, heh)
 */
router.route('/')
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      const profileIsCompleted = await Controllers.User.isProfileComplete(req.sessionToken);
      res.redirect(profileIsCompleted ? '/home' : '/complete-profile');
    } catch(err) {
      err.userMessage = 'Failed to check if users profile is complete';
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/home')
  .get(middlewares.isAuth, middlewares.setLanguage, async (req, res, next) => {
    soleConfig.language = req.language;
    try {
      const roleData = await Controllers.User.getRoleData(req.sessionToken);
      let homeData = {
        soles: [],
        questions: [],
        roleData: roleData,
        config: soleConfig,
      };

      if (roleData.isRingleader) {
        return Controllers.User.getMyRings(req.sessionToken).then(rings => {
          homeData.rings = rings;
          res.render('home', homeData); //show home page with ring data
        }).catch(err => {
          err.userMessage = 'Failed to ring data for user.';
          err.postToSlack = true;
          next(err);
        });
      } else {
        res.render('home', homeData); //show home page but no ring data
      }
    } catch (err) {
      err.userMessage = 'Failed to role data for user.';
      err.postToSlack = true;
      next(err);
    }
  });

// static route for History of SOLE
router.route('/history')
  .get((req, res, next) => {
    res.render('page-history', {config: soleConfig});
  });

// static route for History of SOLE
router.route('/how')
  .get((req, res, next) => {
    res.render('page-how-to-sole', {config: soleConfig});
  });

// static route for ToS
router.route('/terms-of-use')
  .get((req, res, next) => {
    res.render('page-terms-of-use', {layout: 'no-sidebar.hbs', config: soleConfig});
  });

// static route for privacy
router.route('/privacy')
  .get((req, res, next) => {
    res.render('page-privacy', {layout: 'no-sidebar.hbs', config: soleConfig});
  });

// static route for email verification success
router.route('/verify-email-success')
  .get((req, res, next) => {
    const email = req.query.email; //TODO: check if email exists
    res.render('verify-email-success', {layout: 'no-sidebar.hbs', config: soleConfig, email: email});
  });

// static route for email verification failure
router.route('/verify-email-failure')
  .get((req, res, next) => {
    const email = req.query.email; //TODO: check if email exists
    res.render('verify-email-failure', {layout: 'no-sidebar.hbs', config: soleConfig, email: email});
  });

// routes for resources
router.route('/resources')
  .get(async (req, res, next) => {
    try {
      const resources = await Controllers.Resource.getAll();
      res.render('page-resources', {
        resources: resources,
        config: soleConfig
      });
    } catch (err) {
      err.userMessage = 'Error getting resources.';
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/profile')
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      const profileData = await Controllers.User.getProfileData(req.sessionToken);
      profileData.config = soleConfig;
      res.render('profile', profileData);
    } catch (err) {
      err.userMessage = 'Error getting profile data.';
      err.postToSlack = true;
      next(err);
    }
  })
  //TODO: this is a mess, come back to this to make it more consistent with the rest of the app
  .post(middlewares.isAuth, async (req, res, next) => {
    try {
      const user = await Controllers.User.updateProfileData(req.body.subjects || false,
        req.body.grades || false,
        req.body.role || false,
        req.body.firstName || false,
        req.body.lastName || false,
        false,
        false,
        false,
        false,
        req.sessionToken);
        res.redirect('/soles');
    } catch (err) {
      err.userMessage = 'Error updating user profile.';
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/profile/manage-emails')
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      const subscriptions = await Controllers.User.getEmailSubscriptions(req.sessionToken);
      res.render('partials/profile/profile-card-manage-emails', {
          layout: 'default.hbs',
          subscriptions: subscriptions
        });
    } catch (err) {
      err.userMessage = 'Error getting profile manage email data.';
      err.postToSlack = true;
      next(err);
    }
  })
  .post(middlewares.isAuth, async (req, res, next) => {
    try {
      const subscriptions = {
        ceuDoc: req.body.ceuDoc === "on",
        questionTips: req.body.questionTips === "on",
        planningDoc: req.body.planningDoc === "on",
        summaryDoc: req.body.summaryDoc === "on",
        reflectionReminders: req.body.reflectionReminders === "on"
      };
      await Controllers.User.setEmailSubscriptions(req.sessionToken, subscriptions);
      res.redirect('/profile');
    } catch (err) {
      err.userMessage = 'Error updating email notifications.';
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/complete-profile')
  /**
   *
   * if there's a first name and last name in the query param, prepopulate it with those values
   * if not, put in the first name and last name stored in the user profile (empty if undefined)
   *
   */
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      let profileData = await Controllers.User.getProfileData(req.sessionToken);
      profileData.user.firstName = req.query.firstname ? req.query.firstname: undefined;
      profileData.user.lastName = req.query.lastname ? req.query.lastname: undefined;
      soleConfig.ring = req.query.ring ? req.query.ring: undefined;
      if (soleConfig.ring === 'Colombia') {
        soleConfig.colombia = true;
        req.setLocale('es');
      } else {
        soleConfig.colombia = false;
      }
      soleConfig.language = req.language;
      res.render('complete-profile', {
        layout: 'no-sidebar.hbs',
        profile: profileData,
        config: soleConfig
      });
    } catch (err) {
      err.userMessage = 'Error getting user profile data.';
      err.postToSlack = true;
      next(err);
    }
  })
  //TODO: test that this still works
  .post(middlewares.isAuth, async (req, res, next) => {
    try {
      const user = await Controllers.User.updateProfileData(
        req.body.subjects,
        req.body.grades,
        req.body.role,
        req.body.firstName,
        req.body.lastName,
        req.body.schoolName,
        req.body.schoolAddress,
        req.body.schoolPlaceID,
        'jur.' + req.body.schoolState.toLowerCase(), //need to add 'jur.' to the string and lowercase it to make it work with the database
        req.sessionToken);

      Controllers.User.completedProfile(req.sessionToken);
      res.redirect('/home');
    } catch (err) {
      err.userMessage = 'Error completing user profile.';
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/soles')
//get all the soles
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      const soles = await Controllers.Sole.getAll(req.sessionToken);
      soles.config = soleConfig;
      res.render('soles', soles);
    } catch (err) {
      err.userMessage = 'Could not get list of SOLEs.';
      err.postToSlack = true;
      next(err);
    }
  });
router.route('/soles/plan')
//view for adding a new sole
  .get(middlewares.isAuth, async (req, res, next) => {
    //TODO: it's strange that this uses req.query.question instead of :id in the URL. Come back to this later. -DW 2019-05-10
    const question = req.query.question; //get the ID of desired question from the query param //TODO: check if this variable exists, could fail if not defined
    let viewData = {
      config: soleConfig,
      sole: {}
    };
    //if a question is present get it and attach to viewData as part of a SOLE
    if (question) {
      try {
        const questionData = await Controllers.Question.getByID(question, req.sessionToken);
        viewData.sole.question = questionData;
        res.render('soles-plan', viewData);
      } catch(err) {
        err.userMessage = 'Could not load question with id: ' + question;
        err.postToSlack = true;
        next(err);
      }
    } else {
      res.render('soles-plan', viewData);
    }
  })
  .post(middlewares.isAuth, async (req, res, next) => {
    //push observations into this array if any are set to 'on'
    //TODO: all this req.body stuff is risky because if they're not present the app could fail
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

    try {
      const soleId = await Controllers.Sole.add(sole, req.sessionToken);
      res.redirect('/soles');
    } catch (err) {
      err.userMessage = 'Could not save SOLE session.';
      err.postToSlack = true;
      next(err);
    }
  });
router.route('/soles/:id')
  //get the sole with that id
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      const singleSole = await Controllers.Sole.getByID(req.params.id, req.sessionToken);
      singleSole.config = soleConfig;
      res.render('soles-single', singleSole);
    } catch(err) {
      err.userMessage = 'Could not get SOLE. SOLE id: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/soles/:id/download-plan')
  //get the sole with that id
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      const id = req.params.id;
      const type = 'plan';
      const url = await Controllers.Sole.downloadDocument(id, type, req.sessionToken)
      res.redirect(soleConfig.baseURL+url);
    } catch (err) {
      err.userMessage = 'Failed to download lesson plan. SOLE id: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/soles/:id/download-summary')
//get the sole with that id
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      const id = req.params.id;//TODO: check if this exists
      const type = 'summary';
      const url = await Controllers.Sole.downloadDocument(id, type, req.sessionToken);
      res.redirect(soleConfig.baseURL+url);
    } catch (err) {
      err.userMessage = 'Failed to download summary. SOLE id: ' + req.params.id; //TODO: check if req.param.id exists
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/soles/:id/copy')
  .get(middlewares.isAuth, async (req,res) => {
    try {
      const soleId = await Controllers.Sole.copy(req.params.id, req.sessionToken);
      res.redirect('/soles');
    } catch (err) {
      err.userMessage = 'Failed to copy SOLE. SOLE id: ' + req.params.id; //TODO: check if req.param.id exists
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/soles/:id/plan')
//get the sole with that id
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      let singleSole = await Controllers.Sole.getByID(req.params.id, req.sessionToken);
      singleSole.config = soleConfig;
      res.render('soles-plan', singleSole);
    } catch (err) {
      err.userMessage = 'Failed to get SOLE session from the server.';
      err.postToSlack = true;
      next(err);
    }
  })
  .post(middlewares.isAuth, async (req, res, next) => {
    //TODO: make this reusable for copying
    try {
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

      //TODO: check if these req.body variables exist, could fail if they don't
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
      const soleId = await Controllers.Sole.update(id, sole, req.sessionToken);
      res.redirect('/soles');
    } catch (err) {
      err.userMessage = 'Could not save SOLE. SOLE id: ' + id;
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/soles/:id/delete')
//get the sole with that id
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      let singleSole = await Controllers.Sole.getByID(req.params.id, req.sessionToken);
      singleSole.config = soleConfig;
      res.render('soles-delete', singleSole);
    } catch (err) {
      err.userMessage = 'Could not delete SOLE session from the server. SOLE id: ' + req.param.id;
      err.postToSlack = true;
      next(err);
    }
  })
  .post(middlewares.isAuth, async (req, res, next) => {
    try {
      const soleId = await Controllers.Sole.delete(req.body.soleID, req.sessionToken);
      res.redirect('/soles');
    } catch (err) {
      err.userMessage = 'Could not delete SOLE. SOLE id: ' + req.body.soleID;
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/soles/:id/reflect')
//get the sole with that id
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      let singleSole = await Controllers.Sole.getByID(req.params.id, req.sessionToken)
      singleSole.config = soleConfig;
      res.render('soles-reflect', singleSole);
    } catch (err) {
      err.userMessage = 'Could not get SOLE session from the server. SOLE id: ' + req.param.id;
      err.postToSlack = true;
      next(err);
    }
  })
  .post(middlewares.isAuth, async (req, res, next) => {
    try {
      const reflection = {
        id: req.params.id,
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

      const soleId = await Controllers.Sole.saveReflection(reflection, req.sessionToken)
      res.redirect('/soles/'+soleId);
    } catch (err) {
      err.userMessage = 'Could not save reflection. SOLE id: ' + req.body.soleId; //TODO: check if this variable exists, could fail if not defined
      err.postToSlack = true;
      next(err);
    }
  });

//TODO: refactor. this is messy. UPDATE 2019-05-10 Still messy. -DW
router.route('/questions')
//get all the questions
  .get(middlewares.isAuth, async (req, res, next) => {
    if (req.query.q) { //TODO: might be a better way to check if this exists
      try {
        let foundQuestions = await Controllers.Question.findByText(req.query.q, req.sessionToken);
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
      res.render('questions', {config:soleConfig});
    }
  });

//TODO: this is messy af. refactor. UPDATE 2019-05-10: still messy. Getting better tho. -DW
router.route('/questions/mine')
  .get(middlewares.isAuth, async (req,  res) => {
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
router.route('/questions/new')
  .get(middlewares.isAuth, (req, res, next) => { //doesn't need to be async because this view doesn't require any data or Parse calls
    res.render('questions-add', {config: soleConfig});
  })
  .post(middlewares.isAuth, async (req, res, next) => {
    let tags = req.body.tags.split(','); //TODO: check if defined, could fail if not defined
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
router.route('/questions/:id')
//get the question data with a given id
  .get(middlewares.isAuth, async (req, res, next) => {
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


router.route('/questions/:id/favorite')
//favorite a question with a given id
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      const questionData = await Controllers.Question.favorite(req.params.id, req.sessionToken);
      res.redirect('/questions/'+req.params.id+'?fav=true'); //TODO: check if defined, could fail if not defined
    } catch (err) {
      err.userMessage = 'Could not favorite this question. Question id: ' + req.params.id; //TODO: check if defined, could fail if not defined
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/questions/:id/delete-tag/:rdn')
//remove a tag from a question
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      const questionData = await Controllers.Question.deleteTag(req.params.id, req.params.rdn, req.sessionToken); //TODO: check if defined, could fail if not defined
      res.redirect('/questions/' + req.params.id); //TODO: check if defined, could fail if not defined
    } catch (err) {
      err.userMessage = 'Could not delete a tag. Question id: ' + req.params.id + ' and tag id: ' + req.params.rdn; //TODO: check if defined, could fail if not defined
      err.postToSlack = true;
      next(err);
    }
  });


router.route('/questions/:id/approve')
//approve a single question
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      const questionData = await Controllers.Question.approve(req.params.id, req.sessionToken); //TODO: check if defined, could fail if not defined
      res.redirect('/dashboard/question-approval');
    } catch (err) {
      err.userMessage = 'Could not approve a question with id: ' + req.params.id; //TODO: check if defined, could fail if not defined
      err.postToSlack = true;
      next(err);
    }
  });

// reject a single question
router.route('/questions/:id/reject')
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      const questionData = await Controllers.Question.reject(req.params.id, req.sessionToken); //TODO: check if defined, could fail if not defined
      res.redirect('/dashboard/question-approval');
    } catch (err) {
      err.userMessage = 'Could not reject a question.';
      err.postToSlack = true;
      next(err);
    }
  });

// approve a single SOLE
router.route('/soles/:id/approve')
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      const soleData = await Controllers.Sole.approve(req.params.id, req.sessionToken);
      res.redirect('/dashboard/sole-approval');
    } catch (err) {
      err.userMessage = 'Could not approve a SOLE with id: ' + req.params.id; //TODO: check if defined, could fail if not defined
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/soles/:id/reject')
// reject a single SOLE
  .get(middlewares.isAuth, async (req, res, next) => {
    try {
      const soleData = await Controllers.Sole.reject(req.params.id, req.sessionToken);
      res.redirect('/dashboard/sole-approval');
    } catch (err) {
      err.userMessage = 'Could not reject a SOLE with id: ' + req.params.id; //TODO: check if defined, could fail if not defined
      err.postToSlack = true;
      next(err);
    }
  });



// static route for fail cases (404)
//TODO: this might be able to be handled with next() and middlewares
router.route('/error')
  .get((req, res, next) => {
    res.render('fail', {
      layout: 'no-sidebar.hbs',
      config: soleConfig
    });
  });

module.exports = router;