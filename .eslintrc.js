
module.exports = {
  "extends": "tipsi",
  "rules": {
    // This would prevent the ForInStatement which has been in the codebase for
    // 2 years, so we're overriding the tipsi-style to allow this
    "no-restricted-syntax": 0,

    // This would prevent the typeSpecs.hasOwnProperty which has been in the
    // codebase for 2 years
    "no-prototype-builtins": 0
  }
}
