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
    console.log('************');
    console.log('************');
    console.log('************');
    console.log('data', JSON.stringify(data));
    console.log('************');
    console.log('************');
    console.log('************');
    // login with the new user and get a session token
    // redirect to complete-profile with session token
    return Parse.User.logIn(email, password)
      .done(function (user){
        console.log('login success!');
        console.log('user', JSON.stringify(user));
        console.log('sesh', sesh);
        var sessionToken = user.attributes.sessionToken;
        var sesh = user.attributes.sessionToken.slice(2); //suspect
        console.log('sesh', sesh);

        $('#sesh').val(sesh);
        $('#firstname').val(first_name);
        $('#lastname').val(last_name);
        // $( "#final-registration-form" ).submit();
      })
  });

});
