# React 從零到深入實作手把手教學：個人化任務與效能追蹤系統

## 第一章：專案啟動與基礎環境建置

### 1.1 課程介紹與專案概覽

歡迎來到本 React 從零到深入實作手把手教學！本課程將引導您從頭開始，逐步建構一個功能豐富、介面現代化的「個人化任務與效能追蹤系統 (Personal Productivity Hub)」。此專案不僅能作為您學習 React 的實戰演練，更是一個具備面試競爭力的作品集項目，能全面展示您作為前端開發者的核心技能。

**為何選擇此專案作為面試作品集？**

在當今競爭激烈的前端開發市場中，一個能夠展現您綜合能力的專案至關重要。本專案涵蓋了現代 React 開發的諸多關鍵技術與最佳實踐，包括：

*   **組件化開發 (Component-based Development)**：學習如何將複雜 UI 拆解為可重用、可維護的組件。
*   **狀態管理 (State Management)**：從基礎的 `useState`、`useReducer` 到進階的 Context API，甚至可選的 Redux Toolkit 或 Zustand，讓您掌握不同層次的狀態管理方案。
*   **路由管理 (Routing)**：使用 React Router DOM 實現單頁應用程式 (SPA) 的導航。
*   **API 整合 (API Integration)**：模擬後端 API 進行資料的增、刪、改、查操作。
*   **UI/UX 設計與響應式佈局 (Responsive Design)**：透過 Tailwind CSS 快速構建美觀且適應不同裝置的介面。
*   **數據視覺化 (Data Visualization)**：整合圖表庫，將數據轉化為直觀的視覺呈現。
*   **TypeScript 應用 (TypeScript Application)**：提升程式碼的健壯性與可維護性。

**專案核心功能與技術棧介紹**

本專案將圍繞以下核心功能模組展開：

*   **使用者認證**：安全地處理用戶註冊、登入、登出。
*   **任務管理**：完整的任務 CRUD (Create, Read, Update, Delete) 操作，支援分類、標籤、日期與優先級設定。
*   **筆記管理**：提供富文本編輯功能，方便記錄與整理資訊。
*   **番茄鐘計時器**：提升專注力與時間管理效率的工具。
*   **個人儀表板**：整合各項數據，提供個人生產力概覽。
*   **數據視覺化**：透過圖表分析生產力趨勢。

我們將主要聚焦於前端技術棧，包括 React 18+、TypeScript、Vite、Tailwind CSS、React Router DOM、React Hook Form 等。透過這些工具，您將能夠構建出一個專業且具備高度實用性的應用程式。

**預期學習成果**

完成本教學後，您將能夠：

*   獨立啟動並配置一個現代化的 React 專案。
*   熟練運用 React 核心概念與 Hooks 進行開發。
*   掌握狀態管理、路由、表單處理等常見前端開發挑戰的解決方案。
*   設計並實作響應式且使用者友好的 UI 介面。
*   理解並應用 TypeScript 提升程式碼品質。
*   將專案部署上線，並為面試做好充分準備。

### 1.2 開發環境設定

在開始編寫程式碼之前，我們需要確保您的開發環境已正確設定。以下是您需要安裝的工具：

