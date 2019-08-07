import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import stripe from 'tipsi-stripe'
import Button from '../components/Button'
import testID from '../utils/testID'
import { demoCardFormParameters,
  demoPaymentMethodDetailsWithCard,
  demoPaymentMethodDetailsWithToken } from './demodata/demodata'

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
        paymentMethod: demoPaymentMethodDetailsWithCard(cardNumber)
      })

      console.log(confirmPaymentResult);
      this.setState( {...this.state, loading: false, confirmPaymentResult} )
    } catch (e) {
      console.log(e)
      this.setState( {...this.state, loading: false} )
    }
  }

  onLaunchCardForm = async () => {
    try {
      this.setState({...this.state, loading: true, token: null })
      const token = await stripe.paymentRequestWithCardForm(
        demoCardFormParameters
      )

      this.setState({...this.state, token: token.tokenId })

      // We now have the token, use it to confirm
      let confirmPaymentResult = await stripe.confirmPayment({
        clientSecret: this.state.paymentIntent.secret,
        paymentMethod: demoPaymentMethodDetailsWithToken(token.tokenId)
      })

      this.setState({...this.state, confirmPaymentResult})
    } catch (error) {
      this.setState({ loading: false })
    }
  }


  render() {

    const {
      error, loading, paymentIntent, paymentMethod,
      confirmPaymentResult, token
    } = this.state

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

            <View style={styles.row}>
              <Button
                style={styles.rowButton}
                text="Attach Test Card"
                loading={loading}
                onPress={() => this.onAttachPaymentMethod(AUTHENTICATION_CHALLENGE_CARD)}
                {...testID('attachTestCard')}
              />
              <Button
                style={styles.rowButton}
                text="Enter Card"
                loading={loading}
                onPress={() => this.onLaunchCardForm()}
                {...testID('launchCardForm')}
              />
            </View>
            {token && (
              <Text style={styles.content} {...testID('token')}>
                token: {JSON.stringify(token)}
              </Text>
            )}
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
  row: {
    flexDirection: 'row',
  },
  rowButton: {
    flex: 1
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
