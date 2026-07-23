---
title: '[Next.js官網] Next.js 16.2 教程'
---

# 加入搜尋與分頁
  - 在上一章中，你透過 `串流（streaming）` 提升了儀表板的初始載入效能。現在讓我們繼續前往 `/invoices` 頁面，學習如何加入搜尋與分頁功能。

  :::info **本章內容**
  以下是本章將涵蓋的主題：
  - 學習如何使用 `Next.js` 的 API：`useSearchParams`、`usePathname` 與 `useRouter`。
  - 使用 `URL` 搜尋參數（`search params`）實作搜尋與分頁功能。
  :::

## 起始程式碼
  - 在你的 `/dashboard/invoices/page.tsx` 檔案中，貼上以下程式碼：

    ```tsx
    // /app/dashboard/invoices/page.tsx

    import Pagination from '@/app/ui/invoices/pagination';
    import Search from '@/app/ui/search';
    import Table from '@/app/ui/invoices/table';
    import { CreateInvoice } from '@/app/ui/invoices/buttons';
    import { lusitana } from '@/app/ui/fonts';
    import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
    import { Suspense } from 'react';

    export default async function Page() {
      return (
        <div className="w-full">
          <div className="flex w-full items-center justify-between">
            <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
            <Search placeholder="Search invoices..." />
            <CreateInvoice />
          </div>
          {/*  <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
            <Table query={query} currentPage={currentPage} />
          </Suspense> */}
          <div className="mt-5 flex w-full justify-center">
            {/* <Pagination totalPages={totalPages} /> */}
          </div>
        </div>
      );
    }
    ```

  - 花點時間熟悉一下這個頁面，以及你接下來會用到的元件：
    1. `<Search/>`：讓使用者可以搜尋特定的發票。
    2. `<Pagination/>`：讓使用者可以在不同的發票頁面之間切換。
    3. `<Table/>`：顯示發票資料。

  - 你的搜尋功能會橫跨用戶端與伺服器端。當使用者在用戶端搜尋某張發票時，`URL 參數` 會被更新，接著伺服器端會擷取資料，並使用新的資料在伺服器端重新渲染資料表。

## 為什麼要使用 URL 搜尋參數
  - 如上所述，你將使用 `URL 搜尋參數` 來管理搜尋狀態。如果你習慣用用戶端狀態（`client side state`）來處理搜尋，這種做法可能會讓你感到陌生。

  - 使用 URL 參數來實作搜尋功能，有以下幾項優點：
    - **可加入書籤與可分享的網址**：由於搜尋參數都放在 `URL` 中，使用者可以將應用程式目前的狀態（包含他們的搜尋查詢與篩選條件）加入書籤，方便日後參考或分享給他人。
    - **伺服器端渲染**：`URL 參數` 可以直接在伺服器端使用，用來渲染初始狀態，讓伺服器端渲染的處理變得更容易。
    - **分析與追蹤**：將搜尋查詢與篩選條件直接放在 `URL` 中，能更容易追蹤使用者行為，而不需要額外的用戶端邏輯。

