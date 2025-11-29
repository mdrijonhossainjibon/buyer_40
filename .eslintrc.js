module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // Disable all TypeScript ESLint rules
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/prefer-as-const': 'off',
    
    // Disable React hooks rules
    'react-hooks/exhaustive-deps': 'off',
    'react-hooks/rules-of-hooks': 'off',
    
    // Disable general JavaScript rules
    'no-unused-vars': 'off',
    'no-console': 'off',
    'no-debugger': 'off',
    'no-empty': 'off',
    'no-unreachable': 'off',
    'prefer-const': 'off',
    'no-var': 'off',
    'no-undef': 'off',
    
    // Disable React specific rules
    'react/jsx-no-target-blank': 'off',
    'react/no-unescaped-entities': 'off',
    'react/display-name': 'off',
    'react/prop-types': 'off',
    
    // Disable import rules
    'import/no-anonymous-default-export': 'off',
    'import/no-unused-modules': 'off'
  }
};