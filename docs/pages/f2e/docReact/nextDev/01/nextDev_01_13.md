---
title: '[Next.js官網] Next.js 16.2 教程'
---

# 提升無障礙性

```
在上一章中，我們探討了如何攔截錯誤（包含 404 錯誤），並向使用者顯示備援畫面。不過，我們還需要討論拼圖中的另一塊：表單驗證。讓我們來看看，如何使用 Server Actions 實作伺服器端驗證，以及如何使用 React 的[`useActionState`](https://react.dev/reference/react/useActionState) hook 顯示表單錯誤——同時兼顧無障礙性！

**本章內容**

以下是本章將涵蓋的主題：

如何在 Next.js 中使用 `eslint-plugin-jsx-a11y`，落實無障礙設計的最佳實務。

如何實作伺服器端的表單驗證。

如何使用 React 的 `useActionState` hook 處理表單錯誤，並將錯誤顯示給使用者。

## 什麼是無障礙性（accessibility）？

無障礙性指的是設計並開發出每個人都能使用的網頁應用程式，包含身心障礙人士在內。這是一個涵蓋範圍相當廣泛的主題，涉及鍵盤導覽、語意化 HTML、圖片、色彩、影片等多個面向。

雖然我們不會在這門課程中深入探討無障礙性，但我們會討論 Next.js 中提供的無障礙功能，以及一些能讓你的應用程式更具無障礙性的常見做法。

> 如果你想更深入了解無障礙性，我們推薦[web.dev](https://web.dev/)的[無障礙學習課程](https://web.dev/learn/accessibility/)。

## 在 Next.js 中使用 ESLint 無障礙外掛

Next.js 的 ESLint 設定中包含了[`eslint-plugin-jsx-a11y`](https://www.npmjs.com/package/eslint-plugin-jsx-a11y)這個外掛，能幫助你及早找出無障礙性方面的問題。舉例來說，如果圖片沒有 `alt` 文字、`aria-*` 與 `role` 屬性使用不正確等情況，這個外掛都會提出警告。

首先安裝 ESLint：

Terminal

pnpm add -D eslint eslint-config-next


接著，在你的專案根目錄建立一個 `eslint.config.mjs` 檔案，內容如下：

eslint.config.mjs

import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = defineConfig([
...nextVitals,
globalIgnores(['.next/', 'out/', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;


這份設定使用了 `eslint-config-next/core-web-vitals`，其中包含了[`eslint-plugin-jsx-a11y`](https://www.npmjs.com/package/eslint-plugin-jsx-a11y)這個外掛，用來找出無障礙性方面的問題。

現在，在你的 `package.json` 檔案中加入 `lint` 指令：

/package.json

"scripts": {
"build": "next build",
"dev": "next dev",
"start": "next start",
"lint": "eslint ."
},


接著，在終端機中執行 `pnpm lint`：

Terminal

pnpm lint


如果沒有任何 linting 錯誤，ESLint 就不會輸出任何內容。不過，如果圖片沒有 `alt` 文字，會發生什麼事呢？讓我們來看看！

前往 `/app/ui/invoices/table.tsx`，移除圖片中的 `alt` 屬性。你可以使用編輯器的搜尋功能，快速找到 `<Image>`：

/app/ui/invoices/table.tsx

<Image
src={invoice.image_url}
className="rounded-full"
width={28}
height={28}
alt={${invoice.name}'s profile picture} // Delete this line
/>


現在再次執行 `pnpm lint`，你應該會看到以下警告：

Terminal

./app/ui/invoices/table.tsx
45:25 Warning: Image elements must have an alt prop,
either with meaningful text, or an empty string for decorative images. jsx-a11y/alt-text


雖然加入並設定 linter 並非必要步驟，但它能在你的開發過程中，有效協助找出無障礙性方面的問題。

## 提升表單的無障礙性

在我們的表單中，已經有三個地方採取了提升無障礙性的做法：

- **語意化 HTML**：使用語意化元素（如 `<input>`、`<option>` 等），而不是使用 `<div>`。這讓輔助科技（assistive technologies，簡稱 AT）能夠聚焦在輸入元素上，並向使用者提供適當的情境資訊，讓表單更容易被理解與操作。
- **標籤（Labelling）**：加入 `<label>` 與 `htmlFor` 屬性，確保每個表單欄位都有一個具描述性的文字標籤。這不僅能透過提供情境資訊來強化輔助科技的支援程度，也能提升可用性，讓使用者可以點擊標籤來聚焦到對應的輸入欄位。
- **聚焦外框（Focus Outline）**：這些欄位都經過適當的樣式設計，在被聚焦時會顯示外框。這對無障礙性來說相當關鍵，因為它能以視覺方式標示出頁面上目前作用中的元素，幫助使用鍵盤操作與螢幕報讀軟體的使用者，了解自己目前在表單中的位置。你可以按下 `tab` 鍵來驗證這一點。

這些做法為讓你的表單對許多使用者來說更具無障礙性，打下了良好的基礎。不過，它們並沒有處理**表單驗證**與**錯誤**的部分。

## 表單驗證

前往 `http://localhost:3000/dashboard/invoices/create`，送出一個空白表單，會發生什麼事？

