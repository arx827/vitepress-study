---
title: '[React官網] React 19.2 教學文件'
---

# 使用 Context 深層傳遞參數
  通常來說，你會透過 `props` 把資訊從父組件傳遞到子組件。但是，如果必須透過許多中間組件向下傳遞 `props`，或是應用程式中的許多組件都需要相同的資訊，傳遞 `props` 就會變得十分冗長且不便。`Context` 讓父組件可以向其下層無論多深的任何組件提供資訊，而不需要透過 `props` 明確地傳遞。

  :::info 你將會學到：
  - 什麼是「`prop 逐層透傳`」
  - 如何使用 `context` 取代重複的參數傳遞
  - `Context` 的常見用法
  - `Context` 的常見替代方案
  :::

## 傳遞 props 帶來的問題
  - 傳遞 `props` 是把資料透過 UI 樹明確傳遞到使用它的組件的好方法。

  - 但是當你需要在組件樹中深層傳遞參數，或需要在多個組件間重複使用相同的參數時，傳遞 `props` 就會變得很麻煩。最近的共同祖先組件可能離需要資料的組件很遠，把狀態提升到太高的層級，就會導致「`逐層傳遞 props`」的情況。

  ![reactDev_07_06_01](/pages/f2e/docReact/reactDev/imgs/07/reactDev_07_06_01.png)

  - 如果有一種方法可以在組件樹中不透過 `props` 就把資料「直達」所需的組件，那就太好了。`React` 的 `context` 功能可以滿足這個需求。

