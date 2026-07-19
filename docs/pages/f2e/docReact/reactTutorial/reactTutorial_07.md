---
title: 'React 從零到深入實作手把手教學：個人化任務與效能追蹤系統'
---

# 第七章：使用者認證與進階議題
  本章將深入探討 `React` 應用程式中至關重要的 `使用者認證 (Authentication)` 功能，並介紹如何處理全域狀態管理、錯誤處理和載入狀態。這些進階議題對於構建健壯、可擴展且使用者友好的應用程式至關重要。

## 7.1 使用者認證流程
  使用者認證是大多數 Web 應用程式不可或缺的一部分。我們將實作一個基於 `JWT (JSON Web Token)` 的模擬認證流程，包括登入、註冊和登出功能。

  ### 1. **登入與註冊表單 (使用 `React Hook Form`)**
  - 我們已經在 `LoginPage.tsx` 和 `RegisterPage.tsx` 中建立了基本的表單結構。現在，我們將使用 `React Hook Form` 和 `Zod` 來處理表單的狀態管理和驗證。
    
  - **`LoginPage.tsx`**：
    ```tsx {3-15,18-41,46,52-53,60-61,70}
    import React from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import Input from '@/components/ui/Input';
    import Button from '@/components/ui/Button';
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

  - **`RegisterPage.tsx`**：
    ```tsx {2,5-22,25-44,50-83}
    import React from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import Input from '@/components/Input';
    import Button from '@/components/Button';
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

  ### 2. **模擬 JWT (JSON Web Token) 認證流程**
  - 在上述的登入和註冊邏輯中，我們模擬了後端返回 `accessToken` 和 `user` 資訊，並將其儲存在 `localStorage` 中。在真實應用中，`accessToken` 會用於後續所有需要認證的 API 請求。
    
  - **將 Token 儲存於 `localStorage` 或 `sessionStorage`**：
    - `localStorage`：數據會永久儲存，直到被手動清除。適合儲存長期有效的 `token`。
    - `sessionStorage`：數據只在當前會話有效，關閉瀏覽器頁面後會清除。適合儲存短期有效的 `token`。
    - 在本例中，我們使用 `localStorage` 來儲存 `accessToken` 和 `user` 資訊。

  ### 3. **更新 `ProtectedRoute`**
  - 現在我們可以讓 `ProtectedRoute` 真正地檢查使用者是否已登入。
    
  - 修改 `src/components/ProtectedRoute.tsx`：
    ```tsx {5,10,12-16}
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

  - 修改 `src/App.tsx`，移除 `isAuthenticated` 的硬編碼：
    ```tsx {4,12}
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

