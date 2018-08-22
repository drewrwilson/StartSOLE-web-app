var Dashboard = module.exports = {};
var Parse       =  require('parse/node');
var soleConfig = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

//returns data to build a simple line graph of users by month
Dashboard.getUsersByMonth = function (sessionToken) {
  var result = {};
  return Parse.Cloud.run('webapp.getDashboardData', {
    year: 2018,
    sessionToken: sessionToken
  }).then(arr18=>{
      result["data18"] = arr18;
      return Parse.Cloud.run('webapp.getDashboardData', {
        year: 2017,
        sessionToken: sessionToken
      })
  }).then(arr17=>{
    result["data17"] = arr17;
    return result;
  });
}
