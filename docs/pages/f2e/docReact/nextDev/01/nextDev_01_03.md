---
title: '[Next.js官網] Next.js 16.2 教程'
---

# 字型與圖片最佳化
  - 在上一章中，你學到了如何為 `Next.js` 應用程式設計樣式。接下來，讓我們透過加入自訂字型與主視覺圖片（hero image），繼續完成你的首頁。

  :::info **本章內容**
  以下是本章將涵蓋的主題：
  - 如何使用 `next/font` 加入自訂字型。
  - 如何使用 `next/image` 加入圖片。
  - `Next.js` 是如何最佳化字型與圖片的。
  :::

## 為什麼要最佳化字型
  - 字型在網站的設計上扮演相當重要的角色，但如果專案中使用自訂字型，而字型檔案需要額外擷取與載入，就可能會影響效能。

  - [Cumulative Layout Shift](https://vercel.com/blog/how-core-web-vitals-affect-seo) 是 `Google` 用來評估網站效能與使用者體驗的一項指標。就字型而言，版面偏移（layout shift）發生的情況是：瀏覽器一開始以備援字型（fallback）或系統字型渲染文字，等到自訂字型載入完成後才將其替換。這樣的替換可能會導致文字大小、間距或版面配置改變，進而使周圍的元素位置跟著偏移。

    ![模擬介面畫面，顯示頁面初次載入的狀態，以及自訂字型載入後所產生的版面偏移。](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_03_01.avif)

  - 當你使用 `next/font` 模組時，`Next.js` 會自動為應用程式中的字型進行最佳化。它會在 `建構（build）階段` 下載字型檔案，並將其與其他靜態資源一併託管。這代表當使用者造訪你的應用程式時，不會有額外的字型網路請求，也就不會因此影響效能。

## 加入主要字型
  - 讓我們為你的應用程式加入一個自訂的 `Google` 字型，看看它是如何運作的。

  - 在你的 `/app/ui` 資料夾中，建立一個新檔案，命名為 `fonts.ts`。你將使用這個檔案，統一存放整個應用程式中會用到的字型。

  - 從 `next/font/google` 模組匯入 `Inter` 字型，這會作為你的主要字型。接著，指定你想要載入的 [子集（subset）](https://fonts.google.com/knowledge/glossary/subsetting)，在這個範例中是 `'latin'`：

    ```ts
    // /app/ui/fonts.ts
    import { Inter } from 'next/font/google';
    export const inter = Inter({ subsets: ['latin'] });
    ```

  - 最後，將這個字型加入 `/app/layout.tsx` 中的 `<body>` 元素：
    
    ```tsx {3,11}
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
          <body className={`${inter.className} antialiased`}>{children}</body>
        </html>
      );
    }
    ```

  - 透過將 `Inter` 加入 `<body>` 元素，這個字型就會套用到整個應用程式。這裡你同時加入了 `Tailwind` 的[`antialiased`](https://tailwindcss.com/docs/font-smoothing) 類別，可以讓字型顯示得更平滑。使用這個類別並非必要，但它能為畫面增添一些細膩的質感。

  - 打開瀏覽器，開啟開發者工具，選取 `body` 元素，你應該會在樣式中看到已套用 `Inter` 與 `Inter_Fallback`。

## 練習：加入第二種字型
  - 你也可以針對應用程式中特定的元素加入字型。

  - 現在輪到你了！在 `fonts.ts` 檔案中，匯入一個名為 `Lusitana` 的第二種字型，並將它套用到 `/app/page.tsx` 檔案中的 `<p>` 元素上。除了像之前一樣指定子集之外，你還需要指定不同的字重（weight），例如 `400`（一般）與 `700`（粗體）。

  :::info > **提示：**
  - 如果你不確定該傳入哪些字重選項，可以查看程式碼編輯器中的 `TypeScript` 錯誤訊息。
  - 造訪 [Google Fonts](https://fonts.google.com/) 網站，搜尋 `Lusitana`，查看有哪些可用的選項。
  - 參考 [加入多種字型](https://nextjs.org/docs/app/building-your-application/optimizing/fonts#using-multiple-fonts) 的說明文件，以及 [完整選項列表](https://nextjs.org/docs/app/api-reference/components/font#font-function-arguments)。
  :::

  ```ts {2,6-9}
  // /app/ui/fonts.ts
  import { Inter, Lusitana } from 'next/font/google';
 
  export const inter = Inter({ subsets: ['latin'] });
  
  export const lusitana = Lusitana({
    subsets: ['latin'],
    weight: ['400', '700'],
  });
  ```

  ```tsx {5,10-12}
  // /app/page.tsx
  import AcmeLogo from '@/app/ui/acme-logo';
  import { ArrowRightIcon } from '@heroicons/react/24/outline';
  import Link from 'next/link';
  import { lusitana } from '@/app/ui/fonts';
  
  export default function Page() {
    return (
      // ...
      <p
        className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
      >
        <strong>Welcome to Acme.</strong> This is the example for the{' '}
        <a href="https://nextjs.org/learn/" className="text-blue-500">
          Next.js Learn Course
        </a>
        , brought to you by Vercel.
      </p>
      // ...
    );
  }
  ```

  - 最後，`<AcmeLogo />` 元件也使用了 `Lusitana` 字型。這個元件原本被註解掉以避免錯誤，現在你可以將它取消註解：

    ```tsx {7}
    // /app/page.tsx
    // ...
    export default function Page() {
      return (
        <main className="flex min-h-screen flex-col p-6">
          <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
            <AcmeLogo />
          </div>
        </main>
      );
    }
    ```

  - 太棒了，你已經為應用程式加入了兩種自訂字型！接下來，讓我們為首頁加入一張主視覺圖片。

## 為什麼要最佳化圖片
  - `Next.js` 可以在最上層的 [`/public`](https://nextjs.org/docs/app/building-your-application/optimizing/static-assets) 資料夾中提供 **靜態資源**，例如圖片。放在 `/public` 資料夾內的檔案，都可以在你的應用程式中被引用。

  - 如果使用一般的 `HTML`，你會像這樣加入一張圖片：
    ```html
    <img
      src="/hero.png"
      alt="Screenshots of the dashboard project showing desktop version"
    />
    ```

  - 然而，這代表你必須手動處理以下事項：
    - 確保圖片在不同螢幕尺寸下都能保持響應式（responsive）。
    - 為不同裝置指定合適的圖片尺寸。
    - 避免圖片載入時造成版面偏移。
    - 針對超出使用者 `可視範圍（viewport）` 的圖片進行 `延遲載入（lazy load）`。

  - `圖片最佳化` 在網頁開發中是一個相當龐大的主題，甚至可以說是一項獨立的專業領域。你不需要手動實作這些最佳化，而是可以使用 `next/image` 元件，自動為你的圖片進行最佳化。

## `<Image>` 元件
  - `<Image>` 元件是 HTML `<img>` 標籤的延伸版本，內建了自動圖片最佳化功能，例如：
    - 在圖片載入時自動避免版面偏移。
    - 自動調整圖片尺寸，避免將過大的圖片傳送給可視範圍較小的裝置。
    - 預設就會延遲載入圖片（圖片會在進入可視範圍時才載入）。
    - 在瀏覽器支援的情況下，以現代圖片格式提供圖片，例如 [WebP](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#webp_image) 與 [AVIF](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#avif_image)。

## 加入桌面版主視覺圖片
  - 讓我們來使用 `<Image>` 元件吧。如果你查看 `/public` 資料夾，會看到兩張圖片：`hero-desktop.png` 與 `hero-mobile.png`。這兩張圖片完全不同，會依照使用者的裝置是桌面還是行動裝置而分別顯示。

  - 在你的 `/app/page.tsx` 檔案中，從 [`next/image`](https://nextjs.org/docs/api-reference/next/image) 匯入這個元件，接著在註解下方加入圖片：
    ```tsx
    import AcmeLogo from '@/app/ui/acme-logo';
    import { ArrowRightIcon } from '@heroicons/react/24/outline';
    import Link from 'next/link';
    import { lusitana } from '@/app/ui/fonts';
    import Image from 'next/image';
    export default function Page() {
      return (
        // ...
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
        </div>
        //...
      );
    }
    ```

  - 在這裡，你將 `width` 設定為 `1000`，`height` 設定為 `760` 像素。將圖片的 `width` 與 `height` 設定好是一個良好的實務做法，可以避免版面偏移，這些數值應該要與原始圖片的長寬比「完全一致」。這些數值「並不是」圖片實際顯示的尺寸，而是用來讓系統理解實際圖片檔案長寬比的數值。

  - 你也會注意到 `hidden` 這個類別，用來在行動裝置螢幕上將該圖片從 `DOM` 中移除；而 `md:block` 則用來在桌面螢幕上顯示該圖片。

  - 現在你的首頁看起來應該會像這樣：
    ![套用自訂字型與主視覺圖片後的首頁畫面。](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_03_02.avif)

## 練習：加入行動版主視覺圖片
  - 現在輪到你了！在你剛剛加入的圖片下方，為 `hero-mobile.png` 再加入一個 `<Image>` 元件。

  - 這張圖片的 `width` 應為 `560`，`height` 應為 `620` 像素。

  - 這張圖片應該只在行動裝置螢幕上顯示，並在桌面螢幕上隱藏，你可以使用開發者工具檢查桌面版與行動版的圖片是否正確切換顯示。

    ```tsx {18-24}
    import AcmeLogo from '@/app/ui/acme-logo';
    import { ArrowRightIcon } from '@heroicons/react/24/outline';
    import Link from 'next/link';
    import { lusitana } from '@/app/ui/fonts';
    import Image from 'next/image';
    export default function Page() {
      return (
        // ...
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            className="block md:hidden"
            alt="Screenshot of the dashboard project showing mobile version"
          />
        </div>
        //...
      );
    }
    ```

  - 太棒了！你的首頁現在已經同時擁有自訂字型與主視覺圖片。

## 延伸閱讀

關於這些主題還有更多可以深入學習的內容，包括最佳化遠端圖片，以及使用本機字型檔案等等。如果你想更深入了解字型與圖片，可以參考：

- [圖片最佳化文件](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [字型最佳化文件](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [使用圖片提升網頁效能（MDN）](https://developer.mozilla.org/en-US/docs/Learn/Performance/Multimedia)
- [網頁字型（MDN）](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Web_fonts)
- [Core Web Vitals 如何影響 SEO](https://vercel.com/blog/how-core-web-vitals-affect-seo)
- [Google 在索引過程中如何處理 JavaScript](https://vercel.com/blog/how-google-handles-javascript-throughout-the-indexing-process)