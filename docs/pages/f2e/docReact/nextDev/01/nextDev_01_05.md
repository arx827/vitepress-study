---
title: '[Next.js官網] Next.js 16.2 教程'
---

# 頁面之間的導覽
  - 在上一章中，你建立了儀表板的版面配置與頁面。現在，讓我們加入一些連結，讓使用者可以在儀表板的各個路由之間進行導覽。

  :::info **本章內容**
  以下是本章將涵蓋的主題：
  - 如何使用 `next/link` 元件。
  - 如何使用 `usePathname()` 這個 `hook` 顯示目前所在的 `作用中連結（active link）`。
  - `Next.js` 中的 `導覽（navigation）`運作方式。
  :::

## 為什麼要最佳化導覽
  - 要在頁面之間建立連結，傳統上你會使用 `<a>` 這個 HTML 元素。目前，側邊欄的連結使用的就是 `<a>` 元素，但請注意，當你在瀏覽器中於首頁、發票頁面與客戶頁面之間切換時會發生什麼事。

  - 你有注意到嗎？

  - 每次切換頁面時，都會發生 `整頁重新整理（full page refresh）`！

## `<Link>` 元件
  - 在 `Next.js` 中，你可以使用 `<Link />` 元件，在應用程式中的各個頁面之間建立連結。`<Link>` 讓你可以透過 `JavaScript` 進行 [用戶端導覽（client-side navigation）](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works)。

  - 要使用 `<Link />` 元件，請開啟 `/app/ui/dashboard/nav-links.tsx`，並從 [`next/link`](https://nextjs.org/docs/app/api-reference/components/link) 匯入 `Link` 元件。接著，將 `<a>` 標籤替換為 `<Link>`：

    ```tsx {8,18,24}
    // /app/ui/dashboard/nav-links.tsx

    import {
      UserGroupIcon,
      HomeIcon,
      DocumentDuplicateIcon,
    } from '@heroicons/react/24/outline';
    import Link from 'next/link';

    // ...

    export default function NavLinks() {
      return (
        <>
          {links.map((link) => {
            const LinkIcon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3" >
                <LinkIcon className="w-6" />
                <p className="hidden md:block">{link.name}</p>
              </Link>
            );
          })}
        </>
      );
    }
    ```

  - 如你所見，`Link` 元件的用法與使用 `<a>` 標籤十分相似，只是不再使用 `<a href="…">`，而是改用 `<Link href="…">`。

  - 儲存你的變更，並在本機伺服器（`localhost`）中確認是否正常運作。你現在應該可以在頁面之間切換，而不會看到整頁重新整理。雖然你的應用程式有部分內容是在伺服器端渲染的，但由於不會發生整頁重新整理，因此使用起來會有種 `原生網頁應用程式（native web app）` 的感覺。這是為什麼呢？

### 自動程式碼分割與預先擷取
  - 為了提升導覽體驗，`Next.js` 會依照路由區段自動對你的應用程式進行程式碼分割（`code splitting`）。這與傳統的 React [單頁應用程式（SPA）](https://nextjs.org/docs/app/building-your-application/upgrading/single-page-applications) 不同，在傳統 `SPA` 中，瀏覽器會在初次載入頁面時，就載入應用程式的「所有」程式碼。

  - 依照路由分割程式碼，代表每個頁面會彼此獨立。如果某個頁面發生錯誤，應用程式的其餘部分仍然可以正常運作。這同時也代表瀏覽器需要解析的程式碼量會減少，讓你的應用程式速度更快。

  - 此外，在正式環境（production）中，只要 [`<Link>`](https://nextjs.org/docs/api-reference/next/link) 元件出現在瀏覽器的可視範圍（viewport）內，`Next.js` 就會自動在背景 **預先擷取（prefetch）** 該連結所指向路由的程式碼。等到使用者點擊連結時，目的頁面的程式碼其實早已在背景載入完成，這正是頁面切換幾乎能瞬間完成的原因！

  - 想了解更多，請參考 [導覽的運作方式](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works)。

## 模式：顯示作用中連結
  - 一個常見的 UI 模式，是顯示目前所在頁面的 `作用中連結（active link）`，讓使用者知道自己目前位於哪個頁面。要做到這一點，你需要從 `URL` 取得使用者目前所在的路徑（`path`）。`Next.js` 提供了一個名為 [`usePathname()`](https://nextjs.org/docs/app/api-reference/functions/use-pathname) 的 hook，可以用來檢查路徑並實作這個模式。

  - 由於 [`usePathname()`](https://nextjs.org/docs/app/api-reference/functions/use-pathname) 是一個 `React hook`，你需要將 `nav-links.tsx` 轉換為 `Client Component`。在檔案最上方加入 `React` 的 `"use client"` 指令，接著從 `next/navigation` 匯入 `usePathname()`：

    ```tsx {3,11}
    // /app/ui/dashboard/nav-links.tsx

    'use client';

    import {
      UserGroupIcon,
      HomeIcon,
      DocumentDuplicateIcon,
    } from '@heroicons/react/24/outline';
    import Link from 'next/link';
    import { usePathname } from 'next/navigation';

    // ...
    ```
  
  - 接著，在你的 `<NavLinks />` 元件內，將路徑指定給一個名為 `pathname` 的變數：

    ```tsx {4}
    // /app/ui/dashboard/nav-links.tsx

    export default function NavLinks() {
      const pathname = usePathname();
      // ...
    }
    ```

    > **注意：** `nav-links.tsx` 並不是 `Next.js` 的特殊檔案，你可以自由為它命名。如果你重新命名這個檔案，請記得同步更新對應的匯入陳述式（`import statements`）。

  - 你可以使用在 [CSS 樣式設計](/pages/f2e/docReact/nextDev/01/nextDev_01_02) 章節中介紹過的 `clsx` 套件，在連結處於作用中狀態時，有條件地套用對應的類別名稱。當 `link.href` 與 `pathname` 相符時，該連結應該顯示為藍色文字，並搭配淺藍色背景。

  - 以下是 `nav-links.tsx` 的最終程式碼：

    ```tsx
    // /app/ui/dashboard/nav-links.tsx

    'use client';

    import {
      UserGroupIcon,
      HomeIcon,
      DocumentDuplicateIcon,
    } from '@heroicons/react/24/outline';
    import Link from 'next/link';
    import { usePathname } from 'next/navigation';
    import clsx from 'clsx';

    // ...

    export default function NavLinks() {
      const pathname = usePathname();

      return (
        <>
          {links.map((link) => {
            const LinkIcon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                  {
                    'bg-sky-100 text-blue-600': pathname === link.href,
                  },
                )}
              >
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
              </Link>
            );
          })}
        </>
      );
    }
    ```

  - 儲存變更並在本機伺服器（`localhost`）中確認結果。你現在應該會看到作用中的連結以藍色標示出來。