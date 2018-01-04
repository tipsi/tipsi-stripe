import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import stripe from 'tipsi-stripe'
import Button from '../components/Button'
import testID from '../utils/testID'

/* eslint-disable no-console */
export default class SourceScreen extends PureComponent {
  static title = 'Sources'

  state = {
    loading: false,
    source: null,
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
    const { loading, source } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Source Example
        </Text>
        <Text style={styles.instruction}>
          Click button to create a source.
        </Text>
        <Button
          text="Create source for Alipay payment"
          loading={loading}
          onPress={this.handleCreacteSourcePress}
          {...testID('sourceButton')}
        />
        <View style={styles.source} {...testID('sourceObject')}>
          {source &&
            <Text style={styles.instruction}>
              Source: {JSON.stringify(source)}
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
  source: {
    width: '100%',
    height: 120,
  },
})
