---
title: Nuxt3 學習筆記 - Ryan
---

# 24. 搜尋引擎最佳化 (SEO) 與 HTML Meta Tag
## 前言
  - 許多開發者選擇 `Nuxt 3` 是為了利用 `SSR（伺服器端渲染）`或 `SSG（靜態網頁生成）`來強化 `SEO` 優化設置。

  - 本篇介紹 `Nuxt 3` 提供的幾個`組合式函數（Composables）`，用來協助設置網頁標題、內文及 `Meta` 標籤，以優化 SEO 或供外部連結正確解析。

## 搜尋引擎最佳化(SEO) - 網站的標題(Title) 與描述(Description)
  - `Meta Tag（元標籤/描述標籤）`：放置於 HTML 的 `<head>` 之中，雖不直接顯示於網頁，但對搜尋引擎爬蟲建立索引（Index）是極其重要的識別資訊，也是 Facebook Open Graph 放置的位置。

  - 正確設定 `<title>` 與 `<meta name="description" ... />` 後，當搜尋引擎爬蟲收錄並建立索引時，使用者便能在搜尋結果中看到對應的網頁資訊。

  - 遵循各家搜尋引擎官方指引的大方向進行設定，能顯著提升網站內容的能見度。

## 網站的Open Graph (OG)
  - `OG Tag`：全名為 `Open Graph Protocol（開放社交關係圖）`，由 `Facebook` 提出。

  - 目的：當網頁以連結形式分享至社群媒體（如 Facebook）或通訊軟體（如 LINE）時，能正確解析出豐富的「連結預覽」內容，包含`標題（og:title）`、`描述（og:description）`與`縮圖（og:image）`。

  - 主流媒體皆遵循此協議，例如傳送 LINE 訊息時的連結預覽即源於此設定。

## `useHead`
  - `Nuxt 3` 提供了 `useHead` 組合式函數，用來設定網頁頭部的各種標籤。
    ```js
    <script setup>
    useHead({
      title: 'Nuxt 3 Blog',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      charset: 'utf-8',
      meta: [
        { name: 'description', content: '這裡是 Nuxt 3 學習筆記 實戰部落格' }
      ],
      bodyAttrs: {
        class: 'test'
      }
    })
    </script>
    ```

  - 接受的參數類型與屬性（MetaObject 介面）：
    ```js
    useHead(meta: Computable<MetaObject>): void

    interface MetaObject extends Record<string, any> {
      charset?: string
      viewport?: string
      meta?: Array<Record<string, any>>
      link?: Array<Record<string, any>>
      style?: Array<Record<string, any>>
      script?: Array<Record<string, any>>
      noscript?: Array<Record<string, any>>
      titleTemplate?: string | ((title: string) => string)
      title?: string
      bodyAttrs?: Record<string, any>
      htmlAttrs?: Record<string, any>
    }
    ```
    - `charset`: 指定 HTML 的字元編碼（預設為 `utf-8`）。
    - `viewport`: 設定網頁可見區域（預設為 `width=device-width, initial-scale=1`）。
    - `meta`: 接受陣列，陣列內的每個物件皆會建立一個 `<meta>` 標記。
    - `link`: 接受陣列，建立 `<link>` 標記（如引入外部 CSS 或字體）。
    - `style`: 接受陣列，建立 `<style>` 標記。
    - `script`: 接受陣列，建立 `<script>` 標記（如插入第三方 JavaScript）。
    - `noscript`: 接受陣列，建立 `<noscript>` 標記。
    - `titleTemplate`: 接受字串或函數，用作動態設定網頁標題的樣板。
    - `title`: 設定靜態網頁標題。
    - `bodyAttrs`: 接受物件，設定 `<body>` 標籤的屬性（如 class）。
    - `htmlAttrs`: 接受物件，設定 `<html>` 標籤的屬性。

## 自訂 Metadata
  傳入 `useHead()` 的屬性值可以是具備響應性（Reactive）的變數（如 ref），當變數數值更動時，對應的 HTML 標籤內容也會一同響應改變。
  ```js
  <script setup>
    const title = ref('Nuxt 3 Blog')
    const description = ref('這裡是 Nuxt 3 學習筆記 實戰部落格')

    useHead({
      title,
      meta: [
        {
          name: 'description',
          content: description
        }
      ]
    })
  </script>
  ```

