#!/bin/sh

if [ "$(uname)" == "Darwin" ]; then
	ruby $(dirname "$0")/post-link-ios.rb
fi

node $(dirname "$0")/post-link-android.js
