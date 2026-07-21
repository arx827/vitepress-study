---
title: '[Next.js官網] Next.js 16.2 教程'
---

# 設定資料庫
  在你能繼續開發儀表板之前，你需要一些資料。在本章中，你將透過 [Vercel 市集整合服務](https://vercel.com/marketplace?category=storage) 之一來設定一個 `PostgreSQL` 資料庫。如果你已經熟悉 `PostgreSQL`，並偏好使用自己的資料庫供應商，你可以跳過本章，自行設定資料庫。否則，讓我們繼續吧！

  :::info **本章內容**
  以下是本章將涵蓋的主題：
  - 將你的專案推送到 `GitHub`。
  - 設定 `Vercel` 帳號，並連結你的 `GitHub repo`，以取得即時預覽與部署功能。
  - 建立資料庫，並將專案與 `Postgres` 資料庫連結。
  - 為資料庫植入初始資料。
  :::

## 建立 GitHub Repository
  - 首先，如果你還沒這麼做，讓我們先將你的 `repository` 推送到 `GitHub`。這會讓你更容易設定資料庫並進行部署。

  - 如果你需要協助設定 `repository`，可以參考 [這篇 GitHub 上的指南](https://help.github.com/en/github/getting-started-with-github/create-a-repo)。

  > **小提醒：**
  >
  > - 你也可以使用其他 git 供應商，例如 `GitLab` 或 `Bitbucket`。
  > - 如果你是 `GitHub` 新手，我們建議使用 [GitHub Desktop App](https://desktop.github.com/)，讓開發流程更簡化。

## 建立 Vercel 帳號
  - 前往 [vercel.com/signup](https://vercel.com/signup) 建立帳號。選擇免費的「`hobby`」方案。選取 **Continue with GitHub**，將你的 `GitHub` 帳號與 `Vercel` 帳號連結。

## 連結並部署你的專案
  - 接著，你會被帶到以下畫面，你可以在此選取並 **匯入（import）** 剛剛建立好的 `GitHub repository`：

    ![Vercel 儀表板畫面截圖，顯示匯入專案畫面，並列出使用者的 GitHub Repositories 清單](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_06_01.avif)

  - 為你的專案命名，然後點擊 **Deploy**。
    
    ![部署畫面，顯示專案名稱欄位與部署按鈕](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_06_02.avif)

  - 太棒了！ 你的專案現在已經部署完成。
    
    ![專案總覽畫面，顯示專案名稱、網域與部署狀態](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_06_03.avif)

  - 透過連結你的 `GitHub repository`，之後每當你將變更推送到 **main** 分支時，`Vercel` 就會自動重新部署你的應用程式，完全不需要額外設定。當你開啟 `pull request` 時，你也會取得[即時預覽網址](https://vercel.com/docs/deployments/environments#preview-environment-pre-production#preview-urls)，讓你能及早發現部署錯誤，並將專案預覽分享給團隊成員以收集回饋意見。

## 建立 Postgres 資料庫
  - 接下來，要設定資料庫，請點擊 `Continue to Dashboard`，並在專案儀表板中選取 `Storage` 分頁。選取 `Create Database`。依照你建立 `Vercel` 帳號的時間點不同，你可能會看到像 `Neon` 或 `Supabase` 這類選項。選擇你偏好的供應商，然後點擊 `Continue`。

    ![連結儲存空間畫面，顯示 Postgres 選項，以及 KV、Blob 與 Edge Config 等選項](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_06_04.avif)

  - 如有需要，選擇你的地區與儲存方案。所有 `Vercel` 專案的 [預設地區](https://vercel.com/docs/functions/configuring-functions/region) 為 `Washington D.C（iad1）`，如果可以選擇，我們建議選用這個地區，以降低資料請求的 [延遲（latency）](https://developer.mozilla.org/en-US/docs/Web/Performance/Understanding_latency)。

    ![資料庫建立視窗，顯示資料庫名稱與地區欄位](/pages/f2e/docReact/nextDev/imgs/01/nextDev_01_06_05.avif)

  - 連結完成後，切換到 `.env.local` 分頁，點擊 `Show secret`，再點擊 `Copy Snippet`。請務必先顯示這些機密資料（secrets），再進行複製。

  - 前往你的程式碼編輯器，將 `.env.example` 檔案重新命名為 `.env` 。將你剛剛從 `Vercel` 複製的內容貼上。

    > **重要：** 前往你的 `.gitignore` 檔案，並確認 `.env` 已列在忽略清單中，以避免你在推送到 `GitHub` 時，不小心洩露資料庫的機密資料。

## 為資料庫植入資料
  - 現在資料庫已經建立完成，讓我們為它植入一些初始資料。

  - 我們已經提供了一組可以在瀏覽器中存取的 `API`，它會執行一個植入資料的腳本（`seed script`），將初始資料填入資料庫中。

  - 這個腳本會使用 `SQL` 來建立資料表，並在資料表建立完成後，使用 `placeholder-data.ts` 檔案中的資料來填入這些資料表。

  - 請確認你的本機開發伺服器正透過 `pnpm run dev` 執行中，並在瀏覽器中前往 [`localhost:3000/seed`](http://localhost:3000/seed)。完成後，你會在瀏覽器中看到「`Database seeded successfully`」的訊息。完成之後，你可以刪除這個檔案。

    > **疑難排解：**
    >
    > - 請務必先顯示你的資料庫機密資料，再將其複製到 `.env` 檔案中。
    > - 這個腳本使用 `bcrypt` 來對使用者的密碼進行雜湊處理（hash），如果 `bcrypt` 與你的環境不相容，你可以將腳本改為使用 [`bcryptjs`](https://www.npmjs.com/package/bcryptjs)。
    > - 如果你在植入資料庫的過程中遇到任何問題，想要重新執行腳本，可以在資料庫查詢介面中執行 `DROP TABLE tablename` 指令，刪除既有的資料表。詳情請參考下方的 [執行查詢](#executing-queries) 段落。但請小心，這個指令會刪除資料表以及其中的所有資料。在這個範例應用程式中這樣做沒有問題，因為你使用的是佔位資料，但在正式環境的應用程式中，你「不應該」執行這個指令。

## 執行查詢
  - 讓我們執行一個查詢，確認一切運作正常。我們會使用另一個 Router Handler：`app/query/route.ts`，來查詢資料庫。在這個檔案中，你會找到一個 `listInvoices()` 函式，其中包含以下的 `SQL` 查詢：
    
    ```sql
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
    ```

  - 取消該檔案的註解，移除 `Response.json() block`，並在瀏覽器中前往 [`localhost:3000/query`](http://localhost:3000/query)。你應該會看到系統回傳了一筆發票的 `amount` 與 `name`。