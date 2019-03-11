const Parse = require('parse/node');
const soleConfig = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

class Sole {
  //returns data for a question with a given ID
  static getByID (id, sessionToken) {
    return Parse.Cloud.run('webapp.getSoleByID', {
      id: id,
      sessionToken: sessionToken
    });
  };

  static getByIdNew (id, sessionToken) {

    //1. get the data from the backend
    //2. add all the unique tags to an object called tags
    //3. add associated tags to each observation (these need to include an icon and text
    //4. convert time values to human readable thing
    //5. insert likert scale scores on the back of observation cards
    //5. return resulting object as a promise

    let dummy = {
      //Stuff we're adding to the object
      //unique tag array
      "tags": [
        {
          "name" : "Investigation Phase",
          "class" : "investigation-phase",
          "icon" : "sole-icon-investigation-phase"
        },
        {
          "class": "phase-facilitate",
          "name": "Facilitation Phase",
          "icon": "sole-icon-review-phase"
        },
        {
          "name" : "Review Phase",
          "class" : "review-phase",
          "icon" : "sole-icon-review-phase"
        },
        {
          "class": "phase-close",
          "name": "Closing Phase",
          "icon": "sole-icon-logo-full"
        },
        {
          "name" : "Shown on Projector",
          "class" : "present",
          "icon" : "sole-icon-livescreen"
        },
        {"class": "observation-collaborating",
      "name": "Collaborating",
      "icon": "sole-icon-collaborate"},
        {"class": "observation-technology",
      "name": "Using Technology Well",
      "icon": "sole-icon-technology"},
        {"class": "observation-respectful",
      "name": "Respectful Dialogue & Debate",
      "icon": "sole-icon-dialogue"},
        {"class": "observation-desire",
      "name": "Desire to Learn Content",
      "icon": "sole-icon-desire-to-learn"},
        {"class": "observation-vocabulary",
      "name": "Appropriate Use of Vocabulary",
      "icon": "sole-icon-vocabulary"},
        {"class": "observation-help_learn",
      "name": "Students Teaching Students",
      "icon": "sole-icon-help-learn"},
        {"class": "observation-help_technology",
      "name": "Helping Peers with Technology",
      "icon": "sole-icon-technology"}

      ],
      "id": "T9BX8DwAi5",
      "createdBy": {
        "id": "0VqPG54k5Z",
        "userName": "Sample Account",
        "firstName": "Sample",
        "lastName": "Account",
        "email": "abc@123.com",
        "schoolId": "Vge1W1buHB",
        "school": {
          "id": "Vge1W1buHB",
          "name": "South High Community School",
          "placeId": "ChIJJzSURPED5IkRQkP2Xn0KTcg",
          "address": "170 Apricot St, Worcester, MA 01603, USA"
        }
      },
      "engagementRatio": 0,
      "tag": "",
      "plannedDate": "20190311134045",
      "plannedDuration": "60.0",
      "plannedDurations": {
        "question": 120,
        "investigate": 2280,
        "review": 600,
        "close": 600
      },
      "grade": "Seventh Grade",
      "subject": "Math",
      "numStudents": "20",
      "numDevices": "5",
      "numGroups": 5,
      "groupOrganization": true,
      "groupSharing": true,
      "selfAssessment": true,
      "durationPreparation": 300,
      "durationGroupReview": 120,
      "durationExit": 120,
      "reflectionContentObjectiveNotes": "",
      "reflectionContentObjectiveAchievedRdn": "",
      "reflectionNotes": "",
      "reflectionNeedHelp": false,
      "reflectionHelpText": "",
      "reflectionCollaboration": 0,
      "reflectionCollaborationNotes": "",
      "reflectionTechnology": 0,
      "reflectionTechnologyNotes": "",
      "reflectionCommunication": 0,
      "reflectionCommunicationNotes": "",
      "reflectionGroundRules": false,
      "reflectionDate": "",
      "contentObjective": "",
      "question": {
        "id": "IOBShnbNEa",
        "createdBy": {
          "id": "gfGvOMqDTY",
          "userName": "Kate Muthler",
          "firstName": "Kate",
          "lastName": "Muthler",
          "email": "",
          "schoolId": ""
        },
        "text": "What math and science is used in designing and building a roller coaster?",
        "interdisciplinaryStandards": [
          "Seventh Grade"
        ]
      },
      "documents": {},
      "observations": [
        {
          "id": "t5yODE295x",
          "type": [
            "session.observation.collaborating"
          ],
          "phase": "investigate",
          "time": "0:00",
          "notes": "",
          "feedback": "",
          "img": "http://localhost:1339/soleapp/files/Hcwnq8U7xN4Z2bXcSBdvv4bjfRNKCpPSahXgeq9xRp/6f3acb903bd5cc8e442749a2c3130946_img.jpg",
          "thumb": "http://localhost:1339/soleapp/files/Hcwnq8U7xN4Z2bXcSBdvv4bjfRNKCpPSahXgeq9xRp/240e2de8706cba4f2df6a634fc790cbb_thumb.jpg",
          "group": {},
          "tags": [
            {
              "name" : "Investigation Phase",
              "class" : "investigation-phase",
              "icon" : "sole-icon-investigation-phase"
            }
            ]
        },
        {
          "id": "IPX9zcyCqq",
          "type": [
            "group.presentation"
          ],
          "phase": "review",
          "time": "0:00",
          "notes": "All agree",
          "feedback": "",
          "img": "http://localhost:1339/soleapp/files/Hcwnq8U7xN4Z2bXcSBdvv4bjfRNKCpPSahXgeq9xRp/bd09e9c08363bf2a3b97edb0fcac7203_img.jpg",
          "thumb": "http://localhost:1339/soleapp/files/Hcwnq8U7xN4Z2bXcSBdvv4bjfRNKCpPSahXgeq9xRp/7468afc83176aefddd36ba1893745f1d_thumb.jpg",
          "group": {
            "number": 1,
            "creativity": 5,
            "sourcesShared": 5,
            "noNotes": 5,
            "presentedWithinTime": true
          },
          "tags": [
            {
              "name" : "Review Phase",
              "class" : "review-phase",
              "icon" : "sole-icon-review-phase"
            }
          ]
        },
        {
          "id": "UT00QbvI3Z",
          "type": [
            "group.presentation"
          ],
          "phase": "review",
          "time": "0:05",
          "notes": "All disagree group number 2",
          "feedback": "",
          "img": "http://localhost:1339/soleapp/files/Hcwnq8U7xN4Z2bXcSBdvv4bjfRNKCpPSahXgeq9xRp/2f0cbc14bdebf4273a15301de5f359c4_img.jpg",
          "thumb": "http://localhost:1339/soleapp/files/Hcwnq8U7xN4Z2bXcSBdvv4bjfRNKCpPSahXgeq9xRp/65b065f49cfedfe485ed999ad3fbe4db_thumb.jpg",
          "group": {
            "number": 2,
            "creativity": 1,
            "sourcesShared": 1,
            "noNotes": 1,
            "presentedWithinTime": true
          }
        },
        {
          "id": "TKvZ6rZyP5",
          "type": [
            "group.presentation"
          ],
          "phase": "review",
          "time": "0:10",
          "notes": "Did not present within time.  0,3,5 score",
          "feedback": "",
          "img": "http://localhost:1339/soleapp/files/Hcwnq8U7xN4Z2bXcSBdvv4bjfRNKCpPSahXgeq9xRp/65f3793668a3ccff1fd6b614be70dac0_img.jpg",
          "thumb": "http://localhost:1339/soleapp/files/Hcwnq8U7xN4Z2bXcSBdvv4bjfRNKCpPSahXgeq9xRp/1ffaac688c942b10f96964489c213058_thumb.jpg",
          "group": {
            "number": 3,
            "creativity": 1,
            "sourcesShared": 5,
            "noNotes": 3,
            "presentedWithinTime": false
          }
        },
        {
          "id": "Uv92nZATu6",
          "type": [
            "group.presentation"
          ],
          "phase": "review",
          "time": "0:15",
          "notes": "No score not within time",
          "feedback": "",
          "img": "http://localhost:1339/soleapp/files/Hcwnq8U7xN4Z2bXcSBdvv4bjfRNKCpPSahXgeq9xRp/d22119a33df67c4d319232db8d1201c9_img.jpg",
          "thumb": "http://localhost:1339/soleapp/files/Hcwnq8U7xN4Z2bXcSBdvv4bjfRNKCpPSahXgeq9xRp/a6f414e0f396b538973f8375a8060203_thumb.jpg",
          "group": {
            "number": 4,
            "creativity": 3,
            "sourcesShared": 3,
            "noNotes": 3,
            "presentedWithinTime": false
          }
        },
        {
          "id": "sDF7Hwa5Th",
          "type": [
            "group.presentation"
          ],
          "phase": "review",
          "time": "0:25",
          "notes": "No score no photo",
          "feedback": "",
          "img": "",
          "thumb": "",
          "group": {
            "number": 5,
            "creativity": 3,
            "sourcesShared": 3,
            "noNotes": 3,
            "presentedWithinTime": false
          }
        }
      ],
      "gradeRdn": "edu.7",
      "subjectRdn": "top.math",
      "sesh": "992f5fee8a750183ccba79efd3633112",
      "config": {
        "logo": "logo.png",
        "tagline": "Let learning happen",
        "ring": "startsole",
        "googleAnalyticsUA": "UA-104635216-5",
        "serverUrl": "http://localhost:1339/soleapp",
        "appId": "Hcwnq8U7xN4Z2bXcSBdvv4bjfRNKCpPSahXgeq9xRp",
        "facebookAppID": "283486318802722",
        "baseURL": "http://localhost:1339/soleapp/files/",
        "googleAdWordsID": "136-847-7470",
        "fusionTable": "1oESSfoDnmEG4BHCCRpDQ8-LDSGVaWJ7nLJyZSqvK",
        "mapKey": "AIzaSyA_4aqJcZYOl-dHZdtZSht3rOolk8JzO3I"
      }
    };

    return Parse.Promise.as(dummy);
    //
    // return Parse.Cloud.run('webapp.getSoleByIdNew', {
    //   id: id,
    //   sessionToken: sessionToken
    // });
  };

