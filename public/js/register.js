// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

$("#initial-registration-form").submit(function (event) {

  event.preventDefault();
  var first_name  = $('#first_name').val(),
      last_name   = $('#last_name').val(),
      email       = $('#email').val().toLowerCase(),
      password    = $('#password').val(),
      urlParams = new URLSearchParams(window.location.search),
      sessionToken = "";

  Parse.Cloud.run("user.add", {
    name: first_name + " " + last_name,
    email: email,
    pw: password
  }).then(data=>{

    Parse.User.logIn(email, password).then(data=>{
      var currentUser = Parse.User.current();
      sessionToken = currentUser.getSessionToken();
      var sesh = sessionToken.slice(2);
      $('#sesh').val(sesh);

      $('#firstname').val(first_name);
      $('#lastname').val(last_name);

    }).then(data=>{
      Parse.Cloud.run("webapp.updateEmail", {email: email, session: sessionToken}).then(data=>{
        var refer = urlParams.get('r');
        if(refer) {
          Parse.Cloud.run("webapp.saveReferral", {referral: urlParams.get('r'), session: sessionToken}).then(data=>{
            $( "#final-registration-form" ).submit();
          })
        }
        else {
          Parse.Cloud.run("webapp.saveReferral", {referral: 'no-referral', session: sessionToken}).then(data=>{
            $( "#final-registration-form" ).submit();
        })
        }


    })

  });

}).catch(err=>{
  //if there's an error signing up, eg if a user already exists with that email address, then show an error to the user
  $('#error').html(err.message.message)
})

});
