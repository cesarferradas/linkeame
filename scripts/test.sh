#!/usr/bin/env bash

export $(cat .env.test | xargs)
echo Environment set to $NODE_ENV

nyc mocha  --recursive --exit
