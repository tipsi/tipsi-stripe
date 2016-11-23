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
//    color: '#449aeb',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
  },
})

export default class CardTextFieldScreen extends Component {
  state = {
    valid: false,
    params: {
      number: null,
      expMonth: null,
      expYear: null,
      cvc: null,
      name: null,
      currency: null,
    },
  }

  handleFieldParamsChange = (valid, params) => {
  console.log('valid === '+valid)
  console.log('params === '+params)
    this.setState({
      valid,
      params,
      text: '123',
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
        <View style={styles.container}>
          <Text style={styles.header}>
            PaymentCardTextField Example
          </Text>
          <PaymentCardTextField
             accessible
             accessibilityLabel="cardTextField"
             onParamsChange={this.handleFieldParamsChange}
             style={styles.field}
          />
          <View
              accessible
              accessibilityLabel="fieldsId"
              style={styles.params}>
            <Text
                          accessible
                          accessibilityLabel="valid"
            style={styles.instruction}>
              Valid: {valid ? 'true' : 'false'}
            </Text>
            <Text
                          accessible
                          accessibilityLabel="number"
            style={styles.instruction}>
              Number: {params.number || '-'}
            </Text>
            <Text
                          accessible
                          accessibilityLabel="expMonth"
             style={styles.instruction}>
              Month: {params.expMonth || '-'}
            </Text>
            <Text
                          accessible
                          accessibilityLabel="expYear"
            style={styles.instruction}>
              Year: {params.expYear || '-'}
            </Text>
            <Text
                          accessible
                          accessibilityLabel="cvc"
            style={styles.instruction}>
              CVC: {params.cvc || '-'}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
}