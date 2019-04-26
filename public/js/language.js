//initializes the sidebar dropdown and adds functionality so a user can change their language by changing the value of the cookie

  //get the language from the cookie
  var language = 'en'; //default is english
  if (document.cookie) {
    try {
      language = document.cookie.split(';').filter(function(item) {
        return item.trim().indexOf('language=') == 0
      })[0].slice(10);
    } catch {
      language = 'en';//maybe redundant
    }

  }

  $('#sidebar-language').val(language); //add language to sidebar from cookie

  //initiliaze dropdowns
  $(document).ready(function(){
    $('select').formSelect();
  });

  //bind a trigger on changing language that updates the cookie with the new language and then reloads the page
  $('#sidebar-language').change(function () {
    console.log('trying to change language')
    //update cookie with data from form
    var newLanguage = $('#sidebar-language').val();//get the new language from the UI

    document.cookie = 'language=; Max-Age=0';//remove the language from the cookie
    document.cookie = 'language='+newLanguage; //save the language in the cookie
    location.reload(); //reload the window
  });
