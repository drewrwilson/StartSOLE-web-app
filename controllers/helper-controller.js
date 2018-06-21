var Sole = module.exports = {};

// takes a sesh string and adds the "r:" so it's a valid session token string
// param: sesh - string
// returns: string
Helper.seshToSessionToken = function (sesh) {
    return 'r:'+sesh;
}

// takes a sesh string and adds the "r:" so it's a valid session token string
// param: sesh - string
// returns: string
Helper.sessionTokenToSesh = function (sessionToken) {
    return sessionToken.slice(2);
}
