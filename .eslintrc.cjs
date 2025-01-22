module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  "extends": [

    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',

    "plugin:react/recommended",
    "airbnb",
    "airbnb-typescript"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json",
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    'react-refresh',
    "@typescript-eslint"
  ],
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [
          ".js",
          ".jsx",
          ".ts",
          ".tsx"
        ]
      }
    }
  },
  "overrides": [
    {
      "files": [
        "**/*.spec.js",
        "**/*.spec.jsx",
        "**/*.test.js"
      ],
      "env": {
        "jest": true
      }
    }
  ],
  "rules": {
    "react/function-component-definition": [
      2,
      {
        "namedComponents": "arrow-function"
      }
    ],
    "max-len": [
      "error",
      {
        "code": 120,
        "tabWidth": 2,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true,
        "ignoreComments": true
      }
    ],
    "@typescript-eslint/semi": [0],
    "@typescript-eslint/no-explicit-any": [0],
    "@typescript-eslint/ban-ts-comment": [0],
    "import/no-extraneous-dependencies" :[0],
    "@typescript-eslint/no-use-before-define": [0],
    "@typescript-eslint/no-unused-vars": [0],
    "no-continue": [0],
    "no-promise-executor-return": [0],
    "no-console": [0],
    "no-await-in-loop": [0],
    "no-plusplus": [0],
    "no-nested-ternary": [0],
    "react/no-nested-ternary": [0],
    "react-hooks/exhaustive-deps": [0],
    "radix": [0],
    "vars-on-top": [0],
    "semi": [
      2,
      "never"
    ],
    "semi-style": [
      "error",
      "first"
    ],
    "react/jsx-props-no-spreading": [0],
    "react/forbid-prop-types": [0],
    "react/require-default-props": [0],
    "react/jsx-no-useless-fragment": [0],
    "react/destructuring-assignment": [0],
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    "import/no-cycle": [0],
    "import/prefer-default-export": [0],
    "no-restricted-syntax": [0],
    "no-param-reassign": [0],
    "no-case-declarations": [0],
    "no-constant-condition": [0],
  }
}
