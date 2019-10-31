import React, { PureComponent } from 'react'
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

export default class Spoiler extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    defaultOpen: PropTypes.bool,
    children: PropTypes.node.isRequired,
    style: PropTypes.any,
  }

  static defaultProps = {
    defaultOpen: true,
    style: undefined,
  }

  state = {
    open: this.props.defaultOpen,
  }

  handlePress = () => {
    this.setState({ open: !this.state.open })
  }

  render() {
    const { title, style, children } = this.props
    const { open } = this.state
    const headerStyles = open ? [styles.header, styles.headerOpen] : styles.header
    const arrowStyles = open ? styles.arrowDown : styles.arrowUp

    return (
      <View style={[styles.spoiler, style]}>
        <TouchableHighlight underlayColor="rgba(0,0,0,0.5)" onPress={this.handlePress}>
          <View style={headerStyles}>
            <Text style={styles.title}>{title}</Text>
            <Text style={arrowStyles}>›</Text>
          </View>
        </TouchableHighlight>
        <View>{open && children}</View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  spoiler: {
    width: 250,
    borderWidth: 1,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 10,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 30,
    padding: 5,
  },
  headerOpen: {
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 14,
  },
  arrowUp: {
    transform: [{ rotate: '-180deg' }],
  },
  arrowDown: {
    transform: [{ rotate: '90deg' }],
  },
})
