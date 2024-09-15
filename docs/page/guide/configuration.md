---
title: 介紹
---

# 配置
  如果沒有任何配置，這個網站將會是非常局限的，使用者也無法在你的網站上自由導航。為了更好地自訂你的網站，首先，你需要在你的文件目錄下建立一個 `.vuepress` 目錄。所有 VuePress 相關的文件都會被放在這裡。你的專案結構可能是這樣：

  ```sh
  ├─ docs
  │  ├─ .vitepress
  │  │  ├─ config
  │  │  │  ├─ head.ts
  │  │  │  ├─ index.ts
  │  │  │  ├─ navbar.ts
  │  │  │  └─ sidebar.js
  │  │  └─ config.js
  │  ├─ page
  │  └─ index.md
  └─ package.json
  ```

  - ## 調整 /docs/index.md
    ```sh
    ├─ docs
    │  └─ index.md
    ```
    ```md
    ---
      layout: home
      title: 首頁
      hero:
        name: Vitepress
        text: 學習筆記
        # tagline: 標語
        image:
          src: /apple-touch-icon.png
          alt: VitePress
        # actions:
        #   - theme: brand
        #     text: 開始
        #     link: /guide/what-is-vitepress
        #   - theme: alt
        #     text: View on GitHub
        #     link: https://github.com/vuejs/vitepress
      features:
        - icon: ⚡️
          title: vite 超快冷啟動和熱加載
          details: Lorem ipsum...
          link: /docVue/vue2_to_vue3

        - icon: 🖖
          title: vue的力量與Markdown相遇
          details: Lorem ipsum...
          
        - icon: 🛠️
          title: 始終簡單、最少
          details: Lorem ipsum...
    ---
    <style>
    :root {
      --vp-home-hero-name-color: transparent;
      --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe, #41d1ff);
    }
    </style>
    ```

  - ## 建立 page 資料夾
    在 `docs` 下方建立 `page` 資料夾：用於存放每個子文檔
    ```sh
    ├─ docs
    │  └─ page
    ```

  - ## 建立 config.js
    在 `.vitepress` 資料夾內，建立 `config.js` 檔案：用於設定目錄(路由)。
    ```sh
    ├─ docs
    │  ├─ .vitepress
    │  │  └─ config.js
    ```
    一個 VuePress 網站必要的設定檔是 `.vuepress/config.js`，它應該匯出一個 JavaScript 物件：
    ```js
    import { head, nav, sidebar } from './configs'

    export default {
      base: '/vitepress-base/',   // 站點將部署在這個 base URL路徑
      lang: 'zh-TW',
      title: 'Vitepress',
      description: '學習筆記',
      head,
      themeConfig,
      markdown,
      vite: {
        server: {
          port: 8506
        }
      }
    }
    ```

  - ## 建立 `configs` 資料夾，存放相關設定
    - ### 新建 `head.ts`，icon部分只能使用絕對路徑(`.vitepress/public/favicons/`)
      ```ts
      import type { HeadConfig } from "vitepress";

      export const head: HeadConfig[] = [
        ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/vitepress-vue/favicons/favicon-32x32.png"}],
        ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "/vitepress-vue/favicons/favicon-16x16.png"}],
        ['link', { rel: "shortcut icon", href: "/vitepress-vue/favicons/favicon.ico"}],
      ]
      ```

    - ### 新建 `navbar.ts`
      ```ts
      export const nav = [
        {
          text: '標題1',
          items: [
            {
              text: '標題1-1',
              items: [
                {
                  text: '標題1-1-1',
                  link: '1-1-1 相對路徑'
                }
              ]
            },
          ]
        },
        {
          text: '標題2',
          link: '標題2 相對路徑'
        },
      ]
      ```

    - ### 新建 `sidebar.ts`
      當路徑匹配時，側邊選單就會出現
      ```ts
      export const sidebar = {
        '/page/guide/': [
          {
            text: 'sideMenu標題 1',
            items: [
              { 
                text: 'sideMenu標題 1-1',
                collapsible: true,    // 初始展開
                collapsed: true,      // 賦予收合屬性
                link: 'sideMenu標題 1-1 路徑',
                items: [
                  {
                    text: 'sideMenu標題 1-1 錨點1',
                    link: 'sideMenu標題 1-1 路徑#錨點1',
                  },
                  {
                    text: 'sideMenu標題 1-1 錨點2',
                    link: 'sideMenu標題 1-1 路徑#錨點2',
                    items: [
                      {
                        text: 'sideMenu標題 1-1 錨點3',
                        link: 'sideMenu標題 1-1 路徑#錨點3',
                      },
                    ]
                  },
                  {
                    text: 'sideMenu標題 1-1 錨點4',
                    link: 'sideMenu標題 1-1 路徑#錨點4',
                  },
                ]
              },
              {
                text: 'sideMenu標題 1-2',
                link: 'sideMenu標題 1-2 路徑'
              },
            ],
          },
        ],
      }
      ```

    - ### 新建 `index.ts`，將上述3項彙整
      ```ts
      export * from './head'
      export * from './navbar'
      export * from './sidebar'
      ```