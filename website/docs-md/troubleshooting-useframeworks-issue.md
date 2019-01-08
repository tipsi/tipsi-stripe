---
id: troubleshooting-useframeworks-issue
title: use_frameworks issue
sidebar_label: use_frameworks issue
---

If you are using `CocoaPods` and `use_frameworks!` enabled in your `Podfile` you might get the [following error](https://github.com/tipsi/tipsi-stripe/issues/29):

```
fatal error: 'Stripe/Stripe.h' file not found
```

To solve this problem please be sure that `Stripe.framework` is added to `Link Binary` with `Libraries` section of `Build Phases` in `TPSStripe.xcodeproj`. If problem still persist, please try to clean your build folder and rebuild again.

![](https://cloud.githubusercontent.com/assets/1446268/23510226/1969c904-ff72-11e6-95b4-b918497b4d1b.png)
