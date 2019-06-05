
var urlParams = new URLSearchParams(window.location.search);

function setPlatform() {
  return Parse.Cloud.run("platform.set", {
    app	: "web",
    build: "2.0",
    info: navigator.userAgent
  });
}


function onGoogleSignIn(googleUser) {
  console.log("sending google login attempt event");
  ga('send', 'event', 'onboarding.login', 'google-attempt');
  var access_token = googleUser.Zi.access_token,
      id_token     = googleUser.getAuthResponse().id_token,
      profile      = googleUser.getBasicProfile(),
      user         = undefined;

  var info = {
    google: {
      profile: {

      }
    }
  };

  if (googleUser) {
    if (googleUser.getId()) {
      info.google.id = googleUser.getId();
    }
    if (profile) {
      if (profile.getEmail()) {
        info.google.profile.email = profile.getEmail();
      }
      if (profile.getGivenName()) {
        info.google.profile.first = profile.getGivenName();
      }
      if (profile.getFamilyName()) {
        info.google.profile.last = profile.getFamilyName();
      }
    }
  }

  //use the Google access_token to login and/or make an account with Parse
  return Parse.Cloud.run('loginGoogleUser', {
    token: access_token
  }).then(function (sessionToken) {
    info['sessionToken'] = sessionToken;
    return Parse.User.become(sessionToken);
  }).then(function (_user) {
    info['user'] = _user;
    user = _user; //for scope
    return setPlatform();
  }).then(function () {
    var refer = urlParams.get('r');
    if (!refer) {
      refer = 'no-referral';
    }
    info['refer'] = refer;

    //Create DPVs for email, first, last, and imageURL
    return Parse.Cloud.run('webapp.writeSocialLoginDPVs', {
        email: profile.getEmail(),
        first: profile.getGivenName(),
        last: profile.getFamilyName(),
        imageURL: profile.getImageUrl(),
        referral: refer
    });
  }).then(function () {
    if (user !== undefined) {
      info['userSessionToken'] = user.getSessionToken();
      info['currentUserSessionToken'] = Parse.User.current().getSessionToken();

      successfulLogin(user);
    } else {
      return Parse.Promise.error('User was undefined while google login.');
    }
  }).catch(function (error) {
    console.log('Error with google login! ', error);
    $('#error').html('Error logging in with Google. Try going to <a href="https://app.startsole.org/logout">https://app.startsole.org/logout</a> and then login again');
    $.post('/google-login-error', { error: error, info: info }, function( response ) {
      console.log('sent a post request to record google failed login', response)
    });
  });
}

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

// //do a logout first to ensure
// logout();

$('document').ready(function (){
  console.log('document ready. logging out to start');

});

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
   js.src = "https://connect.facebook.net/en_US/all.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));


function successfulLogin(user) {
  // setPlatform().then(data=>{
    $('#error').html('Success! Logging you in now...');
    var sessionToken = Parse.User.current().getSessionToken();
    document.cookie = 'sessionToken=' + sessionToken + ';path=/'; //save the sessionToken in the cookie

    $("#login-with-session").submit();
    ga('send', 'event', 'onboarding.login', 'success');
  // })
}

function login (username, password) {
  $('#error').html('Loading...');
  Parse.User.logIn(username, password)
    .done(function (user){
      console.log('login success!');

      setPlatform().then(data=>{
        successfulLogin(user);
      });

    })
    .catch(function (error) {
      console.log('error! going to try lowercase version');
      Parse.User.logIn(username.toLowerCase(), password)
        .done(function (user){
          setPlatform().then(data=> {
            successfulLogin(user);
        });
        })
        .catch(function (error){
          $('#error').html(error.message)
          console.log(error.message);
        })

    });
}

function loginFacebook () {
  console.log("sending facebook login attempt event");
  ga('send', 'event', 'onboarding.login', 'facebook-attempt');
  var permissions = "public_profile,email";
  Parse.FacebookUtils.logIn(permissions, {
  success: function(user) {
    if (!user.existed()) {
      console.log("User signed up and logged in through Facebook!");
      //how about we actually do something here

    } else {
      console.log("User logged in through Facebook!");
    }
    setPlatform().then(data=> {
      successfulLogin(user);
    });
  },
  error: function(user, error) {
    console.log("User cancelled the Facebook login or did not fully authorize.");
    console.log(error);
  }
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
  login(username, password);

});

if(mobileAndTabletcheck()){
  console.log("you're on mobile");
  var elem = document.getElementById("app-download-modal")
  var instance = M.Modal.init(elem, {});
  instance.open();
}

function mobileAndTabletcheck() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  var ua = navigator.userAgent.toLowerCase();
  var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
  if(isAndroid) {
    check = false;
  }
  return check;
};

function resetPassword () {
  //get the email address from the modal
  var email = document.getElementById('password-reset-email').value

  Parse.Cloud.run("webapp.resetPassword", {
    email: email
  }).then(function(response){
    console.log(response);
    if (response.error) {
      var message = "Error: " + response.message;
      M.toast({html: message});
    } else {
      var message = "Password reset email sent to " + email;
      M.toast({html: message});
    }
    })

}
