---
title: IT邦 - 讓 TypeScript 成為你全端開發的 ACE !
---

# 10 常用 ECMAScript 標準語法

## 10.1 ES6 解構式 Destructuring
### 10.1.1 解構式語法基礎
  ```ts
  let maxwell = {
    name: 'Maxwell',
    age: 18,
    interest: ['drawing', 'programming']
  };
  ```
  宣告的物件 `maxwell` 就是一般常見的 `JSON物件`，如果說想要宣告一個函式專門填入該物件並且印出所有細節時：
  ```ts {2-4}
  function logInfo(person) {
    const name = person.name;
    const age = person.age;
    const interest = person.interest;

    const interestStr = interest.join('.');
    console.log(
      `${name} is ${age} years old, and interested in ${interestStr}`
    );
  }
  ```
  仔細看上面三行的寫法，以上的做法是將物件的值取出來 (也就是呼叫對應屬性) 並且指派結果到變數裡。但最常見的變數命名方式是將變數命名的結果與呼叫的對應屬性相同。

  不過這種方式挺冗贅的，因此 `ECMAScript` 標準提供更簡潔的寫法，就是 `解構式`。因為解構的東西是 `JSON 物件`，所以運用 `JSON 物件` 的寫法，將屬性解構出來之後宣告成變數。解構式可以從同一個物件一次指派多個屬性出來：
  ```ts
  const { name, age, interest } = person;
  ```

  若遇到變數名稱不等於屬性名稱時，解構式語法可以使用冒號的方式更改解構屬性的變數名稱：
  ```ts
  const { name: username } = person;  // 解構的 name 屬性被指派到變數 username
  ```

  解構式中，也可以指派預設值，以防解構的屬性是不存在物件的。
  ```ts
  const { name = 'Max' } = person;  // 解構的 name 屬性若不存在時，預設為 'Max'
  ```

  更改指派變數名稱 以及 預設值 可以合在一起使用：
  ```ts
  const { name: username = 'Max'} = person;
  ```

  陣列也是可以被解構的物件：
  ```ts
  const arr = [1, 2, 3, 4, 5];
  const [firstElement, secondElement] = arr;

  console.log(firstElement); // => 1
  console.log(secondElement); // => 2
  ```

  講完解構式後，最前面的函式 `logInfo` 的宣告可以改寫成：
  ```ts
  function logInfo(person) {
    const { name, age, interest } = person.interest;

    const interestStr = interest.join('.');
    console.log(
      `${name} is ${age} years old, and interested in ${interestStr}`
    );
  }
  ```

  不過更簡易的寫法是在函式的參數部分直接解構：
  ```ts
  /* 將 person 參數解構成 name, age 以及 interest */
  function logInfo({ name, age, interest }) {
    // 以下略...
  }
  ```

### 10.1.2 解構的同時進行型別註記
  必須用到 `JSON` 物件型別的寫法，而非單純型別一個個對解構的屬性進行註記。
  ```ts
  const { name, age, interest }: {
    name: string;
    age: number;
    interest: string[];
  } = person;
  ```

  可以用型別化名取代以上的寫法：
  ```ts
  type PersonalInfo = {
    name: string;
    age: number;
    interest: string[];
  }

  const { name, age, interest }: PersonalInfo = person;
  ```

  如果遇到解構的屬性之變數更名的情形時，`註記的型別之 JSON 物件型別結構，請以被指派的物件的結構為主`。
  ```ts
  const { name: username, age, interest }: {
    /**
     * 就算解構屬性 name 被更名為 username，還是要按照被指派的物件，
     * 也就是 person 本身的結構描述註記的型別
     */
    name: string;
    age: number;
    interest: string[];
  } = person;
  ```

  如果解構的東西為函式的參數，也可以遵照同樣的想法同時解構並且註記函式參數的型別結構：
  ```ts
  /* 將 person 參數解構成 name, age 以及 interest，並且註記為 PersonalInfo 屬性 */
  function logInfo({ name, age, interest }: PersonalInfo) {
    // 以下略 ...
  }
  ```
  
  至於陣列的解構，對應的註記型別 `可能是陣列型別` (注意『 可能 』 兩字)：
  ```ts
  const arr = [1, 2, 3, 4, 5];
  const [firstElement, secondElement]: number[] = arr;
  ```

  如元祖型別：
  ```ts
  type FiveNumber = [ number, number, number, number, number ];
  const arr: FiveNumber = [1, 2, 3, 4, 5];
  const [firstElement, secondElement]: FiveNumber = arr;
  ```

  然而，也可以接受
  ```ts
  type FiveNumber = [ number, number, number, number, number ];
  const arr: FiveNumber = [1, 2, 3, 4, 5];
  const [firstElement, secondElement]: number[] = arr;
  ```

  不過還是 `建議根據被指派的變數值而來註記解構式的型別`。

