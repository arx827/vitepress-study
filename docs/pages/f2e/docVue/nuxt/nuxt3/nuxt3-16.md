---
title: Nuxt3 學習筆記 - Ryan
---

# 16. 狀態管理 (State Management)
  - `Vue 3` 元件之間的資料傳遞方式：
    - `Props` / `Emit`
    - `Provide` / `Inject`
    - `Vuex store`
  - 不同情境會選擇不同方式
  - 重點：
    - 使用 `Nuxt 3` 提供的 `useState`
    - 實現「`跨元件共享狀態`」

## Hydration
  - ### 問題現象（範例）
    - 使用 `ref(Math.random())` 產生亂數
    - 每次重新整理畫面：
      - 數值會「變動兩次」

    - 建立 `./pages/random.vue` 內容如下：
      ```xml
      <template>
        <div class="bg-white py-24">
          <div class="flex flex-col items-center">
            <span class="text-9xl font-semibold text-sky-400">{{ count }}</span>
          </div>
        </div>
      </template>

      <script setup>
      const count = ref(Math.round(Math.random() * 1000))
      </script>
      ```

    - 頁面呈現出，每次重新整理頁面，頁面會顯示新的亂數：
      ![nuxt3_16_01](./imgs/16/nuxt3_16_01.gif)

  - ### 原因說明
    這是 `SSR + CSR 混合渲染（Universal Rendering`） 導致：
    #### 1. SSR（伺服器端）
    - 先生成 HTML（例如：163）

    #### 2. CSR（客戶端）
    - JS 載入後再次執行
    - 產生新值（例如：101）
    
    #### 3. 因此畫面出現：
    - 163 → 101（兩次變化）

  - ### Hydration 定義
    - 將「`伺服器產生的靜態 HTML`」
    - 轉換為「`可互動的 Vue 應用`」的過程

  - ### 特性
    - `Hydration` 前：
      - 可看，但不能互動
    - `Hydration` 後：
      - `Vue` 接手 → 可互動（`CSR`）

  - ### 問題警告
    - `Console` 會出現：
      `Hydration completed but contains mismatches`
    - 原因：
      - `Server` 與 `Client` 初始值不同

  ![nuxt3_16_02](./imgs/16/nuxt3_16_02.png)

## Nuxt 3 - 狀態管理 (State Management)
  - ### 核心：`useState`
    - `Nuxt` 提供的 `composable`
    - 特性：
      - 響應式（`reactive`）
      - SSR 友善
      - 可共享狀態

  - ### 為什麼要用 `useState`
    - 可解決：
      - `Hydration` 前後資料不一致問題
    - 與 `ref` 差異：
      - `ref` → 每次執行都重新初始化
      - `useState` → 會保留 `SSR` 的值

  - ### API 定義
    ```ts
    useState<T>(init?: () => T | Ref<T>): Ref<T>
    useState<T>(key: string, init?: () => T | Ref<T>): Ref<T>
    ```

  - ### 參數說明
    - #### `key`
      - 唯一識別
      - 用來共享狀態
    - #### `init`
      - 初始值函數
      - 只在「`沒有 state 時`」執行

  - ### 運作機制
    - `SSR`：
      - 初始化 `state`（例如 888）
    - `CSR Hydration`：
      - 發現已有相同 `key`
      - 不再重新初始化
    - → 解決數值不一致問題

  - ### 舉個例子
    新增 `./pages/count.vue`，內容如下：
    ```xml
    <template>
      <div class="bg-white py-24">
        <div class="flex flex-col items-center">
          <span class="text-9xl font-semibold text-emerald-400">{{ count }}</span>
        </div>
      </div>
    </template>

    <script setup>
    const count = useState('count', () => Math.round(Math.random() * 1000))
    </script>
    ```

    可以發現，使用 `useState` 初始化 `count` 的值後，瀏覽器重整頁面，就不像前面的例子會發生兩次的數值變動。
    ![nuxt3_16_04](./imgs/16/nuxt3_16_04.gif)

    當我們使用 `useState` 並以 `count` 當作 `key`，在網頁請求進入伺服器端執行時，還沒有這個 `count` 狀態，所以執行了初始化函數產生出一個亂數，例如 `888` 就會回傳給 `count` 當作響應式變數的初始值，此時這個網頁請求，已經有一個 `count` 的響應式狀態，當前端於 `Hydration` 步驟再次的執行了下面這段程式碼，`useState` 一樣是以 `count` 當作 `key`，但是存在了一個由伺服器端建立好的 `count`，就會直接使用該狀態，也就不會在執行初始化函數，而導致前後端的初始狀態不一致的問題。

    ```js
    const count = useState('count', () => Math.round(Math.random() * 1000))
    ```

