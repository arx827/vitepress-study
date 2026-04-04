---
title: Nuxt3 學習筆記 - Ryan
---

# 17. 狀態管理 - Store & Pinia
  上一篇我們介紹了如何在 `Nuxt 3` 使用 `useState` 來建立一個元件間的共享狀態，隨著專案的健壯增大，我們就需要一個更好的方式來管理與儲存這些狀態，例如在 `Vue` 中使用 `Vuex` 或 `Pinia` 來建立一個 `Store` 管理這些狀態就是一個解決方案。如果你還不了解 `Pinia`，可以理解為是 `Vuex v5`。因為目前 `Pinia` 已經成為 `Vue` 官方推薦的狀態管理解決方案，本篇將針對 `Nuxt` 使用 `Pinia` 做一個簡單的介紹。

  ![nuxt3_17_01](./imgs/17/nuxt3_17_01.png)

## Pinia
  - ### Pinia 與 Vuex
    如果你使用過 `Vuex` 大概會知道 `Vue` 如何建立 `Store` 來做狀態管理，隨著時間 `Vuex` 很積極的蒐集社群及使用者的 [意見](https://github.com/vuejs/rfcs/discussions/270) 來規劃 `Vuex v5`。`Pinia` 的作者 [Eduardo](https://github.com/posva) 是 `Vue.js` 核心團隊的成員之一，也參與著 `Vuex` 的開發，當時他正測試著 `Vuex v5` 的 [提案](https://github.com/kiaking/rfcs/blob/vuex-5/active-rfcs/0000-vuex-5.md)，而 [Pinia](https://pinia.vuejs.org/) 成為探索這些意見及可能性的先驅，實現了 `Vuex v5` 可能的樣子，現在 `Pinia` 的 API 已經進入穩定狀態，也成為 Vue 官方推薦使用的狀態管理解決方案，並遵循著 `Vue` 生態的 `RFC` 流程。

    `Pinia` 相較於 `Vuex` 有以下差異：
    - 沒有 `mutation`，只需要使用 `action` 就可以改狀態。
    - 不再有 `modules` 巢狀的結構，也不再需要為模組定義命名空間，因為在 `Pinia` 中，可以定義多個 `Store` 而且每個都是獨立的也都具有自己的命名空間。
    - 更完整的支援 `TypeSctipt`，也不在需要使用多餘的 `types` 來封裝，所有的內容都是類型化的，`Pinia API` 的設計方式盡可能使用 `TypeSctipt` 類型推斷。
    - 非常輕巧，約僅有 `1 KB`，而且可以自定義插件。
    - 支援伺服器端渲染 (SSR) 與程式碼自動拆分。

  - ### Nuxt 3 安裝 Pinia
    ```sh
    npm install -D pinia @pinia/nuxt --force
    ```

    > 目前照著官方安裝 `Pinia`，會發生一些問題，所以我們在安裝時加上 `--force` 參數

    添加 `@pinia/nuxt` 至 `nuxt.config.ts` 的 `modules` 屬性中。
    ```ts
    export default defineNuxtConfig({
      modules: ['@pinia/nuxt']
    })
    ```

  - ### 建立第一個 Pinia 的 Store
    `Pinia` 提供了一個函數 `defineStore` 用來定義 `store`，呼叫時需要一個唯一的名稱來當作第一個參數傳遞，也稱之為 `id`，`Pinia` 會使用它來將 `store` 連接到 `devtools`。

    建議將回傳的函數命名為 `use...`，例如 `useCounterStore`，`use` 作為開頭是組合式函數命名的約定，來符合使用上的習慣。

    而 `defineStore` 的第二個參數，可以傳入 `Options` 物件或是 `Setup` 函數，例如我們使用 `Opsions` 來定義一個 `Store`，新增 `./stores/counter.js`，內容如下：
    ```js
    import { defineStore } from 'pinia'

    export const useCounterStore = defineStore('counter', {
      state: () => ({
        count: 0
      }),
      actions: {
        increment() {
          this.count += 1
        },
        decrement() {
          this.count -= 1
        }
      },
      getters: {
        doubleCount: (state) => state.count * 2
      }
    })
    ```

    可以發現到與 `Vue` 的 `Options API` 非常類似，我們可以傳遞帶有 `state`、`actions` 和 `getters` 屬性的物件。這些屬性正好讓 `Store` 與 `Options API` 呼應彼此的關係，如 `state` 對應 `data`、`actions` 對應 `methods` 而 `getters` 對應 `computed`。

    還有另一種方式可以來定義 `Store` ，與 `Vue Composition API` 的 `setup` 函數類似，我們可以傳入一個函數，這個函數裡面定義響應式屬性、方法等函數，最後回傳我們想公開的屬性和方法所組成的物件。

    以 `setup` 函數定義 `counter store`，內容如下：
    ```js
    import { defineStore } from 'pinia'

    export const useCounterStore = defineStore('counter', () => {
      const count = ref(0)
      const increment = () => {
        count.value += 1
      }
      const decrement = () => {
        count.value -= 1
      }
      const doubleCount = computed(() => count.value * 2)
      return {
        count,
        increment,
        decrement,
        doubleCount
      }
    })
    ```

  - ### 開始使用 Store
    我們只需要在元件中，如下程式碼匯入並呼叫 `useCounterStore()` 就可以操作 `store` 裡面的方法或屬性囉！
    ```js
    import { useCounterStore } from '@/stores/counter'

    const counterStore = useCounterStore()
    ```

    我們新增一個頁面元件 `./pages/counter.vue`，內容如下：
    ```xml
    <template>
      <div class="bg-white py-24">
        <div class="flex flex-col items-center">
          <span class="text-9xl font-semibold text-sky-600">{{ counterStore.count }}</span>
          <div class="mt-8 flex flex-row">
            <button
              class="font-base mx-2 rounded-full bg-sky-500 px-4 py-2 text-xl text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
              @click="counterStore.increment"
            >
              增加
            </button>
            <button
              class="font-base mx-2 rounded-full bg-sky-500 px-4 py-2 text-xl text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
              @click="counterStore.decrement"
            >
              減少
            </button>
          </div>
          <div class="mt-8">
            <NuxtLink to="/">回首頁</NuxtLink>
          </div>
        </div>
      </div>
    </template>

    <script setup>
    import { useCounterStore } from '@/stores/counter'

    const counterStore = useCounterStore()
    </script>
    ```

    這樣我們就完成了一個 `store` 的顯示狀態值，透過呼叫 `counterStore` 內定義的 `increment` 與 `decrement` 來改變狀態。
    ![nuxt3_17_02](./imgs/17/nuxt3_17_02.gif)

    在不同的元件間，你也可以使用 `useCounterStore` 取得已經建立好的 `store` 來共享這些狀態或進行操作。
    ![nuxt3_17_03](./imgs/17/nuxt3_17_03.gif)

  - ### Pinia Store 的 State
    預設情況下，可以直接對 `store` 的實例來取得狀態，而使用 `Pinia` 定義的 `store` 比較特別得是，我們可以不用透過呼叫函數來修改狀態，也可以直接對 `sotre` 的狀態進行修改。

    ```js
    const counterStore = useCounterStore()

    counterStore.count += 10
    ```

    - #### 改變狀態
      除了直接使用 `counterStore.count += 10` 修改 `store`，你也可以使用 `store` 提供的 `helper $patch` 來修改 `部分` 的狀態。
      ```js
      userStore.$patch({
        name: 'Ryan'
        money: '88888888',
      })
      ```

      對於集合類型的修改，例如陣列的新增、刪除或指定修改某一個元素等操作，你可以使用 `$patch` 傳入一個函數，這個函數會接收一個 `state` 讓你可以修改，對於比較複雜的操作會很方便。
      ```js
      cartStore.$patch((state) => {
        state.items.push({ name: 'shoes', quantity: 1 })
        state.hasChanged = true
      })
      ```

      如果你需要，也可以將 `store` 的整個 `state` 重新設置成一個新的物件。
      ```js
      cartStore.$state = {
        items: [],
        hasChanged: false,
      }
      ```

    - #### 重置狀態
      `sotre` 的實例提供了一個 `$reset()` 的 `helper`，呼叫它就可以將 `store` 的狀態重置至初始值，不過目前只在使用 `Option` 物件定義的 `store` 才有實作。
      ```js
      const counterStore = useCounterStore()

      counterStore.$reset()
      ```

  - ### Pinia Store 的 Getters
    - #### 使用同一個 store 中的其他 getter
      在 `store` 內你可以組合多個 `getter`，在 `Option` 物件下，可以透過使用 `this` 來呼叫使用其他的 `getter`。
      ```js
      export const useStore = defineStore('main', {
        state: () => ({
          counter: 0,
        }),
        getters: {
          doubleCount: (state) => state.counter * 2,
          doubleCountPlusOne() {
            return this.doubleCount + 1
          },
        }
      })
      ```

    - #### 使用其他 store 的 getter
      在 `store` 內你也可以組合其他 `store` 的 `getter`，只要建立出其他 `store` 實例就可以呼叫使用了。
      ```js
      import { useOtherStore } from './other-store'

      export const useStore = defineStore('main', {
        state: () => ({
          // ...
        }),
        getters: {
          otherGetter(state) {
            const otherStore = useOtherStore()
            return state.localData + otherStore.data
          },
        },
      })
      ```

  - ### Pinia Store 的 Actions
    `Actions` 相當於元件中的方法，也是修改狀態的商業邏輯定義的位置，`action` 可以是同步也可以是異步的，因此，我們也能在 `action` 中打後端 API 來取得資料後更新狀態。
    ```js
    import { defineStore } from 'pinia'

    export const useUserStore = defineStore('user', {
      state: () => ({
        profile: {
          name: '',
          gender: '',
          email: ''
        }
      }),
      actions: {
        async getUserProfile() {
          try {
            const { data } = await useFetch('/api/profile')
            this.profile = data
          } catch (error) {
            return error
          }
        }
      }
    })
    ```

  - ### Store 的解構
    有些情況，你可能需要將 `Store` 中的屬性或方法獨立的提取出來，但為了保持屬性的響應性，你需要使用 `storeToRefs` 來建立屬性的參考，就像使用 `toRefs` 來建立 `props` 的參考一樣。
    ```js
    import { storeToRefs } from 'pinia'
    import { useCounterStore } from '@/stores/counter'

    const counterStore = useCounterStore()

    const { count } = storeToRefs(counterStore)
    const { increment, decrement } = counterStore
    ```

## Pinia 持久化插件 - Pinia Plugin Persistedstate
  `Pinia` 是個非常輕量的狀態管理解決方案，而且也提供底層 API 使得 `Pinia` 能夠自定義插件來擴展功能，舉例來說，我們有些狀態需要儲存在使用者瀏覽器中，下次再瀏覽時可以取的當時儲存的狀態資料，我們就需要將 `store` 的狀態持久化。

  我們可以使用 [Pinia Plugin Persistedstate](https://www.npmjs.com/package/@pinia-plugin-persistedstate/nuxt) 這個插件，來做到持久化這件事，這對於儲存使用者資訊或登入狀態非常的方便。

  - ### 在 Nuxt 3 中配置使用 Pinia Plugin Persistedstate
    - #### Step 1. 安裝套件
      ```sh
      npm install -D @pinia-plugin-persistedstate/nuxt --force
      ```
      > 目前照著官方安裝 `Pinia`，會發生一些問題，所以我們在安裝時加上 `--force` 參數

    - #### Step 2. 在 Nuxt 3 為 Pinia 添加 Persist 模組
      添加 `@pinia-plugin-persistedstate/nuxt` 至 `nuxt.config.ts` 的 `modules` 屬性中。
      ```js
      export default defineNuxtConfig({
        modules: ['@pinia/nuxt', @pinia-plugin-persistedstate/nuxt]
      })
      ```

    - #### Step 3. 為你的 Store 添加持久化配置
      在現有的 `store` 定義中添加，`persist` 屬性，來配置 `store` 持久化，將狀態儲存在瀏覽器的 `localStorage`。
      ```js
      import { defineStore } from 'pinia'

      export const useCounterStore = defineStore('counter', {
        state: () => ({
          count: 0
        }),
        actions: {
          increment() {
            this.count += 1
          },
          decrement() {
            this.count -= 1
          }
        },
        getters: {
          doubleCount: (state) => state.count * 2
        },
        persist: {
          key: 'counter',
          storage: persistedState.localStorage
        }
      })
      ```

      如果是使用 `setup` 函數定義 `store`，你可以在 `defineStore` 傳入第三個參數並添加 `persist` 屬性。
      ```js
      import { defineStore } from 'pinia'

      export const useCounterStore = defineStore(
        'counter',
        () => {
          const count = useState('count', () => 0)

          const increment = () => {
            count.value += 1
          }
          const decrement = () => {
            count.value -= 1
          }

          const doubleCount = computed(() => count.value * 2)

          return {
            count,
            increment,
            decrement,
            doubleCount
          }
        },
        {
          persist: {
            key: 'counter',
            storage: persistedState.localStorage
          }
        }
      )
      ```

    - #### Step 4. 持久化效果
      當我們設置好 `counterStore` 的持久化後，我們的狀態就會被儲存在瀏覽器的 `localStorage` 之中，就算關閉瀏覽器或重新整理網頁，`store` 的狀態都會再從 `localStorage` 讀取出來。

      ![nuxt3_17_04](./imgs/17/nuxt3_17_04.gif)

## 小結
  在小型的專案中，你可以使用 `useState` 來管理，但大專案你就需要一個更好的方式來管理這些狀態，如 `Pinia` 來為我們管理這些狀態，甚至定義多個 `store`，`Pinia` 支援的插件能協助我們擴展 `Pinia` 的功能，`Pinia Plugin Persistedstate` 就是一個很常用的插件，能協助我們將 `Pinia` 的狀態持久化至瀏覽器的 `localStorage` 或 `sessionStorage` 中。