## 10.2 ES7 匯集 - 展開操作符 Rest-Spread Operator
### 10.2.1 匯集 - 展開操作符語法基礎
  匯集 - 展開操作符的符號是三個點點，也就是 `...`。可是它有兩種用途 - 『`匯集`』以及『`展開`』。

  可以藉由 `展開操作符 (Spread Operator)`，將輸入的陣列展開成為函式的參數：
  ```ts
  console.log(Math.max(...[5, 1, 7, 2, 4]));
  ```

  對陣列進行展開運算符的相關操作的另一個用途是 `複製新的陣列出來`：
  ```ts
  const originalArray = [1, 2, 3, 4, 5];
  const copiedArray = [...originalArray]; // 複製並產生新的陣列
  ```

  陣列也可以運用此操作符進行結合 (Concatenation) 的動作：
  ```ts
  const arr1 = [1, 2, 3];
  const arr2 = [4, 5, 6];
  const concatenatedArray = [ ...arr1, ...arr2 ]; // => [1, 2, 3, 4, 5, 6]
  ```

  展開運算符也可以用在 `JSON 物件` 上，如複製物件
  ```ts
  const originalJSON = { propA: 123, propB: 'Hello world' };
  const copiedJSON = { ...originalJSON } // 複製並產出新的物件
  ```

  但請注意，如果遇到 `JSON` 物件有多層物件的情形，這種複製手法並不是深度複製，而是俗稱的 `淺層複製 (Shallow Copy)`。
  
  也可以利用展開操作符，將多個物件的屬性合併重組起來：
  ```ts
  const json1 = { propA: 123, propB: 'Hello world' };
  const json2 = { propC: true, propD: [1, 2, 3] };

  /* 合併 json1 與 json2 的屬性 */
  const combinedJSON = { ...json1, ...json2 };
  // => { propA: 123, propB: 'Hello world', propC: true, propD: [1, 2, 3]}
  ```

  相對於展開操作符，`匯集操作符 (Rest Operator)` 的效果是相反的，主要目的就是匯集 (陣列的) 元素或 (物件的) 屬性的概念。

  假設想要將陣列裡的第一個拔出來，並且將剩餘的元素匯集成另一個陣列時：
  ```ts
  const arr = [1, 2, 3, 4, 5];
  const [firstElement, ...restElement] = arr;

  console.log(firstElement); // => 1
  console.log(restElement); // => [2, 3, 4, 5]
  ```

  假設 解構 JSON 物件，僅拔出 `interest` 屬性，其餘的屬性匯集成獨立的 `JSON` 物件：
  ```ts
  const { interest, ...otherProps } = maxwell;

  console.log(interest); // => ['drawing', 'programming']
  console.log(otherProps); // => { name: 'Maxwell', age: 18 }
  ```

### 10.2.2 結合型別系統
  ```ts
  const originalArray = [1, 2, 3, 4, 5];
  const copiedArray: number[] = [...originalArray];
  ```

  ```ts
  const arr = [1, 2, 3, 4, 5];
  const [firstElement, ...restElement]: number[] = arr;
  ```

  解構 JSON 物件
  ```ts
  type PersonalInfo = {
    name: string;
    age: number;
    interest: string[];
  };

  const { interest, ...otherProps }: PersonalInfo = maxwell;
  ```

  註記的寫法依然還是按照被指派的物件本身的結構註記型別，儘管解構式使用到匯集操作符。

## 10.3 ES6 Set 與 Map 資料結構
  由於 `Set` 與 `Map` 為 `ES6` 標準裡新增的物件，在 `TypeScript` 設定檔 `tsconfig.json` 裡，必須要在 `lib` 設定部分 (預設只有 `dom`) 新增 `es6` (或 `es2015`) 這個選項。
  ```json
  {
    "compileOptions": {
      // ... 其他 TypeScript 編譯器選項
      "lib": ["dom", "ES2015"],
      // ... 其他 TypeScript 編譯器選項
    }
  }
  ```

