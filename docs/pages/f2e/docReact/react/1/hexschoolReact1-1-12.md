---
title: React 實戰影音課 1
---

# 12. JSX 開發中常見的錯誤
## 打開檔案 `/intro/commonProblem.html`
  - ### 1. 定義元件首字一定是大寫
    - 將 `app` function 改為 `App` function
      ```ts
      function app() {
        ...
      }

      // 改為
      function App() {
        ...
      }
      ```

  - ### 2. 多個元素外層需要使用標籤包覆，或使用 React.Fragment
    - 不能存在多個 跟元素
    - 在最外層增加 `<div></div>`
    - 或在 最外層使用 `<React.Fragment></React.Fragment>`
    - `React.Fragment`，可簡寫成`<></>`
    - `return` 與後方的 `<tag>` 標籤必須在同一行，或將後方的 `<tag>` 使用 `()` 包覆
      ```ts
      function App() {
        return (<div>...</div>)
      }
      ```
  
  - ### 3. 沒有正確結尾，結尾不正確
    - 如 `<input>` 必須加上結尾標籤 `<input />`

  - ### 4. 屬性轉換名稱運用要正確
    - 將 `label` 中的 `for`，改為 `htmlFor`
    - 將 `class` 改為 `className`
    - 將 `style` 改為 物件形式