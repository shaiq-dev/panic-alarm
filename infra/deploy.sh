#!/bin/bash

set -euo pipefail

BASE_DIR=$(cd $(dirname ${0})/../..; pwd)

${BASE_DIR}/infra/scripts/deploy-cfn.sh --template ${BASE_DIR}/infra/stacks/vpc/stack.yml --stack-name vpc