### 10.3.1 Set 與 Map 的使用基礎
  `ES6` 出了兩種很好用的資料結構，分別為 `Set (集合)` 與 `Map (鍵值對集合)`。

  `集合 (Set)` 儘管跟陣列相似，都是一系列元素的集合，但最大差異在於 - 集合 `內部的元素不重複，並且不會有順序`。
  ```ts
  const anArray = [1, 1, 2, 2, 2, 3, 4, 4, 5];
  const aSet = new Set([1, 1, 2, 2, 2, 3, 4, 4, 5]);

  console.log(anArray);  // => [1, 1, 2, 2, 2, 3, 4, 4, 5]
  console.log(aSet);  // => Set { 1, 2, 3, 4, 5 } 集合內部的元素不會重複
  ```

  集合由於沒有順序之分，所以不會有陣列的 `Array.prototype.push` 或 `unshift` 方法 (分別是插入最後一個以及第一個值)，集合只有一個 `Set.prototype.add` 方法，純粹只是加入一個新的元素到集合內部。
  ```ts
  aSet.add(6);
  console.log(aSet);  // => Set { 1, 2, 3, 4, 5, 6 }
  ```

  集合還有提供多個不同的方法，可以刪除或檢視集合內有沒有特定的元素：
  ```ts
  aSet.delete(2); // 刪除元素：2
  console.log(aSet);  // => Set { 1, 3, 4, 5, 6 }

  // 檢視集合內有沒有元素：3
  console.log(aSet.has(3)); // => true

  // 檢視集合內有沒有元素：2
  console.log(aSet.has(2)); // => false
  ```

  另一個對應的資料結構為 `ES6 Map`，它可以儲存鍵值對的東西；`Map 支援的鍵是任何型別的值`；相對的，JSON 的鍵只能為字串型別的值，`就算用其他型別的值作為 JSON 物件的鍵，它都會先轉型成字串型別` 作為其屬性。
  ```ts
  const aJSONObject = { hello: 'world', num: 123 };

  /* Map 建構子接收的是二維的陣列，內部為鍵值對的組合 */
  const aMapObject = new Map([
    ['hello', 'world'],
    ['num', 123]
  ]);
  ```

  `Map` 可以使用 `Map.prototype.set` 方法進行鍵值對的設置：
  ```ts
  aMapObject.set('subscribed', true); // 設置新的鍵值對 ['subscribed', true]
  ```

  當然也可以刪除屬性，利用 `Map.prototype.delete` 方法：
  ```ts
  aMapObject.delete('hello'); // 刪除 'hello' 這個鍵
  ```

  `Map` 也可以檢視鍵的存在性：
  ```ts
  console.log(aMapObject.has('num')); // => true
  console.log(aMapObject.has('hello')); // => false
  ```

### 10.3.2 泛用類別 Set
  以下是 `Set` 的實體與建構子函式的介面宣告，為 `Set` 的型別定義。
  ```ts
  interface Set<T> {
    add(value: T): this;
    clear(): void;
    delete(value: T): boolean;
    foreach(
      callbackfn: (value: T, value2: T, set: Set<T>) => void;
      thisArg?: any
    ): void;
    has(value: T): boolean;
    readonly size: number;
  }

  /**
   * 此為 Set 建構子函式的介面，此為類別型別 Class Types 的設計手法
   */
  interface SetConstructor {
    new <T = any>(values?: readonly T[] | null): Set<T>;
    readonly prototype: Set<any>;
  }

  declare var Set: SetConstructor;
  ```

### 10.3.3 泛用類別 Map
  以下是 ES6 Map 的型別定義宣告
  ```ts
  interface Map<K, V> {
    clear(): void;
    delete(key: K): boolean;
    forEach(
      callbackfn: (value: V, key: K, map: Map<K, V>) => void,
      thisArg?: any
    ): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): this;
    readonly size: number;
  }

  /**
   * Map 的建構子函式本身的介面
   */
  interface MapConstructor {
    new(): Map<any, any>;
    new<K, V>(entries?: readonly (readonly [K, V])[] | null): Map<K, V>;
    readonly prototype: Map<any, any>;
  }

  declare var Map: MapConstructor;
  ```

  使用 `Map` 時與 `Set` 有類似的概念，不過它有兩個型別參數，第一個代表 `Map` 的鍵之型別，第二個則是值的型別。
  ```ts
  /* 以下的 numMapObject 之鍵，必須為字串，值必須為數字型別 */
  const numMapObject = new Map<string, number>([
    ['lubky number', 14],
    ['unlucky number', 13]
  ]);
  ```

