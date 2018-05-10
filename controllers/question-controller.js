var Question = module.exports = {};

//returns data for a question with a given ID
Question.getByID = function getByID(id) {
  var questionData = {
    text: 'How does opioid addiction affect society?',
    id: '11111',
    sourceURL: ''
  };

  return questionData;
}

// returns an array of recent approved questions. defaults to limit 10.
// optional: limit is the number of questions to return
Question.getRecent = function getRecent(limit) {
  var questions = {
    questions: [
      {
        text: 'Where does language come from?',
        id: '1'
      },
      {
        text: 'Do bugs feel?',
        id: '2'
      },
      {
        text: 'How do new species appear?',
        id: '3'
      },
      {
        text: 'What causes storms?',
        id: '4'
      },
      {
        text: 'How does opioid addiction affect society?',
        id: '5'
      },
      {
        text: 'How does the catcher affect the efficiency of the pitcher??',
        id: '6'
      },
      {
        text: 'What are the benefits and consequences of questioning/challenging social and political order in the mid to late 20th Century in China, South Africa, and India?',
        id: '7'
      },
      {
        text: 'Should people have more than one set of teeth?',
        id: '8'
      },
      {
        text: 'Why did European countries begin to explore the world?',
        id: '9'
      },
      {
        text: 'Why do different animals need different habitats?',
        id: '10'
      }]
    };

  return questions;
}
