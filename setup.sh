#!/bin/bash

echo "Running setup script"

echo IP=localhost >> .env
echo DATABASE_URL=postgresql://postgres:testing123@localhost/develop >> .env
echo SENDGRID_API_KEY= >> .env

echo " "
echo -n "Are you running in development (y/n)? "
read answer
if [ "$answer" != "${answer#[Yy]}" ] ;then
  echo NODE_ENV=development >> .env
else
  echo NODE_ENV=production >> .env
fi
