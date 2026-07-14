---
title: '[React官網] React 19.2 教程'
---

# 在組件間共享狀態
  有時候，你希望兩個組件的狀態始終同步變更。要實現這一點，可以將相關 `state` 從這兩個組件中移除，並把 `state` 放到它們的公共 `父級`（Common Parent），再透過 `props` 將 `state` 傳遞給這兩個組件。這被稱為 `「狀態提升」（Lifting State Up）`，這是編寫 `React` 程式碼時非常常見且核心的操作。

  :::info 你將學習到
  - 如何使用狀態提昇在元件之間共用狀態
  - 什麼是受控組件和非受控組件
  :::

## 透過範例說明狀態提升
  ```jsx
  import { useState } from 'react';

  function Panel({ title, children }) {
    const [isActive, setIsActive] = useState(false);
    return (
      <section className="panel">
        <h3>{title}</h3>
        {isActive ? (
          <p>{children}</p>
        ) : (
          <button onClick={() => setIsActive(true)}>
            顯示
          </button>
        )}
      </section>
    );
  }

  export default function Accordion() {
    return (
      <>
        <h2>哈薩克斯坦，阿拉木圖</h2>
        <Panel title="關於">
          阿拉木圖人口約200萬，是哈薩克斯坦最大的城市。它在 1929 年到 1997 年間都是首都。
        </Panel>
        <Panel title="詞源">
          這個名字來自於 <span lang="kk-KZ">алма</span>，哈薩克語中“蘋果”的意思，經常被翻譯成“蘋果之鄉”。事實上，阿拉木圖的周邊地區被認為是蘋果的發源地，<i lang="la">Malus sieversii</i> 被認為是現今蘋果的祖先。
        </Panel>
      </>
    );
  }
  ```

  - 在這個範例中，父組件 `Accordion`（手風琴）渲染了兩個獨立的 `Panel`（面板）組件。
    - `Accordion`
      - `Panel`
      - `Panel`

  - 每個 `Panel` 組件都有一個布林值 `isActive`，用於控制其內容是否顯示。

  - 一開始，兩個 `Panel` 內部的 `isActive` 都是 `false`，因此按下其中一個面板的按鈕，只會影響該面板本身，另一個面板不受影響，兩者是各自獨立的。
  
  - 假設現在想改成：任何時候只能展開一個面板，也就是展開第二個面板時，第一個面板要自動收合。要達成這個效果，需要分三個步驟，把狀態`「提升」`到共同的父組件：
    - 從子組件中移除狀態。
    - 從父組件傳入寫死的資料。
    - 為共同的父組件加入狀態，並將其與事件處理函式一起向下傳遞。

  - ### 步驟 1：從子組件中移除狀態
    - 把 `Panel` 對 `isActive` 的控制權交給父組件。先從 `Panel` 中刪除：
      ```jsx
      const [isActive, setIsActive] = useState(false);
      ```

    - 再把 `isActive` 加進 `Panel` 的 `props`：
      ```jsx
      function Panel({ title, children, isActive }) {
      ```

    - 如此一來，`Panel` 的父組件便可透過向下傳遞 `prop` 來控制 `isActive`；
      反之，`Panel` 本身對 `isActive` 的值就沒有控制權，完全由父組件決定。

  - ### 步驟 2：從共同的父組件傳入寫死的資料
    - 要找出你想協調的兩個子組件最近的共同父組件 —— 在此例中就是 `Accordion`。因為它位於兩個面板之上，能控制它們的 `props`，所以會成為目前哪個面板被啟用的「控制來源」。此步驟先讓 `Accordion` 把寫死的值（例如 `true`）傳給兩個 `Panel`，可以先試著修改這個值，觀察畫面上的結果。

    
    ```jsx
    export default function Accordion() {
      return (
        <>
          <h2>哈薩克斯坦，阿拉木圖</h2>
          <Panel title="關於" isActive={true}>
            阿拉木圖人口約200萬，是哈薩克斯坦最大的城市。它在 1929 年到 1997 年間都是首都。
          </Panel>
          <Panel title="詞源" isActive={true}>
            這個名字來自於 <span lang="kk-KZ">алма</span>，哈薩克語中“蘋果”的意思，經常被翻譯成“蘋果之鄉”。事實上，阿拉木圖的周邊地區被認為是蘋果的發源地，<i lang="la">Malus sieversii</i> 被認為是現今蘋果的祖先。
          </Panel>
        </>
      );
    }
    ```

  - ### 步驟 3：為共同的父組件加入狀態
    - 狀態提升通常會改變原本狀態的資料型別。此例中一次只能啟用一個面板，因此父組件 `Accordion` 需要記錄「哪一個」面板被啟用，所以改用 `數字（索引）` 而非布林值來表示：
      ```jsx
      const [activeIndex, setActiveIndex] = useState(0);
      ```

    - 當 `activeIndex` 為 `0` 時，啟動第一個面板；為 `1` 時，啟動第二個面板。
      ```jsx
      <>
        <Panel
          isActive={activeIndex === 0}
          onShow={() => setActiveIndex(0)}
        >
          ...
        </Panel>
        <Panel
          isActive={activeIndex === 1}
          onShow={() => setActiveIndex(1)}
        >
          ...
        </Panel>
      </>
      ```

  - ### 狀態提升完整實作程式碼
    ```jsx
    import { useState } from 'react';

    export default function Accordion() {
      // 狀態提升：由父組件統一管控目前展開的面板索引
      const [activeIndex, setActiveIndex] = useState(0);

      return (
        <>
          <h2>哈薩克，阿拉木圖</h2>
          <Panel
            title="關於"
            isActive={activeIndex === 0}
            onShow={() => setActiveIndex(0)}
          >
            阿拉木圖人口約 200 萬，是哈薩克最大的城市。它在 1929 年到 1997 年間都是首都。
          </Panel>
          <Panel
            title="詞源"
            isActive={activeIndex === 1}
            onShow={() => setActiveIndex(1)}
          >
            這個名字來自於 <span lang="kk-KZ">алма</span>，哈薩克語中「蘋果」的意思，經常被翻譯成「蘋果之鄉」。事實上，阿拉木圖的周邊地區被認為是蘋果 get 的發源地。
          </Panel>
        </>
      );
    }

    function Panel({ title, children, isActive, onShow }) {
      return (
        <section className="panel">
          <h3>{title}</h3>
          {isActive ? (
            <p>{children}</p>
          ) : (
            <button onClick={onShow}>顯示</button>
          )}
        </section>
      );
    }
    ```

  :::info 受控與非受控組件（Controlled & Uncontrolled Components）
  - `非受控組件（Uncontrolled）`：組件內部包含「不受外部控制」的內部狀態。例如最一開始各自擁有 `isActive` 狀態的 `Panel`，父組件無法干涉它。非受控組件通常配置簡單，但缺乏組合的靈活性。

  - `受控組件（Controlled`）：當組件內部的關鍵資訊完全由外部傳入的 `props` 驅動，而非自身狀態決定時，該組件就是「受控組件」。這讓父組件擁有最高規格的控制權與靈活性。

  在實際開發中，這兩個詞並非嚴格的技術定義，一個組件通常可以同時擁有內部 `state` 和外部 `props`。然而，這種思考模型對於組件的設計與重構討論非常有幫助。
  :::

