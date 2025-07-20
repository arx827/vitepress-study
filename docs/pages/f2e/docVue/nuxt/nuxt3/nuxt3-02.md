---
title: Nuxt3 學習筆記 - Ryan
---

# 2. Nuxt 3 介紹
## Isomorphic JavaScript 與 Universal JavaScript
  `Nuxt 3` 是一個 `Isomorphic JavaScript` 框架。

  - ### Isomorphic (同構) JavaScript
    同樣的 `JavaScript` 程式碼可以在客戶端及伺服器端運行，也就是說 `同一份` Code 除了能在前端瀏覽器也能在後端執行。

  - ### Universal JavaScript
    同樣的 `JavaScript` 程式碼可以在不同的環境執行，也就是不僅可以在前後端執行，還可以在本機設備和嵌入式架構上運行。

## Nitro
  Nuxt 3 由一個全新的伺服器引擎 [Nitro](https://nuxt.com/docs/guide/concepts/server-engine) 提供支持，
  
  它具有以下幾個特點：
  - 跨平台支持，支持 `Node.js` 與瀏覽器等
  - `Serverless` 支持
  - `API` 路由，使用 [unjs/h3](https://github.com/h3js/h3)
  - `自動程式碼拆分 (code-splitting)` 與 `異步加載 chunk (async-loaded chunks)`
  - 混合渲染模式，供 `靜態 (static)` 與 `無伺服器 (serverless)` 網站
  - 開發伺服器上的 `HMR (hot module reloading)`

## Nuxt 3 渲染模式
  - ### Client-side Only Rendering
    也就是客戶端渲染 `CSR`

  - ### Universal Rendering
    是 `Nuxt 3` 預設的渲染模式，等於 `SSR + SPA`。

  - ### Hybrid Rendering 混合渲染
    可以為每個路由設置不同的渲染與緩存規則，讓部分頁面是 `CSR`，另一部份是 `SSR`。

  - ### Edge-Side Rendering 邊緣渲染
    `Nitro` 為 `Nuxt 3` 提供支持的全新伺服器端渲染引擎，能為 `Node.js`、`Deno`、`Worker` 等提供跨平台的支持，
    讓 `Nuxt` 可以在 `CDN Edge Workers` 進行渲染。

    > 能有效分擔在伺服器端渲染時的資源負荷，將其提升到另一個層次，從而減少網路延遲及成本。

## Nuxt 3 的建構工具
  - [Vite](https://vitejs.dev/) (預設) / [webpack](https://webpack.js.org/)
  - [Rollup](https://rollupjs.org/)
  - [PostCSS](https://postcss.org/)
  - [esbuild](https://esbuild.github.io/)

  > `Nuxt 3` 已經配置好一堆設定，要調整配置，可以在 `nuxt.config` 中進行調整。