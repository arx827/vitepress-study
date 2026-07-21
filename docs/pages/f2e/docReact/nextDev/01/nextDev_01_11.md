---
title: '[Next.js官網] Next.js 16.2 教程'
---

# 資料異動
  在上一章中，你使用 URL 搜尋參數與 Next.js 的 API，實作了搜尋與分頁功能。讓我們繼續為發票頁面加入新增、更新與刪除發票的功能！

```
**本章內容**

以下是本章將涵蓋的主題：

什麼是 React Server Actions，以及如何使用它們來異動資料。

如何搭配表單與伺服器端元件（Server Components）進行操作。

處理原生 `FormData` 物件的最佳實務，包含型別驗證。

如何使用 `revalidatePath` API 重新驗證用戶端快取。

如何建立帶有特定 ID 的動態路由區段。

## 什麼是 Server Actions？

React Server Actions 讓你可以直接在伺服器端執行非同步程式碼，不再需要為了異動資料而額外建立 API 端點。取而代之的是，你可以撰寫在伺服器端執行的非同步函式，並可以從用戶端或伺服器端元件中呼叫這些函式。

安全性對網頁應用程式來說是首要考量，因為應用程式可能容易受到各種威脅的攻擊。這正是 Server Actions 派上用場的地方。它們具備加密閉包（encrypted closures）、嚴格的輸入檢查、錯誤訊息雜湊處理、主機限制等功能，這些機制共同運作，能大幅提升你應用程式的安全性。

## 搭配 Server Actions 使用表單

在 React 中，你可以在 `<form>` 元素中使用 `action` 屬性來呼叫 actions。這個 action 會自動接收到原生的[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)物件，其中包含使用者所輸入的資料。

舉例來說：

// Server Component
export default function Page() {
// Action
async function create(formData: FormData) {
'use server';

// Logic to mutate data...

}

// Invoke the action using the "action" attribute
return <form action={create}>...</form>;
}


在 Server Component 中呼叫 Server Action 有一個好處，那就是漸進式增強（progressive enhancement）：即使用戶端尚未載入 JavaScript，表單依然可以正常運作。舉例來說，在網路連線較慢的情況下依然可行。

## Next.js 與 Server Actions

Server Actions 也與 Next.js 的[快取機制](https://nextjs.org/docs/app/building-your-application/caching)有深度整合。當表單透過 Server Action 送出時，你不僅可以使用該 action 來異動資料，還可以使用像 `revalidatePath` 與 `revalidateTag` 這類的 API，重新驗證相關的快取。

讓我們來看看這一切是如何協同運作的！

## 建立發票

以下是你將用來建立新發票的步驟：

1. 建立一個表單，用來擷取使用者的輸入內容。
2. 建立一個 Server Action，並從表單中呼叫它。
3. 在你的 Server Action 內，從 `formData` 物件中擷取資料。
4. 驗證資料並準備好，以便插入到資料庫中。
5. 插入資料，並處理任何可能發生的錯誤。
6. 重新驗證快取，並將使用者重新導向回發票頁面。

### 一、建立新路由與表單

首先，在 `/invoices` 資料夾內，加入一個名為 `/create` 的新路由區段，並在其中建立一個 `page.tsx` 檔案：

![發票資料夾中巢狀的 create 資料夾，其中包含一個 page.tsx 檔案](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Flight%2Fcreate-invoice-route.png&w=3840&q=75)

你將使用這個路由來建立新的發票。在你的 `page.tsx` 檔案中，貼上以下程式碼，並花點時間仔細研究一下：

/dashboard/invoices/create/page.tsx

import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';

export default async function Page() {
const customers = await fetchCustomers();

return (
<main>
<Breadcrumbs
breadcrumbs={[
{ label: 'Invoices', href: '/dashboard/invoices' },
{
label: 'Create Invoice',
href: '/dashboard/invoices/create',
active: true,
},
]}
/>
<Form customers={customers} />
</main>
);
}


你的頁面是一個伺服器端元件（Server Component），它會擷取 `customers` 資料，並將其傳遞給 `<Form>` 元件。為了節省時間，我們已經事先為你建立好 `<Form>` 元件。

前往 `<Form>` 元件，你會看到這個表單具備以下內容：

- 一個 `<select>`（下拉選單）元素，列出**客戶**清單。
- 一個 `type="number"` 的 `<input>` 元素，用來輸入**金額**。
- 兩個 `type="radio"` 的 `<input>` 元素，用來設定狀態。
- 一個 `type="submit"` 的按鈕。

在 `http://localhost:3000/dashboard/invoices/create` 頁面上，你應該會看到以下的 UI 畫面：

