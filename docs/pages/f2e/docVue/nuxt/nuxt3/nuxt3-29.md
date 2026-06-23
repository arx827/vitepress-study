---
title: Nuxt3 學習筆記 - Ryan
---

# 29. 發布網站前的建構打包 (Build) 與靜態網站生成 (Static Site Generation)
## 前言
  - 網站開發完成或導入 `CI/CD` 時，發布網站前需透過 `Nuxt` 指令建構`正式環境`所需版本。

  - 建構過程包含打包依賴套件、編譯與轉換 Vue SFC 及樣式、檔案壓縮等，完成後即可進行部署。

## Nuxt 3 專案如何建構正式環境版本
  - ### 核心指令
    可透過 `package.json` 中的 `scripts` 或使用 `Nuxt CLI` 進行建構。
    - `npm run build` 或 `npx nuxi build`
    - `npm run generate` 或 `npx nuxi generate`

  - ### generate 說明
    此指令會觸發 `build` 並自動帶入 `prerender: true` 參數，產出目錄可直接部署，不需重複執行 `build`。

## 使用預設配置進行建構 - 建構通用渲染(Universal Rendering) 的網站
  - ### 預設配置
    `Nuxt 3` 預設的 `ssr` 屬性為 `true`，即採用通用渲染模式（Universal Rendering）。

  - ### 執行指令
    ```sh
    npm run build
    ```

  - ### 產出結構
    專案目錄下會產生 `.output` 目錄。
    - `public/`：存放直接公開在網站根目錄的 JS、CSS、圖片等靜態檔案。
    - `server/`：存放伺服器端的 Nitro 引擎與 Server API 處理邏輯，需透過 Node.js 服務啟動。

  - ### 本地預覽
    建構後可執行 `node .output/server/index.mjs` 進行本地測試，
    ```sh
    node .output/server/index.mjs
    ```
    確認沒問題即可使用 `.output` 目錄進行部署。

## 使用預渲染建置全靜態頁面網站
  - ### 運作概念
    在建構時期進行 `預渲染（Pre-rendering）`，提前將 API 請求及動態元件渲染出 HTML 網頁。

  - ### 執行指令
    ```sh
    npm run generate
    ```

  - ### 產出結構
    建構後會產生 `.output` 與 `dist` 目錄（兩者內容相同），其中 `.output/public` 用於部署。

  - ### 爬蟲機制
    `Nuxt` 會使用基於`爬蟲（Crawler）`的技術分析每個頁面的路由與連結，並在各頁面資料夾內生成 `index.html` 以及存放該頁 API 資料的 `_payload.js`（例如動態路由 `/articles/1`、`/articles/2` 均會被各自獨立靜態化），部署至靜態託管伺服器時不需再使用 `Node.js` 執行。

## 手動設定預渲染的路由規則
  - ### 問題點
    當存在大量動態資料（例如 200 筆文章），但列表頁（/articles）限制只回傳前 10 筆時，`Nuxt` 爬蟲將因無法找到剩餘頁面的實體連結而漏掉其餘 190 筆的靜態生成。

  - ### 解決方案
    透過配置 `nuxt.config.ts` 中的 `nitro.prerender` 來手動控制。
    ```ts
    export default defineNuxtConfig({
      nitro: {
        prerender: {
          ignore: [],     // 忽略特定路由不進行預渲染
          routes: [],     // 指定路由手動進行預渲染
          crawlLinks: true // 啟用 Nuxt 爬蟲蒐集頁面連結進行預渲染
        }
      }
    })
    ```

  - ### 搭配指令的差異效果
    - #### `build` 搭配配置
      若使用 `npm run build` 並在 `routes` 指定特定頁面，最終建構出的通用渲染網站中，將包含部分已提前預渲染好的靜態頁面。

    - #### generate 搭配配置
      預設全站靜態化，`crawlLinks` 預設為 `true`。若利用 `ignore` 可排除特定頁面（如 /login, /register）；利用 `routes` 則可主動補充那些沒被頁面連結到、爬蟲抓不到的動態路由（如 /articles/2）。

      ```ts
      export default defineNuxtConfig({
        nitro: {
          prerender: {
            ignore: ['/login', '/register'],
            routes: ['/articles/2'],
            crawlLinks: true
          }
        },
      })
      ```
      > 並使用 `npm run generate` 指令

    - 註：若將 `crawlLinks` 設為 `false`，生成靜態頁面時將不會爬取連結，僅會依照 `pages` 目錄結構生成基礎路由（不含 `[id].vue` 這類動態匹配路由）。

## 建構僅在客戶端渲染的網站
  - ### 配置方式
    將 `nuxt.config.ts` 中的 `ssr` 屬性設為 `false`（Client-side Only Rendering）。

  - ### 執行指令
    ```sh
    npm run build
    ```

  - ### 產出結構差異
    `.output/public` 中會多出一個類似純 Vue 專案建構後的 `index.html` 作為顯示容器。

  - ### `Nitro` 引擎依舊存在的原因
    即便不使用 `SSR`，建構仍會產生 `.output/server`。因為 `Nuxt` 專案中可能包含 `Server API`，這些後端邏輯無法一同打包至前端執行。

  - ### 部署建議
    若專案完全沒有依賴其內建的 `Server API`（全部呼叫外部 API），則可以直接將 `public` 目錄當作一般 `SPA` 網站的 `dist` 目錄部署到純靜態 Web 伺服器；否則，仍需要利用 `Node.js` 啟動 `.output/server/index.mjs` 來運行 API。

## 整理這些排列建構參數的組合
  - ### `npm run build + ssr: true`：
    - `build + ssr: true`：Nuxt 3 預設模式，使用通用渲染。
    - `build + ssr: true + nitro.prerender.crawlLinks: true`：通用渲染，且自動爬取、預渲染由 API 動態產生的頁面。
    - `build + ssr: true + nitro.prerender.routes + nitro.prerender.crawlLinks: false`：通用渲染，但僅針對特定指定頁面做預渲染。

  - ### `npm run build + ssr: false`：
    - `build + ssr: false`：僅客戶端渲染模式，部署仍需啟動 `Nitro` 伺服器以運作 Server API。若確認專案內無 Server API，可直接單獨部署 .output/public。

  - ### `npm run generate + ssr: true`：
    - `generate + ssr: true`：使用預渲染產生全站靜態頁面（crawlLinks 預設為 true）。
    - `generate + ssr: true + nitro.prerender.ignore`：全站靜態生成，但排除指定頁面。被忽略的頁面若有專案 Server API 需求，可能無法在純靜態託管平台運作。
    - `generate + ssr: true + nitro.prerender.routes`：全站靜態生成，並額外手動補充爬蟲抓不到的隱藏或動態路由。
    - `generate + ssr: true + nitro.prerender.routes + nitro.prerender.crawlLinks: false`：產生全站靜態頁面，但不爬取連結，因此動態匹配頁面不會被處理為靜態檔案（若其有使用內建 Server API 在靜態平台可能失效）。

## 小結
  - `build` 與 `generate` 指令提供開發者依情境決定渲染模式與預渲染層級，產出的 `.output` 目錄結構各異。

  - 無論是預渲染網頁還是 SPA 網站，皆需注意是否有使用 Nuxt 專案內建的 `Server API`，進而決定是否需要 `Nitro` 伺服器來啟動正式環境，最後再將輸出目錄打包部署。