  // returns an array of recent approved soles. defaults to limit 10.
  // optional: limit is the number of soles to return
  static getAll (sessionToken) {
    return Parse.Cloud.run('webapp.getAllMySoles', {
      offset: 0,
      limit: 100,
      sessionToken: sessionToken
    });
  };

  // upload a sole and save it to the database.
  static add (sole, sessionToken) {
    return Parse.Cloud.run('webapp.addSole', {
      sole: sole,
      sessionToken: sessionToken
    });
  };

  // upload a sole and save it to the database.
  static update (id, sole, sessionToken) {
    return Parse.Cloud.run('webapp.updateSole', {
      id: id,
      sole: sole,
      sessionToken: sessionToken
    });
  };

  // upload a sole and save it to the database.
  static saveReflection (reflection, sessionToken) {
    return Parse.Cloud.run('webapp.completeReflection', {
      sole: reflection,
      sessionToken: sessionToken
    });
  };

  static downloadDocument (id, type, sessionToken) {
    return Parse.Cloud.run('webapp.getDownloadLink', {
      id: id,
      type: type,
      sessionToken: sessionToken
    });
  };

  // delete a sole and return true if done, null if not
  static delete (id, sessionToken) {
    return Parse.Cloud.run('webapp.deleteSole', {
      id: id,
      sessionToken: sessionToken
    });
  };

