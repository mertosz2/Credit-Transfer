import { fixupConfigRules, fixupPluginRules } from "@eslint/compat"
import react from "eslint-plugin-react"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import prettier from "eslint-plugin-prettier"
import globals from "globals"
import tsParser from "@typescript-eslint/parser"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  ...fixupConfigRules(
    compat.extends("plugin:react/recommended", "next", "prettier")
  ),
  {
    plugins: {
      react: fixupPluginRules(react),
      "@typescript-eslint": typescriptEslint,
      prettier
    },

    ignores: [
      ".next/**/*",
      "public/**/*",
      "dist/**/*",
      "next-env.d.ts",
      "node_modules/**/*",
      "yarn.lock",
      "package-lock.json",
      "public/**/*",
      "next.config.mjs"
    ],

    languageOptions: {
      globals: {
        ...globals.browser,
        ServiceWorkerGlobalScope: true,
        BeforeInstallPromptEvent: true,
        JSX: true
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },

    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"]
        }
      }
    },

    rules: {
      "prettier/prettier": [
        "warn",
        {
          endOfLine: "auto"
        }
      ],

      semi: "off",
      "import/extensions": "off",
      "no-console": "warn",
      quotes: "off",
      "react/react-in-jsx-scope": "off",
      "import/no-duplicates": "error",

      "import/no-unresolved": [
        2,
        {
          caseSensitive: false
        }
      ],

      "import/named": "error",
      "react/state-in-constructor": "off",
      "react/prop-types": "off",
      "react/no-children-prop": "off",
      "react/jsx-no-bind": "off",
      "react/no-access-state-in-setstate": "error",
      "react/no-danger": "off",
      "react/no-did-mount-set-state": "error",
      "react/no-did-update-set-state": "error",
      "react/no-will-update-set-state": "error",
      "react/no-redundant-should-component-update": "error",
      "react/no-this-in-sfc": "error",
      "react/no-typos": "error",
      "react/no-unused-state": "error",
      "no-useless-call": "error",
      "no-useless-computed-key": "error",
      "no-useless-concat": "error",
      "no-useless-constructor": "error",
      "no-useless-rename": "error",
      "no-useless-return": "error",
      "react/jsx-props-no-spreading": "off",
      "react/jsx-filename-extension": "off",
      "react/function-component-definition": "off",
      "react/jsx-no-useless-fragment": "off",
      "dot-notation": "off",

      "no-constant-condition": [
        "error",
        {
          checkLoops: false
        }
      ],

      "no-unused-expressions": "off",
      "consistent-return": "off",

      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],

      "no-underscore-dangle": ["off"],
      "comma-dangle": "off",
      "no-shadow": "warn",
      "@typescript-eslint/no-shadow": ["warn"],
      "import/prefer-default-export": "off",
      "next/no-assign-module-variable": "off",
      "max-len": [
        "warn",
        {
          code: 160
        }
      ],

      "react/jsx-max-props-per-line": [
        "warn",
        {
          maximum: {
            single: 1,
            multi: 2
          }
        }
      ],

      "import/no-cycle": "off",
      "no-param-reassign": "off",
      "react/require-default-props": "off",
      "jest/no-commented-out-tests": "off",
      "import/no-named-as-default": "off",

      "jsx-a11y/anchor-is-valid": [
        "off",
        {
          components: ["Link"],
          specialLink: ["hrefLeft", "hrefRight"],
          aspects: ["noHref", "invalidHref", "preferButton"]
        }
      ],

      "jsx-a11y/label-has-associated-control": [
        2,
        {
          labelComponents: ["CustomInputLabel"],
          labelAttributes: ["label"],
          controlComponents: ["CustomInput"],
          depth: 3
        }
      ],

      camelcase: "off",
      "react/no-unused-prop-types": "off"
    }
  },
  {
    files: [".next/**/*"],
    // เขียนเผื่อรับรองตอน .next มี cached files ที่ไม่สามารถเข้าถึงได้
    rules: {
      "@next/next/no-assign-module-variable": "off",
      "react/no-find-dom-node": "off",
      "react/display-name": "off"
    }
  }
]
