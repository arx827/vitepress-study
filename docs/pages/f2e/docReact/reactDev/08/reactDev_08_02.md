---
title: '[React官網] React 19.2 教學文件'
---

# 使用 ref 操作 DOM
  由於 `React` 會自動處理更新 `DOM` 以符合渲染輸出，因此在組件中通常不需要操作 `DOM`。但是，有時可能需要存取由 `React` 管理的 `DOM` 元素 —— 例如，讓某個節點取得焦點、捲動到它，或測量它的尺寸與位置。`React` 中沒有內建的方法來執行這些操作，因此需要一個指向 `DOM` 節點的 `ref` 來實現。

  :::info 你將會學到：
  - 如何使用 `ref` 屬性存取由 `React` 管理的 `DOM` 節點
  - `ref` 這個 `JSX` 屬性如何與 `useRef` Hook 相關聯
  - 如何存取另一個組件的 `DOM` 節點
  - 在哪些情況下修改 `React` 管理的 `DOM` 是安全的
  :::

## 取得指向節點的 ref
  - 要存取由 `React` 管理的 `DOM` 節點，首先引入 `useRef` Hook：
    ```jsx
    import { useRef } from 'react';
    ```

  - 接著，在組件中用它宣告一個 `ref`：
    ```jsx
    const myRef = useRef(null);
    ```

  - 最後，把 `ref` 當作 `ref` 屬性值，傳給想要取得的 `DOM` 節點的 `JSX` 標籤：
    ```jsx
    <div ref={myRef}>
    ```

  - `useRef` Hook 會回傳一個帶有 `current` 屬性的物件。最初，`myRef.current` 是 `null`。當 `React` 為這個 `<div>` 建立一個 `DOM` 節點時，`React` 會把該節點的引用放入 `myRef.current`。之後，就可以從事件處理函式存取這個 `DOM` 節點，並使用其上定義的內建瀏覽器 API：
    ```jsx
    // 可以使用任意瀏覽器 API，例如：
    myRef.current.scrollIntoView();
    ```

  - ### 範例：讓文字輸入框取得焦點
    - 範例中，點擊按鈕會讓輸入框取得焦點。要實現這一點：
      - 使用 `useRef` Hook 宣告 `inputRef`。
      - 像 `<input ref={inputRef}>` 這樣傳遞它，這是在告訴 `React` 把這個 `<input>` 的 `DOM` 節點放入 `inputRef.current`。
      - 在 `handleClick` 函式中，從 `inputRef.current` 讀取 `input DOM` 節點，並使用 `inputRef.current.focus()` 呼叫它的 `focus()`。
      - 用 `onClick` 把 `handleClick` 事件處理函式傳給 `<button>`。

      ```jsx
      import { useRef } from 'react';

      export default function Form() {
        const inputRef = useRef(null);

        function handleClick() {
          inputRef.current.focus();
        }

        return (
          <>
            <input ref={inputRef} />
            <button onClick={handleClick}>
              聚焦輸入框
            </button>
          </>
        );
      }
      ```

    - 雖然 `DOM` 操作是 `ref` 最常見的用途，但 `useRef` Hook 也可以用來儲存 `React` 之外的其他內容，例如 `計時器 ID`。與 `state` 類似，`ref` 能在渲染之間被保留，甚至可以把 `ref` 想成是「設定它們時不會觸發重新渲染」的 `state` 變數！更多相關內容可以在「[使用 ref 引用值](/pages/f2e/docReact/reactDev/08/reactDev_08_01.html)」中閱讀。

  - ### 範例：捲動到某個元素
    - 一個組件中可以有多個 `ref`。範例中有一個由三張圖片與三個按鈕組成的輪播，點擊按鈕會呼叫瀏覽器的 `scrollIntoView()` 方法，讓對應的 `DOM` 節點在視窗中置中顯示。

      ```jsx
      import { useRef } from 'react';

      export default function CatFriends() {
        const firstCatRef = useRef(null);
        const secondCatRef = useRef(null);
        const thirdCatRef = useRef(null);

        function handleScrollToFirstCat() {
          firstCatRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }

        function handleScrollToSecondCat() {
          secondCatRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }

        function handleScrollToThirdCat() {
          thirdCatRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }

        return (
          <>
            <nav>
              <button onClick={handleScrollToFirstCat}>
                Neo
              </button>
              <button onClick={handleScrollToSecondCat}>
                Millie
              </button>
              <button onClick={handleScrollToThirdCat}>
                Bella
              </button>
            </nav>
            <div>
              <ul>
                <li>
                  <img
                    src="https://placecats.com/neo/300/200"
                    alt="Neo"
                    ref={firstCatRef}
                  />
                </li>
                <li>
                  <img
                    src="https://placecats.com/millie/200/200"
                    alt="Millie"
                    ref={secondCatRef}
                  />
                </li>
                <li>
                  <img
                    src="https://placecats.com/bella/199/200"
                    alt="Bella"
                    ref={thirdCatRef}
                  />
                </li>
              </ul>
            </div>
          </>
        );
      }
      ```
  
  :::info 深入探討：如何使用 ref 回呼管理 ref 清單
  - 在上面的範例中，`ref` 的數量是預先確定的。但有時候，可能需要為清單中的每一項各自綁定一個 `ref`，卻不知道會有多少項。像下面這樣做是行不通的：
    ```jsx
    <ul>
      {items.map((item) => {
        // 行不通！
        const ref = useRef(null);
        return <li ref={ref} />;
      })}
    </ul>
    ```

  - 這是因為 `Hook` 只能在組件的最上層被呼叫，不能在迴圈、條件式或 `map()` 函式中呼叫 `useRef`。
  
  - 一種可能的解法，是用一個 `ref` 引用父元素，再用 `querySelectorAll` 這類 `DOM` 操作方法尋找子節點，不過這種做法很脆弱，若 `DOM` 結構改變，可能會失效或出錯。
  
  - 另一種解法是把函式傳給 `ref` 屬性，這稱為 `ref` 回呼。當需要設定 `ref` 時，`React` 會傳入 `DOM` 節點來呼叫 `ref` 回呼；需要清除時則傳入 `null`。這樣就能維護自己的陣列或 `Map`，並透過索引或某種 `ID` 來存取任何一個 `ref`。
  
  - 範例展示了如何用這種方法捲動到長清單中的任意節點：`itemsRef` 保存的不是單一 `DOM` 節點，而是保存了包含清單項目 `ID` 與 `DOM` 節點的 `Map`（`ref` 可以保存任何值！）。每個清單項目上的 `ref` 回呼負責更新這個 `Map`：
  
    ```jsx
    import { useRef, useState } from "react";

    export default function CatFriends() {
      const itemsRef = useRef(null);
      const [catList, setCatList] = useState(setupCatList);

      function scrollToCat(cat) {
        const map = getMap();
        const node = map.get(cat);
        node.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }

      function getMap() {
        if (!itemsRef.current) {
          // 首次運行時初始化 Map。
          itemsRef.current = new Map();
        }
        return itemsRef.current;
      }

      return (
        <>
          <nav>
            <button onClick={() => scrollToCat(catList[0])}>Neo</button>
            <button onClick={() => scrollToCat(catList[5])}>Millie</button>
            <button onClick={() => scrollToCat(catList[8])}>Bella</button>
          </nav>
          <div>
            <ul>
              {catList.map((cat) => (
                <li
                  key={cat.id}
                  ref={(node) => {
                    const map = getMap();
                    map.set(cat, node);

                    return () => {
                      map.delete(cat);
                    };
                  }}
                >
                  <img src={cat.imageUrl} />
                </li>
              ))}
            </ul>
          </div>
        </>
      );
    }

    function setupCatList() {
      const catCount = 10;
      const catList = new Array(catCount)
      for (let i = 0; i < catCount; i++) {
        let imageUrl = '';
        if (i < 5) {
          imageUrl = "https://placecats.com/neo/320/240";
        } else if (i < 8) {
          imageUrl = "https://placecats.com/millie/320/240";
        } else {
          imageUrl = "https://placecats.com/bella/320/240";
        }
        catList[i] = {
          id: i,
          imageUrl,
        };
      }
      return catList;
    }


    ```
  
  - 這樣就能之後從 `Map` 中讀取單一 `DOM` 節點。

    :::info 注意
    啟用嚴格模式後，`ref` 回呼在開發環境中會執行兩次，這有助於在 `ref` 回呼中發現 `bug`。
    :::
  :::

