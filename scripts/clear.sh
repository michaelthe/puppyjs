#!/usr/bin/env bash

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd ${dir}/..

rm -rf ./node_modules ./package-lock.json
npm install

cd -
