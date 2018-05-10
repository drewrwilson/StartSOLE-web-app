var Home = module.exports = {};

//example function that returns data for the home view
Home.getHomeData = function getHomeData() {
  var homeData = {
    soles: {
      upcoming: [],
      completed: []
    },
    questions: {
      mine: [
        {
          text: 'Where does language come from?',
          id: '1'
        },
        {
          text: 'Do bugs feel?',
          id: '2'
        }
      ],
      favorites: [
        {
          text: 'How do new species appear?',
          id: '3'
        },
        {
          text: 'What causes storms?',
          id: '4'
        }]
    }
  };

  return homeData;
}