## 加入搜尋功能
  - 以下是你將用來實作搜尋功能的 `Next.js` 用戶端 `hooks`：
    - **`useSearchParams`**：讓你可以存取目前 URL 的參數。舉例來說，這個網址 `/dashboard/invoices?page=1&query=pending` 的搜尋參數會像這樣：`{page: '1', query: 'pending'}`。
    - **`usePathname`**：讓你可以讀取目前 URL 的路徑名稱（pathname）。舉例來說，對於路由 `/dashboard/invoices`，`usePathname` 會回傳 `'/dashboard/invoices'`。
    - **`useRouter`**：讓你可以在用戶端元件中，以程式化的方式在不同路由之間進行導覽。你可以使用 [多種方法](https://nextjs.org/docs/app/api-reference/functions/use-router#userouter)。

  - 以下是實作步驟的快速概覽：
    1. 擷取使用者的輸入內容。
    2. 使用搜尋參數更新 `URL`。
    3. 讓 `URL` 與輸入欄位保持同步。
    4. 更新資料表，以反映搜尋查詢的結果。

### 一、擷取使用者的輸入內容
  - 前往 `<Search>` 元件（`/app/ui/search.tsx`），你會注意到：
    - `"use client"`：這是一個用戶端元件（Client Component），代表你可以使用 `事件監聽器` 與 `hooks`。
    - `<input>`：這是搜尋輸入欄位。

  - 建立一個新的 `handleSearch` 函式，並在 `<input>` 元素上加入 `onChange` 監聽器。每當輸入值改變時，`onChange` 就會呼叫 `handleSearch`。

    ```tsx {8-10}
    // /app/ui/search.tsx

    'use client';

    import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

    export default function Search({ placeholder }: { placeholder: string }) {
      function handleSearch(term: string) {
        console.log(term);
      }

      return (
        <div className="relative flex flex-1 shrink-0">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <input
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            placeholder={placeholder}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      );
    }
    ```

  - 打開瀏覽器開發者工具中的主控台，確認功能是否正常運作，然後在搜尋欄位中輸入文字。你應該會看到搜尋字詞被記錄在瀏覽器主控台中。

  - 太好了！你已經成功擷取到使用者的搜尋輸入內容。接下來，你需要用搜尋字詞來更新 `URL`。

### 二、使用搜尋參數更新 URL
  - 從 `next/navigation` 匯入 `useSearchParams` hook，並將它指定給一個變數：

    ```tsx {6,9}
    // /app/ui/search.tsx

    'use client';

    import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
    import { useSearchParams } from 'next/navigation';

    export default function Search() {
      const searchParams = useSearchParams();

      function handleSearch(term: string) {
        console.log(term);
      }
      // ...
    }
    ```

  - 在 `handleSearch` 內，使用你剛剛建立的 `searchParams` 變數，建立一個新的 [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) 實例。
    
    ```tsx 
    // /app/ui/search.tsx

    'use client';

    import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
    import { useSearchParams } from 'next/navigation';

    export default function Search() {
      const searchParams = useSearchParams();

      function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams);
      }
      // ...
    }
    ```

  - `URLSearchParams` 是一個 Web API，提供了操作 URL 查詢參數的工具方法。你可以使用它來取得類似 `?page=1&query=a` 這樣的參數字串，而不需要自行組合複雜的字串。

  - 接著，根據使用者的輸入內容 `set`（設定）參數字串。如果輸入內容為空，則需要將其 `delete`（刪除）：

    ```tsx {13-17}
    // /app/ui/search.tsx

    'use client';

    import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
    import { useSearchParams } from 'next/navigation';

    export default function Search() {
      const searchParams = useSearchParams();

      function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams);
        if (term) {
          params.set('query', term);
        } else {
          params.delete('query');
        }
      }
      // ...
    }
    ```

  - 現在你已經取得了 `查詢字串（query string）`。你可以使用 `Next.js` 的 `useRouter` 與 `usePathname` hooks 來更新 `URL`。

  - 從 `'next/navigation'` 匯入 `useRouter` 與 `usePathname`，並在 `handleSearch` 內使用 `useRouter()` 提供的 `replace` 方法：
    
    ```tsx {6,10-11,20}
    // /app/ui/search.tsx

    'use client';

    import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
    import { useSearchParams, usePathname, useRouter } from 'next/navigation';

    export default function Search() {
      const searchParams = useSearchParams();
      const pathname = usePathname();
      const { replace } = useRouter();

      function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams);
        if (term) {
          params.set('query', term);
        } else {
          params.delete('query');
        }
        replace(${pathname}?${params.toString()});
      }
      // ...
    }
    ```

  - 以下是這段程式碼運作方式的說明：
    - `${pathname}` 是目前的路徑，在你的情況中會是 `"/dashboard/invoices"`。
    - 當使用者在搜尋欄位輸入內容時，`params.toString()` 會將這些輸入內容轉換為適合放在 URL 中的格式。
    - `replace(${pathname}?${params.toString()})` 會用使用者的搜尋資料更新 URL。舉例來說，如果使用者搜尋 `「Lee」`，網址就會變成 `/dashboard/invoices?query=lee`。
    - 由於 `Next.js` 的用戶端導覽功能（你在 [頁面之間的導覽](/pages/f2e/docReact/nextDev/01/nextDev_01_05) 這一章學過），`URL` 會在不重新載入頁面的情況下完成更新。

### 三、讓 URL 與輸入欄位保持同步
  - 為了確保輸入欄位能與 `URL` 保持同步，並在分享連結時能自動帶入搜尋內容，你可以從 `searchParams` 讀取資料，並將其作為 `defaultValue` 傳入輸入欄位：

    ```tsx {10}
    // /app/ui/search.tsx

    //...
    <input
      className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
      placeholder={placeholder}
      onChange={(e) => {
        handleSearch(e.target.value);
      }}
      defaultValue={searchParams.get('query')?.toString()}
    />
    ```

  :::info **`defaultValue` 與 `value` 的差異／受控與非受控元件**
  - 如果你使用 `state` 來管理輸入欄位的值，你會使用 `value` 屬性，讓它成為一個 `受控元件（controlled component）`。這代表 `React` 會負責管理輸入欄位的狀態。
  
  - 然而，由於你並沒有使用 `state`，你可以改用 `defaultValue`。這代表原生的輸入欄位會自行管理自己的狀態。這樣做並沒有問題，因為你是將搜尋查詢儲存到 `URL` 中，而不是儲存在 `state` 裡。
  :::

### 四、更新資料表
  - 最後，你需要更新資料表元件，讓它能反映搜尋查詢的結果。

  - 回到發票頁面。

  - 頁面元件 [可以接收一個名為 `searchParams` 的 prop](https://nextjs.org/docs/app/api-reference/file-conventions/page)，因此你可以將目前的 URL 參數傳遞給 `<Table>` 元件。

    ```tsx {11-19,30-32}
    // /app/dashboard/invoices/page.tsx

    import Pagination from '@/app/ui/invoices/pagination';
    import Search from '@/app/ui/search';
    import Table from '@/app/ui/invoices/table';
    import { CreateInvoice } from '@/app/ui/invoices/buttons';
    import { lusitana } from '@/app/ui/fonts';
    import { Suspense } from 'react';
    import { InvoicesTableSkeleton } from '@/app/ui/skeletons';

    export default async function Page(props: {
      searchParams?: Promise<{
        query?: string;
        page?: string;
      }>;
    }) {
      const searchParams = await props.searchParams;
      const query = searchParams?.query || '';
      const currentPage = Number(searchParams?.page) || 1;

      return (
        <div className="w-full">
          <div className="flex w-full items-center justify-between">
            <h1 className={${lusitana.className} text-2xl}>Invoices</h1>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
            <Search placeholder="Search invoices..." />
            <CreateInvoice />
          </div>
          <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
            <Table query={query} currentPage={currentPage} />
          </Suspense>
          <div className="mt-5 flex w-full justify-center">
            {/* <Pagination totalPages={totalPages} /> */}
          </div>
        </div>
      );
    }
    ```

  - 如果你前往 `<Table>` 元件，會看到 `query` 與 `currentPage` 這兩個 props 被傳入 `fetchFilteredInvoices()` 函式中，這個函式會回傳符合查詢條件的發票資料。

    ```tsx
    // /app/ui/invoices/table.tsx

    // ...
    export default async function InvoicesTable({
      query,
      currentPage,
    }: {
      query: string;
      currentPage: number;
    }) {
      const invoices = await fetchFilteredInvoices(query, currentPage);
      // ...
    }
    ```

  - 完成這些變更後，就可以動手測試看看。如果你搜尋某個字詞，`URL` 會隨之更新，這會向伺服器發送一個新的請求，伺服器端會擷取資料，並只回傳符合你查詢條件的發票資料。

  :::info **何時該使用 `useSearchParams()` hook，何時該使用 `searchParams` prop？**
  - 你可能已經注意到，你使用了兩種不同的方式來取得搜尋參數。要使用哪一種，取決於你是在用戶端還是伺服器端進行處理。
  
  - `<Search>` 是一個用戶端元件（`Client Component`），因此你使用 `useSearchParams()` hook 在用戶端存取參數。
  
  - `<Table>` 是一個會自行擷取資料的伺服器端元件（`Server Component`），因此你可以直接從頁面將 `searchParams` prop 傳遞給該元件。
  
  - 一般來說，如果你想在用戶端讀取參數，建議使用 `useSearchParams()` hook，這樣可以避免每次都要回到伺服器端處理。
  :::

### 最佳實務：防抖處理（Debouncing）
  - 恭喜！你已經使用 `Next.js` 實作了搜尋功能！不過還有一件事可以進一步優化。

  - 在你的 `handleSearch` 函式內，加入以下的 `console.log`：

    ```tsx
    // /app/ui/search.tsx

    function handleSearch(term: string) {
      console.log(`Searching... ${term}`);

      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set('query', term);
      } else {
        params.delete('query');
      }
      replace(${pathname}?${params.toString()});
    }
    ```

  - 接著在搜尋欄位輸入「Delba」，並檢查開發者工具中的主控台，發生了什麼事？

    ```bash
    Searching... D
    Searching... De
    Searching... Del
    Searching... Delb
    Searching... Delba
    ```

  - 你在每一次按鍵時都更新了 `URL`，也因此在每一次按鍵時都對資料庫發出了查詢！由於我們的應用程式規模較小，這並不會造成什麼問題，但試想一下，如果你的應用程式擁有數千名使用者，每個人的每一次按鍵都會對資料庫發出一次新的請求，會是什麼情況。

  - **防抖處理（Debouncing）** 是一種程式設計技巧，用來限制函式被觸發的頻率。在我們的情境中，你只想在使用者停止輸入時，才對資料庫發出查詢。

    :::info **防抖處理的運作方式：**
    1. **觸發事件**：當需要進行防抖處理的事件發生時（例如在搜尋欄位中按下按鍵），就會啟動一個計時器。
    2. **等待**：如果在計時器結束之前又發生了新的事件，計時器就會被重設。
    3. **執行**：如果計時器倒數結束，就會執行經過防抖處理的函式。
    :::

  - 你可以透過幾種方式來實作防抖處理，包括自行手動撰寫防抖函式。為了簡化流程，我們會使用一個名為 [`use-debounce`](https://www.npmjs.com/package/use-debounce) 的函式庫。

  - 安裝 `use-debounce`：

    ```bash
    npm i use-debounce
    ```

  - 在你的 `<Search>` 元件中，匯入一個名為 `useDebouncedCallback` 的函式：

    ```tsx {4,7,17}
    // /app/ui/search.tsx

    // ...
    import { useDebouncedCallback } from 'use-debounce';

    // Inside the Search Component...
    const handleSearch = useDebouncedCallback((term) => {
      console.log(Searching... ${term});

      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set('query', term);
      } else {
        params.delete('query');
      }
      replace(${pathname}?${params.toString()});
    }, 300);
    ```

  - 這個函式會包裹 `handleSearch` 的內容，只有在使用者停止輸入一段特定時間後（300 毫秒），才會執行其中的程式碼。

  - 現在再次在搜尋欄位中輸入文字，並打開開發者工具的主控台，你應該會看到以下結果：

    ```bash
    Searching... Delba
    ```

  - 透過防抖處理，你可以減少發送到資料庫的請求數量，藉此節省資源。

## 加入分頁功能
  - 在加入搜尋功能之後，你會注意到資料表一次只會顯示 6 筆發票資料。這是因為 `data.ts` 中的 `fetchFilteredInvoices()` 函式，每一頁最多只會回傳 `6` 筆發票資料。

  - 加入分頁功能後，使用者就可以在不同頁面之間切換，瀏覽所有的發票資料。讓我們來看看，如何像實作搜尋功能一樣，使用 `URL` 參數來實作分頁功能。

  - 前往 `<Pagination/>` 元件，你會注意到這是一個用戶端元件（`Client Component`）。你不會希望在用戶端擷取資料，因為這樣會暴露你的資料庫機密資料（別忘了，你並沒有使用 API 層）。取而代之的是，你可以在伺服器端擷取資料，再將資料以 `prop` 的形式傳遞給元件。

  - 在 `/dashboard/invoices/page.tsx` 中，匯入一個名為 `fetchInvoicesPages` 的新函式，並將 `searchParams` 中的 `query` 作為引數傳入：

    ```tsx {4,17}
    // /app/dashboard/invoices/page.tsx

    // ...
    import { fetchInvoicesPages } from '@/app/lib/data';

    export default async function Page(
      props: {
        searchParams?: Promise<{
          query?: string;
          page?: string;
        }>;
      }
    ) {
      const searchParams = await props.searchParams;
      const query = searchParams?.query || '';
      const currentPage = Number(searchParams?.page) || 1;
      const totalPages = await fetchInvoicesPages(query);

      return (
        // ...
      );
    }
    ```

  - `fetchInvoicesPages` 會根據搜尋查詢，回傳總頁數。舉例來說，如果有 `12` 筆發票符合搜尋查詢條件，而每一頁顯示 `6` 筆發票，那麼總頁數就會是 `2`。

  - 接著，將 `totalPages` prop 傳遞給 `<Pagination/>` 元件：

    ```tsx {29}
    // /app/dashboard/invoices/page.tsx

    // ...

    export default async function Page(props: {
      searchParams?: Promise<{
        query?: string;
        page?: string;
      }>;
    }) {
      const searchParams = await props.searchParams;
      const query = searchParams?.query || '';
      const currentPage = Number(searchParams?.page) || 1;
      const totalPages = await fetchInvoicesPages(query);

      return (
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={${lusitana.className} text-2xl}>Invoices</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search invoices..." />
          <CreateInvoice />
        </div>
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
          <Table query={query} currentPage={currentPage} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
      );
    }
    ```

  - 前往 `<Pagination/>` 元件，並匯入 `usePathname` 與 `useSearchParams` hooks。我們會用它們來取得目前的頁碼，並設定新的頁碼。也請記得取消這個元件中程式碼的註解。由於你尚未實作 `<Pagination/>` 的邏輯，應用程式暫時會出現錯誤，現在讓我們來完成它！

    ```tsx {9,12-14}
    // /app/ui/invoices/pagination.tsx

    'use client';

    import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
    import clsx from 'clsx';
    import Link from 'next/link';
    import { generatePagination } from '@/app/lib/utils';
    import { usePathname, useSearchParams } from 'next/navigation';

    export default function Pagination({ totalPages }: { totalPages: number }) {
      const pathname = usePathname();
      const searchParams = useSearchParams();
      const currentPage = Number(searchParams.get('page')) || 1;

      // ...
    }
    ```

  - 接著，在 `<Pagination>` 元件內建立一個名為 `createPageURL` 的新函式。與搜尋功能類似，你會使用 `URLSearchParams` 來設定新的頁碼，並使用 `pathName` 建立 URL 字串。

    ```tsx {16-20}
    // /app/ui/invoices/pagination.tsx

    'use client';

    import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
    import clsx from 'clsx';
    import Link from 'next/link';
    import { generatePagination } from '@/app/lib/utils';
    import { usePathname, useSearchParams } from 'next/navigation';

    export default function Pagination({ totalPages }: { totalPages: number }) {
      const pathname = usePathname();
      const searchParams = useSearchParams();
      const currentPage = Number(searchParams.get('page')) || 1;

      const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
      };

      // ...
    }
    ```

  - 以下是這段程式碼運作方式的說明：
    - `createPageURL` 會建立目前搜尋參數的一個實例。
    - 接著，它會將 `「page」` 這個參數更新為傳入的頁碼。
    - 最後，它會使用路徑名稱與更新後的搜尋參數，組合出完整的 `URL`。

  - `<Pagination>` 元件的其餘部分，處理的是樣式設計與不同的狀態（第一頁、最後一頁、作用中、停用等）。在這門課程中我們不會深入探討這些細節，但你可以自由查看程式碼，了解 `createPageURL` 在哪些地方被呼叫。

  - 最後，當使用者輸入新的搜尋查詢時，你會希望將頁碼重設為 `1`。你可以透過更新 `<Search>` 元件中的 `handleSearch` 函式來做到這一點：

    ```tsx
    // /app/ui/search.tsx

    'use client';

    import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
    import { usePathname, useRouter, useSearchParams } from 'next/navigation';
    import { useDebouncedCallback } from 'use-debounce';

    export default function Search({ placeholder }: { placeholder: string }) {
      const searchParams = useSearchParams();
      const { replace } = useRouter();
      const pathname = usePathname();

      const handleSearch = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (term) {
          params.set('query', term);
        } else {
          params.delete('query');
        }
        replace(${pathname}?${params.toString()});
      }, 300);
    ```

## 總結
  - 恭喜！你剛剛使用 `URL` 搜尋參數與 `Next.js` 的 `API`，實作了搜尋與分頁功能。

  - 總結來說，在這一章中：
    - 你使用 `URL` 搜尋參數（而不是用戶端狀態）來處理搜尋與分頁功能。
    - 你在伺服器端擷取了資料。
    - 你使用了 `useRouter` router hook，讓用戶端的頁面切換更為流暢。

  - 這些模式與你在處理用戶端 `React` 時所習慣的做法有所不同，但希望你現在能更加理解使用 `URL` 搜尋參數、並將這些狀態提升到伺服器端所帶來的好處。