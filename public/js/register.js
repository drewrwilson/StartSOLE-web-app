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
  var sesh = '';

  return Parse.Cloud.run("user.add", {
    name: first_name + " " + last_name,
    email: email,
    pw: password
  }).then(data=>{
    return Parse.User.logIn(email, password).then(data=>{
      var currentUser = Parse.User.current();
      sessionToken = currentUser.getSessionToken();
      sesh = sessionToken.slice(2);
    }).then(data=>{
      return Parse.Cloud.run("webapp.updateEmail", {email: email, session: sessionToken
      }).then(data=>{
        if(!refer) {
          refer = 'no-referral';
        }
        return Parse.Cloud.run("webapp.saveReferral", {referral: refer, session: sessionToken
        }).then((data)=>{
          console.log('sesh ', sesh);
          return Parse.Promise.as(sesh);
        });
    })
  });

})

}

$("#initial-registration-form").submit(function (event) {

  event.preventDefault();

  var first_name  = $('#first_name').val(),
      last_name   = $('#last_name').val(),
      email       = $('#email').val().toLowerCase(),
      password    = $('#password').val(),
      urlParams = new URLSearchParams(window.location.search),
      refer = urlParams.get('r');

      console.log('pre-register')
  registerNewUser (first_name, last_name, email, password, refer).then((sesh)=>{
    console.log('post-register')
    $('#sesh').val(sesh);
    $('#firstname').val(first_name);
    $('#lastname').val(last_name);
    $( "#final-registration-form" ).submit();
  }).catch(err=>{
    //if there's an error signing up, eg if a user already exists with that email address, then show an error to the user
    $('#error').html(err.message.message)
  })


});
