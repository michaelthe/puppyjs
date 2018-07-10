#!/usr/bin/env bash

release() {
    if [[ -n "$(git status --porcelain)" ]]; then
        echo "Aborting... directory is not clean"
        return
    fi

    if [[ "$(git rev-parse --abbrev-ref HEAD)" != "master" ]]; then
        echo "Aborting... you are not on master branch"
        return
    fi

    if [[ "$(git rev-parse HEAD)" != "$(git rev-parse @{u})" ]]; then
        echo "Aborting... local is out of sync"
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
