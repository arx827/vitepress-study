---
title: React 實戰影音課 1
---

# 5. 資料驅動 React - 資料抽離練習
## 打開檔案 `/intro/variables.html`

## 將 Card 中的資料抽取出來
  ```ts
  function App() {
    const data = {
      imageUrl: 'https://plus.unsplash.com/premium_photo-1748075588586-525c48d6dd03?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzNnx8fGVufDB8fHx8fA%3D%3D',
      title: 'Card title',
      content: "Some quick example text to build on the card title and make up the bulk of the card's content.",
      link: 'https://getbootstrap.com/docs/5.2/components/card/'
    }
    return <div className="card">
      <img src={data.imageUrl} className="card-img-top" alt="..." />
      <div className="card-body">
        <h5 className="card-title">{data.title}</h5>
        <p className="card-text">{data.content}</p>
        <a href={data.link} className="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  }
  ```

