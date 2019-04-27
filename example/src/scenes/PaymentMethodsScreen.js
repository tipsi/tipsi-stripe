import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import stripe from 'tipsi-stripe';
import Button from '../components/Button';
import testID from '../utils/testID';

const BACKEND_URL = '<BACKEND_URL>';
const PAYMENT_CONFIG = {
  createCardSource: true
};

export default class CardFormScreen extends PureComponent {
  static title = 'Payment Methods';

  state = {
    loading: false,
    result: null
  };

  requestEphemeralKey = async (apiVersion = '2015-10-12') => {
    const response = await fetch(`${BACKEND_URL}/ephemeral_keys?api_version=${apiVersion}`, { method: 'POST' })
    const result = await response.json();
    return result;
  };

  handlePress = async () => {
    try {
      this.setState({ loading: true, result: null });

      // This example shows how to load the payment methods dialog,
      // Get back the SDK version and then get the right version ephemeral key.
      // Then complete the flow by providing the key with
      // completePaymentRequestWithPaymentMethods

      // Step 1, Load experiance, get back version
      const apiVersion = await stripe.paymentRequestWithPaymentMethods(
        PAYMENT_CONFIG
      );

      // Step 2, Get key per the requested api version
      const ephemeralKey = await this.requestEphemeralKey(apiVersion);

      // Step 3, Continue experiance with ephemeral key
      const method = await stripe.completePaymentRequestWithPaymentMethods(
        ephemeralKey
      );

      this.setState({ loading: false, result: method.resultType });
    } catch (error) {
      this.setState({ loading: false, result: error.message });
    }
  };

  render() {
    const { loading, result } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Payment Methods Example</Text>
        <Text style={styles.instruction}>
          Click button to show Payment Methods dialog.
        </Text>
        <Button
          text="Select a payment method and pay"
          loading={loading}
          onPress={this.handlePress}
          {...testID('paymentMethodsFormButton')}
        />
        <View
          style={styles.result}
          {...testID('paymentMethodsFormPaymentMethod')}
        >
          {result && (
            <Text style={styles.instruction}>
              Payment Method Type: {result}
            </Text>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  result: {
    height: 20
  }
});
