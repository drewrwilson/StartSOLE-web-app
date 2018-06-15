var Sole = module.exports = {};
var Parse       =  require('parse/node');
var soleConfig = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

//returns data for a question with a given ID
Sole.getByID = function (id, sessionToken) {
  return Parse.Cloud.run('webapp.getSoleByID', {
    id: id,
    sessionToken: sessionToken
  })
}

// returns an array of recent approved soles. defaults to limit 10.
// optional: limit is the number of soles to return
Sole.getAll = function (sessionToken) {
  return Parse.Cloud.run('webapp.getAllMySoles', {
    offset: 0,
    limit: 100,
		sessionToken: sessionToken
	})
}

// upload a sole and save it to the database.
Sole.add = function (sole, sessionToken) {
  return Parse.Cloud.run('webapp.addSole', {
    sole: sole,
		sessionToken: sessionToken
	})
}
