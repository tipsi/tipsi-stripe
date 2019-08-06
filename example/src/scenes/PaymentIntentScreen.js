import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import stripe from 'tipsi-stripe'
import Button from '../components/Button'
import testID from '../utils/testID'

export default class PaymentIntentScreen extends PureComponent {

  static BACKEND_URL = "<BACKEND_URL>"
                // See https://github.com/mindlapse/example-tipsi-stripe-backend for
                // an example backend that can be deployed to Heroku in a few clicks
                // with your *own* Stripe test-mode secret key.
                // Once deployed, provide the URL of the backend.
                // This value is replaced during the build by example/scripts/configure.sh


  static title = 'Payment Intents'

  state = {
    error: null,
    loading: false,
    paymentMethod: null,
    paymentIntent: null,
    confirmPaymentResult: null
  }

  onCreatePaymentIntent = async () => {
    this.setState({ loading: true, paymentIntent: null })
    try {
      const response = await fetch(PaymentIntentScreen.BACKEND_URL + '/create_intent', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 2000,
          currency: 'usd',
        }),
      })
      const result = await response.json()

      this.setState({ loading: false, paymentIntent: result })
    } catch (e) {
      console.log(e)
      this.setState({ loading: false, paymentIntent: null })
    }
  }

  onAttachPaymentMethod = async (cardNumber) => {
    this.setState( {...this.state, loading: true} )
    try {
      let confirmPaymentResult = await stripe.confirmPayment({
        clientSecret: this.state.paymentIntent.secret,
        paymentMethod: {
          // BillingDetails properties:
          billingDetails: {
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
          },

          card: {
            cvc: '242',
            expMonth: 11,
            expYear: 2040,
            number: cardNumber,
          }
        }
      })
      console.log(confirmPaymentResult);
      this.setState( {...this.state, loading: false, confirmPaymentResult} )
    } catch (e) {
      console.log(e)
      this.setState( {...this.state, loading: false} )
    }
  }


  render() {
    const { error, loading, paymentIntent, paymentMethod, confirmPaymentResult } = this.state
    const NO_AUTHENTICATION_CHALLENGE_CARD = "4242424242424242"
    const AUTHENTICATION_CHALLENGE_CARD = "4000002760003184"

    return (
      <View>
        <Text style={styles.header}>
          Create Payment Intent
        </Text>

        <Button
          text="Create Payment Intent"
          loading={loading}
          onPress={() => this.onCreatePaymentIntent()}
          {...testID('noAuthButton')}
        />

        {paymentIntent && (
          <>
            <Text style={styles.content} {...testID('paymentIntentObject')}>
                Source: {JSON.stringify(paymentIntent)}
            </Text>

            <Button
              text="Attach Test Card"
              loading={loading}
              onPress={() => this.onAttachPaymentMethod(AUTHENTICATION_CHALLENGE_CARD)}
              {...testID('attachTestCard')}
            />
            {confirmPaymentResult && (
              <Text style={styles.content} {...testID('confirmPaymentResult')}>
                confirmPaymentResult: {JSON.stringify(confirmPaymentResult)}
              </Text>
            )}
          </>
        )}

        {error && (
          <Text style={[styles.content, styles.error]} {...testID('errorObject')}>
            Error: {JSON.stringify(error)}
          </Text>
        )}
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  content: {
    color: '#333333',
    margin: 8,
    textAlign: 'center',
    width: '100%',
  },
  error: {
    color: 'darkred',
  },
})
