---
title: '[React官網] React 19.2 教程'
---

# 遷移狀態邏輯至 Reducer 中
  對於擁有許多狀態更新邏輯的組件來說，過於分散的事件處理函式可能會令人難以掌握。針對這種情況，你可以把組件的所有狀態更新邏輯整合到一個外部函式中，這個函式稱為 `reducer`。

  :::info 你將會學到
  - 什麼是 `reducer` 函式
  - 如何將 `useState` 重構成 `useReducer`
  - 什麼時候該使用 `reducer`
  - 如何撰寫一個好的 `reducer`
  :::

## 使用 reducer 整合狀態邏輯
  - 隨著組件複雜度的增加，會越來越難一眼看清所有的組件狀態更新邏輯。範例中的 `TaskApp` 組件擁有一個陣列型別的狀態 `tasks`，並透過三個不同的事件處理函式來實現任務的新增、刪除與修改。

    ```jsx
    import { useState } from 'react';
    import AddTask from './AddTask.js';
    import TaskList from './TaskList.js';

    export default function TaskApp() {
      const [tasks, setTasks] = useState(initialTasks);

      function handleAddTask(text) {
        setTasks([
          ...tasks,
          {
            id: nextId++,
            text: text,
            done: false,
          },
        ]);
      }

      function handleChangeTask(task) {
        setTasks(
          tasks.map((t) => {
            if (t.id === task.id) {
              return task;
            } else {
              return t;
            }
          })
        );
      }

      function handleDeleteTask(taskId) {
        setTasks(tasks.filter((t) => t.id !== taskId));
      }

      return (
        <>
          <h1>布拉格的行程安排</h1>
          <AddTask onAddTask={handleAddTask} />
          <TaskList
            tasks={tasks}
            onChangeTask={handleChangeTask}
            onDeleteTask={handleDeleteTask}
          />
        </>
      );
    }

    let nextId = 3;
    const initialTasks = [
      {id: 0, text: '參觀卡夫卡博物館', done: true},
      {id: 1, text: '看木偶戲', done: false},
      {id: 2, text: '打卡藍儂牆', done: false},
    ];

    ```

  - 這個組件的每個事件處理函式，都是透過 `setTasks` 來更新狀態。隨著組件不斷迭代，狀態邏輯也會越來越多。為了降低這種複雜度，讓所有邏輯都能集中放在一個容易理解的地方，可以把這些狀態邏輯移到組件之外一個稱為 `reducer` 的函式中。

  - `Reducer` 是處理狀態的另一種方式。你可以透過三個步驟，把 `useState` 遷移到 `useReducer`：
    - 把設定狀態的邏輯修改成 `dispatch` 一個 `action`。
    - 撰寫一個 `reducer` 函式。
    - 在組件中使用 `reducer`。

  - ### 第 1 步：把設定狀態的邏輯修改成 dispatch 一個 action
    - 原本的事件處理函式，是透過設定狀態來實作邏輯的（例如 `handleAddTask`、`handleChangeTask`、`handleDeleteTask` 各自呼叫 `setTasks`）。
      
      ```jsx
      // 舊寫法：直接操作設定狀態
      function handleAddTask(text) {
        setTasks([...tasks, { id: nextId++, text: text, done: false }]);
      }
      ```

    - 移除所有的狀態設定邏輯，只留下三個事件處理函式：
      - `handleAddTask(text)` 在使用者點擊「新增」時被呼叫。
      - `handleChangeTask(task)` 在使用者切換任務或點擊「儲存」時被呼叫。
      - `handleDeleteTask(taskId)` 在使用者點擊「刪除」時被呼叫。

    - 使用 `reducer` 管理狀態，與直接設定狀態略有不同。它不是透過設定狀態告訴` React`「要做什麼」，而是透過事件處理函式 `dispatch` 一個 `「action」`，來指出「使用者剛剛做了什麼」（狀態更新邏輯則保存在其他地方）。因此，不再透過事件處理函式直接「設定 task」，而是 `dispatch` 一個「新增／修改／刪除任務」的 `action`，這樣更符合使用者的思維方式。

      ```jsx
      // 新寫法：派發使用者行為（Action）
      function handleAddTask(text) {
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        });
      }

      function handleChangeTask(task) {
        dispatch({
          type: 'changed',
          task: task,
        });
      }

      function handleDeleteTask(taskId) {
        dispatch({
          type: 'deleted',
          id: taskId,
        });
      }
      ```

    - 傳遞給 `dispatch` 的物件稱為 `「action」`。它是一個普通的 `JavaScript` 物件，其結構由你自行決定，但通常至少應包含能表明發生了什麼事的資訊。

      ```jsx {3-7}
      function handleDeleteTask(taskId) {
        dispatch(
          // "action" 對象：
          {
            type: 'deleted',
            id: taskId,
          }
        );
      }
      ```

    :::info 注意
    `action` 物件可以有多種結構。按照慣例，通常會加入一個字串型別的 `type` 欄位來描述發生的事情，並透過其他欄位傳遞額外資訊。`type` 是特定於組件的，選一個能清楚描述所發生事件的名稱即可。（例如 `added` 或 `added_task`）
    
    ```jsx
    dispatch({
      // 針對特定的組件
      type: 'what_happened',
      // 其他字段放這裡
    });
    ```
    :::

  - ### 第 2 步：撰寫一個 reducer 函式
    - `reducer` 函式就是放置狀態邏輯的地方。它接受兩個參數：目前的 `state` 與 `action` 物件，並回傳更新後的 `state`：

      ```jsx
      function yourReducer(state, action) {
        // 回傳更新後的狀態給 React
      }
      ```

    - `React` 會把狀態設定為你從 `reducer` 回傳的狀態。

    - 範例中，要把狀態設定邏輯從事件處理函式移到 `reducer` 函式中，需要：
      - 宣告目前狀態（`tasks`）作為第一個參數；
      - 宣告 `action` 物件作為第二個參數；
      - 從 `reducer` 回傳下一個狀態（React 會把舊的狀態設為這個最新狀態）。

      ```jsx
      function tasksReducer(tasks, action) {
        if (action.type === 'added') {
          return [
            ...tasks,
            {
              id: action.id,
              text: action.text,
              done: false,
            },
          ];
        } else if (action.type === 'changed') {
          return tasks.map((t) => {
            if (t.id === action.task.id) {
              return action.task;
            } else {
              return t;
            }
          });
        } else if (action.type === 'deleted') {
          return tasks.filter((t) => t.id !== action.id);
        } else {
          throw Error('未知 action: ' + action.type);
        }
      }
      ```

    - 由於 `reducer` 函式接受 `state（tasks）` 作為參數，因此可以在組件之外宣告它，這能減少程式碼的縮排層級，提升可讀性。

    :::info 注意
    - 上面的程式碼使用了 `if/else` 語句，但在 `reducer` 中使用 `switch` 語句是一種慣例，兩種寫法結果相同，但 `switch` 語句讀起來更一目了然：

      ```jsx
      export default function tasksReducer(tasks, action) {
        switch (action.type) {
          case 'added': {
            return [
              ...tasks,
              {
                id: action.id,
                text: action.text,
                done: false,
              },
            ];
          }
          case 'changed': {
            return tasks.map((t) => {
              if (t.id === action.task.id) {
                return action.task;
              } else {
                return t;
              }
            });
          }
          case 'deleted': {
            return tasks.filter((t) => t.id !== action.id);
          }
          default: {
            throw Error('未知 action: ' + action.type);
          }
        }
      }
      ```

    - 建議把每個 `case` 區塊包在 `{` 與 `}` 大括號中，這樣不同 `case` 中宣告的變數就不會互相衝突。此外，`case` 通常應該以 `return` 結尾 —— 如果忘了 r`eturn`，程式碼就會「掉入」下一個 `case`，進而導致錯誤！如果你還不熟悉 `switch` 語句，使用 `if/else` 也沒問題。
    :::

    :::info 深入探討：為什麼稱之為 reducer？
    - 儘管 `reducer` 可以「減少」組件內的程式碼量，但它實際上是以陣列的 `reduce()` 方法命名的。`reduce()` 能讓你把陣列中的多個值「累加」成一個值，你傳給 `reduce` 的函式就稱為 `「reducer」`，它接受「目前的結果」和「目前的值」，然後回傳「下一個結果」。
    - `React` 中的 `reducer` 原理相同：都是接受 `「目前的狀態」` 和 `「action」`，然後回傳 `「下一個狀態」`，讓 `action` 隨著時間推移逐漸累積到狀態中。你甚至可以用 `reduce()` 方法搭配 `initialState` 與 `actions` 陣列，傳入你的 `reducer` 函式來計算最終狀態 —— 雖然你通常不需要自己這麼做，但這與 `React` 內部的運作方式非常相似。
    :::

  - ### 第 3 步：在組件中使用 reducer
    - 最後，需要把 `tasksReducer` 匯入到組件中。先從 `React` 匯入 `useReducer`：
      ```jsx
      import { useReducer } from 'react';
      ```

    - 接著把原本的：
      ```jsx
      const [tasks, setTasks] = useState(initialTasks);
      ```

      替換成：
      ```jsx
      const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
      ```

    - `useReducer` 與 `useState` 很相似——都必須傳入一個初始狀態，並回傳一個有狀態的值與一個設定該狀態的函式（在此例中就是 `dispatch` 函式）。但兩者之間仍有些差異。

    - `useReducer` 這個 Hook 接受兩個參數：
      - 一個 `reducer` 函式
      - 一個初始 `state`

    - 它會回傳：
      - 一個有狀態的值（tasks）
      - 一個 `dispatch` 函式（用來把使用者操作「派送」給 `reducer`）

    - 如果需要，甚至可以把 `reducer` 移到獨立的檔案中。這樣分離關注點之後，能更容易理解組件邏輯：事件處理函式只透過派送 `action` 來指定發生了什麼事，而 `reducer` 函式則透過回應 `action` 來決定狀態該如何更新。

