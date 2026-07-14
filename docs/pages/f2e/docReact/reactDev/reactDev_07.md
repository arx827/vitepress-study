---
title: '[React官網] React 19.2 教學文件'
outline: 2
---

# 狀態管理
  隨著您的應用程式不斷變大，更有意識地去關注應用程式狀態如何組織，以及資料如何在元件之間流動會對您很有幫助。冗餘或重複的狀態往往是缺陷的根源。在本節中，您將學習如何組織好狀態，如何保持狀態更新邏輯的可維護性，以及如何跨元件共享狀態。

  :::info 您將學到
  - [如何將 UI 變更視為狀態變更](/pages/f2e/docReact/reactDev/07/reactDev_07_01.html)
  - [如何組織好狀態](/pages/f2e/docReact/reactDev/07/reactDev_07_02.html)
  - [如何使用「狀態提升」在元件之間共享狀態](/pages/f2e/docReact/reactDev/07/reactDev_07_03.html)
  - [如何控制狀態的保留或重置](/pages/f2e/docReact/reactDev/07/reactDev_07_04.html)
  - [如何在函式中整合複雜的狀態邏輯](/pages/f2e/docReact/reactDev/07/reactDev_07_05.html)
  - [如何避免資料透過 prop 逐級透傳](/pages/f2e/docReact/reactDev/07/reactDev_07_06.html)
  - [如何隨著應用程式的增長去擴充狀態管理](/pages/f2e/docReact/reactDev/07/reactDev_07_07.html)
  :::

## 用 State 響應輸入
  - 使用 `React`，您不用直接從程式碼層面修改 `UI`。例如，不用編寫諸如「停用按鈕」、「啟用按鈕」、「顯示成功訊息」等命令。相反地，您只需要描述元件在不同狀態（「初始狀態」、「輸入狀態」、「成功狀態」）下希望展現的 UI，然後根據使用者輸入觸發狀態變更。這和設計師對 UI 的理解很相似。

  - 原文範例中，是一個使用 `React` 撰寫的回饋表單。請注意看它是如何使用 `status` 這個狀態變數來決定啟用或停用提交按鈕，以及是否顯示成功訊息的。核心邏輯如下：

    ```jsx
    import { useState } from 'react';

    export default function Form() {
      const [answer, setAnswer] = useState('');
      const [error, setError] = useState(null);
      const [status, setStatus] = useState('typing');

      if (status === 'success') {
        return <h1>答對了！</h1>
      }

      async function handleSubmit(e) {
        e.preventDefault();
        setStatus('submitting');
        try {
          await submitForm(answer);
          setStatus('success');
        } catch (err) {
          setStatus('typing');
          setError(err);
        }
      }

      function handleTextareaChange(e) {
        setAnswer(e.target.value);
      }

      return (
        <>
          <h2>城市測驗</h2>
          <p>
            哪個城市有把空氣變成飲用水的廣告牌？
          </p>
          <form onSubmit={handleSubmit}>
            <textarea
              value={answer}
              onChange={handleTextareaChange}
              disabled={status === 'submitting'}
            />
            <br />
            <button disabled={
              answer.length === 0 ||
              status === 'submitting'
            }>
              提交
            </button>
            {error !== null &&
              <p className="Error">
                {error.message}
              </p>
            }
          </form>
        </>
      );
    }

    function submitForm(answer) {
      // 模擬接口請求
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let shouldError = answer.toLowerCase() !== 'lima'
          if (shouldError) {
            reject(new Error('猜的不錯，但答案不對。再試試看吧！'));
          } else {
            resolve();
          }
        }, 1500);
      });
    }

    ```

## 選擇 State 結構
  - 良好的狀態組織，可以區隔開易於修改和除錯的元件與頻繁出問題的元件。最重要的原則是，狀態不應包含冗餘或重複的資訊。
  如果包含一些多餘的狀態，我們會很容易忘記去更新它，從而導致問題產生！

  - 例如，原本的表單有一個多餘的 `fullName` 狀態變數，在 `firstName` 和 `lastName` 改變時都需要手動去更新它。
    ```jsx
    import { useState } from 'react';

    export default function Form() {
      const [firstName, setFirstName] = useState('');
      const [lastName, setLastName] = useState('');
      const [fullName, setFullName] = useState('');

      function handleFirstNameChange(e) {
        setFirstName(e.target.value);
        setFullName(e.target.value + ' ' + lastName);
      }

      function handleLastNameChange(e) {
        setLastName(e.target.value);
        setFullName(firstName + ' ' + e.target.value);
      }

      return (
        <>
          <h2>讓我們幫你登記</h2>
          <label>
            名：{' '}
            <input
              value={firstName}
              onChange={handleFirstNameChange}
            />
          </label>
          <label>
            姓：{' '}
            <input
              value={lastName}
              onChange={handleLastNameChange}
            />
          </label>
          <p>
            你的票據將簽發给：<b>{fullName}</b>
          </p>
        </>
      );
    }
    ```
  
  - 您可以移除它並在元件渲染（render）時透過計算 `fullName` 來簡化程式碼：
    ```jsx
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    // 在渲染期間計算
    const fullName = firstName + ' ' + lastName;
    ```

  - 這看起來似乎只是一個小改動，但卻可以避免很多潛在的同步錯誤（bug）。

