---
title: TypeSctipt 邁向專家之路
---

# 第一篇 TypeScript 入門準備
---
# 03 JavaScript 快速入門(上)
  要有效利用 `TypeScript` 進行開發，首先就得理解 `JavaScript` 是如何處理資料型別的。只要弄懂 `JavaScript` 如何運作，不僅能讓 `TypeScript` 變得容易上手，還能更清楚 `TypeScript` 提供了哪些好處、這些功能又如何運作。

## 3-1 本章行前準備
  - 進入本章主題之前，得建立一個練習用的專案。在想要建置專案的位置，新增一個名為 `primer` 的資料夾，然後在命令列切換到 `primer` 目錄底下，執行以下指令來初始化它：
    ```sh
    \primer> npm init --yes
    ```

  - 接著，可以在此專案安裝一個名為 `nodemon` 的套件，它的功能是能自動監看 `JavaScript` 檔案的變更，並重新執行之。`nodemon` 的安裝方式，是在 `primer` 目錄底下執行下列指令：
    ```sh
    \primer> npm install nodemon@2.0.12

    ##  這指令會自動下載 `nodemon` 的套件，並安裝在 `primer` 資料夾底下。
    ```
   

  - 安裝完成後，請在 `primer` 目錄底下，建立一個名為 `index.js` 的檔案，寫入：
    ```js
    // \primer\index.js

    let hatPrice = 100;
    console.log(`Hat price: ${hatPrice}`);
    ```

  - 接著執行以下指令，開始監看 `JavaScript` 檔案的變動：
    ```sh
    \primer> npx nodemon index.js

    [nodemon] 2.0.12
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching path(s): *.*
    [nodemon] watching extensions: js, mjs, json
    [nodemon] starting `node index.js`
    Hat price: 100   ## 執行結果
    [nodemon] clean exit - waiting for changes before restart
    ```

  - 為確保 `nodemon` 能正確偵測到檔案內容變更，請試著在 `index.js` 加入以下內容：
    ```js
    let hatPrice = 100;
    console.log(`Hat price: ${hatPrice}`);
    let bootsPrice = "100";
    console.log(`Boots price: ${bootsPrice}`);
    ```

  - 當一儲存檔案，`nodemon` 套件應該能偵測到 `index.js` 的內容已經改變，並自動重新執行其程式碼。
    ```sh
    [nodemon] restarting due to changes...    ## nodemon 偵測到變更，重新執行
    [nodemon] starting `node index.js`
    Hat price: 100
    Boots price: 100    ## 新程式的執行結果
    [nodemon] clean exit - waiting for changes before restart
    ```

  - 若要停止 `nodemon`，在命令行按下 `Ctrl` + `C`，並輸入 `Y` 確認結束。

## 3-2 JavaScript 的令人困惑之處
  - 有時 `JavaScript` 會發生預料之外的結果，最主要的原因往往在於 `JavaScript` 的型別系統。以下是典型的例子：
    ```js
    // 修改 \primer\index.js

    let hatPrice = 100;   // 值為數值
    console.log(`Hat price: ${hatPrice}`);
    let bootsPrice = "100";   // 值為字串
    console.log(`Boots price: ${bootsPrice}`);

    if(hatPrice == bootsPrice) {    // 判斷 hatPrice 的值是否和 bootsPrice 相等
      console.log("Prices are the same");
    } else {
      console.log("Prices are different");
    }
    let totalPrice = hatPrice + bootsPrice;
    console.log(`Total Price: ${totalPrice}`);
    ```

    執行結果
    ```sh
    Hat price: 100
    Boots price: 100
    Prices are the same
    Total Price: 100100
    ```

    多數程式語言在進行不同型別的運算時，會產生錯誤，但 `JavaScript` 卻不會。字串和數值雖然可以比較，但是相加時會導致兩者相連。

