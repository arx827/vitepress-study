---
title: '[React官網] React 19.2 教程'
---

# 響應事件
  使用 `React` 可以在 `JSX` 中添加 `事件處理函數（Event handler）`。其中事件處理函數為自訂函數，它將在響應互動（如點擊、懸停、表單輸入框獲得焦點等）時觸發。
  
  :::info 你將學到
  - 編寫事件處理函數的不同方法
  - 如何從父組件傳遞事件處理邏輯
  - 事件如何傳播以及如何停止它們
  :::
  
## 添加事件處理函數
  如需添加一個事件處理函數，你需要先定義一個函數，然後 [將其作為 prop 傳入](/pages/f2e/docReact/reactDev/05/reactDev_05_05.html) 合適的 `JSX` 標籤。例如，這裡有一個沒綁定任何事件的按鈕：
  
  ```jsx
  export default function Button() {
    return (
      <button>
        未綁定任何事件
      </button>
    );
  }
  ```

  按照如下三個步驟，即可讓它在使用者點擊時顯示訊息：
  1. 在 `Button` 組件 內部 宣告一個名為 `handleClick` 的函數。
  2. 實現函數內部的邏輯（使用 `alert` 來顯示訊息）。
  3. 添加 `onClick={handleClick}` 到 `<button>` JSX 中。
  
  ```jsx
  export default function Button() {
    function handleClick() {
      alert('你點擊了我！');
    }

    return (
      <button onClick={handleClick}>
        點我
      </button>
    );
  }
  ```

  你可以定義 `handleClick` 函數然後將其作為 `prop` 傳入 `<button>`。其中 `handleClick` 是一個 事件處理函數。事件處理函數有如下特點：
  - 通常在你的組件 內部 定義。
  - 名稱以 `handle` 開頭，後跟事件名稱。
  
  :::info 按照慣例
  通常將事件處理函數命名為 `handle`，後接事件名。你會經常看到 `onClick={handleClick}`，`onMouseEnter={handleMouseEnter} `等。
  :::
  
  或者，你也可以在 `JSX` 中定義一個內嵌的事件處理函數：
  ```jsx
  <button onClick={function handleClick() {
    alert('你點擊了我！');
  }}>
  ```

  或者，直接使用更為簡潔的箭頭函數：
  ```jsx
  <button onClick={() => {
    alert('你點擊了我！');
  }}>
  ```

  以上所有方式都是等效的。當函數體較短時，內嵌事件處理函數會很方便。

  :::info 陷阱
  傳遞給事件處理函數的函數應直接傳遞，而非呼叫。例如：
  | 傳遞一個函數（正確）                | 呼叫一個函數（錯誤）                  |
  |----------------------------------|------------------------------------|
  | `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |
  
  - 區別很微妙。在第一個範例中，`handleClick` 函數作為 `onClick` 事件處理函數傳遞。這會讓 `React` 記住它，並且只在使用者點擊按鈕時呼叫你的函數。
  
  - 在第二個範例中，`handleClick()` 中最後的 `()` 會在 `渲染` 過程中 `立即` 觸發函數，即使沒有任何點擊。這是因為位於 `JSX` `{}` 之間的 `JavaScript` 會立即執行。
  
  當你編寫內嵌程式碼時，同樣的陷阱可能會以不同的方式出現：
  | 傳遞一個函數（正確）                       | 呼叫一個函數（錯誤）                 |
  |-----------------------------------------|-----------------------------------|
  | `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |
  
  - 如果按如下方式傳遞內嵌程式碼，並不会在點擊時觸發，而是會在每次組件渲染時觸發：
    ```jsx
    // 這個 alert 在組件渲染時觸發，而不是點擊時觸發！
    <button onClick={alert('你點擊了我！')}>
    ```

  - 如果你想要定義內嵌事件處理函數，請將其包裝在匿名函數中，如下所示：
    ```jsx
    <button onClick={() => alert('你點擊了我！')}>
    ```
    這裡建立了一個稍後呼叫的函數，而不會在每次渲染時執行其內部程式碼。
  
  在這兩種情況下，你都應該傳遞一個函數：
  - `<button onClick={handleClick}>` 傳遞了 `handleClick` 函數。
  - `<button onClick={() => alert('...')}>` 傳遞了 `() => alert('...')` 函數。
  :::

  - ### 在事件處理函數中讀取 props
    由於事件處理函數宣告於組件內部，因此它們可以直接存取組件的 `props`。範例中的按鈕，當點擊時會彈出帶有 `message prop` 的 `alert`：

    ```jsx
    function AlertButton({ message, children }) {
      return (
        <button onClick={() => alert(message)}>
          {children}
        </button>
      );
    }

    export default function Toolbar() {
      return (
        <div>
          <AlertButton message="正在播放！">
            播放電影
          </AlertButton>
          <AlertButton message="正在上傳！">
            上傳圖片
          </AlertButton>
        </div>
      );
    }
    ```

  - ### 將事件處理函數作為 props 傳遞
    通常，我們會在父組件中定義子組件的事件處理函數。比如：置於不同位置的 `Button` 組件，可能最終執行的功能也不同 —— 也許是播放電影，也許是上傳圖片。
  
    為此，將組件從父組件接收的 `prop` 作為事件處理函數傳遞，如下所示：
    ```jsx
    function Button({ onClick, children }) {
      return (
        <button onClick={onClick}>
          {children}
        </button>
      );
    }

    function PlayButton({ movieName }) {
      function handlePlayClick() {
        alert(`正在播放 ${movieName}！`);
      }

      return (
        <Button onClick={handlePlayClick}>
          播放 "{movieName}"
        </Button>
      );
    }

    function UploadButton() {
      return (
        <Button onClick={() => alert('正在上傳！')}>
          上傳圖片
        </Button>
      );
    }

    export default function Toolbar() {
      return (
        <div>
          <PlayButton movieName="魔女宅急便" />
          <UploadButton />
        </div>
      );
    }
    ```

  - ### 命名事件處理函數 prop
    內建組件（`<button>` 和 `<div>`）僅支援 瀏覽器事件名稱，例如 `onClick`。但是，當你建構自己的組件時，你可以按你個人喜好命名事件處理函數的 `prop`。
    
    :::info 按照慣例
    事件處理函數 `props` 應該以 `on` 開頭，後跟一個大寫字母。
    :::
    
    例如，`Button` 組件的 `onClick` prop 本來也可以被命名為 `onSmash`：
    
    ```jsx
    function Button({ onSmash, children }) {
      return (
        <button onClick={onSmash}>
          {children}
        </button>
      );
    }
    ```
    
    當你的組件支援多種互動時，你可以根據不同的應用程式命名事件處理函數 `prop`。根據應用程式特定的互動方式（如 `onPlayMovie`）來命名 `prop` ，可以讓你靈活地更改以後使用它們的方式。
    
    :::info 注意
    確保為事件處理函數使用適當的 `HTML` 標籤。例如，要處理點擊事件，請使用 `<button onClick={handleClick}>` 而不是 `<div onClick={handleClick}>`。使用真正的瀏覽器 `<button>` 能啟用內建的瀏覽器行為，如鍵盤導覽（Tab 鍵切換）。
    :::
  
