#!/bin/bash

echo "Running setup script"

echo IP=localhost >> .env
echo DATABASE_URL=$DATABASE_URL >> .env
echo NODE_ENV=production >> .env
echo SENDGRID_API_KEY=$SENDGRID_API_KEY >> .env
