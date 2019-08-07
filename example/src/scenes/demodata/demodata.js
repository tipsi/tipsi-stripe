

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
