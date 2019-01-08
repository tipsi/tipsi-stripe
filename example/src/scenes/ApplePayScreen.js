import React, { PureComponent } from 'react'
import { View, Text, Switch, StyleSheet } from 'react-native'
import stripe from 'tipsi-stripe'
import Button from '../components/Button'
import testID from '../utils/testID'

/* eslint-disable no-console */
export default class ApplePayScreen extends PureComponent {
  static title = 'Pay'

  state = {
    loading: false,
    allowed: false,
    complete: true,
    status: null,
    token: null,
    amexAvailable: false,
    discoverAvailable: false,
    masterCardAvailable: false,
    visaAvailable: false,
  }

  async componentWillMount() {
    const allowed = await stripe.deviceSupportsNativePay()
    const amexAvailable = await stripe.canMakeNativePayPayments({
      networks: ['american_express'],
    })
    const discoverAvailable = await stripe.canMakeNativePayPayments({
      networks: ['discover'],
    })
    const masterCardAvailable = await stripe.canMakeNativePayPayments({
      networks: ['master_card'],
    })
    const visaAvailable = await stripe.canMakeNativePayPayments({
      networks: ['visa'],
    })
    this.setState({
      allowed,
      amexAvailable,
      discoverAvailable,
      masterCardAvailable,
      visaAvailable,
    })
  }

  handleCompleteChange = complete => (
    this.setState({ complete })
  )

  handleApplePayPress = async () => {
    try {
      this.setState({
        loading: true,
        status: null,
        token: null,
      })
      const token = await stripe.paymentRequestWithNativePay({
        // requiredBillingAddressFields: ['all'],
        // requiredShippingAddressFields: ['all'],
        shippingMethods: [{
          id: 'fedex',
          label: 'FedEX',
          detail: 'Test @ 10',
          amount: '10.00',
        }],
      },
      [{
        label: 'Whisky',
        amount: '50.00',
      }, {
        label: 'Vine',
        amount: '60.00',
      }, {
        label: 'Tipsi',
        amount: '110.00',
      }])

      this.setState({ loading: false, token })

      if (this.state.complete) {
        await stripe.completeNativePayRequest()
        this.setState({ status: 'Apple Pay payment completed' })
      } else {
        await stripe.cancelNativePayRequest()
        this.setState({ status: 'Apple Pay payment cenceled' })
      }
    } catch (error) {
      this.setState({ loading: false, status: `Error: ${error.message}` })
    }
  }

  handleSetupApplePayPress = () => (
    stripe.openNativePaySetup()
  )

  render() {
    const {
      loading,
      allowed,
      complete,
      status,
      token,
      amexAvailable,
      discoverAvailable,
      masterCardAvailable,
      visaAvailable,
    } = this.state

    const cards = {
      americanExpressAvailabilityStatus: { name: 'American Express', isAvailable: amexAvailable },
      discoverAvailabilityStatus: { name: 'Discover', isAvailable: discoverAvailable },
      masterCardAvailabilityStatus: { name: 'Master Card', isAvailable: masterCardAvailable },
      visaAvailabilityStatus: { name: 'Visa', isAvailable: visaAvailable },
    }

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
          Complete the operation on token
        </Text>
        <Switch
          style={styles.switch}
          value={complete}
          onValueChange={this.handleCompleteChange}
          {...testID('applePaySwitch')}
        />
        <View>
          {token &&
            <Text style={styles.instruction} {...testID('applePayToken')}>
              Token: {token.tokenId}
            </Text>
          }
          {status &&
            <Text style={styles.instruction} {...testID('applePayStatus')}>
              {status}
            </Text>
          }
        </View>
        <View style={styles.hintContainer}>
          <Button
            text="Setup Pay"
            disabledText="Not supported"
            disabled={!allowed}
            onPress={this.handleSetupApplePayPress}
            {...testID('setupApplePayButton')}
          />
          <Text style={styles.hint}>
            Setup Pay works only on real device
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.status} {...testID('deviceSupportsApplePayStatus')}>
            Device {allowed ? 'supports' : 'doesn\'t support' } Pay
          </Text>
          {Object.entries(cards).map(([id, { name, isAvailable }]) => (
            <Text style={styles.status} key={id} {...testID(id)}>
              {name} is {isAvailable ? 'available' : 'not available'}
            </Text>
          ))}
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
  switch: {
    marginBottom: 10,
  },
  hintContainer: {
    marginTop: 10,
  },
  hint: {
    fontSize: 12,
    textAlign: 'center',
  },
  statusContainer: {
    margin: 20,
    alignSelf: 'stretch',
  },
  status: {
    fontWeight: '300',
    color: 'gray',
  },
})
