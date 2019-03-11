const Parse = require('parse/node');
const soleConfig = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

class Dashboard {
  //returns data for building dashboard
  static getDashboardData (ringID, sessionToken) {
    return Parse.Cloud.run('webapp.getDashboardData', {
      ringID: ringID,
      sessionToken: sessionToken
    });
  };
}


module.exports = Dashboard;