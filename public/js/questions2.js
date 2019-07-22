class StandardPicker {
  constructor(rootElem) {

    // connect to parse server
    Parse.initialize(soleConfig.appId);
    Parse.serverURL = soleConfig.serverUrl;

    //get session info to be used later and to be passed to handlebars view
    this.showAll      = undefined; //$("input[name=showAll]").val(); //this is true if we are adding a question, undefined if not
    this.questionsContainerSelector = '#questions'; //update later to take as parameter

    this.subjects = [
      // {
      //   short: 'AmeriCorps',
      //   rdn: 'asn.d0000003'
      // },
      {
        short: 'College Now',
        rdn: 'asn.d0000001'
      },
      // {
      //   short: 'Community Health Worker Certification',
      //   rdn: 'asn.d0000002'
      // },
      {
        short: 'Dance',
        rdn: 'asn.d2466234'
      },
      {
        short: 'Drama/Theatre',
        rdn: 'asn.d2466454'
      },
      {
        short: 'English Language Arts (Common Core)',
        rdn: 'asn.d10003fc'
      },
      {
        short: 'HRSA (ACT test)',
        rdn: 'asn.d0000004'
      },
      {
        short: 'Mathematics (Common Core)',
        rdn: 'asn.d10003fb'
      },
      {
        short: 'Music',
        rdn: 'asn.d2482974'
      },
      {
        short: 'Next Generation Science Standards',
        rdn: 'asn.d2454348'
      },
      {
        short: 'Physical Education',
        rdn: 'asn.d2716034'
      },
      {
        short: 'Science (High School)',
        rdn: 'asn.d2692656'
      },
      {
        short: 'Science (K-8)',
        rdn: 'asn.d2462762'
      },
      {
        short: 'Social Studies (High School)',
        rdn: 'asn.d2463176'
      },
      {
        short: 'Social Studies (K-8)',
        rdn: 'asn.d2462866'
      },
      {
        short: 'Technology',
        rdn: 'asn.d2465259'},
      {
        short: 'Visual Arts',
        rdn: 'asn.d2483255'
      },
      {
        short: 'World Languages',
        rdn: 'asn.d2483559'
      }
    ];
    // this.standards = ['asn.d10003fb', , 'asn.s114340d', 'asn.s11434ca', 'asn.s11434e3'];
    this.standardsTree = {
      name: 'Subject',
      selectedStandard: 'asn.d10003fb',
      standards: [
        // {
        //   short: 'AmeriCorps',
        //   rdn: 'asn.d0000003'
        // },
        {
          short: 'College Now',
          rdn: 'asn.d0000001'
        },
        // {
        //   short: 'Community Health Worker Certification',
        //   rdn: 'asn.d0000002'
        // },
        {
          short: 'Dance',
          rdn: 'asn.d2466234'
        },
        {
          short: 'Drama/Theatre',
          rdn: 'asn.d2466454'
        },
        {
          short: 'English Language Arts (Common Core)',
          rdn: 'asn.d10003fc'
        },
        {
          short: 'HRSA (ACT test)',
          rdn: 'asn.d0000004'
        },
        {
          short: 'Mathematics (Common Core)',
          rdn: 'asn.d10003fb'
        },
        {
          short: 'Music',
          rdn: 'asn.d2482974'
        },
        {
          short: 'Next Generation Science Standards',
          rdn: 'asn.d2454348'
        },
        {
          short: 'Physical Education',
          rdn: 'asn.d2716034'
        },
        {
          short: 'Science (High School)',
          rdn: 'asn.d2692656'
        },
        {
          short: 'Science (K-8)',
          rdn: 'asn.d2462762'
        },
        {
          short: 'Social Studies (High School)',
          rdn: 'asn.d2463176'
        },
        {
          short: 'Social Studies (K-8)',
          rdn: 'asn.d2462866'
        },
        {
          short: 'Technology',
          rdn: 'asn.d2465259'},
        {
          short: 'Visual Arts',
          rdn: 'asn.d2483255'
        },
        {
          short: 'World Languages',
          rdn: 'asn.d2483559'
        }
      ],
      child: {
        name: 'Grade',
        selectedStandard: 'edu.6',
        standards: [
          {
            "rdn": "edu.k",
            "short": "Kindergarten"
          },
          {
            "rdn": "edu.1",
            "short": "First Grade"
          },
          {
            "rdn": "edu.2",
            "short": "Second Grade"
          },
          {
            "rdn": "edu.3",
            "short": "Third Grade"
          },
          {
            "rdn": "edu.4",
            "short": "Fourth Grade"
          },
          {
            "rdn": "edu.5",
            "short": "Fifth Grade"
          },
          {
            "rdn": "edu.6",
            "short": "Sixth Grade"
          },
          {
            "rdn": "edu.7",
            "short": "Seventh Grade"
          },
          {
            "rdn": "edu.8",
            "short": "Eighth Grade"
          },
          {
            "rdn": "edu.9",
            "short": "Ninth Grade"
          },
          {
            "rdn": "edu.10",
            "short": "Tenth Grade"
          },
          {
            "rdn": "edu.11",
            "short": "Eleventh Grade"
          },
          {
            "rdn": "edu.12",
            "short": "Twelfth Grade"
          }
        ],
        child: {
          name: 'Standard1',
          selectedStandard: 'asn.s114340d',
          standards: [
            {rdn: 'asn.s11434c6', short: 'Expressions and Equations'},
            {rdn: 'asn.s114340d', short: 'Geometry'},
            {rdn: 'asn.s11434c0', short: 'Ratios and Proportional Relationships'},
            {rdn: 'asn.s11434cb', short: 'Statistics and Probability'},
            {rdn: 'asn.s11434c2', short: 'The Number System'}
          ],
          child: {
            name: 'Standard2',
            selectedStandard: 'asn.s11434ca',
            standards: [
              {
                "rdn": "asn.s11434ca",
                "short": "CCSS.Math.Content.6.G.A",
                "questions": 8
              }
            ],
            child: {
              name: 'Standard3',
              selectedStandard: 'asn.s11434e3',
              standards: [
                {
                  "rdn": "asn.s11434e2",
                  "short": "CCSS.Math.Content.6.G.A.1",
                  "questions": 2
                },
                {
                  "rdn": "asn.s11434e3",
                  "short": "CCSS.Math.Content.6.G.A.2",
                  "questions": 2
                },
                {
                  "rdn": "asn.s11434e4",
                  "short": "CCSS.Math.Content.6.G.A.3",
                  "questions": 2
                },
                {
                  "rdn": "asn.s11434e5",
                  "short": "CCSS.Math.Content.6.G.A.4",
                  "questions": 2
                }
              ]
            }
          }
        }
      }
    };

    this.subject = false; //    if (subject == 'all') { subject = false }

    this.rootElem = rootElem;
    this.standardsElemSelector = rootElem;

    this.questions = [{
      id: 'y3CR4uqF6E',
      text: 'What does power have to do with fairness and justice?'
      },
      {
        id: 'EJBeKeMefK',
        text: 'Why do your pupils get bigger in the dark?'
      },
      {
        id: 'kM5lKUxfZh',
        text: 'What happens to energy inside of your body?'
      },
    ];

    this.language = document.cookie.split(';')
      .filter(function(item) {
        return item.trim().indexOf('language=') == 0
      })[0].slice(10);

    this.sessionToken = document.cookie.split(';').filter(function(item) {return item.trim().indexOf('sessionToken=') == 0})[0].slice(14);
    this.questionSearchText = '';
  }

  makeQuestionCardHtml (id, text) {
    var questionCardHTML = '<div class="card blue lighten-1 grid-item masonry-card"><div class="card-content center-align"><a href="/questions/';
    questionCardHTML += id; //add id to link
    questionCardHTML += '"><div class="card-title white-text">';
    questionCardHTML += text; //add text to body
    questionCardHTML += '</div></a></div></div>';

    return questionCardHTML;
  }

  updateQuestionsInDom () {
    //First, remove all the current questions from the DOM.
    $(this.questionsContainerSelector).empty();

    var html = '';
    if(this.questions.length == 0){
      $('#no-questions-submission').show();
    }
    else {
      var _this = this; //for scope inside forEach below
      //loop through all the questions and add each to the html for the DOM
      this.questions.forEach(function (question) {
        html += _this.makeQuestionCardHtml(question.id, question.text);
      });
    }
    
    //add question html to the DOM
    $(this.questionsContainerSelector).html(html);

    //initialize masonry
    var elem = document.querySelector('.grid');
    var msnry = new Masonry( elem, {
      itemSelector: '.grid-item'
    });
  }

  get questions () {
    return this._questions;
  }

  set questions (questions) {
    this._questions = questions;
    console.log('set questions');
    console.log('questions: ', questions)
    this.updateQuestionsInDom(); //update page when we get new question data
  }

  updateQuestions () {
    var _this = this;
    Parse.Cloud.run('webapp.findQuestionByTagsAndTextForLanguages', {
      tags: this.standards,
      text: this.questionSearchText,
      languages: [this.language],
      sessionToken: this.sessionToken
    }).then(function (questions) {
      _this.questions = questions;
      console.log('updated questions!');
      console.log(questions);
    });
  }

  set standards (standards) {
    this._standards = standards;
    //update the dom
    console.log('updated grades', standards);
  }

  get standards () {
    return this._standards;
  }

  fetchStandards () {
    // rdn, grade
    return Parse.Cloud.run('webapp.getStandards', {
      rdn: rdn,
      grade: grade || false,
      showAll: showAll || false
    }).then(function (response) { console.log(response)});
  }

  // set grades (grades) {
  //   this._grades = grades;
  //   //update the dom
  //   console.log('updated grades', grades);
  // }
  //
  // get grades () {
  //   return this._grades;
  // }
  //
  // fetchGrades () {
  //   var _this = this;
  //   return Parse.Cloud.run('webapp.getGrades', {
  //     subject: this.subject || false
  //   }).then(function (grades) {
  //     _this.grades = grades;
  //   });
  // }

  removeStandardsChildrenFromDom () {
    $(this.standardsElemSelector).empty();
  }

  buildStandardsDropDownHtml (standardsTree) {
    var _this = this;
    var html = '';
      html += '<div class="standard-picker2-standards">';
      html += '<div class="col s12 m6"><label>' + standardsTree.name + '</label><select class="browser-default standard-picker2-standard-select">';
      html += '<option value="" disabled selected></option>';
      standardsTree.standards.forEach(function (standard) {
        html += '<option value="';
        html += standard.rdn;
        html += '" ';
        if (standardsTree.selectedStandard === standard.rdn) {
          html += 'selected ';
        }
        html += '>' + standard.short + '</option>';
      });
      html += '</select></div>';

    if (standardsTree.child) {
      html += this.buildStandardsDropDownHtml(standardsTree.child);
    };
    html += '</div>';
    return html;
  }

  build () {
    //1. empty the container
    this.removeStandardsChildrenFromDom();
    //2. loop through all sub standards and build dropdown HTML
    var standardsDropDownsHTML = this.buildStandardsDropDownHtml(this.standardsTree);
    $(this.standardsElemSelector).html(standardsDropDownsHTML);
  }

  changeStandard (standardRdn) {
    // this.standardsTree[standardRdn]
    // selectedStandard = 'edu.6';
    // example change the grade from 'edu.6' to 'edu.7'
    // 1. find the standard
    // _.find(test, function(o) { return o.selectedStandard == 'edu.6' })

    // function findS (sTree, sTerm, sum, cb) {
    //   // console.log('hey')
    //   // debugger
    //   if (!sum) {
    //     //first time
    //     console.log('first time');
    //     sum = sTree;
    //   }
    //   if (sTree.selectedStandard === sTerm) {
    //     sum.child =  {'last': 'last'}; //get standards from db;
    //     console.log('found!');
    //     console.log('sum', sum);
    //     cb(sum);
    //   } else {
    //     if (!sTree.child || !sTree.child.selectedStandard) {
    //       console.log('not found!');
    //       return false;
    //     } else {
    //       sum.child = sTree.child;
    //       findS(sTree.child, sTerm, sum, cb);
    //     }
    //   }
    // }
    // findS(a, 'asn.s11434ca', false, function (s) {console.log(s)})



    /****
     *
     */
    var standardsMap = function(sum, e) {
      return sum.child = {
        name: e.name,
        selectedStandard: e.selectedStandard,
        standards: e.standards,
        child: e.child
      }
    };


    //2. change the selected one

    //3. get any new children
    //4. update object
    //5. update view

  }

  removeStandard (standardRdn) {

  }
  getCurrentStandardsFromDom () {
    //get current selected standards from DOM
    var standards = [];
    $(standardPicker.rootElem + ' select').each(function() {
      standards.push($(this).val());
    });
    standards = standards.filter(Boolean); //remove any empty strings like ""
    this.standards = standards;
  }

  initialize () {

    this.fetchGrades();
    this.fetchStandards();
    this.getCurrentStandardsFromDom();

  }
}

var standardPicker = new StandardPicker('#lol-test');

console.log(standardPicker);

standardPicker.build();
