#!/bin/bash

# Build fresh docs
npm run build --prefix website/docs

# Remove existing docs
rm -rf ./docs

# Move fresh docs into /docs folder
mv website/docs/build/tipsi-stripe ./docs

# Format all the html
prettier --write docs/**/*.html
