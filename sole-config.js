var soleConfig = module.exports = {};

soleConfig.environment = process.env.ENVIRONMENT || 'localtesting';

soleConfig.logo = 'logo.png'; //default
soleConfig.tagline = 'Let learning happen'; //default
soleConfig.googleAnalyticsUA = 'UA-104635216-5';//default local dev UA
soleConfig.serverUrl = 'http://localhost:1339/soleapp'; //defaultly set to local
soleConfig.appId = 'Hcwnq8U7xN4Z2bXcSBdvv4bjfRNKCpPSahXgeq9xRp'; //same for all environments
soleConfig.baseURL = 'http://localhost:1339/soleapp/files/';
soleConfig.googleAdWordsID = '136-847-7470';//adwords tracking. might be only for production webapp because that's the only place we send ads that we want to track? I don't think it hurts to also have it here.
soleConfig.fusionTable = '1oESSfoDnmEG4BHCCRpDQ8-LDSGVaWJ7nLJyZSqvK';
soleConfig.mapKey = 'AIzaSyA_4aqJcZYOl-dHZdtZSht3rOolk8JzO3I';
soleConfig.slackToken = process.env.SLACK_API_TOKEN;
soleConfig.slackChannel = process.env.SLACK_CHANNEL;


//change some values if this is being run locally/staging/production
if (soleConfig.environment.toLowerCase() == 'production') {
  soleConfig.serverUrl = 'https://api.startsole.net/sole/';
  soleConfig.googleAnalyticsUA = 'UA-104635216-3'; //production for webapp
  soleConfig.baseURL = 'https://api.startsole.net/sole/files/';

} else if (soleConfig.environment.toLowerCase() == 'staging') {
  soleConfig.serverUrl = 'https://api.staging.startsole.net/sole/';
  soleConfig.googleAnalyticsUA = 'UA-104635216-4'; //staging for webapp
  soleConfig.baseURL = 'https://api.staging.startsole.net/sole/files/';
}

console.log('\n\n/^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ \n');

console.log('    Environment: ' + soleConfig.environment);
console.log('   Database URL: ' + soleConfig.serverUrl);
console.log('      Google UA: ' + soleConfig.googleAnalyticsUA);
console.log(' Google AdWords: ' + soleConfig.googleAdWordsID);
console.log(' Slack API Token: ' + soleConfig.slackToken);
console.log(' Slack Channel: ' + soleConfig.slackChannel);
console.log('\n/^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ \n\n');