## 對比 useState 和 useReducer
  - `Reducer` 並非沒有缺點！以下是幾種比較方式：

    | 比較維度   | `useState`                                            | `useReducer`                                                                                       |
    |------------|------------------------------------------------------|---------------------------------------------------------------------------------------------------|
    | 程式碼量   | 一開始只需要撰寫少量程式碼，非常輕量。                       | 必須提前撰寫 `reducer` 函數和 `action` 結構，初期成本較高。但當多個事件處理常式邏輯相似時，能大幅減少重複代碼。   |
    | 可讀性     | 狀態簡單時可讀性極佳；一旦邏輯複雜，組件會變得臃腫。          | 將狀態更新邏輯與事件處理常式徹底拆開，組件本身變得非常乾淨、好讀。                                              |
    | 可偵錯性   | 遇到 `Bug` 時，很難追溯是哪一個 `handler` 觸發了錯誤的設定。 | 可以在 `reducer` 中設定 `console.log` 來觀察每個被觸發的 `action` 以及狀態演變軌跡，偵錯脈絡非常清晰。          |
    | 可測試性   | 狀態與組件生命週期綁定，較難單獨進行單元測試。               | `Reducer` 是一個不依賴組件的純函數（Pure Function），可以非常輕易地針對特定初始狀態與 `action` 進行獨立單元測試。 |

  - 如果你在修改某些組件狀態時經常出錯，或想為組件加入更多邏輯，建議採用 `reducer`。當然，你也不必整個專案都使用 `reducer`，這是可以自由搭配的，甚至可以在同一個組件中同時使用 `useState` 和 `useReducer`。

