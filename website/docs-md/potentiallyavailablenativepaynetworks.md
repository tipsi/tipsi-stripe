---
id: potentiallyAvailableNativePayNetworks
title: .potentiallyAvailableNativePayNetworks([options]) -> Promise
sidebar_label: .potentiallyAvailableNativePayNetworks()
---

Provides a list of payment networks potentially available on this device for this specific operating system version.

## All Platforms

When referring to `networks` below, we mean values from this list:

* `american_express`
* `cartes_bancaires`
* `china_union_pay`
* `discover`
* `eftpos`
* `electron`
* `elo`
* `id_credit`
* `interac`
* `jcb`
* `mada`
* `maestro`
* `master_card`
* `private_label`
* `quic_pay`
* `suica`
* `visa`
* `vpay`

### Example

```js
import stripe from 'tipsi-stripe'

await stripe.potentiallyAvailableNativePayNetworks()
// -> returns null if Native Pay is disabled
// -> returns [] if it Native Pay is enabled, but it doesn't know what networks are available (on Android)
// -> returns [ 'american_express', 'discover', ...a list of all supported networks, documented above...]
```

**Android Note** -- this returns `[]` an empty array or null, as the networks aren't exposed to application code
