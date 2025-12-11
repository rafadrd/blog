#!/bin/bash
yum update -y

yum install -y docker
service docker start
systemctl enable docker

usermod -a -G docker ec2-user

mkdir -p /usr/local/lib/docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

mkdir -p /home/ec2-user/app
chown -R ec2-user:ec2-user /home/ec2-user/app

yum install -y aws-cli

echo "EC2 Initialization Complete" >> /var/log/user-data.log