import React, { Component, PropTypes } from 'react'
import { requireNativeComponent, StyleSheet, View, TouchableWithoutFeedback } from 'react-native'
import StyleSheetPropType from 'react-native/Libraries/StyleSheet/StyleSheetPropType'
import ViewStylePropTypes from 'react-native/Libraries/Components/View/ViewStylePropTypes'

const FieldStylePropType = {
  ...ViewStylePropTypes,
  color: PropTypes.string,
}

export default class PaymentCardTextField extends Component {
  static propTypes = {
    ...View.propTypes,
    style: StyleSheetPropType(FieldStylePropType), // eslint-disable-line new-cap
    cursorColor: PropTypes.string,
    textErrorColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    numberPlaceholder: PropTypes.string,
    expirationPlaceholder: PropTypes.string,
    cvcPlaceholder: PropTypes.string,

    disabled: PropTypes.bool,

    onChange: PropTypes.func,
    onValueChange: PropTypes.func,
  }

  valid = false // eslint-disable-line react/sort-comp
  params = {
    number: '',
    expMonth: 0,
    expYear: 0,
    cvc: '',
  }

  onChange = (event) => {
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
      color,
      ...fieldStyles
    } = StyleSheet.flatten(style)

    return (
      <TouchableWithoutFeedback
        rejectResponderTermination>
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
          onChange={this.onChange}
        />
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
    backgroundColor: '#ffffff',
  },
})

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
  },
})
