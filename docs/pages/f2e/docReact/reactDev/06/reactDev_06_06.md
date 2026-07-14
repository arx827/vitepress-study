---
title: '[React官網] React 19.2 教學文件'
---

# 更新 state 中的物件
  `State` 中可以保存任意類型的 `JavaScript` 值，包括 `物件`。但是，你不應該直接修改存放在 React `State` 中的物件。相反地，當你想要更新一個物件時，你需要建立一個新的物件（或者將其複製一份），然後將 `State` 更新為此新物件。

  :::info 你將學到
  - 如何正確地更新 React `State` 中的物件
  - 如何在不產生 `突變（Mutation）` 的情況下更新一個巢狀物件
  - 什麼是 `不可變性（Immutability）`，以及如何不破壞它
  - 如何使用 `Immer` 使複製物件不再繁瑣
  :::

## 什麼是 Mutation（突變）？
  你可以在 `State` 中存放任意類型的 `JavaScript` 值。

  ```jsx
  const [x, setX] = useState(0);
  ```

  到目前為止，你已經嘗試過在 `State` 中存放數字、字串和布林值，這些類型的值在 `JavaScript` 中是不可變的（Immutable），這意味著它們不能被改變或是唯讀的。你可以透過替換它們的值以觸發一次重新渲染。

  ```jsx
  setX(5);
  ```

  State `x` 從 `0` 變為 `5`，但是數字 `0` 本身並沒有發生改變。在 `JavaScript` 中，無法對內建的原始型別（Primitive values），如數字、字串和布林值，進行任何內部修改。

  現在考慮 `State` 中存放物件的情況：

  ```jsx
  const [position, setPosition] = useState({ x: 0, y: 0 });
  ```

  從技術上來說，改變物件自身部的內容是辦得到的。當你這樣做時，就製造了一個 `Mutation（突變）`：

  ```jsx
  position.x = 5;
  ```

  然而，雖然嚴格來說 React `State` 中存放的物件是可變的，但你應該像處理數字、布林值、字串一樣，將它們視為不可變的。因此你應該替換它們的值（傳入新物件），而不是直接對它們進行內部修改。

## 將 State 視為唯讀的
  換句話說，你應該 把所有存放在 `State` 中的 `JavaScript` 物件都視為唯讀的。

  在下面的例子中，我們用一個存放在 `State` 中的物件來表示指標當前的位置。當你在預覽區觸摸或移動游標時，紅色的點本應移動。但是實際上紅點仍停留在原處：

  ```jsx
  import { useState } from 'react';

  export default function MovingDot() {
    const [position, setPosition] = useState({
      x: 0,
      y: 0
    });
    return (
      <div
        onPointerMove={e => {
          position.x = e.clientX;
          position.y = e.clientY;
        }}
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
        }}>
        <div style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }} />
      </div>
    );
  }
  ```

  問題出在下面這段程式碼中：

  ```jsx
  onPointerMove={e => {
    position.x = e.clientX;
    position.y = e.clientY;
  }}
  ```

  這段程式碼直接修改了上一次渲染中分配給 `position` 的物件。但是因為並沒有呼叫 `State` 的設定函式，`React` 並不知道物件已更改，所以 `React` 沒有做出任何響應（不會重新渲染）。這就像在吃完飯之後才嘗試去改變剛才點菜的單子一樣。雖然在某些極端情況下直接修改 `State` 可能會動，但我們並不推薦這麼做。你應該把在渲染過程中可以存取到的 `State` 視為唯讀的。

  在這種情況下，為了真正地觸發一次重新渲染，你需要建立一個新物件並把它傳遞給 `State` 的設定函式：

  ```jsx
  onPointerMove={e => {
    setPosition({
      x: e.clientX,
      y: e.clientY
    });
  }}
  ```

  透過使用 `setPosition`，你在告訴 React：
  - 使用這個新的物件替換 `position` 的值
  - 然後再次重新渲染這個組件

  修改後的程式碼會讓紅點正確跟隨著你的指標移動。

  :::info 區域突變（Local mutation）是可以接受的
  像這樣的程式碼是有問題的，因爲它改變了 `State` 中現有的物件：
  ```jsx
  position.x = e.clientX;
  position.y = e.clientY;
  ```

  但是像這樣的程式碼就 沒有任何問題，因為你改變的是你剛剛建立的一個全新物件：
  ```jsx
  const nextPosition = {};
  nextPosition.x = e.clientX;
  nextPosition.y = e.clientY;
  setPosition(nextPosition);
  ```

  事實上，它完全等同於下面這種寫法：
  ```jsx
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
  ```
  - 只有當你改變已經處於 `State` 中的 現有（已渲染） 物件時，`Mutation` 才會成為問題。
  - 而修改一個你剛剛建立的臨時物件就不會出現任何問題，因為 還沒有其他的程式碼引用它。改變它並不會意外地影響到依賴它的東西。
  這叫做 `「區域突變（Local mutation）」`。你甚至可以在渲染的過程中進行區域突變的操作，這種操作既便捷又沒有任何副作用！
  :::

