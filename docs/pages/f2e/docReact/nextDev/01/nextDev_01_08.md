---
title: '[Next.js官網] Next.js 16.2 教程'
---

# 靜態與動態渲染
  - 在上一章中，你為儀表板總覽頁面擷取了資料。然而，我們也簡短提到目前設定存在兩項限制：
    1. 這些資料請求無意間形成了一個瀑布流（`waterfall`）。
    2. 儀表板目前是靜態的，因此任何資料更新都不會反映在應用程式上。

  :::info **本章內容**
  以下是本章將涵蓋的主題：
  - 什麼是 `靜態渲染`，以及它如何提升應用程式的效能。
  - 什麼是 `動態渲染`，以及何時該使用它。
  - 讓儀表板變成動態的幾種不同做法。
  - 模擬一次緩慢的資料擷取，看看會發生什麼事。
  :::

## 什麼是靜態渲染（Static Rendering）？
  - 在靜態渲染中，資料擷取與渲染會在伺服器端於建構階段（`build time`，也就是你部署應用程式時）進行，或是在 [重新驗證資料](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#revalidating-data) 時進行。

  - 每當使用者造訪你的應用程式時，系統會提供已快取的結果。靜態渲染有以下幾項優點：
    - **網站速度更快**：預先渲染的內容可以被快取，並在部署到像 [Vercel](https://vercel.com/) 這類平台時進行全球分發。這能確保世界各地的使用者都能更快速、更穩定地存取你網站的內容。
    - **降低伺服器負載**：由於內容已經被快取，你的伺服器不需要針對每次使用者請求都動態產生內容，這可以降低運算成本。
    - **有利於 SEO**：預先渲染的內容更容易被搜尋引擎的爬蟲索引，因為頁面載入時內容就已經存在。這有助於提升搜尋引擎排名。

  - 靜態渲染適合用於 `沒有資料` 或 `資料在使用者之間共用` 的 UI，例如一篇靜態的部落格文章或商品頁面。但對於擁有需要經常更新的個人化資料的儀表板來說，可能就不太適合。

  - 靜態渲染的相反，就是動態渲染。

## 什麼是動態渲染（Dynamic Rendering）？
  - 在動態渲染中，內容會在 **請求時（`request time`）**（也就是使用者造訪頁面時）針對每位使用者在伺服器端進行渲染。動態渲染有以下幾項優點：
    - **即時資料**：動態渲染讓你的應用程式能夠顯示即時或頻繁更新的資料，非常適合資料經常變動的應用程式。
    - **使用者專屬內容**：更容易提供個人化的內容，例如儀表板或使用者個人資料，並根據使用者的互動更新資料。
    - **請求時的資訊**：動態渲染讓你能夠存取只有在請求時才能得知的資訊，例如 `cookies` 或 `URL` 搜尋參數。

## 模擬一次緩慢的資料擷取
  - 我們正在建構的這個儀表板應用程式屬於動態渲染。

  - 然而，上一章提到的問題仍然存在：如果其中一個資料請求比其他請求都還要慢，會發生什麼事呢？

  - 讓我們來模擬一次緩慢的資料擷取。在 `app/lib/data.ts` 中，取消 `fetchRevenue()` 函式內 `console.log` 與 `setTimeout` 的註解：

    ```ts {7-8,12}
    // /app/lib/data.ts

    export async function fetchRevenue() {
      try {
        // We artificially delay a response for demo purposes.
        // Don't do this in production :)
        console.log('Fetching revenue data...');
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const data = await sql<Revenue[]>`SELECT * FROM revenue`;

        console.log('Data fetch completed after 3 seconds.');

        return data;

      } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch revenue data.');
      }
    }
    ```

  - 現在，在新的分頁中開啟 `http://localhost:3000/dashboard/`，你會注意到頁面需要花更久的時間才能載入完成。在你的終端機中，你應該也會看到以下訊息：

    ```sh
    Fetching revenue data...
    Data fetch completed after 3 seconds.
    ```

  - 在這裡，你加入了一個人為的 3 秒延遲，用來模擬一次緩慢的資料擷取。結果就是：在資料被擷取完成之前，整個頁面都會被阻塞，無法顯示任何畫面給訪客。這也帶出了開發者經常需要面對的一個共同挑戰：

  - 在動態渲染中，**你的應用程式速度，取決於最慢的那個資料擷取請求。**