#!/usr/bin/env bash

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd ${dir}/..

npm version patch # minor, major
sleep 1

git add --all
sleep 1

git commit -vam 'publish patch'
sleep 1

git push
sleep 1

npm publish

cd -
