---
title: Nuxt3 學習筆記 - Ryan
---

# 5. 如何使用 Tailwind CSS
  有兩種配置的方法：
  - 使用 Nuxt Tailwind 模組
  - Tailwind CSS 官方指引步驟

## 使用 Nuxt Tailwind 模組
  - ### 1. 安裝相關套件
    ```sh
    npm install -D @nuxtjs/tailwindcss
    ```

  - ### 2. 添加模組至 `nuxt.config.ts`
    打開 `./nuxt.config.ts` 將 `@nuxtjs/tailwindcss` 模組添加至 `modules` 設定參數中
    ```ts
    // https://v3.nuxtjs.org/api/configuration/nuxt.config
    export default defineNuxtConfig({
      modules: ['@nuxtjs/tailwindcss']
    })
    ```

  - ### 3. 重啟 `Nuxt` 服務
    ```sh
    npm run dev
    ```
  
  - ### 擴充或覆寫@nuxtjs/tailwindcss配置
    專案內若使用 `@nuxtjs/tailwindcss` 模組，這兩個 `tailwind.css` 與 `tailwind.config.js` 檔案其實模組已經有預設，不需要手動建立，`tailwind.css` 對應模組內的 `tailwind.css` 可以參考專案檔案內容 [tailwind.css](https://github.com/nuxt-modules/tailwindcss/blob/main/src/runtime/tailwind.css)，tailwind.config.js 則是透過模組動態新增配置。

    - #### tailwind.css
      專案目錄下若存在路徑檔名一致的 `./assets/css/tailwind.css` 檔案，`@nuxtjs/tailwindcss` 就會以這個檔案取代模組內預設的 `tailwind.css` 檔案。

      - ##### `tailwind.css` 預設內容如下：
        ```css
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        ```

      - ##### `tailwind.config.js`
        專案目錄下若存在 `tailwind.config.js` 檔案就會以新的配置拓展或覆寫 `@nuxtjs/tailwindcss` 預設的 `tailwind.config`。

        例如，我們想拓展或覆寫 content 的配置
        ```js
        /** @type {import('tailwindcss').Config} */
        module.exports = {
          content: [
            './components/**/*.{vue,js,ts}',
            './layouts/**/*.vue',
            './pages/**/*.vue',
            './composables/**/*.{js,ts}',
            './plugins/**/*.{js,ts}',
            './app.{js,ts,vue}'
          ],
          theme: {
            extend: {}
          },
          plugins: []
        }
        ```

## Tailwind CSS 官方指引步驟
  若使用 `@nuxtjs/tailwindcss` 進行配置可以跳過這段。

  - ### 1. 安裝相關套件
    ```sh
    npm install -D tailwindcss postcss@latest postcss-custom-properties@latest autoprefixer@latest
    ```

  - ### 2. 建立 tailwind.config.js
    ```sh
    npx tailwindcss init
    ```

  - ### 3. 調整 tailwind.config.js
    在 `content` 添加一些路徑：
    ```js
    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        './components/**/*.{vue,js,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './composables/**/*.{js,ts}',
        './plugins/**/*.{js,ts}',
        './app.{js,ts,vue}'
      ],
      theme: {
        extend: {}
      },
      plugins: []
    }
    ```

  - ### 4. 建立 tailwind.css
    建立目錄 `assets` 與子目錄 css 用來放置 `Tailwind CSS` 的自定義指令， `tailwind.css` 的路徑應會是 `./assets/css/tailwind.css` 檔案內容如下。
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

  - ### 5. 配置全域共用 CSS
    修改專案根目錄的 `nuxt.config.ts` 檔案，在 css 參數陣列內新增 `tailwind.css` 路徑，讓 Nuxt 可以配置全域共用的 CSS，並添加 `postcss` 選項及我們剛才安裝的套件作為插件，最後 `nuxt.config.ts` 檔案看起來如下。
    ```ts
    // https://v3.nuxtjs.org/api/configuration/nuxt.config
    export default defineNuxtConfig({
      postcss: {
        plugins: {
          'postcss-import': {},
          'tailwindcss/nesting': {},
          tailwindcss: {},
          autoprefixer: {}
        }
      },
      css: ['@/assets/css/tailwind.css'],
      typescript: {
        typeCheck: true
      }
    })
    ```

  建完後專案目錄會是：
  ```sh
  nuxt-app
  ├── .nuxt/
  ├── assets/
  │   └── css/
  │       └── tailwind.css      // 手動新增的檔案，用於設置 Tailwind CSS 指令並讓全部頁面引用
  ├── node_modules/
  ├── .eslintrc.js
  ├── .gitignore
  ├── .prettierrc.js
  ├── app.vue
  ├── nuxt.config.ts
  ├── package-lock.json
  ├── package.json
  ├── README.md
  ├── tailwind.config.js       // Tailwind 初始化指令產生的設定檔
  └── tsconfig.json
  ```

## 自動排序 Tailwind CSS 的 Class
  - ### 1. 安裝插件
    ```sh
    npm install -D prettier-plugin-tailwindcss
    ```

  - ### 2. 配置設定檔
    開啟 `.prettierrc.js` 檔案，添加 `'prettier-plugin-tailwindcss'` 至 `plugins` 陣列中：
    ```ts
    module.exports = {
      plugins: [
        'prettier-plugin-tailwindcss'
      ],
      printWidth: 100,          // 每行文字數量達 100 字元就換到新的一行
      semi: false,              // 每個語句的結尾不需要分號
      singleQuote: true,        // 字串使用單引號，而不是雙引號
      trailingComma: 'none'     // 如 Object、Array 內的元素不需要尾隨逗號
    }
    ```

  - ### 3. 自動修正效果
    設置 `editor.codeActionsOnSave` 中 `source.fixAll.eslint: true` 來達到保存後自動修正 `prettier` 引發的 `ESLint` 錯誤。
    ```json
    "editor.codeActionsOnSave": {
      "source.fixAll": true
    }
    ```

  相較於 `Tailwind CSS` 官方指引的安裝方式，使用 `Nuxt Community` 幫我們整理好的 `@nuxtjs/tailwindcss` 模組，可以省去繁瑣的設定步驟，也解決了一些目前 `Nuxt 3` 專案中，導入 `Tailwind CSS` 使用 `HMR` 可能無法自動編譯並重新套用等問題。