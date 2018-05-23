var Question = module.exports = {};

var Parse       =  require('parse/node');
var soleConfig = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

//returns data for a question with a given ID
Question.getByID =  (id, sessionToken) => {
    return Parse.Cloud.run('webapp.getQuestionByID', {
      id: id,
  		sessionToken: sessionToken
  	})
}
//returns a user's fav'ed questions
Question.getFavorites = function (sessionToken) {
  return Parse.Cloud.run('webapp.getMyFavoriteQuestions', {
    offset: 0,
    limit: 100,
		sessionToken: sessionToken
	})
}

Question.findByText = function (searchText, sessionToken) {
  return Parse.Cloud.run('webapp.findQuestionByText', {
    searchText: searchText,
		sessionToken: sessionToken
	})
}

// returns an array of recent approved questions. defaults to limit 10.
// optional: limit is the number of questions to return
Question.getAll = function (sessionToken) {

  return Parse.Cloud.run('webapp.getAllMyQuestions', {
    offset: 0,
    limit: 100,
    sessionToken: sessionToken
  })

}
