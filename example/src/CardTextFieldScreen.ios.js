import React, { Component } from 'react'
import { View, Text, /* TextInput, */ StyleSheet } from 'react-native'
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
      number: '4242424242424242',
      expMonth: 11,
      expYear: 17,
      cvc: '223',
      name: 'Test User',
      currency: 'usd',
    },
  }

  handleFieldParamsChange = (valid, params) => {
    this.setState({
      valid,
      params,
      text: '123',
    })
  }

  render() {
    const { valid, params } = this.state

    return (
      <View
        style={styles.container}
        onStartShouldSetResponder={() => true}>
        <Text style={styles.header}>
          PaymentCardTextField Component Example
        </Text>
        {/* <TextInput
          multiline={false}
          onChangeText={(text) => {
            this.setState({ text: text.replace(/\s/g, '') })
          }}
          style={{
            height: 26,
            borderWidth: 0.5,
            borderColor: '#0f0f0f',
            // flex: 1,
            fontSize: 13,
            padding: 4,
          }}
          value={this.state.text}
        /> */}
        <PaymentCardTextField
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
    )
  }
}
