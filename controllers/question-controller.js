const Question = module.exports = {};

const Parse = require('parse/node');
const soleConfig = require('../sole-config.js');


// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

//returns data for a question with a given ID
Question.getByID =  (id, sessionToken) => {
  const result = Parse.Cloud.run('webapp.getQuestionByID', {
    id: id,
    sessionToken: sessionToken
  });
  console.log(result);
  return result;

};
//returns a user's fav'ed questions
Question.getFavorites = function (sessionToken) {
  return Parse.Cloud.run('webapp.getMyFavoriteQuestions', {
    offset: 0,
    limit: 100,
    sessionToken: sessionToken
  });
};

//returns unapproved questions for approval
Question.getUnapproved = function (sessionToken) {
  return Parse.Cloud.run('webapp.getUnapprovedQuestions', {
    offset: 0,
    limit: 10,
    sessionToken: sessionToken
  });
};

// returns an array of recent approved questions. defaults to limit 10.
// optional: limit is the number of questions to return
Question.getAll = function (sessionToken) {
  return Parse.Cloud.run('webapp.getAllMyQuestions', {
    offset: 0,
    limit: 100,
    sessionToken: sessionToken
  });
};
//searches questions for tags, returns results
//param:
// * tags - array of tags
//output
// * an array of questions - {questions: [{id: '555', text: 'What is rain?'}, {id: '444', text: 'Which way is up?'}]}

Question.findByTags = function (tags, sessionToken) {
  return Parse.Cloud.run('webapp.findQuestionByTags', {
    tags: tags,
    sessionToken: sessionToken
  });
};

Question.findByText = function (searchText, sessionToken) {
  return Parse.Cloud.run('webapp.findQuestionByText', {
    searchText: searchText,
    sessionToken: sessionToken
  });
};

Question.add = function (text, tags, source, sessionToken) {
  return Parse.Cloud.run('webapp.addQuestion', {
    text: text,
    tags: tags,
    source: 'https://startsole.org',
    sessionToken: sessionToken
  });

};

Question.favorite = function (questionID, sessionToken) {
  return Parse.Cloud.run('webapp.favQuestion', {
    id: questionID,
    sessionToken: sessionToken
  });
};

Question.deleteTag = function (questionID, tagID, sessionToken) {
  return Parse.Cloud.run('webapp.deleteQuestionTag', {
    id: questionID,
    tag: tagID,
    sessionToken: sessionToken
  });
};

//approves a questions
Question.approve = function (questionID, sessionToken) {
  return Parse.Cloud.run('webapp.approveQuestion', {
    id: questionID,
    sessionToken: sessionToken
  });
};

//rejects a questions
Question.reject = function (questionID, sessionToken) {
  return Parse.Cloud.run('webapp.rejectQuestion', {
    id: questionID,
    sessionToken: sessionToken
  });
};


// filter down the question tags and return a list
Question.tagPickers = function () {

};
