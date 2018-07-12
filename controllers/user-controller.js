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

User.updateProfileData = function (subjects, grades, role, firstName, lastName, sessionToken) {
  return Parse.Cloud.run('webapp.updateProfile', {
    subjects: subjects,
    grades: grades,
    role: role,
    firstName: firstName,
    lastName: lastName,
    sessionToken: sessionToken
  })
};
