---
title: '[React官網] React 19.2 教程'
---

# 對 State 進行保留和重置
  各個組件的 `state` 是各自獨立的。根據組件在 UI 樹中的位置，`React` 能夠追蹤哪些 `state` 屬於哪個組件。你可以控制在重新渲染過程中，何時該保留、何時該重置 `state`。

  :::info 你將會學到
  - `React` 何時選擇保留或重置狀態
  - 如何強制 `React` 重置組件的狀態
  - 鍵值（`key`）和類型如何影響狀態是否被保留
  :::

## 狀態與渲染樹中的位置相關
  - `React` 會為 `UI` 中的組件結構建立 [渲染樹（Render Tree）](/pages/f2e/docReact/reactDev/05/reactDev_05_09.html)。

  - 當你為一個組件加入狀態時，可能會以為狀態「存在」於組件內部。但實際上，狀態是由 `React` 保存的。`React` 會透過組件在渲染樹中的位置，把它保存的每個狀態與正確的組件關聯起來。

  - #### 獨立的位置，獨立的狀態
    在下面的範例中，雖然我們在 `JSX` 中只宣告了一個 `<Counter />` 標籤變數，但它被渲染在樹中的兩個不同位置：

    ```jsx
    import { useState } from 'react';

    export default function App() {
      const counter = <Counter />;
      return (
        <div>
          {counter} {/* 位置 1 */}
          {counter} {/* 位置 2 */}
        </div>
      );
    }

    function Counter() {
      const [score, setScore] = useState(0);
      const [hover, setHover] = useState(false);

      let className = 'counter';
      if (hover) className += ' hover';

      return (
        <div
          className={className}
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
        >
          <h1>{score}</h1>
          <button onClick={() => setScore(score + 1)}>加一</button>
        </div>
      );
    }
    ```

    ![reactDev_07_04_01](/pages/f2e/docReact/reactDev/imgs/07/reactDev_07_04_01.png)

    - 因此它們是兩個各自獨立的計數器：一般使用 `React` 時不需要特別考慮這些位置，但了解其運作原理會很有幫助。

    - 在 `React` 中，畫面上每個組件都擁有完全獨立的 `state`。舉例來說，當你並排渲染兩個 `Counter` 組件時，它們都會擁有各自獨立的 `score` 與 `hover state`，點擊其中一個並不會影響另一個。

    - 只要一個組件仍然被渲染在 UI 樹的相同位置，`React` 就會保留它的 `state`。 如果它被移除，或是有不同的組件被渲染在相同位置，那麼 `React` 就會丟棄它的 `state`。

    - 若把兩個計數器的值都遞增後，取消勾選「渲染第二個計數器」核取方塊、再重新勾選，會發現第二個計數器的 `state` 完全消失了 —— 這是因為 `React` 在移除一個組件時，也會一併銷毀它的 `state`。當你重新勾選核取方塊，另一個計數器及其 `state` 會從頭初始化（`score = 0`），並被重新加入 `DOM`。

    - 例如下面的條件渲染：
      ```jsx
      {showB && <Counter />}
      ```
      當 `showB` 變為 `false` 的那一刻，第二個計數器的位置從樹中消失了，它的內部狀態（`score`）也會被徹底銷毀。重新勾選回 `true` 時，狀態會重新從頭初始化（`score = 0`）。

