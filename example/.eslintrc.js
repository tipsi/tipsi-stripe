module.exports = {
  extends: ['tipsi', 'plugin:prettier/recommended', 'prettier/react'],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },
  rules: {
    'jsx-a11y/href-no-hash': ['off'],
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
    'react/sort-comp': ['off'],
    'max-len': [
      'warn',
      {
        code: 100,
        tabWidth: 2,
        comments: 100,
        ignoreComments: false,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    // This example app should be allowed to have console logging
    'no-console': ['off'],
    // This would prevent the ForInStatement which has been in the codebase for
    // 2 years, so we're overriding the tipsi-style to allow this
    'no-restricted-syntax': 0,

    // This would prevent the typeSpecs.hasOwnProperty which has been in the
    // codebase for 2 years
    'no-prototype-builtins': 0,
  },
}
