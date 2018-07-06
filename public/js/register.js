// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

$("#initial-registration-form").submit(function (event) {

  event.preventDefault();
  var first_name  = $('#first_name').val(),
      last_name   = $('#last_name').val(),
      email       = $('#email').val(),
      password    = $('#password').val();

  Parse.Cloud.run("user.add", {
    name: first_name + " " + last_name,
    email: email,
    pw: password
  }).then(data=>{
    console.log('made user!');
    console.log('now logging in as this user');
    Parse.User.logIn(email, password).then(data=>{
      console.log('logged in user: ' + email);
      var currentUser = Parse.User.current();
      var sessionToken = currentUser.getSessionToken();
      console.log('current user token! ' + sessionToken);
      var sesh = sessionToken.slice(2);
      console.log('sesh',sesh);
      $('#sesh').val(sesh);

      $('#firstname').val(first_name);
      console.log('first_name',first_name);
      $('#lastname').val(last_name);
      console.log('last_name',last_name);
      $( "#final-registration-form" ).submit();
    })

  });

});
