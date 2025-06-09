---
title: React 實戰影音課 1
---

# 8. JS型別與JSX
## 打開檔案 `/intro/jsType.html`

## 1. JSX 不會呈現物件型別以及特定的原始型別
  - ### 當試圖將 `object` 使用在 `React` 的子元素中時：
    ```ts
    { object }
    ``` 

    會出現錯誤：`Objects are not valid as a React child` (這並不是一個有效的 React 子元素)

    如果想看到這個物件的內容的話，可以使用 `JSON.stringify()` 把物件轉成字串的形式。
    ```ts
    { JSON.stringify(object) }
    ```

  - ### 當試圖將 `boolean` 使用在 `React` 的子元素中時：
    ```ts
    { true }
    ```
    是無法呈現的，必須改成
    ```ts
    { true.toString() }
    ```

  - ### undefined 與 null 都是無法呈現的：
    ```ts
    { undefined }
    { null }
    ```

## 2. 陣列中的值會直接呈現在畫面上
  陣列會直接將內容顯示於畫面上：
  ```ts
  { [1, 2, 3] }
  ```
  會直接顯示 `123`

  在陣列中加入 `tag` 也是可以運行的
  ```ts
  { [1, 2, 3, <div>4</div> ] }
  ```

## 3. 嘗試加入 List Group
  - [Bootstrap list-groups](https://getbootstrap.com/docs/5.2/components/card/#list-groups)

  - 一般插入方式
    ```ts
    function App() {
      const list = <div>
        <li className="list-group-item">An item</li>
        <li className="list-group-item">A second item</li>
        <li className="list-group-item">A third item</li>
      </div>;

      <ul className="list-group list-group-flush">
        { list }
      </ul>

      // 略...
    }
    ```

  - 插入陣列
    ```ts
    function App() {
      const list = [
        <li className="list-group-item">An item</li>,
        <li className="list-group-item">A second item</li>,
        <li className="list-group-item">A third item</li>,
      ];

      <ul className="list-group list-group-flush">
        { list }
      </ul>

      // 略...
    }
    ```
