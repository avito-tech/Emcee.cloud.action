#!/bin/bash

set -xeuo pipefail

/entrypoint.sh

if [[ ! -z "$EMCEE_OUTPUT_FOLDER" ]]; then
  echo "reports_path=$EMCEE_OUTPUT_FOLDER" >> $GITHUB_OUTPUT
else
  echo "reports_path=$(pwd)" >> $GITHUB_OUTPUT
fi
