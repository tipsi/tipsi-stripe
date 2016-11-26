#!/bin/bash

sed -i.bak 's@<PUBLISHABLE_KEY>@'"$PUBLISHABLE_KEY"'@' src/Root.js
sed -i.bak 's@<MERCHANT_ID>@'"$MERCHANT_ID"'@' src/Root.js
rm -rf src/Root.js.bak
