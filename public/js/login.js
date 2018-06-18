var Parse = require('parse');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

function login () {
  
  Parse.User.logIn(username, password, {
    success: function(user) {
      // Do stuff after successful login.
    },
    error: function(user, error) {
      // The login failed. Check error to see why.
    }
  });
z
}

// Parse.User.logOut().then(() => {
//   var currentUser = Parse.User.current();  // this will now be null
// });