## 相同位置的相同組件會使 state 被保留下來
  - `React` 在決定是否保留狀態時，看的是「位置」與「組件類型」。

    ```jsx
    export default function App() {
      const [isFancy, setIsFancy] = useState(false);
      return (
        <div>
          {isFancy ? (
            <Counter isFancy={true} />
          ) : (
            <Counter isFancy={false} />
          )}
          <label>
            <input type="checkbox" checked={isFancy} onChange={e => setIsFancy(e.target.checked)} />
            使用好看的樣式
          </label>
        </div>
      );
    }
    ```

    當你勾選或取消核取方塊時，計數器的 `score` 狀態並不會被重置。因為不論 `isFancy` 是 `true` 還是 `false`，根組件返回的 `div` 的第一個子組件永遠都是 `<Counter />`。它是位於相同位置的相同組件。

    :::info 陷阱
    對 `React` 來說，重要的是在 `「UI 樹中的位置」`，而不是在 `「JSX 中的位置」`！
    - 看看以下這段程式碼：

      ```jsx
      // 錯誤思維示範
      if (isFancy) {
        return (
          <div>
            <Counter isFancy={true} />
            {/* ... */}
          </div>
        );
      }
      return (
        <div>
          <Counter isFancy={false} />
          {/* ... */}
        </div>
      );
      ```

    - 你可能會以為這裡有兩個不同的 `return` 區塊，切換時狀態會重置。答案是：`不會！`

    - `React` 並不知道你程式碼裡的 `if` 邏輯是怎麼寫的，它只會 `「看」` 前後兩次渲染最終產生的樹狀結構。在這兩種情況下，`App` 返回的都是一個包裹著 `<Counter />` 作為第一個子組件的 `div`。它們擁有相同的「結構位址」，因此 `React` 認定它們是同一個計數器，進而保留了狀態。
    :::

## 相同位置的不同組件會使 state 重置
  - 如果你在相同的位置，將組件類型進行了切換（例如從 `<Counter>` 切換成 `<p>`），`React` 會將原本的組件從 `UI` 樹中移除，並銷毀其底下整棵子樹的所有狀態。
    ```jsx
    {isPaused ? (
      <p>待會見！</p>
    ) : (
      <Counter />
    )}
    ```

    當 `isPaused` 切換時，原本位置的 `Counter` 變成了 `p`，狀態瞬間被清空；切換回來時，`Counter` 的 `score` 會重新回到 `0`。

  - 同理，即使組件相同，但如果外層的包裝容器改變了，也會導致重置：
    ```jsx
    {isFancy ? (
      <div>
        <Counter />
      </div>
    ) : (
      <section>
        <Counter />
      </section>
    )}
    ```

    當外層從 `div` 變成 `section` 時，舊的子樹被整棵拔除，裡面的 `Counter` 狀態也會跟著消失。如果你想在重新渲染時保留 `state`，前後幾次渲染的樹形結構就必須相互匹配。

  :::info 絕對不要巢狀定義組件（Nested Component Definitions）
  以下是一個非常典型且嚴重的錯誤示範：

  ```jsx
  // 錯誤示範：千萬不要這樣寫！
  export default function MyComponent() {
    const [counter, setCounter] = useState(0);

    // 把組件定義在另一個組件內部
    function MyTextField() {
      const [text, setText] = useState('');
      return <input value={text} onChange={e => setText(e.target.value)} />;
    }

    return (
      <>
        <MyTextField />
        <button onClick={() => setCounter(counter + 1)}>點擊了 {counter} 次</button>
      </>
    );
  }
  ```

  - 為什麼這個輸入框在點擊按鈕後，輸入的文字會全部消失？
  
  - 因為每次父組件 `MyComponent` 重新渲染時，都會在內部重新宣告一個全新、不同參照的 `MyTextField` 函數組件。對於 `React` 來說，雖然位置看起來一樣，但每次渲染拿到的都是一個全新的組件類型，因此它會在每次點擊按鈕時，強行重置輸入框底下的所有狀態。

  - 正確做法：永遠將組件定義在 `最外層（Top-level）`，不要把組件定義嵌套起來。
  :::

