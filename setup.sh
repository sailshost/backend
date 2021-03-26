#!/bin/bash

echo "Running setup script"

echo REDIS_URL=redis://:auth@127.0.0.1:6380/0 >> .env
echo DATABASE_URL=postgresql://postgres:testing123@127.0.0.1/develop >> .env
echo SENDGRID_API_KEY= >> .env

echo " "
echo -n "Are you running in development (y/n)? "
read answer
if [ "$answer" != "${answer#[Yy]}" ] ;then
  echo NODE_ENV=development >> .env
else
  echo NODE_ENV=production >> .env
fi