## 存取另一個組件的 DOM 節點
  :::info 注意事項
  `Ref` 是一種脫圍機制。手動操作其他組件的 `DOM` 節點可能會讓程式碼變得脆弱。
  :::

  - 可以像其他 `prop` 一樣，把 `ref` 從父組件傳給子組件：
    ```jsx {3-4,9}
    import { useRef } from 'react';

    function MyInput({ ref }) {
      return <input ref={ref} />;
    }

    function MyForm() {
      const inputRef = useRef(null);
      return <MyInput ref={inputRef} />
    }
    ```

  - 在這個範例中，父組件 `MyForm` 建立了一個名為 `inputRef` 的 `ref`，並把它傳給 `MyInput` 子組件；`MyInput` 再把這個 `ref` 傳給 `<input>`。因為 `<input>` 是一個內建組件，`React` 會把 `ref` 的 `.current` 屬性設定為這個 `<input>` DOM 元素。

  - 在 `MyForm` 中建立的 `inputRef`，現在就指向 `MyInput` 所回傳的 `<input>` DOM 元素。`MyForm` 中的點擊事件處理函式便可以存取 `inputRef`，並呼叫 `focus()` 讓 `<input>` 取得焦點。

    ```jsx {10-12,17}
    import { useRef } from 'react';

    function MyInput({ ref }) {
      return <input ref={ref} />;
    }

    export default function MyForm() {
      const inputRef = useRef(null);

      function handleClick() {
        inputRef.current.focus();
      }

      return (
        <>
          <MyInput ref={inputRef} />
          <button onClick={handleClick}>
            聚焦輸入框
          </button>
        </>
      );
    }
    ```

  :::info 深入探討：用命令式控點暴露一部分 API
  在上面的範例中，`MyInput` 暴露了原始的 `DOM` 元素 `input`，這讓父組件可以對它呼叫 `focus()`，但同時也讓父組件能做其他事情 —— 例如改變它的 `CSS` 樣式。在一些不常見的情況下，可能會想限制暴露的功能，這時可以用 `useImperativeHandle` 來達成。

  ```jsx
  import { useRef, useImperativeHandle } from "react";

  function MyInput({ ref }) {
    const realInputRef = useRef(null);
    useImperativeHandle(ref, () => ({
      // 只暴露 focus，没有别的
      focus() {
        realInputRef.current.focus();
      },
    }));
    return <input ref={realInputRef} />;
  };

  export default function Form() {
    const inputRef = useRef(null);

    function handleClick() {
      inputRef.current.focus();
    }

    return (
      <>
        <MyInput ref={inputRef} />
        <button onClick={handleClick}>聚焦輸入框</button>
      </>
    );
  }
  ```
  
  範例中，`MyInput` 裡的 `realInputRef` 保存了實際的 `input` DOM 節點，但 `useImperativeHandle` 會指示 `React` 把自行指定的物件作為父組件的 `ref` 值。因此 `Form` 組件內的 `inputRef.current` 就只會擁有 `focus` 這個方法。在這種情況下，`ref`「控點」不是 `DOM` 節點，而是在 `useImperativeHandle` 呼叫中建立的自訂物件。
  :::

