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
          name: 'Where does language come from?',
          id: '1'
        },
        {
          name: 'Do bugs feel?',
          id: '2'
        }
      ],
      favorites: [
        {
          name: 'How do new species appear?',
          id: '3'
        },
        {
          name: 'What causes storms?',
          id: '4'
        }]
    }
  };

  return homeData;
}
