---
title: '[Next.js官網] Next.js 16.2 教程'
---

# 加入中繼資料

```
中繼資料（Metadata）對於 SEO 與內容分享來說相當重要。在這一章中，我們將討論如何為你的 Next.js 應用程式加入中繼資料。

**本章內容**

以下是本章將涵蓋的主題：

什麼是中繼資料。

中繼資料的種類。

如何使用中繼資料加入 Open Graph 圖片。

如何使用中繼資料加入 favicon（網站圖示）。

## 什麼是中繼資料？

在網頁開發中，中繼資料提供了關於網頁的額外詳細資訊。造訪頁面的使用者並不會看到中繼資料，它是在幕後運作的，被嵌入在頁面的 HTML 中，通常會放在 `<head>` 元素內。這些隱藏的資訊，對於搜尋引擎以及其他需要更加理解你網頁內容的系統來說，是相當重要的。

## 為什麼中繼資料很重要？

中繼資料在強化網頁 SEO 上扮演著相當重要的角色，能讓網頁對搜尋引擎與社群媒體平台來說更容易被存取與理解。適當的中繼資料，能幫助搜尋引擎有效地為網頁建立索引，進而提升網頁在搜尋結果中的排名。此外，像 Open Graph 這類的中繼資料，也能改善連結在社群媒體上被分享時的呈現方式，讓內容對使用者來說更具吸引力、資訊也更加完整。

## 中繼資料的種類

中繼資料有許多不同的種類，每一種都有其獨特的用途。一些常見的類型包括：

**標題中繼資料（Title Metadata）**：負責網頁的標題，會顯示在瀏覽器的分頁上。這對 SEO 來說相當重要，因為它能幫助搜尋引擎理解這個網頁的內容主題。
<title>Page Title</title> ```

說明中繼資料（Description Metadata）：這種中繼資料提供了網頁內容的簡短概述，經常會顯示在搜尋引擎的結果中。

<meta name="description" content="A brief description of the page content." />

關鍵字中繼資料（Keyword Metadata）：這種中繼資料包含了與網頁內容相關的關鍵字，能幫助搜尋引擎為頁面建立索引。

<meta name="keywords" content="keyword1, keyword2, keyword3" />

Open Graph 中繼資料：這種中繼資料能強化網頁在社群媒體平台上被分享時的呈現方式，提供標題、說明與預覽圖片等資訊。

<meta property="og:title" content="Title Here" />
<meta property="og:description" content="Description Here" />
<meta property="og:image" content="image_url_here" />

Favicon 中繼資料：這種中繼資料會將 favicon（一個小圖示）連結到網頁上，並顯示在瀏覽器的網址列或分頁上。

<link rel="icon" href="path/to/favicon.ico" />
加入中繼資料

Next.js 具備一套 Metadata API，可以用來定義應用程式的中繼資料。你可以透過以下兩種方式，為你的應用程式加入中繼資料：

以設定為基礎（Config-based）：在 layout.js 或 page.js 檔案中，匯出一個靜態的 metadata 物件，或是一個動態的generateMetadata 函式。
以檔案為基礎（File-based）：Next.js 提供了一系列專門用於中繼資料用途的特殊檔案：
favicon.ico、apple-icon.jpg 與 icon.jpg：用於 favicon 與各種圖示。
opengraph-image.jpg 與 twitter-image.jpg：用於社群媒體上顯示的圖片。
robots.txt：提供搜尋引擎爬蟲的爬取指示。
sitemap.xml：提供網站結構的相關資訊。

你可以彈性地使用這些檔案來設定靜態中繼資料，也可以在專案中以程式化的方式動態產生它們。

無論使用上述哪一種方式，Next.js 都會自動為你的頁面產生相對應的 <head> 元素。

Favicon 與 Open Graph 圖片

在你的 /public 資料夾中，你會注意到有兩張圖片：favicon.ico 與 opengraph-image.jpg。

將這兩張圖片移動到你的 /app 資料夾根目錄下。

完成這個步驟後，Next.js 就會自動識別並使用這些檔案，作為你的 favicon 與 OG 圖片。你可以在開發者工具中檢查應用程式的 <head> 元素，來確認這一點。

小知識： 你也可以使用ImageResponse建構函式，動態產生 OG 圖片。

頁面標題與說明

你也可以在任何 layout.js 或 page.js 檔案中，加入一個metadata 物件，藉此加入額外的頁面資訊，例如標題與說明。任何在 layout.js 中定義的中繼資料，都會被使用該版面配置的所有頁面所繼承。

在你的根版面配置中，建立一個新的 metadata 物件，包含以下欄位：

/app/layout.tsx

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acme Dashboard',
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout() {
  // ...
}

Next.js 會自動為你的應用程式加入標題與中繼資料。

不過，如果你想為某個特定頁面加入自訂標題，該怎麼做呢？你可以直接在該頁面中加入一個 metadata 物件來達成。巢狀頁面中的中繼資料，會覆蓋父層中的中繼資料設定。

舉例來說，在 /dashboard/invoices 頁面中，你可以更新頁面標題：

/app/dashboard/invoices/page.tsx

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoices | Acme Dashboard',
};

這樣做雖然可行，但我們在每一個頁面中都重複輸入了應用程式的標題。如果有任何內容需要變更，例如公司名稱，你就得在每一個頁面中逐一更新。

取而代之，你可以使用 metadata 物件中的 title.template 欄位，來定義頁面標題的樣板（template）。這個樣板可以包含頁面標題，以及任何你想加入的其他資訊。

在你的根版面配置中，更新 metadata 物件，加入一個樣板：

/app/layout.tsx

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

樣板中的 %s 會被替換成該頁面特定的標題。

現在，在你的 /dashboard/invoices 頁面中，你可以加入頁面標題：

/app/dashboard/invoices/page.tsx

export const metadata: Metadata = {
  title: 'Invoices',
};

前往 /dashboard/invoices 頁面，檢查 <head> 元素。你應該會看到頁面標題現在變成了「Invoices | Acme Dashboard」。

練習：加入中繼資料

現在你已經學會了中繼資料的相關知識，讓我們透過練習，為其他頁面加入標題：

/login 頁面。
/dashboard/ 頁面。
/dashboard/customers 頁面。
/dashboard/invoices/create 頁面。
/dashboard/invoices/[id]/edit 頁面。

Next.js 的 Metadata API 相當強大且具彈性，讓你能完全掌控應用程式的中繼資料。在這裡，我們示範了如何加入一些基本的中繼資料，不過你還可以加入更多欄位，包括 keywords、robots、canonical 等等。歡迎自由探索官方文件，為你的應用程式加入任何你需要的其他中繼資料。

你已完成第十五章

恭喜！你已經為應用程式加入了中繼資料，也認識了 Metadata API。

下一步

16：後續步驟（Next Steps）

繼續探索 Next.js。

開始第十六章