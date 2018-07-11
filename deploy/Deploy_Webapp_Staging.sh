#!/bin/bash

# connects to the Webapp staging server and pulls the latest code from startsole2 github repo

ssh solestaging 'cd sole/webapp2/startsole2/; git pull;'


echo ''
echo 'Updated the webapp code for the staging webapp. You can view it at https://app.staging.startsole.org/'
echo ''
echo 'NOTE: You may need to also update the cloud code on this server.'
echo ''

echo 'Do you also want me to restart the Webapp pm2 instance?'
echo 'This is only neccesary if you updated the webapp.json file for pm2'
PROMPT="Restart pm2 instance?"
echo "$PROMPT"
confirmAction $PROMPT

echo "Ok doing it..."

ssh solestaging 'cd sole/webapp2/startsole2/; pm2 delete webapp; pm2 start webapp.json --env staging; pm2 save'

echo 'Done! Restarted the Webapp pm2 instance on staging'