## 在相同位置重置 state
  - 預設情況下，`React` 會在一個組件保持在同一個樹位置時保留它的 `state`。通常這符合開發預期，但有時候，你可能會想要強制重置一個組件的 `state`。

  - 例如一個計分板應用程式：
    ```jsx
    {isPlayerA ? (
      <Counter person="Taylor" />
    ) : (
      <Counter person="Sarah" />
    )}
    ```

  - 切換玩家時，因為 `<Counter />` 出現在完全相同的位置，`React` 會認定它是「同一個計數器」，導致 `Taylor` 的分數直接被 `Sarah` 繼承。但從概念上來說，這兩人的分數應該是獨立的。

  - 以下有兩個方法可以在組件切換時重置其內部狀態。
    - 將組件渲染在不同的位置
    - 使用 `key` 賦予每個組件一個明確的身分

  - ### 方法一：將組件渲染在不同的位置
    - 如果想讓兩個 `Counter` 各自獨立，你可以利用條件運算子，將它們刻意安置在樹的不同位置：

      ```jsx
      import { useState } from 'react';

      export default function Scoreboard() {
        const [isPlayerA, setIsPlayerA] = useState(true);
        return (
          <div>
            {/* 位置 1 */}
            {isPlayerA && <Counter person="Taylor" />}
            {/* 位置 2 */}
            {!isPlayerA && <Counter person="Sarah" />}
            
            <button onClick={() => setIsPlayerA(!isPlayerA)}>
              下一位玩家！
            </button>
          </div>
        );
      }

      function Counter({ person }) {
        const [score, setScore] = useState(0);
        return (
          <div className="counter">
            <h1>{person} 的分數：{score}</h1>
            <button onClick={() => setScore(score + 1)}>加一</button>
          </div>
        );
      }
      ```

    - 當 `isPlayerA` 為 `true` 時，第一個位置包含 `Counter`，第二個位置是空的。

    - 當點擊切換時，第一個位置被清空（舊狀態被銷毀），第二個位置重新初始化一個全新的 `Counter`。

    - 這個方法在只有少數幾個獨立組件需要切換時非常方便。

  - ### 方法二：使用 key 來重置 state
    - 還有另一種更通用、更優雅的重置方式，那就是使用 `key`。

    - 你可能在「渲染清單」時看過 `key`，但它不只用於陣列！你可以使用 `key` 來賦予任何組件一個明確的身份識別。 預設情況下，`React` 是靠父組件內部的「順序」來區分組件。但當你加上 `key` 時，你就等於告訴 `React`：「這不只是第一個或第二個組件，這是 Taylor 的組件！」這樣一來，不論它在 `JSX` 的哪個位置，`React` 都能精確識別。

      ```jsx
      import { useState } from 'react';

      export default function Scoreboard() {
        const [isPlayerA, setIsPlayerA] = useState(true);
        return (
          <div>
            {/* 雖然在同一個結構位置，但 key 不同，狀態會徹底重置 */}
            {isPlayerA ? (
              <Counter key="Taylor" person="Taylor" />
            ) : (
              <Counter key="Sarah" person="Sarah" />
            )}
            <button onClick={() => setIsPlayerA(!isPlayerA)}>
              下一位玩家！
            </button>
          </div>
        );
      }

      function Counter({ person }) {
        const [score, setScore] = useState(0);
        return (
          <div className="counter">
            <h1>{person} 的分數：{score}</h1>
            <button onClick={() => setScore(score + 1)}>加一</button>
          </div>
        );
      }
      ```

    - 每當 `key` 發生變化，`React` 就會將舊的組件（及其底下整棵子樹的狀態）徹底銷毀，並從頭開始重新建立一個全新的 `DOM` 元素與 `state`。

    :::info 注意
    請記住，`key` 不需要是全域唯一的。它們只需要在同一個父組件內部保持唯一即可。
    :::

  - ### 實戰場景：使用 key 重置聊天表單
    - 使用 `key` 來重置狀態在處理表單輸入時特別有用。例如一個即時通訊軟體：

      ```jsx
      // App.js
      import { useState } from 'react';
      import Chat from './Chat.js';
      import ContactList from './ContactList.js';

      export default function Messenger() {
        const [to, setTo] = useState(contacts[0]);
        return (
          <div>
            <ContactList contacts={contacts} selectedContact={to} onSelect={contact => setTo(contact)} />
            {/* 關鍵：加上 key={to.id} */}
            <Chat key={to.id} contact={to} />
          </div>
        )
      }

      const contacts = [
        { id: 0, name: 'Taylor' },
        { id: 1, name: 'Alice' }
      ];
      ```

      ```jsx
      // Chat.js
      import { useState } from 'react';

      export default function Chat({ contact }) {
        const [text, setText] = useState('');
        return (
          <section className="chat">
            <textarea
              value={text}
              placeholder={'跟 ' + contact.name + ' 聊一聊'} onChange={e => setText(e.target.value)}
            />
            <button>發送到 {contact.name}</button>
          </section>
        );
      }
      ```

    - #### 為什麼要這樣做？
      - 如果沒有加 `key={to.id}`，當你在 `Taylor` 的對話框打了一串字，此時不小心點到 `Alice`，文字框的內容會被保留下來。使用者很可能因為這樣而把原本想給 `Taylor` 的私密訊息錯發給 `Alice`！

      - 加上 `key={to.id}` 後，只要切換聯絡人，`Chat` 組件就會被整棵重置，輸入框自然恢復一片空白，完美解決這個隱患。

  :::info 進階思考：如何幫「被移除」的組件保留草稿？
  - 在某些體驗更好的應用中，你可能會希望切換回 `Taylor` 時，剛剛沒打完的草稿還在。這時有三種常見策略：
    - `CSS 隱藏法`：同時渲染所有的 `Chat` 組件，但用 `CSS display: none` 隱藏非目前的對話。組件沒有從樹中被拔除，狀態自然還在（缺點：DOM 節點過多時效能較差）。

    - `狀態提升（推薦）`：將草稿狀態 `text` 提升到父組件 `Messenger` 中，用一個物件或 `Map` 記錄每個 `contact.id` 對應的文字，再透過 `props` 傳給子組件。

    - `快取至外部儲存`：利用 `localStorage` 或外部狀態管理，讓 `Chat` 在初始化與更動時與瀏覽器快取同步。

  - 無論你採用哪種保存策略，為了概念上的區隔，為目前的對話指定一個相對應的 `key` 依然是最佳實踐。
  :::

