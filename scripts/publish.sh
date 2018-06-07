#!/usr/bin/env bash

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd ${dir}/..

npm version patch # minor, major

git add --all
git commit -vam 'publish patch'
git push

npm publish

cd -
