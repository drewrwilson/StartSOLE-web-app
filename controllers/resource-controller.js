var Resource = module.exports = {};
var Parse       =  require('parse/node');
var soleConfig = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

// returns an array of all resources
Resource.getAll = function () {
  return Parse.Cloud.run('webapp.getResources')
}