## 添加動態網頁的標題
  - 可以在 `app.vue` 中配置 `titleTemplate: '%s - 首頁'`，其中的 `%s` 會動態帶入目前頁面或上層頁面所設定的 `title` 屬性。
    ```js
    <script setup>
    const title = ref('Nuxt 3 Blog')

    useHead({
      title,
      titleTemplate: '%s - 首頁',
    })
    </script>
    ```

  - 亦可傳入一個函數來進行動態條件判斷（例如：`(title) => title ? ${title} - 首頁 : '首頁'`）。
    ```js
    <script setup>
    const title = ref('Nuxt 3 Blog')

    useHead({
      title,
      titleTemplate: (title) => {
        return title ? `${title} - 首頁` : '首頁'
      }
    })
    </script>
    ```

## 添加外部CSS
  - 可利用 `useHead()` 的 `link` 屬性加入外部字體（如 Google Fonts），並可設定 rel、href 或 crossorigin 等屬性。
    ```js
    <script setup>  
      useHead({
        link: [
          { 
            rel: 'preconnect', 
            href: 'https://fonts.googleapis.com'
          },
          { 
            rel: 'stylesheet', 
            href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap', 
            crossorigin: '' 
          }
        ]
      })
    </script>
    ```

## 添加第三方的JavaScript
  透過 `useHead()` 的 `script` 屬性插入外部第三方 JS 檔案，並可透過設定 `body: true` 將標籤放置於 body 區塊內。

  ```js
  <script setup>
    useHead({
      script: [
        {
          src: 'https://third-party-script.com',
          body: true
        }
      ]
    })
  </script>
  ```

## 在模板中使用相對應的元件設置屬性及標籤
  - 除了使用組合式函數，`Nuxt 3` 亦提供專屬的內建元件，讓開發者直接在 <`template>` 之中進行網頁屬性的設定。

  - 包含：`<Title>`、`<Base>`、`<Script>`、`<NoScript>`、`<Style>`、`<Meta>`、`<Link>`、`<Body>`、`<Html>` 和 `<Head>`。

  - 注意：為免與原生 `HTML` 標記混淆，在模板中使用這些內建元件時，其名稱開頭必須為大寫。

  ```xml
  <template>
    <div>
      <Head>
        <Title>{{ title }}</Title>
        <Meta name="description" :content="description" />
        <Style type="text/css" children="body { background-color: green; }" />
      </Head>
      <h1>{{ title }}</h1>
    </div>
  </template>

  <script setup>
  const title = ref('Nuxt 3 Blog')
  const description = ref('這裡是 Nuxt 3 學習筆記 實戰部落格')
  </script>
  ```

## definePageMeta()
  - `definePageMeta()` 除了用來設置頁面的布局或中間件外，也可以與 `useHead()` 搭配使用。

  - ### 例如：
    在 `app.vue` 中透過 `useHead()` 讀取 `route.meta.title` 來動態生成 `og:title`。接著在各別頁面（如 `./pages/articles`）中，使用 `definePageMeta({ title: '所有文章' })` 來定義該頁面的標題名稱，`Nuxt` 便會在伺服器端將對應的 `meta` 標籤渲染出來。

    ```js
    <script setup>
    const route = useRoute()

    useHead({
      meta: [{ name: 'og:title', content: `${route.meta.title} | Nuxt 3 Blog` }]
    })
    </script>
    ```

    ```js
    <script setup>
    definePageMeta({
      title: '所有文章'
    })
    </script>
    ```

## 實戰添加Meta
  - 實務上為動態部落格文章頁面（`./pages/articles/[id].vue`）加入 `Meta`，可以直接把由 `Server API` 回傳並具備響應性的文章資料（`article.value`）帶入 `useHead()`。

  - 可設定的標籤包含：`description`、`keywords`、`og:title`、`og:description`、`og:image` 以及 `title`，藉此達成完美的動態 `SSR Meta` 渲染。

  `./pages/articles/[id].vue`
  ```js
  <script setup>
  // ...

  useHead({
    meta: [
      { name: 'description', content: `${article.value.summary} | Nuxt 3 Blog` },
      { name: 'keywords', content: `${article.value.tags}` },
      { property: 'og:title', content: `${article.value.title} | Nuxt 3 Blog` },
      { property: 'og:description', content: article.value.summary },
      { property: 'og:image', content: article.value.cover }
    ],
    title: `${article.value.title} | Nuxt 3 Blog`
  })
  </script>
  ```

## 小結
  - `Nuxt 3` 提供的 `Meta` 相關組合式函數具備動態調整與響應的特性。結合 `SSR`，這些標籤能直接在伺服器端完成渲染，對 `SEO` 非常友善。

  - 雖然 `OG Tag` 與 `SEO` 沒有絕對關係，但對於提升社群分享的能見度與連結預覽體驗大有幫助。只要根據指引進行配置，即可大幅增加網站的曝光度。