## 使用展開語法複製物件
  在前面的例子中，始終會根據當前指標的位置建立出一個全新的 `position` 物件。
  但是通常，你會希望把 `現有` 資料作為你所建立之新物件的一部分。
  例如，你可能只想更新表單中的其中一個欄位，其他的欄位仍然想保留之前的值。

  如果直接修改物件屬性，輸入框將無法正常運作：
  ```jsx
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }
  ```

  想要實現你的需求，最可靠的辦法就是建立一個新的物件並將它傳遞给 `setPerson`。但是在這裡，你還需要 把當前的資料複製到新物件中，因為你只改變了其中一個欄位：
  ```jsx
  setPerson({
    firstName: e.target.value, // 從 input 中獲取新的 first name
    lastName: person.lastName,
    email: person.email
  });
  ```

  你可以使用 `...` [物件展開（Spread syntax）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals) 語法，這樣你就不需要手動單獨複製每個屬性：
  ```jsx
  setPerson({
    ...person, // 複製上一個 person 中的所有欄位
    firstName: e.target.value // 但覆蓋（更新）firstName 欄位
  });
  ```

  現在表單就可以正常運作了！
  
  可以看到，你不需要為每個輸入框單獨宣告一個 `State`。對於大型表單，將所有資料都存放在同一個物件中是非常方便的 —— 前提是你能夠正確地更新它！

  請注意，`... 展開語法` 本質上是 `「淺複製（Shallow copy）」` —— 它只會複製一層。這使得它的執行速度很快，但也意味著當你想要更新一個 `巢狀（Nested）屬性` 時，你必須多次使用展開語法。

  :::info 使用單一事件處理函式來更新多個欄位
  你也可以在物件的定義中使用 `[` 和 `]` 括號來實現屬性的 `動態命名（Computed property names）`。下面是同一個例子，但它只使用了一個事件處理函式：

  ```jsx
  import { useState } from 'react';

  export default function Form() {
    const [person, setPerson] = useState({
      firstName: 'Barbara',
      lastName: 'Hepworth',
      email: 'bhepworth@sculpture.com'
    });

    function handleChange(e) {
      setPerson({
        ...person,
        [e.target.name]: e.target.value
      });
    }

    return (
      <>
        <label>
          First name:
          <input
            name="firstName"
            value={person.firstName}
            onChange={handleChange}
          />
        </label>
        <label>
          Last name:
          <input
            name="lastName"
            value={person.lastName}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            name="email"
            value={person.email}
            onChange={handleChange}
          />
        </label>
        <p>
          {person.firstName}{' '}
          {person.lastName}{' '}
          ({person.email})
        </p>
      </>
    );
  }

  ```
  
  在這裡，`e.target.name` 引用了 `<input>` 這個 DOM 元素的 `name` 屬性。
  :::

