---
title: '[React官網] React 19.2 教學文件'
---

# 更新 state 中的陣列
  陣列是另外一種可以儲存在 `state` 中的 `JavaScript` 物件，它雖然是可變的，但是卻應該被視為不可變。同物件一樣，當您想要更新儲存於 `state` 中的陣列時，您需要建立一個新的陣列（或者建立一份已有陣列的拷貝值），並使用新陣列設定 `state`。
  
  :::info 您將學到
  - 如何新增、刪除或者修改 React `state` 中的陣列中的元素
  - 如何更新陣列內部的物件
  - 如何透過 `Immer` 降低陣列拷貝的重複度
  :::
  
## 在沒有 mutation 的前提下更新陣列
  - 在 `JavaScript` 中，陣列只是另一種物件。同物件一樣，您需要將 React `state` 中的陣列視為唯讀的。這意味著您不應該使用類似於 `arr[0] = 'bird'` 這樣的方式來重新分配陣列中的元素，也不應該使用會直接修改原始陣列的方法，例如 `push()` 和 `pop()`。
  
  - 相反地，每次要更新一個陣列時，您需要把一個新的陣列傳入 `state` 的 `setting` 方法中。為此，您可以透過使用像 `filter()` 和 `map()` 這樣不會直接修改原始值的方法，從原始陣列生成一個新的陣列。然後您就可以將 `state` 設定為這個新生成的陣列。
  
  下面是常見陣列操作的參考表。當您操作 React `state` 中的陣列時，您需要避免使用左欄的方法，而首選右欄的方法：
  
  |         | 避免使用 (會改變原始陣列)        | 推薦使用 (會回傳一個新陣列）              |
  |---------|------------------------------|----------------------------------------|
  | 新增元素 | `push`，`unshift`             | `concat`，`[...arr]` 展開語法（[例子](#向陣列中新增元素)） |
  | 刪除元素 | `pop`，`shift`，`splice`       | `filter`，`slice`（[例子](#從陣列中刪除元素)）           |
  | 替換元素 | `splice`，`arr[i] = ...` 賦值  | `map`（[例子](#替換陣列中的元素)）                        |
  | 排序    | `reverse`，`sort`             | 先將陣列複製一份（[例子](#其他改變陣列的情況)）             |
  
  或者，您可以 [使用 Immer]() ，這樣您便可以使用表格中的所有方法了。
  
  :::info 注意（Pitfall）
  不幸的是，雖然 `slice` 和 `splice` 的名字相似，但作用卻迥然不同：
  - `slice` 讓您可以拷貝陣列或是陣列的一部分。
  - `splice` 會直接修改 原始陣列（插入或者刪除元素）。
  
  在 `React` 中，更多情況下您會使用 `slice`（沒有 `p` ！），因為您不想改變 `state` 中的物件或陣列。更新物件這一章節解釋了什麼是 `mutation`，以及為什麼不推薦在 `state` 裡這樣做。
  :::
  
  - ### 向陣列中新增元素
    - `push()` 會直接修改原始陣列，而您不希望這樣。
    
    - 相反地，您應該建立一個 `新` 陣列，其包含了原始陣列的所有元素 `以及` 一個在末尾的新元素。這可以透過很多種方法實現，最簡單的一種就是使用 `...` 陣列展開語法：
      ```jsx
      setArtists( // 替換 state
        [ // 是透過傳入一個新陣列實現的
          ...artists, // 新陣列包含原陣列的所有元素
          { id: nextId++, name: name } // 並在末尾新增了一個新的元素
        ]
      );
      ```

    - 陣列展開運算子還允許您把新新增的元素放在原始的 `...artists` 之前：
      ```jsx
      setArtists([
        { id: nextId++, name: name },
        ...artists // 將原陣列中的元素放在末尾
      ]);
      ```

    - 這樣一來，展開操作就可以完成 `push()` 和 `unshift()` 的工作，將新元素新增到陣列的末尾和開頭。
    
  - ### 從陣列中刪除元素
    - 從陣列中刪除一個元素最簡單的方法就是將它 `過濾` 出去。換句話說，您需要生成一個不包含該元素的新陣列。這可以透過 `filter` 方法實現，例如：
      ```jsx
      setArtists(
        artists.filter(a => a.id !== artist.id)
      );
      ```

    - 這裡，`artists.filter(s => s.id !== artist.id)` 表示「建立一個新的陣列，該陣列由那些 `ID` 與 `artists.id` 不同的 `artists` 組成」。
    
    - 換句話說，每個 `artist` 的「刪除」按鈕會把 那一個 `artist` 從原始陣列中過濾掉，並使用過濾後的陣列再次進行渲染。
    
    - 注意，`filter` 並不會改變原始陣列。
    
  - ### 轉換陣列
    - 如果您想改變陣列中的某些或全部元素，您可以用 `map()` 建立一個新陣列。您傳入 `map` 的函式決定了要根據每個元素的值或索引（或二者都要）對元素做何處理。
    
    - 在原文範例中，一個陣列記錄了兩個圓形和一個正方形的座標。當點擊按鈕時，僅有兩個圓形會向下移動 `50` 像素（程式碼中為 `+ 50`）。這是透過使用 `map()` 生成一個新陣列實現的。
      ```jsx
      import { useState } from 'react';

      let initialShapes = [
        { id: 0, type: 'circle', x: 50, y: 100 },
        { id: 1, type: 'square', x: 150, y: 100 },
        { id: 2, type: 'circle', x: 250, y: 100 },
      ];

      export default function ShapeEditor() {
        const [shapes, setShapes] = useState(
          initialShapes
        );

        function handleClick() {
          const nextShapes = shapes.map(shape => {
            if (shape.type === 'square') {
              // 不作改变
              return shape;
            } else {
              // 返回一個新的圓形，位置在下方 50px 處
              return {
                ...shape,
                y: shape.y + 50,
              };
            }
          });
          // 使用新的陣列進行重渲染
          setShapes(nextShapes);
        }

        return (
          <>
            <button onClick={handleClick}>
              所有圓形向下移動！
            </button>
            {shapes.map(shape => (
              <div
                key={shape.id}
                style={{
                background: 'purple',
                position: 'absolute',
                left: shape.x,
                top: shape.y,
                borderRadius:
                  shape.type === 'circle'
                    ? '50%' : '',
                width: 20,
                height: 20,
              }} />
            ))}
          </>
        );
      }
      ```
    
    - 其核心邏輯如下：如果形狀是正方形，則不作改變直接回傳。如果是圓形，則回傳一個新的圓形物件，並將其 `y` 座標加上 `50`。最後使用新陣列透過 `setShapes` 進行重新渲染。
    
  - ### 替換陣列中的元素
    - 想要替換陣列中一個或多個元素是非常常見的。類似 `arr[0] = 'bird'` 這樣的賦值語句會直接修改原始陣列，所以在這種情況下，您也應該使用 `map`。
    
    - 要替換一個元素，請使用 `map` 建立一個新陣列。在您的 `map` 回呼（callback）裡，第二個參數是元素的索引。使用索引來判斷最終是回傳原始的元素（即回呼的第一個參數）還是替換成其他值：
      ```jsx
      function handleIncrementClick(index) {
        const nextCounters = counters.map((c, i) => {
          if (i === index) {
            // 遞增被點擊的計數器數值
            return c + 1;
          } else {
            // 其餘部分不發生變化
            return c;
          }
        });
        setCounters(nextCounters);
      }
      ```

  - ### 向陣列中插入元素
    - 有時，您也許想向陣列特定位置插入一個元素，這個位置既不在陣列開頭，也不在末尾。為此，您可以將陣列展開運算子 `...` 和 `slice()` 方法一起使用。`slice()` 方法讓您從陣列中切出「一片」。為了將元素插入陣列，您需要先展開原陣列在插入點之前的切片，然後插入新元素，最後展開原陣列中剩下的部分。

    - 原文範例中，插入按鈕總是會將元素插入到陣列中索引為 `1` 的位置。核心邏輯如下：
      ```jsx
      const insertAt = 1; // 可能是任何索引
      const nextArtists = [
        // 插入點之前的元素：
        ...artists.slice(0, insertAt),
        // 新的元素：
        { id: nextId++, name: name },
        // 插入點之後的元素：
        ...artists.slice(insertAt)
      ];
      setArtists(nextArtists);
      ```

  - ### 其他改變陣列的情況
    - 總會有一些事，是您僅僅依靠展開運算子和 `map()` 或者 `filter()` 等不會直接修改原值的方法所無法做到的。
    例如，您可能想反轉陣列，或是對陣列排序。而 `JavaScript` 中的 `reverse()` 和 `sort()` 方法會改變原陣列，所以您無法直接使用它們。

    - 然而，您可以先拷貝這個陣列，再改變這個拷貝後的值。例如：
      ```jsx
      function handleClick() {
        const nextList = [...list];
        nextList.reverse();
        setList(nextList);
      }
      ```

    - 在這段程式碼中，您先使用 `[...list]` 展開運算子建立了一份陣列的拷貝值。當您有了這個拷貝值後，您就可以使用像 `nextList.reverse()` 或 `nextList.sort()` 這樣直接修改原陣列的方法。您甚至可以透過 `nextList[0] = "something"` 這樣的方式對陣列中的特定元素進行賦值。

    - 然而，即使您拷貝了陣列，您還是不能直接修改其內部的元素。這是因為陣列的拷貝是 `淺拷貝（shallow copy）` —— 新的陣列中依然保留了與原始陣列相同的元素。因此，如果您修改了拷貝陣列內部的某個物件，其實您正在直接修改當前的 `state`。舉個例子，像下面的程式碼就會帶來問題：
      ```jsx
      const nextList = [...list];
      nextList[0].seen = true; // 問題：直接修改了 list[0] 的值
      setList(nextList);
      ```

    - 雖然 `nextList` 和 `list` 是兩個不同的陣列，`nextList[0]` 和 `list[0]` 卻指向了同一個物件。因此，透過改變 `nextList[0].seen`，`list[0].seen` 的值也被改變了。這是一種 `state` 的 `mutation` 操作，您應該避免這麼做！您可以拷貝想要修改的特定元素，而不是直接修改它，來解決這個問題。

## 更新陣列內部的物件
  - 物件並不是 真的 位於陣列 `「內部」`。可能它們在程式碼中看起來像是在陣列「內部」，但其實陣列中的每個物件都是這個陣列「指向」的一個儲存於其它位置的值。這就是當您在處理類似 `list[0]` 這樣的巢狀（nested）欄位時需要格外小心的原因。其他人的藝術品清單可能指向了陣列的同一個元素！

  - 當您更新一個巢狀的 `state` 時，您需要從想要更新的地方建立 `拷貝值`，一直這樣，直到頂層。

  - 問題程式碼範例：
    ```jsx
    const myNextList = [...myList];
    const artwork = myNextList.find(a => a.id === artworkId);
    artwork.seen = nextSeen; // 問題：直接修改了已有的元素
    setMyList(myNextList);
    ```

  - 雖然 `myNextList` 這個陣列是新的，但是其內部的元素本身與原陣列 `myList` 是相同的。因此，修改 `artwork.seen`，其實是在修改原始的 `artwork` 物件。而這個 `artwork` 物件也被 `yourList` 使用，這樣就帶來了兩個清單連動連錯的 `bug`。

  - 您可以使用 `map` 在沒有 `mutation` 的前提下將一個舊的元素替換成更新的版本：

    ```jsx
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // 建立包含變更的*新*物件
        return { ...artwork, seen: nextSeen };
      } else {
        // 沒有變更
        return artwork;
      }
    }));
    ```

    此處的 `...` 是一個物件展開語法，被用來建立一個物件的拷貝。透過這種方式，沒有任何現有的 `state` 中的元素會被改變，`bug` 也就被修復了。

  - 通常來講，您應該只直接修改您剛剛建立的物件。如果您正在插入一個新的 `artwork`，您可以修改它，但是如果您想要改變的是 `state` 中已經存在的東西，您就需要先拷貝一份了。

  - ### 使用 Immer 編寫簡潔的更新邏輯
    在沒有 `mutation` 的前提下更新巢狀陣列可能會變得有點重複：
    - 通常情況下，您應該不需要更新處於非常深層級的 `state`。如果您有此類需求，您或許需要調整一下資料的結構，讓資料變得 `扁平（flat）` 一些。
    - 如果您不想改變 `state` 的資料結構，您也許會更喜歡使用 [Immer](https://github.com/immerjs/use-immer)，它讓您可以繼續使用方便的、但會直接修改原值的語法，並負責為您生成拷貝值。

    - 使用 `Immer`（藉由 `useImmer`）重寫的藝術願望清單更新邏輯如下：

      ```jsx
      const initialList = [
        { id: 0, title: 'Big Bellies', seen: false },
        { id: 1, title: 'Lunar Landscape', seen: false },
        { id: 2, title: 'Terracotta Army', seen: true },
      ];

      const [myList, updateMyList] = useImmer(
        initialList
      );

      function handleToggleMyList(id, nextSeen) {
        updateMyList(draft => {
          const artwork = draft.find(a =>
            a.id === id
          );
          artwork.seen = nextSeen;
        });
      }
      ```

    - 請注意當使用 `Immer` 時，類似 `artwork.seen = nextSeen` 這種會產生 `mutation` 的語法不會再有任何問題了。這是因為您並不是在直接修改原始的 `state`，而是在修改 `Immer` 提供的一個特殊的 `draft` 物件。同理，您也可以為 `draft` 的內容使用 `push()` 和 `pop()` 這些會直接修改原值的方法。

    - 在幕後，`Immer` 總是會根據您對 `draft` 的修改來從頭開始建構下一個 state。這使得您的事件處理常式非常的簡潔，同時決不會直接修改 state。

## 重點複習（Recap）
  - 您可以把陣列放入 `state` 中，但您不應該直接修改它。
  - 不要直接修改陣列，而是建立它的一份 `新的` 拷貝，然後使用新的陣列來更新它的狀態。
  - 您可以使用 `[...arr, newItem]` 這樣的陣列展開語法來向陣列中新增元素。
  - 您可以使用 `filter()` 和 `map()` 來建立一個經過過濾或者變換的陣列。
  - 您可以使用 `Immer` 來保持程式碼簡潔。

## 挑戰（Challenges）
  - #### 1. 更新購物車中的商品
    - 填寫 `handleIncreaseClick` 的邏輯，以便按下「+」時遞增對應數字：
      ```jsx
      import { useState } from 'react';

      const initialProducts = [{
        id: 0,
        name: 'Baklava',
        count: 1,
      }, {
        id: 1,
        name: 'Cheese',
        count: 5,
      }, {
        id: 2,
        name: 'Spaghetti',
        count: 2,
      }];

      export default function ShoppingCart() {
        const [
          products,
          setProducts
        ] = useState(initialProducts)

        function handleIncreaseClick(productId) {

        }

        return (
          <ul>
            {products.map(product => (
              <li key={product.id}>
                {product.name}
                {' '}
                (<b>{product.count}</b>)
                <button onClick={() => {
                  handleIncreaseClick(product.id);
                }}>
                  +
                </button>
              </li>
            ))}
          </ul>
        );
      }
      ```

    - ##### 解答（Solution）
      您可以使用 `map` 函式建立一個新陣列，然後使用 `...` 物件展開語法為新陣列建立一個變更後物件的拷貝值：

      ```jsx
      function handleIncreaseClick(productId) {
        setProducts(products.map(product => {
          if (product.id === productId) {
            return {
              ...product,
              count: product.count + 1
            };
          } else {
            return product;
          }
        }))
      }
      ```

  - #### 2. 刪除購物車中的商品
    - 現在購物車有了一個正常運作的 `「+」` 按鈕，但是 `「-」` 按鈕卻沒有任何作用。您需要為它新增一個事件處理常式，以便按下它時可以減少對應商品的 `count`。如果在數字為 `1` 時按下`「-」`按鈕，商品需要自動從購物車中移除。確保商品計數永遠不出現 `0`。

      ```jsx
      import { useState } from 'react';

      const initialProducts = [{
        id: 0,
        name: 'Baklava',
        count: 1,
      }, {
        id: 1,
        name: 'Cheese',
        count: 5,
      }, {
        id: 2,
        name: 'Spaghetti',
        count: 2,
      }];

      export default function ShoppingCart() {
        const [
          products,
          setProducts
        ] = useState(initialProducts)

        function handleIncreaseClick(productId) {
          setProducts(products.map(product => {
            if (product.id === productId) {
              return {
                ...product,
                count: product.count + 1
              };
            } else {
              return product;
            }
          }))
        }

        return (
          <ul>
            {products.map(product => (
              <li key={product.id}>
                {product.name}
                {' '}
                (<b>{product.count}</b>)
                <button onClick={() => {
                  handleIncreaseClick(product.id);
                }}>
                  +
                </button>
                <button>
                  –
                </button>
              </li>
            ))}
          </ul>
        );
      }
      ```

    - ##### 解答（Solution）
      您可以先使用 `map` 生成一個新陣列，然後使用 `filter` 移除 `count` 被設定為 `0` 的商品：
      ```jsx
      function handleDecreaseClick(productId) {
        let nextProducts = products.map(product => {
          if (product.id === productId) {
            return {
              ...product,
              count: product.count - 1
            };
          } else {
            return product;
          }
        });
        nextProducts = nextProducts.filter(p =>
          p.count > 0
        );
        setProducts(nextProducts)
      }
      ```

  - #### 3. 使用不會直接修改原始值的方法修復 mutation 的問題
    - 在原文範例中，`App.js` 中所有的事件處理常式都會產生 `mutation`。這導致編輯和刪除待辦事項的功能無法正常運作。使用不會直接修改原始值的方法重寫 `handleAddTodo`、`handleChangeTodo` 和 `handleDeleteTodo` 這三個函式：
      
      ```jsx
      import { useState } from 'react';
      import AddTodo from './AddTodo.js';
      import TaskList from './TaskList.js';

      let nextId = 3;
      const initialTodos = [
        { id: 0, title: 'Buy milk', done: true },
        { id: 1, title: 'Eat tacos', done: false },
        { id: 2, title: 'Brew tea', done: false },
      ];

      export default function TaskApp() {
        const [todos, setTodos] = useState(
          initialTodos
        );

        function handleAddTodo(title) {
          todos.push({
            id: nextId++,
            title: title,
            done: false
          });
        }

        function handleChangeTodo(nextTodo) {
          const todo = todos.find(t =>
            t.id === nextTodo.id
          );
          todo.title = nextTodo.title;
          todo.done = nextTodo.done;
        }

        function handleDeleteTodo(todoId) {
          const index = todos.findIndex(t =>
            t.id === todoId
          );
          todos.splice(index, 1);
        }

        return (
          <>
            <AddTodo
              onAddTodo={handleAddTodo}
            />
            <TaskList
              todos={todos}
              onChangeTodo={handleChangeTodo}
              onDeleteTodo={handleDeleteTodo}
            />
          </>
        );
      }
      ```

    - ##### 解答（Solution）
      - 在 `handleAddTodo` 中，您可以使用陣列展開語法；
      - 在 `handleChangeTodo` 中，您可以使用 `map` 建立一個新陣列；
      - 在 `handleDeleteTodo` 中，您可以使用 `filter` 建立一個新陣列。
      
      現在列表可以正常運作了：

      ```jsx
      function handleAddTodo(title) {
        setTodos([
          ...todos,
          {
            id: nextId++,
            title: title,
            done: false
          }
        ]);
      }

      function handleChangeTodo(nextTodo) {
        setTodos(todos.map(t => {
          if (t.id === nextTodo.id) {
            return nextTodo;
          } else {
            return t;
          }
        }));
      }

      function handleDeleteTodo(todoId) {
        setTodos(
          todos.filter(t => t.id !== todoId)
        );
      }
      ```

  - #### 4. 使用 Immer 修復 mutation 的問題
    - 範例和上一個挑戰相同。這次，您需要使用 `Immer` 來修復 `mutation` 的問題。為了方便，`useImmer` 已經被引入了，您需要使用它來替換 `todos` 的 `state` 變數。

      ```jsx
      import { useState } from 'react';
      import { useImmer } from 'use-immer';
      import AddTodo from './AddTodo.js';
      import TaskList from './TaskList.js';

      let nextId = 3;
      const initialTodos = [
        { id: 0, title: 'Buy milk', done: true },
        { id: 1, title: 'Eat tacos', done: false },
        { id: 2, title: 'Brew tea', done: false },
      ];

      export default function TaskApp() {
        const [todos, setTodos] = useState(
          initialTodos
        );

        function handleAddTodo(title) {
          todos.push({
            id: nextId++,
            title: title,
            done: false
          });
        }

        function handleChangeTodo(nextTodo) {
          const todo = todos.find(t =>
            t.id === nextTodo.id
          );
          todo.title = nextTodo.title;
          todo.done = nextTodo.done;
        }

        function handleDeleteTodo(todoId) {
          const index = todos.findIndex(t =>
            t.id === todoId
          );
          todos.splice(index, 1);
        }

        return (
          <>
            <AddTodo
              onAddTodo={handleAddTodo}
            />
            <TaskList
              todos={todos}
              onChangeTodo={handleChangeTodo}
              onDeleteTodo={handleDeleteTodo}
            />
          </>
        );
      }
      ```

    - ##### 解答（Solution）
      - 透過使用 `Immer`，只要您僅僅直接修改 `Immer` 提供給您的 `draft` 的一部分，您就可以以 `mutation` 的方式寫程式碼。這裡所有的 `mutation` 都在 `draft` 上執行，因此程式碼可以正常運作：

        ```jsx
        const [todos, updateTodos] = useImmer(
          initialTodos
        );

        function handleAddTodo(title) {
          updateTodos(draft => {
            draft.push({
              id: nextId++,
              title: title,
              done: false
            });
          });
        }

        function handleChangeTodo(nextTodo) {
          updateTodos(draft => {
            const todo = draft.find(t =>
              t.id === nextTodo.id
            );
            todo.title = nextTodo.title;
            todo.done = nextTodo.done;
          });
        }

        function handleDeleteTodo(todoId) {
          updateTodos(draft => {
            const index = draft.findIndex(t =>
              t.id === todoId
            );
            draft.splice(index, 1);
          });
        }
        ```

      - 您還可以在 `Immer` 中混合使用會改變和不會改變原始值的方法。
        - 例如，在下面的程式碼中，`handleAddTodo` 是透過直接修改 `Immer` 的 `draft` 實現的，而 `handleChangeTodo` 和 `handleDeleteTodo` 則使用了不會直接修改原始值的 `map` 和 `filter` 方法：

          ```jsx
          function handleAddTodo(title) {
            updateTodos(draft => {
              draft.push({
                id: nextId++,
                title: title,
                done: false
              });
            });
          }

          function handleChangeTodo(nextTodo) {
            updateTodos(todos.map(todo => {
              if (todo.id === nextTodo.id) {
                return nextTodo;
              } else {
                return todo;
              }
            }));
          }

          function handleDeleteTodo(todoId) {
            updateTodos(
              todos.filter(t => t.id !== todoId)
            );
          }
          ```

      透過使用 `Immer`，您可以為每個單獨的場景選擇最為自然的程式碼風格。