## 7.2 全域狀態管理 (進階)
  隨著應用程式的複雜度增加，單純使用 `Context API` 可能會變得難以管理。此時，專門的全域狀態管理庫如 `Redux Toolkit` 或 `Zustand` 便能派上用場。它們提供了更結構化、可預測的狀態管理模式。

  ### 1. **介紹 Redux Toolkit 或 Zustand**
  - **Redux Toolkit (RTK)**：`Redux` 的官方推薦工具集，簡化了 `Redux` 的學習曲線和開發流程。它包含了 `Redux Core`、`Redux Thunk` (處理異步操作) 和 `Reselect` (優化選擇器) 等，並提供了 `createSlice` 和 `createAsyncThunk` 等 API，大大減少了樣板程式碼。
    - **優點**：成熟穩定、生態系統龐大、工具鏈完善、適合大型複雜應用。
    - **缺點**：相較於 `Context API` 仍有一定學習曲線，概念較多。
    
  - **Zustand**：一個輕量級、快速且可擴展的狀態管理解決方案。它使用 `Hooks` 的方式來管理狀態，語法簡潔，學習成本低。
    - **優點**：極簡 API、性能優異、無需 `Provider` 包裹、適合中小型應用或對 `Redux` 感到複雜的開發者。
    - **缺點**：相對 `Redux` 生態系統較小，某些進階功能可能需要手動實現。

  ### 2. **將部分核心狀態遷移至 `Redux`/`Zustand` (例如：認證狀態、全域通知)**
  - 在本教學中，我們將以 **Zustand** 為例，展示如何將認證狀態遷移到全域管理。`Zustand` 的簡潔性使其非常適合快速入門。

  - **安裝 Zustand**：
    ```bash
    npm install zustand
    # 或者
    yarn add zustand
    ```
    
  - **建立 Zustand Store**：
    - 在 `src` 目錄下建立一個 `store` 資料夾，並在其中建立 `authStore.ts` 文件。
        
    - `src/store/authStore.ts`：
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
    
  - **在 `LoginPage` 和 `RegisterPage` 中使用 Zustand**：
    - 修改 `src/pages/LoginPage.tsx`：
      ```tsx {2,8,20}
      // 其他 import 不變
      import { useAuthStore } from '../store/authStore'; // 引入 Zustand store

      // 程式碼不變

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
          // return 不變
        );
      };

      export default LoginPage;
      ```
        
    - 修改 `src/pages/RegisterPage.tsx`：
      ```tsx
      // import { useAuthStore } from '@/store/authStore'; // 註冊頁面不需要直接使用 authStore 的 login

      // 其他 程式碼不變
      ```
    
  - **更新 `ProtectedRoute`**：
    - 修改 `src/components/ProtectedRoute.tsx`，使用 `useAuthStore` 來檢查認證狀態：
      ```tsx {3,12}
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
    
  - **登出功能**：
    - 在 `Layout.tsx` 中添加登出按鈕，並使用 `useAuthStore` 的 `logout` 函數：
      ```tsx {2-3,5,13-15,24-27,71-79,93-109}
      import React, { useState } from 'react';
      import { Link, NavLink, useNavigate } from 'react-router-dom'; // 引入 useNavigate
      import { HomeIcon, ListBulletIcon, DocumentTextIcon, Cog6ToothIcon, Bars3Icon, XMarkIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'; // 引入登出圖標
      import { Transition } from '@headlessui/react';
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
                // 此處程式碼不變

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
                {/* // 此處程式碼不變 */}
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    {/* // 此處程式碼不變 */}
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
              {/* // 此處程式碼不變 */}
            </div>
          </div>
        );
      };

      export default Layout;
      ```

## 7.3 錯誤處理與載入狀態
  在實際應用中，錯誤處理和載入狀態是提升使用者體驗和應用程式穩定性的關鍵。我們將介紹如何實作全域錯誤邊界、載入指示器和友善的錯誤訊息提示。

  ### 1. **全域錯誤邊界 (Error Boundaries)**
  - 錯誤邊界是 `React` 組件，它能捕獲其子組件樹中任何位置的 `JavaScript` 錯誤，記錄這些錯誤，並顯示一個備用 `UI`，而不是讓整個應用程式崩潰。
    
  - 在 `src/components` 中建立 `ErrorBoundary.tsx` 文件：
    ```tsx
    import { Component, type ErrorInfo, type ReactNode } from 'react';

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
    
  - 在 `src/main.tsx` 中使用 `ErrorBoundary` 包裹 `App` 組件：
    ```tsx {6,11,13}
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from '@/App.tsx';
    import '@/index.css';
    import { BrowserRouter } from 'react-router-dom';
    import ErrorBoundary from '@/components/ErrorBoundary'; // 引入 ErrorBoundary

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

  ### 2. **載入指示器 (Loading Spinners)**
  - 在數據載入時顯示載入指示器可以提升使用者體驗，讓使用者知道應用程式正在工作。
    
  - 在 `src/components` 中建立 `LoadingSpinner.tsx` 文件：
    ```tsx
    import React from 'react';

    const LoadingSpinner: React.FC = () => {
      return (
        <div className="flex items-center justify-center h-full">
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
    
  - 在需要載入數據的組件中，例如 `TasksPage` 或 `NotesPage`，可以使用一個 `isLoading` 狀態來控制 `LoadingSpinner` 的顯示：
    ```tsx
    // 在 TasksPage.tsx 或 NotesPage.tsx 中
    import LoadingSpinner from '@/components/LoadingSpinner'; // 引入 LoadingSpinner

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

  ### 3. **友善的錯誤訊息提示**
  - 除了錯誤邊界，對於 `API` 請求等特定操作的錯誤，我們應該提供更具體的錯誤訊息給使用者。

  - 可以使用一個全域的通知系統 (例如 `react-hot-toast` 或自訂 `Context`) 來顯示這些訊息。
    
  - **安裝 `react-hot-toast`**：
    ```bash
    npm install react-hot-toast
    # 或者
    yarn add react-hot-toast
    ```
    
  - **在 `App.tsx` 中配置 `Toaster`**：
    ```tsx {5,12}
    import { Routes, Route } from 'react-router-dom';
    import Layout from '@/components/Layout';
    import ProtectedRoute from '@/components/ProtectedRoute';
    import { NotesProvider } from '@/context/NotesContext';
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
    
  - **在組件中使用 `toast` 提示**：
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

  - 至此，我們已經涵蓋了使用者認證、全域狀態管理 (以 `Zustand` 為例) 和錯誤處理等進階議題。這些知識將幫助您構建更穩定、更易於維護的 `React` 應用程式。在最後一章中，我們將討論專案的部署和如何將其作為面試作品集進行展示。