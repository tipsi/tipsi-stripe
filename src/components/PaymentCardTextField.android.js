import React, { Component } from 'react'
import {
  requireNativeComponent,
  findNodeHandle,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ViewPropTypes,
} from 'react-native'
import PropTypes from 'prop-types'
import StyleSheetPropType from 'react-native/Libraries/StyleSheet/StyleSheetPropType'
import ViewStylePropTypes from 'react-native/Libraries/Components/View/ViewStylePropTypes'

import TextInputState from 'react-native/Libraries/Components/TextInput/TextInputState'

const FieldStylePropType = {
  ...ViewStylePropTypes,
  color: PropTypes.string,
}

export default class PaymentCardTextField extends Component {
  static propTypes = {
    ...ViewPropTypes,
    style: StyleSheetPropType(FieldStylePropType), // eslint-disable-line new-cap

    setEnabled: PropTypes.bool,
    backgroundColor: PropTypes.string,
    cardNumber: PropTypes.string,
    expDate: PropTypes.string,
    securityCode: PropTypes.string,
    expirationPlaceholder: PropTypes.string,
    cvcPlaceholder: PropTypes.string,
    numberPlaceholder: PropTypes.string,

    onChange: PropTypes.func,
    onValueChange: PropTypes.func,
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

  isFocused = () => (
    TextInputState.currentlyFocusedField() === findNodeHandle(this)
  )

  focus = () => {
    TextInputState.focusTextInput(findNodeHandle(this))
  }

  blur = () => {
    TextInputState.blurTextInput(findNodeHandle(this))
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
      onParamsChange(
        nativeEvent.valid,
        nativeEvent.params
      )
    }
  }

  render() {
    const { style, disabled, ...rest } = this.props
    const {
      borderColor,
      borderWidth,
      borderRadius,
      fontFamily,
      fontWeight,
      fontStyle,
      fontSize,
      overflow,
      color,
      ...fieldStyles
    } = StyleSheet.flatten(style)

    const viewStyles = { overflow, width: fieldStyles.width }
    const commonStyles = { borderColor, borderWidth, borderRadius }

    return (
      <TouchableWithoutFeedback
        onPress={this.handlePress}
        testID={rest.testID}
        accessible={rest.accessible}
        accessibilityLabel={rest.accessibilityLabel}
        accessibilityTraits={rest.accessibilityTraits}
        rejectResponderTermination>
        <View style={[commonStyles, viewStyles]}>
          <NativePaymentCardTextField
            style={[styles.field, fieldStyles]}
            borderColor={borderColor}
            borderWidth={borderWidth}
            cornerRadius={borderRadius}
            textColor={color}
            fontFamily={fontFamily}
            fontWeight={fontWeight}
            fontStyle={fontStyle}
            fontSize={fontSize}
            enabled={!disabled}
            {...rest}
            onChange={this.handleChange}
          />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  field: {
    // The field will conform to whatever width is given, but we do
    // have to set the component's height explicitly on the
    // surrounding view to ensure it gets rendered.
    height: 44,
    // Set default background color to prevent transparent background
    // backgroundColor: '#FFFFFF',
  },
})

const NativePaymentCardTextField = requireNativeComponent('CreditCardForm', PaymentCardTextField, {
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
  },
})
