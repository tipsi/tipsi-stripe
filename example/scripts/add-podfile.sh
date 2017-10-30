#!/bin/bash

echo "# Use iOS 8 and above
platform :ios, '8.0'

target 'example' do
  pod 'Yoga', :path => '../node_modules/react-native/ReactCommon/yoga'
  pod 'React', :path => '../node_modules/react-native', :subspecs => [
    'BatchedBridge', # Required For React Native 0.45.0+
    'Core',
    'DevSupport',
    'RCTText',
    'RCTGeolocation',
    'RCTVibration',
    'RCTNetwork',
    'RCTWebSocket',
    'RCTImage',
    'RCTLinkingIOS',
    'RCTSettings',
    'RCTActionSheet',
    'RCTAnimation',
    # Add any other subspecs you want to use in your project
  ]
  pod 'tipsi-stripe', :path => '../node_modules/tipsi-stripe'
end
" > ios/Podfile
