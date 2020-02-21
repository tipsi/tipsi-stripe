import React from 'react'
import { View, Text, Image, TouchableOpacity, Platform, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import testID from '../utils/testID'

export default function Header({ title, onMenuPress }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onMenuPress}
        {...testID('toggleDrawerButton')}
      >
        <Image style={styles.buttonImage} source={require('../assets/menu.png')} />
      </TouchableOpacity>
      <View style={styles.title}>
        <Text style={styles.titleText}>{title}</Text>
      </View>
    </View>
  )
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  onMenuPress: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Platform.select({ ios: '#efeff2', android: '#ffffff' }),
    borderBottomColor: 'rgba(0,0,0,.15)',
    borderBottomWidth: Platform.select({ ios: StyleSheet.hairlineWidth, android: 0 }),
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: Platform.select({ ios: 44, android: 56 }),
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginRight: Platform.select({ ios: 44, android: 0 }),
  },
  titleText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(0,0,0,.9)',
    textAlign: Platform.select({ ios: 'center', android: 'left' }),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    height: 24,
    width: 24,
    margin: Platform.select({ ios: 10, android: 16 }),
    resizeMode: 'contain',
  },
})
