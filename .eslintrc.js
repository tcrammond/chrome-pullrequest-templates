module.exports = {
  extends: 'standard',
  globals: {

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
      files: ['src/scripts/*.js'],
      globals: {
        chrome: false,
      }
    }
  ]
};
