---
title: '[Next.js官網] Next.js 16.2 教程'
---

# 建立版面配置與頁面
  - 到目前為止，你的應用程式只有一個首頁。讓我們來學習如何使用 `版面配置（layouts）` 與 `頁面（pages）` 建立更多路由。

  :::info **本章內容**
  以下是本章將涵蓋的主題：
  - 使用檔案系統路由建立 `dashboard` 路由。
  - 理解在建立新 `路由區段（route segments）`時，資料夾與檔案各自扮演的角色。
  - 建立一個可以在多個儀表板頁面之間共用的 `巢狀版面配置（nested layout）`。
  - 理解什麼是 `同地協作（colocation）`、`部分渲染（partial rendering）` 以及 `根版面配置（root layout）`。
  :::

## 巢狀路由
  - `Next.js` 採用檔案系統路由，使用 `資料夾` 來建立巢狀路由。每個資料夾都代表一個對應到某個 `URL 區段` 的 `路由區段`。

    ![圖表顯示資料夾如何對應到 URL 區段。](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_04_01.avif)


  - 你可以使用 `layout.tsx` 與 `page.tsx` 檔案，為每個路由建立各自獨立的 UI。

  - `page.tsx` 是 `Next.js` 的一個特殊檔案，會匯出一個 `React` 元件，而且該路由必須要有這個檔案才能被存取。在你的應用程式中，你已經有一個頁面檔案：`/app/page.tsx`，這是與 `/` 路由對應的首頁。

  - 若要建立巢狀路由，你可以將資料夾一層層互相嵌套，並在其中加入 `page.tsx` 檔案。舉例來說：

    ![圖表顯示新增一個名為 dashboard 的資料夾，如何建立出新的路由「/dashboard」。](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_04_02.avif)

  - `/app/dashboard/page.tsx` 對應到 `/dashboard` 這個路徑。讓我們來建立這個頁面，實際看看它是如何運作的！

## 建立儀表板頁面
  - 在 `/app` 內建立一個名為 `dashboard` 的新資料夾。接著，在 `dashboard` 資料夾內建立一個新的 `page.tsx` 檔案，內容如下：

    ```tsx
    export default function Page() {
      return <p>Dashboard Page</p>;
    }
    ```

  - 現在，請確認開發伺服器正在執行中，並造訪 http://localhost:3000/dashboard 。你應該會看到「Dashboard Page」這段文字。

  - 這就是在 `Next.js` 中建立不同頁面的方式：使用資料夾建立一個新的路由區段，並在其中加入一個 `page` 檔案。

  - 透過為 `page` 檔案設定一個特殊的名稱，`Next.js` 讓你可以將 UI 元件、測試檔案以及其他相關程式碼與路由 [同地協作（colocate）](https://nextjs.org/docs/app/getting-started/project-structure#colocation)。只有 `page` 檔案內的內容才會被公開存取。舉例來說，`/ui` 與 `/lib` 資料夾就與你的路由一起，*同地協作* 於 `/app` 資料夾之中。

## 練習：建立儀表板頁面
  讓我們來練習建立更多路由。在你的儀表板中，再建立兩個頁面：
  1. **客戶頁面（Customers Page）**：這個頁面應該可以透過 `http://localhost:3000/dashboard/customers` 存取。目前先讓它回傳一個 `<p>Customers Page</p>` 元素即可。

  ```tsx
  // /app/dashboard/customers/page.tsx
  export default function Page() {
    return <p>Customers Page</p>;
  }
  ```

  2. **發票頁面（Invoices Page）**：發票頁面應該可以透過 `http://localhost:3000/dashboard/invoices` 存取。目前同樣先讓它回傳一個 `<p>Invoices Page</p>` 元素即可。

  ```tsx
  // /app/dashboard/invoices/page.tsx
  export default function Page() {
    return <p>Invoices Page</p>;
  }
  ```

  ![練習建立儀表板頁面](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_04_03.avif)

## 建立儀表板版面配置
  - 儀表板通常會有某種在多個頁面之間共用的導覽功能。在 `Next.js` 中，你可以使用特殊的 `layout.tsx` 檔案，建立可以在多個頁面之間共用的 UI。讓我們來為儀表板頁面建立一個版面配置吧！

  - 在 `/dashboard` 資料夾內，新增一個名為 `layout.tsx` 的檔案，並貼上以下程式碼：

    ```tsx
    // /app/dashboard/layout.tsx
    import SideNav from '@/app/ui/dashboard/sidenav';
    export default function Layout({ children }: { children: React.ReactNode }) {
      return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
          <div className="w-full flex-none md:w-64">
            <SideNav />
          </div>
          <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
      );
    }
    ```

  - 這段程式碼中有幾個地方值得說明，讓我們逐一拆解：

  - 首先，你將 `<SideNav />` 元件匯入到你的版面配置中。任何你匯入到這個檔案中的元件，都會成為版面配置的一部分。

  - `<Layout />` 元件會接收一個 `children` prop，這個子項目可以是一個頁面，也可以是另一個版面配置。在你的情況中，`/dashboard` 內的頁面會自動被嵌套在 `<Layout />` 之中，如下所示：

    ![資料夾結構圖，顯示儀表板版面配置將儀表板頁面作為子項目進行嵌套。](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_04_04.avif)

  - 儲存你的變更，並檢查本機伺服器（`localhost`），確認一切運作正常。你應該會看到以下畫面：

    ![儀表板頁面畫面，包含側邊導覽列與主要內容區域。](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_04_05.avif)

  - 在 `Next.js` 中使用版面配置的好處之一是：在頁面切換時，只有頁面元件會更新，版面配置本身並不會重新渲染。這種機制稱為 [部分渲染（partial rendering）](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#4-partial-rendering)，它能在頁面切換的過程中，保留版面配置中的用戶端（`client-side`）React 狀態。

    ![資料夾結構圖，顯示儀表板版面配置嵌套儀表板頁面，但在頁面切換時只有頁面的 UI 會替換。](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_04_06.avif)

## 根版面配置
  - 在第三章中，你將 `Inter` 字型匯入到另一個版面配置檔案：`/app/layout.tsx`。回顧一下：
    
    ```tsx
    // /app/layout.tsx
    import '@/app/ui/global.css';
    import { inter } from '@/app/ui/fonts';
    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return (
        <html lang="en">
          <body className={${inter.className} antialiased}>{children}</body>
        </html>
      );
    }
    ```

  - 這個檔案稱為 [根版面配置（root layout）](https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layouts)，每個 `Next.js` 應用程式都必須要有這個檔案。任何你加入根版面配置中的 UI，都會在應用程式中的 **所有** 頁面之間共用。你可以使用根版面配置來修改 `<html>` 與 `<body>` 標籤，並加入 `中繼資料（metadata）`（你將在 [稍後的章節](/pages/f2e/docreact/nextDev/01/nextDev_01_15) 中學到更多關於中繼資料的內容）。

  - 由於你剛剛建立的新版面配置（`/app/dashboard/layout.tsx`）只適用於儀表板頁面，因此你不需要在上方的根版面配置中加入任何 UI。