---
id: troubleshooting-android
title: Android
sidebar_label: Android
---

Using higher than [ours version](https://github.com/tipsi/tipsi-stripe/blob/master/android/build.gradle#L26) of Google Play Services in your project might encourage [an error](https://github.com/tipsi/tipsi-stripe/issues/18):
`NoClassDefFoundError: com.google.android.gms.wallet.MaskedWalletRequest`

We have fixed this issue, but if you somehow facing this bug again - please, create an issue or a pull request and we will take another look.
