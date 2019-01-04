import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import stripe from 'tipsi-stripe'
import Spoiler from '../components/Spoiler'
import Button from '../components/Button'
import testID from '../utils/testID'

export default class CustomCardScreen extends PureComponent {
  static title = 'Custom Card'

  state = {
    loading: false,
    token: null,
    error: null,
    params: {
      number: '4242424242424242',
      expMonth: 12,
      expYear: 24,
      cvc: '223',
      name: 'Test User',
      currency: 'usd',
      addressLine1: '123 Test Street',
      addressLine2: 'Apt. 5',
      addressCity: 'Test City',
      addressState: 'Test State',
      addressCountry: 'Test Country',
      addressZip: '55555',
    },
    errorParams: {
      number: '4242424242424241',
      expMonth: 12,
      expYear: 24,
      cvc: '223',
      name: 'Test User',
      currency: 'usd',
      addressLine1: '123 Test Street',
      addressLine2: 'Apt. 5',
      addressCity: 'Test City',
      addressState: 'Test State',
      addressCountry: 'Test Country',
      addressZip: '55555',
    },
  }

  handleCustomPayPress = async (shouldPass = true) => {
    try {
      this.setState({ loading: true, token: null, error: null })

      const params = shouldPass ? this.state.params : this.state.errorParams
      const token = await stripe.createTokenWithCard(params)
      this.setState({ loading: false, error: undefined, token })
    } catch (error) {
      this.setState({ loading: false, error })
    }
  }

  renderMandatoryFields = params => (
    <View style={styles.params}>
      <Text style={styles.param}>Number: {params.number}</Text>
      <Text style={styles.param}>Month: {params.expMonth}</Text>
      <Text style={styles.param}>Year: {params.expYear}</Text>
    </View>
  )

  render() {
    const { loading, token, error, params, errorParams } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Custom Card Params Example
        </Text>
        <Spoiler title="Mandatory Fields">
          {this.renderMandatoryFields(params)}
        </Spoiler>
        <Spoiler title="Mandatory Fields - Error" defaultOpen={false}>
          {this.renderMandatoryFields(errorParams)}
        </Spoiler>
        <Spoiler title="Optional Fields" defaultOpen={false}>
          <View style={styles.params}>
            <Text style={styles.param}>CVC: {params.cvc}</Text>
            <Text style={styles.param}>Name: {params.name}</Text>
            <Text style={styles.param}>Currency: {params.currency}</Text>
            <Text style={styles.param}>Address Line 1: {params.addressLine1}</Text>
            <Text style={styles.param}>Address Line 2: {params.addressLine2}</Text>
            <Text style={styles.param}>Address City: {params.addressCity}</Text>
            <Text style={styles.param}>Address State: {params.addressState}</Text>
            <Text style={styles.param}>Address Country: {params.addressCountry}</Text>
            <Text style={styles.param}>Address Zip: {params.addressZip}</Text>
          </View>
        </Spoiler>
        <Text style={styles.instruction}>Click button to get token based on params.</Text>
        <Button
          text="Pay with custom params"
          loading={loading}
          onPress={this.handleCustomPayPress}
          {...testID('customCardButton')}
        />
        <Button
          text="Pay with custom params - error"
          loading={loading}
          onPress={() => this.handleCustomPayPress(false)}
          {...testID('customCardErrorButton')}
        />
        {token &&
          <View style={styles.token} {...testID('customCardToken')}>
            <Text style={styles.instruction}>Token: {token.tokenId}</Text>
          </View>
        }
        {error &&
          <View style={styles.token} {...testID('customCardTokenError')}>
            <Text style={styles.instruction}>Error: {JSON.stringify(error.message)}</Text>
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
    backgroundColor: '#fff',
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
