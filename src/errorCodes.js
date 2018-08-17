import { Platform } from 'react-native'

const errorCodes = {
  busy: {
    errorCode: 'busy',
    description: 'Previous request is not completed',
  },
  cancelled: {
    errorCode: 'cancelled',
    description: 'Canceled by user',
  },
  purchaseCancelled: {
    errorCode: 'purchaseCancelled',
    description: 'Purchase was cancelled',
  },
  sourceStatusCanceled: {
    errorCode: 'sourceStatusCanceled',
    description: 'Canceled by user',
  },
  sourceStatusPending: {
    errorCode: 'sourceStatusPending',
    description: 'The source has been created and is awaiting customer action',
  },
  sourceStatusFailed: {
    errorCode: 'sourceStatusFailed',
    description: 'The source status is unknown. You shouldn\'t encounter this value.',
  },
  sourceStatusUnknown: {
    errorCode: 'sourceStatusUnknown',
    description: 'Source polling unknown error',
  },
  deviceNotSupportsNativePay: {
    errorCode: 'deviceSupportsApplePay',
    description: Platform.select({
      ios: 'This device does not support Apple Pay',
      android: 'This device does not support Android Pay',
    }),
  },
  noPaymentRequest: {
    errorCode: 'noPaymentRequest',
    description: 'Missing payment request',
  },
  noMerchantIdentifier: {
    errorCode: 'noMerchantIdentifier',
    description: ' Missing merchant identifier',
  },
  noAmount: {
    errorCode: 'noAmount',
    description: 'Amount should be greater 0',
  },
  parseResponse: {
    errorCode: 'parseResponse',
    description: 'Failed to parse JSON',
  },
  activityUnavailable: {
    errorCode: 'activityUnavailable',
    description: 'Cannot continue with no current activity',
  },
  playServicesUnavailable: {
    errorCode: 'playServicesUnavailable',
    description: 'Play services are not available',
  },
  redirectCancelled: {
    errorCode: 'redirectCancelled',
    description: 'Cancelled',
  },
  redirectNoSource: {
    errorCode: 'redirectNoSource',
    description: 'Received redirect uri but there is no source to process',
  },
  redirectWrongSourceId: {
    errorCode: 'redirectWrongSourceId',
    description: 'Received wrong source id in redirect uri',
  },
  redirectCancelledByUser: {
    errorCode: 'redirectCancelledByUser',
    description: 'User cancelled source redirect',
  },
  redirectFailed: {
    errorCode: 'redirectFailed',
    description: 'Source redirect failed',
  },
  // description provided by stripe api
  api: {
    errorCode: 'api',
  },
  apiConnection: {
    errorCode: 'apiConnection',
  },
  redirectSpecific: {
    errorCode: 'redirectSpecific',
  },
  card: {
    errorCode: 'card',
  },
  invalidRequest: {
    errorCode: 'invalidRequest',
  },
  stripe: {
    errorCode: 'stripe',
  },
  rateLimit: {
    errorCode: 'rateLimit',
  },
  authentication: {
    errorCode: 'authentication',
  },
  permission: {
    errorCode: 'permission',
  },
}

export default Object.freeze(errorCodes)