## 在組件間共享狀態
  - 有時候您希望兩個組件的狀態始終同步變更。要實現這一點，可以將相關狀態從這兩個組件上移除，並把這些狀態移到最近的父級組件，然後透過 `props` 將狀態傳遞給這兩個組件。
  這被稱為 `「狀態提升（lifting state up）」`，這是撰寫 `React` 程式碼時常做的事。

  - 在原文的手風琴（Accordion）範例中，要求每次只能啟用一個面板。要實現這一點，父組件將管理主導的 `activeIndex` 狀態，並為其子組件指定 `isActive` `prop`，而不是將啟用狀態保留在各自的子組件中。
    ```jsx
    export default function Accordion() {
      const [activeIndex, setActiveIndex] = useState(0);
      return (
        <>
          <Panel
            title="關於"
            isActive={activeIndex === 0}
            onShow={() => setActiveIndex(0)}
          >
            ...
          </Panel>
          <Panel
            title="詞源"
            isActive={activeIndex === 1}
            onShow={() => setActiveIndex(1)}
          >
            ...
          </Panel>
        </>
      );
    }
    ```

## 對 State 進行保留和重置
  - 當您重新渲染一個元件時，`React` 需要決定元件樹中的哪些部分要保留和更新，以及丟棄或重新建立。在大多數情況下，`React` 的自動處理機制已經做得足夠好了。預設情況下，`React` 會保留樹中與先前渲染的元件樹「匹配」的部分。

  - 然而，有時這並不是您想要的。例如，在原本的通訊軟體範例中，於聊天輸入框輸入內容後，直接切換收件人，並不會清空輸入框。這可能會導致使用者不小心發錯訊息給不同的聯絡人。

  - `React` 允許您覆蓋預設行為，可透過向元件傳遞一個唯一的 `key`（如 `<Chat key={to.email} contact={to} />`）來 強制 重置其狀態。這會告訴 `React`，如果收件人不同，應將其作為一個 不同的 `Chat` 元件，需要使用新資料和 UI（比如輸入框）來重新建立它。現在，在接收者之間切換時就會重置輸入框 —— 即使渲染的是同一個元件。

    ```jsx
    import { useState } from 'react';
    import Chat from './Chat.js';
    import ContactList from './ContactList.js';

    export default function Messenger() {
      const [to, setTo] = useState(contacts[0]);
      return (
        <div>
          <ContactList
            contacts={contacts}
            selectedContact={to}
            onSelect={contact => setTo(contact)}
          />
          <Chat key={to.email} contact={to} />
        </div>
      )
    }

    const contacts = [
      { name: 'Taylor', email: 'taylor@mail.com' },
      { name: 'Alice', email: 'alice@mail.com' },
      { name: 'Bob', email: 'bob@mail.com' }
    ];
    ```

## 遷移狀態邏輯至 Reducer 中
  - 對於那些需要更新多個狀態的元件來說，過於分散的事件處理常式可能會令人不知所措。對於這種情況，您可以在元件外部將所有狀態更新邏輯合併到一個稱為「`reducer`」的函式中。
  這樣，事件處理常式就會變得簡潔，因為它們只需要發送（dispatch）使用者的 `「actions」`。在檔案的底部，`reducer` 函式指定狀態應該如何更新以回應每個 `action`！

  - 核心邏輯如下：
    ```jsx
    // 元件內部只需 dispatch action
    function handleAddTask(text) {
      dispatch({
        type: 'added',
        id: nextId++,
        text: text,
      });
    }

    // 元件外部統一由 reducer 函式處理邏輯
    function tasksReducer(tasks, action) {
      switch (action.type) {
        case 'added': {
          return [...tasks, {
            id: action.id,
            text: action.text,
            done: false
          }];
        }
        // ... 其他 action 處理
      }
    }

## 使用 Context 深層傳遞參數
  - 通常，您會透過 `props` 將資訊從父元件傳遞給子元件。但是，如果要在元件樹中深入傳遞一些 `prop`，或者樹裡的許多元件需要使用相同的 `prop`，那麼傳遞 `prop` 可能會變得很麻煩。`Context` 允許父元件將一些資訊提供給它下層的任何元件，不管該元件多深層也無需透過 `props` 逐層透傳。

  - 在原文範例中，`Heading` 元件透過「詢問」最近的 `Section` 來確定其標題層級。每個 `Section` 都向它下層的所有元件提供層級資訊，不需要逐層傳遞 `props`，而是透過 `Context`（如 LevelContext）來實現。

    ```jsx
    // Section.js 中提供 Context 值
    <LevelContext value={level + 1}>
      {children}
    </LevelContext>

    // Heading.js 中直接讀取使用
    const level = useContext(LevelContext);
    ```

## 使用 Reducer 和 Context 擴充您的應用程式
  - `Reducer` 幫助您合併元件的狀態更新邏輯。`Context` 幫助您將資訊深入傳遞給其他元件。您可以將 `reducers` 和 `context` 組合在一起使用，以管理複雜應用程式的狀態。

  - 基於這種想法，使用 `reducer` 來管理一個具有複雜狀態的父元件。元件樹中任何深度的其他元件都可以透過 `context` 讀取其狀態。還可以 `dispatch` 一些 `action` 來更新狀態。

  - 原文範例中建立了一個 `TasksProvider`，包裹了狀態與 `dispatch` 的 `Context`，並提供自訂 `Hook` 如 `useTasks()` 與 `useTasksDispatch()` 供深層子元件直接調用。