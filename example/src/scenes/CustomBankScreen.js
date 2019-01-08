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
    error: null,
    params: {
      accountNumber: '000123456789', // required field
      countryCode: 'us', // required field
      currency: 'usd', // required field
      routingNumber: '110000000', // 9 digits
      accountHolderName: 'Test holder name',
      accountHolderType: 'company',
    },
    errorParams: {
      accountNumber: '000123456789', // required field
      countryCode: 'us', // required field
      currency: 'abc', // required field
      routingNumber: '110000000', // 9 digits
      accountHolderName: 'Test holder name',
      accountHolderType: 'company',
    },
  }

  handleBankAccountPayPress = async (shouldPass = true) => {
    try {
      this.setState({ loading: true, error: null, token: null })
      const params = shouldPass ? this.state.params : this.state.errorParams
      const token = await stripe.createTokenWithBankAccount(params)
      this.setState({ loading: false, token })
    } catch (error) {
      this.setState({ loading: false, error })
    }
  }

  renderMandatoryFields = params => (
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
  )

  render() {
    const { loading, token, params, errorParams, error } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Custom Account Params Example
        </Text>
        <Spoiler title="Mandatory Fields">
          {this.renderMandatoryFields(params)}
        </Spoiler>
        <Spoiler title="Mandatory Fields - Error case" defaultOpen={false}>
          {this.renderMandatoryFields(errorParams)}
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
        <Button
          text="Pay with error custom params"
          loading={loading}
          onPress={() => this.handleBankAccountPayPress(false)}
          {...testID('customAccountErrorButton')}
        />
        {token &&
          <View
            style={styles.token}
            {...testID('customAccountToken')}>
            <Text style={styles.instruction}>
              Token: {token.tokenId}
            </Text>
          </View>
        }
        {error &&
          <View
            style={styles.token}
            {...testID('customAccountTokenError')}>
            <Text style={styles.instruction}>
              Error: {JSON.stringify(error.message)}
            </Text>
          </View>
        }
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
