---
title: '[React官網] React 19.2 教程'
---

# 組建的導入與導出
  組件的導入與導出組件的神奇之處在於它們的可重用性：你可以創建一個由其他組件構成的組件。但當你嵌套了越來越多的組件時，則需要將它們拆分成不同的檔案。這樣可以使得查找檔案更加容易，並且能在更多地方複用這些組件。
  
  :::info 你將學到
  - 何為根組件
  - 如何導入和導出一個組件
  - 何時使用默認和具名導入導出
  - 如何在一個檔案中導入導出多個組件
  - 如何將組件拆分成多個檔案
  :::

## 根組件檔案
  在先前的範例中，所有組件目前都定義在根組件 `App.js` 檔案中。具體還需根據專案配置決定，有些根組件可能會宣告在其他檔案中。如果你使用的框架基於檔案進行路由（如 `Next.js`），那你每個頁面的根組件都會不一樣。

  ```jsx
  // App.js
  function Profile() {
    return (
      <img
        src="https://react.dev/images/docs/scientists/MK3eW3As.jpg"
        alt="Katherine Johnson"
      />
    );
  }

  export default function Gallery() {
    return (
      <section>
        <h1>了不起的科学家们</h1>
        <Profile />
        <Profile />
        <Profile />
      </section>
    );
  }
  ```
  
## 匯出和匯入一個組件
  當專案規模擴大，將組件移出根組件檔案會更加合理。這會使組件更加模組化，並且可在其他檔案中複用。
  
  你可以根據以下三個步驟對組件進行拆分：
  - 創建 一個新的 JS 檔案來存放該組件。
  - `匯出（Export）` 該檔案中的函數組件。
  - 在需要使用該組件的檔案中 `匯入（Import）`。
  - 範例： 將 `Profile` 和 `Gallery` 移至 `Gallery.js` 檔案中，並在 `App.js` 中引入使用：
  
    ```jsx
    // Gallery.js
    function Profile() {
      return (
        <img
          src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg"
          alt="Alan L. Hart"
        />
      );
    }

    export default function Gallery() {
      return (
        <section>
          <h1>了不起的科學家們</h1>
          <Profile />
          <Profile />
          <Profile />
        </section>
      );
    }
    ```

    ```jsx
    // App.js
    import Gallery from './Gallery.js';

    export default function App() {
      return <Gallery />;
    }
    ```

  :::info 默認導出 vs 具名導出
  `JavaScript` 主要使用兩種方式來導出值：`默認導出（Default Export）` 和 `具名導出（Named Export）`。
  - #### 核心規則
    一個檔案裡有且僅有一個默認導出，但是可以有任意多個具名導出。
    
    | 導出語法類型     | 導出語句（Export）                      | 導入語句（Import）                        | 命名限制                        |
    |------------------|---------------------------------------|-----------------------------------------|---------------------------------|
    | `默認 (Default)` | `export default function Button() {}` | `import Button from './Button.js';`     | 導入時可自訂任意名稱（如 Banana） |
    | `具名 (Named)`   | `export function Button() {}`         | `import { Button } from './Button.js';` | 導入和導出的名字必須完全一致    |
    
  - #### 使用時機習慣
    通常，檔案中僅包含一個組件時，會選擇默認導出；當檔案中包含多個組件或多個值需要導出時，則會選擇具名導出。
    
  - #### 團隊建議
    我們不建議創建未命名的組件（例如 `export default () => {}`），因為這會使除錯（`Debugging`）變得異常困難。
  :::

## 從同一檔案中導出和導入多個組件
  同一檔案中不能定義兩個默認導出。如果你想在 `Gallery.js` 中同時導出 `Gallery（預設導出）`與 `Profile`，你必須將 `Profile` 改為具名導出（拿掉 `default` 關鍵字）。
  
  - #### 導出端語法 (Gallery.js)
    ```jsx
    export function Profile() { ... } // 具名導出
    export default function Gallery() { ... } // 默認導出
    ```
  
  - #### 導入端語法 (App.js)
    ```jsx
    import Gallery from './Gallery.js'; // 默認導入
    import { Profile } from './Gallery.js'; // 具名導入（需用大括號）
    ```

## 重點複習（Recap）
  - 瞭解何為根組件。
  - 掌握如何導入和導出一個組件。
  - 明確何時和如何使用默認和具名導入導出。
  - 學習如何在一個檔案裡導出多個組件。
  
  
## 課後挑戰：進一步拆分組件
  - #### 任務目標
    將 `Profile` 組件獨立搬移到 `Profile.js` 檔案中，並讓 `App.js` 同時渲染 `<Profile />` 和 `<Gallery />`。
  
  - #### 解答一：採用「具名導出」風格
    - `Profile.js`
      ```jsx
      export function Profile() {
        return (
          <img 
            src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg" 
            alt="Alan L. Hart" 
          />
        );
      }
      ```

    - `Gallery.js`
      ```jsx
      import { Profile } from './Profile.js';

      export default function Gallery() {
        return (
          <section>
            <Profile />
            <Profile />
            <Profile />
          </section>
        );
      }
      ```

    - `App.js`
      ```jsx
      import Gallery from './Gallery.js';
      import { Profile } from './Profile.js';

      export default function App() {
        return (
          <div>
            <Profile />
            <Gallery />
          </div>
        );
      }
      ```

  - #### 解答二：採用「默認導出」風格
    - `Profile.js`
      ```jsx
      export default function Profile() {
        return (
          <img 
            src="https://react.dev/images/docs/scientists/QIrZWGIs.jpg" 
            alt="Alan L. Hart"
          />
        );
      }
      ```

    - `Gallery.js`
      ```jsx
      import Profile from './Profile.js';

      export default function Gallery() {
        return (
          <section>
            <Profile />
            <Profile />
            <Profile />
          </section>
        );
      }
      ```

    - `App.js`
      ```jsx
      import Gallery from './Gallery.js';
      import Profile from './Profile.js';

      export default function App() {
        return (
          <div>
            <Profile />
            <Gallery />
          </div>
        );
      }
      ```
