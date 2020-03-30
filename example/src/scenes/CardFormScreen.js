import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import stripe from 'tipsi-stripe'
import Button from '../components/Button'
import testID from '../utils/testID'
import { demoCardFormParameters } from './demodata/demodata'

export default class CardFormScreen extends PureComponent {
  static title = 'Card Form'

  state = {
    loading: false,
    paymentMethod: null,
  }

  handleCardPayPress = async () => {
    try {
      this.setState({ loading: true, paymentMethod: null })

      const paymentMethod = await stripe.paymentRequestWithCardForm(demoCardFormParameters)

      this.setState({ loading: false, paymentMethod })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  render() {
    const { loading, paymentMethod } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Card Form Example</Text>
        <Text style={styles.instruction}>Click button to show Card Form dialog.</Text>
        <Button
          text="Enter you card and pay"
          loading={loading}
          onPress={this.handleCardPayPress}
          {...testID('cardFormButton')}
        />
        <View style={styles.paymentMethod} {...testID('cardFormPaymentMethod')}>
          {paymentMethod && (
            <Text style={styles.instruction}>Payment Method: {JSON.stringify(paymentMethod)}</Text>
          )}
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
  paymentMethod: {
    height: 20,
  },
})
