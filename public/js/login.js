function setPlatform() {
  return Parse.Cloud.run("platform.set", {
    app	: "web",
    build: "2.0",
    info: navigator.userAgent
  });
}

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
      token: access_token
  }).then(Parse.User.become).then(function(user){
      succesfulLogin(user);
      });
};

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

//do a logout first to ensure
Parse.User.logOut();

window.fbAsyncInit = function() {
  Parse.FacebookUtils.init({
    appId      : soleConfig.facebookAppID, // Facebook App ID
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
  setPlatform().then(data=>{
    console.log('success!');
    $('#error').html('Success! Logging you in now...')
    sessionToken = Parse.User.current().getSessionToken();
    sessionToken = sessionToken.slice(2)
    console.log('sessionToken:', sessionToken);
    $('#sesh').val(sessionToken);
    console.log('submitting foobar with sessionToken: '+ $('#sesh').val());
    $("#login-with-session").submit()
  })

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