## 事件傳播
  事件處理函數也將擷取任何來自子組件的事件。通常，我們會說事件會沿著樹向上「冒泡」或「傳播」：它從事件發生的位置開始，然後沿著樹向傳播。
  
  下面這個 `<div>` 包含兩個按鈕。`<div>` 和每個按鈕都有自己的 `onClick` 處理函數。你認為點擊按鈕時會觸發哪些處理函數？
  
  ```jsx
  export default function Toolbar() {
    return (
      <div className="Toolbar" onClick={() => {
        alert('你點擊了 toolbar ！');
      }}>
        <button onClick={() => alert('正在播放！')}>
          播放電影
        </button>
        <button onClick={() => alert('正在上傳！')}>
          上傳圖片
        </button>
      </div>
    );
  }
  ```
  
  如果你點擊任一按鈕，它自身的 `onClick` 將首先執行，然後父級 `<div>` 的 `onClick` 會接著執行。因此會出現兩條訊息。如果你點擊 `toolbar` 本身，將只有父級 `<div>` 的 `onClick` 會執行。
  
  :::info 陷阱
  在 `React` 中所有事件都會傳播，除了 `onScroll`，它僅適用於你附加到的 `JSX` 標籤。
  :::
  
  - ### 阻止傳播
    事件處理函數接收一個 `事件物件` 作为唯一的參數。按照慣例，它通常被稱為 `e`，代表 `"event"（事件）`。你可以使用此物件來讀取有關事件的資訊。
    
    這個事件物件還允許你阻止傳播。如果你想阻止一個事件到達父組件，你需要像下面 `Button` 組件那樣呼叫 `e.stopPropagation()` ：
    
    ```jsx
    function Button({ onClick, children }) {
      return (
        <button onClick={e => {
          e.stopPropagation(); // 阻止事件進一步冒泡
          onClick();
        }}>
          {children}
        </button>
      );
    }
    ```
    
    由於呼叫了 `e.stopPropagation()`，點擊按鈕現在將只顯示一個 `alert`（來自 `<button>`），而並非兩個（分別來自 `<button>` 和父級 toolbar `<div>`）。
    
    :::info 捕獲階段事件
    擷取階段事件極少數情況下，你可能需要擷取子元素上的所有事件，`即便它們阻止了傳播`。例如，你可能想對每次點擊進行數據分析埋點記錄。那麼你可以通過在事件名稱末尾添加 `Capture` 網頁後綴來實現這一點：
    ```jsx
    <div onClickCapture={() => { /* 這會首先執行 */ }}>
      <button onClick={e => e.stopPropagation()} />
    </div>
    ```

    每個事件分三個階段傳播：
    1. 它向下傳播，呼叫所有的 `onClickCapture` 處理函數。
    2. 它執行被點擊元素的 `onClick` 處理函數。
    3. 它向上傳播，呼叫所有的 `onClick` 處理函數。
    :::
  
  - ### 傳遞處理函數作為事件傳播的替代方案
    ```jsx
    function Button({ onClick, children }) {
      return (
        <button onClick={e => {
          e.stopPropagation();
          onClick();
        }}>
          {children}
        </button>
      );
    }
    ```

    你也可以在呼叫父元素 `onClick` 函數之前或之後，向子組件處理函數添加更多程式碼。此模式是事件傳播的另一種 `替代方案` 。它讓子組件處理事件，同時也讓父組件指定一些額外的行為。與自動事件傳播不同，它是顯式呼叫的，能讓你更清楚地追蹤因某個事件觸發而執行的整條程式碼鏈。
  
  - ### 阻止預設行為
    某些瀏覽器事件具有與事件相關聯的預設行為。例如，點擊 `<form>` 表單內部的按鈕會觸發表單提交事件，預設情況下將重新載入整個頁面：
    
    你可以呼叫事件物件中的 `e.preventDefault()` 來阻止這種情況發生：
    ```jsx
    export default function Signup() {
      return (
        <form onSubmit={e => {
          e.preventDefault(); // 阻止表單提交重新整理頁面的瀏覽器預設行為
          alert('提交表單！');
        }}>
          <input />
          <button>發送</button>
        </form>
      );
    }
    ```

    不要混淆 `e.stopPropagation()` 和 `e.preventDefault()`。它們都很有用，但二者並不相關：
    - [e.stopPropagation()](https://www.google.com/search?q=%5Bhttps://developer.mozilla.org/docs/Web/API/Event/stopPropagation%5D(https://developer.mozilla.org/docs/Web/API/Event/stopPropagation)&authuser=1) 阻止觸發綁定在外層標籤上的事件處理函數。
    - [e.preventDefault()](https://www.google.com/search?q=%5Bhttps://developer.mozilla.org/docs/Web/API/Event/preventDefault%5D(https://developer.mozilla.org/docs/Web/API/Event/preventDefault)&authuser=1) 阻止少數事件的預設瀏覽器行為。
    
## 事件處理函數可以包含副作用嗎？
  當然可以！事件處理函數是執行 `副作用（Side effects）` 的最佳位置。
  
  與渲染函數不同，事件處理函數不需要是 `純函數`，因此它是用來 `更改` 某些值的絕佳位置。例如，更改輸入框的值以回應鍵入，或者更改列表以回應按鈕的觸發。但是，為了更改某些資訊，你首先需要某種方式儲存它。在 `React` 中，這是通過 `state（組件的記憶）` 來完成的。
  
## 重點複習（Recap）
  - 你可以通過將函數作為 `prop` 傳遞給元素如 `<button>` 來處理事件。
  - 必須傳遞事件處理函數，而非函數呼叫！ 是 `onClick={handleClick}` ，不是 `onClick={handleClick()}`。
  - 你可以單獨或者內聯（Inline）定義事件處理函數。
  - 事件處理函數在組件內部定義，所以它們可以存取 `props`。
  - 你可以在父組件中定義一個事件處理函數，並將其作為 `prop` 傳遞給子組件。
  - 你可以根據特定於應用程式的名稱定義事件處理函數的 `prop`（通常以 `on` 開頭）。
  - 事件會向上傳播（冒泡）。透過事件的第一個參數呼叫 `e.stopPropagation()` 來防止這種情況。
  - 事件可能具有不需要的瀏覽器預設行為。呼叫 `e.preventDefault()` 來阻止這種情況。
  - 從子組件顯式呼叫事件處理函數 `prop` 是事件傳播的另一種優秀替代方案。
  
## 挑戰（Challenges）
  - #### 1. 修復事件處理函數
    點擊此按鈕理論上應該在黑白主題之間切換頁面背景。然而，當你點擊它時，什麼也沒有發生。請修復它。
    ```jsx
    // 錯誤程式碼片段
    return (
      <button onClick={handleClick()}>
        切換背景
      </button>
    );
    ```

    這是由於 `onClick={handleClick()}` 在渲染過程中 `呼叫` 了函數，而沒有將其進行 `傳遞`。移除 `()` 即可修復問題：
    ```jsx
    return (
      <button onClick={handleClick}>
        切換背景
      </button>
    );
    ```
    
    或者，也可以包裹在另一個箭頭函數內：`<button onClick={() => handleClick()}>`。
    
  - #### 2. 關聯事件並阻止冒泡
    `ColorSwitch` 組件渲染了一個按鈕。它應該改變頁面顏色。將它與從父組件接收的 `onChangeColor` 事件處理函數關聯。另外，點擊按鈕時不應該觸發外層 `div` 的網頁點擊計數器（即不增加「頁面點擊次數」）。

    ```jsx
    // 錯誤程式碼片段
    export default function ColorSwitch({ onChangeColor }) {
      return (
        <button>
          改变颜色
        </button>
      );
    }
    ```
    
    你需要添加事件處理函數，並在其中呼叫 `e.stopPropagation()` 來阻止事件向上傳播，同時執行 `onChangeColor()`：

    ```jsx
    export default function ColorSwitch({ onChangeColor }) {
      return (
        <button onClick={e => {
          e.stopPropagation();
          onChangeColor();
        }}>
          改變顏色
        </button>
      );
    }
    ```