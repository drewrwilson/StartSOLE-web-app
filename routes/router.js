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
  .get(middlewares.isAuth, (req, res, next) => {
    Controllers.User.isProfileComplete(req.sessionToken).then(profileIsCompleted => {
      res.redirect(profileIsCompleted ? '/home' : '/complete-profile');
    }).catch(err => {
      err.userMessage = 'Failed to check if users profile is complete';
      err.postToSlack = true;

      next(err);
    });
  });

router.route('/home')
  .get(middlewares.isAuth, (req, res, next) => {
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
          res.render('home', homeData); //show home page with ring data
        }).catch(err => {
          err.userMessage = 'Failed to ring data for user.';
          err.postToSlack = true;
          next(err);
        });
      } else {
        res.render('home', homeData); //show home page but no ring data
      }
    }).catch(err => {
      err.userMessage = 'Failed to role data for user.';
      err.postToSlack = true;
      next(err);
    });
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
    const email = req.query.email;
    res.render('verify-email-success', {layout: 'no-sidebar.hbs', config: soleConfig, email: email});
  });

// static route for email verification failure
router.route('/verify-email-failure')
  .get((req, res, next) => {
    const email = req.query.email;
    res.render('verify-email-failure', {layout: 'no-sidebar.hbs', config: soleConfig, email: email});
  });

// routes for resources
router.route('/resources')
  .get((req, res, next) => {
    Controllers.Resource.getAll().then(resources => {
      res.render('page-resources', {
        resources: resources,
        config: soleConfig
      });
    }).catch(err => {
      err.userMessage = 'Error getting resources.';
      err.postToSlack = true;
      next(err);
    });
  });

