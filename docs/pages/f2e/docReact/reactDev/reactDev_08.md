---
title: '[React官網] React 19.2 教程'
outline: 2
---

# 脫圍機制（Escape Hatches）

有些組件可能需要控制和同步 `React` 之外的系統。例如，你可能需要使用瀏覽器 `API` 聚焦輸入框，或者在沒有 `React` 的情況下實現影片播放器，或者連接並監聽遠端伺服器的消息。在本章中，你將學習到一些脫圍機制，讓你可以“走出” `React` 並連接到外部系統。大多數應用邏輯和數據流不應該依賴這些功能。

  :::info 你將學到
  - [在不重新渲染的情況下“記住”資訊](/pages/f2e/docReact/reactDev/08/reactDev_08_01.html)
  - [訪問 React 管理的 DOM 元素](/pages/f2e/docReact/reactDev/08/reactDev_08_02.html)
  - [將組件與外部系統同步](/pages/f2e/docReact/reactDev/08/reactDev_08_03.html)
  - [從組件中刪除不必要的 Effect](/pages/f2e/docReact/reactDev/08/reactDev_08_04.html)
  - [Effect 的生命週期與組件的生命週期有何不同](/pages/f2e/docReact/reactDev/08/reactDev_08_05.html)
  - [防止某些值重新觸發 Effect](/pages/f2e/docReact/reactDev/08/reactDev_08_06.html)
  - [減少 Effect 重新執行的頻率](/pages/f2e/docReact/reactDev/08/reactDev_08_07.html)
  - [在組件之間共享邏輯](/pages/f2e/docReact/reactDev/08/reactDev_08_08.html)
  :::

## 使用 ref 引用值
  - 當你希望組件 `“記住”` 某些資訊，但又不想讓這些資訊觸發新的渲染時，可以使用 `ref`。例如：

    ```jsx
    const ref = useRef(0);
    ```

  - #### 與 state 的異同
    - `ref` 與 `state` 一樣，在重新渲染之間都會由 `React` 保留。
    - 但是，設定 `state` 會重新渲染組件，而變更 `ref` 則不會。

  - #### 訪問方式
    透過 `ref.current` 屬性可以訪問該 `ref` 的當前值。

  - #### 應用場景
    `ref` 就像組件一個不被 `React` 追蹤的秘密口袋。可用於存儲 `timeout ID`、`DOM 元素` 和其他不影響組件渲染輸出（UI）的物件。

## 使用 ref 操作 DOM
  - 由於 `React` 會自動更新 `DOM` 以匹配渲染輸出，因此組件通常不需要操作 `DOM`。但有時需要訪問由 `React` 管理的 `DOM` 元素（例如：聚焦節點、捲動到此節點、測量其尺寸和位置）。

  - #### 實現方式
    `React` 沒有內置方法來執行此類操作，因此需要一個指向 `DOM` 節點的 `ref`。例如，在 `<input ref={inputRef} />` 綁定後，點擊按鈕時調用 `inputRef.current.focus()` 即可聚焦輸入框。

## 使用 Effect 進行同步
  - 有些組件需要與外部系統同步（例如：根據 `React` 狀態控制非 `React` 組件、設置伺服器連接、在組件出現在螢幕上時發送分析日誌）。

  - #### 與事件處理函數的區別
    事件處理函數只處理特定的用戶交互事件；而 `Effect` 則是在渲染後運行一些代碼。

  - #### 清理函數（Cleanup）
    許多 `Effect` 需要自行 `“清理”`。例如聊天伺服器連接的 `Effect` 應該返回一個 `cleanup` 函數，告訴 `React` 如何斷開連接，以確保沒有內存洩漏。

  - #### 開發環境行為
    在開發環境中，`React` 會立即運行並額外清理一次 `Effect`（印出兩次連接資訊），這是為了確保開發者沒有忘記實現清理功能。

## 你可能不需要 Effect
  - `Effect` 是 `React` 範式中的一種脫圍機制，用於與外部系統同步。如果沒有涉及到外部系統（例如：單純想根據 `props` 或 `state` 的變化來更新另一個 `state`），則不應該使用 `Effect`。移除不必要的 `Effect` 可以讓代碼更容易理解、運行更快且更少出錯。

  - 常見的不必使用 `Effect` 的情況包括：
    - 不必為了渲染而使用 `Effect` 來轉換數據：例如不需要用 `Effect` 監聽 `firstName` 和 `lastName` 來更新 `fullName` 狀態，直接在渲染期間進行計算即可（`const fullName = firstName + ' ' + lastName;`）。
    - 不必使用 `Effect` 來處理用戶事件。

## 響應式 Effect 的生命週期
  - `Effect` 的生命週期不同於組件。組件可以掛載、更新或卸載。但 `Effect` 只能做兩件事：開始同步某些東西，然後停止同步它。

  - #### 重新同步機制
    如果 `Effect` 依賴於隨時間變化的 `props` 和 `state`（這些是響應值），當這些值在重新渲染時發生改變，`Effect` 就會重新同步（例如 `roomId` 改變時，`Effect` 會先斷開舊連接並建立新連接）。

  - #### 檢查工具規則
    `React` 提供了代碼檢查工具，會自動驗證是否正確地將 `Effect` 中讀取的所有響應式值指定在依賴項列表中。

## 將事件從 Effect 中分開
  - #### 問題所在
    `Effect` 中的所有代碼都是響應式的。如果 `Effect` 讀取了多個響應式的值（例如 `roomId` 和 `theme`），當其中任一值改變時 `Effect` 都會重新運行。但有時我們只希望 `Effect` 響應某些值的變化（如 `roomId`），而不希望其他值（如 `theme` 變更）導致 `Effect` 重新連接。

  - #### 解決方案（Effect Event）
    可以將讀取 `theme` 這種不需要觸發重新同步的代碼，從 `Effect` 移到 `Effect Event`（使用 `useEffectEvent`）當中。`Effect Event` 中的代碼不是響應式的，因此更改該值不會導致 `Effect` 重新執行。

## 移除 Effect 依賴
  - 代碼檢查器會驗證 `Effect` 讀取的每一個響應式值是否都包含在依賴列表中，以確保同步。但不必要的依賴關係會導致 `Effect` 運行過於頻繁，甚至產生無限循環。

  - #### 正確的調整方式
    不能直接在依賴列表中強行刪除依賴項。相反地，應該更改周圍的代碼，使該依賴關係變得不必要。

  - #### 範例
    如果 `Effect` 依賴一個在組件內每次渲染都會重新建立的 `options` 物件，這會導致每次輸入都會重新連接。解決方法是將 `options` 物件的建立過程直接移到 `Effect` 內部，這樣 `Effect` 就只需要依賴 `roomId` 字串，從而使物件依賴變得不必要。

  - 依賴列表是 `Effect` 代碼所使用之所有響應值的客觀描述，要改變依賴列表，必須先改變代碼邏輯。

## 使用自定義 Hook 複用邏輯
  - 除了 `React` 內置的 `Hook`（如 `useState`, `useEffect`），開發者可以根據應用需求創建自己的自定義 `Hook`，例如用於獲取數據、記錄用戶是否在線或連接聊天室。

  - #### 封裝與組合
    可以創建自定義 `Hook`（如 `usePointerPosition` 追蹤指針、`useDelayedValue` 讓值滯後），並在組件之間重用它們。

  - #### 長遠優勢
    隨著應用程式規模擴大，藉由重用已編寫好的自定義 `Hook`，或者使用 `React` 社群維護的優秀自定義 `Hook`，開發者手動編寫 `Effect` 的次數將會逐漸減少。