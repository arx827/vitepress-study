---
title: '[Next.js官網] Next.js 16.2 教程'
---

# 串流
  - 在上一章中，你學到了 `Next.js` 中不同的渲染方式。我們也討論了緩慢的資料擷取會如何影響應用程式的效能。讓我們來看看，當出現緩慢的資料請求時，你可以如何提升使用者的體驗。

  :::info **本章內容**
  以下是本章將涵蓋的主題：
  - 什麼是 `串流（streaming）`，以及何時該使用它。
  - 如何使用 `loading.tsx` 與 `Suspense` 實作串流。
  - 什麼是 `載入骨架（loading skeletons）`。
  - 什麼是 `Next.js` 的 `路由群組（Route Groups）`，以及何時該使用它。
  - 該將 `React Suspense` 邊界（`boundaries`）放置在應用程式的哪些位置。
  :::

## 什麼是串流（streaming）？
  - 串流是一種資料傳輸技術，讓你可以將一個路由拆解成較小的 `「區塊（chunks）」`，並在這些區塊準備就緒時，逐步從伺服器串流傳送到用戶端。

    ![圖表顯示循序資料擷取與平行資料擷取所需的時間](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_09_01.avif)

  - 透過串流，你可以避免緩慢的資料請求阻塞整個頁面。這讓使用者可以看到並與頁面的部分內容進行互動，而不需要等待所有資料都載入完成後，畫面才顯示給使用者。

    ![圖表顯示循序資料擷取與平行資料擷取所需的時間](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_09_02.avif)

  - 串流與 `React` 的元件模型搭配得很好，因為每個元件都可以被視為一個「區塊」。

  - 在 `Next.js` 中，有兩種方式可以實作串流：
    1. 在頁面層級，使用 `loading.tsx` 檔案（它會自動為你建立 `<Suspense>`）。
    2. 在元件層級，使用 `<Suspense>` 來取得更細緻的控制。

  - 讓我們來看看它是如何運作的。

## 使用 `loading.tsx` 為整個頁面加入串流
  - 在 `/app/dashboard` 資料夾中，建立一個名為 `loading.tsx` 的新檔案：
    ```tsx
    // /app/dashboard/loading.tsx

    export default function Loading() {
      return <div>Loading...</div>;
    }
    ```
  
  - 重新整理 `http://localhost:3000/dashboard`，你現在應該會看到：

    ![顯示「Loading…」文字的儀表板頁面](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_09_03.avif)

  - 這裡發生了幾件事：
    1. `loading.tsx` 是建立在 `React Suspense` 之上的一個 `Next.js` 特殊檔案。它讓你可以建立一個備援（`fallback`）UI，在頁面內容載入時，先顯示這個 UI 作為替代畫面。

    2. 由於 `<SideNav>` 是靜態的，它會立即顯示出來。使用者可以在動態內容仍在載入時，先與 `<SideNav>` 進行互動。

    3. 使用者不需要等待頁面完全載入完成才能離開頁面（這稱為可中斷導覽，`interruptable navigation`）。

  - 恭喜！你剛剛已經實作了串流功能。不過我們還可以做更多，來提升使用者的體驗。讓我們把 `「Loading…」`文字換成一個載入骨架（loading skeleton）畫面。

### 加入載入骨架（loading skeletons）
  - 載入骨架是 UI 的簡化版本。許多網站會用它作為 `佔位畫面`（`placeholder`，或稱備援畫面），向使用者表示內容正在載入中。你在 `loading.tsx` 中加入的任何 UI，都會被內嵌成靜態檔案的一部分，並最先被傳送出去。接著，其餘的動態內容才會從伺服器串流傳送到用戶端。

  - 在你的 `loading.tsx` 檔案中，匯入一個名為 `<DashboardSkeleton>` 的新元件：

    ```tsx
    // /app/dashboard/loading.tsx

    import DashboardSkeleton from '@/app/ui/skeletons';

    export default function Loading() {
      return <DashboardSkeleton />;
    }
    ```

  - 接著，重新整理 `http://localhost:3000/dashboard`，你現在應該會看到：
    ![帶有載入骨架畫面的儀表板頁面](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_09_04.avif)

