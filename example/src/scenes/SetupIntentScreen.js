import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import stripe from 'tipsi-stripe'
import Button from '../components/Button'
import testID from '../utils/testID'
import {
  demoPaymentMethodDetailsWithCard,
  demoPaymentMethodDetailsWithToken,
  demoTestCards,
} from './demodata/demodata'

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
    confirmSetupResult: null,
  }

  defaultState = { ...this.state }

  reset = ({ loading = false }) => {
    this.setState({
      loading,
      ...this.defaultState,
    })
  }

  onCreateSetupIntent = async () => {
    this.reset({ loading: true })
    try {
      const response = await fetch(`${SetupIntentScreen.BACKEND_URL}/create_setup_intent`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
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
    this.setState({ ...this.state, loading: true })
    try {
      const confirmSetupResult = await stripe.confirmSetupIntent({
        clientSecret: this.state.setupIntent.secret,
        paymentMethod: demoPaymentMethodDetailsWithCard(cardNumber),
      })

      this.setState({ ...this.state, loading: false, confirmSetupResult })
    } catch (e) {
      console.log('error')
      console.dir(e)
      this.setState({ ...this.state, loading: false, confirmSetupResult: e })
    }
  }

  render() {
    const { error, loading, setupIntent, confirmSetupResult, showCardSelection } = this.state

    const onShowCardSelection = () =>
      this.setState({ ...this.state, showCardSelection: !showCardSelection })

    return (
      <ScrollView style={styles.column}>
        <Text style={styles.header}>Create Setup Intent</Text>

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

            {confirmSetupResult && (
              <Text style={styles.content} {...testID('confirmSetupResult')}>
                confirmSetupResult: {JSON.stringify(confirmSetupResult)}
              </Text>
            )}

            <View style={styles.row}>
              <Button
                style={styles.rowButton}
                text="Attach Test Card"
                loading={loading}
                onPress={onShowCardSelection}
                {...testID('attachTestCard')}
              />
            </View>

            {showCardSelection &&
              demoTestCards.map((card, idx) => (
                <View style={styles.row} key={card.number}>
                  <Button
                    {...testID(card.name)}
                    style={styles.rowButton}
                    text={`${card.name} - ${card.last4}`}
                    loading={loading}
                    onPress={() => this.onAttachPaymentMethod(card.number)}
                  />
                </View>
              ))}
          </>
        )}

        {error && (
          <Text style={[styles.content, styles.error]} {...testID('errorObject')}>
            Error: {JSON.stringify(error)}
          </Text>
        )}
      </ScrollView>
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
  column: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  rowButton: {
    flex: 1,
    alignSelf: 'center',
  },
  error: {
    color: 'darkred',
  },
})
