import Stripe from './Stripe'
import PaymentCardTextField from './components/PaymentCardTextField'
import errorCodes from './errorCodes'

export { PaymentCardTextField, errorCodes }

export default Stripe

// eslint-disable-next-line no-console
console.warn(
  '🚨 [tipsi-stripe] Deprecation notice: tipsi-stripe is no longer maintained. Please migrate your project to @stripe/stripe-react-native: https://github.com/stripe/stripe-react-native'
)