![建立發票頁面，包含麵包屑導覽與表單](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Flight%2Fcreate-invoice-page.png&w=1920&q=75)

### 二、建立 Server Action

很好，現在讓我們建立一個 Server Action，當表單被送出時就會呼叫它。

前往你的 `lib/` 目錄，建立一個名為 `actions.ts` 的新檔案。在檔案最上方，加入 React 的[`use server`](https://react.dev/reference/react/use-server)指令：

/app/lib/actions.ts

'use server';


透過加入 `'use server'`，你將這個檔案中所有匯出的函式都標記為 Server Actions。這些伺服器端函式接著就可以被匯入到用戶端與伺服器端元件中使用。這個檔案中任何**未被使用**的函式，都會在最終的應用程式打包過程中被自動移除。

你也可以透過在 action 內加入 `"use server"`，直接在伺服器端元件中撰寫 Server Actions。不過在這門課程中，我們會將所有的 actions 統一整理在一個獨立的檔案裡。我們建議你為 actions 建立一個獨立的檔案。

在你的 `actions.ts` 檔案中，建立一個接收 `formData` 的新非同步函式：

/app/lib/actions.ts

'use server';

export async function createInvoice(formData: FormData) {}


接著，在你的 `<Form>` 元件中，從 `actions.ts` 檔案匯入 `createInvoice`。在 `<form>` 元素上加入 `action` 屬性，並呼叫 `createInvoice` 這個 action。

/app/ui/invoices/create-form.tsx

import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
CheckIcon,
ClockIcon,
CurrencyDollarIcon,
UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createInvoice } from '@/app/lib/actions';

export default function Form({
customers,
}: {
customers: CustomerField[];
}) {
return (
<form action={createInvoice}>
// ...
)
}


> **小知識：**
> 在 HTML 中，你會將一個 URL 傳入 `action` 屬性，這個 URL 會是表單資料要送出的目的地（通常是一個 API 端點）。
>
> 然而，在 React 中，`action` 屬性被視為一個特殊的 prop，這代表 React 在這個基礎上進行了擴充，讓 actions 可以被呼叫。
>
> 在幕後，Server Actions 會自動建立一個 `POST` API 端點。這也是為什麼在使用 Server Actions 時，你不需要手動建立 API 端點的原因。

### 三、從 `formData` 中擷取資料

