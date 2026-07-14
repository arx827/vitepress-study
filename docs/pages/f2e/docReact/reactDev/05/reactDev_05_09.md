---
title: '[React官網] React 19.2 教學文件'
---

# 將 UI 視為樹
  當 `React` 應用程式逐漸成形時，許多組件會出現嵌套。那麼 `React` 是如何追蹤應用程式組件結構的？
  `React` 以及許多其他 `UI` 函式庫，將 `UI` 建模為樹。
  將應用程式視為樹對於理解組件之間的關係，以及除錯效能和狀態管理等未來將會遇到的概念非常有用。

  :::info 你將學到
  - React 如何看待組件結構
  - 渲染樹是什麼以及它有什麼用途
  - 模組依賴樹是什麼以及它有什麼用途
  :::

## 將 UI 視為樹
  樹是項目和 UI 之間的關係模型，通常使用樹狀結構來表示 `UI`。例如，瀏覽器使用樹狀結構來建模 HTML（[DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)）與 CSS（[CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)）。行動平台也使用樹來表示其視圖階層結構（View Hierarchy）。

  ![reactDev_05_09_01](/pages/f2e/docReact/reactDev/imgs/05/reactDev_05_09_01.webp)
  > `React` 從組件中建立 `UI` 樹。在這個示例中，`UI` 樹最後會用於渲染 `DOM`。

  與瀏覽器和行動平台一樣，`React` 還使用樹狀結構來管理和建模 `React` 應用程式中組件之間的關係。這些樹是有用的工具，用於理解數據如何在 `React` 應用程式中流動，以及如何優化呈現和應用程式大小。

## 渲染樹
  組件的一個主要特性是能夠由其他組件組合而成。在 [嵌套組件](https://zh-hans.react.dev/learn/your-first-component#nesting-and-organizing-components) 中有父組件和子組件的概念，其中每個父組件本身可能是另一個組件的子組件。

  當渲染 `React` 應用程式時，可以在一個稱為渲染樹的樹中建模這種關係。

  下面的 `React` 應用程式渲染了一些鼓舞人心的引言：
  ```jsx
  import FancyText from './FancyText';
  import InspirationGenerator from './InspirationGenerator';
  import Copyright from './Copyright';

  export default function App() {
    return (
      <>
        <FancyText title text="Get Inspired App" />
        <InspirationGenerator>
          <Copyright year={2004} />
        </InspirationGenerator>
      </>
    );
  }
  ```

  ![reactDev_05_09_02](/pages/f2e/docReact/reactDev/imgs/05/reactDev_05_09_02.png)
  > 透過示例應用程式，可以建構出上面的渲染樹。  

  這棵樹由節點組成，每個節點代表一個組件。例如，`App`、`FancyText`、`Copyright` 等都是我們樹中的節點。  

  在 `React` 渲染樹中，根節點是應用程式的 `根組件`。在這種情況下，根組件是 `App`，它是 `React` 渲染的第一個組件。樹中的每個箭頭從父組件指向子組件。

  :::info 那麼渲染樹中的 HTML 標籤在哪裡呢？
  - 也許會注意到在上面的渲染樹中，沒有提到每個組件渲染的 `HTML` 標籤。這是因為渲染樹僅由 `React` 組件 組成。
  - `React` 是跨平台的 `UI` 框架。無論應用程式渲染到哪個平台（Web 瀏覽器、行動裝置或桌面平台），`React` 渲染樹都可以為 `React` 應用程式提供核心架構的洞察。
  :::
  
  渲染樹表示 `React` 應用程式的單個渲染過程。在 [條件渲染](/pages/f2e/docReact/reactDev/05/reactDev_05_06.html) 中，父組件可以根據傳遞的數據渲染不同的子組件。

  我們可以更新應用程式以有條件地渲染勵志語錄或顏色：
  ```jsx
  // InspirationGenerator.js 內部片段
  return (
    <>
      <p>Your inspirational {inspiration.type} is:</p>
      {inspiration.type === 'quote'
      ? <FancyText text={inspiration.value} />
      : <Color value={inspiration.value} />}

      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
  ```

  在這個示例中，根據 `inspiration.type` 的值可能會渲染 `<FancyText>` 或 `<Color>`。每次渲染過程的渲染樹可能都不同。

  儘管渲染樹可能在不同的渲染過程中有所不同，但通常這些樹有助於識別 `React` 應用程式中的`頂層組件（Top-level components）`和`葉子組件（Leaf components）`。
  - `頂層組件`：是離根組件最近的組件，它們影響其下所有組件的渲染效能，通常包含最多複雜性。
  - `葉子組件`：位於樹的底部，沒有子組件，通常會頻繁重新渲染。

  識別這些組件類別有助於理解應用程式的數據流和效能。

## 模組依賴樹
  在 `React` 應用程式中，可以使用樹來建模的另一個關係是應用程式的模組依賴關係。當 [拆分組件](/pages/f2e/docReact/reactDev/05/reactDev_05_02.html) 和邏輯到不同的文件中時，就建立了 `JavaScript 模組`，在這些模組中可以匯出組件、函數或常數。

  模組依賴樹中的每個節點都是一個模組，每個分支代表該模組中的 `import` 關鍵字。

  以之前的 `Inspirations` 應用程式為例，可以建構一個模組依賴樹（簡稱依賴樹）：
  ![reactDev_05_09_03](/pages/f2e/docReact/reactDev/imgs/05/reactDev_05_09_03.png)

  樹的根節點是根模組，也稱為 `進入點（Entry file）`。它通常包含根組件的模組。

  與同一應用程式的渲染樹相比，存在相似的結構，但也有一些顯著的差異：
  - 構成樹的節點代表模組（檔案），而不是組件。
  - 非組件模組，如 `inspirations.js`，在這個樹中也有所體現。渲染樹僅封裝組件。
  - `Copyright.js` 出現在 `App.js` 下，但在渲染樹中，`Copyright` 作為 `InspirationGenerator` 的子組件出現。這是因為 `InspirationGenerator` 接受 `JSX` 作為 `children props`，它只是代為渲染，本身並沒有導入（import）該模組檔案。

  依賴樹對於確定執行 `React` 應用程式所需的模組非常有用。在為生產環境建置（Build）`React` 應用程式時，通常會有一個打包步驟，該步驟將捆綁所有必要的 `JavaScript` 以供客戶端使用。負責此操作的工具稱為 [打包器（Bundler）](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem)，並且打包器將使用依賴樹來確定應包含哪些模組。

  了解應用程式的依賴樹有著極大的實用價值，可以幫助你除錯大型軟體包（Bundle size）帶來的下載與渲染延遲問題。

## 重點複習（Recap）
  - 樹是表示實體之間關係的常見方式，它們經常用於建模 `UI`。
  - 渲染樹表示單次渲染中 `React` 組件之間的嵌套關係。
  - 使用條件渲染，渲染樹可能會在不同的渲染過程中發生變化。使用不同的屬性值，組件可能會渲染不同的子組件。
  - 渲染樹有助於識別頂層組件和葉子組件。頂層組件會影響其下所有組件的渲染效能，而葉子組件通常會頻繁重新渲染。
  - 依賴樹表示 `React` 應用程式中的模組檔案依賴關係（透過 `import` 連結）。
  - `建置工具（Bundler）` 使用依賴樹來捆綁必要的程式碼以部署應用程式，這對於優化檔案體積與讀取速度至關重要。