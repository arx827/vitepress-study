---
title: Nuxt3 學習筆記 - Ryan
---

# 8. 布局模板 (Layouts)
  `Nuxt 3` 提供了一個 `布局模板 (Layouts)` 的功能，可以讓你定義好布局模板後，在整個 `Nuxt` 中使用，舉例來說就很適合如上方有導覽列，下方是網頁主體內容的這種排版方式，將其構建成一個布局模板後，我們就可以重複使用這種布局方式。

## 布局模板 (Layouts)
  布局模板通常放置在 `./layouts` 目錄之下，也具有異步自動導入的效果，當新增好布局檔案後，我們就可以在 `app.vue` 中，添加 `<NuxtLayout />` 元件來表示使用布局模板，也可以通過 `name` 設定不同的模板名稱。

## 建立一個預設的布局模板
  布局模板在 `Nuxt 3` 中有約定一個名稱為 `default.vue` 作為預設的模板，如果在頁面元件中未特別指定要使用哪個模板或 `<NuxtLayout />` 沒有設定 `name` 屬性，那麼都將會使用 `default` 作為預設的布局。

  - ### Step 1. 建立預設布局模板
    新增 `./layouts/default.vue` 檔案內容如下：

    ```xml
    <template>
      <div class="bg-sky-100 py-2">
        <p class="px-6 py-4 text-2xl text-gray-700">這是預設的布局，全部頁面都會使用到</p>
        <slot />
      </div>
    </template>
    ```

    在布局模板中，通常會包含一個 `<slot />` 插槽，這個未命名的插槽 (slot) 即為預設插槽，這將會是採用這個布局模板的頁面元件，顯示的內容容器位置。

  - ### Step 2. 添加 元件
    調整 `app.vue` 檔案，內容如下，我們添加 `<NuxtLayout>` 作為布局模板顯示的位置，`name` 屬性預設是 `default`，不過我們還是寫上 `name="default"` 避免誤會，這個 `name` 屬性值對應的即是布局模板的名稱。

## 布局模板中的插槽
  如果你有注意到，`default.vue` 檔案內程式碼內，有一個插槽 `<slot />`，這裡就會是 `<NuxtLayout>` 內的元素所顯示的位置。

  例如，我們在 `app.vue` 稍作調整：

  ```xml
  <template>
    <div class="m-4 bg-white">
      <p class="pb-4 text-2xl text-slate-600">這裡是最外層 app.vue</p>
      <NuxtLayout name="default">
        <p class="px-6 pt-4 text-xl text-slate-800">
          被 NuxtLayout 包裹的元件將會放置到 Layout 的 slot 中
        </p>
      </NuxtLayout>
    </div>
  </template>
  ```

  被 `<NuxtLayout name="default">` 包裹的元素，就會在布局模板中的插槽 `<slot />` 顯示。

  - ### 在布局模板中建立多個插槽
    當然，你也可以在布局模板中添加多個插槽，並給予名稱，這樣就可以將內容安排到特定的位置。

    - #### Step 1. 建立兩個具名的插槽 (Slot)，分別為 `header` 與 `footer`

      > 如果插槽沒有給予 `name` 屬性，預設為 `default`。

      `./layouts/default.vue` 檔案內容如下：
      ```xml
      <template>
        <div class="bg-sky-100 py-2">
          <p class="px-6 py-4 text-2xl text-gray-700">這是預設的布局，全部頁面都會使用到</p>
          <slot name="header" />
          <slot />
          <slot name="footer" />
        </div>
      </template>
      ```

    - #### Step 2. 將不同內容，顯示於指定的插槽位置。
      `app.vue`，內容如下：
      ```xml
      <template>
        <div class="m-4 bg-white">
          <p class="pb-4 text-2xl text-slate-600">這裡是最外層 app.vue</p>
          <NuxtLayout name="default">
            <template #header>
              <p class="px-6 pt-4 text-xl text-green-500">這段會放置在 header 插槽</p>
            </template>
            <template #default>
              <p class="px-6 pt-4 text-xl text-cyan-500">
                被 NuxtLayout 包裹的元件將會放置到 Layout 的預設 slot 中
              </p>
            </template>
            <template #footer>
              <p class="px-6 pt-4 text-xl text-blue-500">這段會放置在 footer 插槽</p>
            </template>
          </NuxtLayout>
        </div>
      </template>
      ```

