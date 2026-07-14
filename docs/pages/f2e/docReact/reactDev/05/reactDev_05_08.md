---
title: '[React官網] React 19.2 教學文件'
---

# 保持組件純粹
  部分 `JavaScript` 函數是 純粹 的，這類函數通常被稱為純函數。純函數僅執行計算操作，不做其他操作。
  你可以通過將組件按純函數嚴格編寫，以避免一些隨著程式碼庫的增長而出現的、令人困擾的 `bug` 以及不可預測的行為。
  但為了獲得這些好處，你需要遵循一些規則。
  
  :::info 你將學到
  - 純函數是什麼，以及它如何幫助你避免 bug
  - 如何將數據變更與渲染過程分離，以保持組件的純粹
  - 如何使用嚴格模式發現組件中的錯誤
  :::
  
## 純函數：組件作為公式
  在電腦科學中（尤其是函數式程式設計的世界中），[純函數](https://wikipedia.org/wiki/Pure_function) 通常具有如下特徵：
  - #### 只負責自己的任務
    它不會更改在該函數調用前就已存在的物件或變數。
    
  - #### 輸入相同，則輸出相同
    給定相同的輸入，純函數應總是返回相同的結果。
    
  舉個你非常熟悉的純函數範例：數學中的公式。
  
  考慮如下數學公式：`y = 2x`。
  
  若 `x = 2` 則 `y = 4`。永遠如此。
  
  若 `x = 3` 則 `y = 6`。永遠如此。
  
  若 `x = 3`，那麼 `y` 並不會因為時間或股市的影響，而有時等於 `9` 、 `-1` 或 `2.5`。
  
  若 `y = 2x` 且 `x = 3`, 那麼 `y` 永遠 等於 `6`。
  
  我們使用 `JavaScript` 的函數實現，看起來將會是這樣：
  ```jsx
  function double(number) {
    return 2 * number;
  }
  ```

  上述例子中，`double()` 就是一個 純函數。如果你傳入 `3` ，它將總是返回 `6`。
  
  `React` 便圍繞著這個概念進行設計。`React` 假設你編寫的所有組件都是純函數。也就是説，對於相同的輸入，你所編寫的 `React` 組件必須總是返回相同的 `JSX`。
  
  當你給函數 `Recipe` 傳入 `drinkers={2}` 參數時，它將返回包含 `2 cups of water` 的 `JSX`。永遠如此。
  
  而當你傳入 `drinkers={4}` 時，它將返回包含 `4 cups of water` 的 `JSX`。永遠如此。
  
  就像數學公式一樣。你可以把你的組件當作食譜：如果你遵循它們，並且在烹飪過程中不引入新食材，你每次都會得到相同的菜餚。那這道 “菜餚” 就是組件用於 `React` [渲染](https://zh-hans.react.dev/learn/render-and-commit) 的 `JSX`。
  

## 副作用：（不符合）預期的後果
  `React` 的渲染過程必須自始至終是純粹的。組件應該只 返回 它們的 `JSX`，而不 改變 在渲染前就已存在的任何物件或變數 — 這將會使它們變得不純粹！
  
  以下是違反這一規則的組件範例：
  ```jsx
  let guest = 0;

  function Cup() {
    // Bad：正在更改預先存在的變數！
    guest = guest + 1;
    return <h2>Tea cup for guest #{guest}</h2>;
  }

  export default function TeaSet() {
    return (
      <>
        <Cup />
        <Cup />
        <Cup />
      </>
    );
  }
  ```

  該組件正在讀寫其外部聲明的 `guest` 變數。這意味著 多次調用這個組件會產生不同的 `JSX`！並且，如果 其他 組件讀取 `guest`，它們也會產生不同的 `JSX`，其結果取決於它們何時被渲染！這是無法預測的。你可以 將 `guest` 作為 `prop` 傳入 來修復此組件：
  
  ```jsx
  function Cup({ guest }) {
    return <h2>Tea cup for guest #{guest}</h2>;
  }

  export default function TeaSet() {
    return (
      <>
        <Cup guest={1} />
        <Cup guest={2} />
        <Cup guest={3} />
      </>
    );
  }
  ```

  現在你的組件就是純粹的，因為它返回的 `JSX` 只依賴於 `guest prop`。
  
  一般來說，你不應該期望你的組件以任何特定的順序被渲染。每個組件都應該 `“獨立思考”`，而不是在渲染過程中試圖與其他組件協調，或者依賴於其他組件。
  渲染過程就像是一場學校考試：每個組件都應該自己計算 `JSX`！
  
  :::info 使用嚴格模式檢測不純的計算
  - 儘管你可能還沒使用過，但在 `React` 中，你可以在渲染時讀取三種輸入：`props`，`state` 和 `context`。編寫組件時，你應該始終將這些輸入視為唯讀。
  - 當你想根據使用者輸入 更改 某些內容時，你應該 [設置狀態](https://zh-hans.react.dev/learn/state-a-components-memory)，而不是直接寫入變數。當你的組件正在渲染時，你永遠不應該改變預先存在的變數或物件。
  - `React` 提供了 `“嚴格模式”`，在嚴格模式下開發時，它將會調用每個組件函數兩次。`通過重複調用組件函數，嚴格模式有助於找到違反這些規則的組件`。
  - 對於純函數版本，即使調用該函數兩次也能得到正確結果。純函數僅執行計算，因此調用它們兩次不會改變任何東西。嚴格模式在生產環境下不生效，因此它不會降低應用程式的速度。如需引入嚴格模式，你可以用 `<React.StrictMode>` 包裹根組件。
  :::

  - ### 局部 mutation：組件的小秘密
    上述範例的問題出在渲染過程中，組件改變了 `預先存在的` 變數的值。我們將這種現象稱為 `突變（mutation）`。
    但是，你完全可以在渲染時更改你 剛剛 創建的變數和物件。例如，在函數內部創建一個 `[]` 陣列，將其分配給一個 `cups` 變數，然後 `push` 元素進去：
    ```jsx
    export default function TeaGathering() {
      const cups = [];
      for (let i = 1; i <= 12; i++) {
        cups.push(<Cup key={i} guest={i} />);
      }
      return cups;
    }
    ```

    這就被稱為 `局部 mutation` — 如同藏在組件裡的小秘密。只要它不是在函數外面創建的，就不會影響組件的純粹性。
    
## 哪些地方 可能 引發副作用
  - 某些事物在特定情況下不得不發生改變。這些變動包括更新螢幕、啟動動畫、更改數據等，它們被稱為 `副作用（side effects）`。它們是 `額外` 發生的事情，與渲染過程無關。
  
  - 在 `React` 中，副作用通常屬於 [事件處理程序](https://zh-hans.react.dev/learn/responding-to-events)。事件處理程序是 `React` 在你執行某些操作（如單擊按鈕）時執行的函數。即使事件處理程序是在你的組件 `內部` 定義的，它們創立的目的就不是在渲染期間執行的！ `因此事件處理程序無需是純函數`。
  
  - 如果你用盡一切辦法，仍無法為副作用找到合適的事件處理程序，你還可以調用組件中的 [useEffect](https://zh-hans.react.dev/reference/react/useEffect) 方法將其附加到返回的 `JSX` 中。這會告訴 `React` 在渲染結束後執行它。`然而，這種方法應該是你最後的手段`。
  
  :::info React 為何側重於純函數?
  - 你的組件可以在不同的環境下運行 — 例如，在伺服器上（SSR）！
  - 你可以為那些輸入未更改的組件來 [跳過渲染](https://www.google.com/search?q=/reference/react/memo&authuser=1)，以提高效能（快取優化）。
  - 如果在渲染深層組件樹的過程中，某些數據發生了變化，`React` 可以重新開始渲染，而不會浪費時間完成過時的渲染。
  :::
    
## 重點複習（Recap）
  - 一個組件必須是純粹的，就意味著：
    - `只負責自己的任務。` 它不會更改在該函數調用前就已存在的物件或變數。
    - `輸入相同，則輸出相同。` 給定相同的輸入，組件應該總是返回相同的 `JSX`。
  - 渲染隨時可能發生，因此組件不應依賴於彼此的渲染順序。
  - 你不應該改變任何用於組件渲染的輸入。這包括 `props`、`state` 和 `context`。通過 [“設置” state](https://zh-hans.react.dev/learn/state-a-components-memory) 來更新界面，而不要改變預先存在的物件。
  - 努力在你返回的 `JSX` 中表達你的組件邏輯。當你需要“改變事物”時，你通常希望在事件處理程序中進行。作為最後的手段，你可以使用 `useEffect`。
  
## 挑戰（Challenges）
  - #### 1. 修復壞掉的时鐘
    ```jsx
    export default function Clock({ time }) {
      const hours = time.getHours();
      if (hours >= 0 && hours <= 6) {
        document.getElementById('time').className = 'night';
      } else {
        document.getElementById('time').className = 'day';
      }
      return (
        <h1 id="time">
          {time.toLocaleTimeString()}
        </h1>
      );
    }
    ```
    - ##### 目標
      修正時鐘組件直接操作 `DOM` 修改 `class` 的錯誤。
    - ##### 關鍵解答
      將副作用移除，改成計算 `className` 變數後，直接綁定在 `JSX` 上。
      ```jsx
      export default function Clock({ time }) {
        const hours = time.getHours();
        let className;
        if (hours >= 0 && hours <= 6) {
          className = 'night';
        } else {
          className = 'day';
        }
        return (
          <h1 className={className}>
            {time.toLocaleTimeString()}
          </h1>
        );
      }
      ```

  - #### 2. 修復損壞的資料
    ```jsx
    // Profile.js
    import Panel from './Panel.js';
    import { getImageUrl } from './utils.js';

    let currentPerson;

    export default function Profile({ person }) {
      currentPerson = person;
      return (
        <Panel>
          <Header />
          <Avatar />
        </Panel>
      )
    }

    function Header() {
      return <h1>{currentPerson.name}</h1>;
    }

    function Avatar() {
      return (
        <img
          className="avatar"
          src={getImageUrl(currentPerson)}
          alt={currentPerson.name}
          width={50}
          height={50}
        />
      );
    }
    ```

    ```jsx
    // App.js
    import Profile from './Profile.js';

    export default function App() {
      return (
        <>
          <Profile person={{
            imageId: 'lrWQx8l',
            name: 'Subrahmanyan Chandrasekhar',
          }} />
          <Profile person={{
            imageId: 'MK3eW3A',
            name: 'Creola Katherine Johnson',
          }} />
        </>
      )
    }
    ```

    - ##### 目標
      修正並排呈現的 `Profile` 在折疊/展開時顯示同一個人的 `bug`。
      
    - ##### 關鍵解答
      原代碼在外面定義了全域變數 `let currentPerson` 並在渲染時修改它，導致組件不純。應該將變數完全移除，並透過 `props` 把資料正確傳遞給子組件（如 `<Header person={person} />`）。

      ```jsx
      // Profile.js
      import Panel from './Panel.js';
      import { getImageUrl } from './utils.js';

      export default function Profile({ person }) {
        return (
          <Panel>
            <Header person={person} />
            <Avatar person={person} />
          </Panel>
        )
      }

      function Header({ person }) {
        return <h1>{person.name}</h1>;
      }

      function Avatar({ person }) {
        return (
          <img
            className="avatar"
            src={getImageUrl(person)}
            alt={person.name}
            width={50}
            height={50}
          />
        );
      }
      ```
      
  - #### 3. 修復損壞的故事集
    ```jsx
    export default function StoryTray({ stories }) {
      stories.push({
        id: 'create',
        label: 'Create Story'
      });

      return (
        <ul>
          {stories.map(story => (
            <li key={story.id}>
              {story.label}
            </li>
          ))}
        </ul>
      );
    }
    ```

    - ##### 目標
      修正 `“Create Story”` 區塊在時鐘每秒更新時重複出現的 `bug`。
      
    - ##### 關鍵解答
      原代碼在傳入的 `stories` 陣列（這是一個 `prop`）上直接調用 `.push()`，修改了預先存在的外部物件。
      - ###### 解法 A
        在 `map` 的 `JSX` 外面，直接手動多寫一行獨立的 `<li>Create Story</li>`。
        ```jsx
        export default function StoryTray({ stories }) {
          return (
            <ul>
              {stories.map(story => (
                <li key={story.id}>
                  {story.label}
                </li>
              ))}
              <li>Create Story</li>
            </ul>
          );
        }
        ```
        
      - ###### 解法 B
        使用 `.slice()` 先複製一份全新的陣列，再對新陣列進行 `.push()`，保持局部 `mutation`。

        ```jsx
        export default function StoryTray({ stories }) {
          // 複製陣列！
          const storiesToDisplay = stories.slice();

          // 不影響原始陣列：
          storiesToDisplay.push({
            id: 'create',
            label: 'Create Story'
          });

          return (
            <ul>
              {storiesToDisplay.map(story => (
                <li key={story.id}>
                  {story.label}
                </li>
              ))}
            </ul>
          );
        }
        ```