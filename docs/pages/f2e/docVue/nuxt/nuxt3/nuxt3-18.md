---
title: Nuxt3 學習筆記 - Ryan
---

# 18. Runtime Config & App Config
## 前言
  - 在開發過程中，經常需要依據不同環境（如開發環境、生產環境）調整配置資訊（如 API 地址、金鑰、分頁數量等）。

  - 這些配置若直接寫死在程式碼中會難以維護，`Nuxt 3` 提供了 `Runtime Config` 與 `App Config` 兩種方式來管理這些配置。

## Runtime Config
  - ### 主要用途
    用於將 `環境變數` 或 `私密資訊` 公開給應用程式，支援在伺服器端與客戶端存取。

  - ### 安全性
    可以在 `runtimeConfig` 中區分「`私有`」與「`公共`」配置。私有的配置僅能在伺服器端存取，適合存放 `API Secret Key` 等敏感資訊。

## 配置 `runtimeConfig`
  - ### 在 `nuxt.config.ts` 中使用 `runtimeConfig` 屬性定義：
    - #### 私有配置
      直接定義在 `runtimeConfig` 下（例如 `apiSecret`）。
      ```ts
      export default defineNuxtConfig({
        runtimeConfig: {
          apiSecret: '怎麼可以讓你知道呢 :P'
        }
      })
      ```
    - #### 公共配置
      定義在 `public` 物件內（例如 `apiBase`）。
      ```ts
      export default defineNuxtConfig({
        runtimeConfig: {
          apiSecret: '怎麼可以讓你知道呢 :P',
          public: {
            apiBase: '/api'
          }
        }
      })
      ```

  - ### 環境變數覆蓋
    可以在專案根目錄建立 `.env` 檔案，使用 `NUXT_` 前綴加變數名稱（大寫並以底線分隔）來覆蓋 `nuxt.config.ts` 中的設定。
    ```txt
    NUXT_API_SECRET=api_secret_token
    NUXT_PUBLIC_API_BASE=https://nuxtjs.org
    ```

    `NUXT_API_SECRET` 環境變數，將會覆蓋 `runtimeConfig.apiSecret`，而 `NUXT_PUBLIC_API_BASE` 將會覆蓋 `runtimeConfig.public.apiBase`

## 使用 Runtime Config
  - 透過 `useRuntimeConfig()` 組合式函數來存取配置：
    ```ts
    const config = useRuntimeConfig()
    console.log(config.apiSecret) // 僅伺服器端有值
    console.log(config.public.apiBase) // 伺服器與客戶端皆可存取
    ```

## App Config
  - ### 主要用途
    存放不具敏感性且需要在建置時確定的配置，例如網站標題、佈景主題顏色、選單配置等。
  - ### 特性
    不支援在執行時透過環境變數覆蓋，但支援 `HMR`（熱更新），修改後不需重啟伺服器即可生效。

## 配置 `appConfig`
  例如，通常我們會添加像網站主題的主色等這類可以公開的配置，讓網站可以使用這個設置。
  - ### 方法一
    在 `nuxt.config.ts` 檔案中，可以在 `appConfig` 屬性內添加設置，
    ```ts
    export default defineNuxtConfig({
      appConfig: {
        theme: {
          primaryColor: '#0ea5e9'
        }
      }
    })
    ```
  - ### 方法二
    在專案根目錄建立 `app.config.ts` 檔案：
    ```ts
    export default defineAppConfig({
      theme: {
        primaryColor: '#ababab'
      }
    })
    ```
    > 若具有相同設置，則以 `app.config.ts` 檔案內的設置為主。

## 使用 App Config
  - 透過 `useAppConfig()` 組合式函數來存取配置：
    ```ts
    const appConfig = useAppConfig()
    console.log(appConfig.theme.primaryColor)
    ```

## Runtime Config vs App Config
  文章整理了兩者的主要差異點：

  | 特性             | Runtime Config                | App Config                    |
  |:----------------|:------------------------------|:------------------------------|
  | **私密資訊**     | 支援（透過非 public 屬性）      | 不支援（內容會暴露在前端）      |
  | **環境變數覆蓋**  | 支援（透過 `.env`）            | 不支援                        |
  | **存取範圍**     | 伺服器端 & 客戶端             | 伺服器端 & 客戶端             |
  | **類型定義**     | 自動生成                      | 自動生成                      |
  | **主要場景**     | API 地址、環境變數、Secret Keys | UI 佈景主題、網站標題、靜態配置 |


## 補充：使用環境變數的建議
  - 在開發測試階段，強烈建議搭配 `.env` 檔案來管理不同環境的 `runtimeConfig`。
  - 務必將 `.env` 加入 `.gitignore`，避免私密金鑰被推送到版本控制系統（如 `GitHub`）。

## 小結
  - `Runtime Config`： 適合處理需要安全性、或需要根據部署環境動態調整的變數。
  - `App Config`： 適合處理純前端的 UI 配置、佈景主題等不具敏感性的靜態設定。
  - `Nuxt 3` 透過這兩者將配置與程式邏輯分離，讓應用程式更具彈性且易於維護。