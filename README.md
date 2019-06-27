[![CircleCI](https://circleci.com/gh/startsole/StartSOLE-web-app/tree/master.svg?style=svg)](https://circleci.com/gh/startsole/StartSOLE-web-app/tree/master)

# StartSOLE2

This is web app client for StartSOLE

# Tech stack

This uses the following tools:
 * Node
 * Express 4
 * Handlebars for templating
 * logger.js - our custom logging package which uses `winston` for logging and sending messages to our Slack channel
 * Some other misc frontend scripts like jquery, materialize css/js, dropzone, etc - we're trying to get rid of jquery or use it sparingly

# Environmental variables

In order to run the software you need to have these environmental variables set in your environment:
 
 * `PORT` -  the port for the webserver. default is `8080`
 * `SLACK_API_TOKEN` - (optional) an API key for our slack channel
 * `SLACK_LOG_CHANNEL` - (optional) the channel where we want log messages to be posted
 
For the tests you need: 
 * `TEST_USER_EMAIL` - string of an email address of a valid user on local and staging
 * `TEST_USER_PASSWORD` - string of a valid user on local and staging


# Tips

We use IntelliJ as our IDE on the team so we have convenience scripts for running the server. If you use IntelliJ too, you'll get these scripts automatically from the repo.   

# Things we want to do in the future

 * Use SASS to keep styles well structured and clean
 * Use React and replace the node express backend entirely, maybe
 * Write more meangingful tests

# Deploying
We use circle-ci for deploying. So if you're part of our organization and added to this repo, you can login to circle-ci and the project should show up for you.

Staging: When you commit to `staging`, circle-ci automatically runs some tests and deploys to `app.staging.startsole.org`.
Production: When you commit to `master`, circle-ci automatically runs some tests and deploys to `app.startsole.org`.

Our process is the following:
 1. When you want to add a new feature or fix a bug, create a new branch using the name `feature-somethingInCamelCase` or `bugfix-somethingInCamelCase`
 1. Do any amount of coding and commits you need on that branch
 1. When you're ready to merge your changes, make a pull request of your branch into `staging`. Ask someone on the team to look at it. 
 1. Do any user-testing and playing around on app.staging.startsole.org.*
 1. Ideally when someone else looks at your code, they give any feedback or if it's ready to go, squash and merge it into staging.
 1. Repeat this process for all features.  
 1. When you're ready to deploy to production, create a pull request from `staging` into `master`. Have someone review it and then merge it in. Circle-ci will automatically run tests and deploy the code.*
 
We generally push to production twice a week on Tuesday and Thursday. Sometimes more frequently. 
 
 *Note: Sometimes the deploy gets funny and you need to SSH into the server to do an `npm install` or a manual `git pull` in this directory: `/sole/webapp2/startsole2/`. You may also need to do a `pm2 restart webapp`.  

All of our hosting it on AWS EC2.

# Notes

Process for clearing env variables and restarting the pm2 instance

`pm2 delete hrsa`
`pm2 start hrsa.json`
`pm2 save`

For starting server as staging:
`pm2 start webapp --env staging`
