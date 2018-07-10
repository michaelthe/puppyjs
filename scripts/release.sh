#!/usr/bin/env bash

release() {
    if [[ -n "$(git status --porcelain)" ]]; then
        echo "Aborting... directory is not clean"
        return
    fi

    if [[ "$(git branch)" -ne "master" ]]; then
        echo "Aborting... you are not on master branch"
        return
    fi

    if [ "$(git rev-parse @)" -ne "$(git rev-parse \"${1:-'@{u}'}\")" -a "$(git rev-parse @)" -eq "$(git merge-base @ \"${1:-'@{u}'}\")" ]; then
        echo "Aborting... local is behind remote"
        return
    fi

    return
    echo 'patch version'
    npm version patch

    echo 'push branches'
    git push

    echo 'push tags'
    git push --tags
}

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd ${dir}/..
release
