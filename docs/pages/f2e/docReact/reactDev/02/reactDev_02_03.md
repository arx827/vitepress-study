---
title: '[React官網] React 19.2 教學文件'
---

# 將 React 新增至現有專案中
  如果想對現有項目添加一些交互，不必使用 `React` 將其整個重寫。只需將 `React` 添加到已有技術棧中，就可以在任何位置渲染交互式的 `React` 組件。

  ::: info 本地開發必備
  - 你需要安裝 [Node.js](https://nodejs.org/zh-cn/) 以進行本地開發。雖然可以使用線上演練場或簡單的 `HTML` 頁面來嘗試 `React`，但實際上大多數用於開發的 `JavaScript` 工具都需要 `Node.js`。
  :::

## 在現有網站的子路由中使用 React
  假設你在 `example.com` 部署了一個使用其他服務端技術（如 `Rails`）構建的應用，但想在 `example.com/some-app/` 部署一個 `React` 項目。

  - 推薦的配置方式如下：
    1. 使用一個 [基於 React 的框架](/pages/f2e/docReact/reactDev/02/reactDev_02_01.html) 構建應用的 `React` 部分。

    2. 在框架配置中將 `/some-app` 指定為基本路徑（`basePath` 或 `path-prefix`）（例如 `Next.js` 與 `Gatsby` 皆提供此配置）。

    3. 配置服務器或代理，以便所有位於 `/some-app/` 下的請求都由該 `React` 應用處理。

  - #### 特點
    這能確保應用的 `React` 部分受益於框架內置的最佳實踐。即使無法或不想在服務器上運行 `JavaScript`，也可以使用相同的方法，將靜態導出的 HTML/CSS/JS (`Next.js` 的`next export output`，`Gatsby` 的 `default`) 替換至 /`some-app/` 目錄。

## 在現有頁面的一部分中使用React
  假設有一個由其他技術堆疊（無論是 `Rails` 等服務端技術，還是 `Backbone` 等客戶端技術）構建的現有頁面，並想要在該頁面的某個位置渲染交互式的 `React` 組件（這正是 `Meta` 多年來使用 `React` 的常見方式）。

  - 整合可以分兩步進行：
    - ### 步驟 1：配置模組化的 JavaScript 環境
      模塊化的 `JavaScript` 環境可以讓你將代碼拆分為模塊在單一文件中編寫，並從 `npm` 註冊表中使用包。具體實現取決於現有配置：
      - #### 已使用 `import` 語句分割文件
        請檢查在 `JavaScript` 代碼中編寫 `<div />` 是否會導致語法錯誤。如果報錯，可能需要使用 `Babel` 轉換代碼，並啟用 `Babel React preset` 來支持 `JSX`。

      - #### 沒有用於編譯 JavaScript 模塊的配置
        請使用 `Vite` 進行配置。`Vite` 社區維護了與後端框架（包括 `Rails`、`Django` 和 `Laravel`）的許多集成項目。若後端框架未列出，可按照其指南手動將 `Vite` 構建集成到後端。

      :::info 配置有效性檢查
      - 在項目文件夾中執行：`npm install react react-dom`
      - 在 `JavaScript` 主文件（如 `index.js` 或 `main.js`）頂部添加代碼，使用 `createRoot` 清除現有 `HTML` 並渲染 `<h1>Hello, world</h1>`。如果頁面全部內容成功替換為 `"Hello, world!"`，則代表配置正常。
      :::

    - ### 步驟 2：在頁面的任何位置渲染 React 元件
      實際開發時，你不需要清除現有的全部 `HTML` 內容，而是要在特定位置渲染 `React` 組件：

      1. 打開 `HTML` 頁面（或服務端模板），向任意一個標籤添加唯一的 `id` 屬性（例如：`<nav id="navigation"></nav>`）。

      2. 在 `JavaScript` 中使用 `document.getElementById('navigation')` 查找到該元素。

      3. 將該 `DOM` 節點傳遞給 `createRoot`，並在其中調用 `root.render(<NavigationBar/>)` 來渲染你的 `React` 組件。

      - #### 發展路徑
        通常會從小型交互式組件（如按鈕）開始，然後逐漸“向上移動”，直到最終整個頁面都由 `React` 構建。屆時建議立即遷移到一個 `React` 框架以充分利用其優勢。

## 在現有的原生行動應用程式中使用 React Native
  [React Native](https://reactnative.dev/) 也可以逐步集成到現有的原生應用中。
  如果你已經有一個現有的 `Android`（Java 或 Kotlin）或 `iOS`（Objective-C 或 Swift）原生應用，可以按照官方提供的 [指南](https://reactnative.dev/docs/integration-with-existing-apps) 將 `React Native` 添加到其中。