## `useState` 的基本用法
  - ### 範例行為
    新增 `./pages/counter/increment.vue`，內容如下：
    ```xml
    <template>
      <div class="bg-white py-24">
        <div class="flex flex-col items-center">
          <span class="text-9xl font-semibold text-sky-600">{{ counter }}</span>
          <div class="mt-8 flex flex-row">
            <button
              class="font-base mx-2 rounded-full bg-sky-500 px-4 py-2 text-xl text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
              @click="counter++"
            >
              增加
            </button>
            <button
              class="font-base mx-2 rounded-full bg-sky-500 px-4 py-2 text-xl text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
              @click="counter--"
            >
              減少
            </button>
          </div>
          <p class="mt-4 text-slate-500">如果是第一次進入這個頁面，數值初始設定為 0</p>
          <div class="mt-8">
            <NuxtLink to="/">回首頁</NuxtLink>
          </div>
        </div>
      </div>
    </template>

    <script setup>
    const counter = useState('counter', () => 0)
    </script>
    ```

  - ### 特點
    - 第一次 `SSR`：
      - 初始化為 `0`
    - Hydration / 路由切換：
      - 保留原本的 `state`
    - 只有「重新整理頁面」才會重設

  - ### 結論
    `useState` 會在整個應用生命週期中維持狀態

  ![nuxt3_16_05](./imgs/16/nuxt3_16_05.gif)

## `useState` 的共享狀態
  - ### 使用方式
    - 在不同頁面使用同一個 `key`：
      ```ts
      useState('counter')
      ```

  - ### 行為
    - 不同頁面共享同一個 `state`
    - 初始化規則：
      - 第一次進入時才執行 `init`
      - 之後共用

  - ### 範例結果
    - `/counter/increment`
      - 初始值 = `0`
    - `/counter/surprise`
      - 初始值 = `隨機數`

        新增 `./pages/counter/surprise.vue`，內容如下：
        ```xml
        <template>
          <div class="bg-white py-24">
            <div class="flex flex-col items-center">
              <span class="text-9xl font-semibold text-sky-600">{{ counter }}</span>
              <div class="mt-8 flex flex-row">
                <button
                  class="font-base mx-2 rounded-full bg-sky-500 px-4 py-2 text-xl text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                  @click="counter++"
                >
                  增加
                </button>
                <button
                  class="font-base mx-2 rounded-full bg-sky-500 px-4 py-2 text-xl text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                  @click="counter--"
                >
                  減少
                </button>
              </div>
              <p class="mt-4 text-slate-500">如果是第一次進入這個頁面，數值初始設定為亂數</p>
              <div class="mt-8">
                <NuxtLink to="/">回首頁</NuxtLink>
              </div>
            </div>
          </div>
        </template>

        <script setup>
        const counter = useState('counter', () => Math.round(Math.random() * 1000))
        </script>
        ```

    - 兩頁之間：
      - 狀態同步
    
    ![nuxt3_16_06](./imgs/16/nuxt3_16_06.gif)

  - ### 注意事項
    - 若沒有初始化函數：
      - 可能會出錯（`state 不存在`）

## 使用組合式函數建立共享狀態
  - ### 做法
    - 建立 `composable`：
      ```ts
      export const useColor = () =>
        useState<string>('color', () => 'green')
      ```

  - ### 使用方式
    ```ts
    const color = useColor()
    ```

  - ### 優點
    - 自動 `import`（`Nuxt 特性`）
    - 型別安全（`TypeScript`）
    - 更好維護（集中管理 `state`）

  - ### 本質
    - `composable = state` 封裝層
    - 讓共享狀態更模組化

  - ### 範例
    如下例子，我們可以建立 `組合式函數 (Composables)` 來搭配 `useState`。

    新增 `./composables/states.ts`，內容如下：
    ```js
    export const useColor = () => useState<string>('color', () => 'green')
    ```

    新增 `./pages/color.vue`，內容如下：
    ```xml
    <template>
      <div class="bg-white py-24">
        <div class="flex flex-col items-center">
          <span class="text-9xl font-semibold text-emerald-400">{{ color }}</span>
        </div>
      </div>
    </template>

    <script setup>
    const color = useColor()
    </script>
    ```

    如此一來我們定義好的組合式函數就可以被自動的導入及建立具有類型安全的狀態，在各個元件之間就可以呼叫這個組合函數來取得共享狀態。

    ![nuxt3_16_07](./imgs/16/nuxt3_16_07.png)

## 小結
  - ### 重點整理
    - Universal Rendering：
      - `SSR` + `CSR`

    - Hydration：
      - 讓靜態頁變互動

    - 問題：
      - `SSR` / `CSR` 初始值不一致

    - 解法：
      - 使用 useState

  - ### useState 核心價值
    - 保持 `SSR` / `CSR` 一致
    - 提供全域共享狀態
    - 透過 `key` 管理 `state`
    - 可搭配 `composables` 做架構化

  - ### 建議：
    - 在 Nuxt 中
      - 優先用 `useState` 取代 `ref`（涉及 SSR 時）