---
id: running-apple-pay-on-a-real-device
title: Running  Pay on a real Device
sidebar_label: Running  Pay on a real Device
---

In order to run Apple Pay on an Apple device \(as opposed to a simulator\), there's an extra step you need to complete in Xcode. Without completing this step, Apple Pay will say that it is not supported - even if Apple Pay is set up correctly on the device.

Navigate to the Capabilities tab in your Xcode project and turn Apple Pay on. Then, add your Apple Pay Merchant ID to the 'Merchant IDs' section by clicking the '+' icon. Finally, make sure that the checkbox next to your merchant ID is blue and checked off.

![](https://user-images.githubusercontent.com/24738825/28348524-4bbd78e6-6bf2-11e7-97ed-b6e4b4ee0f0e.png)
