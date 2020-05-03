#!/usr/bin/env bash

export $(cat .env | xargs)
echo Environment set to $NODE_ENV

if [ $NODE_ENV = "production" ]; then
    node src/server.js
else
    nodemon src/server.js
fi
