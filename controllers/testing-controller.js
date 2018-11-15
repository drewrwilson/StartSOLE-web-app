var Test = module.exports = {};
var Parse       =  require('parse/node');
var soleConfig = require('../sole-config.js');

//returns a random picture for testing observations locally with the mobile client.
Test.randomPicture = function () {
  var picNumber = Math.floor(Math.random() * (28)) + 1;
  return "photo"+picNumber+".png";
};