## 撰寫一個好的 reducer
  撰寫 `reducer` 時，最好牢記以下兩點：
  - `reducer` 必須是純函數（Pure Functions）。 這一點與狀態更新函數（Updater Functions）類似，`reducer` 是在渲染時執行的（`action` 會被排入佇列，直到下一次渲染）。這代表 `reducer` 必須是純函式：輸入相同時，輸出也應相同。它們不應該包含`非同步請求`、`計時器`，或任何具有副作用（會影響組件外部）的操作，而應該以 `不可變` 的方式去更新物件和陣列，透過展開運算子 `...` 或是 `map` / `filter` 回傳全新的物件或陣列）。

  - 每個 `action` 都應描述一個單一的使用者互動，即使它會引發多筆資料變化。 舉例來說，如果使用者在一個由 `reducer` 管理、包含五個表單項目的表單中點擊 `「重置按鈕」`，那麼 `dispatch` 一個 `reset_form` 的 `action`，會比 `dispatch` 五個各自的 `set_field action` 更合理。如果你在 `reducer` 中把所有 `action` 都印出日誌，這份日誌應該要能清楚呈現，讓你可以依照步驟重現已發生的互動或回應——這對除錯非常有幫助！


## 使用 Immer 簡化 reducer
  - 就像在一般 `state` 中修改物件與陣列一樣，你也可以使用 `Immer` 這個函式庫來簡化 `reducer`。`useImmerReducer` 讓你可以透過 `push` 或 `draft[index] = ...` 這樣的方式來修改 `state`。

    ```jsx {1,6,10-14,19-20,25,35}
    import { useImmerReducer } from 'use-immer';
    import AddTask from './AddTask.js';
    import TaskList from './TaskList.js';

    // 💡 傳統的 state 變成了 draft（草稿物件）
    function tasksReducer(draft, action) {
      switch (action.type) {
        case 'added': {
          // ✅ 可以直接 push，不需手動解構 [...tasks]
          draft.push({
            id: action.id,
            text: action.text,
            done: false,
          });
          break; // 💡 使用 Immer 更改 draft 時，記得用 break 結束 case，不用 return
        }
        case 'changed': {
          // ✅ 可以直接透過索引定位並指派新值
          const index = draft.findIndex((t) => t.id === action.task.id);
          draft[index] = action.task;
          break;
        }
        case 'deleted': {
          // 💡 針對不方便直接突變的操作（如 filter），你依然可以「return」一個全新的陣列
          return draft.filter((t) => t.id !== action.id);
        }
        default: {
          throw Error('未知 action：' + action.type);
        }
      }
    }

    export default function TaskApp() {
      // 💡 將 useReducer 替換為 useImmerReducer
      const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);

      // handleAddTask, handleChangeTask, handleDeleteTask 等事件調度邏輯完全不需變動...
    }
    ```
  
  - `Reducer` 應該是純粹的，因此不應該去修改 `state`；而 `Immer` 提供了一種特殊的 `draft（草稿）` 物件，讓你可以安全地修改 `state`。在底層，`Immer` 會基於目前的 `state` 建立一份副本，這也是為什麼透過 `useImmerReducer` 管理 `reducer` 時，可以直接修改第一個參數，而不需要回傳一個新的 `state`。

