---
title: React 實戰影音課 2
---

# 8. Promise 實戰運用
## 打開檔案 `/es6/promise.html`
  - ### 3. 實戰取得遠端資料
    - #### 3-1
      [axios](https://github.com/axios/axios) `Promise based` Http工具
      ```xml
      // 引入 CDN
      <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
      <script>
        console.dir(axios)
      </script>
      ```

      - [假資料API](https://randomuser.me/) 取得隨機使用者假資料
        ```ts
        axios.get('https://randomuser.me/api/')
          .then((res) => {
            console.log(res)
            return axios.get('https://randomuser.me/api/')
          })
          .then((res) => {
            console.log(res);
          })
        ```

    - #### 3-2 記得捕捉錯誤，Axios 錯誤捕捉技巧
      ```ts
      axios.get('https://randomuser.me/api/')
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err);
        })
      ```
      