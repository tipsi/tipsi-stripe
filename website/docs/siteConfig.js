/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: 'Tipsi',
    image: '/tipsi-stripe/img/tipsi-logo.png',
    infoLink: 'https://www.gettipsi.com',
    pinned: true,
  },
]

const siteConfig = {
  title: 'react-native-stripe',
  tagline: 'Stripe support for React-Native',
  url: 'https://seatmonger.github.io',
  baseUrl: '/react-native-stripe/',
  projectName: 'react-native-stripe',
  headerLinks: [
    { doc: 'index', label: 'Docs' },
    { blog: true, label: 'Blog' },
  ],
  users,
  headerIcon: 'img/favicon.png',
  favicon: 'img/favicon.png',
  colors: {
    primaryColor: '#6A3549',
    secondaryColor: '#5B3A51',
  },
  copyright: `Copyright © ${new Date().getFullYear()} Tipsi`,
  customDocsPath: 'docs-md',
  organizationName: 'seatmonger',
  highlight: { theme: 'default' },
  scripts: ['https://buttons.github.io/buttons.js'],
  repoUrl: 'https://github.com/seatmonger/react-native-stripe',
}

module.exports = siteConfig