## 重點複習（Recap）
  - 把 `useState` 轉換為 `useReducer`：
    - `派發行為`：透過事件處理函式 `dispatch` `action`；
    - `撰寫邏輯`：撰寫一個 `reducer` 函式，接受傳入的 `state` 與 `action`，並回傳新的 `state`；
    - `更換 Hook`：使用 `useReducer` 取代 `useState`；
  - `Reducer` 可能需要你寫更多程式碼，但有利於程式碼的除錯與測試。
  - `Reducer` 必須是純粹的。
  - 每個 `action` 都應描述一個單一的使用者互動。
  - 使用 `Immer` 可以幫助你在 `reducer` 中直接修改狀態。

## 挑戰（Challenges）
  - #### 1. 透過事件處理函式 dispatch actions
    - ##### 題目描述
      - 目前 `ContactList.js` 和 `Chat.js` 中的事件處理程序包含 `// TODO` 註解。這就是輸入框不起作用、點擊左側聯絡人按鈕也不會改變收件人的原因。

      - 需要把這兩個 `// TODO` 替換成 `dispatch` 對應的 `action`。若要查看 `action` 的結構與類型，可以參考 `messengerReducer.js` 中的 `reducer——reducer` 已經寫好，不需要修改；只需要在 `ContactList.js` 與 `Chat.js` 中 `dispatch` 對應的 `action` 即可。

    - ##### 提示
      `dispatch` 函式在這兩個組件中都可以使用，因為它已經以 `prop` 的形式傳遞進來了，因此需要透過傳入對應的 `action` 物件來呼叫 `dispatch` 函式。若要確認 `action` 物件應有的結構，可以查看 `reducer` 中需要哪些欄位。例如 `reducer` 中的 `changed_selection`：

        ```jsx
        case 'changed_selection': {
          return {
            ...state,
            selectedId: action.contactId
          };
        }
        ```

    - ##### 原始程式碼
      ```jsx
      // App.js
      import { useReducer } from 'react';
      import Chat from './Chat.js';
      import ContactList from './ContactList.js';
      import { initialState, messengerReducer } from './messengerReducer';

      export default function Messenger() {
        const [state, dispatch] = useReducer(messengerReducer, initialState);
        const message = state.message;
        const contact = contacts.find((c) => c.id === state.selectedId);
        return (
          <div>
            <ContactList
              contacts={contacts}
              selectedId={state.selectedId}
              dispatch={dispatch}
            />
            <Chat
              key={contact.id}
              message={message}
              contact={contact}
              dispatch={dispatch}
            />
          </div>
        );
      }

      const contacts = [
        {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
        {id: 1, name: 'Alice', email: 'alice@mail.com'},
        {id: 2, name: 'Bob', email: 'bob@mail.com'},
      ];
      ```

      ```jsx
      // messengerReducer.js
      export const initialState = {
        selectedId: 0,
        message: '你好',
      };

      export function messengerReducer(state, action) {
        switch (action.type) {
          case 'changed_selection': {
            return {
              ...state,
              selectedId: action.contactId,
              message: '',
            };
          }
          case 'edited_message': {
            return {
              ...state,
              message: action.message,
            };
          }
          default: {
            throw Error('未知 action：' + action.type);
          }
        }
      }
      ```

      ```jsx
      // ContactList.js
      export default function ContactList({contacts, selectedId, dispatch}) {
        return (
          <section className="contact-list">
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <button
                    onClick={() => {
                      // TODO: 派發 changed_selection
                    }}>
                    {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      }
      ```

      ```jsx
      // Chat.js
      import { useState } from 'react';

      export default function Chat({contact, message, dispatch}) {
        return (
          <section className="chat">
            <textarea
              value={message}
              placeholder={'和 ' + contact.name + ' 聊天'}
              onChange={(e) => {
                // TODO: 派發 edited_message
                // (從 e.target.value 獲取輸入框的值)
              }}
            />
            <br />
            <button>發送到 {contact.email}</button>
          </section>
        );
      }
      ```

    - ##### 解答
      - 從 `reducer` 函式的程式碼可以推斷出 `action` 應該長這樣：
        ```jsx
        // 當使用者點擊 "Alice"
        dispatch({
          type: 'changed_selection',
          contactId: 1,
        });

        // 當使用者輸入 "你好！"
        dispatch({
          type: 'edited_message',
          message: '你好！',
        });
        ```

      - `ContactList.js` 中的按鈕點擊事件：
        ```jsx
        onClick={() => {
          dispatch({
            type: 'changed_selection',
            contactId: contact.id,
          });
        }}
        ```

      - `Chat.js` 中的輸入框變更事件：
        ```jsx
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
        ```

  - #### 2. 發送訊息時清空輸入框
    - ##### 題目描述
      - 目前，點擊「發送」沒有任何反應。需要為「發送」按鈕加入一個事件處理函式，讓它：
        - 顯示一個包含收件人電子郵件與訊息內容的 `alert` 視窗。
        - 成功發送後清空輸入框。

    - ##### 原始程式碼
      ```jsx
      // messengerReducer.js
      import { useState } from 'react';

      export default function Chat({contact, message, dispatch}) {
        return (
          <section className="chat">
            <textarea
              value={message}
              placeholder={'和 ' + contact.name + ' 聊天'}
              onChange={(e) => {
                dispatch({
                  type: 'edited_message',
                  message: e.target.value,
                });
              }}
            />
            <br />
            <button>发送到 {contact.email}</button>
          </section>
        );
      }
      ```

      ```jsx
      // Chat.js
      import { useState } from 'react';

      export default function Chat({contact, message, dispatch}) {
        return (
          <section className="chat">
            <textarea
              value={message}
              placeholder={'和 ' + contact.name + ' 聊天'}
              onChange={(e) => {
                dispatch({
                  type: 'edited_message',
                  message: e.target.value,
                });
              }}
            />
            <br />
            <button>发送到 {contact.email}</button>
          </section>
        );
      }
      ```

    - ##### 解答
      - 一種做法是顯示 `alert`，然後 `dispatch` 一個名為 `edited_message`、內容為空字串的 `action`：

        ```jsx
        // Chat.js
        onClick={() => {
          alert(`正在傳送 "${message}" 到 ${contact.email}`);
          dispatch({
            type: 'edited_message',
            message: '',
          });
        }}
        ```

        這樣點擊「發送」按鈕時就會清空輸入框。

      - 然而，從使用者的角度來看，`「發送訊息」` 與 `「編輯欄位」`是不同的操作。為了體現這一點，可以新增一個名為 `sent_message` 的 `action`，並在 `reducer` 中單獨處理：

        ```jsx
        // messengerReducer.js
        case 'sent_message': {
          return {
            ...state,
            message: '',
          };
        }
        ```

        - 按鈕事件則改為：
          ```jsx
          // Chat.js
          onClick={() => {
            alert(`正在傳送 "${message}" 到 ${contact.email}`);
            dispatch({
              type: 'sent_message',
            });
          }}
          ```

      - 結果雖然相同，但請記住：`action` 的類型應該準確描述 `「使用者做了什麼」`，而不是「你希望狀態如何改變」，這樣未來加入更多功能時會更容易。

      - 無論採用哪一種解法，最重要的是 `不要把` `alert` 放在 `reducer` 裡面。`reducer` 必須是純函式 —— 它只應該計算下一個狀態，不應該「做」其他事情，包括向使用者顯示訊息，這類副作用應該放在事件處理函式中處理。（為了方便抓出這類錯誤，`React` 在嚴格模式下會多次呼叫 `reducer`；這也是為什麼若在 `reducer` 中放入 `alert`，它會觸發兩次的原因。）

  - #### 3. 切換 Tab 時，獨立記住各聯絡人的輸入內容
    - ##### 題目描述
      原本的狀態組織在切換聯絡人時會直接洗掉草稿（`message: ''`）。我們希望應用程式能單獨 `「記住」` 每個聯絡人的消息草稿，並在切換時自動恢復。

    - ##### 提示
      - 可以把 `state` 組織成這樣：
        ```jsx
        export const initialState = {
          selectedId: 0,
          messages: {
            0: 'Hello, Taylor', // contactId = 0 的草稿
            1: 'Hello, Alice', // contactId = 1 的草稿
          }
        };
        ```

      - 利用 `[key]: value` 這種計算屬性語法，可以幫助更新 `messages` 物件：
        ```jsx
        {
          ...state.messages,
          [id]: message
        }
        ```

    - ##### 原始程式碼
      ```jsx
      // App.js
      import { useReducer } from 'react';
      import Chat from './Chat.js';
      import ContactList from './ContactList.js';
      import { initialState, messengerReducer } from './messengerReducer';

      export default function Messenger() {
        const [state, dispatch] = useReducer(messengerReducer, initialState);
        const message = state.message;
        const contact = contacts.find((c) => c.id === state.selectedId);
        return (
          <div>
            <ContactList
              contacts={contacts}
              selectedId={state.selectedId}
              dispatch={dispatch}
            />
            <Chat
              key={contact.id}
              message={message}
              contact={contact}
              dispatch={dispatch}
            />
          </div>
        );
      }

      const contacts = [
        {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
        {id: 1, name: 'Alice', email: 'alice@mail.com'},
        {id: 2, name: 'Bob', email: 'bob@mail.com'},
      ];

      ```

      ```jsx
      // messengerReducer.js
      export const initialState = {
        selectedId: 0,
        message: '你好',
      };

      export function messengerReducer(state, action) {
        switch (action.type) {
          case 'changed_selection': {
            return {
              ...state,
              selectedId: action.contactId,
              message: '',
            };
          }
          case 'edited_message': {
            return {
              ...state,
              message: action.message,
            };
          }
          case 'sent_message': {
            return {
              ...state,
              message: '',
            };
          }
          default: {
            throw Error('未知 action：' + action.type);
          }
        }
      }
      ```

    - ##### 解答
      - 需要更新 `reducer`，讓它分別為每位聯絡人儲存並更新一份訊息草稿：
        ```jsx
        // messengerReducer.js
        // 當輸入框內容被修改時
        case 'edited_message': {
          return {
            // 保留其他狀態，例如目前選取的聯絡人
            ...state,
            messages: {
              // 保留其他聯絡人的訊息
              ...state.messages,
              // 改變目前聯絡人的訊息
              [state.selectedId]: action.message
            }
          };
        }
        ```

      - 同時也需要更新 `Messenger` 組件，讓它從目前選取的聯絡人讀取訊息：
        ```jsx
        // App.js
        const message = state.messages[state.selectedId];
        const contact = contacts.find((c) => c.id === state.selectedId);
        ```

      - 完整的 `reducer` 如下：
        ```jsx {4-8,19-27}
        // messengerReducer.js
        export const initialState = {
          selectedId: 0,
          messages: {
            0: 'Hello, Taylor',
            1: 'Hello, Alice',
            2: 'Hello, Bob',
          },
        };

        export function messengerReducer(state, action) {
          switch (action.type) {
            case 'changed_selection': {
              return {
                ...state,
                selectedId: action.contactId,
              };
            }
            case 'edited_message': {
              return {
                ...state,
                messages: {
                  ...state.messages,
                  [state.selectedId]: action.message,
                },
              };
            }
            case 'sent_message': {
              return {
                ...state,
                messages: {
                  ...state.messages,
                  [state.selectedId]: '',
                },
              };
            }
            default: {
              throw Error('未知 action：' + action.type);
            }
          }
        }
        ```
        
      - 如此一來，就不再需要為了實現不同行為而修改任何事件處理函式；若沒有使用 `reducer`，就必須在每個事件處理函式中各自更新狀態。

  - #### 4. 從零開始手寫實現 useReducer
    - ##### 題目描述
      為了徹底理解 `useReducer` 的底層本質，請不使用 `React` 內建的 `useReducer`，改用底層的 `useState` 在不到 10 行的代碼內封裝出你自己的 `useReducer` Hook。

    - ##### 提示
      基本實作大致如下：
      
      ```jsx
      export function useReducer(reducer, initialState) {
        const [state, setState] = useState(initialState);

        function dispatch(action) {
          // ???
        }

        return [state, dispatch];
      }
      ```

      回想一下，`reducer` 函式接受兩個參數——目前的 `state` 與 `action` 物件 —— 並回傳下一個 `state`。`dispatch` 應該利用這一點來做什麼？

    - ##### 原始程式碼
      ```jsx
      // MyReact.js
      import { useState } from 'react';

      export function useReducer(reducer, initialState) {
        const [state, setState] = useState(initialState);

        // ???

        return [state, dispatch];
      }
      ```

    - ##### 解答
      - `dispatch` 一個 `action`，就是去呼叫帶有目前 `state` 與該 `action` 的 `reducer`，並把結果儲存為下一個 `state`：

        ```jsx
        import { useState } from 'react';

        export function useReducer(reducer, initialState) {
          const [state, setState] = useState(initialState);

          function dispatch(action) {
            const nextState = reducer(state, action);
            setState(nextState);
          }

          return [state, dispatch];
        }
        ```

      - 雖然在大多數情況下影響不大，但更準確的實作方式應該是：
        ```jsx
        function dispatch(action) {
          setState((s) => reducer(s, action));
        }
        ```

      - 這是因為被 `dispatch` 的 `action` 在下一次渲染之前都會處於排隊等待的狀態，這與狀態更新函式的排隊機制類似。