import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  rules: {
    'no-console': 'off',
    'ts/ban-ts-comment': 'off',
    'react/no-array-index-key': 'off',
    'react/no-context-provider': 'off',
  },
})
