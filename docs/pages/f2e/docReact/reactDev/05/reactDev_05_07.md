---
title: '[React官網] React 19.2 教程'
---

# 渲染列表
  你可能經常需要通過 `JavaScript` 的陣列方法 來操作陣列中的數據，從而將一個數據集渲染成多個相似的組件。
  在這篇文章中，你將學會如何在 `React` 中使用 [filter()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) 篩選需要渲染的組件和使用 [map()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 把陣列轉換成組件陣列。

  :::info 你將學到
  - 如何通過 JavaScript 的 map() 方法從陣列中生成組件
  - 如何通過 JavaScript 的 filter() 篩選需要渲染的組件
  - 何時以及為何使用 React 中的 key
  :::

## 從陣列中渲染數據
  在面對評論列表、個人資料圖庫等，基於不同數據渲染相似組件的場景時，可以把要用到的數據存入 `JavaScript` 物件或陣列，然後用 `map()` 方法來渲染出一個組件列表。

  範例：由陣列生成一系列列表項
  - 1. 儲存數據 到陣列中：
    ```jsx
    const people = [
      '凱瑟琳·純遜: 數學家',
      '馬里奧·莫利納: 化學家',
      '穆罕默德·阿卜杜勒·薩拉姆: 物理學家',
    ];
    ```

  - 2. 遍歷 陣列中的每一項，並獲得一個新的 `JSX` 節點陣列 `listItems`：
    ```jsx
    const listItems = people.map(person => <li>{person}</li>);
    ```

  - 3. 把 `listItems` 用 `<ul>` 包裹起來並 返回：
    ```jsx
    return <ul>{listItems}</ul>;
    ```

  :::warning ⚠️ 注意
  此時瀏覽器主控台會輸出錯誤警告：
  Warning: Each child in a list should have a unique "key" prop.，我們接下來會學到如何修復它。
  :::

## 對陣列項進行過濾
  如果你的數據結構更加複雜（例如包含 `id`, `name`, `profession` 的物件陣列），而你只想顯示特定條件的資料（例如職業是 `化學家` 的人），可以使用 `JavaScript` 的 `filter()` 方法：

  - 1. 過濾 出符合條件的新陣列：
    ```jsx
    const chemists = people.filter(person =>
      person.profession === '化學家'
    );
    ```

  - 2. 遍歷 該新陣列以生成 `JSX`：
    ```jsx
    const listItems = chemists.map(person =>
      <li>
        <p><b>{person.name}:</b> {person.profession}</p>
      </li>
    );
    ```

## 用 `key` 保持列表項的順序
  為了解決主控台的警告，你必須給陣列中的每一項都指定一個 `key`。它可以是字串或數字的形式，只要能在兄弟節點之間唯一標識出各個陣列項就行：
  ```jsx
  <li key={person.id}>...</li>
  ```

  直接放在 `map()` 方法最外層的 `JSX` 元素一般都需要指定 `key` 值！

  這些 `key` 會告訴 `React` 每個組件對應著陣列裡的哪一項。當陣列項進行移動（例如排序）、插入或刪除等操作時，一個合適的 `key` 可以幫助 `React` 推斷發生了什麼，從而得以正確地更新 `DOM` 樹。
  ```jsx
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          因{person.accomplishment}而闻名世界
      </p>
    </li>
  );
  ```

  - ### 如何設定 `key` 值
    - #### 來自資料庫的數據
      直接使用資料庫資料表中的主鍵（`Primary Key`），它們天然具有唯一性。
    - #### 本地產生的數據
      如果數據在本地產生（如筆記軟體），可以使用自增計數器、[crypto.randomUUID()](https://developer.mozilla.org/zh-CN/docs/Web/API/Crypto/randomUUID) 或 [uuid](https://www.npmjs.com/package/uuid) 庫。

  - ### `key` 需要滿足的條件
    - #### key 值在兄弟節點之间必須是唯一的
      不過不要求全域唯一，在不同的陣列中可以使用相同的 `key`。
    - #### key 值不能改變
      所以千萬不要在渲染時動態地生成 `key`（例如 `key={Math.random()}`）。

  - ### React 中為什麼需要 `key`？
    `React` 裡的 `key` 和文件夾裡的文件需要有檔名是類似的道理。如果元素的位置在渲染或重新排序的過程中發生了改變，穩定的 `key` 值能讓 `React` 在整個生命週期中一直認得它。

    :::info 陷阱
    - #### 不要盲目使用陣列索引（Index）作為 key
      如果你沒有顯式指定，`React` 確實默認會這麼做。但當陣列發生插入、刪除或重新排序時，使用索引作為 `key` 會產生一些微妙且令人困惑的畫面渲染 `bug`。
    - #### 不要動態產生 key
      像是 `key={Math.random()}` 會導致每次重新渲染後的 `key` 值都不一樣，使得所有組件和 `DOM` 每次都要被無故銷毀並重新創建。這不僅會造成效能變慢，更會導致使用者在畫面上輸入的暫存內容遺失。
    - #### 組件不會收到 key 作為 prop
      `Key` 只對 `React` 本身起到提示作用。如果你的組件內部需要用到這個 `ID`，請作為一個單獨的 `prop` 傳入：`<Profile key={id} userId={id} />`。

## 重點複習（Recap）
  - 如何從組件中抽離出數據，並把它們放入陣列或物件等數據結構中。
  - 如何使用 `JavaScript` 的 `map()` 方法來生成一組相似的組件。
  - 如何使用 `JavaScript` 的 `filter()` 方法來篩選陣列。
  - 為何以及如何給集合中的每個組件設置一個唯一且穩定的 `key` 值。


## 挑戰（Challenges）
  - #### 1. 把列表一分為二
    - ##### 目標
      將科學家列表分成「`化學家`」和「`其餘的人`」兩個區塊。
    - ##### 關鍵解答
      可以使用兩次 `filter()` 得到兩個獨立的陣列，再分別進行 `map()`；
      或者為了效能考慮，使用單次 `forEach` 迴圈將資料分流進兩個不同的陣列中，再傳給抽取出的 `<ListSection>` 組件渲染。

      ```jsx
      import { people } from './data.js';
      import { getImageUrl } from './utils.js';

      export default function List() {
        const chemists = people.filter(person =>
          person.profession === '化學家'
        );
        const everyoneElse = people.filter(person =>
          person.profession !== '化學家'
        );
        return (
          <article>
            <h1>科學家</h1>
            <h2>化學家</h2>
            <ul>
              {chemists.map(person =>
                <li key={person.id}>
                  <img
                    src={getImageUrl(person)}
                    alt={person.name}
                  />
                  <p>
                    <b>{person.name}:</b>
                    {' ' + person.profession + ' '}
                    因{person.accomplishment}而聞名世界
                  </p>
                </li>
              )}
            </ul>
            <h2>其餘的人</h2>
            <ul>
              {everyoneElse.map(person =>
                <li key={person.id}>
                  <img
                    src={getImageUrl(person)}
                    alt={person.name}
                  />
                  <p>
                    <b>{person.name}:</b>
                    {' ' + person.profession + ' '}
                    因{person.accomplishment}而聞名世界
                  </p>
                </li>
              )}
            </ul>
          </article>
        );
      }
      ```

  - #### 2. 嵌套列表
    - ##### 目標
      根據菜譜陣列生成列表，菜譜名用 `<h2>`，其原料清單用 `<ul>` 嵌套。
    - ##### 關鍵解答
      需要嵌套兩層 `map`。

      ```tsx
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>{ingredient}</li>
            )}
          </ul>
        </div>
      )}
      ```

    > (註：因為同一份菜譜通常不會重複列出相同原料，此處直接使用原料名稱 `ingredient` 作為內層 `key` 是合理的。)

  - #### 3. 把列表項提取成一個組件
    - ##### 目標
      把上述外層 `map` 裡內容提取出 `<Recipe>` 組件，並探討外層 `key` 該放哪裡。

    - ##### 關鍵解答
      `key` 必須寫在最就近的陣列上下文中。當你重構成 `<Recipe>` 的陣列時，`key` 應該寫在組件標籤上，而不是寫在組件內部的 `<div>` 上。

      ```jsx
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
      ```

  - #### 4. 帶有分隔符的列表
    - ##### 目標
      在詩句的段落之間插入分隔符 `<hr />`，但開頭和結尾不要有。

    - ##### 關鍵解答
      此處不能直接用 `lines.map` 搭配索引，因為陣列會同時包含 `<p>` 和 `<hr />`。

      - ###### 方法 A
        使用 `forEach` 手動將元素 `push` 進一個新陣列，最後用 `.shift()` 把第一個多出來的 `<hr />` 移除，並利用 `key={i + '-text'}` 等後綴確保 `key` 唯一。

        ```jsx
        const poem = {
          lines: [
            'I write, erase, rewrite',
            'Erase again, and then',
            'A poppy blooms.'
          ]
        };

        export default function Poem() {
          let output = [];

          // 填充輸出的陣列
          poem.lines.forEach((line, i) => {
            output.push(
              <hr key={i + '-separator'} />
            );
            output.push(
              <p key={i + '-text'}>
                {line}
              </p>
            );
          });
          // 移除第一個 <hr />
          output.shift();

          return (
            <article>
              {output}
            </article>
          );
        }
        ```

      - ###### 方法 B
        使用 `<Fragment key={i}>` 包裹，並在內部利用條件判斷式明確決定何時渲染分隔符：
        ```jsx
        {poem.lines.map((line, i) =>
          <Fragment key={i}>
            {i > 0 && <hr />}
            <p>{line}</p>
          </Fragment>
        )}
        ```