## 布局模板與路由頁面
  當你熟悉了插槽配置，你也可以在其中添加 `<NuxtPage />` 與建立 `pages` 下的頁面元件，以達到不同的路由頁面，使用相同的布局方式。

  如果布局模板結合了路由頁面，整體網站就會如下的巢狀顯示方式，網站的入口點 `app.vue` 放置布局模板，模板內的內容則使用路由的 `<NuxtPage />`，最後各個路由的頁面就會在 `<NuxtPage />` 容器中顯示。

  ```sh
  +---------------------------+
  | app.vue                   |
  | +-----------------------+ |
  | | layout                | |
  | | +-------------------+ | |
  | | | page              | | |
  | | |                   | | |
  | | |                   | | |
  | | +-------------------+ | |
  | +-----------------------+ |
  +---------------------------+
  ```

  - ### 建立布局模板與路由頁面
    - #### Step 1. 調整 app.vue 入口點
      將 `app.vue` 調整為以下內容：
      ```xml
      <template>
        <div class="m-4 bg-white">
          <p class="pb-4 text-2xl text-slate-600">這裡是最外層 app.vue</p>
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
        </div>
      </template>
      ```

    - #### Step 2. 建立路由頁面
      建立 `./pages/index.vue`，內容如下：
      ```xml
      <template>
        <div class="m-6 bg-slate-50 py-24">
          <div class="flex flex-col items-center">
            <h1 class="text-6xl font-semibold text-sky-400">2022 iThome</h1>
            <p class="mt-4 text-9xl font-bold text-gray-600">鐵人賽</p>
          </div>
        </div>
      </template>
      ```

  - ### 多個路由頁面共用預設布局模板
    承上，我們建立好預設的布局模板，讓它負責顯示路由的頁面。

    - #### Step 1. 新增路由頁面
      - ##### 新增 `./pages/about.vue`，內容如下：
        ```xml
        <template>
          <div class="mx-6 mb-4 bg-slate-50 py-24">
            <div class="flex flex-col items-center">
              <h1 class="text-6xl font-semibold text-yellow-400">大家好！我是 Ryan</h1>
              <p class="my-8 text-3xl text-gray-600">這裡是 /about</p>
            </div>
          </div>
        </template>
        ```

      - ##### 新增 `./pages/contact.vue`，內容如下：
        ```xml
        <template>
          <div class="mx-6 mb-4 bg-slate-50 py-24">
            <div class="flex flex-col items-center">
              <h1 class="text-6xl font-semibold text-rose-400">如果沒事不要找我 xDDD</h1>
              <p class="my-8 text-3xl text-gray-600">這裡是 /contact</p>
            </div>
          </div>
        </template>
        ```

    - #### Step 2. 新增路由連結
      調整 `./pages/index.vue`，內容如下：
      ```xml
      <template>
        <div class="mx-6 mb-4 bg-white py-24">
          <div class="flex flex-col items-center">
            <h1 class="text-6xl font-semibold text-gray-800">這裡是首頁</h1>
            <div class="my-4 flex space-x-4">
              <NuxtLink to="/about">前往 About</NuxtLink>
              <NuxtLink to="/contact">前往 Contact</NuxtLink>
            </div>
          </div>
        </div>
      </template>
      ```