router.route('/profile')
  .get(middlewares.isAuth, (req, res, next) => {
    Controllers.User.getProfileData(req.sessionToken)
      .then(profileData => {
        profileData.config = soleConfig;
        res.render('profile', profileData);
      }).catch(err => {
      err.userMessage = 'Error getting profile data.';
      err.postToSlack = true;
      next(err);
    });
  })
  //TODO: this is a mess, come back to this to make it more consistent with the rest of the app
  .post(middlewares.isAuth, (req, res, next) => {
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


// route for completing profile
//TODO: there are lots of possible fail scenarios here. eg if profileData.user is undefined. Or if req.query.firstname is undefined
router.route('/complete-profile')
  .get(middlewares.isAuth, (req, res, next) => {
    Controllers.User.getProfileData(req.sessionToken).then(profileData => {
      if (profileData.user.firstName && profileData.user.lastName) {
        console.log('um, hi. whats this all about?');
      } else {
        profileData.user.firstName = req.query.firstname;
        profileData.user.lastName = req.query.lastname;
      }
      soleConfig.language = req.language;
      res.render('complete-profile', {
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
  .post(middlewares.isAuth, (req, res, next) =>{
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

router.route('/soles')
//get all the soles
  .get(middlewares.isAuth, (req, res, next) => {
    Controllers.Sole.getAll(req.sessionToken)
      .then(soles=>{
        soles.config = soleConfig;
        res.render('soles', soles);
      }).catch(err => {
      err.userMessage = 'Could not get list of SOLEs.';
      err.postToSlack = true;
      next(err);
    });
  });


router.route('/soles/:id')
//get the sole with that id
  .get(middlewares.isAuth, (req, res, next) => {
    Controllers.Sole.getByID(req.params.id, req.sessionToken).then(singleSole => {
      //in case the id of the sole is invalid
      singleSole.config = soleConfig;
      res.render('soles-single', singleSole);
    }).catch(err => {
      err.userMessage = 'Could not get SOLE. SOLE id: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    });
  });

router.route('/soles/:id/download-plan')
//get the sole with that id
  .get(middlewares.isAuth, (req, res, next) => {
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

router.route('/soles/:id/download-summary')
//get the sole with that id
  .get(middlewares.isAuth, (req, res, next) => {
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

router.route('/soles/:id/copy')
  .get(middlewares.isAuth, (req,res) => {
    Controllers.Sole.copy(req.params.id, req.sessionToken).then(soleID => {
      res.redirect('/soles');
    }).catch(err => {
      err.userMessage = 'Failed to copy SOLE. SOLE id: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    });
  });

router.route('/soles/:id/edit')
//get the sole with that id
  .get(middlewares.isAuth, (req, res, next) => {
    Controllers.Sole.getByID(req.params.id, req.sessionToken).then(singleSole => {
      singleSole.config = soleConfig;
      res.render('soles-add', singleSole);
    }).catch(err => {
      err.userMessage = 'Failed to get SOLE session from the server.';
      err.postToSlack = true;
      next(err);
    });
  })
  .post(middlewares.isAuth, (req, res, next) => {
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

router.route('/soles/:id/delete')
//get the sole with that id
  .get(middlewares.isAuth, (req, res, next) => {
    Controllers.Sole.getByID(req.params.id, req.sessionToken).then(singleSole => {
      singleSole.config = soleConfig;
      res.render('soles-delete', singleSole);
    }).catch(err => {
      err.userMessage = 'Could not delete SOLE session from the server. SOLE id: ' + req.param.id;
      err.postToSlack = true;
      next(err);
    });
  })
  .post(middlewares.isAuth, (req, res, next) => {
    Controllers.Sole.delete(req.body.soleID, req.sessionToken).then(soleID => {
      res.redirect('/soles');
    }).catch(err => {
      err.userMessage = 'Could not delete SOLE. SOLE id: ' + req.body.soleID;
      err.postToSlack = true;
      next(err);
    });
  });

router.route('/soles/:id/reflect')
//get the sole with that id
  .get(middlewares.isAuth, (req, res, next) => {
    Controllers.Sole.getByID(req.params.id, req.sessionToken).then(singleSole => {
      singleSole.config = soleConfig;
      res.render('soles-reflect', singleSole);
    }).catch(err => {
      err.userMessage = 'Could not get SOLE session from the server. SOLE id: ' + req.param.id;
      err.postToSlack = true;
      next(err);
    });
  });

router.route('/sole-reflect')
  .post(middlewares.isAuth, (req, res, next) =>{
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

router.route('/sole-create')
//view for adding a new sole
  .get(middlewares.isAuth, (req, res, next) => {
    const question = req.query.question; //get the ID of desired question from the query param
    viewData = {
      config: soleConfig,
      sole: {}
    };
    //if a question is present get it and attach to viewData as part of a SOLE
    if (question) {
      Controllers.Question.getByID(question, req.sessionToken).then((questionData) => {
        viewData.sole.question = questionData;
        res.render('soles-add',viewData);
      }).catch(err => {
        err.userMessage = 'Could not load question with id: ' + question;
        err.postToSlack = true;
        next(err);
      });
    } else {
      res.render('soles-add', viewData);
    }
  })
  .post(middlewares.isAuth, (req, res, next) =>{
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

//TODO: refactor. this is messy.
router.route('/questions')
//get all the questions
  .get(middlewares.isAuth, (req, res, next) => {
    if (req.query.q) {
      Controllers.Question.findByText(req.query.q, req.sessionToken).then((foundQuestions) => {
        foundQuestions.config = soleConfig;
        res.render('questions', foundQuestions);
      }).catch(err => {
        err.userMessage = 'Could not find questions by text search. Search text: ' + req.query.q;
        err.postToSlack = true;
        next(err);
      });
    } else if (req.query.tags) {
      Controllers.Question.findByTags(req.query.tags, req.sessionToken).then((foundQuestions) => {
        //TODO: probably need to do some processing on tags to convert it from a string to an array of tags
        foundQuestions.config = soleConfig;
        res.render('questions', foundQuestions);
      }).catch(err => {
        err.userMessage = 'Could not find question by tags. Search tags: ' + req.query.tags;
        err.postToSlack = true;
        next(err);
      });
    } else {
      res.render('questions', {config:soleConfig});
    }
  });

//TODO: this is messy af. refactor
router.route('/questions/mine')
  .get(middlewares.isAuth, (req,  res) => {
    const fav = req.query.fav; //optional query parameter to set fav tab as active
    let myQuestionsData = {soles: [], questions:[], fav: fav};
    Controllers.Question.getAll(req.sessionToken).then(questions => {
      myQuestionsData.questions.mine = questions.questions;
      Controllers.Question.getFavorites(req.sessionToken).then((favoriteQuestions) =>{
        myQuestionsData.questions.favorites = favoriteQuestions;
        myQuestionsData.config = soleConfig;
        res.render('questions-mine', myQuestionsData); //display view with question data
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
  .get(middlewares.isAuth, (req, res, next) => {
    res.render('questions-add', {config: soleConfig});
  })
  .post(middlewares.isAuth, (req, res, next) => {
    let tags = req.body.tags.split(',');
    const newQuestion = {
      text: req.body.text,
      source: req.body.source,
      tags: tags
    };
    Controllers.Question.add(newQuestion.text, newQuestion.tags, newQuestion.source, req.sessionToken).then(questionID=>{
      res.redirect('/questions/'+questionID);
    }).catch(err => {
      err.userMessage = 'Could not add question.';
      err.postToSlack = true;
      next(err);
    });
  });
router.route('/questions/:id')
//get the question data with a given id
  .get(middlewares.isAuth, (req, res, next) => {
    const favorited = req.query.fav; //is true if question was just favorited
    Controllers.Question.getByID(req.params.id, req.sessionToken).then(questionData => {
      questionData.favorited = favorited;
      questionData.config = soleConfig;
      questionData.question.favorited = true;
      Controllers.User.getRoleData(req.sessionToken).then(roleData => {
        questionData.roleData = roleData;
        res.render('questions-single', questionData);
      }).catch(err => {
        err.userMessage = 'Could not get role data.';
        err.postToSlack = true;
        next(err);
      });
    }).catch(err => {
      err.userMessage = 'Could not find SOLE question. Question id: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    });
  });


router.route('/questions/:id/favorite')
//favorite a question with a given id
  .get(middlewares.isAuth, (req, res, next) => {
    Controllers.Question.favorite(req.params.id, req.sessionToken).then(questionData => {
      res.redirect('/questions/'+req.params.id+'?fav=true');
    }).catch(err => {
      err.userMessage = 'Could not favorite this question. Question id: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    });
  });

router.route('/questions/:id/delete-tag/:rdn')
//remove a tag from a question
  .get(middlewares.isAuth, (req, res, next) => {
    Controllers.Question.deleteTag(req.params.id, req.params.rdn, req.sessionToken).then((questionData) => {
      res.redirect('/questions/' + req.params.id);
    }).catch(err => {
      err.userMessage = 'Could not delete a tag. Question id: ' + req.params.id + ' and tag id: ' + req.params.rdn;
      err.postToSlack = true;
      next(err);
    });
  });


router.route('/questions/:id/approve')
//approve a single question
  .get(middlewares.isAuth, (req, res, next) => {
    Controllers.Question.approve(req.params.id, req.sessionToken).then(questionData => {
      res.redirect('/dashboard/question-approval');
    }).catch(err => {
      err.userMessage = 'Could not approve a question with id: ' + req.params.id;
      err.postToSlack = true;
      next(err);
    });
  });

// reject a single question
router.route('/questions/:id/reject')
  .get(middlewares.isAuth, (req, res, next) => {
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
  .get(middlewares.isAuth, (req, res, next) => {
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
  .get(middlewares.isAuth, (req, res, next) => {
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
  .get((req, res, next) => {
    res.render('/fail', {
      layout: 'no-sidebar.hbs',
      config: soleConfig
    });
  });

/**
 * route for browsing all SOLEs, regardless of user
 */
router.route('/admin/browse-soles')
  .get(middlewares.isAuth, (req, res, next) => {
    Controllers.User.getRoleData(req.sessionToken).then(roleData => {
      if(!roleData.isAdmin) {
        res.redirect('/home');
      } else {
        res.render('admin/admin-browse-soles', {
          config: soleConfig,
          roleData: roleData
        });
      }
    }).catch(err => {
      err.userMessage = 'Error getting role data for admin user.';
      next(err);
    });
  });

/**
 * route for browsing all users
 */
router.route('/admin/browse-users')
  .get(middlewares.isAuth, (req, res, next) => {
    Controllers.User.getRoleData(req.sessionToken).then(roleData => {
      if(!roleData.isAdmin){
        res.redirect('/home');
      } else {
        res.render('admin/admin-browse-users', {
          config: soleConfig,
          roleData: roleData
        });
      }
    }).catch(err => {
      err.userMessage = 'Error getting role data for admin user.';
      next(err);
    });
  });

/**
 * route for browsing upcoming conferences and events.
 */
router.route('/admin/events')
  .get(middlewares.isAuth, (req, res, next) => {
    Controllers.User.getRoleData(req.sessionToken).then(roleData => {
      if(roleData.isAdmin || roleData.isAmbassador) { //TODO: replace with middleware later
        res.render('admin/admin-conferences-and-events');
      } else {
        res.render('admin/admin-conferences-and-events', {
          config: soleConfig,
          roleData: roleData
        });
      }
    }).catch(err => {
      err.userMessage = 'Error getting role data for admin user.';
      next(err);
    });
  });

module.exports = router;