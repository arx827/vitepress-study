---
title: '[Next.js官網] Next.js 16.2 教程'
---

# 擷取資料
  - 現在你已經建立並植入資料到資料庫中，讓我們來討論為應用程式擷取資料的各種不同方式，並繼續建構儀表板總覽頁面。

  :::info **本章內容**
  以下是本章將涵蓋的主題：
  - 認識幾種擷取資料的方式：`API`、`ORM`、`SQL` 等等。
  - `Server Components` 如何幫助你更安全地存取後端資源。
  - 什麼是網路瀑布流（`network waterfalls`）。
  - 如何使用 `JavaScript` 模式實作平行資料擷取（`parallel data fetching`）。
  :::

## 選擇如何擷取資料
### API 層
  - `API` 是應用程式程式碼與資料庫之間的中介層。在以下幾種情況下，你可能會用到 `API`：
    - 當你使用提供 `API` 的第三方服務時。
    - 當你要從用戶端（`client`）擷取資料時，你會希望有一個運行在伺服器端的 `API` 層，避免將資料庫的機密資料暴露給用戶端。

  - 在 `Next.js` 中，你可以使用 [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) 來建立 `API` 端點。

### 資料庫查詢
  - 當你在建構一個全端應用程式時，你也需要撰寫與資料庫互動的邏輯。對於像 `Postgres` 這類 [關聯式資料庫](https://aws.amazon.com/relational-database/)，你可以使用 `SQL` 或是 [ORM](https://vercel.com/docs/storage/vercel-postgres/using-an-orm) 來完成這項工作。

  - 在以下幾種情況下，你必須撰寫資料庫查詢：
    - 當你在建立 `API` 端點時，你需要撰寫邏輯來與資料庫互動。
    - 如果你使用 `React Server Components`（在伺服器端擷取資料），你可以跳過 `API` 層，直接查詢資料庫，而不會有暴露資料庫機密資料給用戶端的風險。

  - 讓我們進一步認識 `React Server Components`。

### 使用 Server Components 擷取資料
  - 在預設情況下，`Next.js` 應用程式會使用 `React Server Components`。使用 `Server Components` 擷取資料是一種相對較新的做法，具有以下幾項優點：
    - `Server Components` 原生支援 `JavaScript Promises`，為資料擷取這類非同步任務提供了解決方案。你可以直接使用 `async/await` 語法，不需要 `useEffect`、`useState` 或其他資料擷取函式庫。
    
    - `Server Components` 運行在伺服器端，因此你可以將成本較高的資料擷取與邏輯保留在伺服器端，只將結果傳送給用戶端。
    
    - 由於 `Server Components` 運行在伺服器端，你可以直接查詢資料庫，而不需要額外的 `API` 層。這可以省去你撰寫並維護額外程式碼的工夫。

### 使用 SQL
  - 在你的儀表板應用程式中，你將使用 [postgres.js](https://github.com/porsager/postgres) 函式庫搭配 `SQL` 撰寫資料庫查詢。我們選擇使用 `SQL` 有以下幾個原因：
    - `SQL` 是查詢關聯式資料庫的業界標準（舉例來說，`ORM` 底層其實也是產生 `SQL`）。
    
    - 具備基本的 `SQL` 概念，有助於你理解關聯式資料庫的基礎原理，讓你能將這些知識應用到其他工具上。
    
    - `SQL` 相當靈活，讓你可以擷取並操作特定的資料。
    
    - `postgres.js` 函式庫提供了防範 [SQL 注入攻擊（SQL injections）](https://github.com/porsager/postgres?tab=readme-ov-file#query-parameters) 的保護機制。

  - 如果你先前沒有使用過 `SQL` 也不用擔心，我們已經幫你把所有需要的查詢寫好了。

  - 前往 `/app/lib/data.ts`，在這裡你會看到我們使用了 `postgres`。這個 `sql`[函式](https://github.com/porsager/postgres) 讓你可以查詢資料庫：

    ```ts
    // /app/lib/data.ts

    import postgres from 'postgres';

    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    // ...
    ```

  - 你可以在伺服器端的任何地方呼叫 `sql`，例如在 `Server Component` 中。但為了讓你能更輕鬆地在各個元件之間切換，我們把所有的資料查詢都統一放在 `data.ts` 檔案中，你可以將它們匯入到各個元件中使用。

    > **注意：** 如果你在第六章使用的是自己的資料庫供應商，你需要修改資料庫查詢，以配合你的供應商。你可以在 `/app/lib/data.ts` 中找到這些查詢。

## 為儀表板總覽頁面擷取資料
  - 現在你已經了解幾種不同的資料擷取方式，讓我們為儀表板總覽頁面擷取資料。前往 `/app/dashboard/page.tsx`，貼上以下程式碼，並花點時間仔細研究一下：

    ```tsx
    // /app/dashboard/page.tsx

    import { Card } from '@/app/ui/dashboard/cards';
    import RevenueChart from '@/app/ui/dashboard/revenue-chart';
    import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
    import { lusitana } from '@/app/ui/fonts';

    export default async function Page() {
      return (
        <main>
          <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Dashboard
          </h1>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* <Card title="Collected" value={totalPaidInvoices} type="collected" /> /}
            {/ <Card title="Pending" value={totalPendingInvoices} type="pending" /> /}
            {/ <Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> /}
            {/ <Card title="Total Customers" value={numberOfCustomers} type="customers" /> /}
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
            {/ <RevenueChart revenue={revenue} /> /}
            {/ <LatestInvoices latestInvoices={latestInvoices} /> */}
          </div>
        </main>
      );
    }
    ```

  - 上面這段程式碼中的內容故意先被註解起來。我們現在會逐一說明每個部分。

  - 這個 `page` 是一個 `非同步（async）`的 `server component`，這讓你可以使用 `await` 來擷取資料。

  - 另外還有 3 個會接收資料的元件：`<Card>`、`<RevenueChart>` 與 `<LatestInvoices>`。它們目前都被註解起來，尚未實作。

## 為 `<RevenueChart/>` 擷取資料
  - 要為 `<RevenueChart/>` 元件擷取資料，請從 `data.ts` 匯入 `fetchRevenue` 函式，並在你的元件中呼叫它：

    ```tsx {7,10}
    // /app/dashboard/page.tsx

    import { Card } from '@/app/ui/dashboard/cards';
    import RevenueChart from '@/app/ui/dashboard/revenue-chart';
    import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
    import { lusitana } from '@/app/ui/fonts';
    import { fetchRevenue } from '@/app/lib/data';

    export default async function Page() {
      const revenue = await fetchRevenue();
      // ...
    }
    ```

  - 接著，讓我們進行以下步驟：
    1. 取消 `<RevenueChart/>` 元件的註解。
    2. 前往元件檔案（`/app/ui/dashboard/revenue-chart.tsx`），並取消其中程式碼的註解。
    3. 檢查 `localhost:3000/dashboard`，你應該會看到一個使用 `revenue` 資料呈現的圖表。

    ![顯示過去 12 個月總營收的營收圖表](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_07_01.avif)

  - 讓我們繼續匯入更多資料，並將其顯示在儀表板上。

## 為 `<LatestInvoices/>` 擷取資料
  - 對於 `<LatestInvoices />` 元件，我們需要取得最新的 `5` 筆發票資料，並依日期排序。

  - 你可以擷取所有發票資料，再用 `JavaScript` 進行排序。由於我們的資料量不大，這樣做並不會有問題，但隨著應用程式規模擴大，這種做法可能會大幅增加每次請求所傳輸的資料量，以及排序所需的 `JavaScript` 運算量。

  - 與其在記憶體中排序最新的發票資料，你可以改用 `SQL` 查詢，只擷取最後 `5` 筆發票資料。舉例來說，以下是 `data.ts` 檔案中的 `SQL` 查詢：

    ```ts
    // /app/lib/data.ts

    // Fetch the last 5 invoices, sorted by date
    const data = await sql<LatestInvoiceRaw[]>   SELECT invoices.amount, customers.name, customers.image_url, customers.email   FROM invoices   JOIN customers ON invoices.customer_id = customers.id   ORDER BY invoices.date DESC   LIMIT 5;
    ```

  - 在你的頁面中，匯入 `fetchLatestInvoices` 函式：
    ```tsx {7,11}
    // /app/dashboard/page.tsx

    import { Card } from '@/app/ui/dashboard/cards';
    import RevenueChart from '@/app/ui/dashboard/revenue-chart';
    import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
    import { lusitana } from '@/app/ui/fonts';
    import { fetchRevenue, fetchLatestInvoices } from '@/app/lib/data';

    export default async function Page() {
    const revenue = await fetchRevenue();
    const latestInvoices = await fetchLatestInvoices();
    // ...
    }
    ```

  - 接著，取消 `<LatestInvoices />` 元件的註解。你同時也需要取消 `<LatestInvoices />` 元件本身（位於 `/app/ui/dashboard/latest-invoices`）中相關程式碼的註解。

  - 如果你造訪本機伺服器（`localhost`），應該會看到資料庫只回傳了最後 `5` 筆資料。希望你已經開始感受到直接查詢資料庫的好處！

    ![最新發票元件與營收圖表並列顯示](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_07_02.avif)

## 練習：為 `<Card>` 元件擷取資料
  - 現在輪到你為 `<Card>` 元件擷取資料了。這些卡片將會顯示以下資料：
    - 已收款發票的總金額。
    - 待收款發票的總金額。
    - 發票總數。
    - 客戶總數。

  - 同樣地，你可能會想擷取所有的發票與客戶資料，再用 `JavaScript` 來處理這些資料。舉例來說，你可以使用 `Array.length` 來取得發票與客戶的總數：

    ```ts
    const totalInvoices = allInvoices.length;
    const totalCustomers = allCustomers.length;
    ```

  - 但透過 `SQL`，你可以只擷取你需要的資料。雖然寫法比使用 `Array.length` 稍微長一些，但這代表在請求過程中需要傳輸的資料量會比較少。以下是使用 `SQL` 的替代寫法：

    ```ts
    // /app/lib/data.ts

    const invoiceCountPromise = sqlSELECT COUNT(*) FROM invoices;
    const customerCountPromise = sqlSELECT COUNT(*) FROM customers;
    ```

  - 你需要匯入的函式名稱是 `fetchCardData`。你需要將這個函式回傳的值進行解構（`destructure`）。

    > **提示：**
    >
    > - 檢查卡片元件，看看它們需要哪些資料。
    > - 檢查 `data.ts` 檔案，看看這個函式回傳了什麼內容。

    ```tsx {10,16-21,29-36}
    // /app/dashboard/page.tsx

    import { Card } from '@/app/ui/dashboard/cards';
    import RevenueChart from '@/app/ui/dashboard/revenue-chart';
    import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
    import { lusitana } from '@/app/ui/fonts';
    import {
      fetchRevenue,
      fetchLatestInvoices,
      fetchCardData,
    } from '@/app/lib/data';
    
    export default async function Page() {
      const revenue = await fetchRevenue();
      const latestInvoices = await fetchLatestInvoices();
      const {
        numberOfInvoices,
        numberOfCustomers,
        totalPaidInvoices,
        totalPendingInvoices,
      } = await fetchCardData();
    
      return (
        <main>
          <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
            Dashboard
          </h1>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card title="Collected" value={totalPaidInvoices} type="collected" />
            <Card title="Pending" value={totalPendingInvoices} type="pending" />
            <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
            <Card
              title="Total Customers"
              value={numberOfCustomers}
              type="customers"
            />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
            <RevenueChart revenue={revenue} />
            <LatestInvoices latestInvoices={latestInvoices} />
          </div>
        </main>
      );
    }
    ```

  - 太好了！你現在已經為儀表板總覽頁面擷取了所有需要的資料。你的頁面應該會像這樣：

    ![已擷取所有資料的儀表板頁面](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_07_03.avif)

  - 然而……有兩件事你需要特別留意：
    1. 這些資料請求無意間彼此阻塞，形成了一個 `請求瀑布流（request waterfall）`。
    2. 在預設情況下，`Next.js` 會 `預先渲染（prerender）` 路由以提升效能，這種方式稱為 `靜態渲染（Static Rendering）`。因此如果你的資料發生變化，儀表板上並不會即時反映出來。

  - 我們會在本章討論第 1 點，並在下一章詳細探討第 2 點。

## 什麼是請求瀑布流（request waterfalls）
  - 「`瀑布流（waterfall）`」指的是一連串網路請求，這些請求彼此之間存在相依關係，必須等前一個請求完成後才能繼續。以資料擷取來說，每個請求都必須等到前一個請求回傳資料後，才能開始執行。

    ![圖表顯示循序資料擷取與平行資料擷取所需的時間比較](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_07_04.avif)

  - 舉例來說，我們必須等 `fetchRevenue()` 執行完畢，`fetchLatestInvoices()` 才能開始執行，依此類推。

    ```tsx
    // /app/dashboard/page.tsx

    const revenue = await fetchRevenue();
    const latestInvoices = await fetchLatestInvoices(); // wait for fetchRevenue() to finish
    const {
      numberOfInvoices,
      numberOfCustomers,
      totalPaidInvoices,
      totalPendingInvoices,
    } = await fetchCardData(); // wait for fetchLatestInvoices() to finish
    ```

  - 這種模式不一定是壞事。有些情況下你會希望出現瀑布流，因為你需要先滿足某個條件，才能發出下一個請求。舉例來說，你可能會想先擷取使用者的 `ID` 與個人資料，等取得 `ID` 之後，才接著擷取這位使用者的好友清單。在這種情況下，每個請求都會取決於前一個請求所回傳的資料。

  - 然而，這種行為有時也可能是無意間發生的，並因此影響效能。

## 平行資料擷取（Parallel data fetching）
  - 要避免瀑布流，一個常見的做法是同時發起所有的資料請求 —— 也就是以平行的方式進行。

  - 在 `JavaScript` 中，你可以使用 [`Promise.all()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) 或 [`Promise.allSettled()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) 函式，同時發起所有的 `promise`。舉例來說，在 `data.ts` 中，我們在 `fetchCardData()` 函式裡使用了 `Promise.all()`：

    ```ts {12-16}
    // /app/lib/data.ts

    export async function fetchCardData() {
      try {
        const invoiceCountPromise = sqlSELECT COUNT(*) FROM invoices;
        const customerCountPromise = sqlSELECT COUNT(*) FROM customers;
        const invoiceStatusPromise = sqlSELECT
            SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
            SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
            FROM invoices;

        const data = await Promise.all([
          invoiceCountPromise,
          customerCountPromise,
          invoiceStatusPromise,
        ]);
        // ...

      }
    }
    ```

  - 透過使用這種模式，你可以：
    - 同時開始執行所有的資料擷取，這比在瀑布流中逐一等待每個請求完成要來得快。
    - 使用一種原生的 `JavaScript` 模式，這種模式可以套用在任何函式庫或框架上。

  - 然而，只依賴這種 `JavaScript` 模式也有一個 `缺點`：如果其中一個資料請求比其他請求都還要慢，會發生什麼事呢？讓我們在下一章進一步了解。