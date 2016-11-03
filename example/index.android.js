import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  View,
  Picker,
} from 'react-native'

const styles = StyleSheet.create({
  Picker: {
    margin: 25,
    width: 156,
    borderRadius: 20,
    backgroundColor: '#AAAAAA',
  },
})

export default class example extends Component {
  render() {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Picker
          style={styles.Picker}
          selectedValue="one"
          onChange={this.handleChange}
          onValueChange={this.handleValueChange}>
          <Picker.Item label="One" value="one" />
          <Picker.Item label="Two" value="two" />
          <Picker.Item label="Three" value="three" />
          <Picker.Item label="Four" value="four" />
        </Picker>
      </View>
    )
  }
}

AppRegistry.registerComponent('example', () => example)
