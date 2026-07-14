---
title: '[React官網] React 19.2 教學文件'
---

# 將 Props 傳遞給組件
  `React` 組件使用 `props` 來互相通信。每個父組件都可以提供 `props` 給它的子組件，從而將一些信息傳遞給它。`Props` 可能會讓你想起 `HTML` 屬性，但你可以通過它們傳遞任何 `JavaScript` 值，包括物件、陣列和函數。

  :::info 你將學到
  - 如何向組件傳遞 `props`
  - 如何從組件讀取 `props`
  - 如何為 `props` 指定默認值
  - 如何給組件傳遞 `JSX`
  - `Props` 如何隨時間變化
  :::

## 熟悉的 props
  `Props` 是你傳遞給 `JSX` 標籤的信息。例如，在標準的 `<img>` 標籤中，`className`、`src`、`alt`、`width` 和 `height` 就是預定義的 `props`。

  ```jsx
  function Avatar() {
    return (
      <img
        className="avatar"
        src="https://react.dev/images/docs/scientists/1bX5QH6.jpg"
        alt="Lin Lanying"
        width={100}
        height={100}
      />
    );
  }
  ```

  而對於你自己定義的組件（例如 `<Avatar>`），你可以傳遞任何自訂的 `props` 來配置它們。

## 向組件傳遞 props
  將 `props` 從父組件傳遞給子組件需要分兩步：

  - ### 步驟 1: 將 props 傳遞給子組件
    在父組件中，像書寫 `HTML` 屬性一樣把資料傳遞給子組件。
    ```jsx
    export default function Profile() {
      return (
        <Avatar
          person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
          size={100}
        />
      );
    }
    ```

  - ### 步驟 2: 在子組件中讀取 props
    在定義子組件函數時，直接在參數列中使用 `花括號 { }` 解構 出對應的屬性名稱，就能像使用普通變數一樣使用它們。
    ```jsx
    function Avatar({ person, size }) {
      // 在這裡可以直接訪問 person 和 size
      return <img src={getImageUrl(person)} width={size} height={size} />;
    }
    ```

    - #### 本質理解
      `Props` 就像是組件上可以調整的「旋鈕」。它們的作用與函數的參數相同，`props` 正是組件的唯一參數！`React` 會將所有的 `props` 結合成一個單一的 `props` 物件傳入組件函數中，通常我們會直接將它解構。

## 給 prop 指定一個默認值
  如果希望在父組件沒有指定某個 `prop` 時給它一個默認值，可以在解構參數時使用 `=` 賦值：
  ```jsx
  function Avatar({ person, size = 100 }) { ... }
  ```

  - #### 生效時機
    只有在缺漏 `size prop`，或是傳遞 `size={undefined}` 時，默認值 `100` 才會生效。如果傳递了 `size={null}` 或 `size={0}`，默認值將不會被使用。

## 使用 JSX 展開語法傳遞 props
  當某個組件只是單純想把所有的 `props` 原封不動地轉發給子組件時，一個個列出屬性會顯得重複冗長。此時可以使用 `JSX` 展開語法（Spread Syntax）：
  ```jsx
  function Profile(props) {
    return (
      <div className="card">
        <Avatar {...props} />
      </div>
    );
  }
  ```

  這會將 `Profile` 收到的所有 `props` 自動轉發給 `Avatar`。

  - #### 使用建議
    請克制地使用展開語法。 如果你在所有地方都使用它，通常意味著你應該拆分組件，並考慮將子組件作為 `children` 傳遞。

## 將 JSX 作為子組件傳遞（children prop）
  當你在 `JSX` 標籤中嵌套內容或組件時：
  ```jsx
  <Card>
    <Avatar />
  </Card>
  ```

  父組件（如 `Card`）將會自動在一個名為 `children` 的特殊 `prop` 中接收到這些嵌套的內容：
  ```jsx
  function Card({ children }) {
    return (
      <div className="card">
        {children} {/* 這裡會渲染出 <Avatar /> */}
      </div>
    );
  }
  ```

  - #### 視覺包裝模式
    你可以將帶有 `children` 的組件想像成一個留有「空洞」的容器，父組件可以用任意的 `JSX` 來填充它。這種模式在設計面板（`Panels`）、網格（`Grids`）等包裝性視覺組件時非常實用。

## Props 如何隨時間變化
  - #### Props 是動態的
    組件會隨著時間推移收到不同的 `props`（例如每秒都在變化的時間資料，或是因應使用者操作而變更的顏色）。

  - #### Props 是不可變的（Immutable）：
    `Props` 反映了組件在某個特定時間點的數據快照。當組件需要改變它的 `props` 時，它不能直接修改自己收到的 `props` 物件，而是必須「請求」父組件傳入一套全新的 `props` 物件。舊的 `props` 將被丟棄並由 `JavaScript` 引擎回收。

