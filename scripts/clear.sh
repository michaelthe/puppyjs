#!/usr/bin/env bash

cd $( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/..

rm -rf ./node_modules ./package-lock.json
npm install

cd -
