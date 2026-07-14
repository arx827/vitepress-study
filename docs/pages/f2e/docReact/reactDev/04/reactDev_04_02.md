---
title: '[React官網] React 19.2 教程'
---

# 安裝
  本指南將幫助你在 `React` 應用程式中安裝和配置 `React` 編譯器（`React Compiler`）。

  :::info 你將學到
  - 如何安裝 React 編譯器
  - 不同建構工具的基本配置
  - 如何驗證你的設置是否正常工作
  :::

## 前提條件
  `React` 編譯器專為與 `React 19` 配合使用而設計，但也支持 `React 17` 和 `18`。

## 安裝
  將 `React` 編譯器安裝為 `devDependency`：

  - #### 使用 npm
    ```sh
    npm install -D babel-plugin-react-compiler@latest
    ```
  - #### 使用 Yarn
    ```sh
    yarn add -D babel-plugin-react-compiler@latest
    ```
  - #### 使用 pnpm
    ```sh
    pnpm install -D babel-plugin-react-compiler@latest
    ```

## 基本設置
  `React` 編譯器默認無需任何配置即可工作。不過，如果在特殊情況下需要進行配置（例如：支持低於 19 版本的 `React`），請參考[選項參考文檔](https://zh-hans.react.dev/reference/react-compiler/configuration)。

  設置過程取決於你使用的建構工具。`React` 編譯器包含一個 `Babel` 插件，可以集成到你的建構流程中。

  - ### Babel
    創建或更新你的 `babel.config.js`：

    ```jsx
    module.exports = {
      plugins: [
        'babel-plugin-react-compiler', // 必須首先運行！
        // ... 其他插件
      ],
      // ... 其他配置
    };
    ```

  - ### Vite
    如果你使用 `Vite v6.0.0` 或者更高版本，需要安裝 `@rolldown/plugin-babel`，並從 `@vitejs/plugin-react` 中導出並配置 `reactCompilerPreset`：
    ```sh
    npm install -D @rolldown/plugin-babel
    ```

    ```js {3,10}
    // vite.config.js
    import { defineConfig } from 'vite';
    import react, { reactCompilerPreset } from '@vitejs/plugin-react';
    import babel from '@rolldown/plugin-babel';

    export default defineConfig({
      plugins: [
        react(),
        babel({
          presets: [reactCompilerPreset()]
        }),
      ],
    });
    ```

    或直接使用插件配置
    ```js {3,10}
    // vite.config.js
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
    import babel from '@rolldown/plugin-babel';

    export default defineConfig({
      plugins: [
        react(),
        babel({
          plugins: ['babel-plugin-react-compiler'],
        }),
      ],
    });
    ```

  - ### Next.js
    更多信息請參考 [Next.js 官方文檔](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler)。

  - ### React Router
    安裝 `vite-plugin-babel`，並將編譯器的 `Babel` 插件添加到配置中：
    ```sh
    npm install vite-plugin-babel
    ```

    ```js {3-4,16}
    // vite.config.js
    import { defineConfig } from "vite";
    import babel from "vite-plugin-babel";
    import { reactRouter } from "@react-router/dev/vite";

    const ReactCompilerConfig = { /* ... */ };

    export default defineConfig({
      plugins: [
        reactRouter(),
        babel({
          filter: /\.[jt]sx?$/,
          babelConfig: {
            presets: ["@babel/preset-typescript"], // 如果你使用 TypeScript
            plugins: [
              ["babel-plugin-react-compiler", ReactCompilerConfig],
            ],
          },
        }),
      ],
    });
    ```

  - ### Webpack
    社區開發的 `webpack loader` 現在可以從指定開源倉庫（[SukkaW/react-compiler-webpack](https://github.com/SukkaW/react-compiler-webpack)）獲取。

  - ### Expo
    請參考 [Expo 官方文檔](https://docs.expo.dev/guides/react-compiler/) 以了解如何在 Expo 應用中啟用並使用 React 編譯器。

  - ### Metro (React Native)
    `React Native` 通過 `Metro` 使用 `Babel`，因此請參考 [與 Babel 配合使用](#babel) 章節獲取安裝說明。

  - ### Rspack
    請參考 [Rspack 官方文檔](https://rspack.dev/guide/tech/react#react-compiler) 以了解如何在 `Rspack` 應用中啟用並使用 `React` 編譯器。

  - ### Rsbuild
    請參考 [Rsbuild 官方文檔](https://rsbuild.dev/guide/framework/react#react-compiler) 以了解如何在 `Rsbuild` 應用中啟用並使用 `React` 編譯器。

## ESLint Integration
  `React` 編譯器包含一條 `ESLint` 規則，可幫助識別無法優化的代碼。當 `ESLint` 規則報告錯誤時，意味著編譯器將跳過對該特定組件或 `Hook` 的優化。
  這是安全的，編譯器將繼續優化代碼庫的其他部分。你可以按照自己的節奏逐步解決這些問題。

  - #### 安裝 ESLint 插件
    ```sh
    npm install -D eslint-plugin-react-hooks@latest
    ```

    編譯器規則可在 `recommended-latest` 預設中找到。

    - ESLint 規則將會：
      - 識別對 [React 規則](https://zh-hans.react.dev/reference/rules) 的違反情況
      - 顯示哪些組件無法被優化
      - 提供有用的錯誤信息來幫助修復問題

## 驗證你的設置
  安裝後，請驗證 React 編譯器是否正常工作。

  - ### 檢查 React DevTools
    由 React 編譯器優化的組件會在 `React DevTools` 中顯示一個 `Memo ✨` 徽章：
    1. 安裝 [React Developer Tools](/pages/f2e/docReact/reactDev/03/reactDev_03_03.html) 瀏覽器擴充功能
    2. 在開發模式下打開你的應用
    3. 打開 `React DevTools`
    4. 查看組件名稱旁邊是否出現 ✨ 表情符號

  - ### 檢查建構輸出
    你也可以通過檢查建構輸出來驗證編譯器是否正在運行。編譯後的代碼將包含編譯器自動添加的自動記憶化邏輯（例如導入自 `react/compiler-runtime` 的快取陣列邏輯）。
    ```js
    import { c as _c } from "react/compiler-runtime";
    export default function MyApp() {
      const $ = _c(1);
      let t0;
      if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = <div>Hello World</div>;
        $[0] = t0;
      } else {
        t0 = $[0];
      }
      return t0;
    }
    ```

## 故障排除
  - ### 排除特定組件
    如果某個組件在編譯後引發問題，可以使用 `"use no memo"` 指令暫時將其排除：
    ```js
    function ProblematicComponent() {
      "use no memo";
      // 這裡是組件代碼
    }
    ```

    這會告訴編譯器跳過對該特定組件的優化。你應該修復根本問題，並在解決後移除該指令。

## 下一步
  既然你已經安裝了 React 編譯器，可以進一步了解以下內容：
  - [React 版本兼容性](https://zh-hans.react.dev/reference/react-compiler/target)（適用於 React 17 和 18）
  - [配置選項](https://zh-hans.react.dev/reference/react-compiler/configuration)（用於自定義編譯器）
  - [漸進採用策略](/pages/f2e/docReact/reactDev/04/reactDev_04_03.html)（用於現有的代碼庫）
  - [調試技巧](/pages/f2e/docReact/reactDev/04/reactDev_04_04.html)（用於排查問題）
  - [編譯庫指南](https://zh-hans.react.dev/reference/react-compiler/compiling-libraries)（用於編譯你的 React 庫）