## Context：傳遞 props 的另一種方法
  - `Context` 讓父組件可以為它下面的整個組件樹提供資料。舉例來說，思考一下 `Heading` 組件接收一個 `level` 參數來決定標題尺寸的情境：假設你想讓相同 `Section` 中的多個 `Heading` 具有相同的尺寸。

  - 目前你是分別把 `level` 參數傳給每個 `<Heading>`：
    ```jsx
    <Section>
      <Heading level={3}>關於</Heading>
      <Heading level={3}>照片</Heading>
      <Heading level={3}>影片</Heading>
    </Section>
    ```

  - 把 `level` 參數傳給 `<Section>` 組件，而不是傳給 `<Heading>` 組件會更好，這樣就能強制讓同一個 `section` 中的所有標題擁有相同的尺寸：
    ```jsx
    <Section level={3}>
      <Heading>關於</Heading>
      <Heading>照片</Heading>
      <Heading>影片</Heading>
    </Section>
    ```

  - 但問題是：`<Heading>` 組件要如何知道離它最近的 `<Section>` 的 `level` 呢？這需要子組件能以某種方式 `「存取」` 到組件樹中某處在其上層的資料。 單靠 `props` 無法做到這一點，這正是 `context` 派上用場的地方，可以透過以下三個步驟來實作：
    1. 建立一個 `context`（可命名為 `LevelContext`，因為它代表的是標題級別）。
    2. 在需要資料的組件內使用這個剛建立的 `context`（`Heading` 會使用 `LevelContext`）。
    3. 在指定資料的組件中提供這個 `context`（`Section` 會提供 `LevelContext`）。

  - `Context` 能讓父節點，即使是很遠的父節點，也能為其內部的整個組件樹提供資料。

    ![reactDev_07_06_02](/pages/f2e/docReact/reactDev/imgs/07/reactDev_07_06_02.png)

  - ### 步驟 1：建立並導出 Context
    - 在一個獨立的文件（例如 `LevelContext.js`）中建立 `Context`，並設定一個預設值。

      ```jsx
      // LevelContext.js
      import { createContext } from 'react';

      // 建立並導出 Context，預設值為 1
      export const LevelContext = createContext(1);
      ```

    - `createContext` 只需要預設值這一個參數。此例中 `1` 代表最大的標題級別，但你可以傳入任何類型的值（甚至可以傳入一個物件）。預設值的意義會在下一步展現。

  - ### 步驟 2：在子組件中「使用」Context
    - 在需要讀取數據的深層子組件中，引入 `useContext` Hook，以及剛建立的 `context`。
      ```jsx
      // Heading.js
      import { useContext } from 'react';
      import { LevelContext } from './LevelContext.js';
      ```

    - 目前 `Heading` 組件是從 `props` 讀取 `level`：
      ```jsx
      // Heading.js
      export default function Heading({ level, children }) {
        // ...
      }
      ```

    - 移除 `level` 參數，改從剛引入的 `LevelContext` 讀取值：
      ```jsx
      // Heading.js
      export default function Heading({ children }) {
        const level = useContext(LevelContext);
        // ...
      }
      ```

    - `useContext` 是一個 Hook，和 `useState`、`useReducer` 一樣，只能在 `React` 組件中（而非迴圈或條件式內）立即呼叫。`useContext` 是在告訴 `React：Heading` 組件想要讀取 `LevelContext`。

    - 由於 `Heading` 組件不再有 `level` 參數，你不需要再像這樣在 JSX 中把 `level` 傳給 `Heading`，而是改為讓 `Section` 組件接收 `level` 參數：
      ```jsx
      // App.js
      <Section level={4}>
        <Heading>子子標題</Heading>
        <Heading>子子標題</Heading>
        <Heading>子子標題</Heading>
      </Section>
      ```

    - 不過此時範例還不能正常運作：所有標題的尺寸都一樣，因為即使你正在使用 `context`，卻還沒有提供它，`React` 不知道要從哪裡取得這個 `context`！如果沒有提供 `context`，`React` 就會使用上一步指定的預設值 —— 此例中 `createContext` 傳入了 `1`，所以 `useContext(LevelContext)` 會回傳 `1`，把所有標題都設為 `<h1>`。要解決這個問題，需要讓每個 `Section` 提供自己的 `context`。

    ```jsx
    // Heading.js
    import { useContext } from 'react';
    import { LevelContext } from './LevelContext.js';

    export default function Heading({ children }) {
      // 🎯 告訴 React 這個組件想要讀取 LevelContext
      const level = useContext(LevelContext);
      
      switch (level) {
        case 1: return <h1>{children}</h1>;
        case 2: return <h2>{children}</h2>;
        case 3: return <h3>{children}</h3>;
        default: throw Error('未知的 level：' + level);
      }
    }
    ```

  - ### 步驟 3：在父組件中「提供」Context
    - `Section` 組件目前只是渲染傳入它的子組件：
      ```jsx
      export default function Section({ children }) {
        return (
          <section className="section">
            {children}
          </section>
        );
      }
      ```
    
    - 把子組件用 `context provider` (在 `React` 最新版本中可直接使用組件標籤並傳入 `value` 屬性) 包裹起來，以提供 `LevelContext`：
      ```jsx {1,6,8}
      import { LevelContext } from './LevelContext.js';

      export default function Section({ level, children }) {
        return (
          <section className="section">
            <LevelContext value={level}>
              {children}
            </LevelContext>
          </section>
        );
      }
      ```

    - 這是在告訴 `React`：「如果 `<Section>` 內的任何子組件請求 `LevelContext`，就把這個 `level` 給它們。」組件會使用 UI 樹中在它上層最近的那個 `<LevelContext>` 所傳遞的值。

    - 這樣一來，運作結果就與原始程式碼相同，但不再需要把 `level` 參數傳給每個 `Heading` 組件 —— 它會透過存取最近的上層 `Section` 來「判斷」自己的標題級別：
      - 把一個 `level` 參數傳給 `<Section>`。
      - `Section` 把它的子元素包在 `<LevelContext value={level}>` 中。
      - `Heading` 使用 `useContext(LevelContext)` 來存取上層最近的 `LevelContext` 所提供的值。

## 在相同組件中「同時」使用與提供 Context
  - 目前仍需要手動為每個 `section` 指定 `level`：

    ```jsx
    export default function Page() {
      return (
        <Section level={1}>
          ...
          <Section level={2}>
            ...
            <Section level={3}>
              ...
    ```

  - 由於 `context` 讓你能從上層組件讀取資訊，因此可以讓每個 `Section` 從上層的 `Section` 讀取 `level`，並自動向下層傳遞 `level + 1`：

    ```jsx {6,9}
    import { useContext } from 'react';
    import { LevelContext } from './LevelContext.js';

    export default function Section({ children }) {
      // 1. 讀取上一層 Section 的級別（如果沒有，則會得到 createContext 的預設值）
      const level = useContext(LevelContext);
      return (
        <section className="section">
          {/* 2. 將自己這一層的級別加 1，再往下傳遞 */}
          <LevelContext value={level + 1}>
            {children}
          </LevelContext>
        </section>
      );
    }
    ```

  - 這樣修改後，就不需要再把 `level` 參數傳給 `<Section>` 或 `<Heading>` 了。現在 `Heading` 與 `Section` 都是透過讀取 `LevelContext` 來判斷各自的深度，而 `Section` 會把它的子組件包在 `LevelContext` 中，藉此指定其中的任何內容都處於「更深」的一層。

  :::info 注意
  這個範例使用標題級別來說明，因為它能直觀呈現巢狀組件如何覆蓋 `context`。但 `context` 對許多其他情境也很有用，例如可以用它來傳遞整個子樹所需的任何資訊：目前的顏色主題、目前登入的使用者等等。
  :::

