---
id: linking
title: Linking
sidebar_label: Linking
---

> **Note** Linking on Windows system currently isn't working. Feel free to fix it and remove this warning from docs

## Automatically

Run `react-native link tipsi-stripe` so your project is linked against your Xcode project and all CocoaPods dependencies are installed.

## Manual

### iOS

1. Open your project in Xcode, right click on Libraries and click `Add Files to "Your Project Name"`.
2. Look under `node_modules/tipsi-stripe/ios` and add `TPSStripe.xcodeproj`.
3. Add `libTPSStripe.a` to `Build Phases` → `Link Binary With Libraries`.
4. Click on `TPSStripe.xcodeproj` in Libraries and go the `Build Settings` tab.  
   Double click the text to the right of `Header Search Paths` and verify that it has
   * `$(SRCROOT)/../../react-native/React`
   * `${SRCROOT}/../../../ios/Pods/Headers/Public`

   If they aren't, then add them. This is so Xcode is able to find the headers that the `TPSStripe` source files are referring to by pointing to the header files installed within the `react-native` `node_modules` directory.
5. Whenever you want to use it within React code now you can:
   * `import stripe from 'tipsi-stripe'`

### Android

In your `android/app/build.gradle` add:

```diff
...
dependencies {
  ...
+ compile project(':tipsi-stripe')
}
```

In your `android/settings.gradle` add:

```diff
...

+include ':tipsi-stripe'
+project(':tipsi-stripe').projectDir = new File(rootProject.projectDir, '../node_modules/tipsi-stripe/android')
```

In your `android/build.gradle` add:

```diff
...

allprojects {
  repositories {
  ...
+ maven { url "https://jitpack.io" }
  }
}
```

In your `android/app/src/main/java/com/%YOUR_APP_NAME%/MainApplication.java` add:

```diff
...
+ import com.gettipsi.stripe.StripeReactPackage;
...
protected List <ReactPackage> getPackages() {
  return Arrays.<ReactPackage>asList(
-   new MainReactPackage()
+   new MainReactPackage(),
+   new StripeReactPackage()
  );
}
```

If enabling minification in your `app/build.gradle` file, you must also add the following line to `proguard-rules.pro`:
```diff
+ -keep class com.stripe.android.** { *; }
```
You can check [Stripe Android SDK](https://github.com/stripe/stripe-android#installation) for detail.

**Ensure that you have Google Play Services installed.**

#### Genymotion

For `Genymotion` you can follow [these instructions](http://stackoverflow.com/questions/20121883/how-to-install-google-play-services-in-a-genymotion-vm-with-no-drag-and-drop-su/20137324#20137324).

For a physical device you need to search on Google for 'Google Play Services'. There will be a link that takes you to the `Play Store` and from there you will see a button to update it \(do not search within the `Play Store`\).
