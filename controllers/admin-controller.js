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

  // stub
  /*
  returns: a json object of admin data for a ring
  users - array of users in the ring
    user - { firstName: 'FirstNameTest',  lastName: 'LastNameTest', pubId: 'aaa', }
  name - string name of the ring

   */
  static getAdminRingData (sessionToken) {
    var ringData = {
      name: 'Colombia',
      totalUsers: 0,
      users: []
    };
    for (var i = 0; i < 1 + Math.floor(Math.random() * Math.floor(25)); i++) {
      ringData.users.push({dateJoined: 'test',
        firstName: 'test',
        lastName: 'test',
        email: 'test',
        pubId: 'test',
        totalSolesPlanned: 'test',
        totalSolesCompleted: 'test',
        dateLastSole : 'test'})
    }
    ringData.totalUsers = ringData.users.length;
    return Parse.Promise.as(ringData)
  }
  /*
    ringId string id of ring
    sessionToken string of sessionToken

    returns array of ringleaders defined in userpub class for the given ring
   */
  static getRingLeaders (ringId, sessionToken) {
    return Parse.Cloud.run('webapp.getRingLeaders', {
      ringId: ringId,
      limit: 999,
      sessionToken: sessionToken
    });
  }

  static addUserToRing (userId, ringId, sessionToken) {
    return Parse.Cloud.run('webapp.addUserToRing', {
        userId: userId,
        ringId: ringId,
        sessionToken: sessionToken
    });
  }

  static removeUserToRing (userId, ringId, sessionToken) {
    return Parse.Cloud.run('webapp.removeUserToRing', {
      userId: userId,
      ringId: ringId,
      sessionToken: sessionToken
    });
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


