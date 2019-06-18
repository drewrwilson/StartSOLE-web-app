const Parse       = require('parse/node'),
      soleConfig  = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

class Question {
  static getByID (id, sessionToken) {
    return Parse.Cloud.run('webapp.getQuestionByID', {
      id: id,
      sessionToken: sessionToken
    });
  };

  //returns a user's fav'ed questions
  static getFavorites (sessionToken) {
    return Parse.Cloud.run('webapp.getMyFavoriteQuestions', {
      offset: 0,
      limit: 100,
      sessionToken: sessionToken
    });
  };

  //returns unapproved questions for approval
  static getUnapproved (sessionToken) {
    return Parse.Cloud.run('webapp.getUnapprovedQuestions', {
      offset: 0,
      limit: 10,
      sessionToken: sessionToken
    });
  };

  // returns an array of recent approved questions. defaults to limit 10.
  // optional: limit is the number of questions to return
  static getAll (sessionToken) {
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

  static findByTags (tags, sessionToken) {
    return Parse.Cloud.run('webapp.findQuestionByTags', {
      tags: tags,
      sessionToken: sessionToken
    });
  };

  static findByText (searchText, sessionToken) {
    return Parse.Cloud.run('webapp.findQuestionByText', {
      searchText: searchText,
      sessionToken: sessionToken
    });
  };

  static add (text, tags, source, sessionToken) {
    return Parse.Cloud.run('webapp.addQuestion', {
      text: text,
      tags: tags,
      source: 'https://startsole.org',
      sessionToken: sessionToken
    });

  };

  static favorite (questionID, sessionToken) {
    return Parse.Cloud.run('webapp.favQuestion', {
      id: questionID,
      sessionToken: sessionToken
    });
  };

  static deleteTag (questionID, tagID, sessionToken) {
    return Parse.Cloud.run('webapp.deleteQuestionTag', {
      id: questionID,
      tag: tagID,
      sessionToken: sessionToken
    });
  };

}

module.exports = Question;
