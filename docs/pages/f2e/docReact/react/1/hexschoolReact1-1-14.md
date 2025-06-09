---
title: React 實戰影音課 1
---

# 14. JSX 章節回顧作業 (下)
## 打開檔案 `/intro/commonintroFinalProblem.html`
  在上一章節中，已經將三張卡片的 `HTML` 都建立好了。

  在 `React` 中，要盡量做到資料的關注點分離，把資料抽取出來。

## 抽取出資料
  ```ts
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
  ```

## 將資料掛載於 HTML
  ```ts
  function App() {
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