你會得到一個錯誤！這是因為你將空白的表單數值送到了 Server Action。你可以透過在用戶端或伺服器端驗證表單，來避免這個情況發生。

### 用戶端驗證（Client-Side validation）

有幾種方式可以在用戶端驗證表單。最簡單的方式，就是依賴瀏覽器內建的表單驗證機制，只要在表單的 `<input>` 與 `<select>` 元素上加入 `required` 屬性即可。舉例來說：

/app/ui/invoices/create-form.tsx

<input id="amount" name="amount" type="number" placeholder="Enter USD amount" className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500" required />


再次送出表單，如果你嘗試以空白數值送出表單，瀏覽器就會顯示警告訊息。

這個做法通常沒有問題，因為部分輔助科技也支援瀏覽器內建的驗證機制。

除了用戶端驗證之外，另一種替代方案是伺服器端驗證。讓我們在下一個段落，看看該如何實作它。現在，如果你先前加入了 `required` 屬性，請先將它們移除。

### 伺服器端驗證（Server-Side validation）

透過在伺服器端驗證表單，你可以：

- 確保資料在送到資料庫之前，符合預期的格式。
- 降低惡意使用者繞過用戶端驗證的風險。
- 擁有一個單一且明確的標準，來定義什麼樣的資料才算是**有效**的資料。

在你的 `create-form.tsx` 元件中，從 `react` 匯入 `useActionState` hook。由於 `useActionState` 是一個 hook，你需要透過加入 `"use client"` 指令，將你的表單轉換為用戶端元件（Client Component）：

/app/ui/invoices/create-form.tsx

'use client';

// ...
import { useActionState } from 'react';


在你的表單元件內，`useActionState` hook：

- 接收兩個引數：`(action, initialState)`。
- 回傳兩個數值：`[state, formAction]`——分別是表單的狀態，以及表單送出時要呼叫的函式。

將你的 `createInvoice` action 作為引數傳入 `useActionState`，並在你的 `<form action={}>` 屬性中呼叫 `formAction`。

/app/ui/invoices/create-form.tsx

// ...
import { useActionState } from 'react';

export default function Form({ customers }: { customers: CustomerField[] }) {
const [state, formAction] = useActionState(createInvoice, initialState);

return <form action={formAction}>...</form>;
}


`initialState` 可以是你自行定義的任何內容，在這個例子中，建立一個帶有兩個空鍵值的物件：`message` 與 `errors`，並從你的 `actions.ts` 檔案中匯入 `State` 型別。`State` 目前還不存在，不過我們接下來就會建立它：

/app/ui/invoices/create-form.tsx

// ...
import { createInvoice, State } from '@/app/lib/actions';
import { useActionState } from 'react';

export default function Form({ customers }: { customers: CustomerField[] }) {
const initialState: State = { message: null, errors: {} };
const [state, formAction] = useActionState(createInvoice, initialState);

return <form action={formAction}>...</form>;
}


