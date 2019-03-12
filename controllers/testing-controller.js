const Parse = require('parse/node');
const soleConfig = require('../sole-config.js');

//returns a random picture for testing observations locally with the mobile client.
class Test {
  randomPicture () {
    const picNumber = Math.floor(Math.random() * (35)) + 1;
    return 'photo'+picNumber+'.png';
  };
}

module.exports = Test;