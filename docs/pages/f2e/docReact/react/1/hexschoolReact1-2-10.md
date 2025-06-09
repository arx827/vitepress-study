---
title: React 實戰影音課 2
---

# 10. Async function 實戰運用
## 打開檔案 `/es6/asyncAwaitAdv.html`
  - ### 1. Async function 的本質
    - #### 1. Async function 本身就是 Promise
    - #### 2. await 運算子，它的後方需要加入的是 Promise
      ```ts
      const asyncFn = async () => {
        const res = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
      }
      console.log(asyncFn());
      ```

  - ### 2. Async function 回傳值
    取得 async function 回傳值的方法
    ```ts
    const asyncFn = async () => {
      const res = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
      console.log(res);
      return res;
    }
    asyncFn()
      .then(res => {
        console.log(res);
      })
    ```

  - ### 3. Async function 錯誤處理
    - 立即執行函式
    ```ts
    ( async () => {
      try {
        const res = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
      } catch (error) {
        console.log(error);
        alert(error.message);
      }
    })()
    ```

    - 接收回傳
    ```ts
    const asyncFn = async () => {
      try {
        const res = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
        return res;
      } catch (error) {
        throw error;
      }
    }

    asyncFn()
      .then(res => {
        console.log('Promise', res);
      })
      .catch(error => {
        console.log('Promise Error', error);
      })
    ```

  - ### async Function 與 React
    ```ts
    const App = () => {
      const [data, setData] = React.useState({}) 

      React.useEffect(() => {
        (async () => {
          const res = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
          console.log(res);
          setData(res.data);
        })();
      }, []);

      return <div>
        {data.title}
      </div>
    }

    ReactDOM
      .createRoot(document.getElementById('root'))
      .render(<App/>)
    ```