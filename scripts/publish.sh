#!/usr/bin/env bash

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd ${dir}/..

npm version patch # minor, major
npm publish

git add package.json
git commit -vam 'version bump'
git push

cd -
