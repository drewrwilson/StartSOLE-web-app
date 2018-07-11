#!/bin/bash

# connects to the HRSA staging server and pulls the latest code from startsole2 github repo


source ./util.sh

ssh solestaging 'cd sole/hrsa/startsole2/; git pull;'

echo ''
echo 'Updated the code for the HRSA staging webapp. You can view it at https://hrsa.staging.startsole.org/'
echo ''
echo 'NOTE: You may need to also update the cloud code on this server.'
echo ''

echo 'Do you also want me to restart the HRSA pm2 instance?'
echo 'This is only neccesary if you updated the hrsa.json file for pm2'
PROMPT="Restart pm2 instance?"
echo "$PROMPT"
confirmAction $PROMPT

echo "Ok doing it..."

ssh solestaging 'cd sole/hrsa/startsole2/; pm2 delete hrsa; pm2 start hrsa.json --env staging; pm2 save'

echo 'Done! Restarted the HRSA pm2 instance on staging'
