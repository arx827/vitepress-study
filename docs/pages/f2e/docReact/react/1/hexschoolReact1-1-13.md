---
title: React 實戰影音課 1
---

# 13. JSX 章節回顧作業 (上)
## 打開檔案 `/intro/commonintroFinalProblem.html`
  
## 加上 `<script>`
  ```xml
  <div id="root"></div>
  <script type="text/babel">
    ...
  </script>
  ```

## 加上 `App function`
  ```ts
  function App() {
    return <>
      ...
    </>
  }
  ```

## 掛載到根元件
  ```ts
  ReactDOM
    .createRoot(document.getElementById('root'))
    .render(<App />)
  ```

## 加上卡片元素
  ```ts
  function App() {
    return <>
      <div className="row row-cols-3">
        <div className="col">
          <a className="card" target="_blank" href="https://www.google.com.tw/" >
            <img src="https://images.unsplash.com/photo-1520013573795-38516d2661e4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1536&q=80" className="card-img-top object-fit" alt="...">
            <div className="card-body">
              <span className="text-dark">清潔力超強牙刷</span>
              <span className="float-end">$99</span>
            </div>
          </a>
        </div>
        <div className="col">
          <a className="card" target="_blank" href="https://www.twitter.com/" >
            <img src="https://images.unsplash.com/photo-1618038483079-bfe64dcb17f1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" className="card-img-top object-fit" alt="...">
            <div className="card-body">
              <span className="text-dark">洗刷刷海綿</span>
              <span className="float-end">$65</span>
            </div>
          </a>
        </div>
        <div className="col">
          <a className="card" target="_blank" href="https://www.google.com.tw/" >
            <img src="https://images.unsplash.com/photo-1546552696-7d5f4e89b0e8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" className="card-img-top object-fit" alt="...">
            <div className="card-body">
              <span className="text-dark">萬用掛勾</span>
              <span className="float-end">$120</span>
            </div>
          </a>
        </div>
      </div>
    </>
  }
  ```

## 加上 `CSS`
  ```css
  .object-fit {
    object-fit: cover;
  }
  .card-img-top {
    height: 250px;
  }
  a.card {
    text-decoration: none;
    transition: transform .5s, box-shadow .5s;
  }
  a.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 10px rgba(0, 0, 0, .26);
  }
  ```