import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  rules: {
    'no-useless-return': 'off',
    'antfu/if-newline': 'off',
    'node/prefer-global/process': 'off',
    'no-console': 'off',
    'ts/ban-ts-comment': 'off',
    'react/no-array-index-key': 'off',
    'react/no-context-provider': 'off',
  },
})
