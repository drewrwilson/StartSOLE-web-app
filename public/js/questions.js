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

var sessionToken = 'r:' + '5d278aceb9a523bdd4337a0dae128e6a';

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

//when the user changes the grade, get the corresponding standards
$('#grade').change(function (){
  var grade = $(this).val(),
      rdn = $('#subject').val();
      console.log('grade', grade);
      console.log('rdn', rdn);
  getStandards(rdn, grade).then(standards=>{
    console.log(standards);
  })
})

//when the user changes the subject, get the corresponding grades
// TODO:


//whenever any standard picker select changes, get the questions that are tagged with the corresponding standards
$('.standard-picker').change(function (){
  var standards = [];
  // var standarPickers = $('.standard-picker');
  $('.standard-picker').each(function(i, standard) {
    standards.push($(standard).val());
  });

  Parse.Cloud.run('webapp.findQuestionByTags', {
    tags: standards,
    sessionToken: 'r:' + '5d278aceb9a523bdd4337a0dae128e6a'
  }).then(questions=>{
    console.log(questions);
    //// TODO: put the questions in the view DOM

  })
})
