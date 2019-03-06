const User = module.exports = {};
const Parse = require('parse/node');
const soleConfig = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

//returns user profile data
User.getProfileData = function (sessionToken) {
  return Parse.Cloud.run('webapp.getProfile', {
    sessionToken: sessionToken
  });
};

//returns user profile data
User.getRoleData = function (sessionToken) {
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

User.hasRole = function(roleName, sessionToken) {
  return Parse.Cloud.run('webapp.hasRole', {
    roleName: roleName,
    sessionToken: sessionToken
  });
};

User.isAdmin = function(sessionToken) {
  return Parse.Cloud.run('webapp.hasRole', {
    roleName: 'Admin',
    sessionToken: sessionToken
  });
};

User.isRingLeader = function(sessionToken) {
  return Parse.Cloud.run('webapp.hasRole', {
    roleName: 'ringleader',
    sessionToken: sessionToken
  });
};

//returns user ring data for the first ring
User.getMyRings = function (sessionToken) {
  return Parse.Cloud.run('webapp.getMyRings', {
    sessionToken: sessionToken
  });
};

User.updateProfileData = function (subjects, grades, role, firstName, lastName, schoolName, schoolAddress, schoolPlaceID, schoolState, sessionToken) {
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
User.completedProfile = function (sessionToken) {
  return Parse.Cloud.run('webapp.completedProfile', {
    sessionToken: sessionToken
  });
};

//check if user's profile is complete. returns true or false
User.isProfileComplete = function (sessionToken) {
  return Parse.Cloud.run('webapp.isProfileComplete', {
    sessionToken: sessionToken
  });
};

//gives number of users signed up today
User.usersToday = function () {
  return Parse.Cloud.run('webapp.usersToday', {

  });
};

//gives a summary of all admin dashboard data
User.adminSummaryData = function () {
  return Parse.Cloud.run('webapp.adminSummaryData', {

  });
};