  //make a copy of a SOLE
  static copy (id, sessionToken) {
    return Parse.Cloud.run('webapp.getSoleByID', {
      id: id,
      sessionToken: sessionToken
    })
      .then(sole=>{
        //process newSole so it fits with addSole. data shimming or whatever
        sole = sole.sole; // DRRRREEEWWWW! WTF MAN! DON'T DO THIS! -DW 2018-07-19
        // "MMM D, YYYY hh:mm A"
        let newSole = {
          //values from the frontend
          question: sole.question.question.text,
          subject: sole.subject,
          grade: sole.grade,
          class_label: sole.tag, //optional
          planned_date: sole.planned_date.month_text + ' ' + sole.planned_date.day + ', ' + sole.planned_date.year, //check this out
          // planned_time: sole.planned_date.hour + ':'+ sole.planned_date.minute + , //make the AM/PM capitalized
          planned_time: sole.planned_date.timeString.toUpperCase(),
          planned_duration: sole.planned_duration,
          num_groups: sole.num_groups,
          target_observations: [],
          grouporganization: sole.grouporganization,
          groupsharing: sole.groupsharing,
          self_assessment: sole.self_assessment,
          useapp: false, //this wasn't in the getter, hardcoding for now -DW 2018-07-19
          materials: [],
          num_students: sole.num_students,
          num_devices: sole.num_devices,
          content_objective: sole.content_objective.value
        };

        sole.target_observations.forEach(function(observation){
          if(observation.checked){
            newSole.target_observations.push('session.observation.'+observation.nameText);
          }
        });

        sole.materials.forEach(function(material){
          if(material.checked){
            newSole.materials.push('material.'+material.nameText);
          }
        });

        return Parse.Cloud.run('webapp.addSole', {
          sole: newSole,
          sessionToken: sessionToken
        })
          .catch(err=>{
            console.log('error! couldnt make a new sole as a copy', err);
          });
      })
      .catch(err=>{
        console.log('error! couldnt getSoleByID', err);
      });
  };

}

module.exports = Sole;
