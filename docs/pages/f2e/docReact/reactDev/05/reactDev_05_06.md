---
title: '[React官網] React 19.2 教學文件'
---

# 條件渲染
  通常你的組件會需要根據不同的情況顯示不同的內容。在 `React` 中，你可以通過使用 `JavaScript` 的 `if` 語句、`&&` 和 `? :` 運算子來選擇性地渲染 `JSX`。

  :::info 你將學到
  - 如何根據不同條件返回不同的 `JSX`
  - 如何根據不同條件包含或者去掉部分 `JSX`
  - 一些你會在 `React` 程式碼庫裡遇到的常用的條件語法快捷表達式
  :::

## 條件返回 JSX
  你可以使用 `JavaScript` 的 `if` 和 `return` 語句來寫分支邏輯。在 `React` 中，是由 `JavaScript` 来處理控制流程的（比如條件判斷）。

  - 示例：基本 `if` 語句分支
    ```jsx
    function Item({ name, isPacked }) {
      if (isPacked) {
        return <li className="item">{name} ✅</li>;
      }
      return <li className="item">{name}</li>;
    }
    ```

    如果 `isPacked` 屬性是 `true`，這段程式碼會返回一個不一樣的 `JSX` 樹。

  - ### 選擇性地返回 `null`（不渲染任何內容）
    在某些情況下，你不想讓組件渲染任何東西。但由於組件必須返回一些內容，這種情況下你可以直接返回 `null`：
    ```tsx
    if (isPacked) {
      return null;
    }
    return <li className="item">{name}</li>;
    ```

    - #### 開發建議
      在組件內部直接返回 `null` 的做法並不常見，因為這會讓想使用它的開發者感到困惑。通常情況下，你更適合在父組件內部決定是否要渲染該子組件。

## 選擇性地包含 JSX
  當多個條件分支返回的 `JSX` 結構有大量重複內容時（例如上面的 `<li className="item">...</li>`），為了避免未來修改 `className` 時需要同步修改多個地方，我們可以利用簡潔的表達式來選擇性地包含一小段 `JSX`，使程式碼更加符合 [DRY 原則](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)。

  - ### 1. 三元運算子（? :）
    `JavaScript` 的條件運算子（三元運算子）可以實現非常緊湊的條件判斷表達式：
    ```jsx
    return (
      <li className="item"> { isPacked ? name + ' ✅' : name } </li>
    );
    ```

    這段程式碼的意思是：「如果 `isPacked` 為 `true`，則渲染 `name + ' ✅'`，否則渲染 `name`。」

    - #### 嵌套複雜結構
      如果需要在條件成立時加入更多 `HTML` 標籤（例如 `<del>` 刪除線），你可以加上圓括號來方便嵌套：
      ```tsx
      {isPacked ? (
        <del>{name + ' ✅'}</del>
      ) : (
        name
      )}
      ```

    - #### 風格建議
      這種風格適用於簡單的條件判斷，但需適量使用。如果組件內部有太多層嵌套的條件表達式，應該考慮將其提取為子組件來簡化結構。

  - ### 2. 邏輯與運算子（&&）
    當你希望當條件成立時渲染某些 `JSX`，否則不做任何渲染時，最常使用 `JavaScript` 的邏輯與（`&&`）運算子：
    ```tsx
    return (
      <li className="item">
        {name} {isPacked && '✅'}
      </li>
    );
    ```

    這段程式碼的意思是：「當 `isPacked` 為真值時，則（`&&`）渲染勾選符號，否則什麼都不渲染。」

    - #### 背後機制
      當 `&&` 左側為 `true` 時，它會返回右側的值（`'✅'`）；當左側為 `false` 時，整個表達式變為 `false`。
      在 `JSX` 裡，`React` 會將 `false`、`null` 或 `undefined` 視為空值，不會進行任何畫面渲染。

  - ### 3. 選擇性地將 JSX 賦值給變數
    當快捷表達式妨礙閱讀或邏輯太複雜時，最靈活的方法是結合 `let` 變數和傳統的 `if` 語句：
    ```tsx
    function Item({ name, isPacked }) {
      let itemContent = name; // 默認值
      if (isPacked) {
        itemContent = <del>{name + " ✅"}</del>; // 條件重寫
      }
      return (
        <li className="item">
          {itemContent} {/* 用大括號嵌入計算好的 JSX */}
        </li>
      );
    }
    ```

    這種方式雖然程式碼最冗長，但它對任意的 `JSX` 均適用，且在處理複雜的多重邏輯時最為彈性。

