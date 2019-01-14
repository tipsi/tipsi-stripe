import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import stripe from 'tipsi-stripe'
import Button from '../components/Button'
import testID from '../utils/testID'

/* eslint-disable no-console */
export default class SourceScreen extends PureComponent {
  static title = 'Sources'

  state = {
    error: null,
    loading: false,
    source: null,
  }

  onCreacteCardSourcePress = async () => {
    try {
      this.setState({ loading: true, source: null })

      const source = await stripe.createSourceWithParams({
        type: 'card',
        number: '5555555555554444',
        expMonth: 11,
        expYear: 29,
        cvc: '789',
      })
      this.setState({ loading: false, source })
    } catch (error) {
      this.setState({ error, loading: false })
    }
  }

  handleCreacteSourcePress = async () => {
    try {
      this.setState({ loading: true, source: null })

      const source = await stripe.createSourceWithParams({
        type: 'alipay',
        amount: 50,
        currency: 'EUR',
        returnURL: 'example://stripe-redirect',
      })
      this.setState({ loading: false, source })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  render() {
    const { error, loading, source } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Source Example
        </Text>
        <Text style={styles.instruction}>
          Click button to create a source.
        </Text>

        <Button
          text="Create source for card payment"
          loading={loading}
          onPress={this.onCreacteCardSourcePress}
          {...testID('cardSourceButton')}
        />
        <Button
          text="Create source for Alipay payment"
          loading={loading}
          onPress={this.handleCreacteSourcePress}
          {...testID('sourceButton')}
        />

        {source && (
          <Text style={styles.source} {...testID('sourceObject')}>
              Source: {JSON.stringify(source)}
          </Text>
        )}

        {error && (
          <Text style={[styles.source, styles.error]} {...testID('sourceErrorObject')}>
            Error: {JSON.stringify(error)}
          </Text>
        )}
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
  source: {
    color: '#333333',
    margin: 8,
    textAlign: 'center',
    width: '100%',
  },
  error: {
    color: 'darkred',
  },
})
