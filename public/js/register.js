// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

$( "#initial-registration-form").submit(function (event) {

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
    console.log('data', data);
    // login with the new user and get a session token
    // redirect to complete-profile with session token
    return Parse.User.logIn(email, password)
      .done(function (user){
        console.log('login success!');
        var sessionToken = user.attributes.sessionToken;
        var sesh = user.attributes.sessionToken.slice(2);
        $('#sesh').val(sesh);
        $('#firstname').val(first_name);
        $('#lastname').val(last_name);
        $( "#final-registration-form" ).submit();
      })
  });

});
