function onGoogleSignIn(googleUser) {
  var access_token = googleUser.Zi.access_token,
      id_token     = googleUser.getAuthResponse().id_token,
      profile      = googleUser.getBasicProfile();
  // we have a bunch of data from Google here:
  // console.log('Full Name: ' + profile.getName());
  // console.log('Given Name: ' + profile.getGivenName());
  // console.log('Family Name: ' + profile.getFamilyName());
  // console.log("Image URL: " + profile.getImageUrl());
  // console.log("Email: " + profile.getEmail());
  //use the Google access_token to login and/or make an account with Parse
  return Parse.Cloud.run('loginGoogleUser', {
      token: googleUser.Zi.access_token
  }).then(Parse.User.become).then(function(user){
      succesfulLogin(user);
      });
};


// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

window.fbAsyncInit = function() {
  Parse.FacebookUtils.init({
    appId      : '283486318802722', // Facebook App ID
    status     : true,  // check Facebook Login status
    cookie     : true,  // enable cookies to allow Parse to access the session
    xfbml      : true,  // initialize Facebook social plugins on the page
    version    : 'v2.6' // point to the latest Facebook Graph API version
});
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "https://connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));


function succesfulLogin(user) {
  console.log('success!');
  $('#error').html('Success! Logging you in now...')
  sessionToken = Parse.User.current().getSessionToken();
  sessionToken = sessionToken.slice(2)
  console.log('sessionToken:', sessionToken);
  $('#token').val(sessionToken);
  console.log('submitting foobar with sessionToken: '+ $('#token').val());
  $("#foobar").submit()
}

function login (username, password) {
  $('#error').html('Loading...')
  Parse.User.logIn(username, password)
    .done(function (user){
      console.log('login success!');
      succesfulLogin(user)

    })
    .catch(function (error) {
      console.log('error!');
      $('#error').html(error.message)
      console.log(error.message);
    });
}

function loginFacebook () {
  var permissions = "public_profile,email";
  Parse.FacebookUtils.logIn(permissions, {
  success: function(user) {
    if (!user.existed()) {
      console.log("User signed up and logged in through Facebook!");
    } else {
      console.log("User logged in through Facebook!");
    }
    succesfulLogin(user);
  },
  error: function(user, error) {
    console.log("User cancelled the Facebook login or did not fully authorize.");
    console.log(error);
  }
});
}

// function onGoogleSignIn(googleUser) {
//     var profile = googleUser.getBasicProfile();
//     var authData = googleUser.getAuthResponse();
//     var id_token = authData.id_token;
//     var full_name = profile.getName();
//     var name_bits = full_name.split(" ");
//     var first_name = name_bits[0];
//     var last_name = name_bits[name_bits.length - 1];
//     var email = profile.getEmail();
//
//
//     console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//     console.log('Name: ' + profile.getName());
//     console.log('Image URL: ' + profile.getImageUrl());
//     console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
//     console.log('Token: ' + authData.id_token);
//     console.log('Token: ' + authData.access_token);
//     console.log('AuthData: ' + JSON.stringify(authData));
//
//
//
//
//     return Parse.Cloud.run('loginGoogleUser', {
//         token: authData.access_token
//     }).then(Parse.User.become).then(function(user){
//         succesfulLogin(user);
//
//         // var promise = user.get('pub').fetch();
//         // promise = promise.then(function(pub){
//         //     return Parse.Promise.as({user: user, pub: pub})
//         // }).then(function(data){
//         //     var pub = data.pub;
//         //     var values = pub.get('values');
//         //     return Parse.Promise.as({
//         //         user: data.user,
//         //         pub: pub,
//         //         values: values
//         //     });
//         });
//
//
// }

// function loginGoogle () {
//
// }

function logout () {
  return Parse.User.logOut().then(function () {
    return Parse.User.current();  // this will now be null if logged out
  });
}

$('#fb-login').click(function (event){
  event.preventDefault();
  loginFacebook();
})

$( "#login-form" ).submit(function (event) {

  event.preventDefault();
  var username = $('#email').val();
  var password = $('#password').val();
  console.log(username, password);
  login(username, password);

});
