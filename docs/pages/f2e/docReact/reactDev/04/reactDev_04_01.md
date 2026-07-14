---
title: '[React官網] React 19.2 教學文件'
---

# 介紹
  React 編譯器（`React Compiler`）是一個新的建構時工具，它可以自動優化你的 `React` 應用。它支持純 `JavaScript`，並且了解 [React 的規則](https://zh-hans.react.dev/reference/rules)，因此你無需重寫任何代碼即可使用它。

  :::info 你將學到
  - React 編譯器的作用
  - 如何開始使用該編譯器
  - 漸進式採用策略
  - 出現問題時的調試與排查
  - 在你的 React 庫中使用該編譯器
  :::

## React 編譯器有什麼作用？
  `React` 編譯器會在建構時自動優化你的 `React` 應用。通常情況下，即使不進行優化，`React` 的效能也已經足夠快，但有時你需要手動對組件和值進行記憶化（`memoization`）以保持應用的響應速度。這種手動記憶化既繁瑣又容易出錯，並且會增加需要維護的額外代碼。`React` 編譯器為你自動完成這些優化，減輕了你的思維負擔，使你可以專注於功能的開發。

  - ### 在使用 React 編譯器之前
    沒有編譯器的情況下，你需要手動對組件和值進行記憶化以優化重新渲染。例如，使用 `memo` 包裹組件，並手動使用 `useMemo` 與 `useCallback`。

    ```jsx
    import { useMemo, useCallback, memo } from 'react';

    const ExpensiveComponent = memo(function ExpensiveComponent({ data, onClick }) {
      const processedData = useMemo(() => {
        return expensiveProcessing(data);
      }, [data]);

      const handleClick = useCallback((item) => {
        onClick(item.id);
      }, [onClick]);

      return (
        <div>
          {processedData.map(item => (
            <Item key={item.id} onClick={() => handleClick(item)} />
          ))}
        </div>
      );
    });
    ```

    :::info 手動記憶化的隱藏 Bug 範例
    在以往的手動優化中，如果編寫了如下代碼：
    ```jsx
    <Item key={item.id} onClick={() => handleClick(item)} />
    ```

    - 儘管 `handleClick` 被 `useCallback` 包裹，但每次組件渲染時，箭頭函數 `() => handleClick(item)` 都會創建一個新的函數。這意味著 `Item` 總會接收到一個新的 `onClick prop`，從而破壞了手動記憶化的效果。

    - `React` 編譯器無論是否存在這個箭頭函數，都能夠正確地進行優化，確保 `Item` 僅在 `props.onClick` 變化時才重新渲染。
    :::

  - ### 在使用 React 編編譯器之後
    使用 `React` 編譯器，你可以編寫相同的代碼，而無需手動進行記憶化（不用再寫 `useMemo`、`useCallback` 和 `memo`），編譯器會自動應用等效的優化，確保你的應用只在必要時重新渲染。

    :::info 哪些特性構成了 React 團隊的全端架構願景？
    `React` 編譯器的自動記憶化主要專注於 提高更新效能（重新渲染現有組件），因此它聚焦於以下兩種使用場景：
    - `跳過組件的級聯重新渲染`：例如，重新渲染 `<Parent />` 會導致其組件樹中的許多組件重新渲染，即使只有 `<Parent />` 發生了變化。
    - `跳過 React 外部的昂貴計算`：例如，在組件或 `Hook` 中調用處理大數據陣列的函數。

    - ###### 優化重新渲染
      - 在目前的 `React` 實現中，當一個組件的狀態發生變化時，`React` 會重新渲染該組件及其所有子組件，除非使用了手動記憶化優化。

      - `React` 編譯器會自動應用與手動記憶化等效的優化，確保隨著狀態的變化，應用中只有相關的部分會重新渲染（有時被稱為「細粒度響應式」）。它能自動確定組件的返回值是否可以被重用，從而避免重新創建 `JSX` 與不必要的子組件重新渲染。

    - ###### 昂貴的計算也會被記憶化
      - `React` 編譯器還可以自動記憶化在渲染期間使用的昂貴計算（只要該調用發生在組件或 `Hook` 內部）。

      - 注意：如果該函數真的非常昂貴，且會在多個不同的組件中被重複調用，你可能仍需要考慮在 `React` 之外實現其自身的記憶化。因為 `React` 編譯器只對 `React` 組件和 `Hook` 進行記憶化，而不是所有普通函數，且記憶化不會在多個組件之間共享。官方建議在優化前先進行效能分析（`profiling`）以確定計算是否真的那麼昂貴。
    :::

## 我應該嘗試這個編譯器嗎？
  官方鼓勵大家開始使用 `React` 編譯器。雖然目前編譯器仍是 `React` 的可選附加功能，但未來某些功能可能需要編譯器才能完整運行。

  - ### 使用起來安全嗎？
    `React` 編譯器目前已經穩定，並且在生產環境中進行了廣泛測試（例如 `Meta` 等公司已經在生產中使用）。但是否將編譯器部署到你的應用程序生產環境，將取決於你的代碼庫狀況以及你對 `React` 規則 的遵循程度。

## 支持哪些建構工具？
  `React` 編譯器可以在多個建構工具中安裝，例如 `Babel`、`Vite`、`Metro` 和 `Rsbuild`。

  `React` 編譯器主要是圍繞核心編譯器建構的一個輕量級 `Babel` 插件封裝。雖然第一個穩定版本主要是 `Babel` 插件，但官方目前正在與 `swc` 和 `oxc` 團隊合作，以便將來無需再將 `Babel` 添加到建構流程中。

  - `Next.js` 用戶：可以通過使用 `v15.3.1` 或更高版本，來啟用由 `swc` 調用的 `React` 編譯器。

## 關於 useMemo、useCallback 和 React.memo 我應該怎麼做？
  默認情況下，`React` 編譯器會自動處理記憶化，且效果通常與手動編寫的一樣精確，甚至更勝一籌。

  然而，`useMemo` 和 `useCallback` 仍然可以繼續與 `React` 編譯器一起使用，作為一種脫圍機制（`Escape Hatch`）。例如：當記憶化的值被用作 `Effect` 的依賴項，需要精確控制以避免 `Effect` 反覆觸發時。

  - `對於新代碼（增量代碼）`：建議完全依賴編譯器進行記憶化，僅在需要時手動使用 `useMemo`/`useCallback` 進行精確控制。
  - `對於現有代碼`：建議要麼保留現有的手動記憶化（移除它可能會改變編譯輸出），要麼在移除手動記憶化之前進行仔細測試。

## 嘗試 React 编譯器
  本節包含以下引導內容：
  - [安裝](pages/f2e/docReact/reactDev/04/reactDev_04_02.html) - 安裝 React 編譯器並為你的建構工具進行配置
  - [React 版本兼容性](https://zh-hans.react.dev/reference/react-compiler/target) - 支持 React 17、18 和 19
  - [配置](https://zh-hans.react.dev/reference/react-compiler/configuration) - 根據你的特定需求自定義編譯器
  - [漸進式採用](pages/f2e/docReact/reactDev/04/reactDev_04_03.html) - 在現有代碼庫中逐步推廣編譯器的策略
  - [調試與故障排除](pages/f2e/docReact/reactDev/04/reactDev_04_04.html) - 識別並解決使用編譯器時的問題
  - [編譯庫](https://zh-hans.react.dev/reference/react-compiler/compiling-libraries) - 發布已編譯代碼的最佳實踐
  - [API 參考](https://zh-hans.react.dev/reference/react-compiler/configuration) - 所有配置選項的詳細文檔

## 額外的資源
  除了這些文檔外，官方還建議查看 [React 編譯器工作組](https://github.com/reactwg/react-compiler)（React Compiler Working Group） 以獲取有關該編譯器的更多信息和討論。