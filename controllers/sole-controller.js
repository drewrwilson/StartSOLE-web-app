var Sole = module.exports = {};

//returns data for a question with a given ID
Sole.getByID = function getByID(id) {
  var soleData = {
    id: "otebnN8GZS",
    state: "completed",
    subject: "top.lifeskills",
    grade: "edu.12",
    tag: "World History",
    question: "bD086jgL9D",
    quickstart: true,
    planned_date: "20180428182142",
    planned_duration: 60.0,
    num_groups: 5,
    plan_state: 6,
    target_observations: [
      "session.observation.collaborating",
      "session.observation.technology",
      "session.observation.respectful"
    ],
    materials: [
      "material.poster_paper",
      "material.physical",
      "material.other"
    ],
    num_students: 20,
    num_devices: 5,
    group_organization: true,
    group_sharing: false,
    why_not_share: "kids are cray",
    "self-assessment": true,
    content_objective: "objective.content.deepen",
    group_formation: 3,
    use_app: true,
    facilitation : {
      phase : "close",
      timer: {
        question: {
          "passed":15.813686013221741,
          "adjustment":0,
          "startTime":1524932592.1023932,
          "duration":120,
          "isRunning":false
        },
        investigate: {
          "passed":-61.706183910369873,
          "adjustment":104.18631398677826,
          "startTime":1524932608.014133,
          "duration":2280,
          "isRunning":false
        },
        review: {
          "passed":0,
          "adjustment":0,
          "startTime":1524932690.752615,
          "duration":120,
          "isRunning":false
        },
        close: {
          "passed":-2928.7478069067001,
          "adjustment":2941.7061839103699,
          "startTime":1524932714.1467371,
          "duration":600,
          "isRunning":false
        }
      },
      question: {
        "secondsPassedDoneParts":0,
        "inheritedTimerAdjustment":0,
        "userTimerAdjustment":0,
        "currentPart":0
      },
      investigate: {
        "secondsPassedDoneParts":0,
        "inheritedTimerAdjustment":104.18631398677826,
        "userTimerAdjustment":0,
        "currentPart":0
      },
      close : {
        "secondsPassedDoneParts":0,
        "inheritedTimerAdjustment":2941.7061839103699,
        "userTimerAdjustment":0,
        "currentPart":0
      },
      review : {
        "secondsPassedDoneParts":11.508228063583374,
        "inheritedTimerAdjustment":-0,
        "userTimerAdjustment":0,
        "currentPart":4
      }

    },
    reflection : {
      state: 16,
      need_help: true,
      help_text: "I need help with getting students into groups",
      form_groups: true,
      group_sharing: true,
      ground_rules: true,
      self_assess: true,
      communication: 75,
      communication_notes: "some notes about communication",
      technology: 85,
      technology_notes: "some notes about technology",
      collaboration: 95,
      collaboration_notes: "some notes about collaboration",
      type_of_thinking: "reflection.type_of_thinking.recall",
      type_of_thinking_notes: "they generally copied info that they found",
      content_objective_achieved: "reflect.agree.agree",
      content_objective_notes: "they understood basic concepts",
      notes: "students were often off task"
    }
  };

  return soleData;
}

// returns an array of recent approved soles. defaults to limit 10.
// optional: limit is the number of soles to return
Sole.getRecent = function getRecent(limit) {
  var soles = {
    soles: [
      {
        id: "11111",
        state: "completed",
        planned_date: "20180428182142",
        question: {
          text: "What is up with the weather, bro?",
          id: "bD086jgL9D"
        },
        completed: true,
        reflected: true
      },
      {
        id: "22222",
        state: "completed",
        planned_date: "20180428182142",
        question: {
          text: 'Where does language come from?',
          id: '1'
        },
        completed: true,
        reflected: true
      },
      {
        id: "33333",
        state: "completed",
        planned_date: "20180428182142",
        question: {
          text: 'Do bugs feel?',
          id: '2'
        },
        completed: true,
        reflected: true
      },
      {
        id: "444444",
        state: "completed",
        planned_date: "20180428182142",
        question: {
          text: 'How do new species appear?',
          id: '3'
        },
        completed: true,
        reflected: true
      }]
    };

  return soles;
}
