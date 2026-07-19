---
title: 'React 從零到深入實作手把手教學：個人化任務與效能追蹤系統'
---

# 第四章：任務管理功能實作
  本章將專注於實作「個人化任務與效能追蹤系統」的核心功能之一：`任務管理`。我們將從任務的資料結構設計開始，逐步實現任務的 `增、刪、改、查 (CRUD)` 操作，並引入表單處理、篩選、排序與搜尋功能。為了模擬真實的後端互動，我們還將使用 `JSON Server` 來提供模擬的 `RESTful API`。

## 4.1 任務資料結構設計
  在開始編寫任務管理功能之前，首先需要定義任務的資料結構。使用 `TypeScript` 的介面 (Interface) 可以為我們的任務物件提供清晰的類型定義，提升程式碼的可讀性和可維護性。

  ### 1. **定義 TypeScript 介面 (Interface) for Task**
  - 在 `src` 目錄下建立一個 `types` 資料夾，並在其中建立 `task.d.ts` 文件。
    
  - `src/types/task.d.ts`：
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
    
  - 這個介面定義了一個任務物件應包含的所有屬性及其類型。`?` 表示該屬性是 `可選` 的。

## 4.2 使用 React State 管理任務列表
  我們將使用 React 的 `useState` 和 `useEffect` Hooks 來管理任務列表的狀態，並在組件內部實現任務的 `CRUD` 邏輯。這將是我們理解 `React` 狀態管理基礎的重要一步。

  ### 1. **`useState` 與 `useEffect` 基礎**
  - `useState`：用於在函數組件中添加狀態變數。它返回一個包含當前狀態值和一個更新該狀態的函數的陣列。
    ```ts
    const [count, setCount] = useState(0);
    ```
    
  - `useEffect`：用於在函數組件中執行副作用操作，例如資料獲取、訂閱或手動更改 `DOM`。它會在組件渲染後執行，並且可以選擇在組件卸載時進行清理。
    ```ts
    useEffect(() => {
      // 執行副作用操作
      console.log('組件已渲染或更新');
      return () => {
        // 清理操作 (組件卸載時執行)
        console.log('組件已卸載');
      };
    }, [dependency]); // 依賴陣列，當依賴項改變時重新執行副作用
    ```

  ### 2. **任務列表的增、刪、改、查邏輯**
  - 修改 `src/pages/TasksPage.tsx`，引入 `Task` 介面並實作基本的任務管理邏輯：
    ```tsx {1,3-8,13-138,143-245}
    import React, { useState, useEffect } from 'react';
    import PageHeader from '@/components/PageHeader';
    import Card from '@/components/ui/Card';
    import Button from '@/components/ui/Button';
    import Input from '@/components/ui/Input';
    import Modal from '@/components/ui/Modal';
    import type { Task } from 'src/types/task';
    import { v4 as uuidv4 } from 'uuid'; // 用於生成唯一 ID

    // 安裝 uuid: npm install uuid @types/uuid

    const TasksPage: React.FC = () => {
      const [tasks, setTasks] = useState<Task[]>([]);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
      const [currentTask, setCurrentTask] = useState<Task | null>(null);
      const [newTaskTitle, setNewTaskTitle] = useState('');
      const [newTaskDescription, setNewTaskDescription] = useState('');
      const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium');
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

      const handleDeleteTask = (task: Task) => {
        setCurrentTask(task);
        setIsConfirmModalOpen(true);
      };

      const confirmDeleteTask = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));
        setIsConfirmModalOpen(false);
      }

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
                        <Button variant="danger" size="sm" onClick={() => handleDeleteTask(task)}>刪除</Button>
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

          {/* 刪除確認 Modal */}
          <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} title="確認刪除">
            <div className="space-y-4">
              <p>您確定要刪除任務 "{currentTask?.title}" 嗎？此操作無法復原。</p>
              <Button variant="danger" onClick={() => {
                if (currentTask) {
                  confirmDeleteTask(currentTask.id);
                }
              }} className="w-full">
                確定刪除
              </Button>
            </div>
          </Modal>
        </div>
      );
    };

    export default TasksPage;
    ```
    
  - **注意**：上述程式碼中使用了 `uuid` 庫來生成唯一的 ID。請先安裝它：`npm install uuid @types/uuid`。
    
  - 我們在 `TasksPage` 中實作了任務的顯示、新增、編輯和刪除功能。新增和編輯任務透過一個模態框 (Modal) 進行。

