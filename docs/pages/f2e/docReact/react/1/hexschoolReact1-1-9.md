---
title: React 實戰影音課 1
---

# 9. JSX 是如何運作的
## 打開檔案 `/intro/howToWork.html`

  - `JSX` 讓 `React` 變得比較好寫，可以在 `JS` 裡面直接插入 `HTML` 結構。
  - `Babel` 是 `JS` 的編譯工具，`JSX` 必須透過 `Babel` 才可正常運行。

## 嘗試理解 Babel 運行，改寫為純 JS
### JSX
  ```ts
  function App() {
    return <h1>React 我來了 <small className="text-danger">{new Date().toLocaleDateString() }</small></h1>
  }
  ```

### JS
  ```ts
  function App() {
    return React.createElement('h1', null, 'React 我來了',
      React.createElement('small', {
        className: 'text-danger'
      }, new Date().toLocaleDateString())
    )
  }
  ```
