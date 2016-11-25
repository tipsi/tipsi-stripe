import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Stripe from 'tipsi-stripe'
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

export default class AndroidPayScreen extends Component {
  state = {
    loading: false,
    allowed: true,
    token: null,
  }

  handleAndroidPayPress = async () => {
    try {
      this.setState({
        loading: true,
        token: null,
      })
      const result = await Stripe.paymentRequestWithAndroidPay({
        total_price: '100.00',
        currency_code: 'USD',
        line_items: [{
                       currency_code: 'USD',
                       description: 'Whisky',
                       total_price: '50.00',
                       unit_price: '50.00',
                       quantity: '1',
                      }, {
                        currency_code: 'USD',
                        description: 'Vine',
                        total_price: '30.00',
                        unit_price: '30.00',
                        quantity: '1',
                      }, {
                        currency_code: 'USD',
                        description: 'Tipsi',
                        total_price: '20.00',
                        unit_price: '20.00',
                        quantity: '1',
                      }],
      })
      console.log('Result:', result)
      this.setState({
        loading: false,
        token: result.token,
      })
    } catch (error) {
      console.log('Error:', error)
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
          Android Pay Example
        </Text>
        <Text style={styles.instruction}>
          Click button to show Android Pay dialog.
        </Text>
        <Button
          text="Pay with Android Pay"
          disabledText="Not supported"
          loading={loading}
          disabled={!allowed}
          style={styles.button}
          accessible
          accessibilityLabel={'androidPayButton'}
          onPress={this.handleAndroidPayPress}
        />
        <View
          style={styles.token}
          accessible
          accessibilityLabel={'androidPayToken'}>
          {token &&
            <Text style={styles.instruction}>
              Token: {token}
            </Text>
          }
        </View>
      </View>
    )
  }
}
