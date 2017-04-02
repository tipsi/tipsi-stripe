import React, { Component } from 'react'
import { View, Text, Switch, StyleSheet } from 'react-native'
import stripe from 'tipsi-stripe'
import Button from '../components/Button'
import testID from '../utils/testID'

/* eslint-disable no-console */
export default class ApplePayScreen extends Component {
  state = {
    loading: false,
    allowed: false,
    complete: true,
    status: null,
    token: null,
  }

  async componentWillMount() {
    const allowed = await stripe.deviceSupportsApplePay()
    this.setState({ allowed })
  }

  handleCompleteChange = (complete) => (
    this.setState({ complete })
  )

  handleApplePayPress = async () => {
    try {
      this.setState({
        loading: true,
        status: null,
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

      console.log('Result:', token)
      this.setState({ loading: false, token })

      if (this.state.complete) {
        await stripe.completeApplePayRequest()
        console.log('Apple Pay payment completed')
        this.setState({ status: 'Apple Pay payment completed'})
      } else {
        await stripe.cancelApplePayRequest()
        console.log('Apple Pay payment cenceled')
        this.setState({ status: 'Apple Pay payment cenceled'})
      }
    } catch (error) {
      console.log('Error:', error)
      this.setState({ loading: false, status: `Error: ${error.message}` })
    }
  }

  render() {
    const { loading, allowed, complete, status, token } = this.state

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
          onPress={this.handleApplePayPress}
          {...testID('applePayButton')}
        />
        <Text style={styles.instruction}>
          Complete the operation on tokent
        </Text>
        <Switch
          style={styles.switch}
          value={complete}
          onValueChange={this.handleCompleteChange}
          {...testID('applePaySwitch')}
        />
        <View style={styles.token}>
          {token &&
            <Text
              style={styles.instruction}
              {...testID('applePayToken')}>
              Token: {token.tokenId}
            </Text>
          }
          {status &&
            <Text
              style={styles.instruction}
              {...testID('applePayStatus')}>
              {status}
            </Text>
          }
        </View>
      </View>
    )
  }
}

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
  switch: {
    marginBottom: 10,
  },
  token: {
    height: 20,
  },
})
