---
title: '[Next.js官網] Next.js 16.2 教程'
---

# 入門起步

## 建立新專案
  - 我們建議使用 [pnpm](https://pnpm.io/) 作為你的套件管理工具，因為它比 `npm` 或 `yarn` 更快、更有效率。如果你尚未安裝 `pnpm`，可以透過以下指令進行全域安裝：

    ```bash
    npm install -g pnpm
    ```

  - 要建立一個 `Next.js` 應用程式，請開啟終端機，使用 [cd](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Command_line#basic_built-in_terminal_commands) 進入你想要存放專案的資料夾，然後執行以下指令：

    ```bash
    npx create-next-app@latest nextjs-dashboard --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example" --use-pnpm
    ```

  - 這個指令使用了 [create-next-app](https://nextjs.org/docs/app/api-reference/create-next-app)，這是一個指令列介面（CLI）工具，會為你設定好一個 `Next.js` 應用程式。在上面的指令中，你也使用了 `--example` 旗標，搭配這門課程的 [starter example](https://github.com/vercel/next-learn/tree/main/dashboard/starter-example)。
  
## 探索專案
  - 不同於那些要你從零開始撰寫程式碼的教學，這門課程中大部分的程式碼都已經幫你寫好了。這更貼近真實世界的開發情境，因為你在實務上通常會處理既有的程式碼庫。

  - 我們的目標是幫助你專注於學習 `Next.js` 的主要功能，而不需要撰寫「所有」的應用程式程式碼。

  - 安裝完成後，在你的程式碼編輯器中開啟專案，並切換到 `nextjs-dashboard`。
    ```bash
    cd nextjs-dashboard
    ```

  - 讓我們花一些時間來探索這個專案。

### 資料夾結構
  - 你會注意到這個專案有以下的資料夾結構：

    ![儀表板專案的資料夾結構，顯示主要資料夾與檔案：app、public 及設定檔案。](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_01_01.avif)

    - **`/app`**：包含應用程式的所有路由、元件與邏輯，這是你大部分工作的所在位置。

      - **`/app/lib`**：包含應用程式中使用的函式，例如可重複使用的工具函式與資料擷取函式。

      - **`/app/ui`**：包含應用程式的所有 UI 元件，例如卡片、表格與表單。為了節省時間，我們已經預先為這些元件設計好樣式。

    - **`/public`**：包含應用程式的所有靜態資源，例如圖片。
    
    - **`設定檔案`**：你也會注意到位於應用程式根目錄的設定檔案，例如 `next.config.ts`。這些檔案大多是在你使用 `create-next-app` 建立新專案時自動建立並預先設定好的。在這門課程中你不需要修改它們。

  - 歡迎自由探索這些資料夾，如果你現在還不完全理解程式碼在做什麼，也不用擔心。

### 佔位資料（Placeholder data）
  - 在建構使用者介面時，擁有一些佔位資料會很有幫助。如果資料庫或 API 尚未就緒，你可以：
    - 使用 `JSON 格式` 或 `JavaScript 物件` 形式的佔位資料。
    - 使用第三方服務，例如 [mockAPI](https://mockapi.io/)。

  - 在這個專案中，我們已經在 `app/lib/placeholder-data.ts` 提供了一些佔位資料。檔案中的每個 `JavaScript 物件` 都代表資料庫中的一張資料表。舉例來說，發票（invoices）資料表如下：

    ```ts
    // app/lib/placeholder-data.ts
    const invoices = [
      {
        customer_id: customers[0].id,
        amount: 15795,
        status: 'pending',
        date: '2022-12-06',
      },
      {
        customer_id: customers[1].id,
        amount: 20348,
        status: 'pending',
        date: '2022-11-14',
      },
      // ...
    ];
    ```

  - 在 [設定資料庫](/pages/f2e/docReact/nextDev/01/nextDev_01_06) 這一章中，你將使用這些資料來為資料庫「植入資料」（`seed`，即填入一些初始資料）。

### TypeScript
  - 你可能也會注意到大部分檔案都有 `.ts` 或 `.tsx` 的副檔名。這是因為這個專案是以 `TypeScript` 撰寫的。我們希望打造一門能反映現代網頁開發生態的課程。

  - 如果你不熟悉 `TypeScript` 也沒關係，我們會在需要的地方提供 `TypeScript` 程式碼片段。

  - 現在，先來看看 `/app/lib/definitions.ts` 這個檔案。在這裡，我們手動定義了將從資料庫回傳的型別。舉例來說，發票資料表具有以下型別：

    ```ts
    // app/lib/definitions.ts
    export type Invoice = {
      id: string;
      customer_id: string;
      amount: number;
      date: string;
      // In TypeScript, this is called a string union type.
      // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
      status: 'pending' | 'paid';
    };
    ```

  - 透過使用 `TypeScript`，你可以確保不會不小心將錯誤的資料格式傳遞給元件或資料庫，例如把 `string` 誤傳給發票的 `amount` 欄位，而該欄位原本應該是 `number`。

  :::info 如果你是 TypeScript 開發者
  - 我們是手動宣告資料型別的，但為了更好的型別安全性，我們建議使用 [Prisma](https://www.prisma.io/) 或 [Drizzle](https://orm.drizzle.team/)，它們可以根據你的資料庫結構自動產生型別。

  - `Next.js` 會偵測你的專案是否使用 `TypeScript`，並自動安裝所需的套件與設定。`Next.js` 也內建了 [TypeScript 外掛](https://nextjs.org/docs/app/building-your-application/configuring/typescript#typescript-plugin)，可在你的程式碼編輯器中協助自動完成與型別安全。
  :::

## 執行開發伺服器
  - 執行 `pnpm i` 以安裝專案的套件。!
    ```bash
    pnpm i
    ```

  - 接著執行 `pnpm dev` 以啟動開發伺服器。
    ```bash
    pnpm dev
    ```

  - `pnpm dev` 會在連接埠（port）`3000` 上啟動你的 `Next.js` 開發伺服器。讓我們來確認它是否正常運作。

  - 在瀏覽器中開啟 [http://localhost:3000](http://localhost:3000/)。你的首頁畫面應該會像這樣，此頁面刻意保持無樣式狀態：

  ![無樣式頁面，標題為「Acme」，並附有說明文字與登入連結。](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_01_02.avif)