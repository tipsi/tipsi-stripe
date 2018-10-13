import React, { Component } from 'react'
import {
  requireNativeComponent,
  findNodeHandle,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native'

const NativePaymentCardTextField = requireNativeComponent('TPSCardField', PaymentCardTextField)

export default class PaymentCardTextField extends Component {
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

  isFocused = () => (
    TextInput.State.currentlyFocusedField() === findNodeHandle(this.cardTextFieldRef)
  )

  focus = () => {
    TextInput.State.focusTextInput(findNodeHandle(this.cardTextFieldRef))
  }

  blur = () => {
    TextInput.State.blurTextInput(findNodeHandle(this.cardTextFieldRef))
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
      onChange(event)
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
          accessibilityTraits={rest.accessibilityTraits}>
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