## 3-3 理解 JavaScript 的資料型別
### 3-3-1 JavaScript 的基礎與複合型別
  - #### JavaScript 內建資料型別
    | 名稱                 | 說明                                                                                                                                  |
    |--------------------|-------------------------------------------------------------------------------------------------------------------------------------|
    | `number (數值)`      | 代表數字值。不同於其他語言，`JavaScript` 沒有區分 `整數 (integer)` 與 `浮點數 (floating-point values)`，兩者皆一視同仁視為 `number` 型別 |
    | `string (字串)`      | 代表字串。                                                                                                                             |
    | `boolean (布林)`     | 代表 `true (真)` 與 `false (偽)` 的邏輯值。                                                                                            |
    | `symbol (符號)`      | 表示獨一無二的常數值，例如集合中的 `鍵 (key)`。於 `ES2015 / ES6` 加入                                                                   |
    | `bigint (大整數)`    | 可用來表示超過 `number` 型別範圍 (正負 2⁵³ - 1) 的任何數字。於 `ES2020` 加入                                                           |
    | `null (空值)`        | 這種型別只能指派值 `null`，代表空值或無效的參照。                                                                                       |
    | `undefined (未定義)` | 變數已宣告，但尚未指派任何值，則會視為未定義型別。                                                                                       |
    | `object (物件)`      | 代表複合型別值，這些型別由各別的屬性和值組成。                                                                                          |

    上表的前七項屬於 `JavaScript` 的 `基本型別 (primitive type)`，可以直接使用。`JavaScript` 應用程式中的值，若不是基本型別，就是由基本型別構成的複合型別。

### 3-3-2 基本型別的運用
  其他程式語言多半會強制在宣告變數時，寫明資料型別，才能開始使用之。以 `C#` 語言為例：
  ```c#
  string name = "Adam";
  ```

  但是 `JavaScript` 的邏輯相反，有型別的是 `值本身` 而非變數，變數只是個指向值的名稱罷了，其型別會由值決定。

  `JavaScript` 變數只要被指派不同型別的值，其型別就會跟著改變。

  ```js
  // \primer\index2.js

  let myVariable = "Adam";        // 宣告變數 myVariable 並指派值 "Adam"
  ```

  `JavaScript` 執行環境會自動推論 `myVariable` 的值，究竟屬何種型別。執行環境會曉得以 雙引號 框起來的值必定為 `字串`。

  可用 `typeof` 關鍵字來確認 `myVariable` 變數的型別：

  ```js
  // \primer\index2.js

  let myVariable = "Adam";
  console.log(`Type: ${typeof myVariable}`);

  // Type: string
  ```

  接著，再嘗試指派一個新的值給 `myVariable` 變數：
  ```js
  // 修改 \primer\index2.js

  let myVariable = "Adam";
  console.log(`Type: ${typeof myVariable}`);
  // Type: string

  myVariable = 100;
  console.log(`Type: ${typeof myVariable}`);
  // Type: number
  ```

  > 如果用 `typeof` 關鍵字檢查 `null` 值，得到的答案居然會是 `object`。這是打從 `JavaScript` 設計之初，便存在的奇特現象，至今一直沒有修正，原因是怕影響到太多依賴此種判斷方式的舊程式。

### 3-3-3 理解強制轉型
  在 `JavaScript` 中，當算符 (或稱 運算符，比如加減乘除) 被套用到不同型別的值時，`JavaScript` 執行環境會將其中一個轉換為另一個型別的值，這個過程叫做 `強制轉型 (type coercion)`。

  在 `JavaScript` 語法中，雙等號 `==` 表示進行的是 `一般相等比較 (abstract equality comparison)`，它會先將李個變數的值轉換為相同的型別，好產生有意義的比較結果。

  而第二次的型別轉換，則發生在兩個變數相加時，
  ```ts
  let totalPrice = hatPrice + bootsPrice;
  ```
  相加算符 `+` 被用來相加一個數值與一個字串，兩者型別不同，因此其中一方會被強制轉型。

### 3-3-4 避免無意間的強制轉型
  強制轉型，很容易無意間引發它，特別是沒意識到要運算的變數已經被指派新值、導致型別已經改變。`TypeScript` 能確保只有明確要求轉換型別時，才會轉型。

### 3-3-5 活用強制轉型
  其實只要善加利用強制轉型，也能當成一種實用的工作。

  例如：`OR 邏輯算符 ||`，會將值的型別強制轉換為布林值，而 `0`、`空字串`、`null` 或 `undefined` 之類的值，會被轉成 `false`。其餘的值則會轉成 `true`。

## 3-4 運用函式
### 3-4-1 函式參數的型別
  `JavaScript` 能夠彈性推論型別的特質，包含 `函式(function)`。

  函式可用來放置會重複使用的程式碼，以利簡化程式。可以定義若干 `參數 (parameter)`，並用 `return` 關鍵字傳回一個值。

  在 `JavaScript` 中，宣告函式的方式有兩種：
  ```js
  // 函式敘述
  function foo(param1, param2) {
    return param1 + param2
  }

  // 函式運算式 (指派函式給變數名稱)
  let foo = function(param1, param2) {
    return param1 + param2;
  }

  let t = foo(n1, n2);    // 呼叫函式並接收傳回值
  ```

  要注意用 `函式敘述` 建立的函式，可以在程式的任何位置 (包括函式宣告處前面) 呼叫，
  但用 `函式運算式` 建立的函式，就只能在宣告之後呼叫。
  
