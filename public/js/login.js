// var Parse = require('parse');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

function login (username, password) {
  $('#error').html('Loading...')
  Parse.User.logIn(username, password)
    .done((user)=>{
      console.log('success!');
      $('#error').html('Success! Logging you in now...')
      sessionToken = Parse.User.current().getSessionToken();
      console.log('sessionToken:', sessionToken);
      $('#token').val(sessionToken.slice(2));
      console.log('submitting foobar with sessionToken: '+ $('#token'));
      $( "#foobar" ).submit()
    })
    .catch((error)=>{
      console.log('error!');
      $('#error').html(error.message)
      console.log(error.message);
    });
}



function logout () {
  return Parse.User.logOut().then(() => {
    return Parse.User.current();  // this will now be null if logged out
  });
}



$( "#login-form" ).submit(function (event) {

  event.preventDefault();
  var username = $('#email').val();
  var password = $('#password').val();
  console.log(username, password);
  // login(username, password);

});
