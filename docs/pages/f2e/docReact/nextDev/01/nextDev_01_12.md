---
title: '[Next.js官網] Next.js 16.2 教程'
---

# 處理錯誤

```
在上一章中，你學到了如何使用 Server Actions 異動資料。讓我們來看看，如何使用 JavaScript 的 `try/catch` 陳述式與 Next.js 的 API，優雅地處理未被攔截的例外狀況（uncaught exceptions）。

**本章內容**

以下是本章將涵蓋的主題：

如何使用特殊的 `error.tsx` 檔案，攔截路由區段中的錯誤，並向使用者顯示備援（fallback）UI。

如何使用 `notFound` 函式與 `not-found` 檔案，處理 404 錯誤（用於不存在的資源）。

## 為 Server Actions 加入 `try/catch`

首先，讓我們在你的 Server Actions 中加入 JavaScript 的 `try/catch` 陳述式，讓你能夠優雅地處理錯誤。

如果你知道該怎麼做，可以花幾分鐘更新你的 Server Actions，或者你也可以直接複製下方的程式碼：

展開查看解答

請注意，`redirect` 是在 `try/catch` 區塊**外**呼叫的。這是因為 `redirect` 的運作方式是拋出（throw）一個錯誤，這個錯誤會被 `catch` 區塊攔截到。為了避免這種情況，你可以在 `try/catch` 結束**之後**才呼叫 `redirect`。只有當 `try` 執行成功時，程式才會執行到 `redirect`。

我們透過攔截資料庫的問題，並從 Server Action 回傳一則有用的訊息，優雅地處理了這些錯誤。

如果你的 action 中出現了未被攔截的例外狀況，會發生什麼事呢？我們可以透過手動拋出一個錯誤來模擬這個情況。舉例來說，在 `deleteInvoice` 這個 action 中，在函式最上方拋出一個錯誤：

/app/lib/actions.ts

export async function deleteInvoice(id: string) {
throw new Error('Failed to Delete Invoice');

// Unreachable code block
await sqlDELETE FROM invoices WHERE id = ${id};
revalidatePath('/dashboard/invoices');
}


當你嘗試刪除一筆發票時，你應該會在本機伺服器（localhost）上看到這個錯誤。而在正式環境（production）中，當發生非預期的狀況時，你會希望能更優雅地向使用者顯示一則訊息。

這正是 Next.js 的[`error.tsx`](https://nextjs.org/docs/app/api-reference/file-conventions/error)檔案派上用場的地方。請確認在測試完畢、進入下一個段落之前，先移除這段手動加入的錯誤程式碼。

## 使用 `error.tsx` 處理所有錯誤

`error.tsx` 檔案可以用來為某個路由區段定義一個 UI 邊界（boundary）。它可以作為一個**萬用（catch-all）**機制，用來攔截非預期的錯誤，並向使用者顯示備援 UI。

在你的 `/dashboard/invoices` 資料夾中，建立一個名為 `error.tsx` 的新檔案，並貼上以下程式碼：

/dashboard/invoices/error.tsx

'use client';

import { useEffect } from 'react';

export default function Error({
error,
reset,
}: {
error: Error & { digest?: string };
reset: () => void;
}) {
useEffect(() => {
// Optionally log the error to an error reporting service
console.error(error);
}, [error]);

return (
<main className="flex h-full flex-col items-center justify-center">
<h2 className="text-center">Something went wrong!</h2>
<button
className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
onClick={
// Attempt to recover by trying to re-render the invoices route
() => reset()
}
>
Try again
</button>
</main>
);
}


關於上面這段程式碼，有幾件事值得注意：

- **"use client"**：`error.tsx` 必須是一個用戶端元件（Client Component）。
- 它接收兩個 props：
  * `error`：這個物件是 JavaScript 原生[`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)物件的一個實例。
  * `reset`：這是一個用來重設錯誤邊界（error boundary）的函式。當這個函式被執行時，會嘗試重新渲染該路由區段。

