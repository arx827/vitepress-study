---
title: React 實戰影音課 2
---

# 7. 非同步與 Promise
## 打開檔案 `/es6/promise.html`
  - ### 1. 非同步的觀念
    ```ts
    function getData() {
      setTimeout(() => {
        console.log('... 已取得遠端資料');
      }, 0);
    }
    // 請問取得資料的順序為何
    function init() {
      console.log(1);
      getData();
      console.log(2);
    }

    init();
    ```
    執行順序為：
    - 1
    - 2
    - ... 已取得遠端資料

    更正確的說法，`Promise` 是為了解決傳統 `非同步語法` 難以建構及管理的問題，如有興趣可搜尋 `"callback hell js"`

  
  - ### 2. Promise
    `Promise` 失敗或成功只會擇一執行
    ```ts
    const promiseSetTimeout = (status) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (status) {
            resolve('promiseSetTimeout 成功')
          } else {
            reject('promiseSetTimeout 失敗')
          }
        }, 0);
      })
    }
    ```

    - #### 2-1. 基礎運用
      ```ts
      console.log(1);
      promiseSetTimeout(true)
        .then((res) => {
          console.log(res);
          console.log(2);
        })
      ```

      執行順序為：
      - 1
      - promiseSetTimeout 成功
      - 2

    - #### 2-2. 串接
      > 欲執行 1 > promise > 2 > promise > 3
      ```ts
      console.log(1);
      promiseSetTimeout(true)
        .then((res) => {
          console.log(res);
          console.log(2);
          return promiseSetTimeout(true)
        })
        .then((res) => {
          console.log(res);
          console.log(3);
        })
      ```

      執行順序為：
      - 1
      - promiseSetTimeout 成功
      - 2
      - promiseSetTimeout 成功
      - 3

    - #### 2-3. 失敗捕捉
      ```ts
      promiseSetTimeout(false)
        .then((res) => {
          cosole.log(res)
        })
        .catch((err) => {
          cosole.log(err)
        })
      ```