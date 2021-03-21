#!/bin/bash

echo IP=localhost >> ./gql/.env
echo DATABASE_URL=$DATABASE_URL >> ./gql/.env
echo NODE_ENV=production >> ./gql/.env
echo SENDGRID_API_KEY=$SENDGRID_API_KEY >> ./gql/.env