## React 何時加入 refs
  - 在 `React` 中，每次更新都分為兩個階段：
    - 在渲染階段，`React` 呼叫組件來決定畫面上應該顯示什麼。
    - 在提交階段，`React` 把變更套用到 `DOM`。

  - 通常，不應該在渲染期間存取 `ref`，這也適用於保存 `DOM` 節點的 `ref`。在第一次渲染期間，`DOM` 節點尚未建立，因此 `ref.current` 會是 `null`；在渲染更新的過程中，`DOM` 節點也還沒更新，所以此時讀取它們還太早。

  - `React` 會在提交階段設定 `ref.current`。在更新 `DOM` 之前，`React` 會先把受影響的 `ref.current` 值設為 `null`；更新 `DOM` 之後，會立即把它們設為對應的 `DOM` 節點。

  - 通常會從事件處理函式存取 `refs`。 如果想用 `ref` 執行某些操作，卻沒有特定的事件可以觸發，可能就需要使用 `effect`，這會在下一頁討論。

  :::info 深入探討：用 flushSync 同步更新 state
  - 思考這樣的程式碼：新增一筆待辦事項，並把畫面向下捲動到清單的最後一項。會發現，出於某種原因，它總是捲動到最新加入項目之前的那一項。
  
  ```jsx
  import { useState, useRef } from 'react';

  export default function TodoList() {
    const listRef = useRef(null);
    const [text, setText] = useState('');
    const [todos, setTodos] = useState(
      initialTodos
    );

    function handleAdd() {
      const newTodo = { id: nextId++, text: text };
      setText('');
      setTodos([ ...todos, newTodo]);
      listRef.current.lastChild.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }

    return (
      <>
        <button onClick={handleAdd}>
          添加
        </button>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <ul ref={listRef}>
          {todos.map(todo => (
            <li key={todo.id}>{todo.text}</li>
          ))}
        </ul>
      </>
    );
  }

  let nextId = 0;
  let initialTodos = [];
  for (let i = 0; i < 20; i++) {
    initialTodos.push({
      id: nextId++,
      text: '待辦 #' + (i + 1)
    });
  }
  ```

  - 問題出在這兩行：
    ```jsx
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView();
    ```

  - 在 `React` 中，`state` 更新是排隊進行的。通常這正是所需要的行為，但在此範例中卻造成了問題，因為 `setTodos` 不會立即更新 `DOM`。因此，當捲動清單到最後一個元素時，該待辦事項其實還沒被加入，這就是捲動總是「落後」一項的原因。

  - 要解決這個問題，可以強制 `React` 同步更新（`「刷新」`）`DOM`。做法是從 `react-dom` 匯入 `flushSync`，並把 `state` 更新包裹進 `flushSync` 呼叫中：
    ```jsx {2,6,9}
    // ...
    import { flushSync } from 'react-dom';
    // ...
    function handleAdd() {
      const newTodo = { id: nextId++, text: text };
      flushSync(() => {
        setText('');
        setTodos([ ...todos, newTodo]);
      });
      listRef.current.lastChild.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
    ```

  - 這會指示 `React` 在 `flushSync` 內的程式碼執行完後，立即同步更新 `DOM`。因此，當嘗試捲動到最後一項待辦事項時，它已經存在於 `DOM` 中了。
  :::

