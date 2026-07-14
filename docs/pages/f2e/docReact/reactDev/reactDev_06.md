---
title: '[React官網] React 19.2 教學文件'
outline: 2
---

# 添加交互
  介面上的控制元件會根據使用者（User）的輸入而更新。例如，點擊按鈕切換輪播圖的展示。在 `React` 中，隨時間變化的數據被稱為 `狀態（state）`。你可以向任何組件添加狀態，並按需進行更新。在本章節中，你將學習如何編寫處理互動的組件，更新它們的狀態，並根據時間變化顯示不同的效果。

  :::info 你將學到
  - [如何處理使用者發起的事件](/pages/f2e/docReact/reactDev/06/reactDev_06_01.html)
  - [如何用狀態使組件“記住”資訊](/pages/f2e/docReact/reactDev/06/reactDev_06_02.html)
  - [React 是如何分兩個階段更新 UI 的](/pages/f2e/docReact/reactDev/06/reactDev_06_03.html)
  - [為什麼狀態在你改變後沒有立即更新](/pages/f2e/docReact/reactDev/06/reactDev_06_04.html)
  - [如何排隊進行多個狀態的更新](/pages/f2e/docReact/reactDev/06/reactDev_06_05.html)
  - [如何更新狀態中的物件](/pages/f2e/docReact/reactDev/06/reactDev_06_06.html)
  - [如何更新狀態中的陣列](/pages/f2e/docReact/reactDev/06/reactDev_06_07.html)
  :::

## 響應事件
  `React` 允許你向 `JSX` 中添加事件處理函數（Event handler）。事件處理函數是你自己的函數，它將在使用者互動時被觸發，如點擊、懸停、焦點在表單輸入框上等等。

  `<button>` 等內建組件只支援內建瀏覽器事件，如 `onClick`。但是，你也可以建立你自己的組件，並給它們的事件處理函數 `props` 指定你喜歡的任何特定於應用的名稱。

  ```jsx
  export default function App() {
    return (
      <Toolbar
        onPlayMovie={() => alert('Playing!')}
        onUploadImage={() => alert('Uploading!')}
      />
    );
  }

  function Toolbar({ onPlayMovie, onUploadImage }) {
    return (
      <div>
        <Button onClick={onPlayMovie}>
          Play Movie
        </Button>
        <Button onClick={onUploadImage}>
          Upload Image
        </Button>
      </div>
    );
  }

  function Button({ onClick, children }) {
    return (
      <button onClick={onClick}>
        {children}
      </button>
    );
  }
  ```

