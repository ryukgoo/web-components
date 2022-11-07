module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [ '@typescript-eslint', 'import', 'html' ],
  ignorePatterns: [ '**/*.config.js', '*.js' ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-prettier',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:eslint-plugin-wc/recommended',
    'plugin:lit-a11y/recommended'
  ],
  rules: {
    'max-len': [ 'error', {
      code: 120,
      tabWidth: 2
    } ],
    // disable the rule for all files
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'import/named': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': [ 'error', 'always', {
      ignorePackages: true
    } ],
    'lit-a11y/click-events-have-key-events': 'off',
    'lit-a11y/anchor-is-valid': 'off'
  },
  env: {
    mocha: true,
    browser: true
  }
};
