import React, { Component } from 'react'
import { View, Text, Platform, StyleSheet } from 'react-native'
import { TabViewAnimated, TabBar } from 'react-native-tab-view'
import stripe from 'tipsi-stripe'
import ApplePayScreen from './scenes/ApplePayScreen'
import AndroidPayScreen from './scenes/AndroidPayScreen'
import CardFormScreen from './scenes/CardFormScreen'
import CustomCardScreen from './scenes/CustomCardScreen'
import CardTextFieldScreen from './scenes/CardTextFieldScreen'
import testID from './utils/testID'

stripe.init({
  publishableKey: '<PUBLISHABLE_KEY>',
  merchantId: '<MERCHANT_ID>',
})

export default class Root extends Component {
  state = {
    index: 0,
    routes: [
      { key: '1', title: Platform.select({ ios: 'Pay', android: 'Android Pay' }) },
      { key: '2', title: 'Card Form' },
      { key: '3', title: 'Custom Card' },
      { key: '4', title: 'Card Text Field' },
    ],
  };

  handleChangeTab = (index) => {
    this.setState({ index })
  }

  renderHeader = props => (
    <TabBar
      {...props}
      style={styles.tabbar}
      indicatorStyle={styles.indicator}
      accessible={false}
      renderLabel={this.renderLabel}
    />
  )

  renderLabel = ({ route, index }) => (
    <Text style={styles.label}>
      {route.title.toUpperCase()}
    </Text>
  )

  renderScene = ({ route }) => {
    switch (route.key) {
      case '1':
        return Platform.select({
          ios: <ApplePayScreen />,
          android: <AndroidPayScreen />,
        })
      case '2':
        return <CardFormScreen />
      case '3':
        return <CustomCardScreen />
      case '4':
        return <CardTextFieldScreen />
      default:
        return null
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusbar} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statusbar: {
    height: Platform.OS === 'ios' ? 20 : 0,
  },
  tabsContainer: {
    flex: 1,
  },
  tabbar: {
    height: 45,
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
