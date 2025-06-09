---
title: React 實戰影音課 1
---

# 11. React 行內樣式
## 打開檔案 `/intro/jsxStyle.html`
  - 此處指的 `style` 指的是 `inline style` (行內樣式)

## 不同的 render 方式
  - 分段建立
    ```ts
    const el = document.getElementById('root');
    const root = ReactDOM.createRoot(el);
    root.render(<App />)
    ```
  
  - 單行建立
    ```ts
    ReactDOM
      .createRoot(document.getElementById('root'))
      .render(<App />)
    ```

## 將樣式加到畫面上
  - ### 使用物件的方式
    在 `tsx` 中要加入 `style`，必須使用物件的方式：
    ```ts
    <div className="card" style={{
      ...
    }}>
    ```
    - 第一個花括號是，在 `JSX` 裡面插入表達式
    - 第二個花括號代表的是 加入`style物件`。
  
  - ### 將 `value`改為字串形式
    屬性必須將 `value`，改為字串形式。
    ```ts
    {
      width: '18rem',
    }
    ```
  
  - ### `key` 必須改為小駝峰的方式撰寫
    物件中的 `key` 必須改為小駝峰的方式撰寫。
    - `background-size` 改為 `backgroundSize`
    - `background-position` 改為 `backgroundPosition`
    ```ts
    {
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
    }
    ```
