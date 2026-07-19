---
title: 'React 從零到深入實作手把手教學：個人化任務與效能追蹤系統'
---

# 第六章：番茄鐘計時器與儀表板
  本章將引導您實作「個人化任務與效能追蹤系統」中的 `番茄鐘計時器功能`，並將其與任務、筆記數據整合到個人儀表板中。此外，我們還將引入數據視覺化，以圖表形式展示生產力趨勢，讓使用者對自己的工作效率有更直觀的了解。

## 6.1 番茄鐘計時器實作
  番茄鐘計時器是一種時間管理方法，通常設定 `25 分鐘`工作，`5 分鐘`休息。我們將實作一個可配置的番茄鐘，並追蹤完成的番茄鐘次數。

  ### 1. **計時器邏輯 (工作時間、休息時間、循環)**
  - 在 `src/components` 中建立 `PomodoroTimer.tsx` 文件。
    
  - `src/components/PomodoroTimer.tsx`：
    ```tsx
    import React, { useState, useEffect, useCallback } from 'react';
    import Button from '@/components/ui/Button';

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
        let interval: ReturnType<typeof setInterval> | null = null;

        if (isRunning && timeRemaining > 0) {
          interval = setInterval(() => {
            setTimeRemaining((prevTime) => prevTime - 1);
          }, 1000);
        } else if (isRunning && timeRemaining === 0) {
          // 時間到
          if (interval) clearInterval(interval);
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
          setIsRunning(true); // 如果需要自動開始下一個階段，取消註釋此行
        }
        return () => {
          if (interval) {
            clearInterval(interval);
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
    
  - 這個組件包含了番茄鐘的核心邏輯，包括計時、狀態切換 (工作/休息)、循環計數和時間格式化。它還提供了開始、暫停和重置按鈕。

## 6.2 個人儀表板 (Dashboard)
  儀表板是應用程式的中心，它將整合任務、筆記和番茄鐘的關鍵數據，為使用者提供一個全面的概覽。我們將修改 `DashboardPage.tsx` 來展示這些資訊。

  ### 1. **整合任務、筆記、番茄鐘數據**
  - 修改 `src/pages/DashboardPage.tsx`：
    ```tsx {1,3-11,14-41,46-111}
    import React, { useState, useEffect } from 'react';
    import PageHeader from '@/components/PageHeader';
    import Card from '@/components/ui/Card';
    import Button from '@/components/ui/Button';
    import PomodoroTimer from '../components/PomodoroTimer';
    import { useNotes } from '@/context/NotesContext';
    import type { Task } from '@/types/task';
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
    
  -   我們在儀表板上展示了近期任務、番茄鐘計時器和最近的筆記。番茄鐘完成次數會動態更新。

## 6.3 數據視覺化 (Data Visualization)
  數據視覺化是提升儀表板價值的關鍵。我們將使用 [Recharts](http://recharts.org/en-US/) 這個 `React` 圖表庫來繪製任務完成趨勢圖和番茄鐘使用分佈圖。`Recharts` 是一個基於 `D3.js` 的可組合圖表庫，非常適合 `React` 應用程式。

  ### 1. **安裝圖表庫 (例如 `Recharts`)**
  - 安裝 `Recharts`：
    ```bash
    npm install recharts
    # 或者
    yarn add recharts
    ```

  ### 2. **繪製任務完成趨勢圖**
  - 在 `src/components` 中建立 `TaskCompletionChart.tsx` 文件。
    
  - `src/components/TaskCompletionChart.tsx`：
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
    
  - 這個組件接收任務列表，並將其處理成每日完成任務數的數據，然後使用 `LineChart` 進行視覺化。

  ### 3. **繪製番茄鐘使用分佈圖 (Optional)**
  - 您可以類似地建立一個 `PomodoroUsageChart.tsx` 組件，使用 `BarChart` 或 `PieChart` 來展示番茄鐘的使用分佈，例如每天或每週的番茄鐘次數。

  ### 4. **將圖表整合到 `DashboardPage`**
  - 修改 `src/pages/DashboardPage.tsx`，引入 `TaskCompletionChart` 並將其添加到生產力統計部分：
    ```tsx {3,26}
    import React, { useState, useEffect } from 'react';
    // ... 其他引入
    import TaskCompletionChart from '../components/TaskCompletionChart'; // 引入圖表組件

    const API_BASE_URL = 'http://localhost:3001';

    const DashboardPage: React.FC = () => {
      
      // ... 以上保持不變
      return (
        <div>
          <PageHeader title="儀表板" description="概覽您的任務、筆記和生產力數據。" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* 保持不變 */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 近期筆記 */}
            <Card>
              {/* 保持不變 */}
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

  - 至此，我們已經成功實作了番茄鐘計時器，並將其與任務、筆記數據整合到個人儀表板中，同時引入了數據視覺化來展示任務完成趨勢。在下一章中，我們將探討使用者認證、全域狀態管理和錯誤處理等進階議題。