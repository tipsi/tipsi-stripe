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

export default class CardFormScreen extends Component {
  state = {
    loading: false,
    token: null,
  }

  handleCardPayPress = async () => {
    try {
      this.setState({
        loading: true,
        token: null,
      })
      const result = await Stripe.paymentRequestWithCardForm({})

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
    const { loading, token } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Card Form Example
        </Text>
        <Text style={styles.instruction}>
          Click button to show Card Form dialog.
        </Text>
        <Button
          text="Enter you card and pay"
          loading={loading}
          style={styles.button}
          accessible
          accessibilityLabel={'cardFormButton'}
          onPress={this.handleCardPayPress}
        />
        <View
          style={styles.token}
          accessible
          accessibilityLabel={'cardFormToken'}>
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