---
title: React 實戰影音課 2
---

# 5. JSX 章節作業優化
## 打開檔案 `/intro/introFinal.html`
  ```ts
  function App() {
    const products = {
      toothbrush: {
        imageUrl: 'https://images.unsplash.com/photo-1520013573795-38516d2661e4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1536&q=80',
        title: '清潔力超強牙刷',
        price: 99,
        link: 'https://www.google.com.tw/'
      },
      sponge: {
        imageUrl: 'https://images.unsplash.com/photo-1618038483079-bfe64dcb17f1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        title: '洗刷刷海綿',
        price: 65,
        link: 'https://twitter.com/'
      },
      hook: {
        imageUrl: 'https://images.unsplash.com/photo-1546552696-7d5f4e89b0e8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        title: '萬用掛勾',
        price: 120,
        link: 'https://www.facebook.com/WccCasper'
      },
    }

    return <>
      <div className="row row-cols-3">
        <div className="col">
          <a className="card" target="_blank" href={products.toothbrush.link} >
            <img src={products.toothbrush.imageUrl} className="card-img-top object-fit" alt="...">
            <div className="card-body">
              <span className="text-dark">{products.toothbrush.title}</span>
              <span className="float-end">${products.toothbrush.price}</span>
            </div>
          </a>
        </div>
        <div className="col">
          <a className="card" target="_blank" href={products.sponge.link} >
            <img src={products.sponge.imageUrl} className="card-img-top object-fit" alt="...">
            <div className="card-body">
              <span className="text-dark">{products.sponge.title}</span>
              <span className="float-end">${products.sponge.price}</span>
            </div>
          </a>
        </div>
        <div className="col">
          <a className="card" target="_blank" href={products.hook.link} >
            <img src={products.hook.imageUrl} className="card-img-top object-fit" alt="...">
            <div className="card-body">
              <span className="text-dark">{products.hook.title}</span>
              <span className="float-end">${products.hook.price}</span>
            </div>
          </a>
        </div>
      </div>
    </>
  }
  ```

  - 將 `products` 改為陣列形式
  - 使用 `map` 跑迴圈，生成多個 `col`
  - 迴圈內 將參數改為 `item` 傳入

  ```ts
  function App() {
    const products = [
      {
        imageUrl: 'https://images.unsplash.com/photo-1520013573795-38516d2661e4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1536&q=80',
        title: '清潔力超強牙刷',
        price: 99,
        link: 'https://www.google.com.tw/'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1618038483079-bfe64dcb17f1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        title: '洗刷刷海綿',
        price: 65,
        link: 'https://twitter.com/'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1546552696-7d5f4e89b0e8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
        title: '萬用掛勾',
        price: 120,
        link: 'https://www.facebook.com/WccCasper'
      }
    ]

    return <>
      <div className="row row-cols-3">
        {
          products.map(( item, i ) => {
            return <div className="col" key={i}>
              <a className="card" target="_blank" href={item.link} >
                <img src={item.imageUrl} className="card-img-top object-fit" alt="...">
                <div className="card-body">
                  <span className="text-dark">{item.title}</span>
                  <span className="float-end">${item.price}</span>
                </div>
              </a>
            </div>
          })
        }
      </div>
    </>
  }
  ```