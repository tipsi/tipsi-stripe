#!/bin/bash

sed -i.bak 's@<PUBLISHABLE_KEY>@'"$PUBLISHABLE_KEY"'@' src/Root.js
sed -i.bak 's@<MERCHANT_ID>@'"$MERCHANT_ID"'@' src/Root.js
rm -rf src/Root.js.bak

sed -i.bak 's@<BACKEND_URL>@'"$BACKEND_URL"'@' src/scenes/PaymentMethodsScreen.js
rm -rf src/scenes/PaymentMethodsScreen.js.bak