### 使用路由群組（route groups）修正載入骨架的問題
  - 目前，你的載入骨架也會套用到發票（`invoices`）頁面。

  - 由於 `loading.tsx` 在檔案系統中的層級比 `/invoices/page.tsx` 與 `/customers/page.tsx` 高一層，因此它也會套用到這些頁面。

  - 我們可以透過 [路由群組（Route Groups）](https://nextjs.org/docs/app/building-your-application/routing/route-groups) 來改變這個情況。在 `dashboard` 資料夾內建立一個名為 `/(overview)` 的新資料夾。接著，將你的 `loading.tsx` 與 `page.tsx` 檔案移到這個資料夾中：

    ![資料夾結構圖，顯示如何使用括號建立路由群組](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_09_05.avif)

  - 現在，`loading.tsx` 檔案就只會套用到你的儀表板總覽頁面。

  - 路由群組讓你可以將檔案組織成邏輯上的群組，而不會影響 `URL` 路徑的結構。當你使用括號 `()` 建立新資料夾時，資料夾名稱並不會被包含在 `URL` 路徑之中。因此，`/dashboard/(overview)/page.tsx` 會對應到 `/dashboard`。

  - 在這裡，你使用了路由群組，確保 `loading.tsx` 只套用到你的儀表板總覽頁面。不過，你也可以使用路由群組，將應用程式劃分成不同的區塊（例如 `(marketing)` 路由與 `(shop)` 路由），或者在較大型的應用程式中依團隊進行劃分。

### 為單一元件加入串流
  - 到目前為止，你已經為整個頁面加入了串流功能。不過，你也可以更細緻地使用 `React Suspense`，針對特定元件加入串流。

  - `Suspense` 讓你可以延遲渲染應用程式中的某些部分，直到符合某個條件為止（例如資料已經載入完成）。你可以將動態元件包裹在 `Suspense` 中，並傳入一個備援元件，在動態元件載入時顯示。

  - 還記得那個緩慢的資料請求 `fetchRevenue()` 嗎？正是這個請求拖慢了整個頁面。與其讓它阻塞整個頁面，你可以使用 `Suspense`，只針對這個元件進行串流，並立即顯示頁面其餘部分的 UI。

  - 要做到這一點，你需要把資料擷取邏輯移到元件內。讓我們更新程式碼，看看實際會是什麼樣子：

  - 從 `/dashboard/(overview)/page.tsx` 中刪除所有 `fetchRevenue()` 及其相關資料：

    ```tsx {7,10}
    // /app/dashboard/(overview)/page.tsx

    import { Card } from '@/app/ui/dashboard/cards';
    import RevenueChart from '@/app/ui/dashboard/revenue-chart';
    import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
    import { lusitana } from '@/app/ui/fonts';
    import { fetchLatestInvoices, fetchCardData } from '@/app/lib/data'; // remove fetchRevenue

    export default async function Page() {
      const revenue = await fetchRevenue() // delete this line
      const latestInvoices = await fetchLatestInvoices();
      const {
        numberOfInvoices,
        numberOfCustomers,
        totalPaidInvoices,
        totalPendingInvoices,
      } = await fetchCardData();

      return (
        // ...
      );
    }
    ```

  - 接著，從 `React` 匯入 `<Suspense>`，並將它包裹在 `<RevenueChart />` 外層。你可以傳入一個名為 `<RevenueChartSkeleton>` 的備援元件。

    ```tsx {8-9,32-34}
    // /app/dashboard/(overview)/page.tsx

    import { Card } from '@/app/ui/dashboard/cards';
    import RevenueChart from '@/app/ui/dashboard/revenue-chart';
    import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
    import { lusitana } from '@/app/ui/fonts';
    import { fetchLatestInvoices, fetchCardData } from '@/app/lib/data';
    import { Suspense } from 'react';
    import { RevenueChartSkeleton } from '@/app/ui/skeletons';

    export default async function Page() {
      const latestInvoices = await fetchLatestInvoices();
      const {
        numberOfInvoices,
        numberOfCustomers,
        totalPaidInvoices,
        totalPendingInvoices,
      } = await fetchCardData();

      return (
        <main>
          <h1 className={${lusitana.className} mb-4 text-xl md:text-2xl}>
          Dashboard
          </h1>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card title="Collected" value={totalPaidInvoices} type="collected" />
            <Card title="Pending" value={totalPendingInvoices} type="pending" />
            <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
            <Card title="Total Customers" value={numberOfCustomers} type="customers" />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
            <Suspense fallback={<RevenueChartSkeleton />}>
              <RevenueChart />
            </Suspense>
            <LatestInvoices latestInvoices={latestInvoices} />
          </div>
        </main>
      );
    }
    ```

  - 最後，更新 `<RevenueChart>` 元件，讓它自行擷取資料，並移除傳入該元件的 `prop`：
    
    ```tsx {6,11}
    // /app/ui/dashboard/revenue-chart.tsx

    import { generateYAxis } from '@/app/lib/utils';
    import { CalendarIcon } from '@heroicons/react/24/outline';
    import { lusitana } from '@/app/ui/fonts';
    import { fetchRevenue } from '@/app/lib/data';

    // ...

    export default async function RevenueChart() { // Make component async, remove the props
      const revenue = await fetchRevenue(); // Fetch data inside the component

      const chartHeight = 350;
      const { yAxisLabels, topLabel } = generateYAxis(revenue);

      if (!revenue || revenue.length === 0) {
        return <p className="mt-4 text-gray-400">No data available.</p>;
      }

      return (
        // ...
      );
    }
    ```

  - 現在重新整理頁面，你應該會看到儀表板的資訊幾乎立即顯示出來，而 `<RevenueChart>` 則會先顯示備援骨架畫面：

    ![儀表板頁面顯示營收圖表骨架，以及已載入完成的 Card 與 Latest Invoices 元件](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_09_06.avif)

### 練習：為 `<LatestInvoices>` 加入串流
  - 現在輪到你了！透過為 `<LatestInvoices>` 元件加入串流，練習你剛剛學到的內容。

  - 將 `fetchLatestInvoices()` 從頁面中移到 `<LatestInvoices>` 元件內。並使用 `<Suspense>` 邊界包裹該元件，備援元件名稱為 `<LatestInvoicesSkeleton>`。

    ```tsx {7,11,15,38-40}
    // /app/dashboard/(overview)/page.tsx

    import { Card } from '@/app/ui/dashboard/cards';
    import RevenueChart from '@/app/ui/dashboard/revenue-chart';
    import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
    import { lusitana } from '@/app/ui/fonts';
    import { fetchCardData } from '@/app/lib/data'; // Remove fetchLatestInvoices
    import { Suspense } from 'react';
    import {
      RevenueChartSkeleton,
      LatestInvoicesSkeleton,
    } from '@/app/ui/skeletons';

    export default async function Page() {
      // Remove `const latestInvoices = await fetchLatestInvoices()`
      const {
        numberOfInvoices,
        numberOfCustomers,
        totalPaidInvoices,
        totalPendingInvoices,
      } = await fetchCardData();

      return (
        <main>
          <h1 className={${lusitana.className} mb-4 text-xl md:text-2xl}>
          Dashboard
          </h1>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card title="Collected" value={totalPaidInvoices} type="collected" />
            <Card title="Pending" value={totalPendingInvoices} type="pending" />
            <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
            <Card title="Total Customers" value={numberOfCustomers} type="customers" />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
            <Suspense fallback={<RevenueChartSkeleton />}>
              <RevenueChart />
            </Suspense>
            <Suspense fallback={<LatestInvoicesSkeleton />}>
              <LatestInvoices />
            </Suspense>
          </div>
        </main>
      );
    }
    ```

    ```tsx {6,8-9}
    // /app/ui/dashboard/latest-invoices.tsx
    import { ArrowPathIcon } from '@heroicons/react/24/outline';
    import clsx from 'clsx';
    import Image from 'next/image';
    import { lusitana } from '@/app/ui/fonts';
    import { fetchLatestInvoices } from '@/app/lib/data';
    
    export default async function LatestInvoices() { // Remove props
      const latestInvoices = await fetchLatestInvoices();
    
      return (
        // ...
      );
    }
    ```

## 為元件分組
  - 太棒了！你已經快完成了，現在你需要用 `Suspense` 包裹 `<Card>` 元件。你可以針對每張卡片個別擷取資料，但這可能會導致卡片一個一個「彈出」的效果，對使用者來說在視覺上可能會有些突兀。

  - 那麼，該如何解決這個問題呢？

  - 為了創造出更「`錯落有致（staggered）`」的效果，你可以使用一個包裹元件（`wrapper component`），將卡片進行分組。這代表靜態的 `<SideNav/>` 會先顯示出來，接著才是卡片，依此類推。

  - 在你的 `page.tsx` 檔案中：
    1. 刪除你的 `<Card>` 元件。
    2. 刪除 `fetchCardData()` 函式。
    3. 匯入一個名為 `<CardWrapper />` 的新 **包裹（wrapper）** 元件。
    4. 匯入一個名為 `<CardsSkeleton />` 的新 **骨架（skeleton）** 元件。
    5. 用 `Suspense` 包裹 `<CardWrapper />`。

    ```tsx {3,8,18-20}
    // /app/dashboard/(overview)/page.tsx

    import CardWrapper from '@/app/ui/dashboard/cards';
    // ...
    import {
      RevenueChartSkeleton,
      LatestInvoicesSkeleton,
      CardsSkeleton,
    } from '@/app/ui/skeletons';

    export default async function Page() {
      return (
        <main>
          <h1 className={${lusitana.className} mb-4 text-xl md:text-2xl}>
          Dashboard
          </h1>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<CardsSkeleton />}>
              <CardWrapper />
            </Suspense>
          </div>
          // ...
        </main>
      );
    }
    ```

  - 接著，切換到 `/app/ui/dashboard/cards.tsx` 檔案，匯入 `fetchCardData()` 函式，並在 `<CardWrapper/>` 元件內呼叫它。請確認取消這個元件中所有必要程式碼的註解。

    ```tsx {4,9-14}
    // /app/ui/dashboard/cards.tsx

    // ...
    import { fetchCardData } from '@/app/lib/data';

    // ...

    export default async function CardWrapper() {
      const {
        numberOfInvoices,
        numberOfCustomers,
        totalPaidInvoices,
        totalPendingInvoices,
      } = await fetchCardData();

      return (
        <>
          <Card title="Collected" value={totalPaidInvoices} type="collected" />
          <Card title="Pending" value={totalPendingInvoices} type="pending" />
          <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
          <Card title="Total Customers" value={numberOfCustomers} type="customers" />
        </>
      );
    }

  - 重新整理頁面，你應該會看到所有卡片同時載入完成。當你希望多個元件能同時載入完成時，就可以使用這種模式。

## 決定 Suspense 邊界該放在哪裡
  - `Suspense` 邊界該放在哪個位置，取決於以下幾項因素：
    1. 你希望使用者在頁面串流過程中，獲得什麼樣的體驗。
    2. 你想優先顯示哪些內容。
    3. 這些元件是否依賴資料擷取。

  - 看看你的儀表板頁面，有沒有什麼地方你會想採取不同的做法？

  - 不用擔心，這並沒有一個標準答案。
    - 你可以像我們使用 `loading.tsx` 那樣，串流 `整個頁面` ……但如果其中某個元件的資料擷取速度較慢，可能會導致整體載入時間變長。
    - 你可以個別串流 `每個元件` ……但這可能會導致 UI 隨著元件逐一就緒而「彈出」到畫面上。
    - 你也可以透過串流 `頁面區塊（page sections）`，創造出「錯落有致」的效果。不過，你需要建立 `包裹元件（wrapper components）`。

  - `Suspense` 邊界該放在哪裡，會依應用程式而有所不同。一般來說，比較好的做法是把資料擷取邏輯下放到真正需要它的元件中，再用 `Suspense` 包裹這些元件。不過，如果你的應用程式有其需求，直接串流某些區塊，甚至是整個頁面，也完全沒有問題。

  - 不妨大膽嘗試 `Suspense`，看看什麼方式最適合你。這是一個強大的 `API`，能幫助你打造出更令人愉快的使用者體驗。

## 展望未來
  - `串流（Streaming）` 與 `Server Components` 為我們處理資料擷取與載入狀態，提供了新的方式，最終目標都是為了提升終端使用者的體驗。

  - 在下一章，你將學會如何使用 `Next.js` 的 `API`，為你的儀表板應用程式加入搜尋與分頁功能。