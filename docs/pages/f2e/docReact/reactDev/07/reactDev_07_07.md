---
title: '[React官網] React 19.2 教學文件'
---

# 使用 Reducer 和 Context 拓展你的應用
  `Reducer` 可以整合組件的狀態更新邏輯，`Context` 可以將資訊深入傳遞給其他組件，你可以組合使用它們來共同管理一個複雜頁面的狀態。

  :::info 你將會學到：
  - 如何結合使用 reducer 和 context
  - 如何避免透過 props 傳遞 state 和 dispatch
  - 如何將 context 和狀態邏輯保存在一個獨立的檔案中
  :::

## 結合使用 reducer 和 context
  - 在 `reducer` 介紹的範例中，狀態是由 `reducer` 所管理，`reducer` 函式包含了所有的狀態更新邏輯。

    ```jsx
    // ...
    function tasksReducer(tasks, action) {
      switch (action.type) {
        case 'added': {
          return [...tasks, {
            id: action.id,
            text: action.text,
            done: false
          }];
        }
        case 'changed': {
          return tasks.map(t => {
            if (t.id === action.task.id) {
              return action.task;
            } else {
              return t;
            }
          });
        }
        case 'deleted': {
          return tasks.filter(t => t.id !== action.id);
        }
        default: {
          throw Error('Unknown action: ' + action.type);
        }
      }
    }
    // ...
    ```

  - `Reducer` 有助於保持事件處理函式的簡短明瞭，但隨著應用程式規模越來越龐大，可能會遇到其他困難。目前，`tasks` 狀態與 `dispatch` 函式僅在頂層 `TaskApp` 組件中可用。要讓其他組件讀取任務清單或修改它，就必須明確地把目前的狀態與事件處理函式透過 `props` 傳遞下去。

  - 例如，`TaskApp` 把任務陣列與事件處理函式傳給 `TaskList`：
    ```jsx
    <TaskList
      tasks={tasks}
      onChangeTask={handleChangeTask}
      onDeleteTask={handleDeleteTask}
    />
    ```

  - `TaskList` 再把事件處理函式傳給 `Task`：
    ```jsx
    <Task
      task={task}
      onChange={onChangeTask}
      onDelete={onDeleteTask}
    />
    ```

  - 在這樣的小範例中沒什麼問題，但如果有成百上千個中間組件，逐一傳遞所有狀態與函式就會非常麻煩！

  - 這正是為什麼，與其透過 `props` 傳遞，不如把 `tasks` 狀態與 `dispatch` 函式都放入 `context` 中。這樣一來，`TaskApp` 組件樹下的所有組件，都不必一路向下傳遞 `props`，而可以直接讀取 `tasks` 與 `dispatch` 函式。

  - 下面將介紹如何結合使用 `Reducer` 和 `Context`：
    1. 建立 `context`。
    2. 把 `state` 與 `dispatch` 放入 `context`。
    3. 在組件樹的任何地方使用 `context`。

  - ### 第一步：建立 context
    - `useReducer` 會回傳目前的 `tasks` 與可用來更新它們的 `dispatch` 函式：
      ```jsx
      const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
      ```
    
    - 為了把它們向下傳遞到組件樹，需要建立兩個不同的 `context`：
      - `TasksContext`，提供目前的 `tasks` 清單。
      - `TasksDispatchContext`，提供一個可以讓組件派送 `action` 的函式。
    
    - 把它們從獨立的檔案匯出，以便日後能從其他檔案匯入：
      ```jsx
      // TasksContext.js
      import { createContext } from 'react';

      export const TasksContext = createContext(null);
      export const TasksDispatchContext = createContext(null);
      ```

    - 這裡把 `null` 作為兩個 `context` 的預設值，實際的值會由 `TaskApp` 組件提供。

  - ### 第二步：把 state 和 dispatch 函式放入 context
    - 現在，可以把所有的 `context` 匯入 `TaskApp` 組件，取得 `useReducer()` 回傳的 `tasks` 與 `dispatch`，並把它們提供給整個組件樹：

      ```jsx {5,8-9}
      // App.js
      import { TasksContext, TasksDispatchContext } from './TasksContext.js';

      export default function TaskApp() {
        const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
        // ...
        return (
          <TasksContext value={tasks}>
            <TasksDispatchContext value={dispatch}>
              ...
            </TasksDispatchContext>
          </TasksContext>
        );
      }
      ```

    - 此時，可以同時透過 `props` 和 `context` 傳遞資訊，下一步將移除透過 `props` 傳遞的程式碼。

  - ### 第三步：在組件樹中的任何地方使用 context
    - 現在不再需要把 `tasks` 與事件處理函式在組件樹中逐層傳遞：
      
      ```jsx {4-5}
      <TasksContext value={tasks}>
        <TasksDispatchContext value={dispatch}>
          <h1>Day off in Kyoto</h1>
          <AddTask />
          <TaskList />
        </TasksDispatchContext>
      </TasksContext>
      ```

    - 取而代之，任何需要 `tasks` 的組件都可以從 `TasksContext` 中讀取它：

      ```jsx {2}
      export default function TaskList() {
        const tasks = useContext(TasksContext);
        // ...
      ```

    - 任何組件也都可以從 `context` 中讀取 `dispatch` 函式並呼叫它，藉此更新任務清單：

      ```jsx {4,10-14}
      // AddTask.js
      export default function AddTask() {
        const [text, setText] = useState('');
        const dispatch = useContext(TasksDispatchContext);
        // ...
        return (
          // ...
          <button onClick={() => {
            setText('');
            dispatch({
              type: 'added',
              id: nextId++,
              text: text,
            });
          }}>Add</button>
          // ...
      ```

    - `TaskApp` 組件不會向下傳遞任何事件處理函式，`TaskList` 也不會，每個組件都會讀取自己需要的 `context`。

    - `state` 依然「存在於」頂層的 `TaskApp` 組件中，由 `useReducer` 進行管理，不過組件樹中的組件只要匯入這些 `context`，就能取得 `tasks` 與 `dispatch`。

      ```jsx
      // TaskList.js
      import { useState, useContext } from 'react';
      import { TasksContext, TasksDispatchContext } from './TasksContext.js';

      export default function TaskList() {
        const tasks = useContext(TasksContext);
        return (
          <ul>
            {tasks.map(task => (
              <li key={task.id}>
                <Task task={task} />
              </li>
            ))}
          </ul>
        );
      }

      function Task({ task }) {
        const [isEditing, setIsEditing] = useState(false);
        const dispatch = useContext(TasksDispatchContext);
        let taskContent;
        if (isEditing) {
          taskContent = (
            <>
              <input
                value={task.text}
                onChange={e => {
                  dispatch({
                    type: 'changed',
                    task: {
                      ...task,
                      text: e.target.value
                    }
                  });
                }} />
              <button onClick={() => setIsEditing(false)}>
                Save
              </button>
            </>
          );
        } else {
          taskContent = (
            <>
              {task.text}
              <button onClick={() => setIsEditing(true)}>
                Edit
              </button>
            </>
          );
        }
        return (
          <label>
            <input
              type="checkbox"
              checked={task.done}
              onChange={e => {
                dispatch({
                  type: 'changed',
                  task: {
                    ...task,
                    done: e.target.checked
                  }
                });
              }}
            />
            {taskContent}
            <button onClick={() => {
              dispatch({
                type: 'deleted',
                id: task.id
              });
            }}>
              Delete
            </button>
          </label>
        );
      }
      ```

