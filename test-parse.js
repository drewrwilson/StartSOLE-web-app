/*
* use this script by running it from the command line with an existing username (email address) and password as paramters
* eg: $> node test-parse.js example@example.com mypassword
*
*/

const username = process.argv[2]; //1st parameter after node test-parse.js USERNAME PASSWORD
const password = process.argv[3]; //2nd parameter after node test-parse.js USERNAME PASSWORD
//note username is email address

var Parse       =  require('parse/node');
var soleConfig = require('./sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

function getFavQuestions(sessionToken) {
	return Parse.Cloud.run('question.webappFavs', {
		offset: 0,
    limit: 100,
		sessionToken: sessionToken
	});
}

function getAllMyQuestions(sessionToken) {
	return Parse.Cloud.run('question.webappAllMine', {
		offset: 0,
		limit: 100,
		sessionToken: sessionToken
	});
}

function getQuestionByID(id, sessionToken) {
	return Parse.Cloud.run('question.webappFindByID', {
		id: id,
		sessionToken: sessionToken
	});
}

//do a test login
Parse.User.enableUnsafeCurrentUser();
Parse.User.logIn(username, password)
  .done((user)=>{
    console.log('Logged in!');
    console.log('---');
		const currentUserToken = Parse.User.current().getSessionToken();
		console.log('current user token: ', currentUserToken);
		console.log('---');
		getAllMyQuestions(currentUserToken)
			.then((questions)=>{
				console.log('got all questions:');
				console.log(questions);
				console.log('---');
				getFavQuestions(currentUserToken)
					.then((questions)=>{
						console.log('got fav questions:');
						console.log(questions);
						console.log('---');
						console.log('going to try getting this question as a single now:', questions[0].id);
						getQuestionByID(questions[0].id)
							.then((question)=>{
								console.log('got a single question:');
								console.log('---');
								console.log(JSON.stringify(question));
							})
							.fail((err)=>{
								console.log('oops!');
								console.log('error getting single question!', err);
							})
					})
					.fail((err)=>{
						console.log('error getting fav questions!', err);
					})
			})
			.fail((err)=>{
				console.log('error getting questions!', err);
			})
	  }).fail((err)=> {
	    console.log('Error logging in!', err);
	  });

//   function getAndProcessDownloads(){
//     return Parse.Cloud.run('report.getDownloads', {
//         offset: 0,
//         limit: 100,
//         start: Search.start.toDate(),
//         end: Search.end.toDate(),
//         sessionToken:Parse.User.current().getSessionToken()
//     }).then(processDownloadResults);
// }