### 3-4-2 函式傳回值的型別
  `JavaScript` 這種有別于其他語言的型別機制，在操作函式時，會變得更明顯，因為函式運算結果的型別，也可能會受到該函式的引數影響。

  ```js
  let hatPrice = 100;
  console.log(`Hat price：${hatPrice}`);
  let bootsPrice = "100";
  console.log(`Boots price：${bootsPrice}`);

  function sumPrices(first, second, third) {
    return first + second + third;
  }

  let totalPrice = sumPrices(hatPrice, bootsPrice);
  console.log(`Total：${totalPrice}, ${typeof totalPrice}`);
  totalPrice = sumPrices(100, 200, 300);
  console.log(`Total：${totalPrice}, ${typeof totalPrice}`);
  totalPrice = sumPrices(100, 200);
  console.log(`Total：${totalPrice}, ${typeof totalPrice}`);
  ```

  ```sh
  Hat price：100
  Boots price：100
  Total：100100undefined, string
  Total：600, number
  Total：NaN, number
  ```

### 3-4-3 避免引數跟參數數量不符的問題
  利用 `JavaScript` 本身的功能，來規避上述的狀況。首先，可指定參數預設值，參數若沒有收到對應引數，就會套用預設值。

  ```js
  let hatPrice = 100;
  console.log(`Hat price：${hatPrice}`);
  let bootsPrice = "100";
  console.log(`Boots price：${bootsPrice}`);

  function sumPrices(first, second, third = 0) {
    return first + second + third;
  }

  let totalPrice = sumPrices(hatPrice, bootsPrice);
  console.log(`Total：${totalPrice}, ${typeof totalPrice}`);
  totalPrice = sumPrices(100, 200, 300);
  console.log(`Total：${totalPrice}, ${typeof totalPrice}`);
  totalPrice = sumPrices(100, 200);
  console.log(`Total：${totalPrice}, ${typeof totalPrice}`);
  ```

  ```sh
  Hat price：100
  Boots price：100
  Total：1001000, string        # 第三個參數變成 0
  Total：600, number
  Total：300, number
  ```

  現在 `sumPrices()` 第三個參數 `third` 後面用等號指定一個預設值。呼叫函式若該參數缺少對應的引數，`JavaScript` 便會採用該預設值。

  另外一種更具彈性的作法是在函式使用『 `其餘參數 (rest parameter)` 』，或者數量不定的參數。『 `其餘參數` 』的語法必須以連續 `三個句點 (...)` 當開頭，而且它只能作為函式的最後一個參數。

  ```js
  let hatPrice = 100;
  console.log(`Hat price：${hatPrice}`);
  let bootsPrice = "100";
  console.log(`Boots price：${bootsPrice}`);

  function sumPrices(...numbers) {
    return numbers.reduce(
      function (total, val) {
        return total + val
      }
    );
  }

  let totalPrice = sumPrices(hatPrice, bootsPrice);
  console.log(`Total：${totalPrice}, ${typeof totalPrice}`);
  totalPrice = sumPrices(100, 200, 300);
  console.log(`Total：${totalPrice}, ${typeof totalPrice}`);
  totalPrice = sumPrices(100, 200);
  console.log(`Total：${totalPrice}, ${typeof totalPrice}`);
  ```

  『 `其餘參數` 』會是個 `陣列(array)`，其元素為傳入函數的引數，數量不定。

### 3-4-4 使用箭頭函式
  `箭頭函式 (arrow function)` 是另一種定義函式的精簡寫法。
  ```js
  // ... 上略

  // 把 sumPrices 也改成箭頭函式
  let sumPrices = (...number) => numbers.reduce(
    (total, val) => total + (Number.isNaN(Number(val)) ? 0 : Number(val))
  );
  ```

