---
title: '[React官網] React 19.2 教程'
---

# 使用 TypeScript
  `TypeScript` 是一種向 `JavaScript` 代碼庫添加類型定義的常用方法。
  `TypeScript` 天然支持 `JSX` —— 只需在項目中添加 [@types/react](https://www.npmjs.com/package/@types/react) 和 [@types/react-dom](https://www.npmjs.com/package/@types/react-dom) 即可獲得完整的 `React Web` 支持。

  :::info 你將學到
  - [在 React 組件中使用 TypeScript](#在-react-組件中使用-typescript)
  - [帶有 Hook 的類型範例](#hooks-範例)
  - [來自 @types/react 的常見類型](#常用類型)
  - [更多學習資源](#更多學習資源)
  :::

## 安裝
  所有的 [生產級 React 框架](/pages/f2e/docReact/reactDev/02/reactDev_02_01.html#全端框架) 都支持使用 `TypeScript`。
  
  請按照框架特定的指南進行安裝：
  - [Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
  - [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
  - [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
  - [Expo](https://docs.expo.dev/guides/typescript/)

  - ### 在現有 React 項目中添加 TypeScript
    使用下面命令安裝最新版本的 `React` 類型定義：
    ```sh
    npm install --save-dev @types/react @types/react-dom
    ```

    然後在 `tsconfig.json` 中設置以下編譯器選項：
    1. 必須在 [lib](https://www.typescriptlang.org/tsconfig/#lib) 中包含 `dom`（注意：如果沒有指定 `lib` 選項，默認情況下會包含 `dom`）。

    2. [jsx](https://www.typescriptlang.org/tsconfig/#jsx) 必須設置為一個有效的選項。對於大多數應用程序，`preserve` 應該足夠了。如果你正在發布一個庫，請查閱 [jsx 文檔](https://www.typescriptlang.org/tsconfig/#jsx) 以選擇合適的值。

## 在 React 組件中使用 TypeScript
  :::info 副檔名限制
  每個包含 JSX 的文件都必須使用 `.tsx` 文件副檔名。這是一個 TypeScript 特定的擴充，告訴 TypeScript 該文件包含 `JSX`。
  :::

  使用 `TypeScript` 編寫 `React` 與使用 `JavaScript` 非常相似。
  與組件一起工作時的關鍵區別是，你可以為組件的 `props` 提供類型。這些類型可用於正確性檢查，並在編輯器中提供內聯文檔。

  - #### 1. 內聯語法（適用於簡單類型）
    這是為組件提供類型的最簡單方法：

    ```tsx
    function MyButton({ title }: { title: string }) {
      return (
        <button>{title}</button>
      );
    }

    export default function MyApp() {
      return (
        <div>
          <h1>Welcome to my app</h1>
          <MyButton title="我是一個按鈕" />
        </div>
      );
    }
    ```

  - #### 2. 使用 Interface 或 Type（適用於多欄位/複雜類型）
    當欄位變多時，建議使用 `interface` 或 `type` 來描述組件的 `props`，這能讓代碼更易於管理：

    ```tsx
    interface MyButtonProps {
      /** 按鈕文字 */
      title: string;
      /** 按鈕是否禁用 */
      disabled: boolean;
    }

    function MyButton({ title, disabled }: MyButtonProps) {
      return (
        <button disabled={disabled}>{title}</button>
      );
    }

    export default function MyApp() {
      return (
        <div>
          <h1>Welcome to my app</h1>
          <MyButton title="我是一個禁用按鈕" disabled={true} />
        </div>
      );
    }
    ```

## Hooks 範例
  來自 `@types/react` 的類型定義包括內置的 `Hook`，通常它們會根據你編寫的代碼自動進行 [類型推斷](https://www.typescriptlang.org/docs/handbook/type-inference.html)，多數情況下不需要手動提供類型細節。
  
  以下是需要手動提供類型時的幾個常見範例：

  - ### `useState`
    一般情況下會透過初始值自動推斷類型：
    ```tsx
    // 自動推斷類型為 "boolean"
    const [enabled, setEnabled] = useState(false);
    ```

    如果需要顯式設置或遇到聯合類型（`Union Types`）時，可以透過泛型參數提供類型：
    ```tsx
    // 顯式設置類型
    const [enabled, setEnabled] = useState<boolean>(false);

    // 聯合類型範例
    type Status = "idle" | "loading" | "success" | "error";
    const [status, setStatus] = useState<Status>("idle");
    ```

  - ### `useReducer`
    更好的做法是在 `initialState` 上以及 `Reducer` 函數的參數與返回值中直接添加類型：
    ```tsx
    import {useReducer} from 'react';

    interface State {
      count: number
    };

    type CounterAction =
      | { type: "reset" }
      | { type: "setCount"; value: State["count"] }

    const initialState: State = { count: 0 };

    function stateReducer(state: State, action: CounterAction): State {
      switch (action.type) {
        case "reset":
          return initialState;
        case "setCount":
          return { ...state, count: action.value };
        default:
          throw new Error("Unknown action");
      }
    }

    export default function App() {
      const [state, dispatch] = useReducer(stateReducer, initialState);

      const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
      const reset = () => dispatch({ type: "reset" });

      return (
        <div>
          <h1>歡迎來到我的計數器</h1>

          <p>計數： {state.count}</p>
          <button onClick={addFive}>加 5</button>
          <button onClick={reset}>重置</button>
        </div>
      );
    }
    ```

  - ### `useContext`
    如果 `context` 擁有合理的默認值，類型會直接從傳給 `createContext` 的初始值中推斷。
    但如果默認值需要設為 `null`，則必須顯式設置 `ContextShape | null`：

    ```tsx
    import { createContext, useContext, useState } from 'react';

    type ComplexObject = { kind: string };
    const Context = createContext<ComplexObject | null>(null);
    ```

    為了避免在消費端頻繁消除 `| null` 的類型判定，建議在自定義 `Hook` 中進行運行時檢查：

    ```tsx
    const useGetComplexObject = () => {
      const object = useContext(Context);
      if (!object) { throw new Error("useGetComplexObject must be used within a Provider") }
      return object; // 此處類型已被收窄為 ComplexObject
    }
    ```

  - ### useMemo 與 useCallback
    :::info 工具提醒
    `React Compiler` 會自動對值和函數進行記憶化處理（`Memoization`），從而減少手動調用 `useMemo` 和 `useCallback` 的需求。
    :::
    
    這兩個 `Hook` 的類型通常是根據回傳值或函數本身自動推斷的。但在 `TypeScript` 嚴格模式下，使用 `useCallback` 時如果回呼函數帶有參數，則需要為參數添加類型註解。你可以利用 `React` 提供的 `*EventHandler` 類型來簡化寫法：

    ```tsx
    const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
      setValue(event.currentTarget.value);
    }, [setValue])
    ```

## 常用類型
  - ### DOM 事件（DOM Events）
    當你在組件內直接編寫內聯事件處理程序時，類型會自動推斷。但如果將函數提取出來單獨定義，就需要明確設置事件類型。
    例如：`React.ChangeEvent<HTMLInputElement>`。
    - 小技巧：如果不確定具體類型，可以先將滑鼠懸停在 `JSX` 的事件屬性（如 `onChange`）上來查看。
    - 基類型：若遇到不包含在常用列表中的特殊事件，可以使用所有事件的基類型 `React.SyntheticEvent`。

  - ### 子元素（Children）
    描述組件子元素有兩種常見方法：

    - `React.ReactNode`：最寬泛的定義，包含所有能在 `JSX` 中傳遞的可能類型（包含 `React` 元素、字串、數字、`Portal`、`null` 等）。
    - `React.ReactElement`：僅包含 `JSX` 元素，不包含字串或數字等 `JavaScript` 原始類型。

    :::info 注意
    你無法使用 `TypeScript` 來限定子元素必須是某種特定標籤（例如限制只接受 `<li>` 子元素）。
    :::

  - ### 樣式屬性（Style Props）
    在 `React` 中使用內聯樣式時，可使用 `React.CSSProperties` 來描述傳遞給 `style` 屬性的對象。它包含了所有合法的 `CSS` 屬性，並能在編輯器中提供代碼補全提示。

## 更多學習資源
  - [TypeScript 官方文檔](https://www.typescriptlang.org/docs/handbook/)：涵蓋了大多數關鍵的語言特性。
  - [TypeScript 發布日誌](https://devblogs.microsoft.com/typescript/)：深入介紹每一個新版本特性。
  - [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)：社群維護的 React + TypeScript 速查表，涵蓋許多實用的邊界情況。
  - [TypeScript Community Discord](https://discord.com/invite/typescript)：提問並獲得有關 TypeScript 和 React 相關問題幫助的好地方。