var Sole = module.exports = {};
var Parse       =  require('parse/node');
var soleConfig = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

//returns data for a question with a given ID
Sole.getByID = function (id, sessionToken) {
  console.log('git to getByID');
  console.log('id', id);
  console.log('sessionToken', sessionToken);
  return Parse.Cloud.run('webapp.getSoleByID', {
    id: id,
    sessionToken: sessionToken
  })
}

// returns an array of recent approved soles. defaults to limit 10.
// optional: limit is the number of soles to return
Sole.getAll = function (sessionToken) {
  return Parse.Cloud.run('webapp.getAllMySoles', {
    offset: 0,
    limit: 100,
		sessionToken: sessionToken
	})
}

// upload a sole and save it to the database.
Sole.add = function (sole, sessionToken) {
  return Parse.Cloud.run('webapp.addSole', {
      sole: sole,
      sessionToken: sessionToken
	})
}

// upload a sole and save it to the database.
Sole.update = function (id, sole, sessionToken) {
    return Parse.Cloud.run('webapp.updateSole', {
        id: id,
        sole: sole,
        sessionToken: sessionToken
    })
}

// upload a sole and save it to the database.
Sole.saveReflection = function (reflection, sessionToken) {
    console.log("Now we are in saveReflection with SOLE: ",reflection.id)
    return Parse.Cloud.run('webapp.completeReflection', {
        sole: reflection,
        sessionToken: sessionToken
    })
}

Sole.downloadDocument = function (id, type, sessionToken) {
    return Parse.Cloud.run('webapp.getDownloadLink', {
        id: id,
        type: type,
        sessionToken: sessionToken
    })
}

// delete a sole and return true if done, null if not
Sole.delete = function (id, sessionToken) {
    return Parse.Cloud.run('webapp.deleteSole', {
        id: id,
        sessionToken: sessionToken
    })
}

Sole.copy = function (id, sessionToken) {
  return Parse.Cloud.run('webapp.getSoleByID', {
    id: id,
    sessionToken: sessionToken
  })
  .then(sole=>{
    //process newSole so it fits with addSole. data shimming or whatever
    sole = sole.sole; // DRRRREEEWWWW! WTF MAN! DON'T DO THIS! -DW 2018-07-19
    console.log('how it is: sole.planned_date.dateString: ', sole.planned_date.dateString);
    console.log('how it is: sole.planned_date.dateString: ', sole.planned_date.dateString);
    // "MMM D, YYYY hh:mm A"

    let newSole = {
      //values from the frontend
      question: sole.question.question.text,
      subject: sole.subject,
      grade: sole.grade,
      class_label: sole.tag, //optional
      planned_date: sole.planned_date.month_text + " " + sole.planned_date.day + ", " + sole.planned_date.year, //check this out
      // planned_time: sole.planned_date.hour + ':'+ sole.planned_date.minute + , //make the AM/PM capitalized
      planned_time: sole.planned_date.timeString.toUpperCase(),
      planned_duration: sole.planned_duration,
      num_groups: sole.num_groups,
      target_observations: [],
      grouporganization: sole.grouporganization,
      groupsharing: sole.groupsharing,
      self_assessment: sole.self_assessment,
      useapp: false, //this wasn't in the getter, hardcoding for now -DW 2018-07-19
      materials: [],
      num_students: sole.num_students,
      num_devices: sole.num_devices,
      content_objective: sole.content_objective.value
    }

  sole.target_observations.forEach(function(observation){
    if(observation.checked){
      newSole.target_observations.push("session.observation."+observation.nameText);
    }
  });

  sole.materials.forEach(function(material){
    if(material.checked){
      newSole.materials.push("material."+material.nameText);
    }
  });

    return Parse.Cloud.run('webapp.addSole', {
      sole: newSole,
      sessionToken: sessionToken
    })
    .catch(err=>{
      console.log('error! couldnt make a new sole as a copy', err);
    })

  })
  .catch(err=>{
    console.log('error! couldnt getSoleByID', err);
  })


}
