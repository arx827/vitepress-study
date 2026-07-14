---
title: '[React官網] React 19.2 教程'
---

# 創建一個 React 應用
  如果你想用 `React` 構建一個新的應用或網站，我們推薦從一個框架開始。

  如果你的應用程序具有現有框架無法很好滿足的約束，你更喜歡構建自己的框架，或者你只想學習 `React` 應用程序基礎知識，你可以選擇 [從零構建一個 React 應用](/pages/f2e/docReact/reactDev/02/reactDev_02_02.html)。

## 全端框架
  這些推薦的框架支持你在生產環境中部署和擴展應用所需的所有功能。它們集成了 `React` 的最新特性，並充分利用了 `React` 的架構。

  - #### 全端框架不需要伺服器
    本頁列出的所有框架都支持 `客戶端渲染（CSR）`、`單頁應用（SPA）`和`靜態站點生成（SSG）`。這些應用可以部署到 `CDN` 或`靜態託管服務（無需服務器）`。此外，這些框架允許你根據實際需求，針對特定路由單獨啟用服務端渲染。

    這意味著你可以從純客戶端應用開始構建，後續需求變更時，無需重寫整個應用，即可在特定路由上啟用服務端功能。

  - ### Next.js（App Router）
    - #### 定義
      [Next.js 的 App Router](https://nextjs.org/docs) 是一個 `React` 框架，充分利用了 `React` 的架構，支持全端 `React` 應用。

    - #### 初始化命令
      ```sh
      npx create-next-app@latest
      ```

    - #### 維護與部署
      由 [Vercel](https://vercel.com/) 維護。可部署到任何支持 `Node.js` 或 `Docker` 容器的託管平台、你自己的服務器，或使用無需服務器的「[靜態導出](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)」。

  - ### React Router（v7）
    - #### 定義
      [React Router](https://reactrouter.com/start/framework/installation) 是 `React` 最流行的路由庫，可以與 `Vite` 結合創建一個全端 `React` 框架。它強調標準的 `Web API` 並提供了多個適用於各種 `JavaScript` 運行時和平台的「[可部署的模板](https://github.com/remix-run/react-router-templates)」。
    
    - #### 初始化命令
      ```sh
      npx create-react-router@latest
      ```

    - #### 維護者
      由 [Shopify](https://www.shopify.com/) 維護。

  - ### Expo（for native apps）
    - #### 定義
      [Expo](https://expo.dev/) 是一個 `React` 框架，讓你可以創建支持真正原生 `UI` 的通用 `Android`、`iOS` 和 `Web` 應用。它為 [React Native](https://reactnative.dev/) 提供了一個 `SDK`，讓原生部分更易於使用。

    - #### 初始化命令
      ```sh
      npx create-expo-app@latest
      ```

    - #### 維護與費用
      由 `Expo` 公司維護。使用 `Expo` 構建應用是免費的，可以無限制地提交到 `Google` 和 `Apple` 商店，同時 `Expo` 還提供可選的付費雲服務。[Expo 教學](https://docs.expo.dev/tutorial/introduction/)

## 其他框架
  還有一些新興的框架正在努力實現全端 `React` 願景：

  - #### [TanStack Start (Beta)](https://tanstack.com/start/)
    由 `TanStack Router` 驅動的全端 `React` 框架。使用 `Nitro` 和 `Vite` 等工具提供完整的文檔服務端渲染、流式傳輸、服務器函數、打包等功能。

  - #### [RedwoodSDK](https://rwsdk.com/)
    一個全端 `React` 框架，帶有許多預裝的包和配置，方便構建全端 `Web` 應用。

  :::info 哪些特性構成了React 團隊的全端架構願景？
  - `Next.js` 的 `App Router` 打包器完全實現了官方的 [React Server Components 規範](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)。這讓你可以在同一個 `React` 樹中混合使用構建時、僅服務器端和交互式組件。

  - 例如，你可以編寫一個僅在服務器端運行（或在構建期間運行）的服務器端 `React` 組件，作為 `async` 函數直接從數據庫中讀取數據（無需 `API` 端點），並添加不增大瀏覽器 `JavaScript bundle` 的渲染邏輯，然後將數據傳遞給在瀏覽器運行的交互式組件。

  - 同時，`Next.js` 的 `App Router` 還集成了使用 [Suspense](https://zh-hans.react.dev/blog/2022/03/29/react-v18#suspense-in-data-frameworks) 的數據獲取，讓你可以直接在 `React` 樹中為 `UI` 的不同部分指定加載狀態（如 `<Suspense fallback={<TalksLoading />}>`）。這些是 `React` 的特性而非 `Next.js` 獨有，但需要框架層面的實現，目前 `Next.js App Router` 的實現最完整。
  :::

## 從零開始
  - #### 適用場景
    如果你的應用存在現有框架無法很好滿足的限制，你希望構建自己的框架，或者你只是想學習 `React` 應用 的基礎知識，可以選擇從零開始啟動項目。

  - #### 特點
    給你更多的靈活性，但同時也要求你必須自己選擇用於路由、數據獲取以及其他常見使用模式的工具。

  - #### 構建工具
    可參閱「[從零構建一個 React 應用](/pages/f2e/docReact/reactDev/02/reactDev_02_02.html)」指南，引導如何使用 [Vite](https://vite.dev/)、[Parcel](https://parceljs.org/) 或 [RSbuild](https://rsbuild.dev/) 等構建工具設置新的 `React` 項目。