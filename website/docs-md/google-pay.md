---
id: google-pay
title: Google Pay
sidebar_label: Google Pay
---

For using Google Pay in your `android/app/src/main/AndroidManifest.xml` add:

```diff
<application>
...
+ <meta-data
+   android:name="com.google.android.gms.wallet.api.enabled"
+   android:value="true" />
...
</application>
```

More information about AndroidPay [deployment and testing](https://developers.google.com/android-pay/deployment).