## 將相關邏輯遷移到一個檔案當中
  - 這並非必要，但可以透過把 `reducer` 與 `context` 移動到單一檔案中，來進一步整理組件。目前，`TasksContext.js` 只包含兩個 `context` 宣告：

    ```jsx
    import { createContext } from 'react';

    export const TasksContext = createContext(null);
    export const TasksDispatchContext = createContext(null);
    ```

  - 可以為這個檔案加入更多程式碼！把 `reducer` 移到此檔案中，並宣告一個新的 `TasksProvider` 組件，把所有部分連接在一起：
    1. 它會管理 `reducer` 的狀態。
    2. 它會把 `context` 提供給整個組件樹。
    3. 它會把 `children` 當作 `prop`，因此可以傳入 `JSX`。

    ```jsx
    export function TasksProvider({ children }) {
      const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

      return (
        <TasksContext value={tasks}>
          <TasksDispatchContext value={dispatch}>
            {children}
          </TasksDispatchContext>
        </TasksContext>
      );
    }
    ```

  - 這會讓 `TaskApp` 組件變得更加直觀：

    ```jsx
    export default function TaskApp() {
      return (
        <TasksProvider>
          <h1>Day off in Kyoto</h1>
          <AddTask />
          <TaskList />
        </TasksProvider>
      );
    }
    ```

  - 也可以從 `TasksContext.js` 匯出使用 `context` 的函式：
    ```jsx
    export function useTasks() {
      return useContext(TasksContext);
    }

    export function useTasksDispatch() {
      return useContext(TasksDispatchContext);
    }
    ```

  - 組件便可以透過以下方式讀取 `context`：
    ```jsx
    const tasks = useTasks();
    const dispatch = useTasksDispatch();
    ```

  - 這不會改變任何行為，但能讓你之後進一步拆分這些 `context`，或為這些函式加入一些邏輯。現在所有 `context` 與 `reducer` 的連接部分都集中在 `TasksContext.js` 中，這能保持組件的乾淨整潔，讓你專注於它們要顯示的內容，而不是它們的資料從何而來：

  - 可以把 `TasksProvider` 視為頁面中「知道如何處理 `tasks`」的一部分：`useTasks` 用來讀取它們，`useTasksDispatch` 用來從組件樹下的任何組件更新它們。


  :::info 注意
  - 像 `useTasks` 和 `useTasksDispatch` 這樣的函式，稱為自訂 `Hook`。如果函式名稱以 `use` 開頭，就會被視為一個自訂 `Hook`，這讓你可以在其中使用其他 `Hook`，例如 `useContext`。
  
  - 隨著應用程式規模成長，可能會有許多類似這樣的 `context` 與 `reducer` 組合。這是一種強大的方式，能拓展應用程式並進行狀態提升，讓你在組件樹深處存取資料時，不需要耗費太多工夫。
  :::

## 重點複習（Recap）
  - 可以把 `reducer` 與 `context` 結合，讓任何組件都能讀取與更新其狀態。
  - 為子組件提供 `state` 與 `dispatch` 函式的步驟：
    1. 建立兩個 `context`（一個用於 `state`，一個用於 `dispatch` 函式）。
    2. 讓組件的 `context` 使用 `reducer`。
    3. 在需要讀取的組件中使用該 `context`。
  - 可以透過把所有傳遞資訊的程式碼移到單一檔案中，來進一步整理組件：
    - 可以匯出一個像 `TasksProvider` 這樣能提供 `context` 的組件。
    - 也可以匯出像 `useTasks` 和 `useTasksDispatch` 這樣的自訂 Hook。
  - 可以在應用程式中大量使用 `context` 與 `reducer` 的組合。