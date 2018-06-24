#!/usr/bin/env bash

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $dir/..

NPM_VERSION=$( curl -sL https://unpkg.com/puppyjs/package.json | grep \"version\" | awk -F\" '{ print $4 }' )
LOCAL_VERSION=$( cat $dir/../package.json | grep \"version\" | awk -F\" '{ print $4 }' )

echo "npm version $NPM_VERSION"
echo "local version $LOCAL_VERSION"

if [ $NPM_VERSION != $LOCAL_VERSION ] ; then
    echo "add token"
    echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/repo/.npmrc

    echo "Publishing..."
    npm publish
    echo "Published"
fi
