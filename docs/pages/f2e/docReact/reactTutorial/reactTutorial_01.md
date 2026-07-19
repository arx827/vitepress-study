---
title: 'React 從零到深入實作手把手教學：個人化任務與效能追蹤系統'
---

# 第一章：專案啟動與基礎環境建置
## 1.1 課程介紹與專案概覽
  歡迎來到本 React 從零到深入實作手把手教學！本課程將引導您從頭開始，逐步建構一個功能豐富、介面現代化的「個人化任務與效能追蹤系統 (Personal Productivity Hub)」。此專案不僅能作為您學習 React 的實戰演練，更是一個具備面試競爭力的作品集項目，能全面展示您作為前端開發者的核心技能。

  ### 為何選擇此專案作為面試作品集？
  在當今競爭激烈的前端開發市場中，一個能夠展現您綜合能力的專案至關重要。本專案涵蓋了現代 React 開發的諸多關鍵技術與最佳實踐，包括：
  - **組件化開發 (Component-based Development)**：學習如何將複雜 UI 拆解為可重用、可維護的組件。
  - **狀態管理 (State Management)**：從基礎的 `useState`、`useReducer` 到進階的 Context API，甚至可選的 Redux Toolkit 或 Zustand，讓您掌握不同層次的狀態管理方案。
  - **路由管理 (Routing)**：使用 React Router DOM 實現單頁應用程式 (SPA) 的導航。
  - **API 整合 (API Integration)**：模擬後端 API 進行資料的增、刪、改、查操作。
  - **UI/UX 設計與響應式佈局 (Responsive Design)**：透過 Tailwind CSS 快速構建美觀且適應不同裝置的介面。
  - **數據視覺化 (Data Visualization)**：整合圖表庫，將數據轉化為直觀的視覺呈現。
  - **TypeScript 應用 (TypeScript Application)**：提升程式碼的健壯性與可維護性。

  ### 專案核心功能與技術棧介紹
  本專案將圍繞以下核心功能模組展開：
  - **使用者認證**：安全地處理用戶註冊、登入、登出。
  - **任務管理**：完整的任務 CRUD (Create, Read, Update, Delete) 操作，支援分類、標籤、日期與優先級設定。
  - **筆記管理**：提供富文本編輯功能，方便記錄與整理資訊。
  - **番茄鐘計時器**：提升專注力與時間管理效率的工具。
  - **個人儀表板**：整合各項數據，提供個人生產力概覽。
  - **數據視覺化**：透過圖表分析生產力趨勢。

  我們將主要聚焦於前端技術棧，包括 `React 18+`、`TypeScript`、`Vite`、`Tailwind CSS`、`React Router DOM`、`React Hook Form` 等。透過這些工具，您將能夠構建出一個專業且具備高度實用性的應用程式。

  ### 預期學習成果
  完成本教學後，您將能夠：
  - 獨立啟動並配置一個現代化的 React 專案。
  - 熟練運用 React 核心概念與 Hooks 進行開發。
  - 掌握狀態管理、路由、表單處理等常見前端開發挑戰的解決方案。
  - 設計並實作響應式且使用者友好的 UI 介面。
  - 理解並應用 TypeScript 提升程式碼品質。
  - 將專案部署上線，並為面試做好充分準備。

