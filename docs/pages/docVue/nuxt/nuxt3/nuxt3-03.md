---
title: Nuxt3 學習筆記 - Ryan
---

# 3. 使用 nuxi 建立第一個專案
## 1. nuxi 是什麼？
  `nuxi` 是官方提供的 `Nuxt 命令列工具（CLI）`，用途與 `Vue CLI` 相似，用來初始化與操作 `Nuxt` 專案

## 2. 建立第一個 Nuxt 3 專案流程
  文章示範使用 `nuxi` 建立專案的基本步驟：
  - ### 安裝 nuxi
    ```sh
    npm install -g nuxi
    ```

  - ### 新建專案
    ```sh
    nuxi init my-nuxt-app
    ```

  - ### 安裝依賴後啟動開發伺服器
    ```sh
    npm install
    ```

  > 核心即使用 `CLI` 快速生成預設專案結構，包含 `pages/`, `components/`, `layouts/` 等資料夾。

## 3. 專案結構概覽
  利用 `nuxi` 創建後，會看到以下典型目錄：
  - `pages/`：路由檔案放置處，自動產生對應 URL 路由
  - `components/`：存放可重複使用的 Vue 元件
  - `layouts/`：放置整體版型樣板
  - `plugins/`、`assets/` 等其他常見 `Nuxt` 資料夾

（雖然文章對結構可能沒有逐一詳述，但這些是 Nuxt 專案的標準配置。）

## 4. Nuxt CLI 常用指令
  在專案目錄下記得使用 `npx` 來執行 `nuxi`

  - ### nuxi init
    ```sh
    npx nuxi init|create [dir]
    ```
    用來初始化一個 `Nuxt` 專案，等價 `nuxi create` 指令。

    > `dir` 可以填字串作為專案與資料夾名稱，也可以填寫完整路徑來建立專案目錄。

  - ### nuxi dev
    ```sh
    npx nuxi dev [--open, -o] [--port, -p]
    ```
    當我們輸入 `npm run dev -- -o` 時，其實是依據 `package.json` 中的 `scripts` 執行 `nuxt dev -o`。

    > - `-o`：服務啟動後開啟瀏覽器
    > - `-p`：將預設的 `Port:3000` 調整為其他數值

  - ### nuxi cleanup
    ```sh
    npx nuxi clean|cleanup
    ```
    等價 `nuxi cleanup` 指令，用來刪除 `Nuxt` 自動產生的檔案和緩存，包括：
    - `.nuxt`
    - `.output`
    - `node_modules/.vite`
    - `node_modules/.cache`

  - ### nuxi upgrade
    ```sh
    npx nuxi upgrade [--force|-f]
    ```
    用來將目前專案的 `Nuxt 3` 升級至最新的版本
    - `-f`：強制更新