---
title: React 實戰影音課 1
---

# 7. 表達式與 React 的關係
## 打開檔案 `/intro/expression.html`

  - 當我們要在 `JSX` 裡面的大括號加入任何程式碼，請確保它是表達式，它才能正確運行，
  - 在 `React` 中 `{}` 裡只能放 `表達式`，不能放 `陳述式`。

## Function 寫法
  - 宣告式
    ```ts
    function fn(params) {
      ...
    }
    ```

  - 表達式
    ```ts
    const fn = function() {
      ...
    }
    ```

