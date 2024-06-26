#!/bin/bash

set -euo pipefail

DRY_RUN=${DRY_RUN:=true}
EXECUTE_CHANGESET=${EXECUTE_CHANGESET:=true}

while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--template)
            STACK_TEMPLATE="$2"
            shift 
            shift
            ;;
        -s|--stack-name)
            STACK_NAME="$2"
            shift
            shift
            ;;
        -p|--parameters)
            STACK_PARAMETERS_FILE="$2"
            shift
            shift
            ;;
        -d|--parameters-dir)
            STACK_PARAMETERS_DIR="$2"
            shift
            shift
            ;;
        *)
            echo "Error: Invalid command line argument $1"
            exit 255
            ;;
    esac
done

if [[ -z ${STACK_TEMPLATE} || ! -f ${STACK_TEMPLATE} ]]; then
    echo "Error: Stack template argument missing or file not found"
    exit 255
fi

if [ -z ${STACK_NAME} ]; then
    echo "Error: Stack name argument missing"
    exit 255
fi

if [[ ! -z ${STACK_PARAMETERS_FILE-} && ! -f ${STACK_PARAMETERS_FILE} ]]; then
    echo "Error: Stack parameters file not found"
    exit 255
fi

if [[ ! -z ${STACK_PARAMETERS_DIR-} && ! -d ${STACK_PARAMETERS_DIR} ]]; then
    echo "Error: Stack parameters directory not found"
    exit 255
fi

if [ -z ${AWS_DEFAULT_REGION} ]; then
    echo "Error: Environment variable AWS_DEFAULT_REGION undefined"
    exit 255
fi

# Get AWS account alias (e.g. panicalarm-aps1-prod)
# All accounts follow the naming policy of panicalarm-[REGION_CODE]-[ENVIRONMENT]
ACCOUNT_ALIAS=$(aws iam list-account-aliases | jq --raw-output .AccountAliases[0])
if [ -z ${ACCOUNT_ALIAS} ]; then
    echo "Error: Unable to determine account alias"
    exit 255
fi

# Get account name
ACCOUNT_NAME=$(echo ${ACCOUNT_ALIAS} | cut -d\- -f1)

# Get account alias region component (e.g. aps1)
ACCOUNT_REGION=$(echo ${ACCOUNT_ALIAS} | cut -d\- -f2)

# Environment (i.e. dev/uat/prod)
ENVIRONMENT=$(echo ${ACCOUNT_ALIAS} | cut -d\- -f3)

# Ensure account alias matches profile (when defined)
if [[ ! -z ${AWS_PROFILE-} && "${ACCOUNT_ALIAS}" != "${AWS_PROFILE}" ]]; then
    echo "Error: Account alias (${ACCOUNT_ALIAS}) and profile (${AWS_PROFILE}) mismatch"
    exit 255
fi

if [ -z ${STACK_PARAMETERS_FILE-} ]; then
    if [[ -z ${STACK_PARAMETERS_DIR-} ]]; then
        # Default stack parameters search directory
        STACK_PARAMETERS_SEARCH_DIR=$(dirname ${STACK_TEMPLATE})
    else
        # Supplied stack parameters search directory
        STACK_PARAMETERS_SEARCH_DIR=${STACK_PARAMETERS_DIR}
    fi
    # Stack parameters argument not supplied so search for all default filenames
    for f in ${STACK_PARAMETERS_SEARCH_DIR}/${ACCOUNT_REGION}-${ENVIRONMENT}.properties ${STACK_PARAMETERS_SEARCH_DIR}/common.properties; do
        if [ -f $f ]; then
            STACK_PARAMETERS_FILE_LIST="${STACK_PARAMETERS_FILE_LIST-} $f"
        fi
    done;
else
    # Stack parameters argument supplied
    STACK_PARAMETERS_FILE_LIST="${STACK_PARAMETERS_FILE}"
fi

# Build stack parameters
STACK_PARAMETERS="AccountAlias=${ACCOUNT_ALIAS} AccountRegion=${ACCOUNT_REGION} Environment=${ENVIRONMENT} GitCommitHash=$(git rev-parse --short HEAD) BuildNumber=${GITHUB_RUN_NUMBER}"
for f in ${STACK_PARAMETERS_FILE_LIST-}; do
    echo "Reading parameters from $f"
    for p in $(cat $f | tr "\n" " "); do
        KEY=$(echo $p | cut -d\= -f1)
        VALUE=$(echo $p | cut -d\= -f2)
        STACK_PARAMETERS="${STACK_PARAMETERS} ${KEY}=${VALUE}"
    done
done

echo -e "\n-- ${STACK_NAME} ${STACK_TEMPLATE}\n-- ${STACK_PARAMETERS}"

# Validate template
cfn-lint -t ${STACK_TEMPLATE} -r ${AWS_DEFAULT_REGION}

# Package template
PACKAGE_BUCKET=${ACCOUNT_NAME}.${AWS_DEFAULT_REGION}.${ENVIRONMENT}.cfn
PACKAGE_TEMPLATE=$(mktemp).yaml
if [[ "${AWS_DEFAULT_REGION}" != "us-east-1" ]]; then
    # Location constraint only required when region not us-east-1
    PACKAGE_BUCKET_CONFIGURATION="--create-bucket-configuration LocationConstraint=${AWS_DEFAULT_REGION}"
fi
aws s3api get-bucket-location --bucket ${PACKAGE_BUCKET} > /dev/null 2>&1 || aws s3api create-bucket --bucket ${PACKAGE_BUCKET} ${PACKAGE_BUCKET_CONFIGURATION-}
aws cloudformation package --template-file ${STACK_TEMPLATE} --s3-bucket ${PACKAGE_BUCKET} --output-template-file ${PACKAGE_TEMPLATE}

# Skip deploy when dry-run
if [ "${DRY_RUN}" != "false" ]; then
    echo "Skipping CloudFormation deploy due to DRY_RUN"
    exit 0
fi

if [ "${EXECUTE_CHANGESET}" != "true" ]; then
    EXECUTE_CHANGESET_ARG="--no-execute-changeset"
fi

DEPLOY_BUCKET=${PACKAGE_BUCKET}
aws cloudformation deploy --template-file ${PACKAGE_TEMPLATE} --s3-bucket ${DEPLOY_BUCKET} --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM --stack-name ${STACK_NAME} --no-fail-on-empty-changeset --parameter-overrides ${STACK_PARAMETERS} ${EXECUTE_CHANGESET_ARG-} --tags env=${ENVIRONMENT}