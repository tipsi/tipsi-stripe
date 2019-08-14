

export const demoCardFormParameters = {
  // Only iOS support this options
  smsAutofillDisabled: true,
  requiredBillingAddressFields: 'full',
  prefilledInformation: {
    billingAddress: {
      name: 'Gunilla Haugeh',
      line1: 'Canary Place',
      line2: '3',
      city: 'Macon',
      state: 'Georgia',
      country: 'US',
      postalCode: '31217',
      email: 'ghaugeh0@printfriendly.com',
    },
  },
}

export const demoBillingDetails = {
  address: {
    city: 'New York',
    country: 'US',
    line1: '11 Wall St.',
    postalCode: '10005',
    state: 'New York',
  },
  email: 'abc@xyz.com',
  name: 'Jason Bourne',
  phone: '123-456-7890',
}


export const demoPaymentMethodDetailsWithCard = cardNumber => ({

  billingDetails: demoBillingDetails,

  card: {
    cvc: '242',
    expMonth: 11,
    expYear: 2040,
    number: cardNumber,
  }
})


export const demoPaymentMethodDetailsWithToken = token => ({

  billingDetails: demoBillingDetails,

  card: {
    token
  }
})


export const demoTestCards = [
  { name: "Always Authenticate",  number: "4000002500003155", last4: "3155" },
  { name: "Auth and Decline",     number: "4000008260003178", last4: "3178" },
  { name: "3DS2",                 number: "4000000000003220", last4: "3220" },
  { name: "3DS1",                 number: "4000000000003063", last4: "3063" },
  { name: "No 3DS - succeed",     number: "378282246310005",  last4: "0005" },
  { name: "No 3DS - decline",     number: "4000000000000002", last4: "0002" },
]