## 重點複習（Recap）
  - 在 `React` 中，你完全使用純 `JavaScript`（而非特殊的模板語法）來控制分支邏輯。
  - 你可以使用 `if` 語句來選擇性地返回一整棵 `JSX` 樹。
  - 你可以將 `JSX` 賦值給變數，再通過大括號 `{}` 將變數嵌入到其他的 `JSX` 當中。
  - 在 JSX 中，`{cond ? <A /> : <B />}` 意為：「當 `cond` 為真，渲染 `<A />`，否則渲染 `<B />`」。
  - 在 JSX 中，`{cond && <A />}` 意為：「當 `cond` 為真，渲染 `<A />`，否則什麼都不渲染」。

## 挑戰（Challenges）
  - #### 1. 用 `? :` 給未完成的物品加上圖標
    ```jsx
    function Item({ name, isPacked }) {
      return (
        <li className="item">
          {name} {isPacked && '✅'}
        </li>
      );
    }
    ```
    - ##### 目標
      當 `isPacked` 不為 `true` 時渲染 `❌`。

    - ##### 關鍵解答：
      ```jsx
      <li className="item">
        {name} {isPacked ? '✅' : '❌'}
      </li>
      ```

  - #### 2. 用 `&&` 展示物品的重要性
    ```tsx
    function Item({ name, importance }) {
      return (
        <li className="item">
          {name}
        </li>
      );
    }
    ```
    - ##### 目標
      只有當 `importance > 0` 時，才渲染斜體的 （重要性: X），且注意文字間的空格。

    - ##### 關鍵解答
      必須使用 `importance > 0` 作為條件（若直接用 `importance` 在值為 `0` 時會渲染出 `0`）。
      ```tsx
      <li className="item">
        {name}
        {importance > 0 && ' '}
        {importance > 0 && <i>（重要性: {importance}）</i>}
      </li>
      ```

  - #### 3. 用 `if` 和變數重構多餘的 `?` :
    ```tsx
    function Drink({ name }) {
      return (
        <section>
          <h1>{name}</h1>
          <dl>
            <dt>Part of plant</dt>
            <dd>{name === 'tea' ? 'leaf' : 'bean'}</dd>
            <dt>Caffeine content</dt>
            <dd>{name === 'tea' ? '15–70 mg/cup' : '80–185 mg/cup'}</dd>
            <dt>Age</dt>
            <dd>{name === 'tea' ? '4,000+ years' : '1,000+ years'}</dd>
          </dl>
        </section>
      );
    }

    export default function DrinkList() {
      return (
        <div>
          <Drink name="tea" />
          <Drink name="coffee" />
        </div>
      );
    }
    ```

    - ##### 目標
      去掉多個散落的 `name === 'tea' ? ... : ...` 三元運算子。

    - ##### 關鍵解答 (方法 A：用 if 語句賦值給多個變數)：
      ```jsx
      let part, caffeine, age;
      if (name === 'tea') {
        part = 'leaf';
        caffeine = '15–70 mg/cup';
        age = '4,000+ years';
      } else if (name === 'coffee') {
        part = 'bean';
        caffeine = '80–185 mg/cup';
        age = '1,000+ years';
      }
      ```

  - ##### 進階簡化 (方法 B：資料導向，完全消除條件句)：
    直接定義一個對照物件 `drinks = { tea: {...}, coffee: {...} }`，在組件中直接以網頁屬性取值 `const info = drinks[name]`，這讓未來擴充新飲品資料時最為省力。
    ```jsx
    const drinks = {
      tea: {
        part: 'leaf',
        caffeine: '15–70 mg/cup',
        age: '4,000+ years'
      },
      coffee: {
        part: 'bean',
        caffeine: '80–185 mg/cup',
        age: '1,000+ years'
      }
    };
    ```