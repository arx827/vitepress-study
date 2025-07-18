---
title: Nuxt3 學習筆記 - Ryan
---

# 6. 目錄結構與自動載入 (Auto Imports)
## Nuxt 3 的目錄結構
  完整的 Nuxt 3 專案目錄結構：
  ```sh
  nuxt-app/
  ├── .nuxt/
  ├── .output/
  ├── assets/
  ├── components/
  ├── composables/
  ├── content/
  ├── layouts/
  ├── middleware/
  ├── node_modules/
  ├── pages/
  ├── plugins/
  ├── public/
  └── server/
      ├── api/
      ├── routes/
      └── middleware/
  ├── .gitignore
  ├── .nuxtignore
  ├── app.config.ts
  ├── app.vue
  ├── nuxt.config.ts
  ├── package.json
  └── tsconfig.json
  ```

  - #### `.nuxt` 目錄
    開發環境下由 `Nuxt` 產生出 `Vue` 的網站，`.nuxt` 目錄是 `自動產生` 的，不應該任意的調整裡面檔案。

  - #### `.output` 目錄
    當網站準備部署至正式環境時，每次編譯建構專案時，皆會 `自動重新產生`，不應該任意的調整裡面檔案。

  - #### `assets` 目錄
    靜態資源檔案所放置的位置，目錄內通常包含以下類型的檔案：
    - ##### CSS 樣式檔案 (CSS、SASS 等…)
    - ##### 字型
    - ##### 圖片
    這些靜態資源，最終在專案編譯建構時，由 `Vite` 或 `webpack` 進行編譯打包。

  - #### `components` 目錄
    放置 `Vue` 元件的地方，`Nuxt` 會自動載入這個目錄中的任何元件。

  - #### `composables` 目錄
    組合式函數放置的目錄，簡單來說可以把常用或通用的功能寫成一個共用的函數或 JS 檔案，放置在這個目錄視為組合式函數，Nuxt 也會自動載入這些組合式函數，讓需要使用的頁面或元件可以直接做使用。

  - #### `content` 目錄
    透過使用 `Nuxt Content`，我們可以在這個目錄下建立 `.md`、`.yml`、`.csv` 和 `.json` 檔案，`Nuxt Content` 會讀取並解析這些文件並進行渲染，用來建立基於文件的 `CMS`。

  - #### `layouts` 目錄
    用於放置通用或可能重複使用到的佈局模板，提供程式碼的可重複使用性。

  - #### `middleware` 目錄
    `Nuxt 3` 提供了路由中間件的概念，用以在導航到下一個頁面之前執行一些程式碼如權限驗證。

  - #### `node_modules` 目錄
    通常有使用 `Node.js` 的套件管理，例如 `NPM`，對此目錄應該有一些印象，使用 `Nuxt 3` 及專案所需要的相依套件都會存放在這個目錄。

  - #### `pages` 目錄
    這個目錄主要是用來配置我們的頁面，你也可以只使用 `app.vue` 來完成你的網站，但如果建立了 `pages` 這個目錄，`Nuxt 3` 會自動整合 `vue-router`，並會依據目錄及檔案結構規則來自動產生出對應路由，也是 `Nuxt3` 產生路由的方式。

  - #### `plugins` 目錄
    `Nuxt` 會自動載入這個目錄檔案，作為插件使用，在檔案名稱可以使用後綴 `.server` 或 `.client`，例如， `plugin.server.ts` 或 `plugin.client.ts` 來決定只讓伺服器端或客戶端載入這個插件。

  - #### `public` 目錄
    這個目錄主要用於伺服器根目錄提供的文件，包含必須固定的檔案名稱如 `robots.txt` 或不太會變動的 `favicon.ico`。

  - #### `server` 目錄
    用於建立任何後端的邏輯如 `後端 API`，這個目錄下還包含了 `api`、`server` 和 `middleware` 來區分功能，不具有自動載入，但支援 `HMR`。

  - #### `.gitignore` 檔案
    在使用 `Git` 版本控制時，可以設置一些不需要或忽略關注變動的檔案及目錄。

  - #### `.nuxtignore` 檔案
    可以設置讓 `Nuxt` 編譯建構時，一些不需要或忽略檔案。

  - #### `app.config.ts` 檔案
    提供服務運行時暴露給客戶端使用的設定，因此，請不要在 `app.config.ts` 檔案中添加任何機密資訊。

  - #### `app.vue` 檔案
    `Nuxt 3` 網站的入口點元件。

  - #### `nuxt.config.ts` 檔案
    用於配置 `Nuxt` 專案的設定檔。

  - #### `package.json` 檔案
    這個檔案裡面定義了專案資訊、腳本、相依套件及版本號，通常有使用 `Node.js` 套件管理工具建置的專案都會包含此檔案。

  - #### `tsconfig.json` 檔案
    `Nuxt 3` 會在 `.nuxt` 目錄下自動產生一個 `tsconfig.json` 檔案，其中已經包含了一些解析別名等預設配置；
    你可以透過專案目錄下的 `tsconfig.json` 來配置擴展或覆蓋 `Nuxt 3` 預設的 `TypeScript` 設定檔。