## 重點複習（Recap）
  - 要傳遞 `props`，請像使用 HTML 屬性一樣將它們添加到 `JSX` 中。
  - 要讀取 `props`，請使用 `function Avatar({ person, size })` 解構語法。
  - 可以使用 `size = 100` 語法 指定默認值，該值僅在 `prop` 缺失或為 `undefined` 時生效。
  - 可以使用 `<Avatar {...props} />` 語法快速轉發所有 `props`，但切勿過度使用。
  - 嵌套在組件標籤內部的 `JSX` 會被視為該組件的 `children prop`。
  - `Props` 是唯讀的時間快照，每次渲染都會收到新版本的 `props`。你不能直接修改 `props`，如需交互性請設置 `state`。

## 挑戰（Challenges）
  - #### 1. 提取一個組件
    - ##### 目標
      從 `Gallery` 中提取出重複的 `Profile` 結構。

    - ##### 關鍵解答
      可以將每位科學家的資料包裝成 `person` 物件，或是各自拆開成多個 `props`（如 `name`, `imageId`, `profession`, `awards`, `discovery`）傳遞。陣列資料可以直接利用 `awards`.`length` 來計算獎項數量，無需額外傳遞計數 `prop`。

    ```jsx
    import { getImageUrl } from './utils.js';

    function Profile({ person, imageSize = 70 }) {
      const imageSrc = getImageUrl(person)

      return (
        <section className="profile">
          <h2>{person.name}</h2>
          <img
            className="avatar"
            src={imageSrc}
            alt={person.name}
            width={imageSize}
            height={imageSize}
          />
          <ul>
            <li>
              <b>Profession:</b> {person.profession}
            </li>
            <li>
              <b>Awards: {person.awards.length} </b>
              ({person.awards.join(', ')})
            </li>
            <li>
              <b>Discovered: </b>
              {person.discovery}
            </li>
          </ul>
        </section>
      )
    }

    export default function Gallery() {
      return (
        <div>
          <h1>Notable Scientists</h1>
          <Profile person={{
            imageId: 'szV5sdG',
            name: 'Maria Skłodowska-Curie',
            profession: 'physicist and chemist',
            discovery: 'polonium (chemical element)',
            awards: [
              'Nobel Prize in Physics',
              'Nobel Prize in Chemistry',
              'Davy Medal',
              'Matteucci Medal'
            ],
          }} />
          <Profile person={{
            imageId: 'YfeOqp2',
            name: 'Katsuko Saruhashi',
            profession: 'geochemist',
            discovery: 'a method for measuring carbon dioxide in seawater',
            awards: [
              'Miyake Prize for geochemistry',
              'Tanaka Prize'
            ],
          }} />
        </div>
      );
    }
    ```

  - #### 2. 根據 props 調整圖像大小
    - ##### 關鍵解答
      在 `Avatar` 內部加入邏輯，判斷傳入的 `size`。如果 `size < 90`，則將參數 `'s'`（小圖）傳給 `getImageUrl`；否則傳遞 `'b'`（大圖）。這展現了如何將內部渲染的優化邏輯封裝在組件內部。

    ```jsx
    import { getImageUrl } from './utils.js';

    function Avatar({ person, size }) {
      let thumbnailSize = 's';
      if (size > 90) {
        thumbnailSize = 'b';
      }
      return (
        <img
          className="avatar"
          src={getImageUrl(person, thumbnailSize)}
          alt={person.name}
          width={size}
          height={size}
        />
      );
    }

    export default function Profile() {
      return (
        <>
          <Avatar
            size={40}
            person={{
              name: 'Gregorio Y. Zara',
              imageId: '7vQD0fP'
            }}
          />
          <Avatar
            size={120}
            person={{
              name: 'Gregorio Y. Zara',
              imageId: '7vQD0fP'
            }}
          />
        </>
      );
    }

    ```

  - #### 3. 在 children prop 中傳遞 JSX 代碼
    - ##### 關鍵解答
      建立一個 `Card` 組件，宣告並讀取 `{ children }` `prop`：
      ```jsx
      function Card({ children }) {
        return (
          <div className="card">
            <div className="card-content">
              {children}
            </div>
          </div>
        );
      }

      export default function Profile() {
        return (
          <div>
            <Card>
              <h1>Photo</h1>
              <img
                className="avatar"
                src="https://react.dev/images/docs/scientists/OKS67lhm.jpg"
                alt="Aklilu Lemma"
                width={100}
                height={100}
              />
            </Card>
            <Card>
              <h1>About</h1>
              <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
            </Card>
          </div>
        );
      }
      ```
      
      隨後在 `Profile` 中用 `<Card>...</Card>` 將個別的 `<h1>`、`<img>` 或 `<p>` 標籤包裹起來即可。