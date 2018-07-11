#!/bin/bash

# connects to the HRSA production server and pulls the latest code from startsole2 github repo

ssh parse@sole 'cd sole/hrsa/startsole2/; git pull;'


echo ''
echo 'Updated the code for the HRSA production webapp. You can view it at https://hrsa.startsole.org/'
echo ''
echo 'NOTE: You may need to also update the cloud code on this server.'
echo ''

echo 'Do you also want me to restart the HRSA pm2 instance?'
echo 'This is only neccesary if you updated the hrsa.json file for pm2'
PROMPT="Restart pm2 instance?"
echo "$PROMPT"
confirmAction $PROMPT

echo "Ok doing it..."

ssh parse@sole 'cd sole/hrsa/startsole2/; pm2 delete hrsa; pm2 start hrsa.json; pm2 save'

echo 'Done! Restarted the HRSA pm2 instance on production'
