var User = module.exports = {};
var Parse       =  require('parse/node');
var soleConfig = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

//returns user profile data
User.getProfileData = function (sessionToken) {
  return Parse.Cloud.run('webapp.getProfile', {
    sessionToken: sessionToken
  })
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
  })
};

//after the user completes their profile, set off the Parse event
User.completedProfile = function (sessionToken) {
  return Parse.Cloud.run("webapp.completedProfile", {
    sessionToken: sessionToken
  })
};

//check if user's profile is complete. returns true or false
User.isProfileComplete = function (sessionToken) {
  return Parse.Cloud.run("webapp.isProfileComplete", {
    sessionToken: sessionToken
  })
};
