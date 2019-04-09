/*
* Requires Parse
*
*
*/

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;
/*
* this functions creates a new account for a user and then returns a sesh token
* inputs:
* first_name - string (user input)
* last_name - string (user input)
* email - string (user input)
* password - string (user input)
* refer - string (defined by query param)
*
* returns:
* sesh - a string sesh for the user logged in
*/
function registerNewUser (first_name, last_name, email, password, refer) {
  var sessionToken = '';

  return Parse.Cloud.run("user.add", {
    name: first_name + " " + last_name,
    email: email,
    pw: password
  }).then(function() {
    return Parse.User.logIn(email, password).then(function() {
      var currentUser = Parse.User.current();
      sessionToken = currentUser.getSessionToken();
      document.cookie = "sessionToken="+sessionToken; //save the sessionToken in a cookie
    }).then(function() {
      return setPlatform();
    }).then(function() {
      return Parse.Cloud.run("webapp.updateEmail", {email: email, session: sessionToken
      }).then(function() {
        if(!refer) {
          refer = 'no-referral';
        }
        return Parse.Cloud.run("webapp.saveReferral", {
          referral: refer,
          session: sessionToken
        });
    })
  });
})
}
