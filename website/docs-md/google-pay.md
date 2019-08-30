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

More information about AndroidPay [deployment and testing](https://developers.google.com/pay/api/android/guides/test-and-deploy/integration-checklist).

You will need to go through all points of the checklist. After that, you need to submit a production request form from the bottom of the page.

After that, API team will send you confirmation from `googlepay-api-support@google.com` that they've started processing.

When everything is done with a test application, you will need to enable the application by:


* Please have the account owner login to <OWNER@EMAIL.HERE> and access our [sign-up link](https://payments.developers.google.com/signup)
* To ensure you are logged into the right account, click [here](https://accounts.google.com/SignOutOptions?continue=https://payments.developers.google.com/signup)
* Complete a profile, then on the next page, scroll down to Enable applications and they’ll see the package name.
* Only click Enable next to the corresponding package name and confirm with me once this has been completed.
* Once complete, your selected APK has production access, and you can configure your Android  application to point to Environment_Production.
* After doing so, please provide a PROD APK for final review and launch clearance.

After Google API team is able to make a test purchase, you will need to refund that test payment.

That's all.

And our best wishes to Anthony and Google Payment API Support Team.
