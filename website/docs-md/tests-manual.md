---
id: tests-manual
title: Manual
sidebar_label: Manual
---

1. Go to example folder `cd example`
2. Install CocoaPods dependencies (iOS only) `pod install --project-directory=ios`
3. Install npm dependencies `npm install`
4. Configure project before build `PUBLISHABLE_KEY=<...> MERCHANT_ID=<...> npm run configure`
5. Build project:
   - `npm run build:ios` - for iOS
   - `npm run build:android` - for Android
6. Open Appium in other tab `npm run appium`
7. Run tests:
   - `npm run test:ios` - for iOS
   - `npm run test:android` - for Android
   - `npm run test` - for both iOS and Android