當你再次嘗試刪除一筆發票時，你應該會看到以下的 UI 畫面：

![error.tsx 檔案，顯示它所接收的 props](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Flight%2Ferror-page.png&w=1920&q=75)

## 使用 `notFound` 函式處理 404 錯誤

另一種優雅處理錯誤的方式，是使用 `notFound` 函式。雖然 `error.tsx` 適合用來攔截未被處理的例外狀況，但當你嘗試擷取一個不存在的資源時，就可以使用 `notFound`。

舉例來說，造訪 `http://localhost:3000/dashboard/invoices/2e94d1ed-d220-449f-9f11-f0bbceed9645/edit`。

這是一個在你的資料庫中並不存在的假 UUID。

你會立刻看到 `error.tsx` 被觸發，因為這是 `/invoices` 的子路由，而 `error.tsx` 就是在該處被定義的。

不過，如果你想要更精確一些，可以顯示一個 404 錯誤，告訴使用者他們嘗試存取的資源並不存在。

你可以前往 `data.ts` 中的 `fetchInvoiceById` 函式，並為回傳的 `invoice` 加入一段 console log，藉此確認資源確實不存在：

/app/lib/data.ts

export async function fetchInvoiceById(id: string) {
try {
// ...

console.log(invoice); // Invoice is an empty array []
return invoice[0];

} catch (error) {
console.error('Database Error:', error);
throw new Error('Failed to fetch invoice.');
}
}


現在你已經確認這筆發票在資料庫中並不存在，讓我們使用 `notFound` 來處理這個情況。前往 `/dashboard/invoices/[id]/edit/page.tsx`，並從 `'next/navigation'` 匯入 `{ notFound }`。

接著，你可以使用條件判斷式，在發票不存在時呼叫 `notFound`：

/dashboard/invoices/[id]/edit/page.tsx

import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
const params = await props.params;
const id = params.id;
const [invoice, customers] = await Promise.all([
fetchInvoiceById(id),
fetchCustomers(),
]);

if (!invoice) {
notFound();
}

// ...
}


接著，為了向使用者顯示錯誤 UI，在 `/edit` 資料夾內建立一個 `not-found.tsx` 檔案。

![位於 edit 資料夾內的 not-found.tsx 檔案](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Flight%2Fnot-found-file.png&w=3840&q=75)

在 `not-found.tsx` 檔案中，貼上以下程式碼：

/dashboard/invoices/[id]/edit/not-found.tsx

import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
return (
<main className="flex h-full flex-col items-center justify-center gap-2">
<FaceFrownIcon className="w-10 text-gray-400" />
<h2 className="text-xl font-semibold">404 Not Found</h2>
<p>Could not find the requested invoice.</p>
<Link href="/dashboard/invoices" className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400" >
Go Back
</Link>
</main>
);
}


重新整理該路由，你現在應該會看到以下的 UI 畫面：

![404 找不到頁面畫面](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Flight%2F404-not-found-page.png&w=1920&q=75)

這是一個值得留意的地方：`notFound` 的優先順序會高於 `error.tsx`，因此當你想要處理更精確的錯誤情境時，可以善用這個函式！

## 延伸閱讀

想更深入了解 Next.js 中的錯誤處理，可以參考以下文件：

- [錯誤處理](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [`error.js` API 參考文件](https://nextjs.org/docs/app/api-reference/file-conventions/error)
- [`notFound()` API 參考文件](https://nextjs.org/docs/app/api-reference/functions/not-found)
- [`not-found.js` API 參考文件](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)

## 你已完成第十二章

太好了，你現在已經能夠優雅地處理應用程式中的錯誤了。

**下一步**

**13：提升無障礙性（Improving Accessibility）**

讓我們繼續探索提升使用者體驗的方法。你將學到伺服器端表單驗證，以及如何提升無障礙性。

[開始第十三章](https://nextjs.org/learn/dashboard-app/improving-accessibility)