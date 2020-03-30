---
id: migrationIssues
title: Migration Guide & Issues
sidebar_label: Migration
---

#### How to migrate from React Native X to 0.60.x

1. For more fast upgrade use Upgrade Helper.
Just select your total RN version and target RN version.
Implement diff changes into your application
https://react-native-community.github.io/upgrade-helper/

2. Need to disable auto linking.  Add into react-native.config.js  
```js
module.exports = {
 dependencies: {
   'react-native-fbsdk': {
     platforms: {
       android: null,
       ios: null,
     }
   }
 }
}
```

3. Also read this additional information   
https://github.com/react-native-community/discussions-and-proposals/issues/129
https://github.com/facebook/react-native-fbsdk/issues/429

4. For build Android before building app use Jetify. 
Run 
```bash
npx jetify
```
```bash
npx react-native run-android
```

## Troubleshooting 

####Android

Issue:
```
Could not get unknown property 'mergeResourcesProvider' for object of type com.android.build.gradle.internal.api.ApplicationVariantImpl.
 https://github.com/wix/react-native-navigation/issues/4757

> Could not resolve all artifacts for configuration ':classpath'.
   > Could not find io.fabric.tools:gradle:1.25.4.
     Searched in the following locations:
       - https://dl.google.com/dl/android/maven2/io/fabric/tools/gradle/1.25.4/gradle-1.25.4.pom
       - https://dl.google.com/dl/android/maven2/io/fabric/tools/gradle/1.25.4/gradle-1.25.4.jar
       - https://jcenter.bintray.com/io/fabric/tools/gradle/1.25.4/gradle-1.25.4.pom
       - https://jcenter.bintray.com/io/fabric/tools/gradle/1.25.4/gradle-1.25.4.jar
     Required by:
         project :
```

Solution: `https://stackoverflow.com/questions/46787741/could-not-find-io-fabric-toolsgradle`

---

Issue:
```
A problem occurred evaluating script.
> Could not find method leftShift() for arguments [setup_eyrc4t7859zi4o3488yvdtnd5$_run_closure2@3d71a0b7] on task ':app:preBuild' of type org.gradle.api.DefaultTask.
```
Solution: `https://stackoverflow.com/questions/55793095/could-not-find-method-leftshift-for-arguments-after-updating-studio-3-4`

---

Issue: 
```
* What went wrong:
A problem occurred configuring project ':app'.
> compileSdkVersion is not specified. 
```
Solution: `https://stackoverflow.com/questions/50530889/gradle-sync-failed-cause-compilesdkversion-is-not-specified`

---

Issue:
```
/Users/igor/Work/Tipsi/tipsi/packages/app/android/app/src/main/java/com/tipsi/MainApplication.java:10: error: package android.support.multidex does not exist
import android.support.multidex.MultiDexApplication;
```
Solution: `https://medium.com/@aungmt/multidex-on-androidx-for-rn-0-60-x-cbb37c50d85`

---

Issue: 
```
/Users/igor/Work/Tipsi/tipsi/packages/app/android/app/src/main/java/com/tipsi/MainApplication.java:11: error: cannot find symbol
import com.facebook.CallbackManager;
                   ^
  symbol:   class CallbackManager
  location: package com.facebook
/Users/igor/Work/Tipsi/tipsi/packages/app/android/app/src/main/java/com/tipsi/MainApplication.java:12: error: cannot find symbol
import com.facebook.FacebookSdk;
                   ^
  symbol:   class FacebookSdk
  location: package com.facebook
/Users/igor/Work/Tipsi/tipsi/packages/app/android/app/src/main/java/com/tipsi/MainApplication.java:13: error: package com.facebook.appevents does not exist
import com.facebook.appevents.AppEventsLogger;
```
Solution: Downgrade FBSDK to 0.10.1

---

Issue:
```
/Users/igor/Work/Tipsi/tipsi/packages/app/node_modules/react-native-fbsdk/android/src/main/java/com/facebook/reactnative/androidsdk/Utility.java:52: error: package android.support.annotation does not exist
import android.support.annotation.Nullable;
                                 ^
/Users/igor/Work/Tipsi/tipsi/packages/app/node_modules/react-native-fbsdk/android/src/main/java/com/facebook/reactnative/androidsdk/FBAppEventsLoggerModule.java:23: error: package android.support.annotation does not exist
import android.support.annotation.Nullable;
```
Solution: Add to `MainApplication.java ` this `import androidx.annotation.Nullable;`

---

Issue: 
```
/Users/igor/Work/Tipsi/tipsi/packages/app/android/app/build/generated/rncli/src/main/java/com/facebook/react/PackageList.java:70: error: constructor FBSDKPackage in class FBSDKPackage cannot be applied to given types;
      new FBSDKPackage(),
      ^
  required: CallbackManager
  found: no arguments
  reason: actual and formal argument lists differ in length
1 error
```
Solution: Downgrade FBSDK to 0.10.1