### 自訂目錄名稱
  前面簡介了 `Nuxt 3` 的預設目錄結構與用途，在目錄名稱上 `Nuxt 3` 也提供了可以調整目錄名稱的方式，
  只要在 `nuxt.config.ts` 修改對應的參數，就可以自訂目錄的名稱。
  
  不過呢，也並不是所有的目錄都能修改，目前官方提供的 `dir` 參數共有以下四個目錄參數選項供修改：
  - #### layouts
  - #### middleware
  - #### pages
  - #### public

  例如我想將 `pages` 目錄名稱調整為 `views` 就可以新增下列 `dir` 設定添加至 `nuxt.config.ts`，就可以將 `pages` 目錄功能及規則調整為 `views` 目錄來實現。
  ```ts
  export default defineNuxtConfig({
    dir: {
      pages: 'views',
    }
  })
  ```

## 自動載入 (Auto Imports)
  在介紹目錄結構時有提到，某些目錄下的檔案是具有 `自動載入 (Auto Imports)` 的功能，意思就是說，當我們在這些特定的目錄 `components`、`composables`、`layouts`、`plugin` 添加檔案時，`Nuxt 3` 會自動載入這些元件或函數，

  `Nuxt 3` 的自動載入具體有以下三種：
  - Nuxt 常用元件與函數
  - Vue 3 的 API
  - 基於目錄的自動載入

  - ### `Nuxt` 常用元件與函數的自動載入
    `Nuxt` 會自動載入一些元件或組合式函數，用以讓開發時可以在全部頁面或定義元件和插件可以使用。

    `Nuxt` 自動載入的元件就好比 `app.vue` 程式碼內，一開始在 `template` 就有的 `<NuxtWelcome />` 歡迎頁面元件，其他還包含了 `<NuxtPage>`、`<NuxtLayout>` 和 `<NuxtLink>` 等，詳細可以參考[官方文件](https://v3.nuxtjs.org/api/components)

    例如，下面程式碼中的 `useAsyncData` 與 `$fetch` 就是 `Nuxt` 自動載入的組合式函數，在各個頁面或元件都能做使用。
    ```ts
    <script setup>
      const { data, refresh, pending } = await useAsyncData('/api/hello', () => $fetch('/api/hello'))
    </script>
    ```

  - ### Vue 3 的 API 的自動載入
    例如，`Vue 3` 中會使用到的 `ref`、`computed` 等這類的 `helpers` 或 `lifecycle hooks`，在 `Nuxt 3` 也都將會自動的載入，不需要在 `import`。
    ```ts
    <script setup>
      // 不需要在 import ref 或 computed
      const count = ref(1)
      const double = computed(() => count.value * 2)
    </script>
    ```

  - ### 基於目錄的自動載入
    如前面所提及的，`Nuxt` 會自動載入定義在特定目錄的檔案，例如：
    - `components`: 相對於 Vue 的元件。
    - `composables`: 相對於 Vue 的組合式函數。

## 建立一個自動導入的元件
  我們建立一個 `./components/IronManWelcome.vue` 檔案：
  ```xml
  <template>
    <div class="bg-white py-24">
      <div class="flex flex-col items-center">
        <h1 class="text-6xl font-semibold text-sky-400">2022 iThome</h1>
        <p class="mt-4 text-9xl font-bold text-gray-600">鐵人賽</p>
      </div>
    </div>
  </template>
  ```

  在 `app.vue` 檔案中，新增` <IronManWelcome />` 元件。
  ```xml
  <template>
    <div>
      <IronManWelcome />
    </div>
  </template>
  ```

  可以發現，我們不需要添加 `import IronManWelcome from './components/IronManWelcome'` 就可以直接在 `template` 直接使用 `<IronManWelcome />` 元件，這就是 `Nuxt 3` 基於目錄的自動載入功能。

## 關閉自動載入
  如果想關閉 `Nuxt` 的自動載入元件或函數的功能，可以修改專案目錄下的 `nuxt.config.ts` 檔案，將 `imports.autoImport` 設定為 `false`。

  ```ts
  export default defineNuxtConfig({
    imports: {
      autoImport: false
    }
  })
  ```

## 顯式載入 (Explicit Imports)
  `Explicit` (顯式、明確的)，當我們需要手動載入，就可以用 `#import` 這個 `Nuxt` 釋出的別名，來個別載入那些具有自動載入的元件或函數。

  ```ts
  <script setup>
  import { ref, computed } from '#imports'

  const count = ref(1)
  const double = computed(() => count.value * 2)
  </script>
  ```