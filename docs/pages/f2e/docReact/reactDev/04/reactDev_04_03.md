---
title: '[React官網] React 19.2 教學文件'
---

# 逐步使用
  React 編譯器（`React Compiler`）可以逐步採用，允許你首先在代碼庫的特定部分嘗試使用。本指南將向你展示如何在現有項目中逐步推廣該編譯器的使用。

  :::info 你將學到
  - 為何推薦增量式採用
  - 使用 `Babel` 覆寫進行基於目錄的採用
  - 使用 `"use memo"` 指令進行選擇性編譯
  - 使用 `"use no memo"` 指令排除組件
  - 帶有 `gating` 的運行時特性標誌
  - 監控你的採用進度
  :::

## 為何採用漸進式遷移？
  React 編譯器的設計目的是自動優化你的整個代碼庫，但你不必一次性全部採用。漸進式採用讓你能夠控制推行過程，在擴展到其餘部分之前，先在應用程序的小部分上測試編譯器。

  - #### 從小處著手建立信心
    你可以驗證應用在編譯代碼下的行為是否正確、測量效能提升，並識別代碼庫中的任何特定邊緣情況。這對穩定性至關重要的生產應用程序尤其有價值。

  - #### 有條理地修復違規問題
    漸進式採用使得更容易處理編譯器可能發現的任何違反 `React` 規則的問題。你可以在擴展編譯器覆蓋範圍的同時有條不紊地解決這些問題，降低引入錯誤的風險。

  - #### 支持 A/B 測試
    通過控制代碼中哪些部分被編譯，你還可以運行 `A/B 測試` 以衡量編譯器優化在實際應用中的效果，並向團隊展示其價值。

## 漸進式採用的方法
  有三種主要方法可以逐步採用 `React` 編譯器：
  1. `覆蓋 Babel` - 將編譯器應用於特定目錄
  2. `通過 "use memo" 選擇加入` - 僅編譯明確選擇加入的組件
  3. `運行時控制` - 通過功能標誌（Feature Flags）控制編譯

  所有方法都允許你在完全上線之前，在應用程序的特定部分上測試該編譯器。

## 基於目錄的採用與 Babel 覆蓋
  `Babel` 的 `overrides` 選項允許你將不同的插件應用於代碼庫的不同部分。這對於逐步在各個目錄中採用 `React` 編譯器非常理想。

  - ### 基本配置
    首先將編譯器應用到特定目錄（例如：`src/modern`）：

    ```js
    // babel.config.js
    module.exports = {
      plugins: [
        // 適用於所有文件的全域插件
      ],
      overrides: [
        {
          test: './src/modern/**/*.{js,jsx,ts,tsx}',
          plugins: [
            'babel-plugin-react-compiler'
          ]
        }
      ]
    };
    ```

  - ### 擴展覆蓋範圍
    隨著你信心的增加，添加更多目錄，也可以同時保留舊代碼的其他特殊插件配置：

    ```js
    // babel.config.js
    module.exports = {
      plugins: [
        // 全域插件
      ],
      overrides: [
        {
          test: ['./src/modern/**/*.{js,jsx,ts,tsx}', './src/features/**/*.{js,jsx,ts,tsx}'],
          plugins: [
            'babel-plugin-react-compiler'
          ]
        },
        {
          test: './src/legacy/**/*.{js,jsx,ts,tsx}',
          plugins: [
            // 針對舊代碼的不同插件
          ]
        }
      ]
    };
    ```

  - ### 使用配置編譯器選項
    你還可以透過 `overrides` 來為不同目錄設定不同的編譯器選項：

    ```js
    // babel.config.js
    module.exports = {
      plugins: [],
      overrides: [
        {
          test: './src/experimental/**/*.{js,jsx,ts,tsx}',
          plugins: [
            ['babel-plugin-react-compiler', {
              // 選項 ...
            }]
          ]
        },
        {
          test: './src/production/**/*.{js,jsx,ts,tsx}',
          plugins: [
            ['babel-plugin-react-compiler', {
              // 選項  ...
            }]
          ]
        }
      ]
    };
    ```

## 使用 "use memo" 的選擇加入模式
  如需最大程度的控制，你可以使用 `compilationMode: 'annotation'`，僅編譯那些通過 `"use memo"` 指令顯式選擇加入的組件和 `Hook`。

  - ### 選擇加入模式配置
    ```js
    // babel.config.js
    module.exports = {
      plugins: [
        ['babel-plugin-react-compiler', {
          compilationMode: 'annotation',
        }],
      ],
    };
    ```

  - ### 選擇加入指令
    在要編譯的函數（組件或自定義 Hook）開頭添加 `"use memo"`：
    ```js
    function TodoList({ todos }) {
      "use memo"; // 這個組件會被編譯優化

      const sortedTodos = todos.slice().sort();
      return (
        <ul>
          {sortedTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      );
    }

    function useSortedData(data) {
      "use memo"; // 這個自定義 Hook 會被編譯優化

      return data.slice().sort();
    }
    ```

  使用 `compilationMode: 'annotation'` 時，你必須：
  - 在每個需要優化的組件中添加 `"use memo"`
  - 在每個自定義 `Hook` 中添加 `"use memo"`
  - 記得在新編寫的組件中也添加它

## 運行時控制
  `gating` 選項使你能夠在運行時使用功能標誌（`Feature Flags`）控制編譯。這對於運行 `A/B 測試` 或根據用戶細分逐步推出編譯器非常有用。

  - ### 運行時控制工作原理
    編譯器會在優化後的代碼周圍添加運行時檢查。如果開關返回 `true`，則運行優化版本；否則運行原始代碼。

  - ### 控制配置
    ```js
    // babel.config.js
    module.exports = {
      plugins: [
        ['babel-plugin-react-compiler', {
          gating: {
            source: 'ReactCompilerFeatureFlags',
            importSpecifierName: 'isCompilerEnabled',
          },
        }],
      ],
    };
    ```

  - ### 實現功能標誌
    創建一個模組來導出你的控制函數：
    ```js
    // ReactCompilerFeatureFlags.js
    export function isCompilerEnabled() {
      // 使用你的特性開關系統
      return getFeatureFlag('react-compiler-enabled');
    }
    ```

## 故障排除
  如果在採用過程中遇到問題：
  1. 使用 `"use no memo"` 臨時排除有問題的組件。
  2. 查閱 [調試指南](/pages/f2e/docReact/reactDev/04/reactDev_04_04.html) 以了解常見問題。
  3. 修復 `ESLint` 插件識別出的 `React` 規則違規。
  4. 考慮使用 `compilationMode: 'annotation'` 以更漸進的方式採用。