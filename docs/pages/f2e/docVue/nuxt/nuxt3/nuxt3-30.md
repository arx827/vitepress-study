---
title: Nuxt3 學習筆記 - Ryan
---

# 30. 就剩最後一步了 - 部署 (Deployment)
## 前言
  - 網頁開發與建構完成後需部署至正式環境。本篇將透過數個實際範例，示範如何部署 `Nuxt 3` 專案。

## Nuxt 3 的部署方式
  - Nuxt 3 專案可以部署於 `Node.js` 伺服器、將預渲染的靜態網站交由靜態託管平台服務，或是部署至 `無伺服器（Serverless`）或 `CDN` 環境上。

  - ### 使用 Node.js 伺服器
    - `Nuxt 3` 預設採用 `Nitro` 引擎，可在任何 `Node.js` 伺服器環境中直接啟動。

    - 執行 `npm run build` 打包後輸出的 `.output/server/index.mjs` 即為 `Node` 伺服器的啟動入口點。

    - #### 啟動與指令環境變數設定
      - 啟動指令：`node .output/server/index.mjs`（預設監聽 Port 3000）。
      - `NITRO_PORT` 或 `PORT`：調整監聽 Port。
      - `NITRO_HOST` 或 `HOST`：服務的 Host（預設監聽所有網路介面，含 IPv4 與 IPv6）。
      - `NITRO_SSL_CERT` 與 `NITRO_SSL_KEY`：以 HTTPS 模式啟動（通常僅供測試，建議正式環境將 SSL 憑證交由 NGINX 或 Cloudflare 等反向代理處理）。

    - #### PM2 常駐管理
      - 正式環境建議使用 [PM2](https://pm2.keymetrics.io/) 作為常駐程序守護進程（Daemon），避免 `Node.js` 因意外崩潰而中斷，藉由 `PM2` 來啟動我們的 `Nitro Server`，並可開啟叢集模式（Cluster）進行負載平衡以提升多核心機器的資源效能。
      - 實作方式：安裝 PM2（`npm install -g pm2`）後，於專案目錄建立 `ecosystem.config.js` 配置 `exec_mode: 'cluster'` 與 `instances: 'max'`，再以 `pm2 start ecosystem.config.js` 啟動。

      建立 `ecosystem.config.js`
      ```js
      module.exports = {
        apps: [
          {
            name: 'NuxtAppName',
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs'
          }
        ]
      }
      ```

      接著我們就能使用 `PM2` 來執行我們的服務
      ```sh
      pm2 start ecosystem.config.js
      ```

      你也可以在 `ecosystem.config.js` 中添加環境變數。
      ```js
      module.exports = {
        apps: [
          {
            name: 'NuxtAppName',
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs',
            env: {
              NITRO_PORT: 3001,
              NITRO_HOST: '127.0.0.1'
            }
          }
        ]
      }
      ```

  - ### 製作Docker Image
    - 適合容器化部署並可整合 `CI/CD` 流程。作者提供雙階段建構（Multi-stage Build）的 `Dockerfile` 範例：

      - #### 第一階段（builder）
        以 `node:16-alpine` 環境為基礎，執行 `npm ci` 與 `npm run build` 進行專案建構。

      - #### 第二階段
        使用 `keymetrics/pm2:16-alpine` 作為運行環境，僅從第一階段複製編譯好的 `.output` 目錄與 `ecosystem.config.js` 進去，藉此優化並縮小最終 `Image` 的容量。

    - 映像檔（Image）製作完成後可經由 `docker run`、`docker compose` 或 `K8s` 啟動，最前方再搭配 `NGINX` 提供反向代理服務。

## 部署至 Cloudflare Workers
  - ### 準備工作
    - 安裝命令列工具：`npm install -g wrangler`
    - 登入與授權：執行 `wrangler login`
    - 建立設定檔：於專案目錄新增 `wrangler.toml` 並定義項目名稱、入口點（`./.output/server/index.mjs`）及靜態儲存桶路徑（`bucket = ".output/public"`）。
      ```toml
      name = "nuxt-app-hello"
      main = "./.output/server/index.mjs"
      workers_dev = true
      compatibility_date = "2022-10-15"

      [site]
      bucket = ".output/public"
      ```

  - ### 建構與發布
    - 指定預設平台環境變數：`NITRO_PRESET=cloudflare npm run build`。
    - 本地測試：`npx wrangler dev .output/server/index.mjs --site .output/public --local`。
    - 專案發布：`npx wrangler publish`。發布成功後即可獲得該 `Serverless` 服務的專屬網址。

## 靜態的網站部署至CloudFlare Pages
  - 當專案使用預渲染全靜態生成時，適合部署到靜態託管平台。
  - ### 部署步驟：
    - 全站預渲染：`npm run generate`
    - 全域安裝 wrangler 並登入：`npm install -g wrangler` 與 `wrangler login`
    
    > 以 page 名 nuxt-app-blog 為例
    - 建立 Cloudflare Pages 專案：`wrangler pages project create nuxt-app-blog`
    - 部署預渲染目錄（`./.output/public`）：`wrangler pages publish ./.output/public --project-name nuxt-app-blog`
    - 部署完成後可由後台設定自訂網址（Aliases）

## 上線前的測試項目
  - ### 前端細節
    - 網頁的標題（Title）
    - 使用之資源授權（使用權、智財權）
    - 圖片替代文字
    - Favicon
    - HTML Meta data
    - Google Analytics

  - ### 瀏覽器相容性測試
    - RWD（響應式網頁設計）
    - 跨瀏覽器測試（可使用 BrowserStack、Comparium、TestingBot 等工具）。

  - ### API 測試
    - 單元測試
    - 不同場景測試（測試環境與正式環境）
    - 效能測試（可使用 JMeter、k6 測試）。
    - 安全性測試

  - ### 壓力測試
    - 模擬使用者或連線數
    - 觀察機器資源使用量與資料庫連線數
    - 觀察併發（Concurrency）時的平均響應時間
    - 分析是否夾雜非預期的 HTTP 狀態碼。

  - ### API 或網站安全性
    - 參考 OWASP Top 10
    - 採用 SQL 參數化查詢
    - 執行資安公司滲透測試或紅隊演練。

  - ### 開發或除錯用的訊息
    - 移除 console.log、警告訊息或異常訊息。
    - 記得移除 JavaScript Source Maps。
    - 移除開發用的 Key、帳號密碼等敏感資訊。

  - ### 網站相依性檢查
    - 確認第三方網站資源的穩定性與所有網址皆能正常運作。
    - 制定當第三方網站異常時的應對措施。

  - ### 部署相關
    - 評估是否有高可用性（HA）。
    - Docker 或 Kubernetes 整合狀況。
    - 網域時效、SSL 證書有效日期。
    - 防火牆或 WAF 設定、內網與外網區隔。

  - ### 備份機制
    - 靜態有狀態資料（如使用者上傳的檔案）備份。
    - 資料庫資料備份。

## 小結
  - 本篇分享了包括機房主機、雲端、Serverless（如 Nitro 支援的雲端環境）等數種 Nuxt 3 部署方案。
  - 選擇 Serverless 部署時需額外注意執行一些 binary 的相容性問題。