---
title: Nuxt3 學習筆記 - Ryan
---

# 25. 邁向國際化 - 使用 Nuxt I18n 實作多國語系
## 前言
  - 當網站需要建立國際市場，或提供給不同語系的用戶使用時，多國語系（Internationalization，簡稱 `I18n`）功能便至關重要。

  - 在 `Vue` 生態系中，常見的是使用 `vue-i18n`。而在 `Nuxt 3` 裡，官方則封裝並提供了專屬的 `@nuxtjs/i18n` 模組，讓開發者在 `SSR`（伺服器端渲染）與路由整合上更為簡便與完美。

## 安裝與基本配置
  - ### 安裝指令：
    透過套件管理器安裝 `@nuxtjs/i18n` 模組。
    ```sh
    npm install -D @nuxtjs/i18n@next
    ```

  - ### Nuxt 配置文件設定：
    - 在 `nuxt.config.ts` 的 `modules` 陣列中添加 `'@nuxtjs/i18n'`。
      ```ts
      export default defineNuxtConfig({
        modules: ['@nuxtjs/i18n']
      })
      ```

    - 新增 `i18n` 區塊進行核心配置：
      - `locales`：定義網站支援的語系清單（例如 `en`、`zh-TW`），通常會包含 `code`、`name`、`file` 等設定。
      - `defaultLocale`：指定預設語系（例如 `zh-TW`）。
      - `lazy`：設定為 `true` 可以啟動延遲載入（`Lazy Loading`），當使用者切換到該語系時才下載對應的翻譯檔案。
      - `langDir`：指定存放翻譯語系檔案的資料夾路徑（例如 `locales/`）。
      - `strategy`：路由策略（如 `prefix_except_default` 代表除了預設語系外，其餘語系路由皆會加上語系前綴，如 `/en/about`）。

      ```ts
      export default defineNuxtConfig({
        modules: ['@nuxtjs/i18n'],
        i18n: {
          vueI18n: {
            legacy: false,
            locale: 'zh',
            messages: {
              en: {
                hello: 'Hello!',
                language: 'Language'
              },
              zh: {
                hello: '你好!',
                language: '語言'
              }
            }
          }
        }
      })
      ```
      > 記得設置 `i18n.vueI18n.legacy` 為 `false` 來關閉使用較舊的 API 模式。

## 建立語系字典檔案
  - 於專案根目錄建立設定的 `langDir`（如 `locales` 資料夾），並依配置新增各語系的 `JSON` 或 `TS` 檔案（如 `zh-TW.json` 與 `en.json`）。

  - 內容格式：以鍵值對（Key-Value）形式定義翻譯文本。
    `./locales/zh-TW.json`
    ```json
    {
      "welcome": "歡迎",
      "home": {
        "title": "首頁"
      }
    }
    ```

## 在模板與元件中使用翻譯
  - ### 使用 `$t` 函數
    在 `<template>` 內可以直接透過 `$t('key')` 讀取並渲染對應的翻譯文字（例如 `$t('welcome')`、`$t('home.title')`）。
    ```xml
    <template>
      <div class="flex flex-col items-center bg-white">
        <h1 class="mt-48 text-8xl font-medium text-blue-500">
          {{ $t('hello') }}
        </h1>
      </div>
    </template>
    ```

  - ### 在組合式 API 中使用
    在 `<script setup>` 中，需要先透過 `const { t } = useI18n()` 宣告，隨後便能在 JavaScript/TypeScript 邏輯中調用 `t('key')`。

## 語系路由與切換
  - ### 語系切換連結
    使用 `Nuxt I18n` 內建的組合式函數 `useSwitchLocalePath()`。該函數能動態生成切換至目標語系的正確路由路徑。
  - ### 實作切換按鈕
    - 透過 `const switchLocalePath = useSwitchLocalePath()`。
    - 配合 `<NuxtLink :to="switchLocalePath('en')">English</NuxtLink>` 即可達成無縫切換語系，並自動維持在當前頁面路由。
  - ### 動態路由整合
    `Nuxt I18n` 會自動接管全域路由，並依據網址列的語系前綴（如 `/en/`）自動切換當前的語系狀態。

## SEO 優化與多國語系 Meta Tag
  - 搜尋引擎（如 Google）需要了解網頁提供哪些語系版本，這通常依賴 `hreflang` 標籤與 `html` 的 `lang` 屬性。
  - ### 自動產生 Meta
    `Nuxt I18n` 提供了 `useLocaleHead()` 組合式函數。
  - ### 實作方式
    在 `app.vue` 中調用 `const i18nHead = useLocaleHead({ addSeoAttributes: true })`，並將其回傳的動態屬性綁定至 `useHead` 中，即可讓 SSR 自動在 HTML 的 `<head>` 中渲染出正確的多國語系 SEO 標籤。

## 小結
  - 透過 `@nuxtjs/i18n` 模組，Nuxt 3 可以極為高效地組織多國語系架構，並透過延遲載入優化效能。
  - 路由策略的自動處理免去了開發者手動編寫多語系路由的負擔。
  - 搭配 `useLocaleHead()` 能確保網站在進行多國語系擴充時，依然維持極佳的搜尋引擎最佳化（SEO）表現。