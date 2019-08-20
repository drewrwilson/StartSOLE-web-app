const Parse       = require('parse/node'),
      soleConfig  = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

class User {
  //returns user profile data
  static async getProfileData (sessionToken) {
    const profile = await Parse.Cloud.run('webapp.getProfile', {
        sessionToken: sessionToken
      });
    profile.roleData = await this.getRoleData(sessionToken);
    profile.subscriptions = await this.getEmailSubscriptions(sessionToken);
    return profile;
  };

  //returns user profile data
  static async getRoleData (sessionToken) {
    const roles = await Parse.Cloud.run('webapp.getRoles', {
      sessionToken: sessionToken
    });
    return {
      isAdmin: roles.includes('Admin'),
      isAmbassador: roles.includes('ambassador'),
      isTrainer: roles.includes('trainer'),
      roles: roles
    };
  };

  static async isAdmin (sessionToken) {
    return await Parse.Cloud.run('webapp.hasRole', {
      roleName: 'Admin',
      sessionToken: sessionToken
    });
  };

  //returns user ring data for the first ring
  static async getAllRings (sessionToken) {
    return await Parse.Cloud.run('webapp.getAllRings', {
      sessionToken: sessionToken
    });
  };

  static async getMyRings(sessionToken) {
    return await Parse.Cloud.run('webapp.getMyRings', {
      sessionToken: sessionToken
    });
  }

  static async updateProfileData (profileObject, sessionToken) {
    return await Parse.Cloud.run('webapp.updateProfile', {
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
  static async completedProfile (sessionToken) {
    return await Parse.Cloud.run('webapp.completedProfile', {
      sessionToken: sessionToken
    });
  };

  //check if user's profile is complete. returns true or false
  static async isProfileComplete (sessionToken) {
    return await Parse.Cloud.run('webapp.isProfileComplete', {
      sessionToken: sessionToken
    });
  };

  //gives a summary of all admin dashboard data
  static async adminSummaryData (sessionToken) {
    return await Parse.Cloud.run('webapp.adminSummaryData', {
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
    if (rings && rings.find(ring => ring.rdn === 'co')) {
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
    return await Parse.Cloud.run('userpub.getSubscriptions', {
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
    return await Parse.Cloud.run('userpub.setSubscriptions', {
      subscriptions: subscriptions,
      sessionToken: sessionToken
    });
  }

  static async updateCeuReg (sessionToken, ceuReg) {
    return await Parse.Cloud.run('webapp.updateCeuReg', {
      ceuReg: ceuReg,
      sessionToken: sessionToken
    });
  }

  static async getCeuReg (sessionToken) {
    return await Parse.Cloud.run('webapp.getCeuReg', {
      sessionToken: sessionToken
    });
  }
}

module.exports = User;