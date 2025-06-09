---
title: React 實戰影音課 2
---

# 1. JavaScript 常見縮寫
## 打開檔案 `/es6/shorthand.html`

## 1. 語法糖與新增語法
  - `語法糖`：不會影響運作，邏輯與當前 JS 一致
    ```ts
    const obj = {
      myName: '物件',
      fn: function() {
        return this.myName;
      }
    }
    ```

  - 新增語法：會影響運作
    - 若將 `fn` 改成 `箭頭函式`，是會出錯的，`this` 會指向到 全域。
      ```ts
      var myName = '全域';
      const obj2 = {
        myName: '物件',
        fn: () => {
          return this.myName;
        }
      }
      ```

## 2. 物件字面值 Object literals
  - ### 1. 物件內的函式
    ```ts
    const obj3 = {
      myName: '物件',
      fn() { // 縮寫
        return this.myName;
      }
    }
    ```

  - ### 2. 物件內的變數
    ```ts
    const name = '小明';
    function fn() {
      return this.name;
    }
    const person = {
      name,
      fn,
    };
    ```

## 3. 展開
  - ### 1. 不同陣列合併
    ```ts
    const groupA = ['小明', '杰倫', '阿姨'];
    const groupB = ['老媽', '老爸'];

    const groupC = [...groupA, ...groupB]
    ```

  - ### 2. 物件擴展
    ```ts
    const methods = {
      fn1() {
        console.log(1);
      },
      fn2() {
        console.log(1);
      },
    }

    const newMethods = {
      ...methods,
      fn3() {
        console.log(3);
      }
    }
    ```

  - ### 3. 轉成純陣列
    - 補充說明：`NodeList` 或 `HTMLCollection` 或 `Arguments` 是「`類陣列`」的物件，可以運用本章節的展開技巧轉換為純陣列。
    - [Argument](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments)
    - [HTMLCollection](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCollection)
    - [NodeList](https://developer.mozilla.org/zh-CN/docs/Web/API/NodeList)

    ```ts
    const doms = document.querySelectorAll('li');
    const list = [1, 2, 3]

    doms.map(e => console.log(e));    // 類陣列沒有 map 方法
    list.map(e => console.log(e));    // 可正常運行

    const newDoms = [...doms];
    newDoms.map(e => console.log(e));    // 可正常運行
    ```

## 4. 參數預設值
  ```ts
  function sum(a, b = 1) {  // 預設值避免錯誤
    return a + b;
  }
  console.log(sum(1));
  ```