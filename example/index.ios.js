import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native'
import Stripe from 'tipsi-stripe'

Stripe.init({
  publishableKey: '<PUBLISHABLE_KEY>',
  merchantId: '<MERCHANT_ID>',
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  pay: {
    padding: 10,
    height: 35,
    width: 160,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: 'white',
    alignItems: 'center',
  },
})

export default class example extends Component {
  state = {
    token: null,
    loadingButton: null,
    applePayIsAllowed: false,
  }

  async componentWillMount() {
    const applePayIsAllowed = await Stripe.deviceSupportsApplePay()
    this.setState({ applePayIsAllowed })
  }

  handleApplePayPress = async () => {
    try {
      this.setState({
        loadingButton: 'apple',
        token: null,
      })
      const result = await Stripe.paymentRequestWithApplePay([{
        label: 'Whisky',
        amount: '50.00',
      }, {
        label: 'Vine',
        amount: '60.00',
      }, {
        label: 'Tipsi',
        amount: '110.00',
      }], {
        requiredBillingAddressFields: true,
        requiredShippingAddressFields: true,
        shippingMethods: [{
          id: 'test',
          label: 'Test',
          detail: 'Test @ 10',
          amount: '10.01',
        }],
      })
      console.log('Result:', result)
      await Stripe.completeApplePayRequest()
      console.log('Apple Pay payment completed')
      this.setState({
        loadingButton: null,
        token: result.token,
      })
    } catch (error) {
      console.log('Error:', error)
      this.setState({
        loadingButton: null,
      })
    }
  }

  handleCardPayPress = async () => {
    try {
      this.setState({
        loadingButton: 'form',
        token: null,
      })
      const result = await Stripe.paymentRequestWithCardForm('110', {})
      console.log('Result:', result)
      this.setState({
        loadingButton: null,
        token: result.token,
      })
    } catch (error) {
      console.log('Error:', error)
      this.setState({
        loadingButton: null,
      })
    }
  }

  handleCustomPayPress = async () => {
    try {
      this.setState({
        loadingButton: 'card',
        token: null,
      })
      const result = await Stripe.createTokenWithCard({
        number: '4242424242424242',
        expMonth: 11,
        expYear: 17,
        cvc: '223',
        name: 'Test User',
        currency: 'usd',
      }, {})
      console.log('Result:', result)
      this.setState({
        loadingButton: null,
        token: result.token,
      })
    } catch (error) {
      console.log('Error:', error)
      this.setState({
        loadingButton: null,
      })
    }
  }

  render() {
    const { loadingButton, applePayIsAllowed, token } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Stripe Example
        </Text>
        <TouchableHighlight
          style={styles.pay}
          underlayColor="rgba(0,0,0,0.5)"
          onPress={this.handleApplePayPress}>
          <View>
            {loadingButton === 'apple' &&
              <ActivityIndicator
                animating
                size="small"
              />
            }
            {(loadingButton !== 'apple') && applePayIsAllowed &&
              <Text>
                Pay with Pay
              </Text>
            }
            {!loadingButton && !applePayIsAllowed &&
              <Text>
                Not allowed :(
              </Text>
            }
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.pay}
          underlayColor="rgba(0,0,0,0.5)"
          onPress={this.handleCardPayPress}>
          <View>
            {loadingButton === 'form' &&
              <ActivityIndicator
                animating
                size="small"
              />
            }
            {loadingButton !== 'form' &&
              <Text>
                Pay with card form
              </Text>
            }
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.pay}
          underlayColor="rgba(0,0,0,0.5)"
          onPress={this.handleCustomPayPress}>
          <View>
            {loadingButton === 'card' &&
              <ActivityIndicator
                animating
                size="small"
              />
            }
            {loadingButton !== 'card' &&
              <Text>
                Pay with custom card
              </Text>
            }
          </View>
        </TouchableHighlight>
        <Text style={styles.instructions}>
          Token: {token || '-'}
        </Text>
      </View>
    )
  }
}

AppRegistry.registerComponent('example', () => example)