## 重點複習（Recap）
  - 只要在相同位置渲染的是相同組件，`React` 就會保留其狀態。
  - `state` 並非儲存在 `JSX` 標籤中，而是與你把該 `JSX` 放置在樹中的位置相關聯。
  - 你可以透過為子樹指定不同的 `key`，來重置該子樹的狀態。
  - 不要嵌套組件的定義，否則會意外導致 `state` 被重置。

## 挑戰（Challenges）
  - #### 1. 修復消失的輸入框文字
    - ##### 題目描述
      當點擊 `「顯示提示」` 按鈕時，畫面上會多顯示一行文字，但同時也會意外地把使用者在輸入框中（`<Form />`）已經打好的字給清空。為什麼會這樣？請修復它。

    - ##### 原始程式碼
      ```jsx
      import { useState } from 'react';

      export default function App() {
        const [showHint, setShowHint] = useState(false);
        if (showHint) {
          return (
            <div>
              <p><i>提示：你最喜歡的城市？</i></p>
              <Form />
              <button onClick={() => {
                setShowHint(false);
              }}>隱藏提示</button>
            </div>
          );
        }
        return (
          <div>
            <Form />
            <button onClick={() => {
              setShowHint(true);
            }}>顯示提示</button>
          </div>
        );
      }

      function Form() {
        const [text, setText] = useState('');
        return (
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
          />
        );
      }

      ```

    - ##### 錯誤原因分析
      - 在原本的程式碼中，使用了傳統的 `if-else` 分支直接回傳不同的 `JSX` 結構：

        - `if (showHint) 分支`：`<div>` 的第一個子組件是 `<p>`，第二個子組件才是 `<Form />`。

        - `else 分支`：`<div>` 的第一個子組件直接就是 `<Form />`。

      - 當點擊按鈕切換 `showHint` 時，對 `React` 來說，「第一個位置」的組件類型改變了（從 `Form` 變成 `p`，或者從 `p` 變成 `Form`）。一旦相同位置的組件類型改變，`React` 就會強行將該節點以下的所有狀態徹底銷毀。

    - ##### 解答
      - 最簡單、最乾淨的做法是將兩個分支合併，利用條件運算子 `&&`。這樣無論 `showHint` 為何，`<Form />` 在 `DOM` 樹中的相對位置都是固定不變的。

      ```jsx
      import { useState } from 'react';

      export default function App() {
        const [showHint, setShowHint] = useState(false);
        return (
          <div>
            {/* 💡 當 showHint 為 false 時，這行在樹中會被視為 null/空，但不會影響後方組件的索引順序 */}
            {showHint && <p><i>提示：你最喜歡的城市？</i></p>}
            
            <Form />
            
            {showHint ? (
              <button onClick={() => setShowHint(false)}>隱藏提示</button>
            ) : (
              <button onClick={() => setShowHint(true)}>顯示提示</button>
            )}
          </div>
        );
      }

      function Form() {
        const [text, setText] = useState('');
        return <textarea value={text} onChange={e => setText(e.target.value)} />;
      }
      ```

  - #### 2. 交換兩個表單欄位
    - ##### 題目描述
      這個表單允許使用者輸入`「姓名」`與`「姓氏」`，並有一個核取方塊可以調換這兩個欄位的上下順序。目前有個 `Bug`：當你在第一個輸入框填寫完內容後勾選調換，文字會留在「第一個輸入框（變成了姓氏）」，沒有跟著原本的欄位一起移動。

    - ##### 原始程式碼
      ```jsx
      import { useState } from 'react';

      export default function App() {
        const [reverse, setReverse] = useState(false);
        let checkbox = (
          <label>
            <input
              type="checkbox"
              checked={reverse}
              onChange={e => setReverse(e.target.checked)}
            />
            調換順序
          </label>
        );
        if (reverse) {
          return (
            <>
              <Field label="姓氏" />
              <Field label="名字" />
              {checkbox}
            </>
          );
        } else {
          return (
            <>
              <Field label="名字" />
              <Field label="姓氏" />
              {checkbox}
            </>
          );
        }
      }

      function Field({ label }) {
        const [text, setText] = useState('');
        return (
          <label>
            {label}：
            <input
              type="text"
              value={text}
              placeholder={label}
              onChange={e => setText(e.target.value)}
            />
          </label>
        );
      }
      ```

    - ##### 錯誤原因分析
      `React` 預設是依靠組件在父級中的順序位置（第一個、第二個）來匹配狀態的。當你調換順序時，雖然欄位的 `label` 透過 `props` 改變了，但對於 `React` 來說，第一位置依然是同一個 `<Field />` 類型，所以舊的 `text` 狀態就被原地保留並套用到新傳入的 `label` 上。

    - ##### 解答
      我們需要明確告訴 `React` 這兩個欄位具有獨立且唯一的身份，即使它們在樹中的渲染順序被對調了，狀態也要跟著身份走。這正是 `key` 最核心的用途。

      ```jsx
      import { useState } from 'react';

      export default function App() {
        const [reverse, setReverse] = useState(false);
        
        let checkbox = (
          <label>
            <input type="checkbox" checked={reverse} onChange={e => setReverse(e.target.checked)} />
            調換順序
          </label>
        );

        if (reverse) {
          return (
            <>
              {/* 💡 加上明確且不隨順序改變的 key */}
              <Field key="lastName" label="姓氏" />
              <Field key="firstName" label="名字" />
              {checkbox}
            </>
          );
        } else {
          return (
            <>
              <Field key="firstName" label="名字" />
              <Field key="lastName" label="姓氏" />
              {checkbox}
            </>
          );
        }
      }

      function Field({ label }) {
        const [text, setText] = useState('');
        return (
          <label>
            {label}：
            <input type="text" value={text} placeholder={label} onChange={e => setText(e.target.value)} />
          </label>
        );
      }
      ```

  - #### 3. 重置詳情表單
    - ##### 題目描述
      這是一個可編輯的聯絡人後台。點擊聯絡人（如 `Taylor`、`Alice`），底下的表單應該要切換為對應聯絡人的資訊。然而目前的 `Bug` 是：當點擊 `Alice` 時，雖然側邊欄選中了 `Alice`，但底下的編輯輸入框依然顯示上一個聯絡人（`Taylor`）尚未保存的舊資料。

    - ##### 原始程式碼
      ```jsx
      import { useState } from 'react';
      import ContactList from './ContactList.js';
      import EditContact from './EditContact.js';

      export default function ContactManager() {
        const [
          contacts,
          setContacts
        ] = useState(initialContacts);
        const [
          selectedId,
          setSelectedId
        ] = useState(0);
        const selectedContact = contacts.find(c =>
          c.id === selectedId
        );

        function handleSave(updatedData) {
          const nextContacts = contacts.map(c => {
            if (c.id === updatedData.id) {
              return updatedData;
            } else {
              return c;
            }
          });
          setContacts(nextContacts);
        }

        return (
          <div>
            <ContactList
              contacts={contacts}
              selectedId={selectedId}
              onSelect={id => setSelectedId(id)}
            />
            <hr />
            <EditContact
              initialData={selectedContact}
              onSave={handleSave}
            />
          </div>
        )
      }

      const initialContacts = [
        { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
        { id: 1, name: 'Alice', email: 'alice@mail.com' },
        { id: 2, name: 'Bob', email: 'bob@mail.com' }
      ];
      ```

    - ##### 錯誤原因分析
      `<EditContact />` 組件在切換聯絡人時，在渲染樹中的結構與位置完全沒變。即便傳入了新的 `initialData`，但因為該組件已經初始化過，它內部的 `useState(initialData.name)` 只會在第一次掛載（`Mount`）時執行一次，後續重新渲染並不會自動去覆蓋掉 `state` 內部的舊值。

    - ##### 解答
      我們選擇了不同的聯絡人，整個表單從概念上來說就是一個「全新的表單」。只要為 `<EditContact />` 加上 `key={selectedId}`，當 `selectedId` 改變時，`React` 就會主動銷毀舊表單的所有狀態，並強迫新表單從頭開始初始化。

      ```jsx
      // ... 前方選擇與資料查找邏輯保持不變 ...
      return (
        <div>
          <ContactList contacts={contacts} selectedId={selectedId} onSelect={id => setSelectedId(id)} />
          <hr />
          {/* 關鍵：加上 key={selectedId}，聯絡人一換，整棵編輯子樹立刻徹底重置 */}
          <EditContact key={selectedId} initialData={selectedContact} onSave={handleSave} />
        </div>
      );
      ```

  - #### 4. 清除正在載入的圖片
    - ##### 題目描述
      在相簿功能中點擊 `「下一張」` 時，瀏覽器會去發送請求下載下一張圖。但因為 `React` 預設會復用（Reuse）同一個 `<img>` DOM 標籤，在下一張新圖片還沒完全下載好的空檔，畫面上依然會卡著「上一張舊圖片」，造成圖文不符的尷尬體驗。請讓它在點擊「下一張」時，舊圖片立刻被清除（出現短暫閃白等候載入是可接受的）。

    - ##### 原始程式碼
      ```jsx
      import { useState } from 'react';

      export default function Gallery() {
        const [index, setIndex] = useState(0);
        const hasNext = index < images.length - 1;

        function handleClick() {
          if (hasNext) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }

        let image = images[index];
        return (
          <>
            <button onClick={handleClick}>
              下一張
            </button>
            <h3>
              {images.length} 張圖片中的第 {index + 1} 張
            </h3>
            <img src={image.src} />
            <p>
              {image.place}
            </p>
          </>
        );
      }

      let images = [{
        place: 'Penang, Malaysia',
        src: 'https://react.dev/images/docs/scientists/FJeJR8M.jpg'
      }, {
        place: 'Lisbon, Portugal',
        src: 'https://react.dev/images/docs/scientists/dB2LRbj.jpg'
      }, {
        place: 'Bilbao, Spain',
        src: 'https://react.dev/images/docs/scientists/z08o2TS.jpg'
      }, {
        place: 'Valparaíso, Chile',
        src: 'https://react.dev/images/docs/scientists/Y3utgTi.jpg'
      }, {
        place: 'Schwyz, Switzerland',
        src: 'https://react.dev/images/docs/scientists/JBbMpWY.jpg'
      }, {
        place: 'Prague, Czechia',
        src: 'https://react.dev/images/docs/scientists/QwUKKmF.jpg'
      }, {
        place: 'Ljubljana, Slovenia',
        src: 'https://react.dev/images/docs/scientists/3aIiwfm.jpg'
      }];

      ```

    - ##### 解答
      如果不希望 `React` 復用舊的 `<img>` 節點，可以直接給它一個動態變更的 `key`（例如圖片的網址）。當 `key` 改變，`React` 就會徹底移除舊的 `DOM` 節點並建立一個乾淨、沒有快取任何舊圖像的全新 `<img>` 元素。

      ```jsx
      // ... 前方 Gallery 組件狀態邏輯保持不變 ...
      let image = images[index];
      return (
        <>
          <button onClick={handleClick}>下一張</button>
          <h3>{images.length} 張圖片中的第 {index + 1} 張</h3>
          
          {/* 💡 給予 key 屬性，阻止 React 復用 DOM 節點，點擊時立刻清空舊圖 */}
          <img key={image.src} src={image.src} />
          
          <p>{image.place}</p>
        </>
      );
      ```

  - #### 5. 修復列表中錯位的 state
    - ##### 題目描述
      列表中的每個聯絡人都可以點擊 `「顯示郵件」` 按鈕。當你點開了 `Alice` 的郵件，接著勾選 `「以相反的順序顯示（倒序）」` 時，會發現展開的郵件錯位移到了 `Taylor` 身上，而原本展開的 `Alice` 反而被收起來移到了底部。

    - ##### 原始程式碼
      ```jsx
      import { useState } from 'react';
      import Contact from './Contact.js';

      export default function ContactList() {
        const [reverse, setReverse] = useState(false);

        const displayedContacts = [...contacts];
        if (reverse) {
          displayedContacts.reverse();
        }

        return (
          <>
            <label>
              <input
                type="checkbox"
                checked={reverse}
                onChange={e => {
                  setReverse(e.target.checked)
                }}
              />{' '}
              以相反的順序顯示
            </label>
            <ul>
              {displayedContacts.map((contact, i) =>
                <li key={i}>
                  <Contact contact={contact} />
                </li>
              )}
            </ul>
          </>
        );
      }

      const contacts = [
        { id: 0, name: 'Alice', email: 'alice@mail.com' },
        { id: 1, name: 'Bob', email: 'bob@mail.com' },
        { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
      ];
      ```

    - ##### 錯誤原因分析
      - 這是經典的陣列渲染 `Bug`。原本的程式碼使用了陣列的`索引（Index）` i 作為 `key`：

      ```jsx
      {displayedContacts.map((contact, i) => <li key={i}>)
      ```

      當陣列被 `reverse()` 倒序後，原本在第 `0` 個位置（`Index 0`）的 `Alice` 變成了 `Taylor`。對於 `React` 而言，它只認得 `「第 0 個位置的 key={0}」` 這件事。因為 `key` 沒變，`React` 就會把原本屬於 `Index 0` 的 `expanded=true` 狀態原地套用在倒序後被擺在 `Index 0` 的 `Taylor` 身上，進而造成狀態錯位。

    - ##### 解答
      只要是渲染動態列表（包含排序、過濾、刪除或新增等操作），絕對不要使用隨順序變動的陣列 `Index` 作為 `key`。必須使用資料庫端或資料本身穩定且絕對唯一的 `id`。

      ```jsx
      // ... 前方倒序邏輯保持不變 ...
      return (
        <>
          <label>
            <input type="checkbox" checked={reverse} onChange={e => setReverse(e.target.checked)} />
            {' '}以相反的順序顯示
          </label>
          <ul>
            {displayedContacts.map(contact =>
              {/* 💡 修正：使用 contact.id 作為 key，讓狀態與真實資料本體緊密綁定，不受排序影響 */}
              <li key={contact.id}>
                <Contact contact={contact} />
              </li>
            )}
          </ul>
        </>
      );
      ```