## 使用 refs 操作 DOM 的最佳實踐
  - `Refs` 是一種脫圍機制，應該只在必須 `「跳出 React」` 時才使用。常見的例子包括管理焦點、捲動位置，或呼叫 `React` 未暴露的瀏覽器 `API`。

  - 如果只進行像聚焦與捲動這類非破壞性操作，通常不會遇到問題。但如果嘗試手動修改 `DOM`，就可能與 `React` 所做的變更發生衝突。

  - 為了說明這個問題，範例包含一則歡迎訊息與兩個按鈕：第一個按鈕使用 `條件渲染` 與 `state` 來切換顯示或隱藏，就像平常在 `React` 中所做的那樣；第二個按鈕則使用 `remove() DOM` API，把它從 `React` 控制之外的 `DOM` 中強行移除。手動刪除 `DOM` 元素後，若再嘗試用 `setState` 重新顯示它，就會導致程式崩潰。這是因為你更改了 `DOM`，而 `React` 不知道該如何繼續正確管理它。

    ```jsx
    import { useState, useRef } from 'react';

    export default function Counter() {
      const [show, setShow] = useState(true);
      const ref = useRef(null);

      return (
        <div>
          <button
            onClick={() => {
              setShow(!show);
            }}>
            通過 setState 切換
          </button>
          <button
            onClick={() => {
              ref.current.remove();
            }}>
            從 DOM 中刪除
          </button>
          {show && <p ref={ref}>Hello world</p>}
        </div>
      );
    }

    ```

  - 應避免更改由 `React` 管理的 `DOM` 節點。 對 `React` 管理的元素進行修改、新增子元素、或從中移除子元素，可能會導致畫面顯示不一致，或發生類似上述的崩潰。

  - 不過，這不代表完全不能這麼做，只是需要謹慎。可以安全地修改 `React` 沒有理由更新的那部分 `DOM`。 例如，如果某個 `<div>` 在 `JSX` 中永遠是空的，React 就沒有理由去異動它的子節點清單，因此在那裡手動新增或刪除元素是安全的。

## 重點複習（Recap）
  - `Refs` 是一個通用概念，但大多數情況下會用它們來保存 `DOM` 元素。
  - 透過傳入 `<div ref={myRef}>`，可以指示 `React` 把 `DOM` 節點放入 `myRef.current`。
  - 通常會把 `refs` 用於非破壞性操作，例如聚焦、捲動，或測量 `DOM` 元素。
  - 預設情況下，組件不會暴露它的 `DOM` 節點，可以透過使用 `ref` 屬性來暴露 `DOM` 節點。
  - 應避免更改由 `React` 管理的 `DOM` 節點。
  - 如果確實需要修改 `React` 管理的 `DOM` 節點，請只修改 `React` 沒有理由更新的部分。

