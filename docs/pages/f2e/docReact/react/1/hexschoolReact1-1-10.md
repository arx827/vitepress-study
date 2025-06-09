---
title: React 實戰影音課 1
---

# 10. JSX 與 HTML 的標籤屬性
## 打開檔案 `/intro/reactAttr.html`

## 嘗試將 HTML 結構轉為 JSX
  - HTML
    ```html
    <div>
      <div><button type="button" class="btn btn-primary">Primary</button></div>
      <div><input type="checkbox" checked /></div>
      <div><input type="text" value="卡斯伯" /></div>
      <div>
        <label for="email">請輸入 Email</label>
        <input type="email" id="email" />
      </div>
      <div>
        <select name="" id="">
          <option value="1">1</option>
          <option value="2" selected="">2</option>
          <option value="3">3</option>
        </select>
      </div>
      <div>
        <textarea name="" id="" cols="30" rows="5">
          這裡可以放多行文字
        </textarea>
      </div>
      <div><div>這裡有一段文字</div></div>
      <div><input type="text" /></div>
    </div>
    ```

  - JSX
    ```ts
    function App() {
      const htmlTemplate = '<div>這裡有一段文字</div>'

      return (
        <div>
          {/* className */}
          <div><button type="button" className="btn btn-primary">Primary</button></div>

          {/* checked 與 結尾標籤 */}
          <div><input type="checkbox" defaultChecked /></div>

          {/* defaultValue & value */}
          <div><input type="text" value="卡斯伯" /></div>

          {/* htmlFor */}
          <div>
            <label htmlFor="email">請輸入 Email</label>
            <input type="email" id="email" />
          </div>

          {/* selected */}
          <div>
            <select name="" id="" defaultValue="2">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>

          { /* textarea */ }
          <div>
            <textarea name="" id="" cols="30" rows="5" defaultValue="這裡可以放多行文字" />
          </div>

          {/* dangerouslySetInnerHTML */}
          <div dangerouslySetInnerHTML={ htmlTemplate } />

          {/* onChange */}
          <div><input type="text" onChange={ function(event) { console.log(event.target.value)} }/></div>

        </div>
      );
    }
    ```

### 調整重點整理
  - 將 `class` 改為 `className`。
  - 將 `checkbox`，預設勾選的 `checked` 改為 `defaultChecked`。
  - 將 `value`，改為 `defaultValue`。
  - 將 `label` 的 `for`，改為 `htmlFor`。
  - 在 `select` 中，預設值會在 `option` 中加入 `selected`，需改為在 `select` 上加上 `defaultValue="2"`。
  - 在 `textarea` 中，需要將內容文字改寫成 `defaultValue`。
  - 由於安全性問題，無法將變數中的 `html` 字串直接渲染 `htmlTemplate`，必須改寫成：
    ```ts
    const htmlTemplate = {
      __html: '<div>這裡有一段文字</div>'
    }

    return <div dangerouslySetInnerHTML={ htmlTemplate } />
    ```
  - 若要驅動 `input` 的 `change`，必須加入 `onChange`，若想取得輸入的值，必須使用 `event`：
    ```ts
    <input type="text" onChange={ function(event) { console.log(event.target.value)} }/>
    ```

