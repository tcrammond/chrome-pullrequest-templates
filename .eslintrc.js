module.exports = {
  extends: 'standard',
  globals: {
    chrome: false
  },
  rules: {
    'semi': [2, 'always'],
    'no-mixed-operators': 'off',
    'no-unused-expressions': 'off',
    'no-var': 'error',
    'one-var': [2, 'never'],
    'prefer-const': 'error',
    'operator-linebreak': [
      'error',
      'after',
      { overrides: { '?': 'before', ':': 'before', '|>': 'before' } }
    ],
    radix: 'error',
    'require-await': 'error'
  },
  env: {
    browser: true
  },
  overrides: [
    {
      files: ['src/scripts/content.js'],
      globals: {
        marked: false
      }
    }
  ]
};
