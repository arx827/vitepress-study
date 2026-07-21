---
title: '[Next.js官網] Next.js 16.2 教程'
---

# CSS 樣式設計
  目前，你的首頁還沒有任何樣式。讓我們來看看幾種可以為你的 Next.js 應用程式設計樣式的方式。

  :::info **本章內容**
  以下是本章將涵蓋的主題：
  - 如何在應用程式中加入 `全域 CSS` 檔案。
  - 兩種不同的樣式設計方式：`Tailwind` 與 `CSS modules`。
  - 如何使用 `clsx` 這個工具套件來有條件地加入 `類別名稱（class names）`。
  :::

## 全域樣式
  - 如果你打開 `/app/ui` 資料夾，會看到一個名為 `global.css` 的檔案。你可以使用這個檔案為應用程式中「所有」的路由加入 `CSS` 規則，例如 `CSS reset` 規則、針對連結等 HTML 元素的全站樣式等等。

  - 你可以在應用程式中的任何元件裡匯入 `global.css`，但通常最佳做法是把它加到最上層的元件中。在 `Next.js` 中，這個最上層元件就是 [root layout](https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layouts)（稍後會再詳細說明）。

  - 前往 `/app/layout.tsx`，匯入 `global.css` 檔案，將全域樣式加入你的應用程式：

    ```tsx {2}
    // app/layout.tsx
    import '@/app/ui/global.css';
    
    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return (
        <html lang="en">
          <body>{children}</body>
        </html>
      );
    }
    ```

  - 在開發伺服器仍持續運行的狀態下，儲存你的變更，並在瀏覽器中預覽結果。你的首頁現在應該會像這樣：

    ![套用樣式後的頁面，顯示「Acme」標誌、說明文字與登入連結。](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_02_01.avif)

  - 但等等，你並沒有加入任何 `CSS` 規則，那這些樣式是從哪裡來的呢？

  - 如果你打開 `global.css` 看看，會發現裡面有一些 `@tailwind` 指令：
    ```css
    /* app/ui/global.css */
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

## Tailwind
  - [Tailwind](https://tailwindcss.com/) 是一套 CSS 框架，讓你可以直接在 `React` 程式碼中快速撰寫 [工具類別（utility classes）](https://tailwindcss.com/docs/utility-first)，藉此加快開發流程。

  - 在 `Tailwind` 中，你是透過加入類別名稱來為元素設計樣式。舉例來說，加入 `"text-blue-500"` 會把 `<h1>` 的文字變成藍色：

    ```jsx
    <h1 className="text-blue-500">I'm blue!</h1>
    ```

  - 雖然 CSS 樣式是全域共用的，但每個類別都是個別套用在各個元素上。這代表當你新增或刪除某個元素時，不需要擔心要維護獨立的樣式表、樣式衝突，或是隨著應用程式規模擴大而讓 CSS 檔案越變越大等問題。

  - 當你使用 `create-next-app` 建立新專案時，`Next.js` 會詢問你是否要使用 `Tailwind`。如果你選擇「是」，`Next.js` 就會自動安裝所需的套件，並為你的應用程式設定好 `Tailwind`。

  - 如果你查看 `/app/page.tsx`，會看到範例中已經使用了 `Tailwind` 的類別。

    ```jsx {9-10}
    // app/page.tsx
    import AcmeLogo from '@/app/ui/acme-logo';
    import { ArrowRightIcon } from '@heroicons/react/24/outline';
    import Link from 'next/link';

    export default function Page() {
      return (
        // These are Tailwind classes:
        <main className="flex min-h-screen flex-col p-6">
          <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        // ...
      )
    }
    ```

  - 如果這是你第一次使用 `Tailwind`，也不用擔心。為了節省時間，我們已經事先為你將所有會用到的元件都設計好樣式了。

  - 讓我們來試玩一下 `Tailwind`！複製以下程式碼，並貼到 `/app/page.tsx` 中 `<p>` 元素的上方：

    ```jsx
    // app/page.tsx
    <div
      className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black"
    />
    ```

  - 如果你偏好撰寫傳統的 `CSS` 規則，或是希望將樣式與 JSX 分開存放，`CSS Modules` 會是一個很好的替代方案。

## CSS Modules
  - [CSS Modules](https://nextjs.org/docs/app/getting-started/css#css-modules) 讓你可以透過自動產生獨一無二的類別名稱，將 `CSS` 限定套用在特定元件的範圍內，這樣一來你同樣不需要擔心樣式衝突的問題。

  - 在這門課程中我們會持續使用 `Tailwind`，但讓我們花點時間看看如何使用 `CSS modules`，達成與上面測驗相同的結果。

  - 在 `/app/ui` 資料夾內，新增一個名為 `home.module.css` 的檔案，並加入以下 `CSS` 規則：

    ```css
    /* /app/ui/home.module.css */
    .shape {
      height: 0;
      width: 0;
      border-bottom: 30px solid black;
      border-left: 20px solid transparent;
      border-right: 20px solid transparent;
    }
    ```

  - 接著，在你的 `/app/page.tsx` 檔案中匯入這個樣式，並將你先前加入的 `<div>` 中的 `Tailwind` 類別名稱替換成 `styles.shape`：

    ```tsx {5,10}
    // /app/page.tsx
    import AcmeLogo from '@/app/ui/acme-logo';
    import { ArrowRightIcon } from '@heroicons/react/24/outline';
    import Link from 'next/link';
    import styles from '@/app/ui/home.module.css';

    export default function Page() {
      return (
        <main className="flex min-h-screen flex-col p-6">
          <div className={styles.shape} />
        // ...
      )
    }
    ```

  - 儲存變更並在瀏覽器中預覽結果，你應該會看到與之前相同的形狀。

  - `Tailwind` 與 `CSS modules` 是為 `Next.js` 應用程式設計樣式最常見的兩種方式。使用哪一種純粹是個人偏好問題，你甚至可以在同一個應用程式中同時使用這兩種方式！

## 使用 clsx 套件切換類別名稱
  - 有些情況下，你可能需要根據 `狀態（state）` 或其他條件，有條件地為元素套用不同樣式。

  - [clsx](https://www.npmjs.com/package/clsx) 是一個可以讓你輕鬆切換類別名稱的套件。我們建議你參考 [官方文件](https://github.com/lukeed/clsx) 以了解更多細節，但以下是基本用法：
    - 假設你想建立一個接受 `status` 參數的 `InvoiceStatus` 元件，`status` 的值可以是 `'pending'` 或 `'paid'`。
    - 如果是 `'paid'`，你希望顏色顯示為綠色；如果是 `'pending'`，你希望顏色顯示為灰色。

  - 你可以使用 `clsx` 來有條件地套用類別，如下所示：
    ```tsx {10-11}
    // /app/ui/invoices/status.tsx
    import clsx from 'clsx';

    export default function InvoiceStatus({ status }: { status: string }) {
      return (
        <span
          className={clsx(
            'inline-flex items-center rounded-full px-2 py-1 text-sm',
            {
              'bg-gray-100 text-gray-500': status === 'pending',
              'bg-green-500 text-white': status === 'paid',
            },
          )}
        >
        // ...
    )}
    ```

## 其他樣式設計方案
  - 除了以上討論的方式之外，你也可以使用以下方式為 `Next.js` 應用程式設計樣式：
    - `Sass`，讓你可以匯入 `.css` 與 `.scss` 檔案。
    - `CSS-in-JS` 套件，例如 [styled-jsx](https://github.com/vercel/styled-jsx)、[styled-components](https://github.com/vercel/next.js/tree/canary/examples/with-styled-components) 以及 [emotion](https://github.com/vercel/next.js/tree/canary/examples/with-emotion)。

  - 想了解更多資訊，請參考 [CSS 官方文件](https://nextjs.org/docs/app/building-your-application/styling)。