## 1.2 開發環境設定
  在開始編寫程式碼之前，我們需要確保您的開發環境已正確設定。以下是您需要安裝的工具：

  ### 1. **Node.js 與 npm/yarn**
  - `Node.js` 是一個 `JavaScript` 運行環境，`npm` (Node Package Manager) 或 `yarn` 則是其套件管理器。它們是 `React` 開發的基石。
  
  - 請前往 [Node.js 官方網站](https://nodejs.org/) 下載並安裝最新 `LTS` (長期支援) 版本。安裝過程中會自動包含 `npm`。
  
  - 安裝完成後，開啟終端機 (Terminal) 或命令提示字元 (Command Prompt)，輸入以下指令驗證安裝是否成功：
    ```bash
    node -v
    npm -v
    # 或者如果您偏好使用 yarn
    npm install -g yarn
    yarn -v
    ```

  ### 2. **VS Code 推薦擴充功能與設定**
  - [Visual Studio Code (VS Code)](https://code.visualstudio.com/) 是目前最受歡迎的程式碼編輯器之一，擁有豐富的擴充功能生態系統。
  
  - 以下是幾個推薦的 VS Code `擴充功能`，它們將極大地提升您的開發效率：
    - **ESLint**：幫助您保持程式碼風格一致性並捕捉潛在錯誤。
    - **Prettier - Code formatter**：自動格式化程式碼，確保團隊成員間的程式碼風格統一。
    - **Tailwind CSS IntelliSense**：為 Tailwind CSS 提供自動完成、語法高亮和 Linting 功能。
    - **React Developer Tools**：瀏覽器擴充功能，用於調試 React 組件。
    - **TypeScript React Native Snippets**：提供快速生成 React 和 TypeScript 程式碼片段的功能。
  
  - 您可以在 `VS Code` 的擴充功能市場中搜尋並安裝這些擴充功能。

## 1.3 使用 Vite 建立 React + TypeScript 專案
  我們將使用 [Vite](https://vitejs.dev/) 作為專案的建構工具。`Vite` 是一個快速、輕量級的現代前端建構工具，它利用瀏覽器的原生 ES 模組功能，提供極速的開發伺服器啟動和熱模組替換 (HMR) 體驗。
  
  ### 1. **`npm create vite@latest` 指令詳解**
  - 開啟您的終端機，導航到您希望建立專案的目錄，然後執行以下指令：
    ```bash
    npm create vite@latest my-productivity-hub -- --template react-ts
    ```
  
  - `npm create vite@latest`: 這是使用 npm 建立 Vite 專案的標準指令。
  
  - `my-productivity-hub`: 這是您的專案名稱，它將作為專案的根目錄名稱。您可以將其替換為您喜歡的名稱。
  
  - `-- --template react-ts`: 這是傳遞給 Vite 的選項，指示它使用 `react-ts` 模板，即一個預配置好的 React + TypeScript 專案。

  ### 2. **專案初始化與檔案結構解析**
  - 指令執行完成後，進入新建立的專案目錄：
    ```bash
    cd my-productivity-hub
    ```
  
  - 安裝專案依賴：
    ```bash
    npm install
    # 或者如果您使用 yarn
    yarn
    ```
  
  - 現在，您可以使用 `VS Code` 打開這個專案目錄。您會看到類似以下的檔案結構：
    ```
    my-productivity-hub/
    ├── public/
    │   └── vite.svg
    ├── src/
    │   ├── assets/
    │   │   └── react.svg
    │   ├── App.css
    │   ├── App.tsx
    │   ├── index.css
    │   ├── main.tsx
    │   ├── vite-env.d.ts
    │   └── components/ (您將在此處建立組件)
    ├── .eslintrc.cjs
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── README.md
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
    ```
    - `public/`: 存放靜態資源，例如 favicon、圖片等，這些資源會直接複製到最終的構建目錄。
    - `src/`: 專案的原始碼目錄。
      - `assets/`: 存放應用程式使用的圖片、字體等資源。
      - `App.tsx`: 應用程式的主要組件。
      - `main.tsx`: 應用程式的入口文件，負責渲染根組件。
      - `index.css`, `App.css`: 樣式文件。
      - `vite-env.d.ts`: Vite 提供的 TypeScript 環境聲明文件。
    - `index.html`: 應用程式的 HTML 模板文件。
    - `package.json`: 專案的配置文件，包含專案資訊、依賴、腳本等。
    - `tsconfig.json`, `tsconfig.node.json`: TypeScript 的配置文件。
    - `vite.config.ts`: Vite 的配置文件。

  ### 3. **運行開發伺服器**
  - 在終端機中執行以下指令，啟動開發伺服器：
    ```bash
    npm run dev
    # 或者
    yarn dev
    ```
  
  - 您的瀏覽器會自動打開 `http://localhost:5173` (或類似的端口)，您將看到 Vite 和 React 的歡迎頁面。這表示您的專案已成功啟動！

## 1.4 整合 Tailwind CSS
  [Tailwind CSS](https://tailwindcss.com/) 是一個實用工具優先的 CSS 框架，它提供了一系列預定義的 CSS 類別，讓您可以直接在 HTML 中快速構建複雜的設計，而無需編寫自訂 CSS。這將大大加速我們的 UI 開發過程。

  ### 1. **安裝與配置 Tailwind CSS**
  - 首先，確保您在專案根目錄下，然後執行以下指令安裝 `Tailwind CSS` 及其相關依賴：
    ```bash
    npm install -D tailwindcss @tailwindcss/postcss postcss
    # 或者
    yarn add -D tailwindcss @tailwindcss/postcss postcss
    ```
  
  - 接著，手動於根目錄，新增 `postcss.config.js` 的配置文件：
    ```js
    export default {
      plugins: {
        '@tailwindcss/postcss': {},
      },
    }
    ```
    > Tailwind v4 後不再使用 tailwind.config.js，內建自動加前綴功能(autoprefixer 已不用再自己安裝套件)。

  ### 2. **引入 Tailwind CSS 到您的專案**
  - 打開 `src/index.css` 文件，並將其內容替換為以下 `Tailwind CSS` 的指令：
    ```css
    @import "tailwindcss";
    ```

    > v4，改成只需要加一行 tailwindcss

  ### 3. **驗證 Tailwind CSS**
  - 現在，您可以嘗試在 `src/App.tsx` 中使用 `Tailwind CSS` 的類別來驗證它是否正常工作。將 `App.tsx` 的內容修改為：
    ```tsx
    function App() {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <h1 className="text-4xl font-bold text-blue-600">Hello Tailwind CSS!</h1>
        </div>
      )
    }

    export default App
    ```
  
  - 保存文件後，如果開發伺服器仍在運行，瀏覽器會自動刷新。您應該會看到一個藍色粗體的 
`Hello Tailwind CSS!` 字樣，這表示 `Tailwind CSS` 已成功整合。

## 1.5 Git 初始化與版本控制
  [Git](https://git-scm.com/) 是一個開源的分散式版本控制系統，它能幫助您追蹤程式碼的變更、協同合作，並在需要時回溯到舊版本。將您的專案納入 `Git` 管理並上傳到 `GitHub`，是展示您開發流程和程式碼管理能力的重要一環。

  ### 1. **Git 基本指令**
  - 如果您的系統尚未安裝 `Git`，請前往 [Git 官方網站](https://git-scm.com/downloads) 下載並安裝。
  
  - 在專案根目錄下，初始化 `Git` 倉庫：
    ```bash
    git init
    ```

  - 將所有文件添加到暫存區：
    ```bash
    git add .
    ```

  - 提交您的第一次變更：
    ```bash
    git commit -m "feat: Initialize project with Vite, React, TypeScript, and Tailwind CSS"
    ```
  
  - 常用指令：
    - `git status`: 查看文件狀態。
    - `git log`: 查看提交歷史。
    - `git branch <branch-name>`: 建立新分支。
    - `git checkout <branch-name>`: 切換分支。
    - `git merge <branch-name>`: 合併分支。

  ### 2. **GitHub 帳號建立與遠端倉庫連結**
  - 如果您還沒有 `GitHub` 帳號，請前往 [GitHub 網站](https://github.com/) 註冊一個。
  
  - 在 `GitHub` 上建立一個新的空倉庫 (Repository)，不要勾選初始化 README、.gitignore 或 License。
    
  - 回到您的終端機，將本地倉庫連結到 `GitHub` 遠端倉庫：
    ```bash
    git remote add origin <您的 GitHub 倉庫 URL>
    git branch -M main
    git push -u origin main
    ```
    - 將 `<您的 GitHub 倉庫 URL>` 替換為您在 `GitHub` 上建立的倉庫的 `HTTPS` 或 `SSH URL`。
  
  - 現在，您的專案程式碼已經成功上傳到 `GitHub`，您可以隨時查看您的提交歷史和程式碼。