## 更新一個巢狀物件
  考慮下面這種結構的巢狀物件：
  ```jsx
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
    }
  });
  ```

  如果你想要更新 `person.artwork.city` 的值，用 `Mutation` 的直接修改法很容易理解：
  ```jsx
  person.artwork.city = 'New Delhi';
  ```

  但在 `React` 中，你需要將 `State` 視為不可變的！為了修改 `city` 的值，
  你首先需要建立一個新的 `artwork` 物件（其中預先填入了上一個 `artwork` 物件中的資料），
  然後建立一個新的 `person` 物件，並使得其中的 `artwork` 屬性指向新建立的 `artwork` 物件：
  ```jsx
  const nextArtwork = { ...person.artwork, city: 'New Delhi' };
  const nextPerson = { ...person, artwork: nextArtwork };
  setPerson(nextPerson);
  ```

  或者，寫成連續巢狀展開的單一呼叫：
  ```jsx
  setPerson({
    ...person, // 複製其它欄位的資料
    artwork: { // 替換 artwork 欄位
      ...person.artwork, // 複製之前 person.artwork 中的資料
      city: 'New Delhi' // 但是將 city 的值替換為 New Delhi！
    }
  });
  ```

  這雖然看起來有點冗長，但能安全且有效地解決問題。

  :::info 物件並非真正「巢狀」的
  下面這個物件從程式碼上來看是「巢狀（Nested）」的：
  ```jsx
  let obj = {
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
    }
  };
  ```

  然而，當我們思考 `JavaScript` 物件的特性時，「巢狀」並不是一個非常準確的物理描述。當這段程式碼執行時，記憶體中不存在物理上「套在內部」的物件。你實際上看到的是兩個相互獨立的物件：
  ```jsx
  let obj1 = {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  };

  let obj2 = {
    name: 'Niki de Saint Phalle',
    artwork: obj1
  };
  ```

  物件 `obj1` 並不處於 `obj2` 的「內部」。例如，下面的程式碼中，`obj3` 中的屬性也可以同時指向 `obj1`：
  ```jsx
  let obj3 = {
    name: 'Copycat',
    artwork: obj1
  };
  ```

  如果你直接修改 `obj3.artwork.city`，就會同時意外影響到 `obj2.artwork.city`。這是因為 `obj3.artwork`、`obj2.artwork` 和 `obj1` 都指向記憶體中的同一個物件。
  當你用物理「巢狀」的方式看待物件時，很難看出這一點。相反地，它們是相互獨立的物件，只不過是用屬性 `「指標（Pointer/Reference）」` 指向彼此而已。
  :::

  - ### 使用 Immer 編寫簡潔的更新邏輯
    如果你的 `State` 有多層的巢狀結構，你或許應該考慮 將其 `扁平化（Flatten）`。但是，如果你不想改變 `State` 的資料結構，你可能更喜歡用一種更便捷的方式來達到巢狀更新的效果。
    [Immer](https://github.com/immerjs/use-immer) 是一個非常流行的第三方庫，它可以讓你使用直覺、看似可以直接修改的語法編寫程式碼，並在底層自動幫你處理好複製的過程。
    透過使用 `Immer`，你寫出的程式碼看起來就像是你「打破了規則」而直接突變物件：

    ```jsx
    updatePerson(draft => {
      draft.artwork.city = 'Lagos';
    });
    ```

    但是不同於一般的 `Mutation`，它並不會覆蓋或破壞之前的歷史 `State`！

    :::info Immer 是如何運作的？
    由 `Immer` 提供的 `draft` 是一種特殊類型的物件，被稱為 `Proxy`，它會記錄你對它進行的所有操作。這就是你能夠隨心所欲地直接修改物件的原因。
    從原理上說，`Immer` 會弄清楚 `draft` 物件的哪些部分被改變了，並會依照你的修改，在背後複製並建立出一個全新的物件。
    :::

    要使用 `Immer`：
    1. 執行 `npm install use-immer` 新增 `Immer` 依賴。
    2. 用 `import { useImmer } from 'use-immer'` 替換掉 `import { useState } from 'react'`。

    使用 `Immer` 後，事件處理函式會變得非常簡潔。你可以自由地在同一個組件中同時使用 `useState` 和 `useImmer`。

    :::info 為什麼在 React 中不推薦直接修改 State？
    有以下幾個關鍵原因：
    - ###### 除錯（Debugging）
      如果你使用 `console.log` 並且保持 `State` 的不可變性，你之前 `log` 出來的舊 `State` 值就不會被新的變化所同步竄改。
      這樣你就可以清楚地在主控台看到兩次渲染之間 `State` 發生了什麼變化。

    - ###### 效能優化（Optimization）
      `React` 常見的效能優化策略依賴於「如果之前的 `props` 或 `state` 的參考（Reference）和下一次相同，就跳過渲染」。
      如果你從不直接修改 `State`，那麼你就可以透過快速的淺比較（`prevObj === obj`）來肯定這個物件內部有沒有發生改變。

    - ###### 新功能支援
      `React` 的新功能與架構（如 `Concurrent` 模式）依賴於 `State` 被像快照（Snapshot）一樣看待的理念。
      直接突變歷史版本會破壞這些新機制的正確性。

    - ###### 需求變更更彈性
      有些應用程式功能（例如：實作「上一步/下一步（Undo/Redo）」、展示修改歷史，或是允許使用者將表單重置成某個之前的暫存值），
      在不可變資料下會非常容易實作。因為你可以直接把舊物件的參考留在記憶體中。

    - ###### 更簡單的底層實作
      `React` 並不依賴「反應式（Reactive）」的屬性攔截機制（如 Vue 的隱式 `Getter`/`Setter` 或 `Proxy` 包裹），
      它允許你把任何純 `JavaScript` 物件存放在 `State` 中 —— 不管物件多大，都不會造成額外的效能負擔。

## 重點複習（Recap）
  - 將 `React` 中所有的 `State` 都視為不可直接修改（唯讀）的。
  - 當你在 `State` 中存放物件時，直接修改物件屬性並不會觸發重新渲染，還會同步破壞前一次渲染「快照」中的舊資料。
  - 不要直接修改一個物件，而要為它建立一個 `新` 版本，並透過設定新參考來觸發重新渲染。
  - 你可以使用 `{...obj, something: 'newValue'}` 物件展開語法來建立物件的淺複製。
  - 想要更新巢狀物件，你需要從你更新的節點開始，自底向上為每一層都建立新的展開複製。
  - 想要減少重複的巢狀展開程式碼，可以使用 `Immer`。

## 挑戰（Challenges）
  - #### 1. 修正錯誤的 State 更新程式碼
    ```jsx
    import { useState } from 'react';

    export default function Scoreboard() {
      const [player, setPlayer] = useState({
        firstName: 'Ranjani',
        lastName: 'Shettar',
        score: 10,
      });

      function handlePlusClick() {
        player.score++;
      }

      function handleFirstNameChange(e) {
        setPlayer({
          ...player,
          firstName: e.target.value,
        });
      }

      function handleLastNameChange(e) {
        setPlayer({
          lastName: e.target.value
        });
      }

      return (
        <>
          <label>
            Score: <b>{player.score}</b>
            {' '}
            <button onClick={handlePlusClick}>
              +1
            </button>
          </label>
          <label>
            First name:
            <input
              value={player.firstName}
              onChange={handleFirstNameChange}
            />
          </label>
          <label>
            Last name:
            <input
              value={player.lastName}
              onChange={handleLastNameChange}
            />
          </label>
        </>
      );
    }
    ```

    這個表單有幾個 `bug`。試著點擊幾次增加分數的按鈕，你會注意到分數並沒有增加。然後試著編輯一下名字（`First name`）欄位，你會注意到分數突然「彈出來」回應了你之前的修改。
    最後，試著編輯一下姓氏（`Last name`）欄位，你會發現分數完全消失了。

    修復所有的 bug 並解釋原因。

    - ##### 問題出在兩個地方：
      - `handlePlusClick` 直接執行了 `player.score++`。這是一個 `Mutation`，`React` 無法偵測到參考改變，所以畫面上分數沒有更新。當你修改名字欄位時，因爲有呼叫正確的 `setPlayer` 觸發了重新渲染，才連帶把剛才累加的分數順便渲染出來。
      - `handleLastNameChange` 在更新時寫成了 `setPlayer({ lastName: e.target.value })`，漏掉了 `...player` 的其餘欄位展開，導致 `firstName` 和 `score` 屬性直接丟失。

    - ##### 正確的修復程式碼如下：
      ```jsx
      function handlePlusClick() {
        setPlayer({
          ...player,
          score: player.score + 1,
        });
      }

      function handleFirstNameChange(e) {
        setPlayer({
          ...player,
          firstName: e.target.value,
        });
      }

      function handleLastNameChange(e) {
        setPlayer({
          ...player,
          lastName: e.target.value
        });
      }
      ```

  - #### 2. 發現並修復 Mutation
    ```jsx
    import { useState } from 'react';
    import Background from './Background.js';
    import Box from './Box.js';

    const initialPosition = {
      x: 0,
      y: 0
    };

    export default function Canvas() {
      const [shape, setShape] = useState({
        color: 'orange',
        position: initialPosition
      });

      function handleMove(dx, dy) {
        shape.position.x += dx;
        shape.position.y += dy;
      }

      function handleColorChange(e) {
        setShape({
          ...shape,
          color: e.target.value
        });
      }

      return (
        <>
          <select
            value={shape.color}
            onChange={handleColorChange}
          >
            <option value="orange">orange</option>
            <option value="lightpink">lightpink</option>
            <option value="aliceblue">aliceblue</option>
          </select>
          <Background
            position={initialPosition}
          />
          <Box
            color={shape.color}
            position={shape.position}
            onMove={handleMove}
          >
            Drag me!
          </Box>
        </>
      );
    }
    ```

    在畫面上有一可拖動的方形與一個背景。當你先移動了方形，再去修改它的顏色時，背景會突然「跳」到方形所在的位置。這是因為 `shape.position` 和全域的 `initialPosition` 指向了同一個記憶體物件。

    修改 `handleMove`，移除直接修改屬性的 `+=` 突變，改用 `setShape` 搭配物件展開語法：
    ```jsx
    function handleMove(dx, dy) {
      setShape({
        ...shape,
        position: {
          x: shape.position.x + dx,
          y: shape.position.y + dy,
        }
      });
    }
    ```



  - #### 3. 使用 Immer 更新物件
    試著用 `useImmer` 來改寫上述的畫布拖拽範例。

    改用 `useImmer` 後，你可以安全地在 `draft` 上使用直覺的 `+=` 語法：

    ```jsx {1,11-14,17-22,24-26}
    import { useImmer } from 'use-immer';
    import Background from './Background.js';
    import Box from './Box.js';

    const initialPosition = {
      x: 0,
      y: 0
    };

    export default function Canvas() {
      const [shape, updateShape] = useImmer({
        color: 'orange',
        position: initialPosition
      });

      function handleMove(dx, dy) {
        updateShape(draft => {
          draft.position.x += dx;
          draft.position.y += dy;
        });
      }

      function handleColorChange(e) {
        updateShape(draft => {
          draft.color = e.target.value;
        });
      }

      return (
        <>
          <select
            value={shape.color}
            onChange={handleColorChange}
          >
            <option value="orange">orange</option>
            <option value="lightpink">lightpink</option>
            <option value="aliceblue">aliceblue</option>
          </select>
          <Background
            position={initialPosition}
          />
          <Box
            color={shape.color}
            position={shape.position}
            onMove={handleMove}
          >
            Drag me!
          </Box>
        </>
      );
    }
    ```