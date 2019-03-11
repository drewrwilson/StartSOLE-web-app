class Helper {
// takes a sesh string and adds the "r:" so it's a valid session token string
// param: sesh - string
// returns: string
  static seshToSessionToken (sesh) {
    return 'r:'+sesh;
  };

  // takes a sesh string and adds the "r:" so it's a valid session token string
  // param: sesh - string
  // returns: string
  static sessionTokenToSesh (sessionToken) {
    return sessionToken.slice(2);
  };
}



module.exports = Helper;