## Context 會穿過中間層級的組件
  - 你可以在提供 `context` 的組件與使用它的組件之間的層級中，插入任意數量的組件，包括像 `<div>` 這樣的內建組件，以及你自行建立的組件。

  - 範例中，同一個 `Post` 組件（帶有虛線邊框）在兩個不同的巢狀層級中渲染，其內部的 `<Heading>` 會自動從最近的 `<Section>` 取得它的 `level`，不需要做任何特殊處理：`Section` 會為它內部的樹指定一個 `context`，因此你可以在任何地方插入 `<Heading>`，它都會呈現正確的尺寸。

  - `Context` 讓你可以撰寫 `「能適應周遭環境」` 的組件，並根據所在位置（也就是所處的 `context`）來以不同方式渲染。

  - `Context` 的運作方式，可能會讓你聯想到 `CSS 屬性的繼承`。在 `CSS` 中，你可以為一個 `<div>` 手動指定 `color: blue`，其內部無論多深的任何 `DOM` 節點都會繼承那個顏色，除非中間的其他 `DOM` 節點用 `color: green` 來覆蓋它。類似地，在 `React` 中，唯一能覆蓋上層某個 `context` 的方法，就是把子組件包裹進一個提供不同值的 `context provider` 中。

  - 在 `CSS` 中，像 `color` 和 `background-color` 這類不同的屬性不會互相覆蓋 —— 你可以把所有 `<div>` 的 `color` 設為紅色，而不會影響 `background-color`。類似地，不同的 `React` `context` 不會互相覆蓋：每個透過 `createContext()` 建立的 `context`，都與其他 `context` 完全獨立，只有使用並提供那個特定 `context` 的組件才會彼此關聯。一個組件可以輕鬆地使用或提供許多不同的 `context`。

## 寫在使用 context 之前
  - 使用 `Context` 看起來非常誘人！然而，這也代表它太容易被過度使用了。如果你只是想把一些 `props` 傳遞到多個層級中，並不代表你就需要把這些資訊放進 `context` 裡。

  - 在使用 `context` 之前，可以考慮以下幾種替代方案:
    - 從 `傳遞 props` 開始。 如果組件看起來不起眼，透過十幾個組件向下傳遞一堆 `props` 並不罕見。這感覺有點像是在埋頭苦幹，但這樣做能讓「哪些組件用了哪些資料」變得十分清楚!維護程式碼的人會很高興你用 `props` 讓資料流動變得更清晰。

    - 抽象組件，並把 `JSX` 當作 `children` 傳遞給它們。 如果你透過很多層不會用到該資料、只是單純向下傳遞的中間組件來傳遞資料，這通常意味著你在過程中忘了抽象出組件。舉例來說，你可能會把像 `posts` 這樣的資料 `props` 傳給不會直接用到它的組件，例如 `<Layout posts={posts} />`。取而代之的做法，是讓 `Layout` 把 `children` 當作參數，然後改為渲染 `<Layout><Posts posts={posts} /></Layout>`。這樣能減少定義資料的組件與使用資料的組件之間的層級數。

    - 如果這兩種方法都不適合你，再考慮使用 `context`。

## Context 的使用場景
  - #### 全域主題（Theme）
    如切換深色/淺色模式（Dark/Light Mode）

  - #### 目前登入的帳戶（Current User）
    大範圍的 UI 組件（頭像、評論區、導覽列）直接拿到當前使用者資訊。

  - #### 路由管理（Routing）
    許多 `React` 路由庫內部都使用 `Context` 來追蹤當前 `URL`，並讓每個連結知道自己是否處於啟用狀態（`Active`）。

  - #### 複雜狀態管理（State Management）
    當應用程式擴大時，通常會將 `Reducer` 與 `Context` 搭配使用，把狀態與 `dispatch` 函數一起傳遞給深層組件。

  - `Context` 不僅限於靜態值。如果你在下一次渲染時傳入不同的值，`React` 會更新所有讀取它的下層組件!這也是為什麼 `context` 經常與 `state` 搭配使用的原因。

  - 一般而言，如果樹中不同部分的遠距離組件需要某些資訊，`context` 會對你大有幫助。

