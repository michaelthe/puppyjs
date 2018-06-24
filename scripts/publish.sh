#!/usr/bin/env bash

NPM_VERSION=$( curl -sL https://unpkg.com/puppyjs/package.json | grep \"version\" | awk -F\" '{ print $4 }' )
LOCAL_VERSION=$( cat $dir/../package.json | grep \"version\" | awk -F\" '{ print $4 }' )

if [ $NPM_VERSION -ne $LOCAL_VERSION ] ; then
    npm publish
fi
