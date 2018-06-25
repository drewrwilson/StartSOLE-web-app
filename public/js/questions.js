// this is the frontend scripts for filtering questions by standards

//standard-picker

//
// 1. page finishes loading
// 2. onchange
// 3. read select and text input values
// 4. query parse for matching questions
// 5. update question cards


// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

//get session info to be used later and to be passed to handlebars view
var sesh         = $('#sesh').val(), //get the sesh token from the DOM
    sessionToken = 'r:' + sesh;      //convert sesh token to full sessionToken string

var standardPickerIndex = 0;

function getGrades(subject){
  return Parse.Cloud.run('webapp.getGrades', {
    subject: subject || false
  });
}

function getStandards(rdn, grade){
  return Parse.Cloud.run('webapp.getStandards', {
  	rdn: rdn,
  	grade: grade || false
  });
}

function makeStandardPickerHTML (short, rdn) {
  var html = '<div class="input-field col s12 m6 new-standard-picker"><label for="refine-0" class="active">Domain</label><select id="refine-0" class="browser-default" ><option label="short 1" value="1">short1</option><option label="short 2" value="2">short2</option><option label="short 3" value="3">short3</option><option label="short 4" value="4">short4</option></div>';
  return html;
}


//when the user changes the subject, get the corresponding grades
$('#subject').change(function (){
  var rdn = $(this).val(),
      q = $('#search').val(); //the search term

  getGrades(rdn).then(grades=>{
    //update grade select
    console.log(grades);
    $('#grade').children().remove(); //get rid of any children in the drop down
    $('#grade').removeAttr('disabled');
    grades.forEach(function(grade) {
      //add all the appropriate grades for a selected subject
     $('#grade')
         .append($("<option></option>")
         .attr("value",grade.rdn)
         .text(grade.short));
       });
  })
})

$('#grade').change(function (){
  var grade = $('#grade').val(),
      rdn = $('#subject').val();

  getStandards(rdn, grade).then(standards=>{
    console.log(standards);

    var source   = $("#standard-picker-template").html(),
        template = Handlebars.compile(source),
        html     = '';
      console.log({standards: standards});
    html = template({standards: standards});
    $('#standard-picker').append(html)

  })
})

//when the user changes the grade, get the corresponding standards
function itChanged (element){
  console.log('IT CHANGED');
  var grade = $('#grade').val(),
      rdn = element.val();

  getStandards(rdn, grade).then(standards=>{
    console.log(standards);

    if (standards.length > 0) {
      var source   = $("#standard-picker-template").html(),
          template = Handlebars.compile(source),
          html     = '';
        console.log({standards: standards});
      html = template({standards: standards});
      $('#standard-picker').append(html)
    }



  })
}

//when the user changes the standard, get the corresponding standards, infinite
// TODO:
// $('.new-standard-picker').change(function (){
//   var rdn   = $(this).val(),
//       grade = $('#grade').val();
//
//   grade = 'edu.6';
//   rdn = 'asn.s114340d'; //hardcoded for testing Geometry
//
//   console.log('rdn', rdn);
//   getStandards(rdn, grade).then(standards=>{
//     console.log(standards);
//     $('#standard-picker').append(makeStandardPickerHTML())
//   })
//
// })

//whenever any standard picker select changes, get the questions that are tagged with the corresponding standards
$('.standard-picker').change(function (){
  var standards = [];
  // var standarPickers = $('.standard-picker');
  $('.standard-picker').each(function(i, standard) {
    standards.push($(standard).val());
  });

  Parse.Cloud.run('webapp.findQuestionByTags', {
    tags: standards,
    sessionToken: sessionToken
  }).then(response=>{
    //Ok, now that we have the questions with a given tag, let's add them to the DOM

    //First, remove all the current questions from the DOM.
    $('#questions').empty();

    //Now add the new questions to the DOM

    //more handlebars frontend stuff. compost this code when you can. -DW 2018-06-22
    var source   = $("#question-card-template").html(),
        template = Handlebars.compile(source),
        html     = '';

    //loop through all the returns questions and add each to the DOM
    response.questions.forEach(function (question){
      //handlebars stuff. this is just for the question-card. bad architecture having two handlebars (frontend and backend), but we're moving so fast! (Come back later and refactor) -DW 2018-06-22
      question.sesh = sesh; //add sesh token to view data so we can add it to each question's link
      html = template(question);
      $('#questions').append(html);
    })

  })
})
