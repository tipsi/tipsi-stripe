import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import stripe from 'tipsi-stripe'
import Button from '../components/Button'
import testID from '../utils/testID'
import {
  demoCardFormParameters,
  demoPaymentMethodDetailsWithCard,
  demoPaymentMethodDetailsWithToken,
  demoBillingDetails,
  demoTestCards,
} from './demodata/demodata'

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
    display: null,
    showCardSelection: false,
  }

  defaultState = { ...this.state }

  reset = ({ withState = {} }) => {
    this.setState({
      ...this.defaultState,
      ...withState,
    })
  }

  onCreatePaymentIntent = async ({ confirmationMethod = 'automatic' }) => {
    this.reset({ withState: { loading: true, confirmationMethod } })
    try {
      const response = await fetch(`${PaymentIntentScreen.BACKEND_URL}/create_intent`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 2000,
          currency: 'usd',
          confirmationMethod,
          confirm: false,
        }),
      })
      const result = await response.json()

      this.setState({ loading: false, paymentIntent: result })
    } catch (e) {
      console.log(e)
      this.setState({ loading: false, paymentIntent: null })
    }
  }

  attachPaymentMethodAndConfirmPayment = async (paymentIntentId, paymentMethodId) => {
    let post = {
      payment_intent_id: paymentIntentId,
    }

    if (paymentMethodId) {
      post = { ...post, payment_method: paymentMethodId }
    }

    const response = await fetch(`${PaymentIntentScreen.BACKEND_URL}/confirm_payment`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    })

    const body = await response.json()
    console.log('Received response', body)
    if (response.status === 200) {
      return body
    }
    const display = {
      status: body.status,
      message: body.message,
      code: body.code,
      json: body.json,
    }

    console.log('Non-200 response', display)
    return display
  }

  handleAuthenticationChallenge = async ({ clientSecret }) => {
    let response = null
    try {
      console.log('Calling stripe.authenticatePaymentIntent()')
      const authResponse = await stripe.authenticatePaymentIntent({
        clientSecret,
      })
      console.log('stripe.authenticatePaymentIntent()', authResponse)

      if (authResponse.status === 'requires_payment_method') {
        response = {
          message: 'Authentication failed, a new PaymentMethod needs to be attached.',
          status: authResponse.status,
        }
      } else if (authResponse.status === 'requires_confirmation') {
        response = {
          message: 'Authentication passed, requires confirmation (server-side)',
          status: authResponse.status,
        }
      } else {
        response = {
          message: 'Unexpected.',
          raw: authResponse,
        }
      }
    } catch (e) {
      console.error(e)
    }
    return response
  }

  onAttachPaymentMethod = async (cardNumber) => {
    this.setState({ ...this.state, loading: true })

    if (this.state.confirmationMethod === 'manual') {
      // Create a payment method
      console.log('Calling stripe.createPaymentMethod()')

      let paymentMethod
      try {
        paymentMethod = await stripe.createPaymentMethod(
          demoPaymentMethodDetailsWithCard(cardNumber)
        )
      } catch (e) {
        console.dir(e)
        // One way a payment method can fail to be created is if the card number is invalid
        this.setState({ ...this.state, loading: false, display: e })
        return
      }

      console.log('Payment Method', paymentMethod)
      console.log('Payment Intent', this.state.paymentIntent)

      // Send the payment method to the server and ask it to confirm.
      console.log('Calling /confirm_payment on backend example server')

      let confirmResult = null
      try {
        confirmResult = await this.attachPaymentMethodAndConfirmPayment(
          this.state.paymentIntent.intent,
          paymentMethod.id
        )
      } catch (e) {
        console.error(e)
      }

      // The body can be null here if the payment was declined in the previous step
      if (confirmResult) {
        let response = null

        if (confirmResult.status == 'requires_action') {
          console.log('Payment method requires_action')

          response = await this.handleAuthenticationChallenge({
            clientSecret: confirmResult.secret,
          })

          if (response.status == 'requires_confirmation') {
            response = await this.attachPaymentMethodAndConfirmPayment(
              this.state.paymentIntent.intent,
              null
            )
            console.log('response from confirming after successfully authenticating', response)
          }
        } else if (confirmResult.status === 'succeeded') {
          response = {
            message: 'payment succeeded without requiring authentication',
          }
          console.log('Succeeded')
        } else if (confirmResult.status === 'requires_payment_method') {
          // The initial confirm did not require_action - a new payment method is required instead.
          response = confirmResult
        }
        this.setState({ ...this.state, loading: false, display: response })
      }
    } else if (this.state.confirmationMethod === 'automatic') {
      // Here we're in automatic confirmation mode.
      // In this mode, we can confirm the payment from the client side and
      // fulfill the order on the client side by listening to webhooks.

      // For cards, we also get immediate confirmation of the outcome of the payment.

      let display = null
      try {
        console.log('Confirming')
        const confirmPaymentResult = await stripe.confirmPaymentIntent({
          clientSecret: this.state.paymentIntent.secret,
          paymentMethod: demoPaymentMethodDetailsWithCard(cardNumber),
        })
        display = confirmPaymentResult
      } catch (e) {
        // One way we can arrive here is if the payment intent had previously succeeded.

        console.dir(e)
        display = {
          message: e.message,
          code: e.code,
        }
      }
      this.setState({ ...this.state, loading: false, display })
    }
  }

  onLaunchCardForm = async () => {
    try {
      this.setState({ ...this.state, loading: true, token: null })
      const token = await stripe.paymentRequestWithCardForm(demoCardFormParameters)

      this.setState({ ...this.state, token: token.tokenId })

      // We now have the token, use it to confirm
      const confirmPaymentResult = await stripe.confirmPaymentIntent({
        clientSecret: this.state.paymentIntent.secret,
        paymentMethod: demoPaymentMethodDetailsWithToken(token.tokenId),
      })
      const display = confirmPaymentResult

      this.setState({ ...this.state, display })
    } catch (e) {
      console.log(e)
      this.setState({ loading: false })
    }
  }

  render() {
    const { error, loading, paymentIntent, display, token, showCardSelection } = this.state

    const onShowCardSelection = () => {
      this.setState({ ...this.state, showCardSelection: !showCardSelection })
    }

    return (
      <ScrollView>
        <Text style={styles.header}>Create Payment Intent</Text>

        <View style={styles.row}>
          <Button
            text="Create (Manual)"
            loading={loading}
            onPress={() => this.onCreatePaymentIntent({ confirmationMethod: 'manual' })}
            {...testID('noAuthButton')}
          />

          <Button
            text="Create (Automatic)"
            loading={loading}
            onPress={() => this.onCreatePaymentIntent({ confirmationMethod: 'automatic' })}
            {...testID('noAuthButton')}
          />
        </View>

        {paymentIntent && (
          <>
            <Text style={styles.content} {...testID('paymentIntentObject')}>
              Source: {JSON.stringify(paymentIntent)}
            </Text>

            {token && (
              <Text style={styles.content} {...testID('token')}>
                token: {JSON.stringify(token)}
              </Text>
            )}
            {display && (
              <Text style={styles.content} {...testID('display')}>
                {JSON.stringify(display)}
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
              <Button
                style={styles.rowButton}
                text="Enter Card"
                loading={loading}
                onPress={this.onLaunchCardForm}
                {...testID('launchCardForm')}
              />
            </View>
            {showCardSelection &&
              demoTestCards.map((card) => (
                <View style={styles.row} key={card.name}>
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
    flex: 1,
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
