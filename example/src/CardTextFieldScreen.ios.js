import React, { Component } from 'react'
import { KeyboardAvoidingView, View, Text, StyleSheet } from 'react-native'
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard'
import { PaymentCardTextField } from 'tipsi-stripe'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
  button: {
    margin: 10,
    borderWidth: 1,
  },
  token: {
    height: 20,
  },
  params: {
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    width: 300,
  },
  field: {
    width: 300,
    color: '#449aeb',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
  },
})

export default class CardTextFieldScreen extends Component {
  state = {
    valid: false,
    params: {
      number: '',
      expMonth: 0,
      expYear: 0,
      cvc: '',
    },
  }

  handleFieldParamsChange = (valid, params) => {
    this.setState({
      valid,
      params,
    })
  }

  render() {
    const { valid, params } = this.state

    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.container}
        onResponderGrant={dismissKeyboard}
        onStartShouldSetResponder={() => true}>
        <View>
          <Text style={styles.header}>
            PaymentCardTextField Example
          </Text>
          <PaymentCardTextField
            accessible
            accessibilityLabel="cardTextField"
            style={styles.field}
            onParamsChange={this.handleFieldParamsChange}
          />
          <View style={styles.params}>
            <Text style={styles.instruction}>
              Valid: {valid ? 'true' : 'false'}
            </Text>
            <Text style={styles.instruction}>
              Number: {params.number || '-'}
            </Text>
            <Text style={styles.instruction}>
              Month: {params.expMonth || '-'}
            </Text>
            <Text style={styles.instruction}>
              Year: {params.expYear || '-'}
            </Text>
            <Text style={styles.instruction}>
              CVC: {params.cvc || '-'}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
}
