const Parse       = require('parse/node'),
      soleConfig  = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

class Ring {
  /**
   * gets data about a ring for visualization of dashboard
   * @param ringID
   * @param sessionToken
   * @returns {Parse.Promise} json object for dashboard visualization
   */
  static getDashboardData (ringID, sessionToken) {
    return Parse.Cloud.run('webapp.getDashboardData', {
      ringID: ringID,
      sessionToken: sessionToken
    });
  };
}

module.exports = Ring;