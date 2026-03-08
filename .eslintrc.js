module.exports = {
    "extends": [
        "standard",
        'plugin:jest/recommended'
    ],
    "plugins": [
        "standard",
        "promise",
        "jest"
    ],
    "rules": {
        "semi": [2, "always"],
        "comma-dangle": [2, "always-multiline"],
        "no-extra-semi": "off",
        "camelcase": [2, {
          "properties": "always"
        }],
        "space-infix-ops": ["error", {
          "int32Hint": false
        }],
        "indent": ["error", 4],
        "semi": ["error", "always"],
        "max-len": ["error", {
          "code": 80,
          "ignoreComments": true,
          "ignoreTrailingComments": true,
          "ignoreUrls": true
        }]
    },
    "env": {
        "node": true,
        'jest/globals': true
      }
  };
  