## State: 組件的記憶
  組件通常需要根據互動改變螢幕上的內容。在表單中鍵入更新輸入欄，在輪播圖上點擊“下一個”改變顯示的圖片，點擊“購買”將產品放入購物車。組件需要“記住”一些東西：目前的輸入值、目前的圖片、購物車。在 `React` 中，這種特定於組件的記憶被稱為 `狀態（State）`。

  你可以用 [useState](https://zh-hans.react.dev/reference/react/useState) Hook 為組件添加狀態。`Hook` 是能讓你的組件使用 `React` 功能的特殊函數（狀態是這些功能之一）。`useState` Hook 讓你宣告一個狀態變數。它接收初始狀態並返回一對值：`目前狀態`，以及一個讓你 `更新狀態的設置函數`。

  ```jsx
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  ```

## 渲染和提交
  在你的組件顯示在螢幕上之前，它們必須由 `React` 進行渲染。理解這個過程中的步驟有助於你思考你的程式碼如何執行並解釋其行為。

  想像一下，你的組件是廚房裡的廚師，用食材製作出美味的菜餚。在這個場景中，`React` 是服務生，負責提出顧客的要求，並給顧客上菜。這個請求和服務 `UI` 的過程有三個步驟：

  - 1. 觸發渲染（將食客的訂單送到廚房）
  - 2. 渲染組件（在廚房準備訂單）
  - 3. 提交到 DOM（將訂單送到桌前）

## state 如同一張快照
  與普通 `JavaScript` 變數不同，`React` 狀態的行為更像一個快照。設置它並不改變你已有的狀態變數，而是觸發一次重新渲染。這在一開始可能會讓人感到驚訝！

  ```jsx
  console.log(count);  // 0
  setCount(count + 1); // 請求用 1 重新渲染
  console.log(count);  // 仍然是 0！
  ```

  `React` 這樣工作是为了幫助你避免微妙的 `bug`。例如，如果你按下“發送”按鈕觸發一個帶有五秒延遲 `setTimeout` 的 `alert`，即使你在這五秒內將下拉選單的收件人從 `Alice` 改成 `Bob`，`alert` 跳出來時依然會顯示當時點擊快照下的 `Alice`。

## 把一系列 state 更新加入佇列
  這個組件有問題：點擊“+3”只能增加一次分數。
  ```jsx
  function increment() {
    setScore(score + 1);
  }

  // 即使連續呼叫三次，在同一次點擊事件的快照中 score 都是 0
  increment(); // setScore(0 + 1);
  increment(); // setScore(0 + 1);
  increment(); // setScore(0 + 1);
  ```

  你可以通過在設置狀態時傳遞一個 更新程式（Updater function） 來解决這個問题。將 `setScore(score + 1)` 替換為 `setScore(s => s + 1)`。如果你需要排隊進行多次狀態更新，那麼這非常方便。

  ```jsx
  function increment() {
    setScore(s => s + 1);
  }
  ```

## 更新 state 中的物件
  狀態可以持有任何類型的 `JavaScript` 值，包括物件。但你不應該直接改變你在 `React` 狀態中持有的物件和陣列。相反地，當你想更新一個物件和陣列時，你需要建立一個新的物件（或複製現有的物件），然後用這個副本來更新狀態。

  通常情況下，你會使用 `...` 展開語法來複製你想改變的物件：

  ```jsx
  setPerson({
    ...person, // 複製先前的欄位
    name: e.target.value // 覆蓋特定欄位
  });
  ```

  如果在程式碼中複製巢狀物件感覺乏味，可以使用 [useImmer](https://github.com/immerjs/use-immer) 之類的函式庫來減少重複程式碼，直接像操作一般物件一樣修改 `draft`：

  ```jsx
  import { useImmer } from 'use-immer';

  export default function Form() {
    const [person, updatePerson] = useImmer({
      name: 'Niki de Saint Phalle',
      artwork: {
        title: 'Blue Nana',
        city: 'Hamburg',
        image: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
      }
    });

    function handleNameChange(e) {
      updatePerson(draft => {
        draft.name = e.target.value;
      });
    }

    function handleTitleChange(e) {
      updatePerson(draft => {
        draft.artwork.title = e.target.value;
      });
    }

    function handleCityChange(e) {
      updatePerson(draft => {
        draft.artwork.city = e.target.value;
      });
    }

    function handleImageChange(e) {
      updatePerson(draft => {
        draft.artwork.image = e.target.value;
      });
    }

    return (
      <>
        <label>
          Name:
          <input
            value={person.name}
            onChange={handleNameChange}
          />
        </label>
        <label>
          Title:
          <input
            value={person.artwork.title}
            onChange={handleTitleChange}
          />
        </label>
        <label>
          City:
          <input
            value={person.artwork.city}
            onChange={handleCityChange}
          />
        </label>
        <label>
          Image:
          <input
            value={person.artwork.image}
            onChange={handleImageChange}
          />
        </label>
        <p>
          <i>{person.artwork.title}</i>
          {' by '}
          {person.name}
          <br />
          (located in {person.artwork.city})
        </p>
        <img
          src={person.artwork.image}
          alt={person.artwork.title}
        />
      </>
    );
  }
  ```

## 更新 state 中的陣列
  陣列是另一種可以存在狀態中的可變 `JavaScript` 物件，應將其視為唯讀。就像物件一樣，當你想更新存在狀態中的陣列時，你需要建立一個新陣列（或者複製現有陣列），然後用新陣列來更新狀態。

  記住`非破壞性（Non-mutating）`的方法在 `React` 中非常重要，例如：

  - 使用 `filter()` 和 `slice()` 來刪除或截取陣列。
  - 使用 `map()` 來更新陣列中特定的元素。
  - 使用 `[...list]` 展開語法來新增元素，而非使用会改變原陣列的 `.push()`。

  同樣地，你也可以使用 [useImmer](https://github.com/immerjs/use-immer) 簡化陣列的直接指派與操作。

  ```jsx
  import { useState } from 'react';
  import { useImmer } from 'use-immer';

  const initialList = [
    { id: 0, title: 'Big Bellies', seen: false },
    { id: 1, title: 'Lunar Landscape', seen: false },
    { id: 2, title: 'Terracotta Army', seen: true },
  ];

  export default function BucketList() {
    const [list, updateList] = useImmer(initialList);

    function handleToggle(artworkId, nextSeen) {
      updateList(draft => {
        const artwork = draft.find(a =>
          a.id === artworkId
        );
        artwork.seen = nextSeen;
      });
    }

    return (
      <>
        <h1>Art Bucket List</h1>
        <h2>My list of art to see:</h2>
        <ItemList
          artworks={list}
          onToggle={handleToggle} />
      </>
    );
  }

  function ItemList({ artworks, onToggle }) {
    return (
      <ul>
        {artworks.map(artwork => (
          <li key={artwork.id}>
            <label>
              <input
                type="checkbox"
                checked={artwork.seen}
                onChange={e => {
                  onToggle(
                    artwork.id,
                    e.target.checked
                  );
                }}
              />
              {artwork.title}
            </label>
          </li>
        ))}
      </ul>
    );
  }
  ```