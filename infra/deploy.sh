#!/bin/bash

set -euo pipefail

BASE_DIR=$GITHUB_WORKSPACE

${BASE_DIR}/infra/scripts/deploy-cfn.sh --template ${BASE_DIR}/infra/stacks/vpc/stack.yml --stack-name vpc