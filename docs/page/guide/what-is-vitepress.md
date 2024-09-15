---
title: Vitepress 介紹
---

# 什麼是 VitePress？
  :::warning ! 警告
  VitePress 是早期的WIP！目前的重點首先是讓Vite 穩定和功能完善。目前，不建議將其用於任何正式的場景。
  :::

  VitePress 是 [VuePress](https://www.vuepress.cn/) 小兄弟, 基於 [Vite](https://github.com/vitejs/vite) 構建。

  - ## Motivation
    我們喜愛 `VuePress`，但是它是基於 Webpack 構建。為了一個只有幾個簡單頁面的簡單文件網站啟動開發伺服器所需的時間正變得難以忍受。即使是 `HMR` 熱更新也需要幾秒鐘的時間才能在瀏覽器中顯示出來。

    作為參考，[Composition API RFC repo](https://github.com/vuejs/composition-api-rfc) 僅只有兩個頁面，但是它花了 4 秒鐘來啟動伺服器，並且任何修改都需要將近 2 秒的時間才能在瀏覽器中顯示出來。

    從根本上來說，這是因為 VuePress 是 webpack 的一個應用程式。即使只有兩頁，這也是一個完整的 webpack 專案(包括所有的主題原始檔)正在編譯。當專案有很多頁面時，情況會變得更糟：每個頁面都必須先完全編譯，然後伺服器才能顯示內容！

    順便說一句，Vite 很好地解決了這些問題：幾乎立即啟動伺服器，只按需編譯正在服務的頁面，以及閃電般的快速hmr。另外，隨著時間的推移，我在 `VuePress` 中注意到了一些額外的設計問題，但由於重構的數量，我從來沒有時間去修復它。

    現在，使用 Vite 和 Vue 3，是時候重新考慮「Vue 驅動的靜態站點產生器」到底能是什麼了。

  - ## 對 VuePress 的改進
    從VuePress 改進的地方有以下幾點：

    - ### 使用Vue 3
      利用Vue 3 改進的模板靜態分析，它能盡可能的壓縮靜態內容。靜態內容是以字串的形式傳送，而不是透過 JavaScript 渲染函數程式碼。因此 JS 負載更容易解析，hydration 也變得更快。

      主要，在優化應用的同時，VitePress 仍然允許用戶在Markdown 內容中自由的混合 Vue 元件。編譯器將自動的為你分離動態/靜態內容，你不需要考慮這個。

    - ### It Uses Vite Under The Hood
      - 開發伺服器啟動更快
      - 熱更新更快
      - 建置更快(內部使用Rollup)
    - ### Lighter Page Weight
      - Vue 3 tree-shaking + Rollup code splitting
      - 不為每個請求發送元資料。這些Page Weight 將從總頁數中分離出來。每次請求只發送目前頁面的元資料。客戶端導覽列會一起取得新頁面的元件和元資料。
      - 不要使用 vue-router，因為VitePress 的需求非常簡單和具體，使用了一個簡單的自訂路由器(小於200 LOC)替代。
      - (WIP) i18n locale 資料也是按需取得。

  - ## 其他不同
    VitePress 更多的是主觀性的並且配置很少：VitePress 的目標是減少當前VuePress 的複雜性，並回歸到它的簡約主義根源。

    VitePress 是面向未來的：VitePress 僅適用於支援原生ES 模組導入的瀏覽器，鼓勵使用沒有經過轉換的原生JavaScript 以及主題化中使用CSS 變數。

  - ## 這會成為未來的下一個VuePress 嗎？
    可能不是。它目前以不同的名稱命名，這樣我們就不會過度地致力於與當前VuePress 生態系統(主要是主題和外掛)的兼容性。我們將看到，在不損害上面列出的設計目標的情況下，我們可以取得多大的進展。但是總的想法是VitePress 將有一個非常小的主題API(更傾向於JavaScript API 而不是文件佈局約定)，而且很可能沒有插件(所有定制都是在主題中完成)。