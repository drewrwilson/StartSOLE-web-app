const Parse = require('parse/node');
const soleConfig = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

class Admin {
  /**
   * gets data for any SOLE sessions that haven't been approved or rejected yet
   * @param sessionToken string
   * @returns {Parse.Promise|PromiseLike<T | never>|Promise<T | never>|*} array of soles
   */
  static getPendingSoles (sessionToken) {
    return Parse.Cloud.run('webapp.getUnapprovedSoles', {
      limit: 999,
      sessionToken: sessionToken
    }).then(solesJson => {
      return Promise.resolve(solesJson);
    });
  }

  /*
    param:
        soleId - string
        comment - string
        sessionToken - string
     returns
        promise with soleId

     */
  static approveSole (soleId, comment, requestSocialMedia, sessionToken) {
    return Parse.Cloud.run('webapp.approveSole', {
      id: soleId,
      comment: comment,
      requestSocialMedia: requestSocialMedia,
      sessionToken: sessionToken
    });
  };

  //reject a sole and share feedback
  static rejectSole (soleId, comment, sessionToken) {
    return Parse.Cloud.run('webapp.rejectSole', {
      id: soleId,
      comment: comment,
      sessionToken: sessionToken
    });
  };


  //get questions for admin management
  static async getLeaflessQuestions (tags, text, sessionToken) {
    const questions = await Parse.Cloud.run('webapp.findQuestionsByTagsAndTextWithoutLeafNodes', {
      tags: tags,
      text: text,
      sessionToken: sessionToken
    });
    return questions;
  };

  static async bulkAddTagToQuestipons (questions, tag, sessionToken) {
    const success = await Parse.Cloud.run('webapp.bulkAddTagQuestions',{
      questions: questions,
      tag: tag,
      sessionToken: sessionToken
    });
    return success;
  }

  static async bulkRemoveTagToQuestipons (questions, tag, sessionToken) {
    const success = await Parse.Cloud.run('webapp.bulkRemoveTagQuestions',{
      questions: questions,
      tag: tag,
      sessionToken: sessionToken
    });
    return success;
  }





  //
  // //get any questions that haven't been approved yet
  // //stub Todo: make this
  // static getPendingQuestions (sessionToken) {
  //     // return Parse.Cloud.run('webapp.getUnapprovedQuestions', {
  //     //     limit: 999,
  //     //     sessionToken: sessionToken
  //     // }).then(solesJson => {
  //     //     return Promise.resolve(solesJson);
  //     // });
  // }
  // /*
  // approve a given question
  // param:
  //     questionId - string id of question
  //     comment - string comment from approver (to be used in an email to the submitter)
  //     tags - array of string tags
  //     sessionToken - string sessionToken
  //  */
  // //stub Todo: make this
  // static approveQuestion (questionId, comment, sessionToken) {
  //
  //     // return Parse.Cloud.run('webapp.approveQuestion', {
  //     //     id: soleId,
  //     //     comment: comment,
  //     //     sessionToken: sessionToken
  //     // });
  // };
  //
  // /*
  // reject a given question
  // param:
  //     questionId - string id of question
  //     comment - string comment from rejector (to be used in an email to the submitter)
  //     sessionToken - string sessionToken
  //  */
  // //stub Todo: make this
  // static rejectQuestion (questionId, comment, sessionToken) {
  //     // return Parse.Cloud.run('webapp.rejectQuestion', {
  //     //     id: questionId,
  //     //     comment: comment,
  //     //     sessionToken: sessionToken
  //     // });
  // };

}

module.exports = Admin;


