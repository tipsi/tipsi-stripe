import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import stripe from 'tipsi-stripe'
import Button from '../components/Button'
import testID from '../utils/testID'

export default class AndroidPayScreen extends PureComponent {
  static title = 'Android Pay'

  state = {
    loading: false,
    allowed: false,
    token: null,
  }

  async componentWillMount() {
    const allowed = await stripe.deviceSupportsNativePay()

    this.setState({ allowed })
  }

  handleAndroidPayPress = async () => {
    try {
      this.setState({
        loading: true,
        token: null,
      })
      const token = await stripe.paymentRequestWithNativePay({
        total_price: '100.00',
        currency_code: 'USD',
        shipping_address_required: true,
        phone_number_required: true,
        shipping_countries: ['US', 'CA'],
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
      this.setState({ loading: false, token })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  render() {
    const { loading, allowed, token } = this.state
    return (
      <View style={styles.container}>
        <Text style={styles.header} {...testID('headerText')}>
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
          onPress={this.handleAndroidPayPress}
          {...testID('androidPayButton')}
        />
        <View
          style={styles.token}
          {...testID('androidPayToken')}>
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
