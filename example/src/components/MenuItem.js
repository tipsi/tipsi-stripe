import React from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

export default function MenuItem({ title, active, onPress, ...rest }) {
  return (
    <TouchableOpacity
      style={[styles.container, active && styles.active]}
      onPress={onPress}
      {...rest}
    >
      <Text style={[styles.title, active && styles.activeTitle]}>{title}</Text>
    </TouchableOpacity>
  )
}

MenuItem.propTypes = {
  title: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
}

MenuItem.defaultProps = {
  active: false,
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  active: {
    backgroundColor: '#e8e8e8',
  },
  title: {
    color: '#000000',
    fontWeight: 'bold',
    marginLeft: 20,
  },
  activeTitle: {
    color: '#0084ff',
  },
})
