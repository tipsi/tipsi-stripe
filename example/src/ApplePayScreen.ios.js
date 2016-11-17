import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import stripe from 'tipsi-stripe'
import Button from './Button'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    margin: 10,
    borderWidth: 1,
  },
  token: {
    height: 20,
  },
})

export default class ApplePayScreen extends Component {
  state = {
    loading: false,
    allowed: false,
    token: null,
  }

  async componentWillMount() {
    const allowed = await stripe.deviceSupportsApplePay()
    this.setState({ allowed })
  }

  handleApplePayPress = async () => {
    try {
      this.setState({
        loading: true,
        token: null,
      })
      const token = await stripe.paymentRequestWithApplePay([{
        label: 'Whisky',
        amount: '50.00',
      }, {
        label: 'Vine',
        amount: '60.00',
      }, {
        label: 'Tipsi',
        amount: '110.00',
      }], {
        // requiredBillingAddressFields: 'all',
        // requiredShippingAddressFields: 'all',
        shippingMethods: [{
          id: 'fedex',
          label: 'FedEX',
          detail: 'Test @ 10',
          amount: '10.00',
        }],
      })
      console.log('Result:', token) // eslint-disable-line no-console
      await stripe.completeApplePayRequest()
      console.log('Apple Pay payment completed') // eslint-disable-line no-console
      this.setState({
        loading: false,
        token,
      })
    } catch (error) {
      console.log('Error:', error) // eslint-disable-line no-console
      this.setState({
        loading: false,
      })
    }
  }

  render() {
    const { loading, allowed, token } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Apple Pay Example
        </Text>
        <Text style={styles.instruction}>
          Click button to show Apple Pay dialog.
        </Text>
        <Button
          text="Pay with Pay"
          disabledText="Not supported"
          loading={loading}
          disabled={!allowed}
          style={styles.button}
          accessible
          accessibilityLabel={'applePayButton'}
          onPress={this.handleApplePayPress}
        />
        <View style={styles.token}>
          {token &&
            <Text style={styles.instruction}>
              Token: {token.tokenId}
            </Text>
          }
        </View>
      </View>
    )
  }
}
