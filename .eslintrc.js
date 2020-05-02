module.exports = {
  'extends': 'airbnb',
  'parser': 'babel-eslint',
  'env': {
    'jest': true,
  },
  'rules': {
    'no-use-before-define': 'off',
    'react/jsx-filename-extension': 'off',
    "max-len": ["error", { code: 200, ignoreUrls: true }],
    'react/prop-types': 'off',
    'comma-dangle': 'off',
    "linebreak-style": 0
    },
  'globals': {
    "fetch": false
  }
}