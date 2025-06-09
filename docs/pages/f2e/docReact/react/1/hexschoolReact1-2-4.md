---
title: React 實戰影音課 2
---

# 4. 陣列迴圈處理手法
## 打開檔案 `/es6/forEach.html`
  ```ts
  const people = [
    {
      name: '卡斯伯',
      like: '鍋燒意麵',
      price: 80
    },
    {
      name: '小明',
      like: '牛肉麵',
      price: 120
    },
    {
      name: '漂亮阿姨',
      like: '滷味切盤',
      price: 40
    },
    {
      name: 'Ray',
      like: '大麻醬乾麵',
      price: 60
    }
  ];
  ```

  - ### 1. 更完整的陣列，也可參考此影片
    [連結](https://www.youtube.com/watch?v=_vFuDQ_6Xt8)

  - ### 2. 操作所有陣列內的值（同一個陣列）
    ```ts
    people.forEach((item, i, array) => {
      item.newPrice = item.price * 0.8;
    })
    ```
    - `item` 是每次迭代的值
    - `i` 是陣列的索引(key)
    - `array` 陣列本身

  - #### 3. 重新建立新的陣列
    ```ts
    const order = people.map((item, i) => {
      return {
        price: item.price * 0.8,
        title: item.like
      }
    })
    ```

  - ### 4. map 使用注意事項
    ```ts
    const order = people.map((item, i) => {
      if( item.price > 60 ){
        return {
          price: item.price * 0.8,
          title: item.like
        }
      }
    })
    ```

    回傳結果會有 2 個 `undefined`，原因是因為 `map` 處理 陣列4 就會回傳 陣列4，沒有回傳值，就會回傳 `undefined`。

    - 解法：
      ```ts
      const filterOrder = people.filter(( item ) => item.price > 60 ).map((item, i) => ({
        price: item.price * 0.8,
        title: item.like
      }))
      ```

  - ### 5. map 在 React 中的運用
    ```ts
    const App = ()=> {
      const people = [
        {
          name: '卡斯伯',
          like: '鍋燒意麵',
          price: 80
        },
        {
          name: '小明',
          like: '牛肉麵',
          price: 120
        },
        {
          name: '漂亮阿姨',
          like: '滷味切盤',
          price: 40
        },
        {
          name: 'Ray',
          like: '大麻醬乾麵',
          price: 60
        }
      ];
      return <div>
        <ul>
          {
            people.map((item, i) => {
              return <li key={i}>{item.name} 喜歡吃 {item.like}</li>
            })
          }
        </ul>
      </div>
    }
    ```