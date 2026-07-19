---
title: 'React 從零到深入實作手把手教學：個人化任務與效能追蹤系統'
---

# 第二章：核心 UI 組件與佈局
  在本章中，我們將開始構建應用程式的基礎 UI 組件和整體佈局。一個良好設計的 UI 不僅能提升使用者體驗，也能讓您的專案在面試中脫穎而出。我們將利用 `Tailwind CSS` 的強大功能，快速且靈活地實現響應式設計。

## 2.1 設計系統基礎
  在開始編寫組件之前，定義一些設計系統的基礎元素，如顏色、字體和間距，將有助於保持 UI 的一致性。

  ### 1. **顏色、字體、間距規範**
  - `Tailwind CSS` 預設提供了一套豐富的顏色、字體和間距選項。我們可以在 `index.css` 中進行擴展或自訂，以符合我們的品牌風格。
    
  - 打開 `index.css`，添加自訂顏色。例如，我們為應用程式定義一個主色調和輔助色調：
    ```css
    @import "tailwindcss";

    @theme {
      /* colors */
      --color-primary: #3B82F6;
      --color-secondary: #10B981;
      --color-dark: #1F2937;
      --color-light: #F9FAFB;
      --color-gray-text: #6B7280;

      /* fontFamily */
      --font-sans: 'Inter', 'sans-serif';
    }
    ```

  - **字體**：為了使用 `Inter` 字體，您需要在 `index.html` 中引入它。在 `<head>` 標籤內添加：
    ```html
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    ```
  - **間距**：`Tailwind CSS` 預設的間距比例尺 (spacing scale) 已經非常完善，通常無需額外自訂。例如 `p-4` 代表 `padding: 1rem` (16px)。

  ### 2. **響應式設計斷點設定**
  - `Tailwind CSS` 預設提供了 `sm`, `md`, `lg`, `xl`, `2xl` 等斷點，這些斷點通常足以應對大多數響應式設計需求。您也可以在 `index.css` 的 `@theme` 中自訂這些斷點。
    ```css
    @theme {
      --breakpoint-*: initial;
      --breakpoint-sm: 640px;
      --breakpoint-md: 768px;
      --breakpoint-lg: 1024px;
      --breakpoint-xl: 1280px;
      --breakpoint-2xl: 1536px;
    }
    ```
  - 例如，`md:flex` 表示在中等螢幕尺寸及以上應用 `display: flex`。

## 2.2 通用 UI 組件開發
  我們將從最基礎的通用 UI 組件開始，這些組件將在整個應用程式中重複使用，確保一致性和可維護性。

  ### 1. **按鈕 (Button) 組件**
  - 在 `src` 目錄下建立一個 `components` 資料夾，並在其中建立 `Button.tsx` 文件。
  - `src/components/ui/Button.tsx`：
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
      const baseStyles = 'font-medium rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer';

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

  - 這個 `Button` 組件支援不同的 `variant` (樣式) 和 `size` (大小)，並能接受額外的 `className` 和標準的 HTML `button` 屬性。

  ### 2. **輸入框 (Input) 組件**
  - `src/components/ui/Input.tsx`：
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
  
  -   此 `Input` 組件包含 `label` 和 `error` 屬性，方便表單處理和錯誤提示。

  ### 3. **卡片 (Card) 組件**
  - `src/components/ui/Card.tsx`：
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

  - `Card` 組件提供一個通用的容器，用於包裹內容，使其具有陰影和圓角。

  ### 4. **模態框 (Modal) 組件**
  - 先安裝 `@headlessui/react`：
    ```bash
    npm i -D @headlessui/react
    ```

  - `src/components/ui/Modal.tsx`：
    ```tsx
    import React from 'react';
    import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
    import Button from '@/components/Button';

    interface ModalProps {
      isOpen: boolean;
      onClose: () => void;
      title: string;
      children: React.ReactNode;
    }

    const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
      return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 duration-300 ease-out data-closed:opacity-0"
          />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <DialogPanel
                transition
                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all duration-300 ease-out data-closed:opacity-0 data-closed:scale-95"
              >
                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {title}
                </DialogTitle>
                <div className="mt-2">{children}</div>

                <div className="mt-4">
                  <Button type="button" variant="outline" onClick={onClose}>
                    關閉
                  </Button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      );
    };

    export default Modal;
    ```

  - 此 `Modal` 組件使用了 `@headlessui/react` 庫來處理可訪問性和動畫，提供了一個可重用的彈出視窗。

## 2.3 應用程式佈局
  現在我們將這些通用組件組合起來，構建應用程式的整體佈局，包括導航欄和主內容區。

  ### 1. **建立 `Layout` 組件**
  - `src/Layouts/Layout.tsx`：
    ```tsx
    import React, { useState } from 'react';
    import { Link, NavLink } from 'react-router-dom';
    import { HomeIcon, ListBulletIcon, DocumentTextIcon, Cog6ToothIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
    import { Transition } from '@headlessui/react';

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
              <div className="px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      );
    };

    export default Layout;
    ```

  - 這個 `Layout` 組件包含了響應式的側邊欄導航。在桌面版上，側邊欄會固定顯示；在行動版上，它會隱藏起來，並可以透過一個漢堡選單按鈕來切換顯示。
  
  - 我們使用了 `@heroicons/react` 來獲取圖標，請先安裝它：
    ```bash
    npm install @heroicons/react
    # 或者
    yarn add @heroicons/react
    ```
   
  - `NavLink` 用於導航連結，它會根據當前路由自動添加 `active` 類別，方便我們設定活躍狀態的樣式。

  ### 2. **整合 `Layout` 到 `App.tsx`**
  - 修改 `src/App.tsx`，將 `Layout` 組件包裹住您的應用程式內容。目前我們還沒有路由，所以先簡單展示：
    ```tsx
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

  - 運行 `npm run dev`，您應該會看到一個帶有側邊欄的佈局，以及主內容區的歡迎訊息。

## 2.4 頁面標題與麵包屑 (Breadcrumbs) 組件 (Optional)
  為了提升使用者體驗，我們可以在每個頁面顯示當前頁面的標題，並可選地添加麵包屑導航。

  ### 1. **`PageHeader` 組件**
  - `src/components/PageHeader.tsx`：
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

  ### 2. **使用 `PageHeader`**
  - 在 `App.tsx` 中使用 `PageHeader`：
    ```tsx
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

  至此，我們已經完成了應用程式的基礎 UI 組件和整體佈局。在下一章中，我們將整合 `React Router DOM`，實現頁面之間的導航和路由保護。