## 3-5 陣列的運用
### 3-5-1 宣告與使用陣列
  `JavaScript` 的陣列與其他程式語言相似，差別在於陣列大小可以彈性調整，並且可以存放任何種類的值，意味著元素不必是單一型別。

  ```js
  let names = ["Hat", "Boots", "Gloves"];    // 用初始值建立陣列
  let prices = [];    // 建立空陣列
  prices.push(100);   // 用 push()方法在 prices 陣列加入新元素
  prices.push("100");
  prices.push(50.25);

  // 讀出兩個陣列的第一個元素 (索引 0)
  console.log(`First Item: ${names[0]}：${prices[0]}`);

  let sumPrices = (...number) => number.reduce((total, val) => total + (Number.isNaN(Number(val)) ? 0 : Number));
  let totalPrice = sumPrices(...prices);
  console.log(`Total: ${totalPrice} ${typeof totalPrice}`);
  ```

  宣告陣列時，並不需要明確定義陣列大小，它會隨著元素的新增或移除而自動分配記憶體空間。

### 3-5-2 在陣列使用展開算符
  『 `展開算符 (spread operator)` 』，可用來展開陣列的內容，讓這些元素全部變成呼叫函式時傳入的個別引數。

  ```js
  let totalPrice = sumPrices(...prices);
  // 相當於呼叫 sumPrices(prices[0], prices[1], prices[2], ...)
  ```

## 3-6 物件的運用
### 3-6-1 建立和使用物件
  `JavaScript` 物件是多個 `屬性 (property)` 的集合，每個屬性 (物件的變數) 有各自的名稱與值。

  ```js
  let hat = {
    name: "Hat",    // 屬性 name
    price: 100      // 屬性 price
  }
  ```

### 3-6-2 物件屬性的增刪與變更
  ```js
  let gloves = {        // 宣告 gloves 物件
    productName: "Gloves",
    price: "40"
  };

  gloves.name = gloves.productName;     // 在 gloves 建立屬性 name;
  delete gloves.productName;            // 刪除 gloves 的屬性 productName;
  gloves.price = 20;                    // 修改 gloves 的屬性 price
  ```

### 3-6-3 預防未定義的物件與屬性
  為了確保程式碼必定能獲得可運算的值，可以透過強制型別轉換和 OR 邏輯算符 來留下後備值。

  ```js
  let hat = {
    name: "Hat",
    price: 100,
  };
  let propertyCheck = hat.price || 0;
  let objectAndPropertyCheck = (hat || {}).price || 0;
  console.log(`Checks: ${propertyCheck}, ${objectAndPropertyCheck}`);

  // Checks: 100, 100
  ```

### 3-6-4 在物件使用『 展開 』與『 其餘 』算符
  ```js
  let hat = {
    name: 'Hat',
    price: 100
  }

  let otherHat = { ...hat };
  console.log(`otherHat: ${otherHat.name}, ${otherHat.price}`);
  ```

  `hat` 物件 配合『 `展開算符` 』，把它的屬性與值解開到 {} 物件字面表示法中，等於將 `hat` 物件內容複製到新的 `otherHat` 物件。

  以展開算符拆開的屬性名稱和值，並且在新物件加入額外的屬性。
  ```js
  let additionalProperties = { ...hat, discounted: true;}
  ```

  新的 `discounted` 屬性 (值為 `true`) 會連同 `hat` 物件原有的屬性，放入 `additionalProperties`。

  如果，一個屬性在物件字面表示法裡有重複定義，右邊的定義會蓋過左邊的。
  ```js
  let replacedProperties = { ...hat, price: 10};
  ```

  最後，也能在物件字面表示法用『 `其餘算符` 』(跟展開算符一樣都是 ... 三個半形句點)來過濾屬性。
  ```js
  let { price, ...someProperties} = hat;
  ```

### 3-6-5 屬性 getter 與 setter 的定義
  如果希望使用者在存取物件屬性時，程式能對這些動作做些控管，則可考慮使用 `getter` 和 `settter`。

  ```js
  let hat = {
    name: "Hat",
    _price: 100,
    priceIncTax: 100 * 1.2,
    set price(newPrice) {   // price 的 setter
      this._price = newPrice;   // 用 this 來存取 hat 物件自身
      this.priceIncTax = this._price * 1.2;
    },
    get price() {   // price 的 getter
      return this._price;
    }
  };

  console.log(`Hat: ${hat.price}, ${hat.priceIncTax}`);
  hat.price = 120;
  console.log(`Hat: ${hat.price}, ${hat.priceIncTax}`);
  ```

  `JavaScript` 將關鍵字 `set` 與 `get` 綁定的函式名稱視為屬性，因此不能再將該名稱定義為屬性。以 `set` 建立的函式稱為 `setter`，`get` 函式則叫做 `getter`。

  #### JavaScript 物件的私有屬性
  在以上範例中，使用 `_price` 這種名稱，加上底線的方式來『 `模擬` 』私有屬性，而 `getter/setter` 就能用來扮演屬性的操作介面，並在必要時做些控管。

