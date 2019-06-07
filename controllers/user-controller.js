const Parse = require('parse/node');
const soleConfig = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

class User {
  //returns user profile data
  static getProfileData (sessionToken) {

    return this.getRoleData(sessionToken).then(roleData => {
      return Parse.Cloud.run('webapp.getProfile', {
        sessionToken: sessionToken
      }).then(profile => {
        profile.roleData = roleData;
        return profile;
      });
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
        isAmbassador: roles.includes('ambassador'),
        isTrainer: roles.includes('trainer'),
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
      sessionToken: sessionToken
    });
  };

  //gives a summary of all admin dashboard data
  static adminSummaryData (sessionToken) {
    return Parse.Cloud.run('webapp.adminSummaryData', {
      sessionToken: sessionToken
    });
  };

  /**
   * returns a promise with the language as a string, eg 'en' or 'es'
   * @param sessionToken string of sessionToken
   * @returns {Promise<string>} eg 'en' or 'es'
   */
  static async getLanguage (sessionToken) {
    const rings = await this.getMyRings(sessionToken);
    if (rings && rings.find(ring => ring.name === 'Colombia') && !rings.find(ring => ring.name === 'SOLE Team')) {
        return 'es'; //this is the name of the directory where the language views are
    } else {
      //default is none, later the default should be 'en/'
      return 'en'; //since the views are in the same directory, no value needed
    }
  }

  /**
   *
   * @param sessionToken
   * @returns {Promise<Parse.Promise>}
   */
  static async getEmailSubscriptions (sessionToken) {
    return Parse.Cloud.run('userpub.getSubscriptions', {
      sessionToken: sessionToken
    });
  }

  /**
   *
   * @param subscriptions - json object of subscriptions
   * @param sessionToken
   * @returns {Promise<Parse.Promise>}
   */
  static async setEmailSubscriptions (subscriptions, sessionToken) {
    return Parse.Cloud.run('userpub.setSubscriptions', {
      subscriptions: subscriptions,
      sessionToken: sessionToken
    });
  }
}

module.exports = User;