import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import stripe from 'tipsi-stripe'
import Spoiler from '../components/Spoiler'
import Button from '../components/Button'
import testID from '../utils/testID'

export default class CustomBankScreen extends PureComponent {
  static title = 'Custom Bank'

  state = {
    loading: false,
    token: null,
    params: {
      accountNumber: '000123456789', // required field
      countryCode: 'us', // required field
      currency: 'usd', // required field
      routingNumber: '110000000', // 9 digits
      accountHolderName: 'Test holder name',
      accountHolderType: 'company',
    },
  }

  handleBankAccountPayPress = async () => {
    try {
      this.setState({ loading: true, token: null })

      const token = await stripe.createTokenWithBankAccount(this.state.params)
      this.setState({ loading: false, token })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  render() {
    const { loading, token, params } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Custom Account Params Example
        </Text>
        <Spoiler title="Mandatory Fields">
          <View style={styles.params}>
            <Text style={styles.param}>
              Routing Number: {params.routingNumber}
            </Text>
            <Text style={styles.param}>
              Account Number: {params.accountNumber}
            </Text>
            <Text style={styles.param}>
              Country Code: {params.countryCode}
            </Text>
            <Text style={styles.param}>
              Currency: {params.currency}
            </Text>
          </View>
        </Spoiler>
        <Spoiler title="Optional Fields" defaultOpen={false}>
          <View style={styles.params}>
            <Text style={styles.param}>
              Account Type: {params.accountType}
            </Text>
            <Text style={styles.param}>
              Account HolderType: {params.accountHolderType}
            </Text>
            <Text style={styles.param}>
              Account Holder Name: {params.accountHolderName}
            </Text>
            <Text style={styles.param}>
              Fingerprint: {params.fingerprint}
            </Text>
            <Text style={styles.param}>
              Bank name: {params.bankName}
            </Text>
            <Text style={styles.param}>
              Last4: {params.last4}
            </Text>
          </View>
        </Spoiler>
        <Text style={styles.instruction}>
          Click button to get token based on params.
        </Text>
        <Button
          text="Pay with custom params"
          loading={loading}
          onPress={this.handleBankAccountPayPress}
          {...testID('customAccountButton')}
        />
        <View
          style={styles.token}
          {...testID('customAccountToken')}>
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
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
  params: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'flex-start',
    margin: 5,
  },
  param: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  token: {
    height: 20,
  },
})
