---
title: '[React官網] React 19.2 教程'
outline: 2
---

# 安裝
  `React` 從誕生之初就是可被漸進式使用的。因此你可以選擇性地使用 `React` 特性。不管你是想體驗一下 `React`，用它為簡單的 `HTML` 頁面增加交互，還是重新搭建一個由 `React` 驅動的複雜應用，本章節內容都能幫你快速入門。

## 嘗試 React
  - ### 免安裝體驗
    無需進行任何安裝即可體驗 `React`。文檔中提供的線上 `sandbox`（沙盒）可以直接進行編輯，或點擊右上角的 ["Fork"](https://codesandbox.io/p/sandbox/2wdpmh) 按鈕在新標籤頁中打開。

  - ### 線上編輯器推薦
    除了 `React` 官方文檔以外，許多在線代碼編輯器也支持 `React`，例如：[CodeSandbox](https://codesandbox.io/s/new)、[StackBlitz](https://stackblitz.com/fork/react) 或 [CodePen](https://codepen.io/pen?template=QWYVwWN)。

  - ### 本地嘗試方法
    想要在本地嘗試 `React`，可以透過文檔中的連結下載一個特定的 [HTML](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) 頁面，下載後直接使用編輯器或瀏覽器打開即可。

    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Hello World</title>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

        <!-- Don't use this in production: -->
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
        
          function MyApp() {
            return <h1>Hello, world!</h1>;
          }

          const container = document.getElementById('root');
          const root = ReactDOM.createRoot(container);
          root.render(<MyApp />);

        </script>
        <!--
          Note: this page is a great way to try React but it's not suitable for production.
          It slowly compiles JSX with Babel in the browser and uses a large development build of React.

          Read this page for starting a new React project with JSX:
          https://react.dev/learn/start-a-new-react-project

          Read this page for adding React with JSX to an existing project:
          https://react.dev/learn/add-react-to-an-existing-project
        -->
      </body>
    </html>
    ```

## 建立一個 React 應用
  - ### 新建項目建議
    如果你想開始一個新的 `React` 應用，可以使用官方推薦的框架來創建。詳細說明可參照文檔中的「[創建一個 React 應用](/pages/f2e/docReact/reactDev/02/reactDev_02_01.html)」章節。

## 從零建構一個 React 應用
  - ### 適用場景
    如果現有的框架不適合你的項目、你更傾向於自己配置框架，或者單純想學習配置 `React` 應用的基礎知識，可以參照「[從零構建一個 React 應用](/pages/f2e/docReact/reactDev/02/reactDev_02_02.html)」章節。

## 將React 新增至已有的項目
  - ### 我還應該用 Create React App 麼？
    不， `Create React App` 已經不建議使用。更多資訊可參考 [Sunsetting Create React App](https://zh-hans.react.dev/blog/2025/02/14/sunsetting-create-react-app)（逐步淘汰 `Create React App`） .