這一開始可能看起來有些令人困惑，不過一旦你更新了 server action，就會更容易理解。現在讓我們來完成這件事。

在你的 `action.ts` 檔案中，你可以使用 Zod 來驗證表單資料。將你的 `FormSchema` 更新如下：

/app/lib/actions.ts

const FormSchema = z.object({
id: z.string(),
customerId: z.string({
invalid_type_error: 'Please select a customer.',
}),
amount: z.coerce
.number()
.gt(0, { message: 'Please enter an amount greater than $0.' }),
status: z.enum(['pending', 'paid'], {
invalid_type_error: 'Please select an invoice status.',
}),
date: z.string(),
});


- `customerId`：由於 Zod 預期這是一個 `string` 型別，如果客戶欄位為空，Zod 已經會拋出一個錯誤。不過，讓我們在使用者未選擇客戶時，加上一則更友善的提示訊息。
- `amount`：由於你正在將 `amount` 的型別從 `string` 強制轉換為 `number`，如果字串為空，預設值就會是零。讓我們使用 `.gt()` 函式，告訴 Zod 我們希望金額永遠大於 0。
- `status`：由於 Zod 預期這個欄位的值只能是「pending」或「paid」，如果狀態欄位為空，Zod 已經會拋出一個錯誤。讓我們同樣在使用者未選擇狀態時，加上一則友善的提示訊息。

接著，更新你的 `createInvoice` action，讓它接收兩個參數：`prevState` 與 `formData`：

/app/lib/actions.ts

export type State = {
errors?: {
customerId?: string[];
amount?: string[];
status?: string[];
};
message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
// ...
}


- `formData`：與先前相同。
- `prevState`：包含從 `useActionState` hook 傳入的狀態。在這個範例中，你不會在 action 內使用到它，不過它是一個必要的 prop。

接著，將 Zod 的 `parse()` 函式改為 `safeParse()`：

/app/lib/actions.ts

export async function createInvoice(prevState: State, formData: FormData) {
// Validate form fields using Zod
const validatedFields = CreateInvoice.safeParse({
customerId: formData.get('customerId'),
amount: formData.get('amount'),
status: formData.get('status'),
});

// ...
}


`safeParse()` 會回傳一個包含 `success` 或 `error` 欄位的物件。這能幫助你更優雅地處理驗證邏輯，而不需要把這段邏輯放進 `try/catch` 區塊中。

在將資料送到資料庫之前，先用一個條件判斷式，確認表單欄位是否已經通過正確的驗證：

/app/lib/actions.ts

export async function createInvoice(prevState: State, formData: FormData) {
// Validate form fields using Zod
const validatedFields = CreateInvoice.safeParse({
customerId: formData.get('customerId'),
amount: formData.get('amount'),
status: formData.get('status'),
});

// If form validation fails, return errors early. Otherwise, continue.
if (!validatedFields.success) {
return {
errors: validatedFields.error.flatten().fieldErrors,
message: 'Missing Fields. Failed to Create Invoice.',
};
}

// ...
}


如果 `validatedFields` 驗證不成功，我們就會提早結束函式，並回傳來自 Zod 的錯誤訊息。

> **提示：** 你可以在表單中加入一個空白值並送出，同時 console.log `validatedFields`，藉此觀察它的資料結構。

最後，由於你是在 try/catch 區塊**之外**，另外處理表單驗證邏輯，你可以針對任何資料庫錯誤回傳一則特定的訊息，最終的完整程式碼應該會像這樣：

/app/lib/actions.ts

