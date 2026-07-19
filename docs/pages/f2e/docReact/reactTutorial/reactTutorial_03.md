---
title: 'React 從零到深入實作手把手教學：個人化任務與效能追蹤系統'
---

# 第三章：路由管理與頁面建立
  在本章中，我們將深入學習如何使用 `React Router DOM` 來管理應用程式的路由，並建立各個主要頁面。`React Router DOM` 是 `React` 應用程式中最常用的路由解決方案，它允許我們在不重新載入整個頁面的情況下，實現不同視圖之間的切換，從而提供流暢的單頁應用程式 (`SPA`) 體驗。

## 3.1 React Router DOM 基礎
  ### 1. **安裝與配置 `BrowserRouter`, `Routes`, `Route`**
  - 首先，在您的專案中安裝 `react-router-dom`：
    ```bash
    npm install react-router-dom
    # 或者
    yarn add react-router-dom
    ```
    
  - 安裝完成後，我們需要在應用程式的根組件 (`src/main.tsx`) 中配置路由。打開 `src/main.tsx` 並修改為以下內容：
    ```tsx
    import { StrictMode } from 'react';
    import { createRoot } from 'react-dom/client';
    import App from '@/App.tsx';
    import '@/index.css';
    import { BrowserRouter } from 'react-router-dom';

    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>,
    );
    ```
    
    - `BrowserRouter` 是 `React Router DOM` 的核心組件，它使用 `HTML5 history API` (`pushState`, `replaceState` 和 `popstate` 事件) 來保持 UI 與 URL 的同步。
  
  - 接下來，我們將在 `App.tsx` 中定義應用程式的路由。打開 `src/App.tsx` 並修改為以下內容：
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

    - `Routes` 組件用於包裹所有的 `Route`，它會根據當前 `URL` 匹配第一個符合的 `Route` 並渲染其 `element`。
    - `Route` 組件定義了特定的路徑 (`path`) 和當該路徑被匹配時應渲染的組件 (`element`)。
    - 我們將 `Layout` 組件作為一個父級路由，這樣所有需要佈局的頁面都會被包裹在其中。而 `/login` 和 `/register` 頁面則獨立於佈局之外。

  ### 2. **`Link` 與 `NavLink` 的使用**
  - 在 `Layout.tsx` 中，我們已經使用了 `Link` 和 `NavLink` 來創建導航連結。它們是 `React Router DOM` 提供的組件，用於在應用程式內部進行導航，而不會觸發瀏覽器重新載入頁面。
    
  - `Link`：用於簡單的導航，當點擊時會改變 `URL` 並渲染對應的組件。
    ```tsx
    import { Link } from 'react-router-dom';
    // ...
    <Link to="/dashboard">前往儀表板</Link>
    ```
    
  - `NavLink`：與 `Link` 類似，但它會根據當前 URL 是否匹配其 `to` 屬性，自動添加 `active` 類別。這對於導航菜單中高亮顯示當前活躍項目非常有用。
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
        
    在 `Layout.tsx` 中，我們已經利用 `NavLink` 的 `isActive` 屬性來動態應用 `Tailwind CSS` 類別，以高亮顯示當前選中的導航項目。

## 3.2 建立主要頁面
  現在我們將為應用程式的每個主要功能模組建立獨立的頁面組件。這些組件將是未來添加具體功能的地方。

  ### 1. **建立頁面組件檔案**
  - 在 `src` 目錄下建立一個 `pages` 資料夾。
    
  - 在 `src/pages` 中建立以下檔案：
    - `DashboardPage.tsx`
    - `TasksPage.tsx`
    - `NotesPage.tsx`
    - `SettingsPage.tsx`
    - `LoginPage.tsx`
    - `RegisterPage.tsx`

  ### 2. **`DashboardPage.tsx`**
  ```tsx
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

  ### 3. **`TasksPage.tsx`**
  ```tsx
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

  ### 4. **`NotesPage.tsx`**
  ```tsx
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

  ### 5. **`SettingsPage.tsx`**
  ```tsx
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

  ### 6. **`LoginPage.tsx`**
  ```tsx
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

  ### 7. **`RegisterPage.tsx`**
  ```tsx
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

  - **重要提示**：請確保在 `App.tsx` 中將這些頁面組件的引入路徑更新為 `src/pages/` 下的實際路徑，例如：
    ```tsx
    import DashboardPage from './pages/DashboardPage';
    import TasksPage from './pages/TasksPage';
    import NotesPage from './pages/NotesPage';
    import SettingsPage from './pages/SettingsPage';
    import LoginPage from './pages/LoginPage';
    import RegisterPage from './pages/RegisterPage';
    ```

## 3.3 巢狀路由與動態路由
  對於需要顯示詳細資訊的頁面，例如任務詳情或筆記詳情，我們需要使用巢狀路由和動態路由。

  ### 1. **實作任務詳情頁 (`/tasks/:id`)**
  - 在 `src/pages` 中建立 `TaskDetailPage.tsx`：
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
    
  - 修改 `App.tsx`，在 `Layout` 內的 `Routes` 中添加任務詳情路由：
    ```tsx {2,16}
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

    - `path="/tasks/:id"` 中的 `:id` 是一個動態參數，它會匹配 `URL` 中該位置的任何值。我們可以使用 `useParams` Hook 來獲取這個值。

  ### 2. **實作筆記詳情頁 (`/notes/:id`)**
  - 在 `src/pages` 中建立 `NoteDetailPage.tsx`：
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
    
  - 修改 `App.tsx`，在 `Layout` 內的 `Routes` 中添加筆記詳情路由：
    ```tsx {2,18} 
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

## 3.4 路由保護 (Protected Routes)
  對於需要使用者登入才能訪問的頁面，我們需要實作路由保護。這通常透過一個高階組件 (Higher-Order Component, `HOC`) 或自訂 `Hook` 來實現。

  ### 1. **建立 `AuthGuard` 或 `ProtectedRoute` 組件**
  - 在 `src/components` 中建立 `ProtectedRoute.tsx`：
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

  - `isAuthenticated` 是一個布林值，表示使用者是否已登入。在實際應用中，這會從您的認證狀態管理中獲取。

  - 如果使用者未登入，`Navigate` 組件會將其重定向到登入頁面。

  - `Outlet` 組件用於渲染巢狀路由的子元素。

  ### 2. **根據使用者登入狀態導航**
  - 修改 `App.tsx`，將需要保護的路由包裹在 `ProtectedRoute` 中。為了演示，我們暫時將 `isAuthenticated` 設為 `true`，在實際應用中，這會是一個動態值。
    ```tsx {5,18,25,41}
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

    - 現在，所有在 `ProtectedRoute` 內部定義的路由 (即 `Layout` 及其子路由) 都將受到保護。如果 `isAuthenticated` 為 `false`，使用者將被重定向到 `/login` 頁面。

  至此，我們已經完成了應用程式的路由管理和主要頁面的建立。在下一章中，我們將開始實作任務管理的核心功能，包括資料結構設計、狀態管理和表單處理。