## 挑戰（Challenges）
  - #### 1. 播放和暫停影片
    範例中，按鈕會切換 `state` 變數，在播放與暫停狀態之間切換。然而，光是切換狀態不足以真正播放或暫停影片，還需要在 `<video>` 的 `DOM` 元素上呼叫 `play()` 和 `pause()`。任務是為它加入一個 `ref`，讓按鈕能正常運作。

    - ##### 原始程式碼
      ```jsx
      import { useState, useRef } from 'react';

      export default function VideoPlayer() {
        const [isPlaying, setIsPlaying] = useState(false);

        function handleClick() {
          const nextIsPlaying = !isPlaying;
          setIsPlaying(nextIsPlaying);
        }

        return (
          <>
            <button onClick={handleClick}>
              {isPlaying ? '暫停' : '播放'}
            </button>
            <video width="250">
              <source
                src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                type="video/mp4"
              />
            </video>
          </>
        )
      }
      ```

    - ##### 解答
      宣告一個 `ref` 並放在 `<video>` 元素上，接著根據下一個 `state`，在事件處理函式中呼叫 `ref.current.play()` 與 `ref.current.pause()`：

      ```jsx
      const ref = useRef(null);

      function handleClick() {
        const nextIsPlaying = !isPlaying;
        setIsPlaying(nextIsPlaying);

        if (nextIsPlaying) {
          ref.current.play();
        } else {
          ref.current.pause();
        }
      }

      // ...
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
      // ...
      ```

      為了處理內建瀏覽器控制項的情況，可以在 `<video>` 元素上加入 `onPlay` 和 `onPause` 事件處理函式，並呼叫 `setIsPlaying`，這樣一來，即使使用者用瀏覽器控制項播放影片，狀態也會相應調整。

  - #### 2. 讓搜尋欄位取得焦點
    任務是讓點擊 `「搜尋」` 按鈕時，搜尋欄位能取得焦點。

    - ##### 原始程式碼
      ```jsx
      export default function Page() {
        return (
          <>
            <nav>
              <button>搜索</button>
            </nav>
            <input
              placeholder="找什麼呢？"
            />
          </>
        );
      }
      ```

    - ##### 解答
      為輸入框加入一個 `ref`，並在 `DOM` 節點上呼叫 `focus()` 讓它取得焦點：
      ```jsx
      import { useRef } from 'react';

      export default function Page() {
        const inputRef = useRef(null);
        return (
          <>
            <nav>
              <button onClick={() => {
                inputRef.current.focus();
              }}>
                搜索
              </button>
            </nav>
            <input
              ref={inputRef}
              placeholder="找什麼呢？"
            />
          </>
        );
      }
      ```

  - #### 3. 捲動圖片輪播
    這個圖片輪播有一個 `「下一個」` 按鈕，可以切換啟用中的圖片。任務是讓點擊時，圖庫能水平捲動到啟用中的圖片，需要在啟用中圖片的 `DOM` 節點上呼叫 `scrollIntoView()`。

    - ##### 原始程式碼
      ```jsx
      import { useState } from 'react';

      export default function CatFriends() {
        const [index, setIndex] = useState(0);
        return (
          <>
            <nav>
              <button onClick={() => {
                if (index < catList.length - 1) {
                  setIndex(index + 1);
                } else {
                  setIndex(0);
                }
              }}>
                下一個
              </button>
            </nav>
            <div>
              <ul>
                {catList.map((cat, i) => (
                  <li key={cat.id}>
                    <img
                      className={
                        index === i ?
                          'active' :
                          ''
                      }
                      src={cat.imageUrl}
                      alt={'猫猫 #' + cat.id}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </>
        );
      }

      const catCount = 10;
      const catList = new Array(catCount);
      for (let i = 0; i < catCount; i++) {
        const bucket = Math.floor(Math.random() * catCount) % 2;
        let imageUrl = '';
        switch (bucket) {
          case 0: {
            imageUrl = "https://placecats.com/neo/250/200";
            break;
          }
          case 1: {
            imageUrl = "https://placecats.com/millie/250/200";
            break;
          }
          case 2:
          default: {
            imageUrl = "https://placecats.com/bella/250/200";
            break;
          }
        }
        catList[i] = {
          id: i,
          imageUrl,
        };
      }
      ```

    - ##### 提示
      這個練習不需要為每張圖片都加上 `ref`，只要為目前啟用中的圖片(或圖片清單本身)設一個 `ref` 就足夠了，並使用 `flushSync` 確保 `DOM` 在捲動之前已經更新。

    - ##### 解答
      - 可以宣告一個 `selectedRef`，再依條件把它傳給目前的圖片：
        ```jsx
        <li ref={index === i ? selectedRef : null}>
        ```
      
      - 當 `index === i` 時，代表這張圖片是被選中的圖片，對應的 `<li>` 就會接收到 `selectedRef`，`React` 會確保 `selectedRef.current` 始終指向正確的 `DOM` 節點。

      - 請注意，為了強制 `React` 在捲動前更新 `DOM`，`flushSync` 呼叫是必要的，否則 `selectedRef.current` 會一直指向先前選取的項目：

      ```jsx
      import { useRef, useState } from 'react';
      import { flushSync } from 'react-dom';

      export default function CatFriends() {
        const selectedRef = useRef(null);
        const [index, setIndex] = useState(0);

        return (
          <>
            <nav>
              <button onClick={() => {
                flushSync(() => {
                  if (index < catList.length - 1) {
                    setIndex(index + 1);
                  } else {
                    setIndex(0);
                  }
                });
                selectedRef.current.scrollIntoView({
                  behavior: 'smooth',
                  block: 'nearest',
                  inline: 'center'
                });
              }}>
                下一步
              </button>
            </nav>
            <div>
              <ul>
                {catList.map((cat, i) => (
                  <li
                    key={cat.id}
                    ref={index === i ?
                      selectedRef :
                      null
                    }
                  >
                    <img
                      className={
                        index === i ?
                          'active'
                          : ''
                      }
                      src={cat.imageUrl}
                      alt={'猫猫 #' + cat.id}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </>
        );
      }

      const catCount = 10;
      const catList = new Array(catCount);
      for (let i = 0; i < catCount; i++) {
        const bucket = Math.floor(Math.random() * catCount) % 2;
        let imageUrl = '';
        switch (bucket) {
          case 0: {
            imageUrl = "https://placecats.com/neo/250/200";
            break;
          }
          case 1: {
            imageUrl = "https://placecats.com/millie/250/200";
            break;
          }
          case 2:
          default: {
            imageUrl = "https://placecats.com/bella/250/200";
            break;
          }
        }
        catList[i] = {
          id: i,
          imageUrl,
        };
      }
      ```

  - #### 4. 讓分開的組件中的搜尋欄位取得焦點
    任務是讓點擊 `「搜尋」` 按鈕時，焦點能移到搜尋欄位上。請注意，每個組件都定義在獨立的檔案中，且不能把它們移出，該如何把它們連接在一起？

    - ##### 原始程式碼
      ```jsx
      // App.js
      import SearchButton from './SearchButton.js';
      import SearchInput from './SearchInput.js';

      export default function Page() {
        return (
          <>
            <nav>
              <SearchButton />
            </nav>
            <SearchInput />
          </>
        );
      }
      ```

      ```jsx
      // SearchButton.js
      export default function SearchButton() {
        return (
          <button>
            搜索
          </button>
        );
      }
      ```

      ```jsx
      // SearchInput.js
      export default function SearchInput() {
        return (
          <input
            placeholder="找什麼呢？"
          />
        );
      }
      ```


    - ##### 提示
      需要使用 `ref` 屬性，主動從自訂的組件(例如 `SearchInput`)中暴露一個 `DOM` 節點。

    - ##### 解答
      - 需要為 `SearchButton` 加入一個 `onClick` 屬性，`SearchButton` 會把它向下傳給原生的 `<button>`;同時也要把一個 `ref` 向下傳給 `<SearchInput>`，`<SearchInput>` 再把這個 `ref` 轉發給真正的 `<input>` 並賦值給它。最後，在點擊事件處理函式中，就能對保存在該 `ref` 中的 `DOM` 節點呼叫 `focus`：
        
        ```jsx {3,7,9}
        // App.js
        export default function Page() {
          const inputRef = useRef(null);
          return (
            <>
              <nav>
                <SearchButton onClick={() => { inputRef.current.focus(); }} />
              </nav>
              <SearchInput ref={inputRef} />
            </>
          );
        }
        ```

        ```jsx
        // SearchButton.js
        function SearchButton({ onClick }) {
          return <button onClick={onClick}>搜尋</button>;
        }
        ```

        ```jsx
        // SearchInput.js
        function SearchInput({ ref }) {
          return <input ref={ref} placeholder="找什麼呢？" />;
        }
        ```