export async function createInvoice(prevState: State, formData: FormData) {
// Validate form using Zod
const validatedFields = CreateInvoice.safeParse({
customerId: formData.get('customerId'),
amount: formData.get('amount'),
status: formData.get('status'),
});

// If form validation fails, return errors early. Otherwise, continue.
if (!validatedFields.success) {
return {
errors: validatedFields.error.flatten().fieldErrors,
message: 'Missing Fields. Failed to Create Invoice.',
};
}

// Prepare data for insertion into the database
const { customerId, amount, status } = validatedFields.data;
const amountInCents = amount * 100;
const date = new Date().toISOString().split('T')[0];

// Insert data into the database
try {
await sql      INSERT INTO invoices (customer_id, amount, status, date)       VALUES (${customerId}, ${amountInCents}, ${status}, ${date})    ;
} catch (error) {
// If a database error occurs, return a more specific error.
return {
message: 'Database Error: Failed to Create Invoice.',
};
}

// Revalidate the cache for the invoices page and redirect the user.
revalidatePath('/dashboard/invoices');
redirect('/dashboard/invoices');
}


太好了，現在讓我們把這些錯誤顯示在你的表單元件中。回到 `create-form.tsx` 元件，你可以透過表單的 `state`，取得這些錯誤資訊。

加入一個**三元運算子（ternary operator）**，用來檢查每個特定欄位的錯誤。舉例來說，在客戶欄位之後，你可以加入以下程式碼：

/app/ui/invoices/create-form.tsx
<form action={formAction}> <div className="rounded-md bg-gray-50 p-4 md:p-6"> {/* Customer Name */} <div className="mb-4"> <label htmlFor="customer" className="mb-2 block text-sm font-medium"> Choose customer </label> <div className="relative"> <select id="customer" name="customerId" className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500" defaultValue="" aria-describedby="customer-error" > <option value="" disabled> Select a customer </option> {customers.map((name) => ( <option key={name.id} value={name.id}> {name.name} </option> ))} </select> <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" /> </div> <div id="customer-error" aria-live="polite" aria-atomic="true"> {state.errors?.customerId && state.errors.customerId.map((error: string) => ( <p className="mt-2 text-sm text-red-500" key={error}> {error} </p> ))} </div> </div> // ... </div> </form> ```

提示： 你可以在元件內 console.log state，確認一切是否正確串接。由於你的表單現在已經是用戶端元件，記得檢查開發者工具中的主控台。

在上面這段程式碼中，你同時也加入了以下的 aria 標籤：

aria-describedby="customer-error"：這在 select 元素與錯誤訊息容器之間建立了關聯。它代表 id="customer-error" 這個容器，是用來描述該 select 元素的。當使用者與這個下拉選單互動時，螢幕報讀軟體會讀出這段描述，藉此通知使用者發生了錯誤。
id="customer-error"：這個 id 屬性能唯一識別出用來存放 select 輸入欄位錯誤訊息的 HTML 元素。這對於 aria-describedby 建立關聯來說是必要的。
aria-live="polite"：當 div 內的錯誤訊息被更新時，螢幕報讀軟體應該要以「禮貌」的方式通知使用者。當內容發生變化時（例如使用者修正了某個錯誤），螢幕報讀軟體會宣讀這些變化，但只會在使用者處於閒置狀態時進行，以避免打斷使用者。
練習：加入 aria 標籤

參考上面的範例，為表單中其餘的欄位加入錯誤訊息。如果有欄位遺漏，你也應該在表單底部顯示一則提示訊息。你的 UI 畫面應該會像這樣：

Show Image

準備好之後，執行 pnpm lint，確認你是否正確使用了 aria 標籤。

如果你想挑戰自己，可以運用這一章學到的知識，為 edit-form.tsx 元件加入表單驗證功能。

你需要：

在你的 edit-form.tsx 元件中加入 useActionState。
修改 updateInvoice 這個 action，讓它能處理來自 Zod 的驗證錯誤。
在元件中顯示錯誤訊息，並加入 aria 標籤，藉此提升無障礙性。

準備好之後，展開下方的程式碼片段查看解答：

展開查看解答

你已完成第十三章

太好了，你已經學會如何透過 React Form Status 與伺服器端驗證，提升表單的無障礙性。

下一步

14：加入驗證機制（Adding Authentication）

你的應用程式已經接近完成，在下一章，你將學習如何使用 NextAuth.js，為你的應用程式加入驗證機制。

開始第十四章