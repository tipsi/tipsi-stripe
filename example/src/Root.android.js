import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TabViewAnimated, TabBarTop } from 'react-native-tab-view'
import Stripe from 'tipsi-stripe'
import AndroidPayScreen from './AndroidPayScreen'
import CardFormScreen from './CardFormScreen'
import CustomCardScreen from './CustomCardScreen'
import CardTextFieldScreen from './CardTextFieldScreen'

Stripe.init({
  publishableKey: 'pk_test_6pRNASCoBOKtIshFeQd4XMUh',
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabsContainer: {
    flex: 1,
  },
  tabbar: {
    height: 48,
    backgroundColor: '#fff',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    backgroundColor: '#000',
  },
  label: {
    color: '#000',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
})

export default class Root extends Component {
  state = {
    index: 0,
    routes: [
      { key: '1', title: 'Android Pay' },
      { key: '2', title: 'Card Form' },
      { key: '3', title: 'Custom Card' },
      { key: '4', title: 'Card Text Field' },
    ],
  }

  handleChangeTab = (index) => {
    this.setState({ index })
  }

  renderHeader = props => (
    <TabBarTop
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
      tabWidth={10}
      renderLabel={this.renderLabel(props)}
    />
  )

  renderLabel = ({ navigationState }) => ({ route, index }) => {
    const selected = navigationState.index === index
    return (
      <Text
        accessible
        accessibilityLabel={`headerTab_${index}`}
        style={[styles.label]}>
        {route.title}
      </Text>
    )
  }

  renderScene = ({ route }) => {
    switch (route.key) {
    case '1':
      return <AndroidPayScreen />
    case '2':
      return <CardFormScreen />
    case '3':
      return <CustomCardScreen />
    case '4':
      return <CardTextFieldScreen />
    default:
      return null
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TabViewAnimated
          style={styles.tabsContainer}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderHeader={this.renderHeader}
          onRequestChangeTab={this.handleChangeTab}
        />
      </View>
    )
  }
}
