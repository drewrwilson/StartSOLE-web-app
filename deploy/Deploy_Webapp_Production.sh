#!/bin/bash

# connects to the Webapp production server and pulls the latest code from startsole2 github repo

ssh parse@sole 'cd sole/webapp2/startsole2/; git pull;'


echo ''
echo 'Updated the webapp code for the production webapp. You can view it at https://app.startsole.org/'
echo ''
echo 'NOTE: You may need to also update the cloud code on this server.'
echo ''

echo 'Do you also want me to restart the Webapp pm2 instance?'
echo 'This is only neccesary if you updated the webapp.json file for pm2'
PROMPT="Restart pm2 instance?"
echo "$PROMPT"
confirmAction $PROMPT

echo "Ok doing it..."

ssh parse@sole 'cd sole/webapp2/startsole2/; pm2 delete webapp; pm2 start webapp.json; pm2 save'

echo 'Done! Restarted the Webapp pm2 instance on production'