### 3-6-6 物件方法的定義
  ```js
  let hat = {
    name: "Hat",
    ...
    writeDetails: function() {    // 定義方法
      console.log(`${this.name}： ${this.price}, ${this.priceInded}`);
    }
  }
  ```
  就其本質而言，方法也是物件的一個屬性。
  新的寫法省去了 `function` 關鍵字建立的，但從 `ES2015/ES6` 之後，可以用底下更簡潔的語法來宣告方法：
  ```js
  let hat = {
    ...
    writeDetails() {
      console.log(`${this.name}： ${this.price}, ${this.priceInded}`);
    }
  }
  ```

## 3-7 了解 this 關鍵字
### 3-7-1 傳回 undefined 的 this
  ```js
  let hat = {
    name: "Hat",
    _price: 100,
    priceIncTax: 100 * 12,
    set price(newPrice) {
      this._price = newPrice;
      this.priceIncTax = this._price * 1.2;
    },
    get price() {
      return this._price;
    },
    writeDetails: () => console.log(`${this.name}: ${this.price}, ${this.priceIncTax}`)
  };

  hat.writeDetails();

  // 執行結果 undefined: undefined, undefined
  ```

### 3-7-2 了解獨立函式中的 this 如何作用
  可以在任何函式中，使用 `this` 關鍵字，即使該函式並沒有被當成物件方法使用。

  ```js
  function writeMessage(message) {
    console.log(`${this.greetng}, ${message}`);
  }

  greeting = "Hello";
  writeMessage("It is sunny today");
  ```

  `JavaScript` 中其實定義了一個 `全域物件 (global object)`，在程式的任何地方都能存取。
  若在 `JavaScript` 定義變數時，沒有使用 `let`、`const` 或 `var` 等關鍵字，就會被存入全域物件。

  在一般函式中，`this` 關鍵字，並非指向函式物件本身，而會指向全域物件。

  全域物件的變數名稱 也會因執行環境而異。在 `Node.js` 執行環境下會叫做 `global`，而 `瀏覽器環境`，則是 `window` 或 `self`。

  > `ES2020` 起，可以使用 `globalThis` 關鍵字，它會根據執行環境，自動指向對應的全域物件。

### 3-7-3 了解物件方法中的 this 關鍵字如何作用
  對於物件方法，`this` 關鍵字則會指向該物件本身。

  ```js
  let myObject = {
    greeting: "Hi, there",
    writeMessage(message) {
      console.log(`${this.greeting}, ${message}`);
    }
  }

  myObject.writeMessage("It is sunny today");
  ```

  之所以會有這種行為差異，是因為當函式是透過物件呼叫 (當成方法執行) 時，`JavaScript` 會呼叫該函式的 `call()` 方法，並將物件指派給 `this`。
  ```js
  myObject.writeMessage.call(myObject, "It is sunny today");
  ```

### 3-7-4 改變 this 關鍵字的行為
  若想更安全掌握 `this` 的值，作法之一是改用 `call()` 方法來呼叫函式，但這樣在每次呼叫函式時都很麻煩，還要多傳入一個物件給 `this`。

  更可靠的方式是透過函式的 `bind()` 方法來指定 `this` 的值，這樣不論函式是在哪裡被呼叫，`this` 都會指向該值。

  ```js
  let myObject = {
    greeting: "Hi, there",
    writeMessage(message) {
      console.log(`${this.greeting}, ${message}`);
    }
  }

  // 指定傳入 myObject 給 this
  myObject.writeMessage = myObject.writeMessage.bind(myObject);

  myObject.writeMessage("It is sunny today");
  ```

  `bind()` 方法，實際上會傳回一個新函式，而該函式被呼叫時，`this` 的值將保持一致。

  但使用 `bind()` 的麻煩在於，必須等物件被建立出來了，才有辦法把它設為 `this`，迫使整個操作流程得分成兩階段：首先建立物件，然後才能呼叫 `bind()` 來取代每個需要讓 `this` 值保持一致的物件方法。

### 3-7-5 了解箭頭函式中的 this 關鍵字作用
  箭頭函式的運作方式其實與一般函式不同。箭頭函式 `沒有` 自己的 `this` 值，而是在執行時，去繼承最靠近範圍的 `this` 值。

## 3-8 本章總結
  本章介紹了 `JavaScript` 型別系統、函式及物件的基礎。