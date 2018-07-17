var soleConfig = module.exports = {};

var ring = process.env.RING || 'regular';        // can be "hrsa" or nothing
var environment = process.env.ENVIRONMENT || 'localtesting';

soleConfig.logo = 'logo.png'; //default
soleConfig.tagline = 'Let learning happen'; //default
soleConfig.ring = 'startsole'; //default
soleConfig.googleAnalyticsUA = 'UA-104635216-5';//default local dev UA
soleConfig.serverUrl = 'http://localhost:1339/soleapp'; //defaultly set to local
soleConfig.appId = 'Hcwnq8U7xN4Z2bXcSBdvv4bjfRNKCpPSahXgeq9xRp'; //same for all environments
soleConfig.facebookAppID = '283486318802722' //default for local testing

soleConfig.googleAdWordsID = '136-847-7470';//adwords tracking. might be only for production webapp because that's the only place we send ads that we want to track? I don't think it hurts to also have it here.

//change some values if this is being run locally/staging/production
if (environment.toLowerCase() == 'production') {
  soleConfig.serverUrl = 'https://api.startsole.net/sole/';
  soleConfig.facebookAppID = '495194740686129'; //production facebook app ID (we use the same facebook app ID for HRSA production and the webapp production)
  soleConfig.googleAnalyticsUA = 'UA-104635216-3'; //production for webapp

} else if (environment.toLowerCase() == 'staging') {
  soleConfig.serverUrl = 'https://api.staging.startsole.net/sole/';
  soleConfig.facebookAppID = '480699155639280'; //staging facebook app ID (we use the same facebook app ID for HRSA staging and the webapp staging)
  soleConfig.googleAnalyticsUA = 'UA-104635216-4'; //staging for webapp
}

//change some values if the ring is HRSA
if (ring.toLowerCase() == 'hrsa') {
  soleConfig.logo = 'logo-hrsa.png';
  soleConfig.ring = 'hrsa';
  // soleConfig.facebookAppID = ''; //

  if (environment.toLowerCase() == 'production') { //if the ring is hrsa and it is production
    //HRSA web (production)
    soleConfig.googleAnalyticsUA = 'UA-104635216-10'; //HRSA production UA
  } else if (environment.toLowerCase() == 'staging') { //if the ring is hrsa and it is staging
    //HRSA web (staging)
    soleConfig.googleAnalyticsUA = 'UA-104635216-11'; //HRSA staging UA
  }
}


console.log('\n\n/^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ \n');
console.log('           Ring: ' + ring);
console.log('    Environment: ' + environment);
console.log('   Database URL: ' + soleConfig.serverUrl);
console.log('Facebook App ID: ' + soleConfig.facebookAppID);
console.log('      Google UA: ' + soleConfig.googleAnalyticsUA);
console.log(' Google AdWords: ' + soleConfig.googleAdWordsID);
console.log('\n/^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ \n\n');
