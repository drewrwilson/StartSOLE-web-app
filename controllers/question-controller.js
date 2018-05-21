var Question = module.exports = {};

var Parse       =  require('parse/node');
var soleConfig = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

//returns data for a question with a given ID
Question.getByID =  (id, sessionToken) => {

  return Parse.User.become(sessionToken)
    .then(user => {
      return Parse.Cloud.run('question.webappFindByID', {
        id: id,
    		sessionToken: sessionToken
    	})
    })
    .catch((err)=>{
      console.log(err);
    })

}
Question.getFavorites = function (sessionToken) {

  return Parse.User.become(sessionToken)
    .then(user => {
      return Parse.Cloud.run('question.webappFavs', {
        offset: 0,
        limit: 100,
    		sessionToken: sessionToken
    	})
    })
    .catch(err=>{
      console.log(err);
    })
}

// returns an array of recent approved questions. defaults to limit 10.
// optional: limit is the number of questions to return
Question.getAll = function (sessionToken) {

  return Parse.User.become(sessionToken)
    .then(user => {
      const sessionToken = Parse.User.current().getSessionToken();
      return Parse.Cloud.run('question.webappAllMine', {
        offset: 0,
        limit: 100,
        sessionToken: sessionToken
      })
    })
    .catch(err => {
      console.log(err);
    })

}
