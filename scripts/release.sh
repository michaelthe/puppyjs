#!/usr/bin/env bash

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $dir/..

if [ -z "$(git status --porcelain)" ]; then
  echo 'patch version'
  npm version patch

  echo 'push branches'
  git push

  echo 'push tags'
  git push --tags
else
  echo 'Directory not clean'
fi
