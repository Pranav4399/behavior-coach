#!/bin/bash

# Script to set up LocalStack environment with awslocal CLI
# This makes it easier to interact with LocalStack's services

echo "Setting up LocalStack development environment..."

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "pip3 is not installed. Please install Python and pip first."
    exit 1
fi

# Install awscli-local (wrapper for AWS CLI)
echo "Installing awscli-local..."
pip3 install awscli-local

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if LocalStack container is running
if ! docker ps | grep -q localstack; then
    echo "LocalStack container is not running. Starting it now with docker-compose..."
    cd "$(dirname "$0")/.." && docker-compose up -d localstack
fi

# Configure AWS CLI for LocalStack
echo "Configuring AWS CLI for LocalStack..."
mkdir -p ~/.aws

# Check if profile already exists
if grep -q "\[profile localstack\]" ~/.aws/config 2>/dev/null; then
    echo "LocalStack profile already exists in ~/.aws/config"
else
    # Add LocalStack profile to config
    cat >> ~/.aws/config << EOL

[profile localstack]
region = us-east-1
output = json
EOL
    echo "Added LocalStack profile to ~/.aws/config"
fi

# Check if credentials already exist
if grep -q "\[localstack\]" ~/.aws/credentials 2>/dev/null; then
    echo "LocalStack credentials already exist in ~/.aws/credentials"
else
    # Add LocalStack credentials
    cat >> ~/.aws/credentials << EOL

[localstack]
aws_access_key_id = test
aws_secret_access_key = test
EOL
    echo "Added test credentials to ~/.aws/credentials"
fi

echo "Creating test S3 bucket..."
awslocal s3 mb s3://local-test-bucket

echo "LocalStack setup complete! You can now use the 'awslocal' command to interact with LocalStack."
echo "For example: awslocal s3 ls"
echo ""
echo "To use with the AWS CLI directly, add --endpoint-url=http://localhost:4566 --profile localstack"
echo "For example: aws --endpoint-url=http://localhost:4566 --profile localstack s3 ls" 