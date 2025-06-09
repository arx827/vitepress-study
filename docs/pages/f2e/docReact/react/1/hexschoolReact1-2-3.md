---
title: React 實戰影音課 2
---

# 3. 箭頭函式
## 打開檔案 `/es6/arrowFunction.html`
  - ### 1. 箭頭函式改寫
    ```ts
    function fn(a, b) {
      return a * b;
    }
    console.log(fn(2, 4));
    ```

    改寫

    ```ts
    fconst fn = (a, b) => {
      return a * b;
    }
    console.log(fn(2, 4));
    ```
    - 省略 `return`
      ```ts
      fconst fn = (a, b) => a * b;
      ```
    - 省略傳參括號 `()`
      ```ts
      const fn = n => n;
      ```
      - 當參數只有一個的時候，可以把括號移除掉。
      - 只有括號時，不能移除。
      - 參數一個以上時，不可移除。
    - 當回傳參數為 `object` 時，省略 `return` 必須加 `()`
      ```ts
      const fn = () => ({
        name: '小明'
      })
      ```

  - ### 2. 箭頭函式的 this 變化（React Hook 寫法不太會踩到這個雷）
    ```ts
    var name = '全域'
    const person = {
      name: '小明',
      callName: function () { 
        console.log('1', this.name);    // 1 小明
        setTimeout(function () {
          console.log('2', this.name);  // 2 全域
          console.log('3', this);       // 3 window
        }, 10);
      },
    }
    person.callName();
    ```

    當改為箭頭函式後，`this` 將會指向同個地方

    ```ts
    var name = '全域'
    const person = {
      name: '小明',
      callName: function () { 
        console.log('1', this.name);    // 1 小明
        setTimeout(() => {
          console.log('2', this.name);  // 2 小明
        }, 10);
      },
    }
    person.callName();
    ```

    箭頭函式 中的 `this` 指向會跟外層作用域是一模一樣的。

  - ### 3. 箭頭函式在 React 的運用
    ```ts
    const Card = () => {
      return (<div className="card">
        <div className="card-body">這是一張卡片</div>
      </div>)
    };

    const App = () => {
      return (
        <div>
          <Card></Card>
        </div>
      )
    };
    ```