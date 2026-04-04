---
title: Nuxt3 學習筆記 - Ryan
---

# 4. Nuxt 3 + TypeScript + ESLint + Prettier 環境建置
## TypeScript
  提升開發時型別安全與 `IDE` 支援。
  - ### 設置類型檢查
    - #### 1. 安裝 VSCode 插件
      - ##### [Vue Language Features (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
        寫 `Vue 3` 強力推薦必裝的插件，包含了上色、語法提示、編輯器快速分割等強大功能，而且也是 `Nuxt 3` 推薦的編輯器插件。
      - ##### [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
        Vue 的 TypeScript 插件。

    - #### 2. 安裝 Vue 類型檢查套件
      ```sh
      npm install -D vue-tsc
      ```

    - #### 3. 調整 nuxt.config.ts 設定
      在 `nuxt.config.ts` 中，設置 `typescript.typeCheck: true` 來讓開發時期能執行類型檢查。
      ```ts
      export default defineNuxtConfig({
        typescript: {
          typeCheck: true
        }
      })
      ```

    - #### 4. 重新啟動開發環境服務
      重新執行 `npm run dev -- -o` 來重啟開發環境的服務

## ESLint
  用於統一定義 `JavaScript`/`TypeScript` 的程式碼風格，檢查縮排、引號使用、語法錯誤等。
  - ### 設置 ESLint 環境
    - #### 1. 安裝 ESLint 套件
      ```sh
      npm install -D @eslint/eslintrc @nuxtjs/eslint-config @nuxtjs/eslint-config-typescript @typescript-eslint/parser eslint@8.57.1 eslint-import-resolver-typescript eslint-plugin-import eslint-plugin-vue globals vue-eslint-parser
      ```

    - #### 2. 配置 ESLint 設定檔
      建立 `.eslint.config.js` 檔案
      ```js
      import { FlatCompat } from "@eslint/eslintrc";
      import globals from "globals";

      const compat = new FlatCompat({ baseDirectory: process.cwd() });

      export default [
        ...compat.extends("@nuxtjs/eslint-config-typescript"),
        ...compat.extends("plugin:vue/vue3-recommended"),
        {
          rules: {
            "no-undef": "off",
          },
          languageOptions: {
            globals: globals.browser,
            parserOptions: { ecmaVersion: 13, sourceType: "module" },
          },
        },
        {
          files: [
            "**/pages/**/*.{js,ts,vue}",
            "**/layouts/**/*.{js,ts,vue}",
            "**/app.{js,ts,vue}",
            "**/error.{js,ts,vue}"
          ],
          rules: {
            "vue/multi-word-component-names": "off"
          }
        }
      ];
      ```

  - ### 用 ESLint 來嘗試檢查
    ```xml
    <!-- app.vue -->
    <template>
      <div>
        <NuxtWelcome />
      </div>
    </template>

    <script lang="ts" setup>
      const year: number = 2022
      const title: string = `${year} iThome 鐵人賽`
    </script>
    ```

    接下來使用 `eslint` 檢查 `app.vue` 這個檔案
    ```sh
    npx eslint -- app/app.vue
    ```

## Prettier
  自動美化程式碼格式，讓團隊開發更一致

  - ### 1. 安裝Prettier 套件
    ```sh
    npm install -D prettier eslint-config-prettier eslint-plugin-prettier
    ```

  - ### 2. 配置 Prettier 設定檔案
    在根目錄建立 `.prettierrc.cjs`
    ```js
    module.exports = {
      printWidth: 100,          // 每行文字數量達 100 字元就換到新的一行
      semi: false,              // 每個語句的結尾不需要分號
      singleQuote: true,        // 字串使用單引號，而不是雙引號
      trailingComma: 'none'     // 如 Object、Array 內的元素不需要尾隨逗號
    }
    ```

  - ### 3. 配置 ESLint 設定檔案
    調整 `eslint.config.js`
    ```js
    import { FlatCompat } from "@eslint/eslintrc";
    import globals from "globals";

    const compat = new FlatCompat({ baseDirectory: process.cwd() });

    export default [
      ...compat.extends("@nuxtjs/eslint-config-typescript"),
      ...compat.extends("plugin:vue/vue3-recommended"),
      ...compat.extends("plugin:prettier/recommended"),
      {
        rules: {
          "no-undef": "off",
        },
        languageOptions: {
          globals: globals.browser,
          parserOptions: { ecmaVersion: 13, sourceType: "module" },
        },
      },
      {
        files: [
          "**/pages/**/*.{js,ts,vue}",
          "**/layouts/**/*.{js,ts,vue}",
          "**/app.{js,ts,vue}",
          "**/error.{js,ts,vue}"
        ],
        rules: {
          "vue/multi-word-component-names": "off"
        }
      }
    ];
    ```

  - ### 4. 安裝 VS Code 的 Prettier 插件
    - #### [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
      提供我們做程式碼的格式化，最重要的是來協助我們自動載入 `.prettierrc.js` 配置。

## 存檔自動格式化設定
  - ### 新增 .vscode/settings.json
    ```json
    {
      "editor.formatOnSave": true,
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "[vue]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      },
      "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      },
      "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      }
    }
    ```