## 10.4 ES10 非強制串接操作符 Optional Chaining Operator
  有時候 `JavaScript` 程式裡，物件的屬性不一定會存在值，如果要確認物件內部的狀態時，必須得這樣寫：
  ```ts
  if(obj && obj.propA && obj.propA.propB) {
    console.log('obj.propA.propB exists!');
  }
  ```

  以上的範例就是先確保 `obj` 的存在 (也就是 `obj` 不為 `null` 或 `undefined` 等偏向於 `False` 這一類的值)，然後在相繼確認 `obj.propA` 與 `obj.propA.propB` 的存在。

  運用非強制串接操作符時，也就是 `?.` 的記號，等效結果如下：
  ```ts
  if(obj?.propA?.propB) { /* 略... */ }
  ```

  不過要注意的事情是，由於 `Flase` 這一類的值包含數字 0 或者是空字串，但這樣的說法是不精確的。以下是運用串接操作符以及實際的程式碼對照：
  ```ts
  /* 非強制串接操作符 */
  if(obj?.propA?.propB) { /* 略... */ }

  /* 以上的程式碼實際的編譯結果 */
  if(
    (obj       === null || obj       === undefined) ? undefined :
    (obj.propA === null || obj.propA === undefined) ? undefined :
    obj.propA.propB
  ) { /* 略... */ }
  ```

  實際上，非強制串接操作符的效果，是會先檢測串接前的值是否為 `null` 或 `undefined`，如果不是的話就會繼續串接下去。

  另外，非強制串接操作不一定只有操作屬性，它可以用來處理呼叫陣列索引的行為：
  ```ts
  /**
   * 將非強制串接操作在陣列上，會變成先檢查陣列是否為 undefined 或 null;
   * 若陣列存在，就可以直接串接並且呼叫該陣列的索引
   */
  let arr = [1, 2, 3, 4, 5];
  arr?.[0];
  ```

  當然，字串由於也具備索引的特徵，因此改成以下的形式也可以：
  ```ts
  let message = 'Hello world';
  message?.[0];
  ```

  函式的呼叫行為也可以改成非強制串接的方式呼叫：
  ```ts
  aFunction?.(/* 參數... */);
  ```
  等效於：
  ```ts
  aFunction === null || aFunction === undefined ? undefined : aFunction(/* 參數... */)
  ```

## 10.5 ES10 空值結合操作符 Nullish Coalescing Operator
  此操作符通常用在 `預設值 (Default Value)` 的設置。

  `JavaScript` 裡有一種被稱作為 `短路語法 (Short-Circuiting)`，
  ```ts
  let selectedNumber = obj.value && 14;
  ```

  以上的程式碼會先確認如果 `obj.value` 不為偏向於 `False` 的值 (如：`null`、`undefined`、`數字0` 或 `空字串`)，就會將 `obj.value` 指派到變數 `selectedNumber` 裡，否則會將數值 `14` 指派到變數裡。

  不過，假設變數 `selectedNumber` 是指任何數字皆可以被指派的話，那麼 `數字 0` 永遠不會被指派進去，因為 `數字 0` 在 `JavaScript` 隸屬於 `False` 值，因此必須改寫成以下格式：
  ```ts
  let selectedNumber = obj.value && (obj.value === 0 ? 0 : 14);
  ```

  以上的寫法就變成是多增加一層確認 `obj.value` 是否為 `數字 0` 的步驟。

  但這種短路寫法寫久了，應該會希望有操作符是專門擋 `null` 或 `undefined` 這兩種值的短路語法，這就是 `ECMAScript` 出的 `空值結合操作符` 的主要功能。
  ```ts
  let selectedNumber = obj.value ?? 14;
  ```

  其中，符號 `??` 就是 `空值結合操作符`，以上的程式碼編譯結果等效於以下的形式：
  ```ts
  let selectedNumber = (obj.value === null || obj.value === undefined) ? 14 : obj.value;
  ```

  另外，假設連 `obj.value` 也不確定 `obj` 的存在與否時，也可以結合 `非強制串接操作符`，寫出以下形式的程式碼：
  ```ts
  let selectedNumber = obj?.value ?? 14;
  ```

## [本章練習](../A/typeScript-A.html#第十章-常用-ecmascript-標準語法)