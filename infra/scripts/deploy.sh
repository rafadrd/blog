#!/bin/bash

set -e

APP_DIR="/home/ec2-user/app"
SSM_PATH="/blog/prod"
METADATA_URL="http://169.254.169.254/latest"

echo "Starting deployment..."

TOKEN=$(curl -X PUT "$METADATA_URL/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600" -s)
HEADER="-H X-aws-ec2-metadata-token:$TOKEN"

AWS_REGION=$(curl -s $HEADER "$METADATA_URL/meta-data/placement/region")
PUBLIC_IP=$(curl -s $HEADER "$METADATA_URL/meta-data/public-ipv4")
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

get_param() {
  aws ssm get-parameter --name "$SSM_PATH/$1" --with-decryption --query "Parameter.Value" --output text
}

export DB_USER=$(get_param "DB_USER")
export DB_PASSWORD=$(get_param "DB_PASSWORD")
export DB_NAME=$(get_param "DB_NAME")
export OPENROUTER_API_KEY=$(get_param "OPENROUTER_API_KEY")

export PORT=3000
export AI_MODEL_NAME="openai/gpt-oss-20b:free"
export FRONTEND_URL="http://$PUBLIC_IP"

cd "$APP_DIR" || exit 1
mkdir -p "$APP_DIR/data/postgres"

echo "Logging into ECR ($AWS_REGION)..."
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$ECR_REGISTRY"

echo "Updating containers..."
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --remove-orphans

docker image prune -f

echo "Deployment done."