## 建立多個布局模板
  你也可以建立多個布局模板，再依據不同的情境，使用不同的布局模板。

  - ### 使用指定的布局模板
    - #### Step 1. 建立新的布局模板
      新增 `./layouts/custom.vue`，內容如下：
      ```xml
      <template>
        <div class="bg-rose-100 py-2">
          <p class="px-6 py-4 text-2xl text-gray-700">
            使用 <span class="font-bold text-rose-500">Custom</span> 布局
          </p>
          <slot />
        </div>
      </template>
      ```

    - #### Step 2. 新增一個路由頁面
      新增 `./pages/custom.vue`，內容如下：
      ```xml
      <template>
        <div class="m-6 bg-slate-50 py-24">
          <div class="flex flex-col items-center">
            <h1 class="text-6xl font-semibold text-sky-400">2022 iThome</h1>
            <p class="mt-4 text-9xl font-bold text-gray-600">鐵人賽</p>
          </div>
        </div>
      </template>
      ```
    
    - #### Step 3. 使用指定布局模板
      在 `./pages/custom.vue` 中的 `script` 使用 `definePageMeta` 方法：
      ```xml
      <script setup>
      definePageMeta({
        layout: 'custom'
      })
      </script>
      ```

    - #### 布局模板與路由頁面的呈現
      `definePageMeta` 方法，提供我們可以設定特定的布局模板，`layout` 參數值所對應的名稱，即為 `./layouts` 目錄下的布局模板。

      > 注意，布局模板的命名被規範使用 `Kebab Case` 命名法，若檔案名稱為 `customLayout.vue`，它將會以 `custom-layout` 作為 `name` 屬性傳遞

    - #### 更進階的指定布局模板
      我們能使用 `layout: false` 來禁止使用預設的布局模板，並在 `template` 添加 `<NuxtLayout name="custom">` 來使用 `custom` 布局模板。
      ```xml
      <template>
        <NuxtLayout name="custom">
          <div class="mx-6 mb-4 bg-white py-24">
            <div class="flex flex-col items-center">
              <h1 class="text-6xl font-semibold text-sky-400">2022 iThome</h1>
              <p class="mt-4 text-9xl font-bold text-gray-600">鐵人賽</p>
            </div>
          </div>
        </NuxtLayout>
      </template>

      <script step>
      definePageMeta({
        layout: false
      })
      </script>
      ```

    當布局模板可以在 `template` 中設定使用，我們就能結合插槽甚至動態的調整 `name` 屬性，做出更多樣靈活的布局效果。

    `./layouts/custom.vue`
    ```xml
    <template>
      <div class="bg-rose-100 py-2">
        <p class="px-6 py-4 text-2xl text-gray-700">
          使用 <span class="font-bold text-rose-500">Custom</span> 布局
        </p>
        <slot />
        <slot name="footer" />
      </div>
    </template>
    ```

    `./pages/custom.vue`
    ```xml
    <template>
      <NuxtLayout name="custom">
        <template #default>
          <div class="mx-6 mb-4 bg-white py-24">
            <div class="flex flex-col items-center">
              <h1 class="text-6xl font-semibold text-sky-400">2022 iThome</h1>
              <p class="mt-4 text-9xl font-bold text-gray-600">鐵人賽</p>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex flex-col items-center">
            <p class="mt-4 text-xl text-slate-600">感謝您閱讀 Nuxe 3 學習筆記～</p>
          </div>
        </template>
      </NuxtLayout>
    </template>

    <script step>
    definePageMeta({
      layout: false
    })
    </script>
    ```

    當你使用 `definePageMeta` 方法，禁止使用預設的布局模板後，你也能使用 `setPageLayout` 方法來動態改變布局。

    例如：
    ```xml
    <script setup>
    const enableCustomLayout = () => {
      setPageLayout('custom')
    }
    </script>
    ```

## 實戰練習
  我們將這篇所介紹的布局模板與路由頁面的配置方式與特性熟悉之後，我們就來做一個小練習。

  使用預設布局模板，使得每一個路由頁面都能有 `Header`，點擊「`Nuxt 3 學習筆記`」隨時可以回至首頁，並將其中一個頁面禁止使用預設布局，改採用自訂的布局模板。

  - [實戰練習參考程式碼](https://github.com/ryanchien8125/ithome-2022-ironman-nuxt3/tree/day08/nuxt-app-layouts-demo)

## 小結
  當你看過了這篇內容後，你會發現 `Nuxt 3` 所提供的布局模板非常的好用，布局模板規劃好後，爾後頁面所使用到的相同布局，只需要更改同一個布局模板，如果再結合元件化技巧，更是讓你的程式碼兼具重複使用性與維護性。