## 每個狀態都對應唯一的資料源
  - 在 React 應用中，許多組件都有自己的狀態。有些狀態可能屬於靠近底層的葉子組件（例如：一個 Input 框的即時輸入）；有些狀態則存在於應用程式的最頂部（例如：全域路由或深色模式主題）。

  - #### 可信單一數據源（Single Source of Truth）
    - 每個獨特的主題或狀態，都應該存在且只存在於一個指定的組件中。這並不代表所有的 `state` 都要塞在同一個地方，而是對每個具體的功能狀態來說，都有一個特定的組件負責保存它。不要在組件之間進行重複的狀態複製，而是應該將狀態提升到公共父級，或是下放到需要它的子級。

## 重點複習（Recap）
  - 當你想整合兩個組件時，把它們的 `State 狀態` 移到共同的父組件中。
  - 接著在父組件中透過 `props` 把資訊傳遞下去。
  - 最後，向下傳遞事件處理函式，讓子組件能夠改變父組件的 `State 狀態`。
  - 把組件視為「受控」（由 `prop` 驅動）或「非受控」（由 `state` 驅動）來思考，是很有幫助的。

## 挑戰（Challenges）
  - #### 1. 同步輸入狀態
    - ##### 題目描述
      讓兩個獨立的輸入框保持同步 —— 編輯任何一個輸入框時，另一個也會即時更新為相同的文字。

    - ##### 提示
      你需要把它們的狀態移動到父組件中。

    - ##### 原始程式碼
      ```jsx
      import { useState } from 'react';

      export default function SyncedInputs() {
        return (
          <>
            <Input label="第一個輸入框" />
            <Input label="第二個輸入框" />
          </>
        );
      }

      function Input({ label }) {
        const [text, setText] = useState('');

        function handleChange(e) {
          setText(e.target.value);
        }

        return (
          <label>
            {label}
            {' '}
            <input
              value={text}
              onChange={handleChange}
            />
          </label>
        );
      }
      ```

    - ##### 解答
      把 `text` 狀態變數與 `handleChange` 事件處理函式一起移動到父組件中，然後把它們當作 `props` 傳遞給兩個 `Input` 組件，這樣它們就能保持同步。
      
      ```jsx
      import { useState } from 'react';

      export default function SyncedInputs() {
        const [text, setText] = useState('');

        function handleChange(e) {
          setText(e.target.value);
        }

        return (
          <>
            <Input
              label="第一個輸入框"
              value={text}
              onChange={handleChange}
            />
            <Input
              label="第二個輸入框"
              value={text}
              onChange={handleChange}
            />
          </>
        );
      }

      function Input({ label, value, onChange }) {
        return (
          <label>
            {label}
            {' '}
            <input
              value={value}
              onChange={onChange}
            />
          </label>
        );
      }
      ```

  - #### 2. 列表過濾
    - ##### 題目描述
      - `SearchBar` 組件目前自己控制內部的 `query` 搜尋字串，導致隔壁的 `List` 無法得知搜尋條件。請利用 `filterItems(foods, query)` 方法來動態過濾下方美食清單。
      - 為了測試修改是否正確，可以嘗試在輸入框中輸入「壽司」、「烤肉串」或「點心」。
      - `filterItems` 已經自動引入，不需要額外自行引入。

    - ##### 提示
      需要把 `query` 狀態與 `handleChange` 事件處理函式從 `SearchBar` 組件中移除，改移到 `FilterableList` 組件中，再把 `query` 和 `onChange` 當作 `props` 向下傳遞給 `SearchBar` 組件。

    - ##### 原始程式碼
      ```jsx
      // App.js
      import { useState } from 'react';
      import { foods, filterItems } from './data.js';

      export default function FilterableList() {
        return (
          <>
            <SearchBar />
            <hr />
            <List items={foods} />
          </>
        );
      }

      function SearchBar() {
        const [query, setQuery] = useState('');

        function handleChange(e) {
          setQuery(e.target.value);
        }

        return (
          <label>
            搜尋：{' '}
            <input
              value={query}
              onChange={handleChange}
            />
          </label>
        );
      }

      function List({ items }) {
        return (
          <table>
            <tbody>
              {items.map(food => (
                <tr key={food.id}>
                  <td>{food.name}</td>
                  <td>{food.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
      ```

      ```jsx
      // data.js
      export function filterItems(items, query) {
        query = query.toLowerCase();
        return items.filter(item =>
          item.name.split(' ').some(word =>
            word.toLowerCase().startsWith(query)
          )
        );
      }

      export const foods = [{
        id: 0,
        name: '壽司',
        description: '壽司是一道傳統的日本菜，是用醋飯做成的'
      }, {
        id: 1,
        name: '木豆',
        description: '製作木豆最常見的方法，是在湯中加入洋蔥、番茄和各種香料'
      }, {
        id: 2,
        name: '餃子',
        description: '餃子是用未發酵的麵團包裹鹹的或甜的餡料，再放入滾水中煮製而成的'
      }, {
        id: 3,
        name: '烤肉串',
        description: '烤肉串是一種很受歡迎的食物，是用肉串和肉塊做成的'
      }, {
        id: 4,
        name: '點心',
        description: '點心是廣東人的傳統喜好，是在餐廳吃早餐和午餐時喜歡點的一系列小菜'
      }];
      ```

    - ##### 解答
      把 `query` 狀態提升到 `FilterableList` 組件中，並呼叫 `filterItems(foods, query)` 方法取得過濾後的列表，再把結果傳遞給 `List` 組件。這樣一來，修改搜尋條件就會即時反映在列表上：

      ```jsx
      import { useState } from 'react';
      import { foods, filterItems } from './data.js';

      export default function FilterableList() {
        const [query, setQuery] = useState('');
        const results = filterItems(foods, query);

        function handleChange(e) {
          setQuery(e.target.value);
        }

        return (
          <>
            <SearchBar
              query={query}
              onChange={handleChange}
            />
            <hr />
            <List items={results} />
          </>
        );
      }

      function SearchBar({ query, onChange }) {
        return (
          <label>
            搜尋：{' '}
            <input
              value={query}
              onChange={onChange}
            />
          </label>
        );
      }

      function List({ items }) {
        return (
          <table>
            <tbody>
              {items.map(food => (
                <tr key={food.id}>
                  <td>{food.name}</td>
                  <td>{food.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
      ```