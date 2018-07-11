#!/bin/bash

function confirmAction {
    echo "Y/n:"
    if [[ "no" == $(askYesNo "$1") ]]
    then
        echo "Aborted."
      exit 0
    fi
}

function askYesNo {
    read -p " "
    case $(echo $REPLY | tr '[A-Z]' '[a-z]') in
        y|yes) echo "yes" ;;
        *)     echo "no" ;;
    esac
}
