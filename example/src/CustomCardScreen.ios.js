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
  params: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'flex-start',
    margin: 5,
  },
})

export default class CustomCardScreen extends Component {
  state = {
    loading: false,
    token: null,
    params: {
      number: '4242424242424242',
      expMonth: 11,
      expYear: 17,
      cvc: '223',
      name: 'Test User',
      currency: 'usd',
    },
  }

  handleCustomPayPress = async () => {
    try {
      this.setState({
        loading: true,
        token: null,
      })
      const token = await stripe.createTokenWithCard(this.state.params)
      console.log('Result:', token) // eslint-disable-line no-console
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
    const { loading, token, params } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Custom Card Params Example
        </Text>
        <View style={styles.params}>
          <Text style={styles.instruction}>
            Number: {params.number}
          </Text>
          <Text style={styles.instruction}>
            Month: {params.expMonth}
          </Text>
          <Text style={styles.instruction}>
            Year: {params.expYear}
          </Text>
          <Text style={styles.instruction}>
            CVC: {params.cvc}
          </Text>
          <Text style={styles.instruction}>
            Name: {params.name}
          </Text>
          <Text style={styles.instruction}>
            Currency: {params.currency.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.instruction}>
          Click button to get token based on params.
        </Text>
        <Button
          text="Pay with custom params"
          loading={loading}
          style={styles.button}
          accessible
          accessibilityLabel={'customCardButton'}
          onPress={this.handleCustomPayPress}
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
