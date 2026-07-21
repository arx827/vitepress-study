---
title: '[Next.js官網] Next.js 16.2 教程'
---

# 加入驗證機制

```
在上一章中，你透過加入表單驗證與提升無障礙性，完成了發票路由的開發。在這一章中，你將為儀表板加入驗證機制。

**本章內容**

以下是本章將涵蓋的主題：

什麼是驗證機制（authentication）。

如何使用 NextAuth.js，為你的應用程式加入驗證機制。

如何使用 Proxy 來重新導向使用者，並保護你的路由。

如何使用 React 的 `useActionState`，處理等待狀態（pending states）與表單錯誤。

## 什麼是驗證機制（authentication）？

驗證機制是現今許多網頁應用程式中的關鍵環節。它是系統用來確認使用者身分是否屬實的機制。

一個安全的網站，通常會使用多種方式來確認使用者的身分。舉例來說，在你輸入使用者名稱與密碼之後，網站可能會傳送一組驗證碼到你的裝置上，或是使用像 Google Authenticator 這類的外部應用程式。這種雙重驗證（2FA）機制能有效提升安全性。即使有人得知了你的密碼，若沒有你獨有的驗證權杖，依然無法存取你的帳號。

### 驗證機制（Authentication）與授權機制（Authorization）的差異

在網頁開發中，驗證機制（authentication）與授權機制（authorization）扮演著不同的角色：

- **驗證機制**：用來確認使用者的身分是否屬實。你會透過你所擁有的資訊（例如使用者名稱與密碼）來證明自己的身分。
- **授權機制**：是接下來的步驟。一旦使用者的身分獲得確認，授權機制就會決定他們可以使用應用程式中的哪些部分。

簡單來說，驗證機制檢查的是「你是誰」，而授權機制決定的則是「你在應用程式中可以做什麼、可以存取什麼」。

## 建立登入路由

首先，在你的應用程式中建立一個名為 `/login` 的新路由，並貼上以下程式碼：

/app/login/page.tsx

import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';

export default function LoginPage() {
return (
<main className="flex items-center justify-center md:h-screen">
<div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
<div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
<div className="w-32 text-white md:w-36">
<AcmeLogo />
</div>
</div>
<Suspense>
<LoginForm />
</Suspense>
</div>
</main>
);
}


你會注意到這個頁面匯入了 `<LoginForm />`，你會在這一章稍後更新這個元件。這個元件被包裹在 React 的 `<Suspense>` 中，因為它需要存取來自傳入請求的資訊（URL 搜尋參數）。

## NextAuth.js

我們將使用[NextAuth.js](https://nextjs.authjs.dev/)為你的應用程式加入驗證機制。NextAuth.js 將管理使用者工作階段（sessions）、登入與登出等驗證機制相關的大量複雜細節，都抽象化處理好了。雖然你可以手動實作這些功能，但這個過程可能既耗時又容易出錯。NextAuth.js 簡化了這整個流程，為 Next.js 應用程式提供了一套統一的驗證解決方案。

## 設定 NextAuth.js

在終端機中執行以下指令，安裝 NextAuth.js：

Terminal

pnpm i next-auth@beta


在這裡，你安裝的是 NextAuth.js 的 `beta` 版本，這個版本與 Next.js 14 以上的版本相容。

接著，為你的應用程式產生一組密鑰（secret key）。這組密鑰會用來加密 cookies，確保使用者工作階段的安全性。你可以在終端機中執行以下指令來產生密鑰：

Terminal
macOS

openssl rand -base64 32

Windows can use https://generate-secret.vercel.app/32

接著，在你的 `.env` 檔案中，將產生的密鑰加入 `AUTH_SECRET` 這個變數：

.env

AUTH_SECRET=your-secret-key


為了讓驗證機制在正式環境（production）中也能正常運作，你還需要在 Vercel 專案中更新環境變數。你可以參考這篇[指南](https://vercel.com/docs/environment-variables)，了解如何在 Vercel 中新增環境變數。

### 加入 pages 選項

在你的專案根目錄建立一個 `auth.config.ts` 檔案，並匯出一個 `authConfig` 物件。這個物件將會包含 NextAuth.js 的設定選項。目前，它只會包含 `pages` 這個選項：

/auth.config.ts

import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
pages: {
signIn: '/login',
},
} satisfies NextAuthConfig;


你可以使用 `pages` 選項，來指定自訂登入頁面、登出頁面與錯誤頁面所對應的路由。這並非必要設定，不過透過在 `pages` 選項中加入 `signIn: '/login'`，使用者就會被重新導向到我們自訂的登入頁面，而不是 NextAuth.js 預設的頁面。

## 使用 Next.js Proxy 保護你的路由

接著，加入保護路由所需的邏輯。這能防止未登入的使用者存取儀表板頁面。

/auth.config.ts

import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
pages: {
signIn: '/login',
},
callbacks: {
authorized({ auth, request: { nextUrl } }) {
const isLoggedIn = !!auth?.user;
const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
if (isOnDashboard) {
if (isLoggedIn) return true;
return false; // Redirect unauthenticated users to login page
} else if (isLoggedIn) {
return Response.redirect(new URL('/dashboard', nextUrl));
}
return true;
},
},
providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;


`authorized` 這個回呼函式（callback），會搭配[Next.js Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)，用來驗證某個請求是否有權限存取某個頁面。它會在請求完成之前被呼叫，並會接收到一個包含 `auth` 與 `request` 屬性的物件。`auth` 屬性包含了使用者的工作階段資訊，而 `request` 屬性則包含了傳入的請求內容。

`providers` 選項是一個陣列，你可以在其中列出不同的登入方式。目前，為了符合 NextAuth 的設定要求，它先是一個空陣列。你會在[加入 Credentials 提供者](#加入-credentials-提供者)這個段落中，進一步認識這個選項。

接著，你需要將 `authConfig` 物件匯入到 Proxy 檔案中。在你的專案根目錄，建立一個名為 `proxy.ts` 的檔案，並貼上以下程式碼：

/proxy.ts

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
// https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher
matcher: ['/((?!api|_next/static|_next/image|.\.png$).)'],
};


在這裡，你使用 `authConfig` 物件初始化了 NextAuth.js，並匯出了 `auth` 屬性。你同時也使用了 Proxy 提供的 `matcher` 選項，來指定它應該在哪些特定路徑上運作。

使用 Proxy 來處理這項任務的好處在於：受保護的路由甚至不會開始進行渲染，直到 Proxy 完成驗證為止，這同時提升了應用程式的安全性與效能。

### 密碼雜湊處理（Password hashing）

在將密碼儲存到資料庫之前，先對其進行**雜湊處理（hash）**是一個良好的實務做法。雜湊處理會將密碼轉換成一串固定長度、看起來像亂碼的字元，即使使用者的資料外洩，這也能提供一層額外的安全防護。

在為資料庫植入初始資料時，你使用了一個名為 `bcrypt` 的套件，在儲存使用者密碼之前先對其進行雜湊處理。在這一章稍後，你會**再次**使用它，來比對使用者輸入的密碼與資料庫中儲存的密碼是否相符。不過，你需要為 `bcrypt` 這個套件建立一個獨立的檔案，因為 `bcrypt` 依賴的是 Node.js 的 API，而這些 API 在 Next.js Proxy 中並不可用。

建立一個名為 `auth.ts` 的新檔案，展開（spread）你的 `authConfig` 物件：

/auth.ts

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const { auth, signIn, signOut } = NextAuth({
...authConfig,
});


### 加入 Credentials 提供者

接著，你需要為 NextAuth.js 加入 `providers` 選項。`providers` 是一個陣列，你可以在其中列出不同的登入方式，例如 Google 或 GitHub。在這門課程中，我們只會專注於使用[Credentials provider](https://authjs.dev/getting-started/providers/credentials-tutorial)。

Credentials provider 讓使用者可以使用帳號與密碼登入。

/auth.ts

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';

export const { auth, signIn, signOut } = NextAuth({
...authConfig,
providers: [Credentials({})],
});


> **小知識：**
>
> 除此之外還有其他替代的提供者，例如[OAuth](https://authjs.dev/getting-started/providers/oauth-tutorial)或[email](https://authjs.dev/getting-started/providers/email-tutorial)。完整的選項清單請參考[NextAuth.js 文件](https://authjs.dev/getting-started/providers)。

### 加入登入功能

你可以使用 `authorize` 函式，來處理驗證邏輯。與 Server Actions 類似，你可以使用 `zod`，在確認使用者是否存在於資料庫之前，先驗證電子郵件與密碼：

/auth.ts

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

export const { auth, signIn, signOut } = NextAuth({
...authConfig,
providers: [
Credentials({
async authorize(credentials) {
const parsedCredentials = z
.object({ email: z.string().email(), password: z.string().min(6) })
.safeParse(credentials);
},
}),
],
});


驗證完帳密之後，建立一個新的 `getUser` 函式，用來從資料庫中查詢使用者資料。

/auth.ts

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUser(email: string): Promise<User | undefined> {
try {
const user = await sql<User[]>SELECT * FROM users WHERE email=${email};
return user[0];
} catch (error) {
console.error('Failed to fetch user:', error);
throw new Error('Failed to fetch user.');
}
}

export const { auth, signIn, signOut } = NextAuth({
...authConfig,
providers: [
Credentials({
async authorize(credentials) {
const parsedCredentials = z
.object({ email: z.string().email(), password: z.string().min(6) })
.safeParse(credentials);

    if (parsedCredentials.success) {
      const { email, password } = parsedCredentials.data;
      const user = await getUser(email);
      if (!user) return null;
    }

    return null;
  },
}),

],
});


接著，呼叫 `bcrypt.compare`，檢查密碼是否相符：

/auth.ts

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// ...

export const { auth, signIn, signOut } = NextAuth({
...authConfig,
providers: [
Credentials({
async authorize(credentials) {
// ...

    if (parsedCredentials.success) {
      const { email, password } = parsedCredentials.data;
      const user = await getUser(email);
      if (!user) return null;
      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (passwordsMatch) return user;
    }

    console.log('Invalid credentials');
    return null;
  },
}),

],
});


最後，如果密碼相符，就回傳使用者資料；反之，則回傳 `null`，以阻止使用者登入。

### 更新登入表單

現在你需要將驗證邏輯與登入表單串接起來。在你的 `actions.ts` 檔案中，建立一個名為 `authenticate` 的新 action。這個 action 應該要從 `auth.ts` 匯入 `signIn` 函式：

/app/lib/actions.ts

'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// ...

export async function authenticate(
prevState: string | undefined,
formData: FormData,
) {
try {
await signIn('credentials', formData);
} catch (error) {
if (error instanceof AuthError) {
switch (error.type) {
case 'CredentialsSignin':
return 'Invalid credentials.';
default:
return 'Something went wrong.';
}
}
throw error;
}
}


如果發生 `'CredentialsSignin'` 錯誤，你會希望顯示一則對應的錯誤訊息。你可以在[官方文件](https://errors.authjs.dev)中，進一步了解 NextAuth.js 的錯誤類型。

最後，在你的 `login-form.tsx` 元件中，你可以使用 React 的 `useActionState`，來呼叫這個 server action、處理表單錯誤，並顯示表單的等待狀態：

app/ui/login-form.tsx

'use client';

import { lusitana } from '@/app/ui/fonts';
import {
AtSymbolIcon,
KeyIcon,
ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
const searchParams = useSearchParams();
const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
const [errorMessage, formAction, isPending] = useActionState(
authenticate,
undefined,
);

return (
<form action={formAction} className="space-y-3">
<div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
<h1 className={${lusitana.className} mb-3 text-2xl}>
Please log in to continue.
</h1>
<div className="w-full">
<div>
<label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="email" >
Email
</label>
<div className="relative">
<input className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500" id="email" type="email" name="email" placeholder="Enter your email address" required />
<AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
</div>
</div>
<div className="mt-4">
<label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="password" >
Password
</label>
<div className="relative">
<input className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500" id="password" type="password" name="password" placeholder="Enter password" required minLength={6} />
<KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
</div>
</div>
</div>
<input type="hidden" name="redirectTo" value={callbackUrl} />
<Button className="mt-4 w-full" aria-disabled={isPending}>
Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
</Button>
<div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true" >
{errorMessage && (
<>
<ExclamationCircleIcon className="h-5 w-5 text-red-500" />
<p className="text-sm text-red-500">{errorMessage}</p>
</>
)}
</div>
</div>
</form>
);
}


## 加入登出功能

要為 `<SideNav />` 加入登出功能，請在你的 `<form>` 元素中呼叫來自 `auth.ts` 的 `signOut` 函式：

/ui/dashboard/sidenav.tsx

import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';

export default function SideNav() {
return (
<div className="flex h-full flex-col px-3 py-4 md:px-2">
// ...
<div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
<NavLinks />
<div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
<form
action={async () => {
'use server';
await signOut({ redirectTo: '/' });
}}
>
<button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
<PowerIcon className="w-6" />
<div className="hidden md:block">Sign Out</div>
</button>
</form>
</div>
</div>
);
}


## 動手試試看

現在，動手試試看吧。你應該可以使用以下帳密，在你的應用程式中登入與登出：

- 電子郵件：`user@nextmail.com`
- 密碼：`123456`

## 你已完成第十四章

你已經為應用程式加入了驗證機制，並保護了你的儀表板路由。

**下一步**

**15：加入中繼資料（Adding Metadata）**

學習如何加入中繼資料，為分享做好準備，完成你的應用程式。

[開始第十五章](https://nextjs.org/learn/dashboard-app/adding-metadata)