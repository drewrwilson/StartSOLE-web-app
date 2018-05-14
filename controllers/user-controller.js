var User = module.exports = {};

//example function that returns data for the home view
User.getProfileData = new Promise((resolve, reject) => {

  var profileData = {
    firstName: 'Drew',
    lastName: 'Wilson',
    schoolName: 'My Highschool',
    pointsEarned: 1337,
    ceusEarned: 0
  };

  resolve(profileData);

});