回到你的 `actions.ts` 檔案，你需要擷取 `formData` 的值，這裡有[幾種方法](https://developer.mozilla.org/en-US/docs/Web/API/FormData)可以使用。在這個範例中，讓我們使用[`.get(name)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData/get)這個方法。

/app/lib/actions.ts

'use server';

export async function createInvoice(formData: FormData) {
const rawFormData = {
customerId: formData.get('customerId'),
amount: formData.get('amount'),
status: formData.get('status'),
};
// Test it out:
console.log(rawFormData);
}


> **提示：** 如果你正在處理擁有許多欄位的表單，可以考慮搭配 JavaScript 的[`Object.fromEntries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries)，使用[`entries()`](https://developer.mozilla.org/en-US/docs/Web/API/FormData/entries)這個方法。

為了確認所有東西都正確連結在一起，試著操作一下表單。送出表單後，你應該會在你的**終端機**（而不是瀏覽器）中，看到你剛剛輸入到表單中的資料被記錄下來。

現在你的資料已經是物件的形式，處理起來會方便許多。

### 四、驗證並準備資料

在將表單資料送到資料庫之前，你需要確保資料的格式與型別都正確無誤。如果你還記得課程稍早提到的內容，你的發票資料表預期的資料格式如下：

/app/lib/definitions.ts

export type Invoice = {
id: string; // Will be created on the database
customer_id: string;
amount: number; // Stored in cents
status: 'pending' | 'paid';
date: string;
};


到目前為止，你只從表單中取得了 `customer_id`、`amount` 與 `status` 這幾項資料。

#### 型別驗證與型別轉換

驗證表單資料是否符合資料庫預期的型別，是很重要的一件事。舉例來說，如果你在你的 action 內加入一段 `console.log`：

console.log(typeof rawFormData.amount);


你會注意到 `amount` 的型別是 `string`，而不是 `number`。這是因為 `type="number"` 的 `input` 元素，實際上回傳的其實是字串，而不是數字！

要處理型別驗證，你有幾種選擇。雖然你可以手動驗證型別，但使用型別驗證函式庫可以幫你省下不少時間與心力。在這個範例中，我們會使用[Zod](https://zod.dev/)，這是一個以 TypeScript 為優先設計理念的驗證函式庫，可以幫你簡化這項工作。

在你的 `actions.ts` 檔案中，匯入 Zod，並定義一個與表單物件結構相符的 schema。這個 schema 會在資料儲存到資料庫之前，先對 `formData` 進行驗證。

/app/lib/actions.ts

'use server';

import { z } from 'zod';

const FormSchema = z.object({
id: z.string(),
customerId: z.string(),
amount: z.coerce.number(),
status: z.enum(['pending', 'paid']),
date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
// ...
}


`amount` 這個欄位被特別設定為強制轉換（coerce），將字串轉換成數字，同時也會驗證其型別。

接著，你可以將 `rawFormData` 傳入 `CreateInvoice`，以驗證資料的型別：

/app/lib/actions.ts

// ...
export async function createInvoice(formData: FormData) {
const { customerId, amount, status } = CreateInvoice.parse({
customerId: formData.get('customerId'),
amount: formData.get('amount'),
status: formData.get('status'),
});
}


#### 以分為單位儲存金額

通常來說，將金額以「分」為單位儲存在資料庫中會是比較好的做法，這樣可以避免 JavaScript 浮點數運算的誤差，並確保更高的精確度。

讓我們將金額轉換成以分為單位：

/app/lib/actions.ts

// ...
export async function createInvoice(formData: FormData) {
const { customerId, amount, status } = CreateInvoice.parse({
customerId: formData.get('customerId'),
amount: formData.get('amount'),
status: formData.get('status'),
});
const amountInCents = amount * 100;
}


#### 建立新的日期資料

最後，讓我們以「YYYY-MM-DD」的格式，建立一個代表發票建立日期的新日期資料：

/app/lib/actions.ts

// ...
export async function createInvoice(formData: FormData) {
const { customerId, amount, status } = CreateInvoice.parse({
customerId: formData.get('customerId'),
amount: formData.get('amount'),
status: formData.get('status'),
});
const amountInCents = amount * 100;
const date = new Date().toISOString().split('T')[0];
}


### 五、將資料插入資料庫

現在你已經準備好所有資料庫所需要的資料，你可以撰寫一個 SQL 查詢，將新的發票插入資料庫，並傳入這些變數：

/app/lib/actions.ts

import { z } from 'zod';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// ...

export async function createInvoice(formData: FormData) {
const { customerId, amount, status } = CreateInvoice.parse({
customerId: formData.get('customerId'),
amount: formData.get('amount'),
status: formData.get('status'),
});
const amountInCents = amount * 100;
const date = new Date().toISOString().split('T')[0];

await sql    INSERT INTO invoices (customer_id, amount, status, date)     VALUES (${customerId}, ${amountInCents}, ${status}, ${date})  ;
}


目前，我們還沒有處理任何錯誤，我們會在下一章討論這個部分。現在，讓我們繼續進行下一個步驟。

### 六、重新驗證並重新導向

Next.js 具備一個用戶端路由快取（client-side router cache），會在使用者的瀏覽器中，將路由區段暫存一段時間。搭配[預先擷取（prefetching）](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#1-prefetching)機制，這個快取能確保使用者可以在路由之間快速切換，同時減少向伺服器發出的請求數量。

由於你正在更新發票路由中顯示的資料，你會希望清除這個快取，並觸發一個新的伺服器請求。你可以使用 Next.js 的[`revalidatePath`](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)函式來做到這一點：

/app/lib/actions.ts

'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// ...

export async function createInvoice(formData: FormData) {
const { customerId, amount, status } = CreateInvoice.parse({
customerId: formData.get('customerId'),
amount: formData.get('amount'),
status: formData.get('status'),
});
const amountInCents = amount * 100;
const date = new Date().toISOString().split('T')[0];

await sql    INSERT INTO invoices (customer_id, amount, status, date)     VALUES (${customerId}, ${amountInCents}, ${status}, ${date})  ;

revalidatePath('/dashboard/invoices');
}


一旦資料庫更新完成，`/dashboard/invoices` 這個路徑就會被重新驗證，並從伺服器擷取最新的資料。

此時，你還會想把使用者重新導向回 `/dashboard/invoices` 頁面。你可以使用 Next.js 的[`redirect`](https://nextjs.org/docs/app/api-reference/functions/redirect)函式來達成：

/app/lib/actions.ts

'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// ...

export async function createInvoice(formData: FormData) {
// ...

revalidatePath('/dashboard/invoices');
redirect('/dashboard/invoices');
}


恭喜！你剛剛完成了你的第一個 Server Action。試著新增一筆發票來測試看看，如果一切運作正常：

1. 送出表單後，你應該會被重新導向到 `/dashboard/invoices` 路由。
2. 你應該會在資料表最上方看到剛剛新增的發票。

## 更新發票

更新發票的表單與建立發票的表單類似，只不過你需要傳入發票的 `id`，才能更新資料庫中對應的紀錄。讓我們來看看該如何取得並傳遞發票的 `id`。

以下是你將用來更新發票的步驟：

1. 建立一個帶有發票 `id` 的新動態路由區段。
2. 從頁面的 params 中讀取發票的 `id`。
3. 從資料庫中擷取特定的發票資料。
4. 為表單預先帶入該發票的資料。
5. 更新資料庫中的發票資料。

### 一、建立帶有發票 `id` 的動態路由區段

當你不確定確切的路由區段名稱，並想根據資料建立對應的路由時，Next.js 讓你可以建立[動態路由區段（Dynamic Route Segments）](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)。這可能會用在部落格文章標題、商品頁面等情境。你可以將資料夾名稱用方括號包起來，藉此建立動態路由區段，例如 `[id]`、`[post]` 或 `[slug]`。

在你的 `/invoices` 資料夾中，建立一個名為 `[id]` 的新動態路由，接著在其中建立一個名為 `edit` 的新路由，並加入一個 `page.tsx` 檔案。你的檔案結構應該會像這樣：

![發票資料夾中巢狀的 [id] 資料夾，其中包含一個 edit 資料夾](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Flight%2Fedit-invoice-route.png&w=3840&q=75)

在你的 `<Table>` 元件中，你會注意到有一個 `<UpdateInvoice />` 按鈕，它會從資料表紀錄中接收發票的 `id`。

/app/ui/invoices/table.tsx

export default async function InvoicesTable({
query,
currentPage,
}: {
query: string;
currentPage: number;
}) {
return (
// ...
<td className="flex justify-end gap-2 whitespace-nowrap px-6 py-4 text-sm">
<UpdateInvoice id={invoice.id} />
<DeleteInvoice id={invoice.id} />
</td>
// ...
);
}


前往你的 `<UpdateInvoice />` 元件，將 `Link` 的 `href` 更新為接收 `id` 這個 prop。你可以使用樣板字面值（template literals）來連結到動態路由區段：

/app/ui/invoices/buttons.tsx

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// ...

export function UpdateInvoice({ id }: { id: string }) {
return (
<Link
href={/dashboard/invoices/${id}/edit}
className="rounded-md border p-2 hover:bg-gray-100"
>
<PencilIcon className="w-5" />
</Link>
);
}


### 二、從頁面的 `params` 讀取發票的 `id`

回到你的 `<Page>` 元件，貼上以下程式碼：

/app/dashboard/invoices/[id]/edit/page.tsx

import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';

export default async function Page() {
return (
<main>
<Breadcrumbs
breadcrumbs={[
{ label: 'Invoices', href: '/dashboard/invoices' },
{
label: 'Edit Invoice',
href: /dashboard/invoices/${id}/edit,
active: true,
},
]}
/>
<Form invoice={invoice} customers={customers} />
</main>
);
}


你會發現這與你的 `/create` 發票頁面很相似，只是它匯入了另一個不同的表單（來自 `edit-form.tsx` 檔案）。這個表單應該要**預先帶入**客戶名稱、發票金額與狀態的 `defaultValue`。要預先帶入表單欄位，你需要使用 `id` 來擷取特定的發票資料。

除了 `searchParams` 之外，頁面元件也可以接收一個名為 `params` 的 prop，你可以用它來存取 `id`。更新你的 `<Page>` 元件，讓它可以接收這個 prop：

/app/dashboard/invoices/[id]/edit/page.tsx

import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';

export default async function Page(props: { params: Promise<{ id: string }> }) {
const params = await props.params;
const id = params.id;
// ...
}


### 三、擷取特定的發票資料

接著：

- 匯入一個名為 `fetchInvoiceById` 的新函式，並將 `id` 作為引數傳入。
- 匯入 `fetchCustomers`，用來擷取下拉選單中所需的客戶名稱資料。

你可以使用 `Promise.all`，以平行的方式同時擷取發票與客戶資料：

/dashboard/invoices/[id]/edit/page.tsx

import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';

export default async function Page(props: { params: Promise<{ id: string }> }) {
const params = await props.params;
const id = params.id;
const [invoice, customers] = await Promise.all([
fetchInvoiceById(id),
fetchCustomers(),
]);
// ...
}


你會在終端機中看到一個暫時性的 TypeScript 錯誤，出現在 `invoice` 這個 prop 上，因為 `invoice` 有可能是 `undefined`。現在先不用擔心這個問題，你會在下一章加入錯誤處理機制時解決它。

太好了！現在，測試一下確認所有東西都正確串接起來。造訪 `http://localhost:3000/dashboard/invoices`，點擊鉛筆圖示來編輯一筆發票。切換頁面後，你應該會看到一個已經預先帶入發票詳細資料的表單：

![編輯發票頁面，包含麵包屑導覽與表單](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Flight%2Fedit-invoice-page.png&w=1920&q=75)

URL 也應該會更新，並帶有 `id`，格式如下：`http://localhost:3000/dashboard/invoice/uuid/edit`

> **UUID 與自動遞增鍵值的比較**
>
> 我們使用 UUID，而不是使用像 1、2、3 這樣遞增的鍵值。這會讓 URL 變得比較長，然而，UUID 消除了 ID 發生碰撞的風險，具有全域唯一性，並降低了列舉攻擊（enumeration attacks）的風險，因此非常適合用於大型資料庫。
>
> 不過，如果你偏好比較簡潔的 URL，你可能會更傾向於使用自動遞增鍵值。

### 四、將 `id` 傳入 Server Action

最後，你需要將 `id` 傳入 Server Action，才能更新資料庫中正確的紀錄。你**不能**像這樣直接將 `id` 當作引數傳入：

/app/ui/invoices/edit-form.tsx

// Passing an id as argument won't work

<form action={updateInvoice(id)}> ```

取而代之，你可以使用 JS 的 bind，將 id 傳入 Server Action。這樣可以確保傳入 Server Action 的所有數值都會經過編碼處理。

/app/ui/invoices/edit-form.tsx

// ...
import { updateInvoice } from '@/app/lib/actions';

export default function EditInvoiceForm({
  invoice,
  customers,
}: {
  invoice: InvoiceForm;
  customers: CustomerField[];
}) {
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);

  return <form action={updateInvoiceWithId}>{/* ... */}</form>;
}

注意： 在表單中使用隱藏的 input 欄位也是可行的做法（例如 <input type="hidden" name="id" value={invoice.id} />）。不過，這些數值會以完整文字的形式出現在 HTML 原始碼中，對於較敏感的資料來說並不理想。

接著，在你的 actions.ts 檔案中，建立一個新的 action，命名為 updateInvoice：

/app/lib/actions.ts

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// ...

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

與 createInvoice 這個 action 類似，在這裡你做了以下事情：

從 formData 中擷取資料。
使用 Zod 驗證資料型別。
將金額轉換成以分為單位。
將這些變數傳入 SQL 查詢中。
呼叫 revalidatePath，清除用戶端快取，並發出一個新的伺服器請求。
呼叫 redirect，將使用者重新導向到發票頁面。

編輯一筆發票，測試看看效果。送出表單後，你應該會被重新導向到發票頁面，且該筆發票的資料應該已經更新完成。

刪除發票

要使用 Server Action 刪除一筆發票，請將刪除按鈕包裹在一個 <form> 元素中，並使用 bind 將 id 傳入 Server Action：

/app/ui/invoices/buttons.tsx

import { deleteInvoice } from '@/app/lib/actions';

// ...

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);

  return (
    <form action={deleteInvoiceWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}

在你的 actions.ts 檔案中，建立一個名為 deleteInvoice 的新 action。

/app/lib/actions.ts

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

由於這個 action 是在 /dashboard/invoices 路徑中被呼叫的，你並不需要呼叫 redirect。呼叫 revalidatePath 就會觸發一個新的伺服器請求，並重新渲染資料表。

延伸閱讀

在這一章中，你學到了如何使用 Server Actions 來異動資料。你也學到了如何使用 revalidatePath API 重新驗證 Next.js 的快取，以及如何使用 redirect 將使用者重新導向到新的頁面。

你也可以進一步閱讀關於Server Actions 安全性的相關內容，作為額外的學習資源。

你已完成第十一章

恭喜！你已經學會如何使用表單與 React Server Actions 來異動資料。

下一步

12：處理錯誤（Handling Errors）

讓我們一起探索使用表單異動資料的最佳實務，包括錯誤處理與無障礙設計。

開始第十二章