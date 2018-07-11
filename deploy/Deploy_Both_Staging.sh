#!/bin/bash

# this script deploys to both staging servers

source ./util.sh

echo "Step 1 of 2"
echo "Let's deploy to the HRSA staging server"

PROMPT="Deploy?"
echo "$PROMPT"
confirmAction $PROMPT

echo "Deploying.../n"
./Deploy_HRSA_Staging.sh
echo "*********************************************/n/n"
echo "Step 2 of 2"
echo "Now let\"s deploy to the webapp staging server"

PROMPT="Deploy?"
echo "$PROMPT"
confirmAction $PROMPT


echo "Deploying.../n"
./Deploy_Webapp_Staging.sh

echo "*********************************************/n"
echo 'All Done!'
echo "*********************************************/n"
