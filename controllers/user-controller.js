var User = module.exports = {};
var Parse       =  require('parse/node');
var soleConfig = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

//example function that returns data for the home view
User.getProfileData = function (sessionToken) {
  return Parse.Cloud.run('webapp.getProfile', {
    sessionToken: sessionToken
  })
};
