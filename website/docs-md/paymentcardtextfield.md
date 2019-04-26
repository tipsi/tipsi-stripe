---
id: paymentcardtextfield
title: <PaymentCardTextField />
sidebar_label: <PaymentCardTextField />
---

A text field component specialized for collecting credit/debit card information.  
It manages multiple text fields under the hood to collect this information.  
It’s designed to fit on a single line.

#### Props

| Key | Type | Description |
| :--- | :--- | :--- |
| styles | Object | Accepts all View styles, also supports the color param |
| cursorColor&nbsp;(iOS) | String | The cursor color for the text field |
| textErrorColor&nbsp;(iOS) | String | The text color to be used when the user has entered invalid information, such as an invalid card number |
| placeholderColor&nbsp;(iOS) | String | The text placeholder color used in each child field |
| keyboardAppearance&nbsp;(iOS) | String | Determines the color of the keyboard. One of **default**, **light**, **dark** |
| numberPlaceholder | String | The placeholder for the card number field |
| expirationPlaceholder | String | The placeholder for the expiration field |
| cvcPlaceholder | String | The placeholder for the cvc field |
| disabled&nbsp;(iOS) | Bool | Enable/disable selecting or editing the field. Useful when submitting card details to Stripe |
| enabled&nbsp;(Android) | Bool | Enable/disable selecting or editing the field. Useful when submitting card details to Stripe |
| onChange | Func | This function will be called each input change |
| onParamsChange(valid&nbsp;Bool,&nbsp;params:&nbsp;Object) | Func | This function will be called each input change, it takes two arguments |

**onParamsChange params**

| Key | Type | Description |
| :--- | :--- | :--- |
| valid | Bool | Whether or not the form currently contains a valid card number, expiration date, and CVC |
| params | Object | Contains entered card params: number, expMonth, expYear and cvc |

#### Initial Params

To set initial params you can use the `<instance>.setParams(params)` method which is available via `ref`.
For example, if you’re using another library to scan your user’s credit card with a camera, you can assemble that data into an object and set this property to that object to prefill the fields you’ve collected.

You can also access the `valid` and `params` info via `<instance>.valid` and `<instance>.params` respectively.

![](https://cloud.githubusercontent.com/assets/1177226/20276457/60680ee8-aaad-11e6-834f-007909ce6814.gif)  ![](https://cloud.githubusercontent.com/assets/1177226/20572188/82ae5bf0-b1bb-11e6-97fe-fce360208130.gif)

# <PaymentCardTextField /> Component Example

```js
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { PaymentCardTextField } from 'tipsi-stripe'

const styles = StyleSheet.create({
  field: {
    width: 300,
    color: '#449aeb',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
  }
})

class FieldExample extends Component {
  handleFieldParamsChange = (valid, params) => {
    console.log(`
      Valid: ${valid}
      Number: ${params.number || '-'}
      Month: ${params.expMonth || '-'}
      Year: ${params.expYear || '-'}
      CVC: ${params.cvc || '-'}
    `)
  }

  render() {
    return (
      <PaymentCardTextField
        style={styles.field}
        cursorColor={...}
        textErrorColor={...}
        placeholderColor={...}
        numberPlaceholder={...}
        expirationPlaceholder={...}
        cvcPlaceholder={...}
        disabled={false}
        onParamsChange={this.handleFieldParamsChange}
      />
    )
  }
}
```
