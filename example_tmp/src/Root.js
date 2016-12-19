import React, { Component } from 'react'
import { View, Text, Platform, StyleSheet } from 'react-native'
import { TabViewAnimated, TabBarTop } from 'react-native-tab-view'
import stripe from 'tipsi-stripe'
import ApplePayScreen from './ApplePayScreen'
import AndroidPayScreen from './AndroidPayScreen'
import CardFormScreen from './CardFormScreen'
import CustomCardScreen from './CustomCardScreen'
import CardTextFieldScreen from './CardTextFieldScreen'

stripe.init({
  publishableKey: 'pk_test_m3kEfDWERg2qNxwlikeKzeEI',
  merchantId: 'merchant.com.tipsi.applepaytest',
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
    <TabBarTop
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
      tabWidth={10}
      renderLabel={this.renderLabel}
    />
  )

  renderLabel = ({ route, index }) => (
    <Text
      accessible
      accessibilityLabel={`headerTab_${index}`}
      style={[styles.label]}>
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