## 4.3 任務表單開發
  雖然我們在 `TasksPage` 中已經實現了基本的表單輸入，但對於更複雜的表單，我們通常會使用專門的表單處理庫，例如 `React Hook Form`。它能幫助我們更高效地處理表單狀態、驗證和提交。

  ### 1. **使用 React Hook Form 處理表單輸入**
  - 安裝 `React Hook Form` 和 `Zod` (用於驗證)：
    ```bash
    npm install react-hook-form zod
    # 或者
    yarn add react-hook-form zod
    ```

  - 建立一個新的 `TaskForm.tsx` 組件來封裝表單邏輯：
    ```tsx
    import React, { useEffect } from 'react';
    import { useForm } from 'react-hook-form';
    import { zodResolver } from '@hookform/resolvers/zod';
    import * as z from 'zod';
    import Input from '@/components/ui/Input';
    import Button from '@/components/ui/Button';
    import type { Task } from '@/types/task';

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

  - **注意**：請先安裝 `@hookform/resolvers`：`npm install @hookform/resolvers`。
  
  - `useForm` Hook 提供了 `register` 用於將輸入元素註冊到表單，`handleSubmit` 用於處理表單提交，以及 `formState: { errors }` 用於獲取驗證錯誤。

  - `zodResolver` 將 Zod 驗證模式整合到 React Hook Form 中，實現強大的表單驗證。

  ### 2. **將 `TaskForm` 整合到 `TasksPage`**
  - 修改 `src/pages/TasksPage.tsx`，使用 `TaskForm` 替換原有的表單部分：
    ```tsx {6,72-101,172-176}
    import React, { useState, useEffect } from 'react';
    import PageHeader from '@/components/PageHeader';
    import Card from '@/components/ui/Card';
    import Button from '@/components/ui/Button';
    import Modal from '@/components/ui/Modal';
    import TaskForm from '@/components/TaskForm'; // 引入 TaskForm
    import type { Task } from '@/types/task';
    import { v4 as uuidv4 } from 'uuid';

    const TasksPage: React.FC = () => {
      const [tasks, setTasks] = useState<Task[]>([]);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [currentTask, setCurrentTask] = useState<Task | null>(null);
      const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

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

      const handleDeleteTask = (task: Task) => {
        setCurrentTask(task);
        setIsConfirmModalOpen(true);
      };

      const confirmDeleteTask = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));
        setIsConfirmModalOpen(false);
      }

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

          <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} title="確認刪除">
            <div className="space-y-4">
              <p>您確定要刪除任務 "{currentTask?.title}" 嗎？此操作無法復原。</p>
              <Button variant="danger" onClick={() => {
                if (currentTask) {
                  confirmDeleteTask(currentTask.id);
                }
              }} className="w-full">
                確定刪除
              </Button>
            </div>
          </Modal>
        </div>
      );
    };

    export default TasksPage;
    ```

## 4.4 任務篩選、排序與搜尋
  為了讓任務列表更具實用性，我們需要添加篩選、排序和搜尋功能，讓使用者能夠快速找到所需的任務。

  ### 1. **實作任務狀態篩選 (全部、待辦、已完成)**
  - 在 `TasksPage` 中添加一個狀態來儲存當前的篩選條件，並根據該條件過濾任務列表。
    
  - 修改 `src/pages/TasksPage.tsx`：
    ```tsx {1,9-12,16-46,53-91,105}
    import React, { useState, useEffect, useMemo } from 'react'; // 引入 useMemo
    // ... 其他引入

    const TasksPage: React.FC = () => {
      const [tasks, setTasks] = useState<Task[]>([]);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [currentTask, setCurrentTask] = useState<Task | null>(null);
      const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
      const [filterStatus, setFilterStatus] = useState<Task['status'] | 'all'>('all'); // 新增篩選狀態
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
    
  - 我們引入了 `useMemo` Hook 來優化過濾和排序邏輯，避免在每次渲染時都重新計算。

## 4.5 後端模擬：JSON Server
  在前端開發階段，我們通常沒有一個完整的後端 API。`JSON Server` 是一個非常方便的工具，它允許我們快速建立一個假的 `RESTful API`，以便前端可以像與真實後端互動一樣進行開發和測試。

  ### 1. **安裝與配置 JSON Server**
  - 在您的專案根目錄下安裝 `json-server`：
    ```bash
    npm install -g json-server
    # 或者
    yarn global add json-server
    ```
    
  - 在專案根目錄下建立一個 `db.json` 文件，作為您的假資料庫：
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
    
  - 在終端機中，從專案根目錄啟動 `JSON Server`：
    ```bash
    json-server --watch db.json --port 3001
    ```
        
  - 現在，您就可以透過 `http://localhost:3001/tasks` 訪問您的任務 API 了！

  ### 2. **使用 `fetch` 或 `Axios` 進行 API 請求**
  - 我們將修改 `TasksPage`，使其從 JSON Server 獲取任務數據，而不是使用硬編碼的數據。
    
  - 首先，如果您想使用 `Axios` (一個基於 `Promise` 的 HTTP 客戶端)，請安裝它：
    ```bash
    npm install axios
    # 或者
    yarn add axios
    ```
    
  - 修改 `src/pages/TasksPage.tsx`，使用 `fetch` 或 `Axios` 進行 API 請求：
    ```tsx {10,12,23-35,47-54,56,58,60-70,83-84,88-89,92-105}
    import React, { useState, useEffect, useMemo } from 'react';
    import PageHeader from '@/components/PageHeader';
    import Card from '@/components/ui/Card';
    import Button from '@/components/ui/Button';
    import Input from '@/components/ui/Input';
    import Modal from '@/components/ui/Modal';
    import TaskForm from '@/components/TaskForm';
    import type { Task } from '@/types/task';
    import { v4 as uuidv4 } from 'uuid';
    import axios from 'axios'; // 引入 axios

    const API_BASE_URL = 'http://localhost:3001'; // JSON Server 的基礎 URL

    const TasksPage: React.FC = () => {
      const [tasks, setTasks] = useState<Task[]>([]);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [currentTask, setCurrentTask] = useState<Task | null>(null);
      const [filterStatus, setFilterStatus] = useState<Task['status'] | 'all'>('all');
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
        // ... return 保持不變
      );
    };

    export default TasksPage;
    ```

  至此，我們已經完成了任務管理的核心功能，包括資料結構定義、使用 React `State` 進行 `CRUD` 操作、整合 `React Hook Form` 進行表單處理和驗證，以及透過 `JSON Server` 模擬後端 `API` 互動。在下一章中，我們將轉向筆記管理功能，並引入富文本編輯器和 `Context API` 進行狀態管理。