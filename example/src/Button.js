import React, { Component, PropTypes } from 'react'
import { View, Text, TouchableHighlight, ActivityIndicator, Platform, StyleSheet } from 'react-native'

export default class Button extends Component {
  static propTypes = {
    text: PropTypes.string,
    disabledText: PropTypes.string,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    style: PropTypes.any,
    onPress: PropTypes.func,
  }

  handlePress = (event) => {
    const { loading, disabled, onPress } = this.props

    if (loading || disabled) {
      return
    }

    if (onPress) {
      onPress(event)
    }
  }

  render() {
    const { text, disabledText, loading, disabled, style, ...rest } = this.props

    return (
      <TouchableHighlight
        {...rest}
        style={[styles.button, style]}
        underlayColor="rgba(0,0,0,0.5)"
        onPress={this.handlePress}>
        <View>
          {loading &&
            <ActivityIndicator
              animating
              size="small"
            />
          }
          {!loading && !disabled &&
            <Text>
              {text}
            </Text>
          }
          {!loading && disabled &&
            <Text>
              {disabledText || text}
            </Text>
           }
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    height: Platform.OS === 'ios' ? 35 : 40,
    minWidth: 160,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: 'white',
    alignItems: 'center',
  },
})
