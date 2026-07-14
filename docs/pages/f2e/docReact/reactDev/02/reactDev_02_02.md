---
title: '[React官網] React 19.2 教學文件'
---

# 從零開始建立 React 應用
  如果現有框架無法滿足你應用的要求，或者你更喜歡自己構建框架，亦或者你只想學習 `React` 應用程序的基本知識，那麼你可以選擇從零開始構建 `React` 應用。

  ::: info 考慮使用框架
  - 從頭開始使用 `React` 是一種簡單的入門方式，但這通常相當於構建自己的臨時框架。隨著需求變化，你可能需要自行實現`服務器端渲染（SSR）`、`靜態站點生成（SSG）`、React 服務器組件（RSC）或未來的 React 新特性。

  - 官方推薦的框架具備成熟的解決方案，能幫助減少或消除網絡請求中的瀑布效應以提升用戶體驗。選擇自建方式會使獲取支持變得更困難，因為你開發路由和數據獲取等功能的方式是獨特的。只有在能獨立解決這些問題，或確信永遠不需要這些功能時，才應該選擇此選項。
  :::

## 步驟 1 : 安裝建置工具
  第一步是安裝一個構建工具，它們提供了打包、運行源代碼、本地開發伺服器以及生產環境的構建命令。

  - ### Vite
    - #### 簡介
      [Vite](https://vite.dev/) 旨在為現代網絡項目提供更快、更簡潔的開發體驗。

    - #### 安裝指令
      ```sh
      npm create vite@latest my-app -- --template react-ts
      ```

    - #### 特點
      開箱即提供合理的默認配置，擁有豐富的插件生態系統，支持快速熱更新、`JSX`、`Babel/SWC`。它已被官方推薦的框架 `React Router` 所使用。

  - ### Parcel
    - #### 簡介
      [Parcel](https://parceljs.org/) 結合了出色的開箱即用開發體驗和可擴展的架構，適合從小項目推向大規模生產應用。

    - #### 安裝指令
      ```sh
      npm install --save-dev parcel
      ```

    - #### 特點
      支持快速刷新、`JSX`、`TypeScript`、`Flow` 和開箱即用的樣式。

  - ### Rsbuild
    - #### 簡介
      [Rsbuild](https://rsbuild.dev/) 基於 `Rspack` 的構建工具，旨在為 `React` 應用程序提供無縫的開發體驗，配備精心調優的默認設置和現成的性能優化。

    - #### 安裝指令
      ```sh
      npx create-rsbuild --template react
      ```

    - #### 特點
      內置對快速刷新、JSX、TypeScript 和樣式的支持。

  ::: info React Native 的 `Metro`
  如果從頭開始使用 `React Native`，需要使用其專屬的 JavaScript 打包工具 `Metro`（支持 iOS 和 Android 打包）。但與上述工具相比，它缺少許多功能。除非項目需要 React Native 支持，否則建議從 `Vite`、`Parcel` 或 `Rsbuild` 開始。
  :::

## 步驟 2 : 構建常見的應用程式模式
  上述構建工具僅從客戶端單頁應用程序（SPA）開始，不包含路由、數據獲取或樣式等常見功能的進一步解決方案。以下是生態系統中廣泛使用的工具：

  - ### 路由
    - #### 功能
      路由決定了當用戶訪問特定 `URL` 時顯示的內容，處理嵌套路由、路由參數和查詢參數。路由通常與數據獲取（預取數據）、代碼拆分和頁面渲染方法集成在一起。

    - #### 推薦工具
      - [React Router](https://reactrouter.com/start/data/custom)
      - [Tanstack Router](https://tanstack.com/router/latest)

  - ### 數據獲取
    - #### 功能
      負責處理加載狀態、錯誤狀態以及緩存。

    - #### 提示
      直接在組件中獲取數據可能會導致網絡請求瀑布效應（加載時間變慢），官方建議儘可能在路由加載器或服務器上預取數據。

    - #### 推薦工具（依 API 類型劃分）
      - ##### REST 風格 / 後端 API
        - [TanStack Query](https://tanstack.com/query/)
        - [SWR](https://swr.vercel.app/)
        - [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

      - ##### GraphQL API
        - [Apollo](https://www.apollographql.com/docs/react)
        - [Relay](https://relay.dev/)

  - ### 代碼拆分
    - #### 功能
      將應用程序分解為可以按需加載的小型包，以緩解代碼體積增大導致的加載緩慢。

    - #### 注意點
      如果僅使用 `React.lazy` 懶加載組件（例如圖表），而圖表在渲染後才加載數據，會導致兩次等待的瀑布效應。應通過路由拆分代碼，並與打包、數據獲取集成。

    - #### 各工具參考文件
      - [Vite 構建優化](https://vite.dev/guide/features.html#build-optimizations)
      - [Parcel 代碼拆分](https://parceljs.org/features/code-splitting/)
      - [Rsbuild 代碼拆分](https://rsbuild.dev/guide/optimization/code-splitting)

  - ### 提高應用程式效能
    由於上述構建工具默認僅支持單頁應用程序（`SPA`），你需要了解並實現其他渲染模式，以便在路由級別自由選擇渲染策略：
    - #### 單頁面應用程序 (SPA)
      加載單個 `HTML` 並動態更新。容易入門，但初始加載較慢。

    - #### 流式服務器端渲染 (SSR)
      在服務器上渲染完全部頁面再發送至客戶端。可提高性能，但維護極其複雜（可參見 [Vite 的 SSR 指南](https://vite.dev/guide/ssr)）。

    - #### 靜態站點生成 (SSG)
      在構建時生成靜態 `HTML` 文件。能提升特定頁面（如登錄頁）的性能（可參見 [Vite 的 SSG 指南](https://vite.dev/guide/ssr.html#pre-rendering-ssg)）。

    - #### React 服務器组件 (RSC)
      允許在單個 `React` 樹中混合構建時、僅服務器和交互式組件。能減少打包體積並提高性能，但目前需要深入的專業知識來維護（可參見 [Parcel 的 RSC 示例](https://github.com/parcel-bundler/rsc-examples)）。

  - ### 還有...
    從頭開始構建時會遇到許多限制，因為每個問題（路由、打包、數據獲取、渲染模式）都相互關聯，需要深度的專業知識。如果你不想自己解決這些聯動問題，官方建議從 [創建一個框架開始](/pages/f2e/docReact/reactDev/02/reactDev_02_01.html)。