import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import stripe from 'tipsi-stripe'
import Button from '../components/Button'
import testID from '../utils/testID'

export default class SetupIntentScreen extends PureComponent {

  static BACKEND_URL = "<BACKEND_URL>"
                // See https://github.com/mindlapse/example-tipsi-stripe-backend for
                // an example backend that can be deployed to Heroku in a few clicks
                // with your *own* Stripe test-mode secret key.
                // Once deployed, provide the URL of the backend.
                // This value is replaced during the build by example/scripts/configure.sh

  static title = 'Setup Intents'

  state = {
    error: null,
    loading: false,
    setupIntent: null,
    confirmSetupResult: null
  }

  onCreateSetupIntent = async () => {
    this.setState({ loading: true, setupIntent: null })
    try {
      const response = await fetch(SetupIntentScreen.BACKEND_URL + '/create_setup_intent', {
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

      this.setState({ loading: false, setupIntent: result })
    } catch (e) {
      console.log(e)
      this.setState({ loading: false, setupIntent: null })
    }
  }

  onAttachPaymentMethod = async (cardNumber) => {
    this.setState( {...this.state, loading: true} )
    try {
      console.log(stripe)
      console.log(stripe.confirmSetupIntent)
      let confirmSetupResult = await stripe.confirmSetupIntent({
        clientSecret: this.state.setupIntent.secret,
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
      console.log(confirmSetupResult);
      this.setState( {...this.state, loading: false, confirmSetupResult} )
    } catch (e) {
      console.log(e)
      this.setState( {...this.state, loading: false} )
    }
  }


  render() {
    const { error, loading, setupIntent, confirmSetupResult } = this.state
    const AUTHENTICATION_CHALLENGE_CARD = "4000002760003184"

    return (
      <View>
        <Text style={styles.header}>
          Create Setup Intent
        </Text>

        <Button
          text="Create SetupIntent Intent"
          loading={loading}
          onPress={() => this.onCreateSetupIntent()}
          {...testID('createSetupIntentButton')}
        />

        {setupIntent && (
          <>
            <Text style={styles.content} {...testID('setupIntentObject')}>
                Source: {JSON.stringify(setupIntent)}
            </Text>

            <Button
              text="Attach Test Card"
              loading={loading}
              onPress={() => this.onAttachPaymentMethod(AUTHENTICATION_CHALLENGE_CARD)}
              {...testID('attachTestCard')}
            />
            {confirmSetupResult && (
              <Text style={styles.content} {...testID('confirmSetupResult')}>
                confirmSetupResult: {JSON.stringify(confirmSetupResult)}
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