1.  **Node.js 與 npm/yarn**
    *   Node.js 是一個 JavaScript 運行環境，npm (Node Package Manager) 或 yarn 則是其套件管理器。它們是 React 開發的基石。
    *   請前往 [Node.js 官方網站](https://nodejs.org/) 下載並安裝最新 LTS (長期支援) 版本。安裝過程中會自動包含 npm。
    *   安裝完成後，開啟終端機 (Terminal) 或命令提示字元 (Command Prompt)，輸入以下指令驗證安裝是否成功：
        ```bash
        node -v
        npm -v
        # 或者如果您偏好使用 yarn
        npm install -g yarn
        yarn -v
        ```

2.  **VS Code 推薦擴充功能與設定**
    *   [Visual Studio Code (VS Code)](https://code.visualstudio.com/) 是目前最受歡迎的程式碼編輯器之一，擁有豐富的擴充功能生態系統。
    *   以下是幾個推薦的 VS Code 擴充功能，它們將極大地提升您的開發效率：
        *   **ESLint**: 幫助您保持程式碼風格一致性並捕捉潛在錯誤。
        *   **Prettier - Code formatter**: 自動格式化程式碼，確保團隊成員間的程式碼風格統一。
        *   **Tailwind CSS IntelliSense**: 為 Tailwind CSS 提供自動完成、語法高亮和 Linting 功能。
        *   **React Developer Tools**: 瀏覽器擴充功能，用於調試 React 組件。
        *   **TypeScript React Native Snippets**: 提供快速生成 React 和 TypeScript 程式碼片段的功能。
    *   您可以在 VS Code 的擴充功能市場中搜尋並安裝這些擴充功能。

### 1.3 使用 Vite 建立 React + TypeScript 專案

我們將使用 [Vite](https://vitejs.dev/) 作為專案的建構工具。Vite 是一個快速、輕量級的現代前端建構工具，它利用瀏覽器的原生 ES 模組功能，提供極速的開發伺服器啟動和熱模組替換 (HMR) 體驗。

1.  **`npm create vite@latest` 指令詳解**
    *   開啟您的終端機，導航到您希望建立專案的目錄，然後執行以下指令：
        ```bash
        npm create vite@latest my-productivity-hub -- --template react-ts
        ```
        *   `npm create vite@latest`: 這是使用 npm 建立 Vite 專案的標準指令。
        *   `my-productivity-hub`: 這是您的專案名稱，它將作為專案的根目錄名稱。您可以將其替換為您喜歡的名稱。
        *   `-- --template react-ts`: 這是傳遞給 Vite 的選項，指示它使用 `react-ts` 模板，即一個預配置好的 React + TypeScript 專案。

2.  **專案初始化與檔案結構解析**
    *   指令執行完成後，進入新建立的專案目錄：
        ```bash
        cd my-productivity-hub
        ```
    *   安裝專案依賴：
        ```bash
        npm install
        # 或者如果您使用 yarn
        yarn
        ```
    *   現在，您可以使用 VS Code 打開這個專案目錄。您會看到類似以下的檔案結構：
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
        *   `public/`: 存放靜態資源，例如 favicon、圖片等，這些資源會直接複製到最終的構建目錄。
        *   `src/`: 專案的原始碼目錄。
            *   `assets/`: 存放應用程式使用的圖片、字體等資源。
            *   `App.tsx`: 應用程式的主要組件。
            *   `main.tsx`: 應用程式的入口文件，負責渲染根組件。
            *   `index.css`, `App.css`: 樣式文件。
            *   `vite-env.d.ts`: Vite 提供的 TypeScript 環境聲明文件。
        *   `index.html`: 應用程式的 HTML 模板文件。
        *   `package.json`: 專案的配置文件，包含專案資訊、依賴、腳本等。
        *   `tsconfig.json`, `tsconfig.node.json`: TypeScript 的配置文件。
        *   `vite.config.ts`: Vite 的配置文件。

3.  **運行開發伺服器**
    *   在終端機中執行以下指令，啟動開發伺服器：
        ```bash
        npm run dev
        # 或者
        yarn dev
        ```
    *   您的瀏覽器會自動打開 `http://localhost:5173` (或類似的端口)，您將看到 Vite 和 React 的歡迎頁面。這表示您的專案已成功啟動！

### 1.4 整合 Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/) 是一個實用工具優先的 CSS 框架，它提供了一系列預定義的 CSS 類別，讓您可以直接在 HTML 中快速構建複雜的設計，而無需編寫自訂 CSS。這將大大加速我們的 UI 開發過程。

1.  **安裝與配置 Tailwind CSS**
    *   首先，確保您在專案根目錄下，然後執行以下指令安裝 Tailwind CSS 及其相關依賴：
        ```bash
        npm install -D tailwindcss postcss autoprefixer
        # 或者
        yarn add -D tailwindcss postcss autoprefixer
        ```
    *   接著，生成 Tailwind CSS 的配置文件：
        ```bash
        npx tailwindcss init -p
        ```
        這個指令會生成兩個文件：`tailwind.config.js` 和 `postcss.config.js`。

2.  **配置 `tailwind.config.js`**
    *   打開 `tailwind.config.js` 文件，將 `content` 屬性修改為以下內容，以確保 Tailwind 能夠掃描您的所有組件文件：
        ```javascript
        /** @type {import('tailwindcss').Config} */
        export default {
          content: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
          ],
          theme: {
            extend: {},
          },
          plugins: [],
        }
        ```

3.  **引入 Tailwind CSS 到您的專案**
    *   打開 `src/index.css` 文件，並將其內容替換為以下 Tailwind CSS 的指令：
        ```css
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        ```

4.  **驗證 Tailwind CSS**
    *   現在，您可以嘗試在 `src/App.tsx` 中使用 Tailwind CSS 的類別來驗證它是否正常工作。將 `App.tsx` 的內容修改為：
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
    *   保存文件後，如果開發伺服器仍在運行，瀏覽器會自動刷新。您應該會看到一個藍色粗體的 
Hello Tailwind CSS!" 字樣，這表示 Tailwind CSS 已成功整合。

### 1.5 Git 初始化與版本控制

[Git](https://git-scm.com/) 是一個開源的分散式版本控制系統，它能幫助您追蹤程式碼的變更、協同合作，並在需要時回溯到舊版本。將您的專案納入 Git 管理並上傳到 GitHub，是展示您開發流程和程式碼管理能力的重要一環。

1.  **Git 基本指令**
    *   如果您的系統尚未安裝 Git，請前往 [Git 官方網站](https://git-scm.com/downloads) 下載並安裝。
    *   在專案根目錄下，初始化 Git 倉庫：
        ```bash
        git init
        ```
    *   將所有文件添加到暫存區：
        ```bash
        git add .
        ```
    *   提交您的第一次變更：
        ```bash
        git commit -m "feat: Initialize project with Vite, React, TypeScript, and Tailwind CSS"
        ```
    *   常用指令：
        *   `git status`: 查看文件狀態。
        *   `git log`: 查看提交歷史。
        *   `git branch <branch-name>`: 建立新分支。
        *   `git checkout <branch-name>`: 切換分支。
        *   `git merge <branch-name>`: 合併分支。

2.  **GitHub 帳號建立與遠端倉庫連結**
    *   如果您還沒有 GitHub 帳號，請前往 [GitHub 網站](https://github.com/) 註冊一個。
    *   在 GitHub 上建立一個新的空倉庫 (Repository)，不要勾選初始化 README、.gitignore 或 License。
    *   回到您的終端機，將本地倉庫連結到 GitHub 遠端倉庫：
        ```bash
        git remote add origin <您的 GitHub 倉庫 URL>
        git branch -M main
        git push -u origin main
        ```
        *   將 `<您的 GitHub 倉庫 URL>` 替換為您在 GitHub 上建立的倉庫的 HTTPS 或 SSH URL。
    *   現在，您的專案程式碼已經成功上傳到 GitHub，您可以隨時查看您的提交歷史和程式碼。

--- 

## 第二章：核心 UI 組件與佈局

在本章中，我們將開始構建應用程式的基礎 UI 組件和整體佈局。一個良好設計的 UI 不僅能提升使用者體驗，也能讓您的專案在面試中脫穎而出。我們將利用 Tailwind CSS 的強大功能，快速且靈活地實現響應式設計。

### 2.1 設計系統基礎

在開始編寫組件之前，定義一些設計系統的基礎元素，如顏色、字體和間距，將有助於保持 UI 的一致性。

1.  **顏色、字體、間距規範**
    *   Tailwind CSS 預設提供了一套豐富的顏色、字體和間距選項。我們可以在 `tailwind.config.js` 中進行擴展或自訂，以符合我們的品牌風格。
    *   打開 `tailwind.config.js`，在 `theme.extend` 中添加自訂顏色。例如，我們為應用程式定義一個主色調和輔助色調：
        ```javascript
        /** @type {import('tailwindcss').Config} */
        export default {
          content: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
          ],
          theme: {
            extend: {
              colors: {
                primary: '#3B82F6', // 藍色作為主色調
                secondary: '#10B981', // 綠色作為輔助色調
                dark: '#1F2937', // 深色文本或背景
                light: '#F9FAFB', // 淺色背景
                'gray-text': '#6B7280', // 灰色文本
              },
              fontFamily: {
                sans: ['Inter', 'sans-serif'], // 使用 Inter 字體，或您偏好的字體
              },
            },
          },
          plugins: [],
        }
        ```
    *   **字體**：為了使用 `Inter` 字體，您需要在 `index.html` 中引入它。在 `<head>` 標籤內添加：
        ```html
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        ```
    *   **間距**：Tailwind CSS 預設的間距比例尺 (spacing scale) 已經非常完善，通常無需額外自訂。例如 `p-4` 代表 `padding: 1rem` (16px)。

2.  **響應式設計斷點設定**
    *   Tailwind CSS 預設提供了 `sm`, `md`, `lg`, `xl`, `2xl` 等斷點，這些斷點通常足以應對大多數響應式設計需求。您也可以在 `tailwind.config.js` 中自訂這些斷點。
    *   例如，`md:flex` 表示在中等螢幕尺寸及以上應用 `display: flex`。

### 2.2 通用 UI 組件開發

我們將從最基礎的通用 UI 組件開始，這些組件將在整個應用程式中重複使用，確保一致性和可維護性。

1.  **按鈕 (Button) 組件**
    *   在 `src` 目錄下建立一個 `components` 資料夾，並在其中建立 `Button.tsx` 文件。
    *   `src/components/Button.tsx`：
        ```tsx
        import React from 'react';

        interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
          variant?: 'primary' | 'secondary' | 'danger' | 'outline';
          size?: 'sm' | 'md' | 'lg';
          children: React.ReactNode;
        }

        const Button: React.FC<ButtonProps> = ({
          children,
          variant = 'primary',
          size = 'md',
          className = '',
          ...props
        }) => {
          const baseStyles = 'font-medium rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';

          const variantStyles = {
            primary: 'bg-primary text-white hover:bg-blue-700 focus:ring-primary',
            secondary: 'bg-secondary text-white hover:bg-green-700 focus:ring-secondary',
            danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
            outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-200',
          };

          const sizeStyles = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-5 py-2.5 text-lg',
          };

          return (
            <button
              className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
              {...props}
            >
              {children}
            </button>
          );
        };

        export default Button;
        ```
    *   這個 `Button` 組件支援不同的 `variant` (樣式) 和 `size` (大小)，並能接受額外的 `className` 和標準的 HTML `button` 屬性。

2.  **輸入框 (Input) 組件**
    *   `src/components/Input.tsx`：
        ```tsx
        import React from 'react';

        interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
          label?: string;
          id: string;
          error?: string;
        }

        const Input: React.FC<InputProps> = ({
          label,
          id,
          error,
          className = '',
          ...props
        }) => {
          const baseStyles = 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm';
          const errorStyles = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';

          return (
            <div className="mb-4">
              {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
              )}
              <input
                id={id}
                className={`${baseStyles} ${errorStyles} ${className}`}
                {...props}
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
          );
        };

        export default Input;
        ```
    *   此 `Input` 組件包含 `label` 和 `error` 屬性，方便表單處理和錯誤提示。

3.  **卡片 (Card) 組件**
    *   `src/components/Card.tsx`：
        ```tsx
        import React from 'react';

        interface CardProps {
          children: React.ReactNode;
          className?: string;
        }

        const Card: React.FC<CardProps> = ({ children, className = '' }) => {
          return (
            <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>
              {children}
            </div>
          );
        };

        export default Card;
        ```
    *   `Card` 組件提供一個通用的容器，用於包裹內容，使其具有陰影和圓角。

4.  **模態框 (Modal) 組件**
    *   `src/components/Modal.tsx`：
        ```tsx
        import React, { Fragment } from 'react';
        import { Dialog, Transition } from '@headlessui/react';

        interface ModalProps {
          isOpen: boolean;
          onClose: () => void;
          title: string;
          children: React.ReactNode;
        }

        const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
          return (
            <Transition appear show={isOpen} as={Fragment}>
              <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          {title}
                        </Dialog.Title>
                        <div className="mt-2">
                          {children}
                        </div>

                        <div className="mt-4">
                          <Button type="button" variant="outline" onClick={onClose}>
                            關閉
                          </Button>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          );
        };

        export default Modal;
        ```
    *   此 `Modal` 組件使用了 `@headlessui/react` 庫來處理可訪問性和動畫，提供了一個可重用的彈出視窗。

### 2.3 應用程式佈局

現在我們將這些通用組件組合起來，構建應用程式的整體佈局，包括導航欄和主內容區。

1.  **建立 `Layout` 組件**
    *   `src/components/Layout.tsx`：
        ```tsx
        import React, { useState } from 'react';
        import { Link, NavLink } from 'react-router-dom';
        import { HomeIcon, ListBulletIcon, DocumentTextIcon, Cog6ToothIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

        interface LayoutProps {
          children: React.ReactNode;
        }

        const Layout: React.FC<LayoutProps> = ({ children }) => {
          const [sidebarOpen, setSidebarOpen] = useState(false);

          const navigation = [
            { name: '儀表板', href: '/', icon: HomeIcon },
            { name: '任務', href: '/tasks', icon: ListBulletIcon },
            { name: '筆記', href: '/notes', icon: DocumentTextIcon },
            { name: '設定', href: '/settings', icon: Cog6ToothIcon },
          ];

          return (
            <div className="flex h-screen bg-gray-100 font-sans">
              {/* Mobile sidebar */}
              <div
                className={`fixed inset-0 z-40 flex md:hidden ${sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'}
                transition-transform duration-300`}
                role="dialog" aria-modal="true"
              >
                <div className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition
                    show={sidebarOpen}
                    enter="transition-opacity ease-linear duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition>

                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-dark px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                      <Link to="/" className="text-white text-xl font-bold">
                        Productivity Hub
                      </Link>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <NavLink
                                  to={item.href}
                                  className={({ isActive }) =>
                                    `group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${isActive
                                      ? 'bg-primary text-white'
                                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
                                  }
                                  onClick={() => setSidebarOpen(false)}
                                >
                                  <item.icon
                                    className="h-6 w-6 shrink-0"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>

              {/* Desktop sidebar */}
              <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:z-50 md:w-64">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-dark px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <Link to="/" className="text-white text-xl font-bold">
                      Productivity Hub
                    </Link>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <NavLink
                                to={item.href}
                                className={({ isActive }) =>
                                  `group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${isActive
                                    ? 'bg-primary text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
                                }
                              >
                                <item.icon
                                  className="h-6 w-6 shrink-0"
                                  aria-hidden="true"
                                />
                                {item.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="mt-auto">
                        <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-300">
                          <img
                            className="h-8 w-8 rounded-full bg-gray-800"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                          />
                          <span className="sr-only">Your profile</span>
                          <span>Alex Johnson</span>
                        </div>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>

              <div className="flex flex-1 flex-col md:pl-64">
                <div className="sticky top-0 z-40 md:hidden flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-700 md:hidden"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <span className="sr-only">Open sidebar</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <div className="flex-1 text-base font-semibold leading-6 text-gray-900">
                    {/* Page Title will go here */}
                  </div>
                </div>

                <main className="flex-1 py-6">
                  <div className="px-4 sm:px-6 lg:px-8 h-full">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          );
        };

        export default Layout;
        ```
    *   這個 `Layout` 組件包含了響應式的側邊欄導航。在桌面版上，側邊欄會固定顯示；在行動版上，它會隱藏起來，並可以透過一個漢堡選單按鈕來切換顯示。
    *   我們使用了 `@heroicons/react` 來獲取圖標，請先安裝它：
        ```bash
        npm install @heroicons/react
        # 或者
        yarn add @heroicons/react
        ```
    *   `NavLink` 用於導航連結，它會根據當前路由自動添加 `active` 類別，方便我們設定活躍狀態的樣式。

2.  **整合 `Layout` 到 `App.tsx`**
    *   修改 `src/App.tsx`，將 `Layout` 組件包裹住您的應用程式內容。目前我們還沒有路由，所以先簡單展示：
        ```tsx
        import React from 'react';
        import Layout from './components/Layout';

        function App() {
          return (
            <Layout>
              <h1 className="text-2xl font-bold text-gray-900">歡迎來到 Productivity Hub!</h1>
              <p className="mt-2 text-gray-600">開始您的生產力之旅。</p>
            </Layout>
          );
        }

        export default App;
        ```
    *   運行 `npm run dev`，您應該會看到一個帶有側邊欄的佈局，以及主內容區的歡迎訊息。

### 2.4 頁面標題與麵包屑 (Breadcrumbs) 組件 (Optional)

為了提升使用者體驗，我們可以在每個頁面顯示當前頁面的標題，並可選地添加麵包屑導航。

1.  **`PageHeader` 組件**
    *   `src/components/PageHeader.tsx`：
        ```tsx
        import React from 'react';

        interface PageHeaderProps {
          title: string;
          description?: string;
        }

        const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
          return (
            <div className="mb-6">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">{title}</h1>
              {description && <p className="mt-2 text-base text-gray-600">{description}</p>}
            </div>
          );
        };

        export default PageHeader;
        ```

2.  **使用 `PageHeader`**
    *   在 `App.tsx` 中使用 `PageHeader`：
        ```tsx
        import React from 'react';
        import Layout from '@/components/Layout';
        import PageHeader from '@/components/PageHeader';

        function App() {
          return (
            <Layout>
              <PageHeader
                title="儀表板"
                description="概覽您的任務、筆記和生產力數據。"
              />
              {/* 其他儀表板內容 */}
              <p className="mt-2 text-gray-600">開始您的生產力之旅。</p>
            </Layout>
          );
        }

        export default App;
        ```

至此，我們已經完成了應用程式的基礎 UI 組件和整體佈局。在下一章中，我們將整合 React Router DOM，實現頁面之間的導航和路由保護。

---

## 第三章：路由管理與頁面建立

在本章中，我們將深入學習如何使用 React Router DOM 來管理應用程式的路由，並建立各個主要頁面。React Router DOM 是 React 應用程式中最常用的路由解決方案，它允許我們在不重新載入整個頁面的情況下，實現不同視圖之間的切換，從而提供流暢的單頁應用程式 (SPA) 體驗。

### 3.1 React Router DOM 基礎

1.  **安裝與配置 `BrowserRouter`, `Routes`, `Route`**
    *   首先，在您的專案中安裝 `react-router-dom`：
        ```bash
        npm install react-router-dom
        # 或者
        yarn add react-router-dom
        ```
    *   安裝完成後，我們需要在應用程式的根組件 (`src/main.tsx`) 中配置路由。打開 `src/main.tsx` 並修改為以下內容：
        ```tsx
        import React from 'react';
        import ReactDOM from 'react-dom/client';
        import App from '@/App.tsx';
        import '@/index.css';
        import { BrowserRouter } from 'react-router-dom';

        ReactDOM.createRoot(document.getElementById('root')!).render(
          <React.StrictMode>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </React.StrictMode>,
        );
        ```
        *   `BrowserRouter` 是 React Router DOM 的核心組件，它使用 HTML5 歷史 API (pushState, replaceState 和 popstate 事件) 來保持 UI 與 URL 的同步。
    *   接下來，我們將在 `App.tsx` 中定義應用程式的路由。打開 `src/App.tsx` 並修改為以下內容：
        ```tsx
        import React from 'react';
        import { Routes, Route } from 'react-router-dom';
        import Layout from '@/components/Layout';
        import PageHeader from '@/components/PageHeader';

        // 引入頁面組件 (稍後會建立)
        const DashboardPage = () => (
          <>
            <PageHeader title="儀表板" description="概覽您的任務、筆記和生產力數據。" />
            <p>儀表板內容</p>
          </>
        );
        const TasksPage = () => (
          <>
            <PageHeader title="任務" description="管理您的所有任務。" />
            <p>任務列表內容</p>
          </>
        );
        const NotesPage = () => (
          <>
            <PageHeader title="筆記" description="記錄您的想法和靈感。" />
            <p>筆記列表內容</p>
          </>
        );
        const SettingsPage = () => (
          <>
            <PageHeader title="設定" description="調整您的個人偏好。" />
            <p>設定內容</p>
          </>
        );
        const LoginPage = () => (
          <>
            <PageHeader title="登入" description="請輸入您的帳號密碼。" />
            <p>登入表單</p>
          </>
        );
        const RegisterPage = () => (
          <>
            <PageHeader title="註冊" description="建立一個新帳號。" />
            <p>註冊表單</p>
          </>
        );

        function App() {
          return (
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/*"
                element={
                  <Layout>
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/tasks" element={<TasksPage />} />
                      <Route path="/notes" element={<NotesPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      {/* 巢狀路由和動態路由將在此處添加 */}
                    </Routes>
                  </Layout>
                }
              />
            </Routes>
          );
        }

        export default App;
        ```
        *   `Routes` 組件用於包裹所有的 `Route`，它會根據當前 URL 匹配第一個符合的 `Route` 並渲染其 `element`。
        *   `Route` 組件定義了特定的路徑 (`path`) 和當該路徑被匹配時應渲染的組件 (`element`)。
        *   我們將 `Layout` 組件作為一個父級路由，這樣所有需要佈局的頁面都會被包裹在其中。而 `/login` 和 `/register` 頁面則獨立於佈局之外。

2.  **`Link` 與 `NavLink` 的使用**
    *   在 `Layout.tsx` 中，我們已經使用了 `Link` 和 `NavLink` 來創建導航連結。它們是 React Router DOM 提供的組件，用於在應用程式內部進行導航，而不會觸發瀏覽器重新載入頁面。
    *   `Link`：用於簡單的導航，當點擊時會改變 URL 並渲染對應的組件。
        ```tsx
        import { Link } from 'react-router-dom';
        // ...
        <Link to="/dashboard">前往儀表板</Link>
        ```
    *   `NavLink`：與 `Link` 類似，但它會根據當前 URL 是否匹配其 `to` 屬性，自動添加 `active` 類別。這對於導航菜單中高亮顯示當前活躍項目非常有用。
        ```tsx
        import { NavLink } from 'react-router-dom';
        // ...
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            isActive ? 'active-link-styles' : 'inactive-link-styles'
          }
        >
          任務
        </NavLink>
        ```
        在 `Layout.tsx` 中，我們已經利用 `NavLink` 的 `isActive` 屬性來動態應用 Tailwind CSS 類別，以高亮顯示當前選中的導航項目。

### 3.2 建立主要頁面

現在我們將為應用程式的每個主要功能模組建立獨立的頁面組件。這些組件將是未來添加具體功能的地方。

1.  **建立頁面組件檔案**
    *   在 `src` 目錄下建立一個 `pages` 資料夾。
    *   在 `src/pages` 中建立以下檔案：
        *   `DashboardPage.tsx`
        *   `TasksPage.tsx`
        *   `NotesPage.tsx`
        *   `SettingsPage.tsx`
        *   `LoginPage.tsx`
        *   `RegisterPage.tsx`

2.  **`DashboardPage.tsx`**
    *   ```tsx
        import React from 'react';
        import PageHeader from '@/components/PageHeader';

        const DashboardPage: React.FC = () => {
          return (
            <div>
              <PageHeader title="儀表板" description="概覽您的任務、筆記和生產力數據。" />
              {/* 未來將在此處添加儀表板的具體內容，例如任務摘要、生產力圖表等 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">今日任務</div>
                <div className="bg-white p-6 rounded-lg shadow">生產力趨勢</div>
                <div className="bg-white p-6 rounded-lg shadow">番茄鐘</div>
                <div className="bg-white p-6 rounded-lg shadow">近期筆記</div>
              </div>
            </div>
          );
        };

        export default DashboardPage;
        ```

3.  **`TasksPage.tsx`**
    *   ```tsx
        import React from 'react';
        import PageHeader from '@/components/PageHeader';

        const TasksPage: React.FC = () => {
          return (
            <div>
              <PageHeader title="任務" description="管理您的所有任務。" />
              {/* 未來將在此處添加任務列表、篩選、排序等功能 */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">所有任務</h2>
                {/* 任務列表組件 */}
                <p>任務列表將顯示在這裡。</p>
              </div>
            </div>
          );
        };

        export default TasksPage;
        ```

4.  **`NotesPage.tsx`**
    *   ```tsx
        import React from 'react';
        import PageHeader from '@/components/PageHeader';

        const NotesPage: React.FC = () => {
          return (
            <div>
              <PageHeader title="筆記" description="記錄您的想法和靈感。" />
              {/* 未來將在此處添加筆記列表、編輯器等功能 */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">所有筆記</h2>
                {/* 筆記列表組件 */}
                <p>筆記列表將顯示在這裡。</p>
              </div>
            </div>
          );
        };

        export default NotesPage;
        ```

5.  **`SettingsPage.tsx`**
    *   ```tsx
        import React from 'react';
        import PageHeader from '@/components/PageHeader';

        const SettingsPage: React.FC = () => {
          return (
            <div>
              <PageHeader title="設定" description="調整您的個人偏好。" />
              {/* 未來將在此處添加設定選項，例如個人資料、主題切換等 */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">帳戶設定</h2>
                <p>設定選項將顯示在這裡。</p>
              </div>
            </div>
          );
        };

        export default SettingsPage;
        ```

6.  **`LoginPage.tsx`**
    *   ```tsx
        import React from 'react';
        import { Link } from 'react-router-dom';
        import Input from '../components/Input';
        import Button from '../components/Button';

        const LoginPage: React.FC = () => {
          return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">登入您的帳戶</h2>
                <form>
                  <Input id="email" label="電子郵件" type="email" placeholder="您的電子郵件" />
                  <Input id="password" label="密碼" type="password" placeholder="您的密碼" />
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-sm">
                      <Link to="/forgot-password" className="font-medium text-primary hover:text-blue-500">
                        忘記密碼？
                      </Link>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">登入</Button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                  還沒有帳戶？{' '}
                  <Link to="/register" className="font-medium text-primary hover:text-blue-500">
                    註冊
                  </Link>
                </p>
              </div>
            </div>
          );
        };

        export default LoginPage;
        ```

7.  **`RegisterPage.tsx`**
    *   ```tsx
        import React from 'react';
        import { Link } from 'react-router-dom';
        import Input from '../components/Input';
        import Button from '../components/Button';

        const RegisterPage: React.FC = () => {
          return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">建立新帳戶</h2>
                <form>
                  <Input id="name" label="使用者名稱" type="text" placeholder="您的使用者名稱" />
                  <Input id="email" label="電子郵件" type="email" placeholder="您的電子郵件" />
                  <Input id="password" label="密碼" type="password" placeholder="您的密碼" />
                  <Input id="confirm-password" label="確認密碼" type="password" placeholder="再次輸入密碼" />
                  <Button type="submit" className="w-full mt-6">註冊</Button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                  已經有帳戶？{' '}
                  <Link to="/login" className="font-medium text-primary hover:text-blue-500">
                    登入
                  </Link>
                </p>
              </div>
            </div>
          );
        };

        export default RegisterPage;
        ```

    *   **重要提示**：請確保在 `App.tsx` 中將這些頁面組件的引入路徑更新為 `src/pages/` 下的實際路徑，例如：
        ```tsx
        import DashboardPage from './pages/DashboardPage';
        import TasksPage from './pages/TasksPage';
        import NotesPage from './pages/NotesPage';
        import SettingsPage from './pages/SettingsPage';
        import LoginPage from './pages/LoginPage';
        import RegisterPage from './pages/RegisterPage';
        ```

### 3.3 巢狀路由與動態路由

對於需要顯示詳細資訊的頁面，例如任務詳情或筆記詳情，我們需要使用巢狀路由和動態路由。

1.  **實作任務詳情頁 (`/tasks/:id`)**
    *   在 `src/pages` 中建立 `TaskDetailPage.tsx`：
        ```tsx
        import React from 'react';
        import { useParams, Link } from 'react-router-dom';
        import PageHeader from '@/components/PageHeader';
        import Card from '@/components/Card';
        import Button from '@/components/Button';

        const TaskDetailPage: React.FC = () => {
          const { id } = useParams<{ id: string }>(); // 獲取 URL 中的動態參數 id

          // 這裡將來會從 API 或狀態管理中獲取任務詳情
          const task = {
            id: id,
            title: `任務 ${id} 的標題`,
            description: `這是任務 ${id} 的詳細描述。您可以在這裡查看任務的所有細節。`,
            priority: '高',
            dueDate: '2026-07-30',
            status: '進行中',
          };

          if (!task) {
            return <p>任務未找到。</p>;
          }

          return (
            <div>
              <PageHeader title={`任務詳情: ${task.title}`} description="查看和編輯任務的詳細資訊。" />
              <Card className="mb-6">
                <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
                <p className="text-gray-700 mb-2">**描述:** {task.description}</p>
                <p className="text-gray-700 mb-2">**優先級:** <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">{task.priority}</span></p>
                <p className="text-gray-700 mb-2">**截止日期:** {task.dueDate}</p>
                <p className="text-gray-700 mb-4">**狀態:** <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">{task.status}</span></p>
                <div className="flex space-x-4">
                  <Link to={`/tasks/${id}/edit`}>
                    <Button variant="primary">編輯任務</Button>
                  </Link>
                  <Button variant="outline" onClick={() => alert('刪除任務功能待實作')}>刪除任務</Button>
                </div>
              </Card>
              <Link to="/tasks" className="text-primary hover:underline">返回任務列表</Link>
            </div>
          );
        };

        export default TaskDetailPage;
        ```
    *   修改 `App.tsx`，在 `Layout` 內的 `Routes` 中添加任務詳情路由：
        ```tsx
        // ... (其他引入)
        import TaskDetailPage from './pages/TaskDetailPage';

        function App() {
          return (
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/*"
                element={
                  <Layout>
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/tasks" element={<TasksPage />} />
                      <Route path="/tasks/:id" element={<TaskDetailPage />} /> {/* 新增的任務詳情路由 */}
                      <Route path="/notes" element={<NotesPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                  </Layout>
                }
              />
            </Routes>
          );
        }

        export default App;
        ```
        *   `path="/tasks/:id"` 中的 `:id` 是一個動態參數，它會匹配 URL 中該位置的任何值。我們可以使用 `useParams` Hook 來獲取這個值。

2.  **實作筆記詳情頁 (`/notes/:id`)**
    *   在 `src/pages` 中建立 `NoteDetailPage.tsx`：
        ```tsx
        import React from 'react';
        import { useParams, Link } from 'react-router-dom';
        import PageHeader from '@/components/PageHeader';
        import Card from '@/components/Card';
        import Button from '@/components/Button';

        const NoteDetailPage: React.FC = () => {
          const { id } = useParams<{ id: string }>();

          // 這裡將來會從 API 或狀態管理中獲取筆記詳情
          const note = {
            id: id,
            title: `筆記 ${id} 的標題`,
            content: `這是筆記 ${id} 的詳細內容。您可以在這裡查看筆記的所有細節。`,
            createdAt: '2026-07-28',
            updatedAt: '2026-07-29',
          };

          if (!note) {
            return <p>筆記未找到。</p>;
          }

          return (
            <div>
              <PageHeader title={`筆記詳情: ${note.title}`} description="查看和編輯筆記的詳細資訊。" />
              <Card className="mb-6">
                <h2 className="text-2xl font-bold mb-4">{note.title}</h2>
                <p className="text-gray-700 mb-2">**建立日期:** {note.createdAt}</p>
                <p className="text-gray-700 mb-4">**更新日期:** {note.updatedAt}</p>
                <div className="prose max-w-none mb-4">
                  <p>{note.content}</p>
                </div>
                <div className="flex space-x-4">
                  <Link to={`/notes/${id}/edit`}>
                    <Button variant="primary">編輯筆記</Button>
                  </Link>
                  <Button variant="outline" onClick={() => alert('刪除筆記功能待實作')}>刪除筆記</Button>
                </div>
              </Card>
              <Link to="/notes" className="text-primary hover:underline">返回筆記列表</Link>
            </div>
          );
        };

        export default NoteDetailPage;
        ```
    *   修改 `App.tsx`，在 `Layout` 內的 `Routes` 中添加筆記詳情路由：
        ```tsx
        // ... (其他引入)
        import NoteDetailPage from './pages/NoteDetailPage';

        function App() {
          return (
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/*"
                element={
                  <Layout>
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/tasks" element={<TasksPage />} />
                      <Route path="/tasks/:id" element={<TaskDetailPage />} />
                      <Route path="/notes" element={<NotesPage />} />
                      <Route path="/notes/:id" element={<NoteDetailPage />} /> {/* 新增的筆記詳情路由 */}
                      <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                  </Layout>
                }
              />
            </Routes>
          );
        }

        export default App;
        ```

### 3.4 路由保護 (Protected Routes)

對於需要使用者登入才能訪問的頁面，我們需要實作路由保護。這通常透過一個高階組件 (Higher-Order Component, HOC) 或自訂 Hook 來實現。

1.  **建立 `AuthGuard` 或 `ProtectedRoute` 組件**
    *   在 `src/components` 中建立 `ProtectedRoute.tsx`：
        ```tsx
        import React from 'react';
        import { Navigate, Outlet } from 'react-router-dom';

        interface ProtectedRouteProps {
          isAuthenticated: boolean; // 假設這是從某個認證狀態獲取的值
          redirectPath?: string;
        }

        const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
          isAuthenticated,
          redirectPath = '/login',
        }) => {
          if (!isAuthenticated) {
            return <Navigate to={redirectPath} replace />;
          }

          return <Outlet />;
        };

        export default ProtectedRoute;
        ```
        *   `isAuthenticated` 是一個布林值，表示使用者是否已登入。在實際應用中，這會從您的認證狀態管理中獲取。
        *   如果使用者未登入，`Navigate` 組件會將其重定向到登入頁面。
        *   `Outlet` 組件用於渲染巢狀路由的子元素。

2.  **根據使用者登入狀態導航**
    *   修改 `App.tsx`，將需要保護的路由包裹在 `ProtectedRoute` 中。為了演示，我們暫時將 `isAuthenticated` 設為 `true`，在實際應用中，這會是一個動態值。
        ```tsx
        import React from 'react';
        import { Routes, Route } from 'react-router-dom';
        import Layout from '@/components/Layout';
        import PageHeader from '@/components/PageHeader';
        import ProtectedRoute from '@/components/ProtectedRoute'; // 引入 ProtectedRoute

        // ... (引入所有頁面組件)
        import DashboardPage from '@/pages/DashboardPage';
        import TasksPage from '@/pages/TasksPage';
        import TaskDetailPage from '@/pages/TaskDetailPage';
        import NotesPage from '@/pages/NotesPage';
        import NoteDetailPage from '@/pages/NoteDetailPage';
        import SettingsPage from '@/pages/SettingsPage';
        import LoginPage from '@/pages/LoginPage';
        import RegisterPage from '@/pages/RegisterPage';

        function App() {
          const isAuthenticated = true; // 模擬使用者已登入，未來會從認證狀態獲取

          return (
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}> {/* 保護所有巢狀路由 */}
                <Route
                  path="/*"
                  element={
                    <Layout>
                      <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/tasks" element={<TasksPage />} />
                        <Route path="/tasks/:id" element={<TaskDetailPage />} />
                        <Route path="/notes" element={<NotesPage />} />
                        <Route path="/notes/:id" element={<NoteDetailPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                      </Routes>
                    </Layout>
                  }
                />
              </Route>
            </Routes>
          );
        }

        export default App;
        ```
        *   現在，所有在 `ProtectedRoute` 內部定義的路由 (即 `Layout` 及其子路由) 都將受到保護。如果 `isAuthenticated` 為 `false`，使用者將被重定向到 `/login` 頁面。

至此，我們已經完成了應用程式的路由管理和主要頁面的建立。在下一章中，我們將開始實作任務管理的核心功能，包括資料結構設計、狀態管理和表單處理。

---

## 第四章：任務管理功能實作

本章將專注於實作「個人化任務與效能追蹤系統」的核心功能之一：任務管理。我們將從任務的資料結構設計開始，逐步實現任務的增、刪、改、查 (CRUD) 操作，並引入表單處理、篩選、排序與搜尋功能。為了模擬真實的後端互動，我們還將使用 JSON Server 來提供模擬的 RESTful API。

### 4.1 任務資料結構設計

在開始編寫任務管理功能之前，首先需要定義任務的資料結構。使用 TypeScript 的介面 (Interface) 可以為我們的任務物件提供清晰的類型定義，提升程式碼的可讀性和可維護性。

1.  **定義 TypeScript 介面 (Interface) for Task**
    *   在 `src` 目錄下建立一個 `types` 資料夾，並在其中建立 `task.d.ts` 文件。
    *   `src/types/task.d.ts`：
        ```typescript
        export interface Task {
          id: string; // 任務唯一識別符
          title: string; // 任務標題
          description?: string; // 任務描述 (可選)
          status: 'todo' | 'in-progress' | 'completed'; // 任務狀態
          priority: 'low' | 'medium' | 'high'; // 任務優先級
          dueDate?: string; // 截止日期 (ISO 格式，例如 'YYYY-MM-DD')
          createdAt: string; // 建立時間
          updatedAt: string; // 更新時間
        }
        ```
    *   這個介面定義了一個任務物件應包含的所有屬性及其類型。`?` 表示該屬性是可選的。

### 4.2 使用 React State 管理任務列表

我們將使用 React 的 `useState` 和 `useEffect` Hooks 來管理任務列表的狀態，並在組件內部實現任務的 CRUD 邏輯。這將是我們理解 React 狀態管理基礎的重要一步。

1.  **`useState` 與 `useEffect` 基礎**
    *   `useState`：用於在函數組件中添加狀態變數。它返回一個包含當前狀態值和一個更新該狀態的函數的陣列。
        ```typescript
        const [count, setCount] = useState(0);
        ```
    *   `useEffect`：用於在函數組件中執行副作用操作，例如資料獲取、訂閱或手動更改 DOM。它會在組件渲染後執行，並且可以選擇在組件卸載時進行清理。
        ```typescript
        useEffect(() => {
          // 執行副作用操作
          console.log('組件已渲染或更新');
          return () => {
            // 清理操作 (組件卸載時執行)
            console.log('組件已卸載');
          };
        }, [dependency]); // 依賴陣列，當依賴項改變時重新執行副作用
        ```

2.  **任務列表的增、刪、改、查邏輯**
    *   修改 `src/pages/TasksPage.tsx`，引入 `Task` 介面並實作基本的任務管理邏輯：
        ```tsx
        import React, { useState, useEffect } from 'react';
        import PageHeader from '@/components/PageHeader';
        import Card from '@/components/Card';
        import Button from '@/components/Button';
        import Input from '@/components/Input';
        import Modal from '@/components/Modal';
        import { Task } from '@/types/task';
        import { v4 as uuidv4 } from 'uuid'; // 用於生成唯一 ID

        // 安裝 uuid: npm install uuid @types/uuid

        const TasksPage: React.FC = () => {
          const [tasks, setTasks] = useState<Task[]>([]);
          const [isModalOpen, setIsModalOpen] = useState(false);
          const [currentTask, setCurrentTask] = useState<Task | null>(null);
          const [newTaskTitle, setNewTaskTitle] = useState('');
          const [newTaskDescription, setNewTaskDescription] = useState('');
          const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
          const [newTaskDueDate, setNewTaskDueDate] = useState('');

          // 模擬從後端獲取任務列表
          useEffect(() => {
            // 在實際應用中，這裡會發送 API 請求
            const fetchedTasks: Task[] = [
              {
                id: '1',
                title: '完成 React 教學文件',
                description: '撰寫 React 從零到深入的教學文件，包含專案實作。',
                status: 'in-progress',
                priority: 'high',
                dueDate: '2026-07-31',
                createdAt: '2026-07-01T10:00:00Z',
                updatedAt: '2026-07-28T15:30:00Z',
              },
              {
                id: '2',
                title: '規劃面試作品集專案', 
                description: '設計個人化任務與效能追蹤系統的架構和功能。',
                status: 'completed',
                priority: 'high',
                dueDate: '2026-07-20',
                createdAt: '2026-06-25T09:00:00Z',
                updatedAt: '2026-07-20T11:00:00Z',
              },
              {
                id: '3',
                title: '學習 Tailwind CSS', 
                description: '熟悉 Tailwind CSS 的實用工具類別和響應式設計。',
                status: 'todo',
                priority: 'medium',
                dueDate: '2026-08-05',
                createdAt: '2026-07-10T14:00:00Z',
                updatedAt: '2026-07-10T14:00:00Z',
              },
            ];
            setTasks(fetchedTasks);
          }, []);

          const handleAddTask = () => {
            setCurrentTask(null);
            setNewTaskTitle('');
            setNewTaskDescription('');
            setNewTaskPriority('medium');
            setNewTaskDueDate('');
            setIsModalOpen(true);
          };

          const handleEditTask = (task: Task) => {
            setCurrentTask(task);
            setNewTaskTitle(task.title);
            setNewTaskDescription(task.description || '');
            setNewTaskPriority(task.priority);
            setNewTaskDueDate(task.dueDate || '');
            setIsModalOpen(true);
          };

          const handleDeleteTask = (id: string) => {
            setTasks(tasks.filter(task => task.id !== id));
          };

          const handleSubmitTask = () => {
            if (!newTaskTitle.trim()) return;

            const now = new Date().toISOString();
            if (currentTask) {
              // 更新現有任務
              setTasks(tasks.map(task => 
                task.id === currentTask.id
                  ? { 
                      ...task, 
                      title: newTaskTitle, 
                      description: newTaskDescription, 
                      priority: newTaskPriority, 
                      dueDate: newTaskDueDate, 
                      updatedAt: now 
                    }
                  : task
              ));
            } else {
              // 新增任務
              const newTask: Task = {
                id: uuidv4(),
                title: newTaskTitle,
                description: newTaskDescription,
                status: 'todo',
                priority: newTaskPriority,
                dueDate: newTaskDueDate,
                createdAt: now,
                updatedAt: now,
              };
              setTasks([...tasks, newTask]);
            }
            setIsModalOpen(false);
          };

          const handleToggleStatus = (id: string) => {
            setTasks(tasks.map(task => 
              task.id === id 
                ? { ...task, status: task.status === 'completed' ? 'todo' : 'completed', updatedAt: new Date().toISOString() }
                : task
            ));
          };

          const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
            switch (priority) {
              case 'high': return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">高</span>;
              case 'medium': return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">中</span>;
              case 'low': return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">低</span>;
            }
          };

          const getStatusBadge = (status: 'todo' | 'in-progress' | 'completed') => {
            switch (status) {
              case 'todo': return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">待辦</span>;
              case 'in-progress': return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">進行中</span>;
              case 'completed': return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">已完成</span>;
            }
          };

          return (
            <div>
              <PageHeader title="任務" description="管理您的所有任務。" />
              <div className="flex justify-end mb-4">
                <Button onClick={handleAddTask}>新增任務</Button>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">標題</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">優先級</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">截止日期</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">操作</span></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tasks.map((task) => (
                        <tr key={task.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <input 
                              type="checkbox" 
                              checked={task.status === 'completed'} 
                              onChange={() => handleToggleStatus(task.id)} 
                              className="mr-2 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            {task.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getPriorityBadge(task.priority)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.dueDate || '無'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStatusBadge(task.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditTask(task)}>編輯</Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteTask(task.id)}>刪除</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentTask ? '編輯任務' : '新增任務'}>
                <div className="space-y-4">
                  <Input
                    id="taskTitle"
                    label="任務標題"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="輸入任務標題"
                  />
                  <Input
                    id="taskDescription"
                    label="任務描述"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="輸入任務描述 (可選)"
                  />
                  <div>
                    <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-700 mb-1">優先級</label>
                    <select
                      id="taskPriority"
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                    >
                      <option value="low">低</option>
                      <option value="medium">中</option>
                      <option value="high">高</option>
                    </select>
                  </div>
                  <Input
                    id="taskDueDate"
                    label="截止日期"
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                  />
                  <Button onClick={handleSubmitTask} className="w-full">
                    {currentTask ? '更新任務' : '建立任務'}
                  </Button>
                </div>
              </Modal>
            </div>
          );
        };

        export default TasksPage;
        ```
    *   **注意**：上述程式碼中使用了 `uuid` 庫來生成唯一的 ID。請先安裝它：`npm install uuid @types/uuid`。
    *   我們在 `TasksPage` 中實作了任務的顯示、新增、編輯和刪除功能。新增和編輯任務透過一個模態框 (Modal) 進行。

### 4.3 任務表單開發

雖然我們在 `TasksPage` 中已經實現了基本的表單輸入，但對於更複雜的表單，我們通常會使用專門的表單處理庫，例如 React Hook Form。它能幫助我們更高效地處理表單狀態、驗證和提交。

1.  **使用 React Hook Form 處理表單輸入**
    *   安裝 React Hook Form 和 Zod (用於驗證)：
        ```bash
        npm install react-hook-form zod
        # 或者
        yarn add react-hook-form zod
        ```
    *   建立一個新的 `TaskForm.tsx` 組件來封裝表單邏輯：
        ```tsx
        import React, { useEffect } from 'react';
        import { useForm } from 'react-hook-form';
        import { zodResolver } from '@hookform/resolvers/zod';
        import * as z from 'zod';
        import Input from './Input';
        import Button from './Button';
        import { Task } from '../types/task';

        // 安裝 @hookform/resolvers: npm install @hookform/resolvers

        const taskSchema = z.object({
          title: z.string().min(1, { message: '任務標題不能為空' }),
          description: z.string().optional(),
          priority: z.enum(['low', 'medium', 'high']),
          dueDate: z.string().optional(),
        });

        type TaskFormInputs = z.infer<typeof taskSchema>;

        interface TaskFormProps {
          onSubmit: (data: TaskFormInputs) => void;
          defaultValues?: Partial<Task>;
          onCancel: () => void;
        }

        const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, defaultValues, onCancel }) => {
          const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormInputs>({
            resolver: zodResolver(taskSchema),
            defaultValues: {
              title: defaultValues?.title || '',
              description: defaultValues?.description || '',
              priority: defaultValues?.priority || 'medium',
              dueDate: defaultValues?.dueDate || '',
            },
          });

          useEffect(() => {
            reset({
              title: defaultValues?.title || '',
              description: defaultValues?.description || '',
              priority: defaultValues?.priority || 'medium',
              dueDate: defaultValues?.dueDate || '',
            });
          }, [defaultValues, reset]);

          return (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                id="title"
                label="任務標題"
                {...register('title')}
                error={errors.title?.message}
                placeholder="輸入任務標題"
              />
              <Input
                id="description"
                label="任務描述"
                {...register('description')}
                error={errors.description?.message}
                placeholder="輸入任務描述 (可選)"
              />
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">優先級</label>
                <select
                  id="priority"
                  {...register('priority')}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
                {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>}
              </div>
              <Input
                id="dueDate"
                label="截止日期"
                type="date"
                {...register('dueDate')}
                error={errors.dueDate?.message}
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>取消</Button>
                <Button type="submit">{defaultValues ? '更新任務' : '建立任務'}</Button>
              </div>
            </form>
          );
        };

        export default TaskForm;
        ```
    *   **注意**：請先安裝 `@hookform/resolvers`：`npm install @hookform/resolvers`。
    *   `useForm` Hook 提供了 `register` 用於將輸入元素註冊到表單，`handleSubmit` 用於處理表單提交，以及 `formState: { errors }` 用於獲取驗證錯誤。
    *   `zodResolver` 將 Zod 驗證模式整合到 React Hook Form 中，實現強大的表單驗證。

2.  **將 `TaskForm` 整合到 `TasksPage`**
    *   修改 `src/pages/TasksPage.tsx`，使用 `TaskForm` 替換原有的表單部分：
        ```tsx
        import React, { useState, useEffect } from 'react';
        import PageHeader from '@/components/PageHeader';
        import Card from '@/components/Card';
        import Button from '@/components/Button';
        import Modal from '@/components/Modal';
        import TaskForm from '@/components/TaskForm'; // 引入 TaskForm
        import { Task } from '@/types/task';
        import { v4 as uuidv4 } from 'uuid';

        const TasksPage: React.FC = () => {
          const [tasks, setTasks] = useState<Task[]>([]);
          const [isModalOpen, setIsModalOpen] = useState(false);
          const [currentTask, setCurrentTask] = useState<Task | null>(null);

          useEffect(() => {
            const fetchedTasks: Task[] = [
              {
                id: '1',
                title: '完成 React 教學文件',
                description: '撰寫 React 從零到深入的教學文件，包含專案實作。',
                status: 'in-progress',
                priority: 'high',
                dueDate: '2026-07-31',
                createdAt: '2026-07-01T10:00:00Z',
                updatedAt: '2026-07-28T15:30:00Z',
              },
              {
                id: '2',
                title: '規劃面試作品集專案', 
                description: '設計個人化任務與效能追蹤系統的架構和功能。',
                status: 'completed',
                priority: 'high',
                dueDate: '2026-07-20',
                createdAt: '2026-06-25T09:00:00Z',
                updatedAt: '2026-07-20T11:00:00Z',
              },
              {
                id: '3',
                title: '學習 Tailwind CSS', 
                description: '熟悉 Tailwind CSS 的實用工具類別和響應式設計。',
                status: 'todo',
                priority: 'medium',
                dueDate: '2026-08-05',
                createdAt: '2026-07-10T14:00:00Z',
                updatedAt: '2026-07-10T14:00:00Z',
              },
            ];
            setTasks(fetchedTasks);
          }, []);

          const handleAddTask = () => {
            setCurrentTask(null);
            setIsModalOpen(true);
          };

          const handleEditTask = (task: Task) => {
            setCurrentTask(task);
            setIsModalOpen(true);
          };

          const handleDeleteTask = (id: string) => {
            setTasks(tasks.filter(task => task.id !== id));
          };

          const handleSubmitTaskForm = (data: { title: string; description?: string; priority: 'low' | 'medium' | 'high'; dueDate?: string; }) => {
            const now = new Date().toISOString();
            if (currentTask) {
              setTasks(tasks.map(task => 
                task.id === currentTask.id
                  ? { 
                      ...task, 
                      title: data.title, 
                      description: data.description, 
                      priority: data.priority, 
                      dueDate: data.dueDate, 
                      updatedAt: now 
                    }
                  : task
              ));
            } else {
              const newTask: Task = {
                id: uuidv4(),
                title: data.title,
                description: data.description,
                status: 'todo',
                priority: data.priority,
                dueDate: data.dueDate,
                createdAt: now,
                updatedAt: now,
              };
              setTasks([...tasks, newTask]);
            }
            setIsModalOpen(false);
          };

          const handleToggleStatus = (id: string) => {
            setTasks(tasks.map(task => 
              task.id === id 
                ? { ...task, status: task.status === 'completed' ? 'todo' : 'completed', updatedAt: new Date().toISOString() }
                : task
            ));
          };

          const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
            switch (priority) {
              case 'high': return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">高</span>;
              case 'medium': return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">中</span>;
              case 'low': return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">低</span>;
            }
          };

          const getStatusBadge = (status: 'todo' | 'in-progress' | 'completed') => {
            switch (status) {
              case 'todo': return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">待辦</span>;
              case 'in-progress': return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">進行中</span>;
              case 'completed': return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">已完成</span>;
            }
          };

          return (
            <div>
              <PageHeader title="任務" description="管理您的所有任務。" />
              <div className="flex justify-end mb-4">
                <Button onClick={handleAddTask}>新增任務</Button>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">標題</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">優先級</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">截止日期</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">操作</span></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tasks.map((task) => (
                        <tr key={task.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <input 
                              type="checkbox" 
                              checked={task.status === 'completed'} 
                              onChange={() => handleToggleStatus(task.id)} 
                              className="mr-2 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            {task.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getPriorityBadge(task.priority)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.dueDate || '無'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStatusBadge(task.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditTask(task)}>編輯</Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteTask(task.id)}>刪除</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentTask ? '編輯任務' : '新增任務'}>
                <TaskForm 
                  onSubmit={handleSubmitTaskForm} 
                  defaultValues={currentTask || undefined} 
                  onCancel={() => setIsModalOpen(false)}
                />
              </Modal>
            </div>
          );
        };

        export default TasksPage;
        ```

### 4.4 任務篩選、排序與搜尋

為了讓任務列表更具實用性，我們需要添加篩選、排序和搜尋功能，讓使用者能夠快速找到所需的任務。

1.  **實作任務狀態篩選 (全部、待辦、已完成)**
    *   在 `TasksPage` 中添加一個狀態來儲存當前的篩選條件，並根據該條件過濾任務列表。
    *   修改 `src/pages/TasksPage.tsx`：
        ```tsx
        import React, { useState, useEffect, useMemo } from 'react'; // 引入 useMemo
        // ... 其他引入

        const TasksPage: React.FC = () => {
          const [tasks, setTasks] = useState<Task[]>([]);
          const [isModalOpen, setIsModalOpen] = useState(false);
          const [currentTask, setCurrentTask] = useState<Task | null>(null);
          const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all'); // 新增篩選狀態
          const [searchTerm, setSearchTerm] = useState(''); // 新增搜尋關鍵字
          const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('createdAt'); // 新增排序依據
          const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // 新增排序順序

          // ... (useEffect 獲取任務列表部分保持不變)

          // 過濾和排序任務列表
          const filteredAndSortedTasks = useMemo(() => {
            let filtered = tasks;

            // 狀態篩選
            if (filterStatus !== 'all') {
              filtered = filtered.filter(task => task.status === filterStatus);
            }

            // 搜尋
            if (searchTerm) {
              filtered = filtered.filter(task => 
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description?.toLowerCase().includes(searchTerm.toLowerCase())
              );
            }

            // 排序
            return filtered.sort((a, b) => {
              let compareValue = 0;
              if (sortBy === 'dueDate' && a.dueDate && b.dueDate) {
                compareValue = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
              } else if (sortBy === 'priority') {
                const priorityOrder = { 'low': 1, 'medium': 2, 'high': 3 };
                compareValue = priorityOrder[a.priority] - priorityOrder[b.priority];
              } else if (sortBy === 'createdAt') {
                compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              }
              return sortOrder === 'asc' ? compareValue : -compareValue;
            });
          }, [tasks, filterStatus, searchTerm, sortBy, sortOrder]);

          // ... (handleAddTask, handleEditTask, handleDeleteTask, handleSubmitTaskForm, handleToggleStatus 保持不變)

          return (
            <div>
              <PageHeader title="任務" description="管理您的所有任務。" />
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
                <div className="flex space-x-2">
                  <Input 
                    id="searchTasks" 
                    placeholder="搜尋任務..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-auto"
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as 'all' | 'todo' | 'in-progress' | 'completed')}
                    className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  >
                    <option value="all">所有狀態</option>
                    <option value="todo">待辦</option>
                    <option value="in-progress">進行中</option>
                    <option value="completed">已完成</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'priority' | 'createdAt')}
                    className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  >
                    <option value="createdAt">建立日期</option>
                    <option value="dueDate">截止日期</option>
                    <option value="priority">優先級</option>
                  </select>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  >
                    <option value="desc">降序</option>
                    <option value="asc">升序</option>
                  </select>
                </div>
                <Button onClick={handleAddTask}>新增任務</Button>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">標題</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">優先級</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">截止日期</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">操作</span></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAndSortedTasks.map((task) => (
                        <tr key={task.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <input 
                              type="checkbox" 
                              checked={task.status === 'completed'} 
                              onChange={() => handleToggleStatus(task.id)} 
                              className="mr-2 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            {task.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getPriorityBadge(task.priority)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.dueDate || '無'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStatusBadge(task.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditTask(task)}>編輯</Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteTask(task.id)}>刪除</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentTask ? '編輯任務' : '新增任務'}>
                <TaskForm 
                  onSubmit={handleSubmitTaskForm} 
                  defaultValues={currentTask || undefined} 
                  onCancel={() => setIsModalOpen(false)}
                />
              </Modal>
            </div>
          );
        };

        export default TasksPage;
        ```
    *   我們引入了 `useMemo` Hook 來優化過濾和排序邏輯，避免在每次渲染時都重新計算。

### 4.5 後端模擬：JSON Server

在前端開發階段，我們通常沒有一個完整的後端 API。JSON Server 是一個非常方便的工具，它允許我們快速建立一個假的 RESTful API，以便前端可以像與真實後端互動一樣進行開發和測試。

1.  **安裝與配置 JSON Server**
    *   在您的專案根目錄下安裝 `json-server`：
        ```bash
        npm install -g json-server
        # 或者
        yarn global add json-server
        ```
    *   在專案根目錄下建立一個 `db.json` 文件，作為您的假資料庫：
        ```json
        {
          "tasks": [
            {
              "id": "1",
              "title": "完成 React 教學文件",
              "description": "撰寫 React 從零到深入的教學文件，包含專案實作。",
              "status": "in-progress",
              "priority": "high",
              "dueDate": "2026-07-31",
              "createdAt": "2026-07-01T10:00:00Z",
              "updatedAt": "2026-07-28T15:30:00Z"
            },
            {
              "id": "2",
              "title": "規劃面試作品集專案",
              "description": "設計個人化任務與效能追蹤系統的架構和功能。",
              "status": "completed",
              "priority": "high",
              "dueDate": "2026-07-20",
              "createdAt": "2026-06-25T09:00:00Z",
              "updatedAt": "2026-07-20T11:00:00Z"
            },
            {
              "id": "3",
              "title": "學習 Tailwind CSS",
              "description": "熟悉 Tailwind CSS 的實用工具類別和響應式設計。",
              "status": "todo",
              "priority": "medium",
              "dueDate": "2026-08-05",
              "createdAt": "2026-07-10T14:00:00Z",
              "updatedAt": "2026-07-10T14:00:00Z"
            }
          ]
        }
        ```
    *   在終端機中，從專案根目錄啟動 JSON Server：
        ```bash
        json-server --watch db.json --port 3001
        ```
        現在，您就可以透過 `http://localhost:3001/tasks` 訪問您的任務 API 了！

2.  **使用 `fetch` 或 Axios 進行 API 請求**
    *   我們將修改 `TasksPage`，使其從 JSON Server 獲取任務數據，而不是使用硬編碼的數據。
    *   首先，如果您想使用 Axios (一個基於 Promise 的 HTTP 客戶端)，請安裝它：
        ```bash
        npm install axios
        # 或者
        yarn add axios
        ```
    *   修改 `src/pages/TasksPage.tsx`，使用 `fetch` 或 Axios 進行 API 請求：
        ```tsx
        import React, { useState, useEffect, useMemo } from 'react';
        import PageHeader from '@/components/PageHeader';
        import Card from '@/components/Card';
        import Button from '@/components/Button';
        import Modal from '@/components/Modal';
        import TaskForm from '@/components/TaskForm';
        import { Task } from '@/types/task';
        import { v4 as uuidv4 } from 'uuid';
        import axios from 'axios'; // 引入 axios

        const API_BASE_URL = 'http://localhost:3001'; // JSON Server 的基礎 URL

        const TasksPage: React.FC = () => {
          const [tasks, setTasks] = useState<Task[]>([]);
          const [isModalOpen, setIsModalOpen] = useState(false);
          const [currentTask, setCurrentTask] = useState<Task | null>(null);
          const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all');
          const [searchTerm, setSearchTerm] = useState('');
          const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('createdAt');
          const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

          // 從 API 獲取任務列表
          const fetchTasks = async () => {
            try {
              const response = await axios.get<Task[]>(`${API_BASE_URL}/tasks`);
              setTasks(response.data);
            } catch (error) {
              console.error('Error fetching tasks:', error);
            }
          };

          useEffect(() => {
            fetchTasks();
          }, []);

          const handleAddTask = () => {
            setCurrentTask(null);
            setIsModalOpen(true);
          };

          const handleEditTask = (task: Task) => {
            setCurrentTask(task);
            setIsModalOpen(true);
          };

          const handleDeleteTask = async (id: string) => {
            try {
              await axios.delete(`${API_BASE_URL}/tasks/${id}`);
              setTasks(tasks.filter(task => task.id !== id));
            } catch (error) {
              console.error('Error deleting task:', error);
            }
          };

          const handleSubmitTaskForm = async (data: { title: string; description?: string; priority: 'low' | 'medium' | 'high'; dueDate?: string; }) => {
            const now = new Date().toISOString();
            try {
              if (currentTask) {
                // 更新現有任務
                const updatedTask = {
                  ...currentTask,
                  title: data.title,
                  description: data.description,
                  priority: data.priority,
                  dueDate: data.dueDate,
                  updatedAt: now,
                };
                await axios.put(`${API_BASE_URL}/tasks/${currentTask.id}`, updatedTask);
                setTasks(tasks.map(task => task.id === currentTask.id ? updatedTask : task));
              } else {
                // 新增任務
                const newTask: Task = {
                  id: uuidv4(),
                  title: data.title,
                  description: data.description,
                  status: 'todo',
                  priority: data.priority,
                  dueDate: data.dueDate,
                  createdAt: now,
                  updatedAt: now,
                };
                const response = await axios.post<Task>(`${API_BASE_URL}/tasks`, newTask);
                setTasks([...tasks, response.data]);
              }
              setIsModalOpen(false);
            } catch (error) {
              console.error('Error submitting task:', error);
            }
          };

          const handleToggleStatus = async (id: string) => {
            const taskToUpdate = tasks.find(task => task.id === id);
            if (!taskToUpdate) return;

            const newStatus = taskToUpdate.status === 'completed' ? 'todo' : 'completed';
            const updatedTask = { ...taskToUpdate, status: newStatus, updatedAt: new Date().toISOString() };

            try {
              await axios.patch(`${API_BASE_URL}/tasks/${id}`, { status: newStatus, updatedAt: updatedTask.updatedAt });
              setTasks(tasks.map(task => task.id === id ? updatedTask : task));
            } catch (error) {
              console.error('Error toggling task status:', error);
            }
          };

          // ... (getPriorityBadge, getStatusBadge 和 filteredAndSortedTasks 保持不變)

          return (
            <div>
              <PageHeader title="任務" description="管理您的所有任務。" />
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
                <div className="flex space-x-2">
                  <Input 
                    id="searchTasks" 
                    placeholder="搜尋任務..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-auto"
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as 'all' | 'todo' | 'in-progress' | 'completed')}
                    className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  >
                    <option value="all">所有狀態</option>
                    <option value="todo">待辦</option>
                    <option value="in-progress">進行中</option>
                    <option value="completed">已完成</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'priority' | 'createdAt')}
                    className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  >
                    <option value="createdAt">建立日期</option>
                    <option value="dueDate">截止日期</option>
                    <option value="priority">優先級</option>
                  </select>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  >
                    <option value="desc">降序</option>
                    <option value="asc">升序</option>
                  </select>
                </div>
                <Button onClick={handleAddTask}>新增任務</Button>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">標題</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">優先級</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">截止日期</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">操作</span></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAndSortedTasks.map((task) => (
                        <tr key={task.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <input 
                              type="checkbox" 
                              checked={task.status === 'completed'} 
                              onChange={() => handleToggleStatus(task.id)} 
                              className="mr-2 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            {task.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getPriorityBadge(task.priority)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.dueDate || '無'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStatusBadge(task.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditTask(task)}>編輯</Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteTask(task.id)}>刪除</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentTask ? '編輯任務' : '新增任務'}>
                <TaskForm 
                  onSubmit={handleSubmitTaskForm} 
                  defaultValues={currentTask || undefined} 
                  onCancel={() => setIsModalOpen(false)}
                />
              </Modal>
            </div>
          );
        };

        export default TasksPage;
        ```

至此，我們已經完成了任務管理的核心功能，包括資料結構定義、使用 React State 進行 CRUD 操作、整合 React Hook Form 進行表單處理和驗證，以及透過 JSON Server 模擬後端 API 互動。在下一章中，我們將轉向筆記管理功能，並引入富文本編輯器和 Context API 進行狀態管理。

---

## 第五章：筆記管理功能實作

本章將引導您實作「個人化任務與效能追蹤系統」中的筆記管理功能。我們將定義筆記的資料結構，並使用 React Context API 進行狀態管理，這將是學習如何管理跨組件共享狀態的絕佳機會。此外，我們還將探討如何整合富文本編輯器，以提供更豐富的筆記編輯體驗。

### 5.1 筆記資料結構設計

與任務管理類似，我們首先需要為筆記定義清晰的資料結構，以便於 TypeScript 進行類型檢查和程式碼維護。

1.  **定義 TypeScript 介面 (Interface) for Note**
    *   在 `src/types` 目錄下建立 `note.d.ts` 文件。
    *   `src/types/note.d.ts`：
        ```typescript
        export interface Note {
          id: string; // 筆記唯一識別符
          title: string; // 筆記標題
          content: string; // 筆記內容 (支援富文本 HTML 字符串)
          createdAt: string; // 建立時間
          updatedAt: string; // 更新時間
        }
        ```
    *   `content` 屬性將用於儲存富文本編輯器生成的 HTML 字符串。

### 5.2 使用 React Context API 進行狀態管理

對於筆記這樣需要在多個組件之間共享和操作的數據，React Context API 是一個非常合適的狀態管理方案。它允許我們在組件樹中傳遞數據，而無需手動地在每一層級傳遞 props。

1.  **建立 `NotesContext` 與 `NotesProvider`**
    *   在 `src` 目錄下建立一個 `context` 資料夾，並在其中建立 `NotesContext.tsx` 文件。
    *   `src/context/NotesContext.tsx`：
        ```tsx
        import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
        import { Note } from '../types/note';
        import { v4 as uuidv4 } from 'uuid';
        import axios from 'axios';

        const API_BASE_URL = 'http://localhost:3001';

        interface NotesContextType {
          notes: Note[];
          addNote: (title: string, content: string) => Promise<void>;
          updateNote: (id: string, title: string, content: string) => Promise<void>;
          deleteNote: (id: string) => Promise<void>;
          fetchNotes: () => Promise<void>;
        }

        const NotesContext = createContext<NotesContextType | undefined>(undefined);

        interface NotesProviderProps {
          children: ReactNode;
        }

        export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
          const [notes, setNotes] = useState<Note[]>([]);

          const fetchNotes = async () => {
            try {
              const response = await axios.get<Note[]>(`${API_BASE_URL}/notes`);
              setNotes(response.data);
            } catch (error) {
              console.error('Error fetching notes:', error);
            }
          };

          useEffect(() => {
            fetchNotes();
          }, []);

          const addNote = async (title: string, content: string) => {
            const now = new Date().toISOString();
            const newNote: Note = {
              id: uuidv4(),
              title,
              content,
              createdAt: now,
              updatedAt: now,
            };
            try {
              const response = await axios.post<Note>(`${API_BASE_URL}/notes`, newNote);
              setNotes((prevNotes) => [...prevNotes, response.data]);
            } catch (error) {
              console.error('Error adding note:', error);
            }
          };

          const updateNote = async (id: string, title: string, content: string) => {
            const now = new Date().toISOString();
            const updatedNote = { title, content, updatedAt: now };
            try {
              await axios.patch(`${API_BASE_URL}/notes/${id}`, updatedNote);
              setNotes((prevNotes) =>
                prevNotes.map((note) => (note.id === id ? { ...note, ...updatedNote } : note))
              );
            } catch (error) {
              console.error('Error updating note:', error);
            }
          };

          const deleteNote = async (id: string) => {
            try {
              await axios.delete(`${API_BASE_URL}/notes/${id}`);
              setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
            } catch (error) {
              console.error('Error deleting note:', error);
            }
          };

          return (
            <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote, fetchNotes }}>
              {children}
            </NotesContext.Provider>
          );
        };

        export const useNotes = () => {
          const context = useContext(NotesContext);
          if (context === undefined) {
            throw new Error('useNotes must be used within a NotesProvider');
          }
          return context;
        };
        ```
    *   `NotesContext.tsx` 定義了一個 `NotesContext`，它包含筆記列表 (`notes`) 和操作筆記的方法 (`addNote`, `updateNote`, `deleteNote`, `fetchNotes`)。
    *   `NotesProvider` 是一個組件，它將 `NotesContext` 的值提供給其所有子組件。它還負責從 API 獲取初始筆記數據。
    *   `useNotes` 是一個自訂 Hook，方便我們在任何子組件中訪問 `NotesContext` 的值。

2.  **將 `NotesProvider` 整合到 `App.tsx`**
    *   為了讓整個應用程式都能訪問筆記狀態，我們需要將 `NotesProvider` 包裹在 `App` 組件的頂層。
    *   修改 `src/App.tsx`：
        ```tsx
        import React from 'react';
        import { Routes, Route } from 'react-router-dom';
        import Layout from './components/Layout';
        import ProtectedRoute from './components/ProtectedRoute';
        import { NotesProvider } from './context/NotesContext'; // 引入 NotesProvider

        // ... (引入所有頁面組件)
        import DashboardPage from './pages/DashboardPage';
        import TasksPage from './pages/TasksPage';
        import TaskDetailPage from './pages/TaskDetailPage';
        import NotesPage from './pages/NotesPage';
        import NoteDetailPage from './pages/NoteDetailPage';
        import SettingsPage from './pages/SettingsPage';
        import LoginPage from './pages/LoginPage';
        import RegisterPage from './pages/RegisterPage';

        function App() {
          const isAuthenticated = true; // 模擬使用者已登入

          return (
            <NotesProvider> {/* 將 NotesProvider 包裹在頂層 */}
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                  <Route
                    path="/*"
                    element={
                      <Layout>
                        <Routes>
                          <Route path="/" element={<DashboardPage />} />
                          <Route path="/tasks" element={<TasksPage />} />
                          <Route path="/tasks/:id" element={<TaskDetailPage />} />
                          <Route path="/notes" element={<NotesPage />} />
                          <Route path="/notes/:id" element={<NoteDetailPage />} />
                          <Route path="/settings" element={<SettingsPage />} />
                        </Routes>
                      </Layout>
                    }
                  />
                </Route>
              </Routes>
            </NotesProvider>
          );
        }

        export default App;
        ```

3.  **筆記列表的增、刪、改、查邏輯**
    *   修改 `src/pages/NotesPage.tsx`，使用 `useNotes` Hook 來獲取和操作筆記數據：
        ```tsx
        import React, { useState } from 'react';
        import PageHeader from '@/components/PageHeader';
        import Card from '@/components/Card';
        import Button from '@/components/Button';
        import Modal from '@/components/Modal';
        import Input from '@/components/Input';
        import { useNotes } from '@/context/NotesContext';
        import { Note } from '@/types/note';
        import { Link } from 'react-router-dom';

        const NotesPage: React.FC = () => {
          const { notes, addNote, deleteNote, updateNote } = useNotes();
          const [isModalOpen, setIsModalOpen] = useState(false);
          const [currentNote, setCurrentNote] = useState<Note | null>(null);
          const [noteTitle, setNoteTitle] = useState('');
          const [noteContent, setNoteContent] = useState(''); // 暫時使用普通字符串，稍後會整合富文本編輯器

          const handleAddNote = () => {
            setCurrentNote(null);
            setNoteTitle('');
            setNoteContent('');
            setIsModalOpen(true);
          };

          const handleEditNote = (note: Note) => {
            setCurrentNote(note);
            setNoteTitle(note.title);
            setNoteContent(note.content);
            setIsModalOpen(true);
          };

          const handleDeleteNote = async (id: string) => {
            if (window.confirm('確定要刪除這則筆記嗎？')) {
              await deleteNote(id);
            }
          };

          const handleSubmitNote = async () => {
            if (!noteTitle.trim()) return;

            if (currentNote) {
              await updateNote(currentNote.id, noteTitle, noteContent);
            } else {
              await addNote(noteTitle, noteContent);
            }
            setIsModalOpen(false);
          };

          return (
            <div>
              <PageHeader title="筆記" description="記錄您的想法和靈感。" />
              <div className="flex justify-end mb-4">
                <Button onClick={handleAddNote}>新增筆記</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map((note) => (
                  <Card key={note.id} className="flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{note.content.replace(/<[^>]*>?/gm, '')}</p> {/* 移除 HTML 標籤顯示摘要 */}
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Link to={`/notes/${note.id}`}>
                        <Button variant="outline" size="sm">查看</Button>
                      </Link>
                      <Button variant="outline" size="sm" onClick={() => handleEditNote(note)}>編輯</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteNote(note.id)}>刪除</Button>
                    </div>
                  </Card>
                ))}
              </div>

              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentNote ? '編輯筆記' : '新增筆記'}>
                <div className="space-y-4">
                  <Input
                    id="noteTitle"
                    label="筆記標題"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="輸入筆記標題"
                  />
                  <div>
                    <label htmlFor="noteContent" className="block text-sm font-medium text-gray-700 mb-1">筆記內容</label>
                    <textarea
                      id="noteContent"
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      rows={8}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="輸入筆記內容"
                    ></textarea>
                  </div>
                  <Button onClick={handleSubmitNote} className="w-full">
                    {currentNote ? '更新筆記' : '建立筆記'}
                  </Button>
                </div>
              </Modal>
            </div>
          );
        };

        export default NotesPage;
        ```
    *   `NoteDetailPage.tsx` 也需要修改，以從 `NotesContext` 獲取筆記數據：
        ```tsx
        import React, { useEffect, useState } from 'react';
        import { useParams, Link } from 'react-router-dom';
        import PageHeader from '@/components/PageHeader';
        import Card from '@/components/Card';
        import Button from '@/components/Button';
        import { useNotes } from '@/context/NotesContext';
        import { Note } from '@/types/note';

        const NoteDetailPage: React.FC = () => {
          const { id } = useParams<{ id: string }>();
          const { notes, deleteNote } = useNotes();
          const [note, setNote] = useState<Note | undefined>(undefined);

          useEffect(() => {
            setNote(notes.find(n => n.id === id));
          }, [id, notes]);

          const handleDelete = async () => {
            if (note && window.confirm('確定要刪除這則筆記嗎？')) {
              await deleteNote(note.id);
              // 刪除後導航回筆記列表頁
              // history.push('/notes'); // 在 React Router v6 中使用 useNavigate
            }
          };

          if (!note) {
            return <p>筆記未找到。</p>;
          }

          return (
            <div>
              <PageHeader title={`筆記詳情: ${note.title}`} description="查看和編輯筆記的詳細資訊。" />
              <Card className="mb-6">
                <h2 className="text-2xl font-bold mb-4">{note.title}</h2>
                <p className="text-gray-700 mb-2">**建立日期:** {new Date(note.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-700 mb-4">**更新日期:** {new Date(note.updatedAt).toLocaleDateString()}</p>
                <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: note.content }}></div>
                <div className="flex space-x-4">
                  <Link to={`/notes/${note.id}/edit`}> {/* 這裡需要一個編輯頁面路由 */}
                    <Button variant="primary">編輯筆記</Button>
                  </Link>
                  <Button variant="danger" onClick={handleDelete}>刪除筆記</Button>
                </div>
              </Card>
              <Link to="/notes" className="text-primary hover:underline">返回筆記列表</Link>
            </div>
          );
        };

        export default NoteDetailPage;
        ```
        *   **注意**：在 `NoteDetailPage` 中，我們使用了 `dangerouslySetInnerHTML` 來渲染 HTML 內容。這在顯示富文本內容時是必要的，但請務必確保內容來源是可信的，以防止 XSS 攻擊。

### 5.3 富文本編輯器整合 (Optional, 進階)

為了提供更豐富的筆記編輯體驗，我們可以整合一個富文本編輯器。這裡我們以 [React Quill](https://quilljs.com/docs/formats/) 為例，它是一個功能強大且易於使用的富文本編輯器。

1.  **選擇並安裝 React Quill**
    *   安裝 `react-quill` 及其類型定義：
        ```bash
        npm install react-quill
        npm install --save-dev @types/react-quill
        # 或者
        yarn add react-quill
        yarn add -D @types/react-quill
        ```
    *   同時，我們需要引入 Quill 的樣式文件。在 `src/main.tsx` 或 `src/index.css` 中添加：
        ```css
        @import 'react-quill/dist/quill.snow.css'; /* 或 quill.bubble.css */
        ```

2.  **編輯器組件封裝與使用**
    *   建立一個 `NoteEditor.tsx` 組件來封裝富文本編輯器：
        ```tsx
        import React, { useState, useEffect } from 'react';
        import ReactQuill from 'react-quill';
        import 'react-quill/dist/quill.snow.css'; // 引入 Quill 樣式

        interface NoteEditorProps {
          value: string;
          onChange: (content: string) => void;
          placeholder?: string;
        }

        const NoteEditor: React.FC<NoteEditorProps> = ({ value, onChange, placeholder }) => {
          const modules = {
            toolbar: [
              [{ 'header': [1, 2, false] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
              ['link', 'image'],
              ['clean']
            ],
          };

          const formats = [
            'header',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image'
          ];

          return (
            <ReactQuill
              theme="snow"
              value={value}
              onChange={onChange}
              modules={modules}
              formats={formats}
              placeholder={placeholder}
              className="h-64 mb-12" // 設置高度，並為工具欄和內容留出空間
            />
          );
        };

        export default NoteEditor;
        ```
    *   修改 `src/pages/NotesPage.tsx` 中的 `Modal` 內容，使用 `NoteEditor` 替換原有的 `textarea`：
        ```tsx
        // ... (其他引入)
        import NoteEditor from '../components/NoteEditor'; // 引入 NoteEditor

        const NotesPage: React.FC = () => {
          // ... (狀態和函數保持不變)

          return (
            <div>
              {/* ... (頁面標頭和新增按鈕保持不變) */}

              {/* ... (筆記列表保持不變) */}

              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentNote ? '編輯筆記' : '新增筆記'}>
                <div className="space-y-4">
                  <Input
                    id="noteTitle"
                    label="筆記標題"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="輸入筆記標題"
                  />
                  <div>
                    <label htmlFor="noteContent" className="block text-sm font-medium text-gray-700 mb-1">筆記內容</label>
                    <NoteEditor
                      value={noteContent}
                      onChange={setNoteContent}
                      placeholder="輸入筆記內容..."
                    />
                  </div>
                  <Button onClick={handleSubmitNote} className="w-full mt-4"> {/* 調整按鈕的 margin-top */}
                    {currentNote ? '更新筆記' : '建立筆記'}
                  </Button>
                </div>
              </Modal>
            </div>
          );
        };

        export default NotesPage;
        ```

### 5.4 筆記分類與搜尋

為了方便管理大量的筆記，我們將添加筆記的搜尋功能。分類功能可以透過在 `Note` 介面中添加 `tags` 或 `category` 屬性來實現，並在 UI 中提供篩選選項。

1.  **實作關鍵字搜尋功能**
    *   修改 `src/pages/NotesPage.tsx`，添加搜尋狀態和過濾邏輯：
        ```tsx
        import React, { useState, useMemo } from 'react'; // 引入 useMemo
        // ... (其他引入)

        const NotesPage: React.FC = () => {
          const { notes, addNote, deleteNote, updateNote } = useNotes();
          const [isModalOpen, setIsModalOpen] = useState(false);
          const [currentNote, setCurrentNote] = useState<Note | null>(null);
          const [noteTitle, setNoteTitle] = useState('');
          const [noteContent, setNoteContent] = useState('');
          const [searchTerm, setSearchTerm] = useState(''); // 新增搜尋關鍵字狀態

          // ... (handleAddNote, handleEditNote, handleDeleteNote, handleSubmitNote 保持不變)

          // 過濾筆記列表
          const filteredNotes = useMemo(() => {
            if (!searchTerm) {
              return notes;
            }
            return notes.filter(
              (note) =>
                note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                note.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }, [notes, searchTerm]);

          return (
            <div>
              <PageHeader title="筆記" description="記錄您的想法和靈感。" />
              <div className="flex justify-between items-center mb-4">
                <Input 
                  id="searchNotes" 
                  placeholder="搜尋筆記..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full max-w-xs"
                />
                <Button onClick={handleAddNote}>新增筆記</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes.map((note) => (
                  <Card key={note.id} className="flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: note.content }}></p> {/* 顯示富文本摘要 */}
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Link to={`/notes/${note.id}`}>
                        <Button variant="outline" size="sm">查看</Button>
                      </Link>
                      <Button variant="outline" size="sm" onClick={() => handleEditNote(note)}>編輯</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteNote(note.id)}>刪除</Button>
                    </div>
                  </Card>
                ))}
              </div>

              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentNote ? '編輯筆記' : '新增筆記'}>
                <div className="space-y-4">
                  <Input
                    id="noteTitle"
                    label="筆記標題"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="輸入筆記標題"
                  />
                  <div>
                    <label htmlFor="noteContent" className="block text-sm font-medium text-gray-700 mb-1">筆記內容</label>
                    <NoteEditor
                      value={noteContent}
                      onChange={setNoteContent}
                      placeholder="輸入筆記內容..."
                    />
                  </div>
                  <Button onClick={handleSubmitNote} className="w-full mt-4">
                    {currentNote ? '更新筆記' : '建立筆記'}
                  </Button>
                </div>
              </Modal>
            </div>
          );
        };

        export default NotesPage;
        ```

至此，我們已經完成了筆記管理功能的核心實作，包括資料結構定義、使用 React Context API 進行狀態管理，以及整合富文本編輯器。在下一章中，我們將實作番茄鐘計時器和個人儀表板，並引入數據視覺化功能。

---

## 第六章：番茄鐘計時器與儀表板

本章將引導您實作「個人化任務與效能追蹤系統」中的番茄鐘計時器功能，並將其與任務、筆記數據整合到個人儀表板中。此外，我們還將引入數據視覺化，以圖表形式展示生產力趨勢，讓使用者對自己的工作效率有更直觀的了解。

### 6.1 番茄鐘計時器實作

番茄鐘計時器是一種時間管理方法，通常設定 25 分鐘工作，5 分鐘休息。我們將實作一個可配置的番茄鐘，並追蹤完成的番茄鐘次數。

1.  **計時器邏輯 (工作時間、休息時間、循環)**
    *   在 `src/components` 中建立 `PomodoroTimer.tsx` 文件。
    *   `src/components/PomodoroTimer.tsx`：
        ```tsx
        import React, { useState, useEffect, useCallback } from 'react';
        import Button from './Button';

        interface PomodoroTimerProps {
          workDuration?: number; // 工作時間，單位分鐘
          breakDuration?: number; // 休息時間，單位分鐘
          longBreakDuration?: number; // 長休息時間，單位分鐘
          cyclesBeforeLongBreak?: number; // 多少個番茄鐘循環後進入長休息
          onCycleComplete?: (cycleCount: number) => void; // 每次循環完成的回調
        }

        const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
          workDuration = 25,
          breakDuration = 5,
          longBreakDuration = 15,
          cyclesBeforeLongBreak = 4,
          onCycleComplete,
        }) => {
          const [timeRemaining, setTimeRemaining] = useState(workDuration * 60); // 單位秒
          const [isRunning, setIsRunning] = useState(false);
          const [isWorkTime, setIsWorkTime] = useState(true); // true: 工作時間, false: 休息時間
          const [cycleCount, setCycleCount] = useState(0); // 完成的番茄鐘循環次數

          const resetTimer = useCallback(() => {
            setIsRunning(false);
            setIsWorkTime(true);
            setTimeRemaining(workDuration * 60);
          }, [workDuration]);

          useEffect(() => {
            let interval: NodeJS.Timeout | null = null;

            if (isRunning && timeRemaining > 0) {
              interval = setInterval(() => {
                setTimeRemaining((prevTime) => prevTime - 1);
              }, 1000);
            } else if (isRunning && timeRemaining === 0) {
              // 時間到
              clearInterval(Number(interval));
              if (isWorkTime) {
                // 工作時間結束，進入休息時間
                const newCycleCount = cycleCount + 1;
                setCycleCount(newCycleCount);
                onCycleComplete?.(newCycleCount);

                if (newCycleCount % cyclesBeforeLongBreak === 0) {
                  // 長休息
                  setTimeRemaining(longBreakDuration * 60);
                  setIsWorkTime(false);
                } else {
                  // 短休息
                  setTimeRemaining(breakDuration * 60);
                  setIsWorkTime(false);
                }
              } else {
                // 休息時間結束，進入工作時間
                setTimeRemaining(workDuration * 60);
                setIsWorkTime(true);
              }
              // 自動開始下一個階段
              // setIsRunning(true); // 如果需要自動開始下一個階段，取消註釋此行
            }

            return () => {
              if (interval) {
                clearInterval(Number(interval));
              }
            };
          }, [isRunning, timeRemaining, isWorkTime, cycleCount, workDuration, breakDuration, longBreakDuration, cyclesBeforeLongBreak, onCycleComplete]);

          const toggleTimer = () => {
            setIsRunning((prev) => !prev);
          };

          const formatTime = (totalSeconds: number) => {
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          };

          return (
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">番茄鐘計時器</h3>
              <div className="text-6xl font-bold mb-4">
                {formatTime(timeRemaining)}
              </div>
              <p className="text-lg mb-4">
                {isWorkTime ? '專注工作' : '休息一下'}
              </p>
              <div className="flex space-x-4">
                <Button onClick={toggleTimer}>
                  {isRunning ? '暫停' : '開始'}
                </Button>
                <Button variant="outline" onClick={resetTimer}>
                  重置
                </Button>
              </div>
              <p className="mt-4 text-gray-600">已完成番茄鐘循環: {cycleCount}</p>
            </div>
          );
        };

        export default PomodoroTimer;
        ```
    *   這個組件包含了番茄鐘的核心邏輯，包括計時、狀態切換 (工作/休息)、循環計數和時間格式化。它還提供了開始、暫停和重置按鈕。

### 6.2 個人儀表板 (Dashboard)

儀表板是應用程式的中心，它將整合任務、筆記和番茄鐘的關鍵數據，為使用者提供一個全面的概覽。我們將修改 `DashboardPage.tsx` 來展示這些資訊。

1.  **整合任務、筆記、番茄鐘數據**
    *   修改 `src/pages/DashboardPage.tsx`：
        ```tsx
        import React, { useState, useEffect } from 'react';
        import PageHeader from '@/components/PageHeader';
        import Card from '@/components/Card';
        import Button from '@/components/Button';
        import PomodoroTimer from '@/components/PomodoroTimer';
        import { useNotes } from '@/context/NotesContext';
        import { Task } from '@/types/task';
        import axios from 'axios';
        import { Link } from 'react-router-dom';

        const API_BASE_URL = 'http://localhost:3001';

        const DashboardPage: React.FC = () => {
          const { notes } = useNotes();
          const [tasks, setTasks] = useState<Task[]>([]);
          const [completedPomodoroCycles, setCompletedPomodoroCycles] = useState(0);

          useEffect(() => {
            const fetchTasks = async () => {
              try {
                const response = await axios.get<Task[]>(`${API_BASE_URL}/tasks`);
                setTasks(response.data);
              } catch (error) {
                console.error('Error fetching tasks:', error);
              }
            };
            fetchTasks();
          }, []);

          const today = new Date().toISOString().split('T')[0];
          const upcomingTasks = tasks.filter(
            (task) => task.status !== 'completed' && task.dueDate && task.dueDate >= today
          ).sort((a, b) => (a.dueDate && b.dueDate ? a.dueDate.localeCompare(b.dueDate) : 0));

          const recentNotes = notes.slice(0, 3); // 顯示最近的三則筆記

          const handlePomodoroCycleComplete = (cycleCount: number) => {
            setCompletedPomodoroCycles(cycleCount);
            // 這裡可以將完成的番茄鐘次數儲存到後端或本地儲存
            console.log(`完成 ${cycleCount} 個番茄鐘循環！`);
          };

          return (
            <div>
              <PageHeader title="儀表板" description="概覽您的任務、筆記和生產力數據。" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* 今日任務 */}
                <Card className="lg:col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">今日/近期任務</h2>
                    <Link to="/tasks">
                      <Button variant="outline" size="sm">查看所有任務</Button>
                    </Link>
                  </div>
                  {upcomingTasks.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {upcomingTasks.map((task) => (
                        <li key={task.id} className="py-3 flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium">{task.title}</h3>
                            <p className="text-sm text-gray-500">截止日期: {task.dueDate}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${task.priority === 'high' ? 'bg-red-100 text-red-800' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">目前沒有近期任務。</p>
                  )}
                </Card>

                {/* 番茄鐘計時器 */}
                <PomodoroTimer onCycleComplete={handlePomodoroCycleComplete} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 近期筆記 */}
                <Card>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">近期筆記</h2>
                    <Link to="/notes">
                      <Button variant="outline" size="sm">查看所有筆記</Button>
                    </Link>
                  </div>
                  {recentNotes.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {recentNotes.map((note) => (
                        <li key={note.id} className="py-3">
                          <Link to={`/notes/${note.id}`} className="block">
                            <h3 className="text-lg font-medium text-primary hover:underline">{note.title}</h3>
                            <p className="text-sm text-gray-500">{new Date(note.createdAt).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-700 line-clamp-2">{note.content.replace(/<[^>]*>?/gm, '')}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">目前沒有近期筆記。</p>
                  )}
                </Card>

                {/* 生產力統計數據 (Placeholder) */}
                <Card>
                  <h2 className="text-xl font-semibold mb-4">生產力統計</h2>
                  <p className="text-gray-500">這裡將顯示生產力趨勢圖表和統計數據。</p>
                  <p className="mt-2">已完成番茄鐘循環總數: {completedPomodoroCycles}</p>
                  {/* 未來將在此處添加圖表組件 */}
                </Card>
              </div>
            </div>
          );
        };

        export default DashboardPage;
        ```
    *   我們在儀表板上展示了近期任務、番茄鐘計時器和最近的筆記。番茄鐘完成次數會動態更新。

### 6.3 數據視覺化 (Data Visualization)

數據視覺化是提升儀表板價值的關鍵。我們將使用 [Recharts](http://recharts.org/en-US/) 這個 React 圖表庫來繪製任務完成趨勢圖和番茄鐘使用分佈圖。Recharts 是一個基於 D3.js 的可組合圖表庫，非常適合 React 應用程式。

1.  **安裝圖表庫 (例如 Recharts)**
    *   安裝 Recharts：
        ```bash
        npm install recharts
        # 或者
        yarn add recharts
        ```

2.  **繪製任務完成趨勢圖**
    *   在 `src/components` 中建立 `TaskCompletionChart.tsx` 文件。
    *   `src/components/TaskCompletionChart.tsx`：
        ```tsx
        import React from 'react';
        import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
        import { Task } from '../types/task';

        interface TaskCompletionChartProps {
          tasks: Task[];
        }

        const TaskCompletionChart: React.FC<TaskCompletionChartProps> = ({ tasks }) => {
          // 處理數據以適應圖表格式
          const processData = () => {
            const dailyCompletions: { [key: string]: number } = {};
            tasks.forEach(task => {
              if (task.status === 'completed' && task.updatedAt) {
                const date = new Date(task.updatedAt).toISOString().split('T')[0];
                dailyCompletions[date] = (dailyCompletions[date] || 0) + 1;
              }
            });

            const data = Object.keys(dailyCompletions).sort().map(date => ({
              date,
              completedTasks: dailyCompletions[date],
            }));
            return data;
          };

          const data = processData();

          return (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completedTasks" stroke="#8884d8" activeDot={{ r: 8 }} name="完成任務數" />
              </LineChart>
            </ResponsiveContainer>
          );
        };

        export default TaskCompletionChart;
        ```
    *   這個組件接收任務列表，並將其處理成每日完成任務數的數據，然後使用 `LineChart` 進行視覺化。

3.  **繪製番茄鐘使用分佈圖 (Optional)**
    *   您可以類似地建立一個 `PomodoroUsageChart.tsx` 組件，使用 `BarChart` 或 `PieChart` 來展示番茄鐘的使用分佈，例如每天或每週的番茄鐘次數。

4.  **將圖表整合到 `DashboardPage`**
    *   修改 `src/pages/DashboardPage.tsx`，引入 `TaskCompletionChart` 並將其添加到生產力統計部分：
        ```tsx
        import React, { useState, useEffect } from 'react';
        // ... 其他引入
        import TaskCompletionChart from '../components/TaskCompletionChart'; // 引入圖表組件

        const API_BASE_URL = 'http://localhost:3001';

        const DashboardPage: React.FC = () => {
          const { notes } = useNotes();
          const [tasks, setTasks] = useState<Task[]>([]);
          const [completedPomodoroCycles, setCompletedPomodoroCycles] = useState(0);

          useEffect(() => {
            const fetchTasks = async () => {
              try {
                const response = await axios.get<Task[]>(`${API_BASE_URL}/tasks`);
                setTasks(response.data);
              } catch (error) {
                console.error('Error fetching tasks:', error);
              }
            };
            fetchTasks();
          }, []);

          // ... (upcomingTasks, recentNotes, handlePomodoroCycleComplete 保持不變)

          return (
            <div>
              <PageHeader title="儀表板" description="概覽您的任務、筆記和生產力數據。" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* 今日任務 */}
                <Card className="lg:col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">今日/近期任務</h2>
                    <Link to="/tasks">
                      <Button variant="outline" size="sm">查看所有任務</Button>
                    </Link>
                  </div>
                  {upcomingTasks.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {upcomingTasks.map((task) => (
                        <li key={task.id} className="py-3 flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium">{task.title}</h3>
                            <p className="text-sm text-gray-500">截止日期: {task.dueDate}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${task.priority === 'high' ? 'bg-red-100 text-red-800' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">目前沒有近期任務。</p>
                  )}
                </Card>

                {/* 番茄鐘計時器 */}
                <PomodoroTimer onCycleComplete={handlePomodoroCycleComplete} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 近期筆記 */}
                <Card>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">近期筆記</h2>
                    <Link to="/notes">
                      <Button variant="outline" size="sm">查看所有筆記</Button>
                    </Link>
                  </div>
                  {recentNotes.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {recentNotes.map((note) => (
                        <li key={note.id} className="py-3">
                          <Link to={`/notes/${note.id}`} className="block">
                            <h3 className="text-lg font-medium text-primary hover:underline">{note.title}</h3>
                            <p className="text-sm text-gray-500">{new Date(note.createdAt).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-700 line-clamp-2">{note.content.replace(/<[^>]*>?/gm, '')}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">目前沒有近期筆記。</p>
                  )}
                </Card>

                {/* 生產力統計數據 */}
                <Card>
                  <h2 className="text-xl font-semibold mb-4">任務完成趨勢</h2>
                  <TaskCompletionChart tasks={tasks} />
                  <p className="mt-4 text-gray-600">已完成番茄鐘循環總數: {completedPomodoroCycles}</p>
                </Card>
              </div>
            </div>
          );
        };

        export default DashboardPage;
        ```

至此，我們已經成功實作了番茄鐘計時器，並將其與任務、筆記數據整合到個人儀表板中，同時引入了數據視覺化來展示任務完成趨勢。在下一章中，我們將探討使用者認證、全域狀態管理和錯誤處理等進階議題。

---

## 第七章：使用者認證與進階議題

本章將深入探討 React 應用程式中至關重要的使用者認證 (Authentication) 功能，並介紹如何處理全域狀態管理、錯誤處理和載入狀態。這些進階議題對於構建健壯、可擴展且使用者友好的應用程式至關重要。

### 7.1 使用者認證流程

使用者認證是大多數 Web 應用程式不可或缺的一部分。我們將實作一個基於 JWT (JSON Web Token) 的模擬認證流程，包括登入、註冊和登出功能。

1.  **登入與註冊表單 (使用 React Hook Form)**
    *   我們已經在 `LoginPage.tsx` 和 `RegisterPage.tsx` 中建立了基本的表單結構。現在，我們將使用 React Hook Form 和 Zod 來處理表單的狀態管理和驗證。
    *   **`LoginPage.tsx`**：
        ```tsx
        import React from 'react';
        import { Link, useNavigate } from 'react-router-dom';
        import Input from '../components/Input';
        import Button from '../components/Button';
        import { useForm } from 'react-hook-form';
        import { zodResolver } from '@hookform/resolvers/zod';
        import * as z from 'zod';
        import axios from 'axios';

        const API_BASE_URL = 'http://localhost:3001';

        const loginSchema = z.object({
          email: z.string().email({ message: '請輸入有效的電子郵件地址' }),
          password: z.string().min(6, { message: '密碼至少需要 6 個字元' }),
        });

        type LoginFormInputs = z.infer<typeof loginSchema>;

        const LoginPage: React.FC = () => {
          const navigate = useNavigate();
          const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>({
            resolver: zodResolver(loginSchema),
          });

          const onSubmit = async (data: LoginFormInputs) => {
            try {
              // 模擬登入 API 請求
              const response = await axios.post(`${API_BASE_URL}/login`, { 
                email: data.email, 
                password: data.password 
              });
              // 假設後端返回一個 token
              const { accessToken, user } = response.data;
              localStorage.setItem('accessToken', accessToken);
              localStorage.setItem('user', JSON.stringify(user));
              alert('登入成功！');
              navigate('/'); // 登入成功後導向儀表板
            } catch (error) {
              console.error('登入失敗:', error);
              alert('登入失敗，請檢查您的電子郵件和密碼。');
            }
          };

          return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">登入您的帳戶</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    id="email"
                    label="電子郵件"
                    type="email"
                    placeholder="您的電子郵件"
                    {...register('email')}
                    error={errors.email?.message}
                  />
                  <Input
                    id="password"
                    label="密碼"
                    type="password"
                    placeholder="您的密碼"
                    {...register('password')}
                    error={errors.password?.message}
                  />
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-sm">
                      <Link to="/forgot-password" className="font-medium text-primary hover:text-blue-500">
                        忘記密碼？
                      </Link>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>登入</Button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                  還沒有帳戶？{' '}
                  <Link to="/register" className="font-medium text-primary hover:text-blue-500">
                    註冊
                  </Link>
                </p>
              </div>
            </div>
          );
        };

        export default LoginPage;
        ```
    *   **`RegisterPage.tsx`**：
        ```tsx
        import React from 'react';
        import { Link, useNavigate } from 'react-router-dom';
        import Input from '../components/Input';
        import Button from '../components/Button';
        import { useForm } from 'react-hook-form';
        import { zodResolver } from '@hookform/resolvers/zod';
        import * as z from 'zod';
        import axios from 'axios';

        const API_BASE_URL = 'http://localhost:3001';

        const registerSchema = z.object({
          name: z.string().min(1, { message: '使用者名稱不能為空' }),
          email: z.string().email({ message: '請輸入有效的電子郵件地址' }),
          password: z.string().min(6, { message: '密碼至少需要 6 個字元' }),
          confirmPassword: z.string().min(6, { message: '請確認密碼' }),
        }).refine((data) => data.password === data.confirmPassword, {
          message: '兩次輸入的密碼不一致',
          path: ['confirmPassword'],
        });

        type RegisterFormInputs = z.infer<typeof registerSchema>;

        const RegisterPage: React.FC = () => {
          const navigate = useNavigate();
          const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormInputs>({
            resolver: zodResolver(registerSchema),
          });

          const onSubmit = async (data: RegisterFormInputs) => {
            try {
              // 模擬註冊 API 請求
              await axios.post(`${API_BASE_URL}/register`, { 
                name: data.name, 
                email: data.email, 
                password: data.password 
              });
              alert('註冊成功！請登入。');
              navigate('/login'); // 註冊成功後導向登入頁面
            } catch (error) {
              console.error('註冊失敗:', error);
              alert('註冊失敗，請稍後再試。');
            }
          };

          return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">建立新帳戶</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    id="name"
                    label="使用者名稱"
                    type="text"
                    placeholder="您的使用者名稱"
                    {...register('name')}
                    error={errors.name?.message}
                  />
                  <Input
                    id="email"
                    label="電子郵件"
                    type="email"
                    placeholder="您的電子郵件"
                    {...register('email')}
                    error={errors.email?.message}
                  />
                  <Input
                    id="password"
                    label="密碼"
                    type="password"
                    placeholder="您的密碼"
                    {...register('password')}
                    error={errors.password?.message}
                  />
                  <Input
                    id="confirmPassword"
                    label="確認密碼"
                    type="password"
                    placeholder="再次輸入密碼"
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                  />
                  <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>註冊</Button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                  已經有帳戶？{' '}
                  <Link to="/login" className="font-medium text-primary hover:text-blue-500">
                    登入
                  </Link>
                </p>
              </div>
            </div>
          );
        };

        export default RegisterPage;
        ```

2.  **模擬 JWT (JSON Web Token) 認證流程**
    *   在上述的登入和註冊邏輯中，我們模擬了後端返回 `accessToken` 和 `user` 資訊，並將其儲存在 `localStorage` 中。在真實應用中，`accessToken` 會用於後續所有需要認證的 API 請求。
    *   **將 Token 儲存於 `localStorage` 或 `sessionStorage`**：
        *   `localStorage`：數據會永久儲存，直到被手動清除。適合儲存長期有效的 token。
        *   `sessionStorage`：數據只在當前會話有效，關閉瀏覽器頁面後會清除。適合儲存短期有效的 token。
        *   在本例中，我們使用 `localStorage` 來儲存 `accessToken` 和 `user` 資訊。

3.  **更新 `ProtectedRoute`**
    *   現在我們可以讓 `ProtectedRoute` 真正地檢查使用者是否已登入。
    *   修改 `src/components/ProtectedRoute.tsx`：
        ```tsx
        import React from 'react';
        import { Navigate, Outlet } from 'react-router-dom';

        interface ProtectedRouteProps {
          // isAuthenticated: boolean; // 不再直接傳遞，而是從 localStorage 獲取
          redirectPath?: string;
        }

        const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
          redirectPath = '/login',
        }) => {
          const isAuthenticated = localStorage.getItem('accessToken'); // 從 localStorage 檢查 token

          if (!isAuthenticated) {
            return <Navigate to={redirectPath} replace />;
          }

          return <Outlet />;
        };

        export default ProtectedRoute;
        ```
    *   修改 `src/App.tsx`，移除 `isAuthenticated` 的硬編碼：
        ```tsx
        // ... (其他引入)

        function App() {
          // const isAuthenticated = true; // 移除此行

          return (
            <NotesProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<ProtectedRoute />}> {/* 不再傳遞 isAuthenticated */}
                  <Route
                    path="/*"
                    element={
                      <Layout>
                        <Routes>
                          <Route path="/" element={<DashboardPage />} />
                          <Route path="/tasks" element={<TasksPage />} />
                          <Route path="/tasks/:id" element={<TaskDetailPage />} />
                          <Route path="/notes" element={<NotesPage />} />
                          <Route path="/notes/:id" element={<NoteDetailPage />} />
                          <Route path="/settings" element={<SettingsPage />} />
                        </Routes>
                      </Layout>
                    }
                  />
                </Route>
              </Routes>
            </NotesProvider>
          );
        }

        export default App;
        ```

### 7.2 全域狀態管理 (進階)

隨著應用程式的複雜度增加，單純使用 Context API 可能會變得難以管理。此時，專門的全域狀態管理庫如 Redux Toolkit 或 Zustand 便能派上用場。它們提供了更結構化、可預測的狀態管理模式。

1.  **介紹 Redux Toolkit 或 Zustand**
    *   **Redux Toolkit (RTK)**：Redux 的官方推薦工具集，簡化了 Redux 的學習曲線和開發流程。它包含了 Redux Core、Redux Thunk (處理異步操作) 和 Reselect (優化選擇器) 等，並提供了 `createSlice` 和 `createAsyncThunk` 等 API，大大減少了樣板程式碼。
        *   **優點**：成熟穩定、生態系統龐大、工具鏈完善、適合大型複雜應用。
        *   **缺點**：相較於 Context API 仍有一定學習曲線，概念較多。
    *   **Zustand**：一個輕量級、快速且可擴展的狀態管理解決方案。它使用 Hooks 的方式來管理狀態，語法簡潔，學習成本低。
        *   **優點**：極簡 API、性能優異、無需 Provider 包裹、適合中小型應用或對 Redux 感到複雜的開發者。
        *   **缺點**：相對 Redux 生態系統較小，某些進階功能可能需要手動實現。

2.  **將部分核心狀態遷移至 Redux/Zustand (例如：認證狀態、全域通知)**
    *   在本教學中，我們將以 **Zustand** 為例，展示如何將認證狀態遷移到全域管理。Zustand 的簡潔性使其非常適合快速入門。
    *   **安裝 Zustand**：
        ```bash
        npm install zustand
        # 或者
        yarn add zustand
        ```
    *   **建立 Zustand Store**：
        *   在 `src` 目錄下建立一個 `store` 資料夾，並在其中建立 `authStore.ts` 文件。
        *   `src/store/authStore.ts`：
            ```tsx
            import { create } from 'zustand';

            interface AuthState {
              accessToken: string | null;
              user: { id: string; name: string; email: string } | null;
              isAuthenticated: boolean;
              login: (accessToken: string, user: { id: string; name: string; email: string }) => void;
              logout: () => void;
            }

            export const useAuthStore = create<AuthState>((set) => ({
              accessToken: localStorage.getItem('accessToken'),
              user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null,
              isAuthenticated: !!localStorage.getItem('accessToken'),
              login: (accessToken, user) => {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('user', JSON.stringify(user));
                set({ accessToken, user, isAuthenticated: true });
              },
              logout: () => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                set({ accessToken: null, user: null, isAuthenticated: false });
              },
            }));
            ```
    *   **在 `LoginPage` 和 `RegisterPage` 中使用 Zustand**：
        *   修改 `src/pages/LoginPage.tsx`：
            ```tsx
            import React from 'react';
            import { Link, useNavigate } from 'react-router-dom';
            import Input from '../components/Input';
            import Button from '../components/Button';
            import { useForm } from 'react-hook-form';
            import { zodResolver } from '@hookform/resolvers/zod';
            import * as z from 'zod';
            import axios from 'axios';
            import { useAuthStore } from '../store/authStore'; // 引入 Zustand store

            const API_BASE_URL = 'http://localhost:3001';

            const loginSchema = z.object({
              email: z.string().email({ message: '請輸入有效的電子郵件地址' }),
              password: z.string().min(6, { message: '密碼至少需要 6 個字元' }),
            });

            type LoginFormInputs = z.infer<typeof loginSchema>;

            const LoginPage: React.FC = () => {
              const navigate = useNavigate();
              const login = useAuthStore((state) => state.login); // 從 Zustand 獲取 login 函數
              const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>({
                resolver: zodResolver(loginSchema),
              });

              const onSubmit = async (data: LoginFormInputs) => {
                try {
                  const response = await axios.post(`${API_BASE_URL}/login`, { 
                    email: data.email, 
                    password: data.password 
                  });
                  const { accessToken, user } = response.data;
                  login(accessToken, user); // 使用 Zustand 的 login 函數更新狀態
                  alert('登入成功！');
                  navigate('/');
                } catch (error) {
                  console.error('登入失敗:', error);
                  alert('登入失敗，請檢查您的電子郵件和密碼。');
                }
              };

              return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                  <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center mb-6">登入您的帳戶</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Input
                        id="email"
                        label="電子郵件"
                        type="email"
                        placeholder="您的電子郵件"
                        {...register('email')}
                        error={errors.email?.message}
                      />
                      <Input
                        id="password"
                        label="密碼"
                        type="password"
                        placeholder="您的密碼"
                        {...register('password')}
                        error={errors.password?.message}
                      />
                      <div className="flex items-center justify-between mb-6">
                        <div className="text-sm">
                          <Link to="/forgot-password" className="font-medium text-primary hover:text-blue-500">
                            忘記密碼？
                          </Link>
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>登入</Button>
                    </form>
                    <p className="mt-6 text-center text-sm text-gray-600">
                      還沒有帳戶？{' '}
                      <Link to="/register" className="font-medium text-primary hover:text-blue-500">
                        註冊
                      </Link>
                    </p>
                  </div>
                </div>
              );
            };

            export default LoginPage;
            ```
        *   修改 `src/pages/RegisterPage.tsx`：
            ```tsx
            import React from 'react';
            import { Link, useNavigate } from 'react-router-dom';
            import Input from '../components/Input';
            import Button from '../components/Button';
            import { useForm } from 'react-hook-form';
            import { zodResolver } from '@hookform/resolvers/zod';
            import * as z from 'zod';
            import axios from 'axios';
            // import { useAuthStore } from '../store/authStore'; // 註冊頁面不需要直接使用 authStore 的 login

            const API_BASE_URL = 'http://localhost:3001';

            const registerSchema = z.object({
              name: z.string().min(1, { message: '使用者名稱不能為空' }),
              email: z.string().email({ message: '請輸入有效的電子郵件地址' }),
              password: z.string().min(6, { message: '密碼至少需要 6 個字元' }),
              confirmPassword: z.string().min(6, { message: '請確認密碼' }),
            }).refine((data) => data.password === data.confirmPassword, {
              message: '兩次輸入的密碼不一致',
              path: ['confirmPassword'],
            });

            type RegisterFormInputs = z.infer<typeof registerSchema>;

            const RegisterPage: React.FC = () => {
              const navigate = useNavigate();
              const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormInputs>({
                resolver: zodResolver(registerSchema),
              });

              const onSubmit = async (data: RegisterFormInputs) => {
                try {
                  await axios.post(`${API_BASE_URL}/register`, { 
                    name: data.name, 
                    email: data.email, 
                    password: data.password 
                  });
                  alert('註冊成功！請登入。');
                  navigate('/login');
                } catch (error) {
                  console.error('註冊失敗:', error);
                  alert('註冊失敗，請稍後再試。');
                }
              };

              return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                  <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center mb-6">建立新帳戶</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Input
                        id="name"
                        label="使用者名稱"
                        type="text"
                        placeholder="您的使用者名稱"
                        {...register('name')}
                        error={errors.name?.message}
                      />
                      <Input
                        id="email"
                        label="電子郵件"
                        type="email"
                        placeholder="您的電子郵件"
                        {...register('email')}
                        error={errors.email?.message}
                      />
                      <Input
                        id="password"
                        label="密碼"
                        type="password"
                        placeholder="您的密碼"
                        {...register('password')}
                        error={errors.password?.message}
                      />
                      <Input
                        id="confirmPassword"
                        label="確認密碼"
                        type="password"
                        placeholder="再次輸入密碼"
                        {...register('confirmPassword')}
                        error={errors.confirmPassword?.message}
                      />
                      <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>註冊</Button>
                    </form>
                    <p className="mt-6 text-center text-sm text-gray-600">
                      已經有帳戶？{' '}
                      <Link to="/login" className="font-medium text-primary hover:text-blue-500">
                        登入
                      </Link>
                    </p>
                  </div>
                </div>
              );
            };

            export default RegisterPage;
            ```
    *   **更新 `ProtectedRoute`**：
        *   修改 `src/components/ProtectedRoute.tsx`，使用 `useAuthStore` 來檢查認證狀態：
            ```tsx
            import React from 'react';
            import { Navigate, Outlet } from 'react-router-dom';
            import { useAuthStore } from '../store/authStore'; // 引入 Zustand store

            interface ProtectedRouteProps {
              redirectPath?: string;
            }

            const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
              redirectPath = '/login',
            }) => {
              const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

              if (!isAuthenticated) {
                return <Navigate to={redirectPath} replace />;
              }

              return <Outlet />;
            };

            export default ProtectedRoute;
            ```
    *   **登出功能**：
        *   在 `Layout.tsx` 中添加登出按鈕，並使用 `useAuthStore` 的 `logout` 函數：
            ```tsx
            import React, { useState } from 'react';
            import { Link, NavLink, useNavigate } from 'react-router-dom'; // 引入 useNavigate
            import { HomeIcon, ListBulletIcon, DocumentTextIcon, Cog6ToothIcon, Bars3Icon, XMarkIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'; // 引入登出圖標
            import { useAuthStore } from '../store/authStore'; // 引入 Zustand store

            interface LayoutProps {
              children: React.ReactNode;
            }

            const Layout: React.FC<LayoutProps> = ({ children }) => {
              const [sidebarOpen, setSidebarOpen] = useState(false);
              const navigate = useNavigate();
              const logout = useAuthStore((state) => state.logout);
              const user = useAuthStore((state) => state.user);

              const navigation = [
                { name: '儀表板', href: '/', icon: HomeIcon },
                { name: '任務', href: '/tasks', icon: ListBulletIcon },
                { name: '筆記', href: '/notes', icon: DocumentTextIcon },
                { name: '設定', href: '/settings', icon: Cog6ToothIcon },
              ];

              const handleLogout = () => {
                logout();
                navigate('/login');
              };

              return (
                <div className="flex h-screen bg-gray-100 font-sans">
                  {/* Mobile sidebar */}
                  <div
                    className={`fixed inset-0 z-40 flex md:hidden ${sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'}
                    transition-transform duration-300`}
                    role="dialog" aria-modal="true"
                  >
                    <div className="relative mr-16 flex w-full max-w-xs flex-1">
                      <Transition
                        show={sidebarOpen}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                          <button
                            type="button"
                            className="-m-2.5 p-2.5"
                            onClick={() => setSidebarOpen(false)}
                          >
                            <span className="sr-only">Close sidebar</span>
                            <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                          </button>
                        </div>
                      </Transition>

                      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-dark px-6 pb-4">
                        <div className="flex h-16 shrink-0 items-center">
                          <Link to="/" className="text-white text-xl font-bold">
                            Productivity Hub
                          </Link>
                        </div>
                        <nav className="flex flex-1 flex-col">
                          <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                              <ul role="list" className="-mx-2 space-y-1">
                                {navigation.map((item) => (
                                  <li key={item.name}>
                                    <NavLink
                                      to={item.href}
                                      className={({ isActive }) =>
                                        `group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${isActive
                                          ? 'bg-primary text-white'
                                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
                                      }
                                      onClick={() => setSidebarOpen(false)}
                                    >
                                      <item.icon
                                        className="h-6 w-6 shrink-0"
                                        aria-hidden="true"
                                      />
                                      {item.name}
                                    </NavLink>
                                  </li>
                                ))}
                              </ul>
                            </li>
                            <li className="mt-auto">
                              <button
                                onClick={handleLogout}
                                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-300 hover:bg-gray-800 hover:text-white w-full text-left"
                              >
                                <ArrowLeftOnRectangleIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                登出
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </div>

                  {/* Desktop sidebar */}
                  <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:z-50 md:w-64">
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-dark px-6 pb-4">
                      <div className="flex h-16 shrink-0 items-center">
                        <Link to="/" className="text-white text-xl font-bold">
                          Productivity Hub
                        </Link>
                      </div>
                      <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                          <li>
                            <ul role="list" className="-mx-2 space-y-1">
                              {navigation.map((item) => (
                                <li key={item.name}>
                                  <NavLink
                                    to={item.href}
                                    className={({ isActive }) =>
                                      `group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${isActive
                                        ? 'bg-primary text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
                                    }
                                  >
                                    <item.icon
                                      className="h-6 w-6 shrink-0"
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </li>
                          <li className="mt-auto">
                            <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-300">
                              <img
                                className="h-8 w-8 rounded-full bg-gray-800"
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt=""
                              />
                              <span className="sr-only">Your profile</span>
                              <span>{user?.name || 'Guest'}</span>
                            </div>
                            <button
                              onClick={handleLogout}
                              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-300 hover:bg-gray-800 hover:text-white w-full text-left"
                            >
                              <ArrowLeftOnRectangleIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                              登出
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col md:pl-64">
                    <div className="sticky top-0 z-40 md:hidden flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-700 md:hidden"
                        onClick={() => setSidebarOpen(true)}
                      >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                      </button>
                      <div className="flex-1 text-base font-semibold leading-6 text-gray-900">
                        {/* Page Title will go here */}
                      </div>
                    </div>

                    <main className="flex-1 py-6">
                      <div className="px-4 sm:px-6 lg:px-8 h-full">
                        {children}
                      </div>
                    </main>
                  </div>
                </div>
              );
            };

            export default Layout;
            ```

### 7.3 錯誤處理與載入狀態

在實際應用中，錯誤處理和載入狀態是提升使用者體驗和應用程式穩定性的關鍵。我們將介紹如何實作全域錯誤邊界、載入指示器和友善的錯誤訊息提示。

1.  **全域錯誤邊界 (Error Boundaries)**
    *   錯誤邊界是 React 組件，它能捕獲其子組件樹中任何位置的 JavaScript 錯誤，記錄這些錯誤，並顯示一個備用 UI，而不是讓整個應用程式崩潰。
    *   在 `src/components` 中建立 `ErrorBoundary.tsx` 文件：
        ```tsx
        import React, { Component, ErrorInfo, ReactNode } from 'react';

        interface ErrorBoundaryProps {
          children: ReactNode;
        }

        interface ErrorBoundaryState {
          hasError: boolean;
        }

        class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
          public state: ErrorBoundaryState = {
            hasError: false,
          };

          public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
            // 更新 state 以便下一次渲染將顯示備用 UI
            return { hasError: true };
          }

          public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
            console.error('Uncaught error:', error, errorInfo);
            // 您也可以將錯誤報告給錯誤日誌服務
          }

          public render() {
            if (this.state.hasError) {
              // 您可以渲染任何自訂的備用 UI
              return (
                <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-800">
                  <h1 className="text-2xl font-bold">抱歉，發生了一些錯誤。</h1>
                  <p className="mt-4">請嘗試重新整理頁面或稍後再試。</p>
                </div>
              );
            }

            return this.props.children;
          }
        }

        export default ErrorBoundary;
        ```
    *   在 `src/main.tsx` 中使用 `ErrorBoundary` 包裹 `App` 組件：
        ```tsx
        import React from 'react';
        import ReactDOM from 'react-dom/client';
        import App from '@/App.tsx';
        import '@/index.css';
        import { BrowserRouter } from 'react-router-dom';
        import ErrorBoundary from './components/ErrorBoundary'; // 引入 ErrorBoundary

        ReactDOM.createRoot(document.getElementById('root')!).render(
          <React.StrictMode>
            <BrowserRouter>
              <ErrorBoundary> {/* 包裹 App 組件 */}
                <App />
              </ErrorBoundary>
            </BrowserRouter>
          </React.StrictMode>,
        );
        ```

2.  **載入指示器 (Loading Spinners)**
    *   在數據載入時顯示載入指示器可以提升使用者體驗，讓使用者知道應用程式正在工作。
    *   在 `src/components` 中建立 `LoadingSpinner.tsx` 文件：
        ```tsx
        import React from 'react';

        const LoadingSpinner: React.FC = () => {
          return (
            <div className="flex items-center justify-center">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
                <span
                  className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...</span>
              </div>
            </div>
          );
        };

        export default LoadingSpinner;
        ```
    *   在需要載入數據的組件中，例如 `TasksPage` 或 `NotesPage`，可以使用一個 `isLoading` 狀態來控制 `LoadingSpinner` 的顯示：
        ```tsx
        // 在 TasksPage.tsx 或 NotesPage.tsx 中
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
          const fetchData = async () => {
            setIsLoading(true);
            try {
              // ... 獲取數據的邏輯
            } catch (error) {
              // ... 錯誤處理
            } finally {
              setIsLoading(false);
            }
          };
          fetchData();
        }, []);

        if (isLoading) {
          return <LoadingSpinner />;
        }

        return (
          // ... 頁面內容
        );
        ```

3.  **友善的錯誤訊息提示**
    *   除了錯誤邊界，對於 API 請求等特定操作的錯誤，我們應該提供更具體的錯誤訊息給使用者。
    *   可以使用一個全域的通知系統 (例如 `react-hot-toast` 或自訂 Context) 來顯示這些訊息。
    *   **安裝 `react-hot-toast`**：
        ```bash
        npm install react-hot-toast
        # 或者
        yarn add react-hot-toast
        ```
    *   **在 `App.tsx` 中配置 `Toaster`**：
        ```tsx
        import React from 'react';
        import { Routes, Route } from 'react-router-dom';
        import Layout from './components/Layout';
        import ProtectedRoute from './components/ProtectedRoute';
        import { NotesProvider } from './context/NotesContext';
        import { Toaster } from 'react-hot-toast'; // 引入 Toaster

        // ... (引入所有頁面組件)

        function App() {
          return (
            <NotesProvider>
              <Toaster /> {/* 添加 Toaster 組件 */}
              <Routes>
                {/* ... 路由 */}
              </Routes>
            </NotesProvider>
          );
        }

        export default App;
        ```
    *   **在組件中使用 `toast` 提示**：
        ```tsx
        import toast from 'react-hot-toast';

        // ...
        try {
          // ... API 請求成功
          toast.success('操作成功！');
        } catch (error) {
          console.error('操作失敗:', error);
          toast.error('操作失敗，請稍後再試。');
        }
        ```

至此，我們已經涵蓋了使用者認證、全域狀態管理 (以 Zustand 為例) 和錯誤處理等進階議題。這些知識將幫助您構建更穩定、更易於維護的 React 應用程式。在最後一章中，我們將討論專案的部署和如何將其作為面試作品集進行展示。

---

## 第八章：部署與作品集呈現

恭喜您！到目前為止，您已經成功地從零開始構建了一個功能豐富的「個人化任務與效能追蹤系統」。本章將是整個教學的最後一部分，我們將討論如何優化您的專案、將其部署上線，以及最重要的是，如何將這個專案包裝成一個具備競爭力的面試作品集，讓您在求職過程中脫穎而出。

### 8.1 專案優化

在部署應用程式之前，進行一些優化可以顯著提升其性能和使用者體驗。一個快速響應的應用程式會給面試官留下更好的印象。

1.  **程式碼分割 (Code Splitting)**
    *   程式碼分割是將程式碼拆分成更小的塊，只在需要時才載入。這可以減少初始載入時間，特別是對於大型應用程式。
    *   React 提供了 `React.lazy()` 和 `Suspense` 來實現基於路由的程式碼分割。
    *   **範例**：在 `src/App.tsx` 中，您可以這樣修改來實現頁面級別的程式碼分割：
        ```tsx
        import React, { Suspense, lazy } from 'react';
        import { Routes, Route } from 'react-router-dom';
        import Layout from './components/Layout';
        import ProtectedRoute from './components/ProtectedRoute';
        import { NotesProvider } from './context/NotesContext';
        import { Toaster } from 'react-hot-toast';

        // 使用 React.lazy 延遲載入頁面組件
        const DashboardPage = lazy(() => import('./pages/DashboardPage'));
        const TasksPage = lazy(() => import('./pages/TasksPage'));
        const TaskDetailPage = lazy(() => import('./pages/TaskDetailPage'));
        const NotesPage = lazy(() => import('./pages/NotesPage'));
        const NoteDetailPage = lazy(() => import('./pages/NoteDetailPage'));
        const SettingsPage = lazy(() => import('./pages/SettingsPage'));
        const LoginPage = lazy(() => import('./pages/LoginPage'));
        const RegisterPage = lazy(() => import('./pages/RegisterPage'));

        function App() {
          return (
            <NotesProvider>
              <Toaster />
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route
                    path="/*"
                    element={
                      <Layout>
                        <Suspense fallback={<div>載入中...</div>}> {/* 顯示載入指示器 */}
                          <Routes>
                            <Route path="/" element={<DashboardPage />} />
                            <Route path="/tasks" element={<TasksPage />} />
                            <Route path="/tasks/:id" element={<TaskDetailPage />} />
                            <Route path="/notes" element={<NotesPage />} />
                            <Route path="/notes/:id" element={<NoteDetailPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                          </Routes>
                        </Suspense>
                      </Layout>
                    }
                  />
                </Route>
              </Routes>
            </NotesProvider>
          );
        }

        export default App;
        ```

2.  **圖片優化**
    *   使用適當的圖片格式 (例如 WebP 或 AVIF) 和壓縮工具來減小圖片檔案大小。
    *   對於響應式圖片，可以使用 `srcset` 屬性或 `<picture>` 元素，根據裝置螢幕大小載入不同尺寸的圖片。
    *   考慮使用圖片 CDN (內容分發網路) 來加速圖片載入。

3.  **Lighthouse 效能分析**
    *   Google Lighthouse 是一個開源的自動化工具，用於改進網頁的品質。它會對性能、可訪問性、最佳實踐、SEO 和 PWA (漸進式網頁應用程式) 進行審核。
    *   在 Chrome 瀏覽器的開發者工具中，切換到 `Lighthouse` 標籤，然後點擊 `Generate report` 即可生成報告。根據報告中的建議進行優化。

### 8.2 部署至 Vercel/Netlify

將您的 React 應用程式部署到線上，是展示您作品集的最後一步。Vercel 和 Netlify 都是非常受歡迎的靜態網站託管服務，它們提供了簡單的部署流程和強大的功能。

1.  **設定環境變數**
    *   在真實應用中，您可能會有一些敏感資訊 (例如 API 金鑰) 需要在部署時設定為環境變數。Vercel 和 Netlify 都提供了簡單的界面來管理這些變數。
    *   例如，如果您的 `API_BASE_URL` 在生產環境中與本地開發不同，您可以在 Vercel/Netlify 的專案設定中添加一個名為 `VITE_API_BASE_URL` 的環境變數 (Vite 會自動將 `VITE_` 開頭的變數暴露給客戶端)。

2.  **自動部署流程 (以 Vercel 為例)**
    *   **連接 GitHub 倉庫**：登入 Vercel (或 Netlify)，選擇 `New Project`，然後連接您的 GitHub 帳號並選擇您的專案倉庫。
    *   **配置專案**：Vercel 會自動檢測您的專案是 Vite 應用程式，並預設好構建命令 (`npm run build`) 和輸出目錄 (`dist`)。如果您的專案有特殊配置，可以在這裡修改。
    *   **部署**：點擊 `Deploy`，Vercel 會自動拉取您的程式碼，執行構建，並將應用程式部署到全球 CDN 上。每次您推送到 `main` 分支，Vercel 都會自動觸發重新部署。
    *   **自訂域名**：部署完成後，您可以為您的專案設定一個自訂域名。

### 8.3 作品集 README.md 撰寫

一個好的 `README.md` 文件是您作品集的門面。它應該清晰、簡潔地介紹您的專案，並引導面試官快速了解您的技術能力。

1.  **專案介紹、技術棧、功能列表**
    *   **專案名稱**：個人化任務與效能追蹤系統 (Personal Productivity Hub)
    *   **簡短描述**：一個現代化的 React 應用程式，旨在幫助使用者管理任務、記錄筆記、提升專注力並追蹤生產力。
    *   **主要功能**：
        *   使用者認證 (註冊、登入、登出)
        *   任務管理 (CRUD、分類、優先級、截止日期)
        *   筆記管理 (CRUD、富文本編輯、搜尋)
        *   番茄鐘計時器
        *   個人儀表板 (任務概覽、近期筆記、生產力統計)
        *   數據視覺化 (任務完成趨勢)
        *   響應式設計
    *   **技術棧**：
        *   **前端**：React 18+, TypeScript, Vite, Tailwind CSS, React Router DOM, React Hook Form, Zod, Axios, Recharts, React Quill, Zustand
        *   **後端模擬**：JSON Server
        *   **部署**：Vercel / Netlify

2.  **安裝與運行指南**
    *   提供清晰的步驟，說明如何將您的專案克隆到本地並運行起來。這對於面試官想要本地運行您的專案進行測試非常重要。
    *   **範例**：
        ```markdown
        ## 安裝與運行

        1.  **克隆倉庫**
            ```bash
            git clone https://github.com/您的用戶名/my-productivity-hub.git
            cd my-productivity-hub
            ```
        2.  **安裝依賴**
            ```bash
            npm install
            # 或者使用 yarn
            yarn
            ```
        3.  **啟動 JSON Server (模擬後端)**
            *   在新的終端機視窗中運行：
                ```bash
                json-server --watch db.json --port 3001
                ```
        4.  **啟動前端開發伺服器**
            *   在另一個終端機視窗中運行：
                ```bash
                npm run dev
                # 或者使用 yarn
                yarn dev
                ```
        5.  **訪問應用程式**
            *   應用程式將在 `http://localhost:5173` (或類似端口) 運行。
        ```

3.  **展示截圖與部署連結**
    *   在 `README.md` 中嵌入您應用程式的關鍵頁面截圖，例如儀表板、任務列表、筆記編輯器和登入頁面。這些截圖應該清晰地展示您的 UI/UX 設計和功能。
    *   提供一個可點擊的部署連結，讓面試官可以直接訪問您的線上應用程式。

### 8.4 面試技巧與作品集展示

擁有一個優秀的作品集只是成功的一半，如何有效地向面試官展示和介紹您的專案同樣重要。

1.  **如何向面試官介紹你的專案**
    *   **從宏觀到微觀**：首先簡要介紹專案的目標和解決的問題，然後深入講解您在專案中使用的關鍵技術和解決方案。
    *   **強調您的貢獻**：明確指出您在專案中負責的部分和遇到的挑戰，以及您是如何解決這些挑戰的。
    *   **展示核心功能**：準備一個簡短的演示，展示專案最亮眼的功能。確保演示流暢，並能回答面試官可能提出的問題。
    *   **討論技術決策**：解釋您為什麼選擇特定的技術棧 (例如為什麼使用 Vite 而不是 Webpack，為什麼選擇 Zustand 而不是 Redux)。這能展示您的思考能力和對技術的理解。

2.  **常見面試問題與準備**
    *   **「請介紹一下您的這個專案。」**：準備一個 2-3 分鐘的簡潔介紹，涵蓋專案目標、核心功能和技術亮點。
    *   **「您在專案中遇到了哪些挑戰？是如何解決的？」**：思考專案開發過程中遇到的技術難點 (例如狀態管理複雜性、響應式佈局挑戰、API 錯誤處理等)，並準備好您的解決方案。
    *   **「您對這個專案還有哪些改進的想法？」**：這能展示您的持續學習能力和對產品的思考。例如，您可以提到未來可以添加的功能 (例如日曆視圖、拖放排序、即時通知等) 或性能優化措施。
    *   **「您在這個專案中學到了什麼？」**：總結您在技術、問題解決和團隊合作方面的收穫。

透過本教學，您不僅掌握了 React 開發的實戰技能，更學會了如何將您的成果轉化為一份具備競爭力的面試作品集。祝您在求職路上一切順利！

---

## 參考資料

[1] 5 React Projects That Will Get You Hired. (2025, July 8). YouTube. [https://www.youtube.com/watch?v=99qVIswb0uA](https://www.youtube.com/watch?v=99qVIswb0uA)
[2] Build an outstanding portfolio with these 3 React project ... (2021, July 11). DEV Community. [https://dev.to/profydev/build-an-outstanding-portfolio-with-these-3-react-project-ideas-part-3-eii](https://dev.to/profydev/build-an-outstanding-portfolio-with-these-3-react-project-ideas-part-3-eii)
[3] React project ideas for portfolio. (2022, July 8). Reddit. [https://www.reddit.com/r/react/comments/t8vtm8/react_project_ideas_for_portfolio/](https://www.reddit.com/r/react/comments/t8vtm8/react_project_ideas_for_portfolio/)
[4] 60 React Project Ideas for 2026 - Beginner to Advanced. (2026, February 8). LinkedIn. [https://www.linkedin.com/posts/ali-raza-mernstackdeveloper_reactjs-frontenddevelopment-webdevelopment-activity-7416780056984719360--Z9V](https://www.linkedin.com/posts/ali-raza-mernstackdeveloper_reactjs-frontenddevelopment-webdevelopment-activity-7416780056984719360--Z9V)
[5] 15 React JS Projects for Beginners 2026. Codegnan. [https://codegnan.com/react-js-projects/](https://codegnan.com/react-js-projects/)
[6] What are some great React.js portfolio projects that I could ... (2016, July 8). Quora. [https://www.quora.com/What-are-some-great-React-js-portfolio-projects-that-I-could-use-to-attract-potential-employers](https://www.quora.com/What-are-some-great-React-js-portfolio-projects-that-I-could-use-to-attract-potential-employers)
[7] Build And Deploy a Modern Personal Portfolio with ReactJS and ... (2025, April 29). YouTube. [https://www.youtube.com/watch?v=ifOJ0R5UQOc](https://www.youtube.com/watch?v=ifOJ0R5UQOc)
[8] How to Build a Frontend Developer Portfolio in 2025 (Step-by-Step ... (2025, November 12). DEV Community. [https://dev.to/siddheshcodes/frontend-developer-portfolio-tips-for-2025-build-a-stunning-site-that-gets-you-hired-3hga](https://dev.to/siddheshcodes/frontend-developer-portfolio-tips-for-2025-build-a-stunning-site-that-gets-you-hired-3hga)
[9] Just want to share my personal portfolio website before 2025 - Reddit. (2024, December 31). Reddit. [https://www.reddit.com/r/react/comments/1hqgr8l/just_want_to_share_my_personal_portfolio_website/](https://www.reddit.com/r/react/comments/1hqgr8l/just_want_to_share_my_personal_portfolio_website/)
[10] How to build your portfolio website in 2025 - YouTube. (2025, October 1). YouTube. [https://www.youtube.com/watch?v=r9j-3jFpHFk](https://www.youtube.com/watch?v=r9j-3jFpHFk)
[11] Rate my Software Developer portfolio made using React and AI. (2025, November 23). Reddit. [https://www.reddit.com/r/reactjs/comments/1p4qykt/rate_my_software_developer_portfolio_made_using/](https://www.reddit.com/r/reactjs/comments/1p4qykt/rate_my_software_developer_portfolio_made_using/)
[12] 幫助他們找到第一個React 開發者的工作？ : r/reactjs - Reddit. (2021, March 31). Reddit. [https://www.reddit.com/r/reactjs/comments/mgxigg/can_anyone_share_their_portfolio_which_has_helped/?tl=zh-hant](https://www.reddit.com/r/reactjs/comments/mgxigg/can_anyone_share_their_portfolio_which_has_helped/?tl=zh-hant)
[13] 前端轉職人生Day17-作品篇 - iT 邦幫忙. iT 邦幫忙. [https://ithelp.ithome.com/articles/10323467](https://ithelp.ithome.com/articles/10323467)
[14] 前端作品集打造指南：讓你的專案成為履歷亮點 - 首頁. (2024, October 21). [https://hex2025.worksbyaaron.com/blog/good-resume](https://hex2025.worksbyaaron.com/blog/good-resume)
[15] React求職特訓營：精選30道實戰決勝題×轉職Q&A無痛提升你的前端 ... (2024, December 7). Google Books. [https://books.google.com/books/about/React%E6%B1%82%E8%81%B7%E7%89%B9%E8%A8%93%E7%87%9F_%E7%B2%BE%E9%81%B830%E9%81%93%E5%AF%A6%E6%88%B0.html?id=rbBHEQAAQBAJ](https://books.google.com/books/about/React%E6%B1%82%E8%81%B7%E7%89%B9%E8%A8%93%E7%87%9F_%E7%B2%BE%E9%81%B830%E9%81%93%E5%AF%A6%E6%88%B0.html?id=rbBHEQAAQBAJ)
