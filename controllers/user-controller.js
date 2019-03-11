const Parse = require('parse/node');
const soleConfig = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

class User {
  //returns user profile data
  static getProfileData (sessionToken) {
    return Parse.Cloud.run('webapp.getProfile', {
      sessionToken: sessionToken
    });
  };

  //returns user profile data
  static getRoleData (sessionToken) {
    return Parse.Cloud.run('webapp.getRoles', {
      sessionToken: sessionToken
    }).then(roles => {
      return Parse.Promise.as({
        isAdmin: roles.includes('Admin'),
        isRingleader: roles.includes('ringleader'),
        roles: roles
      });
    });
  };

  static hasRole (roleName, sessionToken) {
    return Parse.Cloud.run('webapp.hasRole', {
      roleName: roleName,
      sessionToken: sessionToken
    });
  };

  static isAdmin (sessionToken) {
    return Parse.Cloud.run('webapp.hasRole', {
      roleName: 'Admin',
      sessionToken: sessionToken
    });
  };

  static isRingLeader (sessionToken) {
    return Parse.Cloud.run('webapp.hasRole', {
      roleName: 'ringleader',
      sessionToken: sessionToken
    });
  };

  //returns user ring data for the first ring
  static getMyRings (sessionToken) {
    return Parse.Cloud.run('webapp.getMyRings', {
      sessionToken: sessionToken
    });
  };

  static updateProfileData (subjects, grades, role, firstName, lastName, schoolName, schoolAddress, schoolPlaceID, schoolState, sessionToken) {
    return Parse.Cloud.run('webapp.updateProfile', {
      subjects: subjects,
      grades: grades,
      role: role,
      firstName: firstName,
      lastName: lastName,
      schoolName: schoolName,
      schoolAddress: schoolAddress,
      schoolPlaceID: schoolPlaceID,
      schoolState: schoolState,
      sessionToken: sessionToken
    });
  };

  //after the user completes their profile, set off the Parse event
  static completedProfile (sessionToken) {
    return Parse.Cloud.run('webapp.completedProfile', {
      sessionToken: sessionToken
    });
  };

  //check if user's profile is complete. returns true or false
  static isProfileComplete (sessionToken) {
    return Parse.Cloud.run('webapp.isProfileComplete', {
      sessionToken: sessionToken
    });
  };

  //gives number of users signed up today
  static usersToday () {
    return Parse.Cloud.run('webapp.usersToday', {

    });
  };

  //gives a summary of all admin dashboard data
  static adminSummaryData () {
    return Parse.Cloud.run('webapp.adminSummaryData', {
    });
  };
}

module.exports = User;