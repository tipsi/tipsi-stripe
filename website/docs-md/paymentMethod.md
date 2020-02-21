---
id: paymentMethod
title: Payment Method
sidebar_label: Payment Method
---

The paymentMethod object here is what is returned from a call to `stripe.createPaymentMethod()`

##### `paymentMethod` — an object with the following keys:

| Key | Type | Description |
| :--- | :--- | :--- |
| id | String | Unique identifier for the object. |
| created | Number | Time at which the object was created. Measured in seconds since the Unix epoch. |
| livemode | Boolean | Has the value true if the object exists in live mode or the value false if the object exists in test mode. |
| type | String | The type of the PaymentMethod. An additional hash is included on the PaymentMethod with a name matching this value. It contains additional information specific to the PaymentMethod type. |
| billingDetails | Object | Billing information associated with the PaymentMethod that may be used or required by particular types of payment methods. |
| card | Object | If this is a card PaymentMethod, this hash contains details about the card. |
| customerId | String | The ID of the Customer to which this PaymentMethod is saved. This will not be set when the PaymentMethod has not been saved to a Customer. |


##### `billingDetails`

| Key | Type | Description |
| :--- | :--- | :--- |
| address | Object | Billing address. |
| email | String | Billing email address |
| name | String | Billing full name |
| phone | String | Billing phone number (including extension) |

##### `card`

| Key | Type | Description |
| :--- | :--- | :--- |
| brand | String | Card brand. Can be amex, diners, discover, jcb, mastercard, unionpay, visa, or unknown. |
| country | String | Two-letter ISO code representing the country of the card. You could use this attribute to get a sense of the international breakdown of cards you’ve collected. |
| expMonth | Number | Two-digit number representing the card's expiration month. |
| expYear | Number| Two- or four-digit number representing the card's expiration year. |
| funding | String | Card funding type. Can be credit, debit, prepaid, or unknown. |
| last4 | String | The last four digits of the card. |


##### `address`

| Key | Type | Description |
| :--- | :--- | :--- |
| city | String | City/District/Suburb/Town/Village. |
| country | String | 2-letter country code. |
| line1 | String | Address line 1 (Street address/PO Box/Company name). |
| line2 | String | Address line 2 (Apartment/Suite/Unit/Building). |
| postalCode | String | ZIP or postal code. |
| state | String | State/County/Province/Region. |



# Example

```js
{
  id: 'pm_1F75IyHbHFZUJkLLCzktveuG',
  
  created: 1565799374,
  
  livemode: false,
  
  type: 'card',

  card: {
    brand: 'visa',
    country: 'us',
    expMonth: 11,
    expYear: 2040,
    funding: 'credit',
    last4: '0123',
  },
  
  billingDetails: {
    address: {
      city: 'New York',
      country: 'US',
      line1: '11 Wall St.',
      line2: 'Suite 1200',
      postalCode: '10005',
      state: 'New York',
    },
    email: 'abc@xyz.com',
    name: 'Jason Bourne',
    phone: '123-456-7890',
  },
  
  customerId: 'cus_ab3c4a756d0837uz',
  
}
```
