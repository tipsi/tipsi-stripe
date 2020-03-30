#!/bin/bash

echo "PUBLISHABLE_KEY is set to '$PUBLISHABLE_KEY'"
echo "MERCHANT_ID is set to '$MERCHANT_ID'"
echo "BACKEND_URL is set to '$BACKEND_URL'"

sed -i.bak 's@<PUBLISHABLE_KEY>@'"$PUBLISHABLE_KEY"'@' src/Root.js
sed -i.bak 's@<MERCHANT_ID>@'"$MERCHANT_ID"'@' src/Root.js
sed -i.bak 's@<STRIPE_ACCOUNT>@'"$STRIPE_ACCOUNT"'@' src/Root.js
sed -i.bak 's@<BACKEND_URL>@'"$BACKEND_URL"'@' src/scenes/PaymentIntentScreen.js
sed -i.bak 's@<BACKEND_URL>@'"$BACKEND_URL"'@' src/scenes/SetupIntentScreen.js
rm -rf src/Root.js.bak
