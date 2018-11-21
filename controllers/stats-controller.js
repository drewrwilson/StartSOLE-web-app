var Stats = module.exports = {};
var Parse       =  require('parse/node');
var soleConfig = require('../sole-config.js');

Stats.usersToday = function() {
    return Parse.Cloud.run("webapp.usersDateRange", {"length":1}).then(number=>{
        return "We have had *"+number+"* users sign up today!";
    });
};

Stats.usersRange = function(numberOfDays) {
  return Parse.Cloud.run("webapp.usersDateRange", {"length":numberOfDays}).then(number=>{
      return "We have had *"+number+"* users sign up over the last "+numberOfDays+" days!";
  });
};

Stats.usersRangeDetail = function(numberOfDays) {
    return Parse.Cloud.run("webapp.usersDateRangeDetails", {"length":numberOfDays}).then(userDetails=>{

        var messageEnding = "";

        //include a school name for any school with over 10 users for this date range
        for (var key in userDetails.schools) {
            if (userDetails.schools.hasOwnProperty(key)) {
                console.log(key + " -> " + userDetails.schools[key]);
                if(userDetails.schools[key] > 10){
                    if(messageEnding.length<1){
                        messageEnding += " Most of them came from ";
                        messageEnding += key+ " ("+userDetails.schools[key]+" users)";
                    }
                    else {
                        messageEnding += ", "+key+ " ("+userDetails.schools[key]+" users)";
                    }

                }
            }
        }
        return "We have had *"+userDetails.userCount+"* users sign up over the last "+numberOfDays+" days!"+messageEnding;
    });
};

//responds to a statistics request, or replies with list of commands if not recognized
Stats.getStat = function(request) {
  var array = request.split("+");
  request = array[0];
  var params = array[1];
  switch (request) {
    case "users-today": {
      return Parse.Cloud.run("webapp.usersToday", {}).then(number=>{
        return "We've had *"+number+"* users sign up today!";
      });
    }
    case "users-range": {
      return Parse.Cloud.run("webapp.usersDateRange", {"length":params}).then(number=>{
        return "We've had *"+number+"* users sign up over the last "+params+" days!";
      });
    }
    case "users-range-detail": {
      return Parse.Cloud.run("webapp.usersDateRangeDetails", {"length":params}).then(userDetails=>{

      var messageEnding = "";

        //include a shool name for any school with over 10 users for this date range
        for (var key in userDetails.schools) {
          if (userDetails.schools.hasOwnProperty(key)) {
            console.log(key + " -> " + userDetails.schools[key]);
            if(userDetails.schools[key] > 10){
              if(messageEnding.length<1){
                messageEnding += " Most of them came from ";
                messageEnding += key+ " ("+userDetails.schools[key]+" users)";
              }
              else {
                messageEnding += ", "+key+ " ("+userDetails.schools[key]+" users)";
              }

            }
          }
        }
        return "We've had *"+userDetails.userCount+"* users sign up over the last "+params+" days!"+messageEnding;
      });
    }
    default: {
      //statements;
      break;
    }
  };

};