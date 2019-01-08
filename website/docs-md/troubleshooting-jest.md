---
id: troubleshooting-jest
title: Jest
sidebar_label: Jest
---

To make jest work with `tipsi-stripe`, you should change `transformIgnorePatterns` in `package.json` file. Please refer to [here](https://facebook.github.io/jest/docs/tutorial-react-native.html#transformignorepatterns-customization)

```json
"jest": {
  "preset": "react-native",
  "transformIgnorePatterns": [
    "node_modules/(?!(jest-)?react-native|tipsi-stripe)"
  ]
}
```
