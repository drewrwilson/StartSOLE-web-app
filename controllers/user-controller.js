const Parse       = require('parse/node'),
      soleConfig  = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

class User {
  //returns user profile data
  static async getProfileData (sessionToken) {
    return this.getRoleData(sessionToken).then(roleData => {
      return Parse.Cloud.run('webapp.getProfile', {
        sessionToken: sessionToken
      }).then(profile => {
        profile.roleData = roleData;
        return this.getEmailSubscriptions(sessionToken).then(subscriptions => {
          profile.subscriptions = subscriptions;
          return Parse.Promise.as(profile);
        });
      })
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

  static updateProfileData (profileObject, sessionToken) {
    return Parse.Cloud.run('webapp.updateProfile', {
      subjects: profileObject.subjects,
      grades: profileObject.grades,
      role: profileObject.role,
      firstName: profileObject.firstName,
      lastName: profileObject.lastName,
      schoolName: profileObject.schoolName,
      schoolAddress: profileObject.schoolAddress,
      schoolPlaceID: profileObject.schoolPlaceID,
      schoolState: profileObject.schoolState,
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
   * @param subscriptions json object of subscriptions
   * @param sessionToken
   * @returns {Promise<Parse.Promise>}
   */
  static async setEmailSubscriptions (sessionToken, subscriptions) {
    return Parse.Cloud.run('userpub.setSubscriptions', {
      subscriptions: subscriptions,
      sessionToken: sessionToken
    });
  }
}

module.exports = User;