[![CircleCI](https://circleci.com/gh/startsole/StartSOLE-web-app/tree/master.svg?style=svg)](https://circleci.com/gh/startsole/StartSOLE-web-app/tree/master)

# StartSOLE2

This is new version of the StartSOLE webapp. The initial version is out now in production and we're working to improve it daily.

# Tech stack

This uses the following tools:
 * Node
 * Express 4
 * Handlebars for templating
 * logger.js - our custom logging package which uses `winston` for logging and sending messages to our Slack channel
 * Some other misc frontend scripts like jquery, materialize css/js, dropzone, etc

# Environmental variables

In order to run the software you need to have these environmental variables set in your environment:
 
 * `PORT` -  the port for the webserver. default is `8080`
 * `SLACK_API_TOKEN` - an API key for our slack channel
 * `SLACK_LOG_CHANNEL` - the channel where we want log messages to be posted 


# Tips

We use IntelliJ as our IDE on the team so we have convenience scripts for running the server. If you use IntelliJ too, you'll get these scripts automatically from the repo.   

# Things we want to do in the future

 * Use SASS to keep styles well structured and clean
 * Use React and replace the node express backend entirely
 * Write tests

# Deploying
Right now there are four deploys of this code:
 * Webapp production: https://app.startsole.org/login
 * Webapp staging: https://app.staging.startsole.org/login
 * HRSA staging: https://hrsa.staging.startsole.org/
 * HRSA production: https://hrsa.startsole.org/login

There is a `.json` file for the HRSA deploys (`hrsa.json`) and one for the webapp deploys (`webapp.json`). These json files are used by pm2 to run instances of the app.

To deploy a new version of the app, use the scripts in the `deploy` directory of this repo. You'll need to have your ssh keys setup on the remote server for this to work, so if you haven't done that yet get in touch with Frans or Steffen to set it up.

All of our hosting it on AWS EC2.

# Notes

Process for clearing env variables and restarting the pm2 instance

`pm2 delete hrsa`
`pm2 start hrsa.json`
`pm2 save`

For starting server as staging:
`pm2 start hrsa --env staging`
