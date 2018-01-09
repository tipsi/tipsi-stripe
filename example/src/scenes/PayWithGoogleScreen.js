import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import stripe from 'tipsi-stripe'
import Button from '../components/Button'
import testID from '../utils/testID'

export default class PayWithGoogleScreen extends PureComponent {
  static title = 'Pay With Google'

  state = {
    loading: false,
    allowed: false,
    token: null,
  }

  async componentWillMount() {
    const allowed = await stripe.deviceSupportsPayWithGoogle()
    this.setState({ allowed })
  }

  handlePayWithGooglePress = async () => {
    try {
      this.setState({
        loading: true,
        token: null,
      })
      const token = await stripe.paymentRequestWithPayWithGoogle({
        price: '100.00',
        phoneNumberRequired: false,
        emailRequired: false,
        shippingAddressRequired: true,
        shipping_countries: ["US", "CA"],
      })
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
    const { loading, allowed, token } = this.state
    return (
      <View style={styles.container}>
        <Text style={styles.header} {...testID('headerText')}>
          Pay With Google Example
        </Text>
        <Text style={styles.instruction}>
          Click button to show Pay With Google dialog.
        </Text>
        <Button
          text="Pay with Google"
          disabledText="Not supported"
          loading={loading}
          disabled={!allowed}
          onPress={this.handlePayWithGooglePress}
          {...testID('payWithGoogleButton')}
        />
        <View
          style={styles.token}
          {...testID('payWithGoogleToken')}>
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
  token: {
    height: 20,
  },
})
