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
  publishableKey: 'pk_test_m3kEfDWERg2qNxwlikeKzeEI',
  merchantId: 'merchant.com.tipsi.applepaytest',
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
    width: 120,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: 'white',
    alignItems: 'center',
  },
})

export default class example extends Component {
  state = {
    isLoading: false,
    applePayIsAllowed: false,
  }

  async componentWillMount() {
    this.setState({
      isLoading: true,
    })

    const applePayIsAllowed = await Stripe.deviceSupportsApplePay()

    this.setState({
      isLoading: false,
      applePayIsAllowed,
    })
  }

  handlePayPress = async () => {
    try {
      const token = await Stripe.paymentRequestWithApplePay([{
        label: 'Whisky',
        amount: '50.00',
      }, {
        label: 'Vine',
        amount: '60.00',
      }, {
        label: 'Tipsi',
        amount: '110.00',
      }], {})
      console.log('TOKEN:', token)
      await Stripe.completePayment()
      console.log('Payment completed')
    } catch (error) {
      console.log('ERROR:', error)
    }
  }

  render() {
    const { isLoading, applePayIsAllowed } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <TouchableHighlight
          style={styles.pay}
          underlayColor="rgba(0,0,0,0.5)"
          onPress={this.handlePayPress}>
          <View>
            {isLoading &&
              <ActivityIndicator
                animating
                size="small"
              />
            }
            {!isLoading && applePayIsAllowed &&
              <Text>
                Pay with Pay
              </Text>
            }
            {!isLoading && !applePayIsAllowed &&
              <Text>
                Not allowed :(
              </Text>
            }
          </View>
        </TouchableHighlight>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    )
  }
}

AppRegistry.registerComponent('example', () => example)
