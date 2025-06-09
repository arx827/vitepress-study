---
title: React 實戰影音課 2
---

# 9. Async function 與 await
## 打開檔案 `/es6/asyncAwait.html`
  - ### 1. 當資料有順序性的時候
    - #### 1. 取得 seed
    - #### 2. 再次取得用戶，此用戶會與第一者相同
      ```ts
      axios.get('https://randomuser.me/api/')
        .then((res) => {
          const { seed } = res.data.info
          console.log(seed)
          return  axios.get(`https://randomuser.me/api/?seed=${seed}`)
        })
        .then((res) => {
          console.log(res)
        })
      ```

  - ### 2. 使用 async await 來修改
    ```ts
    const asyncFn = async () => {
      // 同步
      const res = await axios.get('https://randomuser.me/api/')
      const { seed } = res.data.info
      const res1 = await axios.get(`https://randomuser.me/api/?seed=${seed}`)
      console.log(res, res2);
    }

    asyncFn();
    ```

  - ### 3. 立即函式的寫法
    ```ts
    (async () => {
      const res = await axios.get('https://randomuser.me/api/')
      const { seed } = res.data.info
      const res1 = await axios.get(`https://randomuser.me/api/?seed=${seed}`)
      console.log(res, res2);
    })()
    ```


  