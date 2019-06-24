const express     = require('express'),
      middlewares = require('../middleware/middlewares.js'),
      Controllers = require('../controllers/controllers.js'),
      soleConfig  = require('../sole-config.js'),
      router      = express.Router();

router.use(middlewares.isAuth);

/**
 * ====================================
 * soles routes
 * ====================================
 */

router.route('/')
//get all the soles
  .get(async (req, res, next) => {
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
router.route('/plan')
//view for adding a new sole
  .get(async (req, res, next) => {
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
  .post(async (req, res, next) => {
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
router.route('/:id')
  //get the sole with that id
  .get(async (req, res, next) => {
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

router.route('/:id/download-plan')
  //get the sole with that id
  .get(async (req, res, next) => {
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

router.route('/:id/download-summary')
//get the sole with that id
  .get(async (req, res, next) => {
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

router.route('/:id/copy')
  .get(async (req,res) => {
    try {
      const soleId = await Controllers.Sole.copy(req.params.id, req.sessionToken);
      res.redirect('/soles');
    } catch (err) {
      err.userMessage = 'Failed to copy SOLE. SOLE id: ' + req.params.id; //TODO: check if req.param.id exists
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/:id/plan')
//get the sole with that id
  .get(async (req, res, next) => {
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
  .post(async (req, res, next) => {
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
      const soleId = await Controllers.Sole.update(req.body.sole_id, sole, req.sessionToken);
      res.redirect('/soles');
    } catch (err) {
      err.userMessage = 'Could not save SOLE. SOLE id: ' + id;
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/:id/delete')
  .get(async (req, res, next) => {
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
  .post(async (req, res, next) => {
    try {
      const soleId = await Controllers.Sole.delete(req.body.soleID, req.sessionToken);
      res.redirect('/soles');
    } catch (err) {
      err.userMessage = 'Could not delete SOLE. SOLE id: ' + req.body.soleID;
      err.postToSlack = true;
      next(err);
    }
  });

router.route('/:id/reflect')
  .get(async (req, res, next) => {
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
  .post(async (req, res, next) => {
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

      const soleId = await Controllers.Sole.saveReflection(reflection, req.sessionToken);
      res.redirect('/soles/' + soleId);
    } catch (err) {
      err.userMessage = 'Could not save reflection. SOLE id: ' + req.body.soleId; //TODO: check if this variable exists, could fail if not defined
      err.postToSlack = true;
      next(err);
    }
  });


module.exports = router;