## 重點複習（Recap）
  - `Context` 讓組件能向其下方的整個樹提供資訊。
  - 傳遞 `Context` 的方法：
    1. 透過 `export const MyContext = createContext(defaultValue)` 建立並匯出 `context`。
    2. 在無論層級多深的任何子組件中，將 `context` 傳給 `useContext(MyContext)` Hook 來讀取它。
    3. 在父組件中把 `children` 包在 `<MyContext value={...}>` 中來提供 `context`。
  - `Context` 會穿過中間的任何組件。
  - `Context` 能讓你寫出「較為通用」的組件。
  - 在使用 `context` 之前，先試試傳遞 `props`，或把 `JSX` 當作 `children` 傳遞。

## 挑戰（Challenges）
  - #### 1. 用 context 替代逐層 props
    - 範例中，切換核取方塊狀態會修改傳入每個 `<PlaceImage>` 的 `imageSize` 參數。核取方塊的 `state` 保存在頂層的 `App` 組件中，但每個 `<PlaceImage>` 都需要知道它的值。

    - 目前 `App` 把 `imageSize` 傳給 `List`，`List` 再傳給每個 `Place`，`Place` 又傳給 `PlaceImage`。任務是移除 `imageSize` 參數，並在 `App` 組件中直接把它傳給 `PlaceImage`，可以在 `Context.js` 中宣告 `context`。
 
    - ##### 原始程式碼
      ```jsx
      import { useState } from 'react';
      import { places } from './data.js';
      import { getImageUrl } from './utils.js';

      export default function App() {
        const [isLarge, setIsLarge] = useState(false);
        const imageSize = isLarge ? 150 : 100;
        return (
          <>
            <label>
              <input
                type="checkbox"
                checked={isLarge}
                onChange={e => {
                  setIsLarge(e.target.checked);
                }}
              />
              Use large images
            </label>
            <hr />
            <List imageSize={imageSize} />
          </>
        )
      }

      function List({ imageSize }) {
        const listItems = places.map(place =>
          <li key={place.id}>
            <Place
              place={place}
              imageSize={imageSize}
            />
          </li>
        );
        return <ul>{listItems}</ul>;
      }

      function Place({ place, imageSize }) {
        return (
          <>
            <PlaceImage
              place={place}
              imageSize={imageSize}
            />
            <p>
              <b>{place.name}</b>
              {': ' + place.description}
            </p>
          </>
        );
      }

      function PlaceImage({ place, imageSize }) {
        return (
          <img
            src={getImageUrl(place)}
            alt={place.name}
            width={imageSize}
            height={imageSize}
          />
        );
      }
      ```

    - ##### 解答
      - 移除所有組件中的 `imageSize` 參數。在 `Context.js` 中建立並匯出 `ImageSizeContext`：

        ```jsx
        // Context.js
        import { createContext } from 'react';

        export const ImageSizeContext = createContext(500);
        ```

      - 接著用 `<ImageSizeContext value={imageSize}>` 包裹整個列表，向下傳遞值：

        ```jsx
        // App.js
        export default function App() {
          const [isLarge, setIsLarge] = useState(false);
          const imageSize = isLarge ? 150 : 100;
          return (
            <ImageSizeContext value={imageSize}>
              <label>
                <input
                  type="checkbox"
                  checked={isLarge}
                  onChange={e => {
                    setIsLarge(e.target.checked);
                  }}
                />
                使用大尺寸圖片
              </label>
              <hr />
              <List />
            </ImageSizeContext>
          )
        }
        ```

      - 最後在 `PlaceImage` 中使用 `useContext(ImageSizeContext)` 來讀取它：

        ```jsx
        // App.js
        function PlaceImage({ place }) {
          const imageSize = useContext(ImageSizeContext);
          return (
            <img
              src={getImageUrl(place)}
              alt={place.name}
              width={imageSize}
              height={imageSize}
            />
          );
        }
        ```

      - 如此一來，`List` 與 `Place` 這些中間組件就都不需要再傳入 `imageSize` 參數了。