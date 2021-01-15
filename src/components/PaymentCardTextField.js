import React, { Component } from 'react'
import {
  requireNativeComponent,
  findNodeHandle,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ViewPropTypes,
  Platform,
} from 'react-native'
import PropTypes from 'prop-types'
import { TextInput } from 'react-native';

const { State: TextInputState } = TextInput;

const FieldStylePropType = PropTypes.shape({
  ...ViewPropTypes.style,
  color: PropTypes.string,
})

/**
 * @typedef {Object} PaymentCardTextFieldNativeEventParams
 * @property {string} number -- card number as a string
 * @property {number} expMonth
 * @property {number} expYear
 * @property {string} cvc
 */

/**
 * @typedef {Object} PaymentCardTextFieldNativeEvent
 * @property {boolean}  valid
 * @property {PaymentCardTextFieldNativeEventParams} params
 */

/**
 * @callback OnChangeCallback
 * @param {PaymentCardTextFieldNativeEvent} params
 */

/**
 * // TODO: Get a more precise type here, not sure how to JSDoc react-native Style Types
 * @typedef {Object} PaymentComponentTextFieldStyleProp
 */

/**
 * A Component that collects the CardNumber, ExpirationDate, and CVC all in one.
 * @typedef {Object} PaymentCardTextFieldProps
 *
 * @property {string} expirationPlaceholder
 * @property {string} numberPlaceholder
 * @property {string} cvcPlaceholder
 * @property {boolean} disabled
 * @property {OnChangeCallback} onChange
 * @property {PaymentComponentTextFieldStyleProp} style
 *
 * @property {string} cursorColor iOS-only!
 * @property {string} textErrorColor iOS-only!
 * @property {string} placeholderColor iOS-only!
 * @property {"default"|"light"|"dark"} keyboardAppearance iOS-only!
 *
 * @property {boolean} setEnabled Android-only!
 * @property {string} backgroundColor Android-only!
 * @property {string} cardNumber Android-only!
 * @property {string} expDate Android-only!
 * @property {string} securityCode Android-only!
 */

const NativePaymentCardTextField = requireNativeComponent('TPSCardField', PaymentCardTextField, {
  nativeOnly: {
    borderColor: true,
    borderWidth: true,
    cornerRadius: true,
    textColor: true,
    fontFamily: true,
    fontWeight: true,
    fontStyle: true,
    fontSize: true,
    enabled: true,
    onChange: true,
    params: true, // Currently iOS only
    keyboardAppearance: true, // iOS only
  },
})

/**
 * @type {import('react').ComponentClass<PaymentCardTextFieldProps>}
 */
export default class PaymentCardTextField extends Component {
  static propTypes = {
    ...ViewPropTypes,
    style: FieldStylePropType,

    // Common
    expirationPlaceholder: PropTypes.string,
    numberPlaceholder: PropTypes.string,
    cvcPlaceholder: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,

    ...Platform.select({
      ios: {
        cursorColor: PropTypes.string,
        textErrorColor: PropTypes.string,
        placeholderColor: PropTypes.string,
        keyboardAppearance: PropTypes.oneOf(['default', 'light', 'dark']),
      },
      android: {
        setEnabled: PropTypes.bool,
        backgroundColor: PropTypes.string,
        cardNumber: PropTypes.string,
        expDate: PropTypes.string,
        securityCode: PropTypes.string,
      },
    }),
  }

  static defaultProps = {
    ...View.defaultProps,
  }

  valid = false // eslint-disable-line react/sort-comp
  params = {
    number: '',
    expMonth: 0,
    expYear: 0,
    cvc: '',
  }

  componentWillUnmount() {
    if (this.isFocused()) {
      this.blur()
    }
  }

  isFocused = () => TextInputState.currentlyFocusedField() === findNodeHandle(this.cardTextFieldRef)

  focus = () => {
    TextInputState.focusTextInput(findNodeHandle(this.cardTextFieldRef))
  }

  blur = () => {
    TextInputState.blurTextInput(findNodeHandle(this.cardTextFieldRef))
  }

  handlePress = () => {
    this.focus()
  }

  handleChange = (event) => {
    const { onChange, onParamsChange } = this.props
    const { nativeEvent } = event

    this.valid = nativeEvent.valid
    this.params = nativeEvent.params

    if (onChange) {
      // Send the intended parameters back into JS
      onChange({ ...nativeEvent })
    }

    if (onParamsChange) {
      onParamsChange(nativeEvent.valid, nativeEvent.params)
    }
  }

  setCardTextFieldRef = (node) => {
    this.cardTextFieldRef = node
  }

  // Previously on iOS only
  setParams = (params) => {
    this.cardTextFieldRef.setNativeProps({ params })
  }

  render() {
    const {
      style,
      disabled,
      expDate,
      cardNumber,
      securityCode,
      cursorColor,
      textErrorColor,
      placeholderColor,
      numberPlaceholder,
      expirationPlaceholder,
      cvcPlaceholder,
      keyboardAppearance,
      ...rest
    } = this.props

    const {
      borderColor,
      borderWidth,
      borderRadius,
      fontFamily,
      fontWeight,
      fontStyle,
      fontSize,
      overflow,
      backgroundColor,
      color,
      ...fieldStyles
    } = StyleSheet.flatten(style)

    const viewStyles = {
      overflow,
      width: fieldStyles.width,
    }

    const commonStyles = {
      borderColor,
      borderWidth,
      borderRadius,
      backgroundColor,
    }

    return (
      <View style={[commonStyles, viewStyles]}>
        <TouchableWithoutFeedback
          rejectResponderTermination
          testID={rest.testID}
          onPress={this.handlePress}
          accessible={rest.accessible}
          accessibilityLabel={rest.accessibilityLabel}
          accessibilityTraits={rest.accessibilityTraits}
        >
          <NativePaymentCardTextField
            ref={this.setCardTextFieldRef}
            style={[styles.field, fieldStyles]}
            borderColor="transparent"
            borderWidth={0}
            cornerRadius={borderRadius}
            textColor={color}
            fontFamily={fontFamily}
            fontWeight={fontWeight}
            fontStyle={fontStyle}
            fontSize={fontSize}
            enabled={!disabled}
            numberPlaceholder={numberPlaceholder}
            expirationPlaceholder={expirationPlaceholder}
            cvcPlaceholder={cvcPlaceholder}
            onChange={this.handleChange}
            // iOS only
            cursorColor={cursorColor}
            textErrorColor={textErrorColor}
            placeholderColor={placeholderColor}
            keyboardAppearance={keyboardAppearance}
            // Android only
            cardNumber={cardNumber}
            expDate={expDate}
            securityCode={securityCode}
          />
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  field: {
    // The field will conform to whatever width is given, but we do
    // have to set the component's height explicitly on the
    // surrounding view to ensure it gets rendered.
    height: 44,
  },
})
