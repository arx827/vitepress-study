---
title: 介紹
---

# 快速上手
  本節將幫助你從頭開始建立一個簡單的 VitePress 文件網站。如果你已經有了一個存在的專案並且向在專案中維護文檔，你可以從 步驟3 開始。

  - ## 步驟 1：建立並進入一個目錄
    ```sh
    mkdir vitepress-starter && cd vitepress-starter
    ```

  - ## 步驟 2：初始化
    ```sh
    npm init -y
    ```

  - ## 步驟 3：本地安裝 VitePress
    ```sh
    npm i -D vitepress vue
    ```

  - ## 步驟 4：建立你第一篇文檔
    ```sh
    mkdir docs && echo '# Hello VitePress' > docs/index.md
    ```

  - ## 步驟 5：在 `package.json`，修改 `scripts` 腳本命令
    ```json
    "scripts": {
      "docs:dev": "vitepress dev docs",
      "docs:build": "vitepress build docs",
      "docs:serve": "vitepress serve docs"
    }
    ```

  - ## 步驟 6：運行 `vitepress`
    ```sh
    npm run docs:dev
    ```