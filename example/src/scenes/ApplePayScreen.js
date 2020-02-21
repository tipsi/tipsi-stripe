import React, { PureComponent } from 'react'
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native'
import stripe from 'tipsi-stripe'
import Button from '../components/Button'
import testID from '../utils/testID'

/* eslint-disable no-console, react/no-did-mount-set-state */
export default class ApplePayScreen extends PureComponent {
  static title = 'Pay'

  state = {
    loading: false,
    allowed: false,
    complete: true,
    status: null,
    token: null,
    potentialNetworks: [],
    verifiedNetworks: [],
  }

  async componentDidMount() {
    const allowed = await stripe.deviceSupportsNativePay()
    this.setState({ allowed })

    // Collect list of any potential network, and add a fake bank, to make sure at least one is unavailable
    const potentialNetworks = [
      ...(await stripe.potentiallyAvailableNativePayNetworks()),
      'FAKE_BANK',
    ]
    this.setState({ potentialNetworks })

    for (const network of potentialNetworks) {
      // Verify the networks one at a time so we know if that one is configured,
      // otherwise this api returns true if *any* of the provided networks might work.
      const available = await stripe.canMakeNativePayPayments({
        networks: [network],
      })
      if (available) {
        this.setState(({ verifiedNetworks: updatedVerified }) => ({
          verifiedNetworks: [...updatedVerified, network],
        }))
      }
    }
  }

  handleCompleteChange = (complete) => this.setState({ complete })

  handleApplePayPress = async () => {
    try {
      this.setState({
        loading: true,
        status: null,
        token: null,
      })
      const token = await stripe.paymentRequestWithNativePay(
        {
          // requiredBillingAddressFields: ['all'],
          // requiredShippingAddressFields: ['all'],
          shippingMethods: [
            {
              id: 'fedex',
              label: 'FedEX',
              detail: 'Test @ 10',
              amount: '10.00',
            },
          ],
        },
        [
          {
            label: 'Whisky',
            amount: '50.00',
          },
          {
            label: 'Vine',
            amount: '60.00',
          },
          {
            label: 'Tipsi',
            amount: '110.00',
          },
        ]
      )

      this.setState({ loading: false, token })

      if (this.state.complete) {
        await stripe.completeNativePayRequest()
        this.setState({ status: 'Apple Pay payment completed' })
      } else {
        await stripe.cancelNativePayRequest()
        this.setState({ status: 'Apple Pay payment canceled' })
      }
    } catch (error) {
      this.setState({ loading: false, status: `Error: ${error.message}` })
    }
  }

  handleSetupApplePayPress = () => stripe.openNativePaySetup()

  render() {
    const {
      loading,
      allowed,
      complete,
      status,
      token,
      potentialNetworks,
      verifiedNetworks,
    } = this.state

    return (
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          <Text style={styles.header}>Apple Pay Example</Text>
          <Text style={styles.instruction}>Click button to show Apple Pay dialog.</Text>
          <Button
            text="Pay with Pay"
            disabledText="Not supported"
            loading={loading}
            disabled={!allowed}
            onPress={this.handleApplePayPress}
            {...testID('applePayButton')}
          />
          <Text style={styles.instruction}>Complete the operation on token</Text>
          <Switch
            style={styles.switch}
            value={complete}
            onValueChange={this.handleCompleteChange}
            {...testID('applePaySwitch')}
          />
          <View>
            {token && (
              <Text style={styles.instruction} {...testID('applePayToken')}>
                Token: {token.tokenId}
              </Text>
            )}
            {status && (
              <Text style={styles.instruction} {...testID('applePayStatus')}>
                {status}
              </Text>
            )}
          </View>
          <View style={styles.hintContainer}>
            <Button
              text="Setup Pay"
              disabledText="Not supported"
              disabled={!allowed}
              onPress={this.handleSetupApplePayPress}
              {...testID('setupApplePayButton')}
            />
            <Text style={styles.hint}>Setup Pay works only on real devices</Text>
          </View>
          <View style={styles.statusContainer}>
            <Text style={styles.status} {...testID('deviceSupportsApplePayStatus')}>
              Device {allowed ? 'supports' : "doesn't support"} Pay
            </Text>
            {potentialNetworks.map((network) => {
              const isAvailable = verifiedNetworks.includes(network)
              return (
                <Text style={styles.status} key={network} {...testID(network)}>
                  {network} is {isAvailable ? 'available' : 'not available'}
                </Text>
              )
            })}
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
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
