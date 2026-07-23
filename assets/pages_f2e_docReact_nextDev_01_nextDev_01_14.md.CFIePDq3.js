import{_ as n,o as a,c as p,a0 as l}from"./chunks/framework.DgPozsi0.js";const o=JSON.parse('{"title":"[Next.js官網] Next.js 16.2 教程","description":"","frontmatter":{"title":"[Next.js官網] Next.js 16.2 教程"},"headers":[],"relativePath":"pages/f2e/docReact/nextDev/01/nextDev_01_14.md","filePath":"pages/f2e/docReact/nextDev/01/nextDev_01_14.md"}'),e={name:"pages/f2e/docReact/nextDev/01/nextDev_01_14.md"};function r(i,s,c,b,t,u){return a(),p("div",null,[...s[0]||(s[0]=[l(`<h1 id="加入驗證機制" tabindex="-1">加入驗證機制 <a class="header-anchor" href="#加入驗證機制" aria-label="Permalink to &quot;加入驗證機制&quot;">​</a></h1><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>在上一章中，你透過加入表單驗證與提升無障礙性，完成了發票路由的開發。在這一章中，你將為儀表板加入驗證機制。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**本章內容**</span></span>
<span class="line"><span></span></span>
<span class="line"><span>以下是本章將涵蓋的主題：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>什麼是驗證機制（authentication）。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>如何使用 NextAuth.js，為你的應用程式加入驗證機制。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>如何使用 Proxy 來重新導向使用者，並保護你的路由。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>如何使用 React 的 \`useActionState\`，處理等待狀態（pending states）與表單錯誤。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 什麼是驗證機制（authentication）？</span></span>
<span class="line"><span></span></span>
<span class="line"><span>驗證機制是現今許多網頁應用程式中的關鍵環節。它是系統用來確認使用者身分是否屬實的機制。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>一個安全的網站，通常會使用多種方式來確認使用者的身分。舉例來說，在你輸入使用者名稱與密碼之後，網站可能會傳送一組驗證碼到你的裝置上，或是使用像 Google Authenticator 這類的外部應用程式。這種雙重驗證（2FA）機制能有效提升安全性。即使有人得知了你的密碼，若沒有你獨有的驗證權杖，依然無法存取你的帳號。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 驗證機制（Authentication）與授權機制（Authorization）的差異</span></span>
<span class="line"><span></span></span>
<span class="line"><span>在網頁開發中，驗證機制（authentication）與授權機制（authorization）扮演著不同的角色：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- **驗證機制**：用來確認使用者的身分是否屬實。你會透過你所擁有的資訊（例如使用者名稱與密碼）來證明自己的身分。</span></span>
<span class="line"><span>- **授權機制**：是接下來的步驟。一旦使用者的身分獲得確認，授權機制就會決定他們可以使用應用程式中的哪些部分。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>簡單來說，驗證機制檢查的是「你是誰」，而授權機制決定的則是「你在應用程式中可以做什麼、可以存取什麼」。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 建立登入路由</span></span>
<span class="line"><span></span></span>
<span class="line"><span>首先，在你的應用程式中建立一個名為 \`/login\` 的新路由，並貼上以下程式碼：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/app/login/page.tsx</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import AcmeLogo from &#39;@/app/ui/acme-logo&#39;;</span></span>
<span class="line"><span>import LoginForm from &#39;@/app/ui/login-form&#39;;</span></span>
<span class="line"><span>import { Suspense } from &#39;react&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export default function LoginPage() {</span></span>
<span class="line"><span>return (</span></span>
<span class="line"><span>&lt;main className=&quot;flex items-center justify-center md:h-screen&quot;&gt;</span></span>
<span class="line"><span>&lt;div className=&quot;relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32&quot;&gt;</span></span>
<span class="line"><span>&lt;div className=&quot;flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36&quot;&gt;</span></span>
<span class="line"><span>&lt;div className=&quot;w-32 text-white md:w-36&quot;&gt;</span></span>
<span class="line"><span>&lt;AcmeLogo /&gt;</span></span>
<span class="line"><span>&lt;/div&gt;</span></span>
<span class="line"><span>&lt;/div&gt;</span></span>
<span class="line"><span>&lt;Suspense&gt;</span></span>
<span class="line"><span>&lt;LoginForm /&gt;</span></span>
<span class="line"><span>&lt;/Suspense&gt;</span></span>
<span class="line"><span>&lt;/div&gt;</span></span>
<span class="line"><span>&lt;/main&gt;</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>你會注意到這個頁面匯入了 \`&lt;LoginForm /&gt;\`，你會在這一章稍後更新這個元件。這個元件被包裹在 React 的 \`&lt;Suspense&gt;\` 中，因為它需要存取來自傳入請求的資訊（URL 搜尋參數）。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## NextAuth.js</span></span>
<span class="line"><span></span></span>
<span class="line"><span>我們將使用[NextAuth.js](https://nextjs.authjs.dev/)為你的應用程式加入驗證機制。NextAuth.js 將管理使用者工作階段（sessions）、登入與登出等驗證機制相關的大量複雜細節，都抽象化處理好了。雖然你可以手動實作這些功能，但這個過程可能既耗時又容易出錯。NextAuth.js 簡化了這整個流程，為 Next.js 應用程式提供了一套統一的驗證解決方案。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 設定 NextAuth.js</span></span>
<span class="line"><span></span></span>
<span class="line"><span>在終端機中執行以下指令，安裝 NextAuth.js：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Terminal</span></span>
<span class="line"><span></span></span>
<span class="line"><span>pnpm i next-auth@beta</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>在這裡，你安裝的是 NextAuth.js 的 \`beta\` 版本，這個版本與 Next.js 14 以上的版本相容。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>接著，為你的應用程式產生一組密鑰（secret key）。這組密鑰會用來加密 cookies，確保使用者工作階段的安全性。你可以在終端機中執行以下指令來產生密鑰：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Terminal</span></span>
<span class="line"><span>macOS</span></span>
<span class="line"><span></span></span>
<span class="line"><span>openssl rand -base64 32</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Windows can use https://generate-secret.vercel.app/32</span></span>
<span class="line"><span></span></span>
<span class="line"><span>接著，在你的 \`.env\` 檔案中，將產生的密鑰加入 \`AUTH_SECRET\` 這個變數：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.env</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AUTH_SECRET=your-secret-key</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>為了讓驗證機制在正式環境（production）中也能正常運作，你還需要在 Vercel 專案中更新環境變數。你可以參考這篇[指南](https://vercel.com/docs/environment-variables)，了解如何在 Vercel 中新增環境變數。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 加入 pages 選項</span></span>
<span class="line"><span></span></span>
<span class="line"><span>在你的專案根目錄建立一個 \`auth.config.ts\` 檔案，並匯出一個 \`authConfig\` 物件。這個物件將會包含 NextAuth.js 的設定選項。目前，它只會包含 \`pages\` 這個選項：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/auth.config.ts</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import type { NextAuthConfig } from &#39;next-auth&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export const authConfig = {</span></span>
<span class="line"><span>pages: {</span></span>
<span class="line"><span>signIn: &#39;/login&#39;,</span></span>
<span class="line"><span>},</span></span>
<span class="line"><span>} satisfies NextAuthConfig;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>你可以使用 \`pages\` 選項，來指定自訂登入頁面、登出頁面與錯誤頁面所對應的路由。這並非必要設定，不過透過在 \`pages\` 選項中加入 \`signIn: &#39;/login&#39;\`，使用者就會被重新導向到我們自訂的登入頁面，而不是 NextAuth.js 預設的頁面。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 使用 Next.js Proxy 保護你的路由</span></span>
<span class="line"><span></span></span>
<span class="line"><span>接著，加入保護路由所需的邏輯。這能防止未登入的使用者存取儀表板頁面。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/auth.config.ts</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import type { NextAuthConfig } from &#39;next-auth&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export const authConfig = {</span></span>
<span class="line"><span>pages: {</span></span>
<span class="line"><span>signIn: &#39;/login&#39;,</span></span>
<span class="line"><span>},</span></span>
<span class="line"><span>callbacks: {</span></span>
<span class="line"><span>authorized({ auth, request: { nextUrl } }) {</span></span>
<span class="line"><span>const isLoggedIn = !!auth?.user;</span></span>
<span class="line"><span>const isOnDashboard = nextUrl.pathname.startsWith(&#39;/dashboard&#39;);</span></span>
<span class="line"><span>if (isOnDashboard) {</span></span>
<span class="line"><span>if (isLoggedIn) return true;</span></span>
<span class="line"><span>return false; // Redirect unauthenticated users to login page</span></span>
<span class="line"><span>} else if (isLoggedIn) {</span></span>
<span class="line"><span>return Response.redirect(new URL(&#39;/dashboard&#39;, nextUrl));</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>return true;</span></span>
<span class="line"><span>},</span></span>
<span class="line"><span>},</span></span>
<span class="line"><span>providers: [], // Add providers with an empty array for now</span></span>
<span class="line"><span>} satisfies NextAuthConfig;</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`authorized\` 這個回呼函式（callback），會搭配[Next.js Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)，用來驗證某個請求是否有權限存取某個頁面。它會在請求完成之前被呼叫，並會接收到一個包含 \`auth\` 與 \`request\` 屬性的物件。\`auth\` 屬性包含了使用者的工作階段資訊，而 \`request\` 屬性則包含了傳入的請求內容。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`providers\` 選項是一個陣列，你可以在其中列出不同的登入方式。目前，為了符合 NextAuth 的設定要求，它先是一個空陣列。你會在[加入 Credentials 提供者](#加入-credentials-提供者)這個段落中，進一步認識這個選項。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>接著，你需要將 \`authConfig\` 物件匯入到 Proxy 檔案中。在你的專案根目錄，建立一個名為 \`proxy.ts\` 的檔案，並貼上以下程式碼：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/proxy.ts</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import NextAuth from &#39;next-auth&#39;;</span></span>
<span class="line"><span>import { authConfig } from &#39;./auth.config&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export default NextAuth(authConfig).auth;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export const config = {</span></span>
<span class="line"><span>// https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher</span></span>
<span class="line"><span>matcher: [&#39;/((?!api|_next/static|_next/image|.\\.png$).)&#39;],</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>在這裡，你使用 \`authConfig\` 物件初始化了 NextAuth.js，並匯出了 \`auth\` 屬性。你同時也使用了 Proxy 提供的 \`matcher\` 選項，來指定它應該在哪些特定路徑上運作。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>使用 Proxy 來處理這項任務的好處在於：受保護的路由甚至不會開始進行渲染，直到 Proxy 完成驗證為止，這同時提升了應用程式的安全性與效能。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 密碼雜湊處理（Password hashing）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>在將密碼儲存到資料庫之前，先對其進行**雜湊處理（hash）**是一個良好的實務做法。雜湊處理會將密碼轉換成一串固定長度、看起來像亂碼的字元，即使使用者的資料外洩，這也能提供一層額外的安全防護。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>在為資料庫植入初始資料時，你使用了一個名為 \`bcrypt\` 的套件，在儲存使用者密碼之前先對其進行雜湊處理。在這一章稍後，你會**再次**使用它，來比對使用者輸入的密碼與資料庫中儲存的密碼是否相符。不過，你需要為 \`bcrypt\` 這個套件建立一個獨立的檔案，因為 \`bcrypt\` 依賴的是 Node.js 的 API，而這些 API 在 Next.js Proxy 中並不可用。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>建立一個名為 \`auth.ts\` 的新檔案，展開（spread）你的 \`authConfig\` 物件：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/auth.ts</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import NextAuth from &#39;next-auth&#39;;</span></span>
<span class="line"><span>import { authConfig } from &#39;./auth.config&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export const { auth, signIn, signOut } = NextAuth({</span></span>
<span class="line"><span>...authConfig,</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 加入 Credentials 提供者</span></span>
<span class="line"><span></span></span>
<span class="line"><span>接著，你需要為 NextAuth.js 加入 \`providers\` 選項。\`providers\` 是一個陣列，你可以在其中列出不同的登入方式，例如 Google 或 GitHub。在這門課程中，我們只會專注於使用[Credentials provider](https://authjs.dev/getting-started/providers/credentials-tutorial)。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Credentials provider 讓使用者可以使用帳號與密碼登入。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/auth.ts</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import NextAuth from &#39;next-auth&#39;;</span></span>
<span class="line"><span>import { authConfig } from &#39;./auth.config&#39;;</span></span>
<span class="line"><span>import Credentials from &#39;next-auth/providers/credentials&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export const { auth, signIn, signOut } = NextAuth({</span></span>
<span class="line"><span>...authConfig,</span></span>
<span class="line"><span>providers: [Credentials({})],</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>&gt; **小知識：**</span></span>
<span class="line"><span>&gt;</span></span>
<span class="line"><span>&gt; 除此之外還有其他替代的提供者，例如[OAuth](https://authjs.dev/getting-started/providers/oauth-tutorial)或[email](https://authjs.dev/getting-started/providers/email-tutorial)。完整的選項清單請參考[NextAuth.js 文件](https://authjs.dev/getting-started/providers)。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 加入登入功能</span></span>
<span class="line"><span></span></span>
<span class="line"><span>你可以使用 \`authorize\` 函式，來處理驗證邏輯。與 Server Actions 類似，你可以使用 \`zod\`，在確認使用者是否存在於資料庫之前，先驗證電子郵件與密碼：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/auth.ts</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import NextAuth from &#39;next-auth&#39;;</span></span>
<span class="line"><span>import { authConfig } from &#39;./auth.config&#39;;</span></span>
<span class="line"><span>import Credentials from &#39;next-auth/providers/credentials&#39;;</span></span>
<span class="line"><span>import { z } from &#39;zod&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export const { auth, signIn, signOut } = NextAuth({</span></span>
<span class="line"><span>...authConfig,</span></span>
<span class="line"><span>providers: [</span></span>
<span class="line"><span>Credentials({</span></span>
<span class="line"><span>async authorize(credentials) {</span></span>
<span class="line"><span>const parsedCredentials = z</span></span>
<span class="line"><span>.object({ email: z.string().email(), password: z.string().min(6) })</span></span>
<span class="line"><span>.safeParse(credentials);</span></span>
<span class="line"><span>},</span></span>
<span class="line"><span>}),</span></span>
<span class="line"><span>],</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>驗證完帳密之後，建立一個新的 \`getUser\` 函式，用來從資料庫中查詢使用者資料。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/auth.ts</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import NextAuth from &#39;next-auth&#39;;</span></span>
<span class="line"><span>import Credentials from &#39;next-auth/providers/credentials&#39;;</span></span>
<span class="line"><span>import { authConfig } from &#39;./auth.config&#39;;</span></span>
<span class="line"><span>import { z } from &#39;zod&#39;;</span></span>
<span class="line"><span>import type { User } from &#39;@/app/lib/definitions&#39;;</span></span>
<span class="line"><span>import bcrypt from &#39;bcrypt&#39;;</span></span>
<span class="line"><span>import postgres from &#39;postgres&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const sql = postgres(process.env.POSTGRES_URL!, { ssl: &#39;require&#39; });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>async function getUser(email: string): Promise&lt;User | undefined&gt; {</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>const user = await sql&lt;User[]&gt;SELECT * FROM users WHERE email=\${email};</span></span>
<span class="line"><span>return user[0];</span></span>
<span class="line"><span>} catch (error) {</span></span>
<span class="line"><span>console.error(&#39;Failed to fetch user:&#39;, error);</span></span>
<span class="line"><span>throw new Error(&#39;Failed to fetch user.&#39;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export const { auth, signIn, signOut } = NextAuth({</span></span>
<span class="line"><span>...authConfig,</span></span>
<span class="line"><span>providers: [</span></span>
<span class="line"><span>Credentials({</span></span>
<span class="line"><span>async authorize(credentials) {</span></span>
<span class="line"><span>const parsedCredentials = z</span></span>
<span class="line"><span>.object({ email: z.string().email(), password: z.string().min(6) })</span></span>
<span class="line"><span>.safeParse(credentials);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (parsedCredentials.success) {</span></span>
<span class="line"><span>      const { email, password } = parsedCredentials.data;</span></span>
<span class="line"><span>      const user = await getUser(email);</span></span>
<span class="line"><span>      if (!user) return null;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>}),</span></span>
<span class="line"><span></span></span>
<span class="line"><span>],</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>接著，呼叫 \`bcrypt.compare\`，檢查密碼是否相符：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/auth.ts</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import NextAuth from &#39;next-auth&#39;;</span></span>
<span class="line"><span>import Credentials from &#39;next-auth/providers/credentials&#39;;</span></span>
<span class="line"><span>import { authConfig } from &#39;./auth.config&#39;;</span></span>
<span class="line"><span>import { z } from &#39;zod&#39;;</span></span>
<span class="line"><span>import type { User } from &#39;@/app/lib/definitions&#39;;</span></span>
<span class="line"><span>import bcrypt from &#39;bcrypt&#39;;</span></span>
<span class="line"><span>import postgres from &#39;postgres&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const sql = postgres(process.env.POSTGRES_URL!, { ssl: &#39;require&#39; });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export const { auth, signIn, signOut } = NextAuth({</span></span>
<span class="line"><span>...authConfig,</span></span>
<span class="line"><span>providers: [</span></span>
<span class="line"><span>Credentials({</span></span>
<span class="line"><span>async authorize(credentials) {</span></span>
<span class="line"><span>// ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (parsedCredentials.success) {</span></span>
<span class="line"><span>      const { email, password } = parsedCredentials.data;</span></span>
<span class="line"><span>      const user = await getUser(email);</span></span>
<span class="line"><span>      if (!user) return null;</span></span>
<span class="line"><span>      const passwordsMatch = await bcrypt.compare(password, user.password);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      if (passwordsMatch) return user;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    console.log(&#39;Invalid credentials&#39;);</span></span>
<span class="line"><span>    return null;</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>}),</span></span>
<span class="line"><span></span></span>
<span class="line"><span>],</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>最後，如果密碼相符，就回傳使用者資料；反之，則回傳 \`null\`，以阻止使用者登入。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 更新登入表單</span></span>
<span class="line"><span></span></span>
<span class="line"><span>現在你需要將驗證邏輯與登入表單串接起來。在你的 \`actions.ts\` 檔案中，建立一個名為 \`authenticate\` 的新 action。這個 action 應該要從 \`auth.ts\` 匯入 \`signIn\` 函式：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/app/lib/actions.ts</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&#39;use server&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import { signIn } from &#39;@/auth&#39;;</span></span>
<span class="line"><span>import { AuthError } from &#39;next-auth&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export async function authenticate(</span></span>
<span class="line"><span>prevState: string | undefined,</span></span>
<span class="line"><span>formData: FormData,</span></span>
<span class="line"><span>) {</span></span>
<span class="line"><span>try {</span></span>
<span class="line"><span>await signIn(&#39;credentials&#39;, formData);</span></span>
<span class="line"><span>} catch (error) {</span></span>
<span class="line"><span>if (error instanceof AuthError) {</span></span>
<span class="line"><span>switch (error.type) {</span></span>
<span class="line"><span>case &#39;CredentialsSignin&#39;:</span></span>
<span class="line"><span>return &#39;Invalid credentials.&#39;;</span></span>
<span class="line"><span>default:</span></span>
<span class="line"><span>return &#39;Something went wrong.&#39;;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>throw error;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>如果發生 \`&#39;CredentialsSignin&#39;\` 錯誤，你會希望顯示一則對應的錯誤訊息。你可以在[官方文件](https://errors.authjs.dev)中，進一步了解 NextAuth.js 的錯誤類型。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>最後，在你的 \`login-form.tsx\` 元件中，你可以使用 React 的 \`useActionState\`，來呼叫這個 server action、處理表單錯誤，並顯示表單的等待狀態：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app/ui/login-form.tsx</span></span>
<span class="line"><span></span></span>
<span class="line"><span>&#39;use client&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import { lusitana } from &#39;@/app/ui/fonts&#39;;</span></span>
<span class="line"><span>import {</span></span>
<span class="line"><span>AtSymbolIcon,</span></span>
<span class="line"><span>KeyIcon,</span></span>
<span class="line"><span>ExclamationCircleIcon,</span></span>
<span class="line"><span>} from &#39;@heroicons/react/24/outline&#39;;</span></span>
<span class="line"><span>import { ArrowRightIcon } from &#39;@heroicons/react/20/solid&#39;;</span></span>
<span class="line"><span>import { Button } from &#39;@/app/ui/button&#39;;</span></span>
<span class="line"><span>import { useActionState } from &#39;react&#39;;</span></span>
<span class="line"><span>import { authenticate } from &#39;@/app/lib/actions&#39;;</span></span>
<span class="line"><span>import { useSearchParams } from &#39;next/navigation&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export default function LoginForm() {</span></span>
<span class="line"><span>const searchParams = useSearchParams();</span></span>
<span class="line"><span>const callbackUrl = searchParams.get(&#39;callbackUrl&#39;) || &#39;/dashboard&#39;;</span></span>
<span class="line"><span>const [errorMessage, formAction, isPending] = useActionState(</span></span>
<span class="line"><span>authenticate,</span></span>
<span class="line"><span>undefined,</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>return (</span></span>
<span class="line"><span>&lt;form action={formAction} className=&quot;space-y-3&quot;&gt;</span></span>
<span class="line"><span>&lt;div className=&quot;flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8&quot;&gt;</span></span>
<span class="line"><span>&lt;h1 className={\${lusitana.className} mb-3 text-2xl}&gt;</span></span>
<span class="line"><span>Please log in to continue.</span></span>
<span class="line"><span>&lt;/h1&gt;</span></span>
<span class="line"><span>&lt;div className=&quot;w-full&quot;&gt;</span></span>
<span class="line"><span>&lt;div&gt;</span></span>
<span class="line"><span>&lt;label className=&quot;mb-3 mt-5 block text-xs font-medium text-gray-900&quot; htmlFor=&quot;email&quot; &gt;</span></span>
<span class="line"><span>Email</span></span>
<span class="line"><span>&lt;/label&gt;</span></span>
<span class="line"><span>&lt;div className=&quot;relative&quot;&gt;</span></span>
<span class="line"><span>&lt;input className=&quot;peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500&quot; id=&quot;email&quot; type=&quot;email&quot; name=&quot;email&quot; placeholder=&quot;Enter your email address&quot; required /&gt;</span></span>
<span class="line"><span>&lt;AtSymbolIcon className=&quot;pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900&quot; /&gt;</span></span>
<span class="line"><span>&lt;/div&gt;</span></span>
<span class="line"><span>&lt;/div&gt;</span></span>
<span class="line"><span>&lt;div className=&quot;mt-4&quot;&gt;</span></span>
<span class="line"><span>&lt;label className=&quot;mb-3 mt-5 block text-xs font-medium text-gray-900&quot; htmlFor=&quot;password&quot; &gt;</span></span>
<span class="line"><span>Password</span></span>
<span class="line"><span>&lt;/label&gt;</span></span>
<span class="line"><span>&lt;div className=&quot;relative&quot;&gt;</span></span>
<span class="line"><span>&lt;input className=&quot;peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500&quot; id=&quot;password&quot; type=&quot;password&quot; name=&quot;password&quot; placeholder=&quot;Enter password&quot; required minLength={6} /&gt;</span></span>
<span class="line"><span>&lt;KeyIcon className=&quot;pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900&quot; /&gt;</span></span>
<span class="line"><span>&lt;/div&gt;</span></span>
<span class="line"><span>&lt;/div&gt;</span></span>
<span class="line"><span>&lt;/div&gt;</span></span>
<span class="line"><span>&lt;input type=&quot;hidden&quot; name=&quot;redirectTo&quot; value={callbackUrl} /&gt;</span></span>
<span class="line"><span>&lt;Button className=&quot;mt-4 w-full&quot; aria-disabled={isPending}&gt;</span></span>
<span class="line"><span>Log in &lt;ArrowRightIcon className=&quot;ml-auto h-5 w-5 text-gray-50&quot; /&gt;</span></span>
<span class="line"><span>&lt;/Button&gt;</span></span>
<span class="line"><span>&lt;div className=&quot;flex h-8 items-end space-x-1&quot; aria-live=&quot;polite&quot; aria-atomic=&quot;true&quot; &gt;</span></span>
<span class="line"><span>{errorMessage &amp;&amp; (</span></span>
<span class="line"><span>&lt;&gt;</span></span>
<span class="line"><span>&lt;ExclamationCircleIcon className=&quot;h-5 w-5 text-red-500&quot; /&gt;</span></span>
<span class="line"><span>&lt;p className=&quot;text-sm text-red-500&quot;&gt;{errorMessage}&lt;/p&gt;</span></span>
<span class="line"><span>&lt;/&gt;</span></span>
<span class="line"><span>)}</span></span>
<span class="line"><span>&lt;/div&gt;</span></span>
<span class="line"><span>&lt;/div&gt;</span></span>
<span class="line"><span>&lt;/form&gt;</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 加入登出功能</span></span>
<span class="line"><span></span></span>
<span class="line"><span>要為 \`&lt;SideNav /&gt;\` 加入登出功能，請在你的 \`&lt;form&gt;\` 元素中呼叫來自 \`auth.ts\` 的 \`signOut\` 函式：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>/ui/dashboard/sidenav.tsx</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import Link from &#39;next/link&#39;;</span></span>
<span class="line"><span>import NavLinks from &#39;@/app/ui/dashboard/nav-links&#39;;</span></span>
<span class="line"><span>import AcmeLogo from &#39;@/app/ui/acme-logo&#39;;</span></span>
<span class="line"><span>import { PowerIcon } from &#39;@heroicons/react/24/outline&#39;;</span></span>
<span class="line"><span>import { signOut } from &#39;@/auth&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export default function SideNav() {</span></span>
<span class="line"><span>return (</span></span>
<span class="line"><span>&lt;div className=&quot;flex h-full flex-col px-3 py-4 md:px-2&quot;&gt;</span></span>
<span class="line"><span>// ...</span></span>
<span class="line"><span>&lt;div className=&quot;flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2&quot;&gt;</span></span>
<span class="line"><span>&lt;NavLinks /&gt;</span></span>
<span class="line"><span>&lt;div className=&quot;hidden h-auto w-full grow rounded-md bg-gray-50 md:block&quot;&gt;&lt;/div&gt;</span></span>
<span class="line"><span>&lt;form</span></span>
<span class="line"><span>action={async () =&gt; {</span></span>
<span class="line"><span>&#39;use server&#39;;</span></span>
<span class="line"><span>await signOut({ redirectTo: &#39;/&#39; });</span></span>
<span class="line"><span>}}</span></span>
<span class="line"><span>&gt;</span></span>
<span class="line"><span>&lt;button className=&quot;flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3&quot;&gt;</span></span>
<span class="line"><span>&lt;PowerIcon className=&quot;w-6&quot; /&gt;</span></span>
<span class="line"><span>&lt;div className=&quot;hidden md:block&quot;&gt;Sign Out&lt;/div&gt;</span></span>
<span class="line"><span>&lt;/button&gt;</span></span>
<span class="line"><span>&lt;/form&gt;</span></span>
<span class="line"><span>&lt;/div&gt;</span></span>
<span class="line"><span>&lt;/div&gt;</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 動手試試看</span></span>
<span class="line"><span></span></span>
<span class="line"><span>現在，動手試試看吧。你應該可以使用以下帳密，在你的應用程式中登入與登出：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- 電子郵件：\`user@nextmail.com\`</span></span>
<span class="line"><span>- 密碼：\`123456\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 你已完成第十四章</span></span>
<span class="line"><span></span></span>
<span class="line"><span>你已經為應用程式加入了驗證機制，並保護了你的儀表板路由。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**下一步**</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**15：加入中繼資料（Adding Metadata）**</span></span>
<span class="line"><span></span></span>
<span class="line"><span>學習如何加入中繼資料，為分享做好準備，完成你的應用程式。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[開始第十五章](https://nextjs.org/learn/dashboard-app/adding-metadata)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br><span class="line-number">124</span><br><span class="line-number">125</span><br><span class="line-number">126</span><br><span class="line-number">127</span><br><span class="line-number">128</span><br><span class="line-number">129</span><br><span class="line-number">130</span><br><span class="line-number">131</span><br><span class="line-number">132</span><br><span class="line-number">133</span><br><span class="line-number">134</span><br><span class="line-number">135</span><br><span class="line-number">136</span><br><span class="line-number">137</span><br><span class="line-number">138</span><br><span class="line-number">139</span><br><span class="line-number">140</span><br><span class="line-number">141</span><br><span class="line-number">142</span><br><span class="line-number">143</span><br><span class="line-number">144</span><br><span class="line-number">145</span><br><span class="line-number">146</span><br><span class="line-number">147</span><br><span class="line-number">148</span><br><span class="line-number">149</span><br><span class="line-number">150</span><br><span class="line-number">151</span><br><span class="line-number">152</span><br><span class="line-number">153</span><br><span class="line-number">154</span><br><span class="line-number">155</span><br><span class="line-number">156</span><br><span class="line-number">157</span><br><span class="line-number">158</span><br><span class="line-number">159</span><br><span class="line-number">160</span><br><span class="line-number">161</span><br><span class="line-number">162</span><br><span class="line-number">163</span><br><span class="line-number">164</span><br><span class="line-number">165</span><br><span class="line-number">166</span><br><span class="line-number">167</span><br><span class="line-number">168</span><br><span class="line-number">169</span><br><span class="line-number">170</span><br><span class="line-number">171</span><br><span class="line-number">172</span><br><span class="line-number">173</span><br><span class="line-number">174</span><br><span class="line-number">175</span><br><span class="line-number">176</span><br><span class="line-number">177</span><br><span class="line-number">178</span><br><span class="line-number">179</span><br><span class="line-number">180</span><br><span class="line-number">181</span><br><span class="line-number">182</span><br><span class="line-number">183</span><br><span class="line-number">184</span><br><span class="line-number">185</span><br><span class="line-number">186</span><br><span class="line-number">187</span><br><span class="line-number">188</span><br><span class="line-number">189</span><br><span class="line-number">190</span><br><span class="line-number">191</span><br><span class="line-number">192</span><br><span class="line-number">193</span><br><span class="line-number">194</span><br><span class="line-number">195</span><br><span class="line-number">196</span><br><span class="line-number">197</span><br><span class="line-number">198</span><br><span class="line-number">199</span><br><span class="line-number">200</span><br><span class="line-number">201</span><br><span class="line-number">202</span><br><span class="line-number">203</span><br><span class="line-number">204</span><br><span class="line-number">205</span><br><span class="line-number">206</span><br><span class="line-number">207</span><br><span class="line-number">208</span><br><span class="line-number">209</span><br><span class="line-number">210</span><br><span class="line-number">211</span><br><span class="line-number">212</span><br><span class="line-number">213</span><br><span class="line-number">214</span><br><span class="line-number">215</span><br><span class="line-number">216</span><br><span class="line-number">217</span><br><span class="line-number">218</span><br><span class="line-number">219</span><br><span class="line-number">220</span><br><span class="line-number">221</span><br><span class="line-number">222</span><br><span class="line-number">223</span><br><span class="line-number">224</span><br><span class="line-number">225</span><br><span class="line-number">226</span><br><span class="line-number">227</span><br><span class="line-number">228</span><br><span class="line-number">229</span><br><span class="line-number">230</span><br><span class="line-number">231</span><br><span class="line-number">232</span><br><span class="line-number">233</span><br><span class="line-number">234</span><br><span class="line-number">235</span><br><span class="line-number">236</span><br><span class="line-number">237</span><br><span class="line-number">238</span><br><span class="line-number">239</span><br><span class="line-number">240</span><br><span class="line-number">241</span><br><span class="line-number">242</span><br><span class="line-number">243</span><br><span class="line-number">244</span><br><span class="line-number">245</span><br><span class="line-number">246</span><br><span class="line-number">247</span><br><span class="line-number">248</span><br><span class="line-number">249</span><br><span class="line-number">250</span><br><span class="line-number">251</span><br><span class="line-number">252</span><br><span class="line-number">253</span><br><span class="line-number">254</span><br><span class="line-number">255</span><br><span class="line-number">256</span><br><span class="line-number">257</span><br><span class="line-number">258</span><br><span class="line-number">259</span><br><span class="line-number">260</span><br><span class="line-number">261</span><br><span class="line-number">262</span><br><span class="line-number">263</span><br><span class="line-number">264</span><br><span class="line-number">265</span><br><span class="line-number">266</span><br><span class="line-number">267</span><br><span class="line-number">268</span><br><span class="line-number">269</span><br><span class="line-number">270</span><br><span class="line-number">271</span><br><span class="line-number">272</span><br><span class="line-number">273</span><br><span class="line-number">274</span><br><span class="line-number">275</span><br><span class="line-number">276</span><br><span class="line-number">277</span><br><span class="line-number">278</span><br><span class="line-number">279</span><br><span class="line-number">280</span><br><span class="line-number">281</span><br><span class="line-number">282</span><br><span class="line-number">283</span><br><span class="line-number">284</span><br><span class="line-number">285</span><br><span class="line-number">286</span><br><span class="line-number">287</span><br><span class="line-number">288</span><br><span class="line-number">289</span><br><span class="line-number">290</span><br><span class="line-number">291</span><br><span class="line-number">292</span><br><span class="line-number">293</span><br><span class="line-number">294</span><br><span class="line-number">295</span><br><span class="line-number">296</span><br><span class="line-number">297</span><br><span class="line-number">298</span><br><span class="line-number">299</span><br><span class="line-number">300</span><br><span class="line-number">301</span><br><span class="line-number">302</span><br><span class="line-number">303</span><br><span class="line-number">304</span><br><span class="line-number">305</span><br><span class="line-number">306</span><br><span class="line-number">307</span><br><span class="line-number">308</span><br><span class="line-number">309</span><br><span class="line-number">310</span><br><span class="line-number">311</span><br><span class="line-number">312</span><br><span class="line-number">313</span><br><span class="line-number">314</span><br><span class="line-number">315</span><br><span class="line-number">316</span><br><span class="line-number">317</span><br><span class="line-number">318</span><br><span class="line-number">319</span><br><span class="line-number">320</span><br><span class="line-number">321</span><br><span class="line-number">322</span><br><span class="line-number">323</span><br><span class="line-number">324</span><br><span class="line-number">325</span><br><span class="line-number">326</span><br><span class="line-number">327</span><br><span class="line-number">328</span><br><span class="line-number">329</span><br><span class="line-number">330</span><br><span class="line-number">331</span><br><span class="line-number">332</span><br><span class="line-number">333</span><br><span class="line-number">334</span><br><span class="line-number">335</span><br><span class="line-number">336</span><br><span class="line-number">337</span><br><span class="line-number">338</span><br><span class="line-number">339</span><br><span class="line-number">340</span><br><span class="line-number">341</span><br><span class="line-number">342</span><br><span class="line-number">343</span><br><span class="line-number">344</span><br><span class="line-number">345</span><br><span class="line-number">346</span><br><span class="line-number">347</span><br><span class="line-number">348</span><br><span class="line-number">349</span><br><span class="line-number">350</span><br><span class="line-number">351</span><br><span class="line-number">352</span><br><span class="line-number">353</span><br><span class="line-number">354</span><br><span class="line-number">355</span><br><span class="line-number">356</span><br><span class="line-number">357</span><br><span class="line-number">358</span><br><span class="line-number">359</span><br><span class="line-number">360</span><br><span class="line-number">361</span><br><span class="line-number">362</span><br><span class="line-number">363</span><br><span class="line-number">364</span><br><span class="line-number">365</span><br><span class="line-number">366</span><br><span class="line-number">367</span><br><span class="line-number">368</span><br><span class="line-number">369</span><br><span class="line-number">370</span><br><span class="line-number">371</span><br><span class="line-number">372</span><br><span class="line-number">373</span><br><span class="line-number">374</span><br><span class="line-number">375</span><br><span class="line-number">376</span><br><span class="line-number">377</span><br><span class="line-number">378</span><br><span class="line-number">379</span><br><span class="line-number">380</span><br><span class="line-number">381</span><br><span class="line-number">382</span><br><span class="line-number">383</span><br><span class="line-number">384</span><br><span class="line-number">385</span><br><span class="line-number">386</span><br><span class="line-number">387</span><br><span class="line-number">388</span><br><span class="line-number">389</span><br><span class="line-number">390</span><br><span class="line-number">391</span><br><span class="line-number">392</span><br><span class="line-number">393</span><br><span class="line-number">394</span><br><span class="line-number">395</span><br><span class="line-number">396</span><br><span class="line-number">397</span><br><span class="line-number">398</span><br><span class="line-number">399</span><br><span class="line-number">400</span><br><span class="line-number">401</span><br><span class="line-number">402</span><br><span class="line-number">403</span><br><span class="line-number">404</span><br><span class="line-number">405</span><br><span class="line-number">406</span><br><span class="line-number">407</span><br><span class="line-number">408</span><br><span class="line-number">409</span><br><span class="line-number">410</span><br><span class="line-number">411</span><br><span class="line-number">412</span><br><span class="line-number">413</span><br><span class="line-number">414</span><br><span class="line-number">415</span><br><span class="line-number">416</span><br><span class="line-number">417</span><br><span class="line-number">418</span><br><span class="line-number">419</span><br><span class="line-number">420</span><br><span class="line-number">421</span><br><span class="line-number">422</span><br><span class="line-number">423</span><br><span class="line-number">424</span><br><span class="line-number">425</span><br><span class="line-number">426</span><br><span class="line-number">427</span><br><span class="line-number">428</span><br><span class="line-number">429</span><br><span class="line-number">430</span><br><span class="line-number">431</span><br><span class="line-number">432</span><br><span class="line-number">433</span><br><span class="line-number">434</span><br><span class="line-number">435</span><br><span class="line-number">436</span><br><span class="line-number">437</span><br><span class="line-number">438</span><br><span class="line-number">439</span><br><span class="line-number">440</span><br><span class="line-number">441</span><br><span class="line-number">442</span><br><span class="line-number">443</span><br><span class="line-number">444</span><br><span class="line-number">445</span><br><span class="line-number">446</span><br><span class="line-number">447</span><br><span class="line-number">448</span><br><span class="line-number">449</span><br><span class="line-number">450</span><br><span class="line-number">451</span><br><span class="line-number">452</span><br><span class="line-number">453</span><br><span class="line-number">454</span><br><span class="line-number">455</span><br><span class="line-number">456</span><br><span class="line-number">457</span><br><span class="line-number">458</span><br><span class="line-number">459</span><br><span class="line-number">460</span><br><span class="line-number">461</span><br><span class="line-number">462</span><br><span class="line-number">463</span><br><span class="line-number">464</span><br><span class="line-number">465</span><br><span class="line-number">466</span><br><span class="line-number">467</span><br><span class="line-number">468</span><br><span class="line-number">469</span><br><span class="line-number">470</span><br><span class="line-number">471</span><br><span class="line-number">472</span><br><span class="line-number">473</span><br><span class="line-number">474</span><br><span class="line-number">475</span><br></div></div>`,2)])])}const d=n(e,[["render",r]]);export{o as __pageData,d as default};
