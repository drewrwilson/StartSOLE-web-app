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
    sessionToken = 'r:' + sesh,      //convert sesh token to full sessionToken string
    showAll      = $("input[name=showAll]").val(); //this is true if we are adding a question, undefined if not

var standardPickerLevel = 0;

//get language
var language = 'en';

if (document.cookie) {
  try {
    language = document.cookie.split(';').filter(function(item) {
      return item.trim().indexOf('language=') == 0
    })[0].slice(10);
  } catch {
    language = 'en';
  }
}

function getGrades(subject){
  if (subject == 'all') {
    subject = false;
  }

  return Parse.Cloud.run('webapp.getGrades', {
    subject: subject || false
  });
}

function getStandards(rdn, grade){
  return Parse.Cloud.run('webapp.getStandards', {
  	rdn: rdn,
  	grade: grade || false,
    showAll: showAll || false
  });
}


//when the user changes the subject, get the corresponding grades
$('#subject').change(function (){
  var rdn = $(this).val(),
      q = $('#search').val(); //the search term


  var parent = $('#grade').parent();
  var allSiblings = $(parent).nextAll()
  $(allSiblings).remove()


  getGrades(rdn).then(grades=>{
    //update grade select
    console.log(grades);
    $('#grade').children().remove(); //get rid of any children in the drop down
    $('#grade').removeAttr('disabled');
    // $('#grade').append('<option></option>');

    $('#grade')
        .append($("<option></option>")
            .attr("value","")
            .attr('disabled','disabled')
            .attr('selected','selected')
            .text("Filter by grade"));

    grades.forEach(function(grade) {
      //add all the appropriate grades for a selected subject
     $('#grade')
         .append($("<option></option>")
         .attr("value",grade.rdn)
         .text(grade.short));
       });
  getQuestions();
  });
})

$('#grade').change(function (){
  var grade = $('#grade').val(),
      rdn = $('#subject').val();

  //remove all "children"
  var parent = $('#grade').parent();
  var allSiblings = $(parent).nextAll()
  $(allSiblings).remove()
  getQuestions();

  if (language=='en') {
    getStandards(rdn, grade).then(standards=>{
      // console.log(standards);

      var source   = $("#standard-picker-template").html(),
        template = Handlebars.compile(source),
        html     = '';

      html = template({standards: standards});
      $('#standard-picker').append(html)

    })
  }


})

//when the user changes the grade, get the corresponding standards
function itChanged (element){


  getStandardsFromDOM();//update the list of tags


  //remove all "children"
  var parent = $(element).parent();
  var allSiblings = $(parent).nextAll()
  $(allSiblings).remove()

  var grade = $('#grade').val(),
      rdn = element.val();

  getStandards(rdn, grade).then(standards=>{
    console.log(standards);

    if (standards.length > 0 ) {
      var source   = $("#standard-picker-template").html(),
          template = Handlebars.compile(source),
          html     = '';
        console.log({standards: standards});
      html = template({standards: standards});
      $('#standard-picker').append(html)
    }


  });
  getQuestions(element);
}


//whenever any standard picker select changes, get the questions that are tagged with the corresponding standards
function getQuestions () {

  //don't check for questions if we are adding a new one
  if(typeof showAll === 'undefined'){
    var questionText = $('#search').val();
    var standards = [];
    // var standarPickers = $('.standard-picker');
    $('.standard-picker').each(function(i, standard) {
      standards.push($(standard).val());
    });

    standards = standards.filter(Boolean) //remove any empty strings from the array
    standards = standards.filter(standard => standard != 'all')
    console.log('standards', standards);

    Parse.Cloud.run('webapp.findQuestionByTagsAndTextForLanguages', {
      tags: standards,
      text: questionText,
      languages: [language],
      sessionToken: sessionToken
    }).then(response=>{
      //Ok, now that we have the questions with a given tag, let's add them to the DOM
      console.log('response', response);
    //First, remove all the current questions from the DOM.
    $('#questions').empty();

    //Now add the new questions to the DOM

    //more handlebars frontend stuff. compost this code when you can. -DW 2018-06-22
    var source   = $("#question-card-template").html(),
      template = Handlebars.compile(source),
      html     = '';

    //more quick fixes from Justin.  Sorry sorry sorry sorry!  -JD 2018-07-11 (hey, today is 7-11!)
    if(response.questions.length == 0){
      $('#no-questions-submission').show();
    }
    else {
      $('#no-questions-submission').hide();
    }

    //loop through all the returns questions and add each to the DOM
    response.questions.forEach(function (question){
      //handlebars stuff. this is just for the question-card. bad architecture having two handlebars (frontend and backend), but we're moving so fast! (Come back later and refactor) -DW 2018-06-22
      question.sesh = sesh; //add sesh token to view data so we can add it to each question's link
      html = template(question);
      $('#questions').append(html);

      var elem = document.querySelector('.grid');
      var msnry = new Masonry( elem, {
        itemSelector: '.grid-item'
      });

    })

  });
  }

}

function getStandardsFromDOM () {
  var tags = [];
  $('.standard-picker').each(function (index, elem){
    tags.push(elem.value);
  })
  tags = tags.filter(Boolean); //remove any empty strings like ""
  // return tags.join(",");;
  $('#tags').val(tags);
}
