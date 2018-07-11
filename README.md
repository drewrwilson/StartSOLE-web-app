# StartSOLE2

This is new version of the StartSOLE webapp. Work in progress!

# Tech stack

This uses the following tools:
 * Node
 * Express 4
 * Handlebars for templating
 * Some other misc frontend scripts like jquery, materializecss, dropzone, etc

# Tips

Install Supervisor so you don't have to relaunch the server every time you make a change.

`npm install supervisor -g`

Then you can run the app from the terminal:

`supervisor server.js`

Then open your browser and point it to `http:\\localhost:8080` to see the page

# Things we want to do in the future

 * Use SASS to keep styles well structured and clean
 * Use React and replace the node express backend entirely


# Deploying
Right now there are four deploys of this code:
 * HRSA staging: https://hrsa.staging.startsole.org/
 * HRSA production: https://hrsa.startsole.org/login
 * Webapp staging: https://app.staging.startsole.org/login
 * Webapp production: https://app.startsole.org/login

There is a `.json` file for the HRSA deploys (`hrsa.json`) and one for the webapp deploys (`webapp.json`). These json files are used by pm2 to run instances of the app.

To deploy a new version of the app, use the scripts in the `deploy` directory of this repo. You'll need to have your ssh keys setup on the remote server for this to work, so if you haven't done that yet get in touch with Frans or Steffen to set it up.

# notes

Process for clearing env variables and restarting the pm2 instance

`pm2 delete hrsa`
`pm2 start hrsa.json`
`pm2 save`

For starting server as staging:
`pm2 start hrsa --env staging`
