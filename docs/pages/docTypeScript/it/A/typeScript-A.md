---
title: IT邦 - 讓 TypeScript 成為你全端開發的 ACE !
---

# A 解答篇
## 第二章 TypeScript 型別系統概論
### 1. 試著描述 `TypeScript` 型別系統 (Type System) 的主要概念。 (型別推論與註記)
  :::details 解答
  `TypeScript` 型別系統主要分成 `型別推論(Inference)` 與 `註記(Annotation)` 的行為：
  - `推論行為` 具有類似動態語言的特色，藉由資料本身的值反推型別；
  - `註記` 則是使用者主動告訴 `TypeScript` 編譯器，特定的變數代表的型別，屬於類似靜態語言的特色。
  
  兩種機制綜合起來的系統，即`漸進式型別系統 (Gradual Typing)`。
  :::

### 2. 註記的語法中，還有再更細分成『註記』跟『斷言』，兩種語法的用途是什麼？註記方式的關鍵性差異在哪？
  :::details 解答
  - `註記 (Annotation)` 型別的用意是在告知 `TypeScript` 編譯器，宣告出來的 `變數 (Variable)` 或 `函式裡的參數 (Parameter)` 所代表之型別；
  - `斷言 (Assertion)` 則是由於某些原因 `TypeScript` 編譯器可能無法推論某 `表達式 (Expression)` 運算結果，所以進行人為告知編譯器，該表達式所代表之型別結果。
  :::

### 3. 使用『斷言』的語法要注意的地方在哪？
  :::details 解答
  由於斷言是人為強制覆蓋掉一個表達式的型別推論結果，因此必須要在很確定程式碼的運作過程時，進行型別斷言。
  :::

### 4. 試描述 敘述式(Statement) 與 表達式(Expression) 的概念。兩者之差異性在哪？
  :::details 解答
  `敘述式 (Statement)` 與 `表達式 (Expression)` 最關鍵差異在於：後者運算結果會有值出來，前者則沒有。
  :::

### 5. 正確的註記方式有哪些，錯誤的註記方式則又是錯在哪？
  ```ts
  /* 題目 5-1 註記 v.s. 斷言 */
  let ex1: number   = 123;
  let ex2           = 123 as number;

  let ex3 as number = 123;  /* 型別斷言語法不能放在宣告變數部分 */

  let ex4           = 123 as string;  /* 型別斷言語法正確，然而數字 number 被斷言為字串 string 本身是不合邏輯的 */

  let ex5           = 123: number;  /* 註記語法不能使用在表達式上，要改就必須改成 123 as number 或 <number>(123)*/

  let ex6           = (123)<number>;  /* 純粹錯誤的斷言語法，改成 123 as number 或 <number>(123) */

  let ex7           = <number>(123);
  ```

  ```ts
  /* 題目 5-2 函式註記方式 */
  let ex1: (x: number, y: string) => string = function(x, y) {
    return x.toString().concat(y);
  };

  /* 函式型別被註記在變數上時，輸出部分必須用箭頭而非冒號，故應改成：
   * let ex2: (x: ...,) => string = function (x, y) {...}
   */
  let ex2: (x: number, y: string): string = function(x, y) {
    return x.toString().concat(y);
  };

  /* 此為函式直接作為值，輸出型別直接以冒號接，故須改成：
   * let ex3 = function (x:...,): string {...}
   */
  let ex3 = function(x: string, y: string) => string {
    return x.toString().concat(y);
  };

  let ex4 = function(x: string, y: string): string {
    return x.toString().concat(y);
  };

  function ex5(x: string, y: string): string {
    return x.toString().concat(y);
  };
  ```

### 6. 試舉出 原始型別(Primitive Types) 與 物件型別(Object Types) 的種類和差異。
  :::details 解答
  `原始型別 (Primitive Types)` 為`數字 (Number)`、`字串 (String)`、`布林值 (Boolean)` 以及 `Undefined`、`Null`；
  
  其餘皆為物件型別，如 `陣列`、`JSON物件` 等。
  :::

### 7.【進階題】觀察以下兩種 JavaScript 分別對變數 `foo` 與 `bar` 指派值的程式碼。
  ```ts
  /* 變數宣告指派式 */
  let foo: number = 123;
  ```

  ```ts
  /* 變數遲滯性指派 Delayed Assignment - 先宣告而後指派 */
  let bar: number;

  // 純變數指派式
  bar = 123;
  ```

  試著用 `TypeScript` 官方的 `Playground` 或者是在 `VSCode` 編輯器實驗並且驗證看看：

  - a) `JavaScript` 裡，以上的 `變數宣告指派式` 的範例 (也就是宣告變數 `foo` 的那一行程式碼) 是屬於敘述式還是表達式？
    :::details 解答
    變數宣告指派式為敘述式，因為回傳結果為 `undefined`，為敘述式典型特徵。
    :::

  - b) `JavaScript` 裡，以上的 `變數指派式` 的範例 (也就是宣告變數 `bar` 的那一行程式碼) 是屬於敘述式還是表達式？
    :::details 解答
    純變數指派式會回傳指派的值作為結果，因此為表達式。
    :::

  - c) 按照結論 a) 與 b) 以及你對於敘述式及判斷式的理解，你能夠解釋得出多重指派 (Multiple Assignment) 的運作原理嗎？
    ```ts
    /* 先告訴 TypeScript 編輯器 bar 是數字型別 */
    let bar: number;

    /* 多重指派 */
    let foo: number = bar = 1;
    ```

    :::details 解答
    多重指派式的部分，變數 `foo` 是宣告的同時被指派值 (視為敘述式)，而被指派的東西為變數 `bar` 的純指派式子 (視為表達式)， `bar` 被指派的值為 1，同時也會回傳數字 1；也就是說，`foo`會被指派變數 `bar` 被指派的值 (即該表達式回傳的值)，也就是數字 1。
    :::

  - d) 按照結論 a) 與 b)，請問以下的註記方式是合理的嗎？
    ```ts
    /* 先告訴 TypeScript 編輯器 bar 是數字型別 */
    let bar: number;

    /* 多重指派 */
    let foo = (bar = 1) as number;
    ```
    :::details 解答
    是，因為純指派式子為表達式，理所當然也可以被型別斷言。
    :::

## 第三章 深入型別系統I 基礎篇
### 1. 請讀者試著驗證看看，以下的程式碼，變數 `whatIsThis` 的最後推論結果為何？
  ```ts
  let whatIsThis;
  let randomNumber = Math.random();

  if(randomNumber < 0.33) {
    whatIsThis = 123;
  } else if (randomNumber < 0.66) {
    whatIsThis = 'string';
  } else {
    whatIsThis = true;
  }

  whatIsThis; // 推論結果為何？
  ```

  若假設更換成 `switch...case...` 判斷敘述式，如下的案例，則變數 `whatIsThis` 的最後推論結果為何？
  ```ts
  let whatIsThis;
  let randomNumber = Math.random();

  switch (true) {
    case randomNumber < 0.33:
      whatIsThis = 123;
      break;
    case randomNumber < 0.66:
      whatIsThis = 'string';
      break;
    default:
      whatIsThis = true;
  }

  whatIsThis; // 推論結果為何？
  ```

  :::details 解答
  第一段程式碼，`whatIsThis` 會被推論為 `string` | `number` | `boolean`;
  第二段程式碼答案跟前一段程式碼一樣。
  :::

### 2. 請讀者試著驗證看看，以下的程式碼，變數 `whatIsThis` 的最後推論結果為何？
  ```ts
  let whatIsThis;

  if(true) {
    whatIsThis = 123;
  } else {
    whatIsThis = '123';
  }

  whatIsThis; // 推論結果為何？
  ```
  如果假設把 `if(true)` 的條件換成其他式子，比如 `if( 1 === 1)`，變數 `whatIsThis` 的最後推論結果為何？

  :::details 解答
  第一段程式碼，`whatIsThis` 會被推論為 `number`；然而，第二段程式碼則是會被推論為 `string` | `number`，`TypeSCript` 只對純布林值排除型別可能出現的結果，遇到邏輯表達式則會涵蓋所有可能推論結果。
  :::

### 3. 變數 `variable` 若採取以下的方式宣告，則該變數此時的 `值` 與推論出來的型別為何？
  ```ts
  let variable;
  ```

  :::details 解答
  `variable` 為遲滯性指派的宣告，宣告的當下，值為 `undefined`，所代表型別則是 `any`。
  :::

### 4. 以下 TypeScript 的程式碼，有沒有可能出現警告訊息？是什麼原因造成的？
  ```ts
  let variable: number;

  if (Math.random() > 0.5) {
    variable = 123;
  }

  console.log(variable);
  ```

  :::details 解答
  由於判斷式有機會不會對 `variable` 指派值，因此會出現錯誤訊息：`Variable 'variable' is used before being assigned.`
  :::

### 5. 如果今天以關鍵字 let 宣告某些物件型別的值，例如：
  ```ts
  let jsonObj = { foo: 123, bar: 'Hello' };
  let funcObj = function (a: number, b: number) { return a + b; };
  let arrayObj = [1, 2, 3, 4, 5];
  ```

  請問以上三種物件，只要型別結構上是正確的話，可以覆寫任何一個物件型別值嗎？
  
  :::details 解答
  是
  :::

### 6. 請解釋以下宣告型別 A 的結構，每個屬性的寫法對應型別的差異性在哪？
  ```ts
  type A = {
    prop1: string;
    prop2: string | undefined;
    prop3?: string;
    prop4?: string | undefined;
    prop5: string | null;
    prop6?: string | null;
  };
  ```

  :::details 解答
  以下是對 `JSON` 物件型別 `A` 中的每個屬性註記的型別進行解釋：

  ```ts
  type A = {
    /* prop1 為必要屬性，必須要有字串型別值 */
    prop1: string;

    /* prop2 為必要屬性，必須要有字串型別值，或者是 undefined，省略掉 prop2 是不行的 */
    prop2: string | undefined;

    /* prop3 為選用屬性，可以省略 prop3，但 prop3 若沒有省略時，則必須為字串型別值 */
    prop3?: string;

    /* prop4 為選用屬性，跟 prop2 差別在於，prop2 不能省略，但 prop4 可以省略 */
    prop4?: string | undefined;

    /* prop5 為必要屬性，可以為字串型別值或 null，但不能為 undefined */
    prop5: string | null;

    /* prop6 為選用屬性，若有使用時，則必須為字串型別值 或 null */
    prop6?: string | null;
  }
  ```
  :::

### 7. 宣告 JSON 物件型別時，若同時在某個屬性加上選用屬性與唯讀屬性操作符，這樣的效果如何？有任何操作上的意義嗎？
  :::details 解答
  `選用屬性` 與 `唯讀屬性` 不可能同時存在，假設某個屬性被設定為唯讀狀態時，設置為選用屬性沒有任何意義。
  :::

### 8. 宣告函式型別中，輸出型別可以根據什麼樣的基準推論出來？至於輸入型別之所以不能無法被推論的主要原因為何？
  :::details 解答
  一般函式的宣告下，輸出型別可以從 `return` 敘述式回傳的值推論出來；相對的，輸入參數之型別不能被推論的原因，則是會受到使用者輸入的值影響，故必須要註記輸入型別。
  :::

### 9. 實驗看看以下的函式的推論結果為何？由此可知，函式輸出型別的判斷基準會因為程式分岔點使得某些地方並不會被執行到而變嗎？
  ```ts
  function what_is_the_inference_result() {
    if (true) { return 42; }

    /* 以下這一行絕對不會被執行 */
    return '42';
  }
  ```

  根據以上的實驗結論，請預測下面的函式之推論結果為何？
  ```ts
  function what_is_the_inference_result() {
    return true;

    /* 以下的程式都不會被執行到 */
    if (true) { return 42; }

    return '42';
  };
  ```

  :::details 解答
  儘管 `what_is_the_inference_result` 之函式內部有判斷式壟斷掉輸出部分為數字型別，
  但是仍然會推斷為 `number | string` 這種聯集複合的型別，
  故可以得出一般函式的輸出型別可以將所有 `return` 敘述式回傳的值之型別聯集起來：
  `function what_is_the_inference_result(): 42 | "42"`。

  第二段程式碼中，函式 `what_is_the_inference_result` 由於多出了回傳布林值 `true` 的 `return` 敘述式，因此推論結果為 `number | string | boolean`。
  :::

### 10. 若遇到函式型別之 return 敘述式接的是 null 或 undefined，請問該函式之輸出型別推論結果為何？
  :::details 解答
  推論之函式回傳型別就是 `null` (亦或者是 `undefined`)，並非 `void`。
  :::

### 11. 請問以下的函式會推論出什麼樣的結果？
  ```ts
  function returns_itself_if_positive(input: number) {
    if (input > 0) return input;
  }
  ```

  :::details 解答
  `number | undefined`，因為判斷式有可能會跳過，因此回傳空值。
  :::

### 12. 請問以下函式宣告的情形，你會如何簡化它？
  ```ts
  function greet(message: string | undefined, name: string | undefined) {
    const msg = message === undefined ? 'Hello' : message;

    if (name === undefined) {
      console.log(`${msg}!`);
      return;
    }
    console.log(`${msg}, ${name}!`);
  }
  ```

  :::details 解答
  以下為參考之簡化結果：
  ```ts
  function greet(message: string = 'Hello', name?: string) {
    if (name === undefined) {
      console.log(`${message}!`);
      return;
    }
    console.log(`${message}, ${name}!`);
  }
  ```
  :::

### 13. 能不能出現同時使用選用參數以及提供預設值的情形？譬如：
  ```ts
  function increment(input: number, value?: number = 1) {
    return input + value;
  }
  ```

  :::details 解答
  函式之參數不能同時存在 `選用參數`，以及 `預設值 `的情形，更精確來說是冗贅的情形，
  畢竟 `選用參數` 若沒有被填入值時，就會自動被 `預設值` 取代，
  程式碼的效果等同於只有預設參數值，因此本題程式碼可以簡化成：
  ```ts
  function increment(input: number, value: number = 1) {
    return input + value;
  }
  ```
  :::

### 14.【進階題】請問以下各種變數推論結果為何？
  ```ts
  let ex1 = [ [1, 2, 3], [4, 5, 6]];
  let ex2 = [ 1, 2, 3, [4, 5, 6]];
  let ex3 = [ [1, 2, 3], [4, 5, 6], []];  // 多一個空陣列
  let ex4 = [ [], [], []];  // 此題答案連作者也意想不到
  
  let ex5 = [
    { foo: 123, bar: 'Hello'},
    { foo: 456, bar: 'World'},
  ];

  let ex6 = [1, , 3, , 4];  // 疏鬆陣列 Sparse Array
  let ex7 = [ , , , , ];  // 完全疏鬆陣列
  ```

  :::details 解答
  推論結果分別如下：
  ```ts
  /* 推論節果為：number[][] */
  let ex1 = [ [1, 2, 3], [4, 5, 6]];

  /* 推論節果為：(number | number[])[] */
  let ex2 = [ 1, 2, 3, [4, 5, 6]];

  /* 推論節果為：number[][] */
  let ex3 = [ [1, 2, 3], [4, 5, 6], []];  // 多一個空陣列

  /* 推論節果為：never[][] */
  let ex4 = [ [], [], []];  // 此題答案連作者也意想不到
  
  /* 推論節果為：({foo: number; bar: string })[] */
  let ex5 = [
    { foo: 123, bar: 'Hello'},
    { foo: 456, bar: 'World'},
  ];

  /* 推論節果為：(number | undefined)[] */
  let ex6 = [1, , 3, , 4];  // 疏鬆陣列 Sparse Array

  /* 推論節果為：undefined[] */
  let ex7 = [ , , , , ];  // 完全疏鬆陣列
  ```
  :::

### 15. 根據條目 3.2.1 提到的型別推論機制的特點 -- 固定性，其解釋如下：
  > 一經推論過後的變數，並且該變數宣告時是使用 `let` 關鍵字，後續任何指派到該變數的值，必須符合該變數被推論之型別的範疇。
  請問 `JSON` 物件、函式、陣列等，是否也符合這一項特性？
  ```ts
  /* 宣告型別為 { foo: number; bar: string} 的 JSON 物件 */
  let jsonObj = { foo: 123, bar: 'Hello'};

  /* 是不是可以被同樣格式的 JSON 物件覆寫？ */
  jsonObj = { bar: 'World', foo: 456};

  // 同理，函式或陣列是不是也可以按照上面的方式，只要型別符合
  // 使用 let 關鍵字宣告的變數也可以被覆寫
  ```

  :::details 解答
  是。
  :::

### 16. 請問以下的變數推論結果各為何？
  ```ts
  let   ex1 = 123;
  const ex2 = 123;
  let   ex3 = {foo: 123, bar: 'Hello'};
  const ex4 = {foo: 123, bar: 'Hello'};
  ```

  :::details 解答
  推論結果分別如下：
  ```ts
  /* 推論結果為：number */
  let   ex1 = 123;

  /* 推論結果為：123 */
  const ex2 = 123;

  /* 推論結果為：{ foo: number; bar: string } */
  let   ex3 = {foo: 123, bar: 'Hello'};

  /* 推論結果為：{ foo: number; bar: string } */
  const ex4 = {foo: 123, bar: 'Hello'};
  ```
  :::

### 17. 請問以下的兩種寫法，效果會有差嗎？
  ```ts
  const withoutAnnotation = { hello: 'world' };
  const withAnnotation: { hello: 'world' } = { hello: 'world' };
  ```

  :::details 解答
  前者部分，儘管變數是宣告常數狀態，但在 `JavaScript` 裡，
  `JSON`物件的屬性對應值仍然可以修改，因此推論結果為 `{ hello: string }`；
  後者註記部分除了強調是 `{ hello: string }` 這種 `JSON` 物件型別結構外，
  還強調 `hello` 屬性對應的值只能為 `'world'`，故後者的物件完全是型態是為鎖死的狀態。
  :::
  
### 18. 假設宣告幾個跟幾何形狀 (Geometry) 相關的型別化名如下：
  ```ts
  type Rectangle = {  // 長方形的面積公式 = width * height
    width: number;
    height: number;
  }

  type Triangle = {   // 三角形的面積公式 = base * height / 2
    base: number;
    height: number;
  }

  type Circle = {   // 圓形的面積公式為 = Math.PI * radius * radius
    radius: number;
  }
  ```
  其中，將這三種不同的型別使用聯集的方式複合起來，宣告出新的型別化名：
  ```ts
  type Geometry = Rectangle | Triangle | Circle;
  ```

  請設計出函式 `area`，輸入型別為 `Geometry` 的資料 (不能為其他型別的輸入)，回傳結果為輸入的幾何圖形資料的面積 (輸出型別為 `number`)：
  ```ts
  function area(geometry: Geometry): number {
    // 實作功能
  }
  ```

  此外，允許額外新增屬性規格到型別化名 `Reatangle`、`Triangle` 以及 `Circle` 上。

  所有的型別化名原有的屬性規格不能夠被改變或刪除。

  提示：
  ```ts
  function areaOfRectangle(rect: Rectangle) {   // Rectangle 面積算法
    return rect.width * rect.height;
  }
  function areaOfTriangle(tri: Triangle) {    // Triangle 面積算法
    return tri.base * tri.height / 2;
  }
  function areaOfCircle(cir: Circle) {
    return Math.PI * cir.radius * cir.radius;
  }
  ```

  :::details 解答
  將 `Rectangle`、`Triangle`、`Circle` 型別部分新增 `kind` 這個屬性，使得 `Geometry` 變成互斥聯集後，
  剩下就是實作細節，程式碼參考如下：
  ```ts
  type Rectangle = {
    kind: 'Rectangle';
    width: number;
    height: number;
  }

  type Triangle = {
    kind: 'Triangle';
    base: number;
    height: number;
  }

  type Circle = {
    kind: 'Circle';
    radius: number;
  }

  type Geometry = Rectangle | Triangle | Circle;

  function area(geometry: Geometry): number {
    if(geometry.kind === 'Rectangle') {
      return geometry.width * geometry.height;
    } else if (geometry.kind === 'Triangle') {
      return Triangle.base * Triangle.height / 2;
    }

    /* 剩下為計算圓形的面積 */
    return Math.PI * geometry.radius * geometry.radius;
  }
  ```
  :::

## 第四章 深入型別系統II 進階篇
### 1. 元組 (Tuple) 與陣列 (Array) 有什麼差異性？
  :::details 解答
  - `陣列 (Array)` 無關乎順序，元素的數量也沒有任何限制；
  - `元組` 的元素型別順序與個數，則有特定限制。
  :::

### 2. 親自實驗一下，以下各個變數之推論結果為何？
  ```ts
  type TripleNumber = [number, number, number];

  let ex1 = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];

  let ex2 = [
    [1, 2, 3] as TripleNumber,
    [4, 5, 6] as TripleNumber,
    [7, 8, 9] as TripleNumber
  ];

  let ex3 = [
    [1, 2, 3] as TripleNumber,
    [4, 5, 6] as TripleNumber,
    [7, 8, 9]   // 少一個斷言
  ];

  type QuadrupleNumber = [number, number, number, number];

  let ex4 = [
    [1, 2, 3] as TripleNumber,
    [4, 5, 6] as TripleNumber,
    [7, 8, 9, 10] as QuadrupleNumber
  ];

  let ex5 = [
    [1, 2, 3],  // 少一個斷言
    [4, 5, 6] as TripleNumber,
    [7, 8, 9, 10] as QuadrupleNumber
  ]
  ```

  :::details 解答
  ```ts
  type TripleNumber = [number, number, number];

  /* 推論結果為： number[][] */
  let ex1 = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];

  /* 推論結果為： TripleNumber[] */
  let ex2 = [
    [1, 2, 3] as TripleNumber,
    [4, 5, 6] as TripleNumber,
    [7, 8, 9] as TripleNumber
  ];

  /* 推論結果為： number[] */
  let ex3 = [
    [1, 2, 3] as TripleNumber,
    [4, 5, 6] as TripleNumber,
    [7, 8, 9]   // 少一個斷言
  ];

  type QuadrupleNumber = [number, number, number, number];

  /* 推論結果為： (TripleNumber | QuadrupleNumber)[] */
  let ex4 = [
    [1, 2, 3] as TripleNumber,
    [4, 5, 6] as TripleNumber,
    [7, 8, 9, 10] as QuadrupleNumber
  ];

  /* 推論結果為： number[][] */
  let ex5 = [
    [1, 2, 3],  // 少一個斷言
    [4, 5, 6] as TripleNumber,
    [7, 8, 9, 10] as QuadrupleNumber
  ]
  ```
  :::

### 3. 承上題，以上的每個陣列，若根據推論結果，以最外層陣列為主，哪些是同質性陣列？哪些則是異質性陣列？
  :::details 解答
  除了 `ex4` 的推論結果為 `(TripleNumber | QuadrupleNumber)[]`，為異質性陣列外，其餘皆為同質性陣列；同質或異質性陣列的判斷基準以推論之陣列的型別種類個數為基準。
  :::

### 4. 請問以下各種變數的推論結果為何？
  ```ts
  enum Pet { Dog, Cat, Bird, Duck };

  let   ex1 = Pet.Cat;
  const ex2 = Pet.Cat;
  let   ex3 = Pet[Pet.Cat];
  const ex4 = Pet[Pet.Cat];
  let   ex5 = Pet[2];
  const ex6 = Pet[2];
  ```

  :::details 解答
  ```ts
  /* 推論結果為： Pet */
  let   ex1 = Pet.Cat;

  /* 推論結果為： Pet.Cat，為列舉成員型別 */
  const ex2 = Pet.Cat;

  /* 推論結果為： string */
  let   ex3 = Pet[Pet.Cat];

  /* 推論結果為： string */
  const ex4 = Pet[Pet.Cat];

  /* 推論結果為： string */
  let   ex5 = Pet[2];

  /* 推論結果為： string */
  const ex6 = Pet[2];
  ```
  :::

### 5. 請問以下各個變數的推論結果為何？
  ```ts
  enum Vehicle {
    Car = 'Car',
    Bicycle = 'Bicycle',
    Truck = 'Truck',
    Bus = 'Bus'
  }

  let   ex1 = Vehicle.Truck;
  const ex2 = Vehicle.Bus;
  let   ex3 = Vehicle[Vehicle.Car];
  const ex4 = Vehicle[Vehicle.Bicycle];
  ```

  :::details 解答
  ```ts
  /* 推論結果為： Vehicle */
  let   ex1 = Vehicle.Truck;

  /* 推論結果為： Vehicle.Bus，為列舉成員型別 */
  const ex2 = Vehicle.Bus;

  /*
  * 推論結果為： Vehicle，原因是 Vehicle.Car 為字串 'Car'，
  *            然後變成 Vehicle['Car']，於是等效於 Vehicle.Car
  */
  let   ex3 = Vehicle[Vehicle.Car];

  /*
  * 推論結果為： Vehicle.Bicycle，原因是 Vehicle.Bicycle 為字串 'Bicycle'，
  *            然後變成 Vehicle['Bicycle']，於是等效於 Vehicle.Bicycle
  */
  const ex4 = Vehicle[Vehicle.Bicycle];
  ```
  :::

### 6. 【 進階題 】列舉型別具備的映射性，其中，如果是以下的情形：
  ```ts
  enum Vehicle {
    Car = 'Car',
    Bicycle = 'Bike',
    Truck = 'Pickup Truck',
    Bus = 'Coach'
  }
  ```
  除了 `Vehicle.Car` 名稱與對應的值 `Car` 一模一樣，因此具備映射性外，其他的成員名稱與對應字串值皆不同，因此不具備映射性。

  請思考原因為何？

  :::details 解答
  除了 `Vehicle.Car` 等於字串 `'Car'` 以外，其餘的列舉成員值不等於列舉的成員名稱，使得無法用 `Vehicle[Vehicle.[成員]]` 方式逆向映射。
  :::

### 7. 請問以下的寫法，大概會被編譯成什麼樣的結果？列舉有無宣告成常數的差別在哪裡？
  ```ts
  enum Pet {
    Dog = 123,
    Cat,
    Bird = 'Bird',
    Duck = 456
  };

  const enum Vehicle {
    Car = 'Car',
    bicycle = 99,
    Truck,
    Bus = 'Coach'
  };

  const foo = Pet.Cat + Vehicle.Truck;
  console.log(Vehicle.Bicycle - Pet.Dog);
  ```

  :::details 解答
  常數列舉部分會直接將列舉的成員值帶入到任何使用常數列舉的成員部分，省略掉建構列舉對應的 JSON 物件；`大略` 的編譯結果如下 (隨著版本不同可能會有異動，但大致上不會有太多影響)：

  ```js
  var Pet;
  (function (Pet) {
    Pet[Pet["Dog"] = 123] = "Dog";
    Pet[Pet["Cat"] = 124] = "Cat";
    Pet["Bird"] = "Bird";
    Pet[Pet["Duck"] = 456] = "Duck";
  })(Pet || (Pet = {}));

  var foo = Pet.Cat + 100 /* Truck */;
  console.log(99 - Pet.Dog);
  ```
  :::

### 8. 如何宣告出物件的值 (Value) 只能為特定型別 T 的 JSON 物件型別？
  :::details 解答
  最簡單的方式是：
  ```ts
  type Dictionary = { [key: string]: <特定型別>}
  ```
  :::

### 9. 如何取得某 JSON 物件型別 { a: number; b: string; c: boolean } 裡，所有鍵的明文型別的聯集 'a' | 'b' | 'c' ？以及所有值的型別的聯集 number | string | boolean ？
  :::details 解答
  參考程式碼：
  ```ts
  type example = { a: number; b: string; c: boolean };

  /* 取得 example 所有的鍵 'a' | 'b' | 'c' */
  type keyofExample = keyof example;

  /* 取得 example 所有的值之型別聯集 */
  type valueofExample = example[keyofExample];
  ```
  :::

### 10. 就讀者目前所學，將 JSON 物件變成唯讀狀態的方式有哪些？
  :::details 解答
  - 使用 `readonly` 關鍵字宣告 `JSON` 物件的屬性；
  - 使用 `Readonly<T>` 這個泛用型別；
  - 使用 `Object.freeze` 方法。
  :::

### 11. 請問以下的型別化名，個別推論結果為何？
  ```ts
  type Ex1 = number | string | boolean | undefined | null;
  type Ex2 = number & string & boolean & undefined & null;
  type Ex3 = undefined | null;
  type Ex4 = undefined & null;
  type Ex5 = number | 123;
  type Ex6 = number & 123;
  type Ex7 = never | number;
  type Ex8 = never & number;
  type Ex9 = any | number;
  type Ex10 = any & string;
  type Ex11 = unknown | number;
  type Ex12 = unknown & string;
  type Ex13 = never | any;
  type Ex14 = never & any;
  type Ex15 = never | unknown;
  type Ex16 = never & unknown;
  type Ex17 = any | unknown;
  type Ex18 = any & unknown;
  type Ex19 = never | any | unknown;
  type Ex20 = never & any & unknown;
  ```

  :::details 解答
  ```ts
  /* 推論結果與自身一模一樣 */
  type Ex1 = number | string | boolean | undefined | null;
  type Ex2 = number & string & boolean & undefined & null;
  type Ex3 = undefined | null;
  type Ex4 = undefined & null;

  /* 推論結果為： number */
  type Ex5 = number | 123;

  /* 推論結果為： 123 */
  type Ex6 = number & 123;

  /* 推論結果為： number，因為 never 為任何型別的基底型別 */
  type Ex7 = never | number;

  /* 推論結果為： never */
  type Ex8 = never & number;

  /* 推論結果為： any */
  type Ex9 = any | number;

  /* 推論結果為： any */
  type Ex10 = any & string;

  /* 推論結果為： unknown */
  type Ex11 = unknown | number;

  /* 推論結果為： string */
  type Ex12 = unknown & string;

  /* 推論結果為： any */
  type Ex13 = never | any;

  /* 推論結果為： never，因為 never 仍然是 any 的基底型別 */
  type Ex14 = never & any;

  /* 推論結果為： unknown */
  type Ex15 = never | unknown;

  /* 推論結果為： never，因為 never 仍然是 unknown 的基底型別 */
  type Ex16 = never & unknown;

  /* 推論結果為： any */
  type Ex17 = any | unknown;

  /* 推論結果為： any */
  type Ex18 = any & unknown;

  /* 推論結果為： any */
  type Ex19 = never | any | unknown;

  /* 推論結果為： never */
  type Ex20 = never & any & unknown;
  ```
  :::

### 12. 若註記某變數為 Any 型別時，則任何型別的值或表達式都可以指派到該變數中？
  ```ts
  let variable: any = /* 任意值或表達式 */;
  ```

  :::details 解答
  是。
  :::

### 13. 若註記某變數為 Never 型別時，則任何型別的變數或表達式都可以指派到該變數中？
  ```ts
  let variable: never = /* 任意值或表達式 */;
  ```

  :::details 解答
  否，因為 `never` 為任何對應之型別之基底型別，因此反推 `never` 不屬於任何除了 `never` 以外的型別。
  :::

### 14. 若註記某變數為 Unknown 型別時，則任何型別的變數或表達式都可以指派到該變數中？
  ```ts
  let variable: unknown = /* 任意值或表達式 */;
  ```

  :::details 解答
  是。
  :::

## 第五章 TypeScript 類別基礎
### 1. 類別裡的成員變數 (Member Variables) 與建構出的實體屬性 (Property) 差異性在哪？
  :::details 解答
  `成員變數 (Member Variable)` 與建立出的 `實體屬性 (Property)` 儘管差異不大，但是 `實體屬性` 可以視為 `開放 (Public)` 狀態的成員變數。
  :::

### 2. 建構子函式 (Constructor Function) 是什麼？
  :::details 解答
  類別建構實體，也就是初始化物件的函式。
  :::

### 3. 存取修飾子 (Access Modifiers) 是什麼？
  :::details 解答
  `存取修飾子 (Access Modifiers)` 可以調整成員的封裝狀態，分成 `開放 (Public)`、`私有 (Private)` 以及 `保護 (Protected)` 模式；
  - `開放狀態` 泛指成員可以在任何地方使用
  - `私有狀態` 則是只能在類別宣告內部使用
  - `保護狀態` 下的成員除了可以在類別內部使用外，也可以在繼承的子類別下使用該成員
  :::

### 4. 試簡化以下的程式碼
  ```ts
  class Example {
    public prop1: string;
    private prop2: number;
    protected prop3: boolean = true;

    constructor(input1: string, input2: number) {
      this.prop1 = input1;
      this.prop2 = input2.toUpperCase();
    }
  }
  ```

  :::details 解答
  ```ts
  class Example {
    private prop2: number;
    protected prop3: boolean = true;

    constructor(public input1: string, input2: number) {
      this.prop2 = input2.toUpperCase();
    }
  }
  ```
  :::

### 5. 試宣告類別長方形 Rectangle 的程式碼，並且擁有以下的規格：
  - 擁有兩個私有狀態的成員 `width` 與 `height`，皆為數字型別的值。
  - 擁有兩個開放狀態的成員方法 `calcArea` 與 `calcCircumference`，分別為計算長方形面積與周長的方法。
    - 面積公式為： `width * height`
    - 周長公式為： `(width + height) * 2`
  - 初始化時，第一個參數初始化成員變數 `width` 的值，第二個參數初始化成員變數 `height` 的值。

  宣告完的類別長方形 `Rectangle` 的程式碼的使用方式如下：
  ```ts
  const rect = new Rectangle(4, 5);  // width 為 4 與 height 為 5 的長方形

  /* 以下這兩行會出現錯誤，因為屬性都是私有狀態 */
  // rect.width;
  // rect.height;

  /* 長方形的面積與周長 */
  console.log(rect.calcArea());
  // => 20

  console.log(rect.calcCircumference());
  // => 18
  ```

  :::details 解答
  ```ts
  class Rectangle {
    constructor(private width: number, private height: number) {}

    public calcArea() {
      return this.width * this.height;
    }

    public calcCircumference() {
      return (this.width + this.height) * 2;
    }
  }
  ```
  :::

### 6. 承第 5 題，想要讓 `Rectangle` 實體可以使用 `setWidth` 或 `setHeight`，更改類別內部成員變數的值，你會如何修改 `Rectangle` 內部的宣告方式？ (以下為 Rectangle 修改後的使用方式)
  ```ts
  const rect = new Rectangle(4, 5);  // width 為 4 與 height 為 5 的長方形

  console.log(rect.calcArea());
  // => 20

  console.log(rect.calcCircumference());
  // => 18

  /* 修改長方形的 width 和 height */
  rect.setWidth(7); // width 被修改為 7
  rect.setHeight(4);  // height 被修改為 4

  console.log(rect.calcArea());
  // => 28
  console.log(rect.calcCircumference());
  // => 22
  ```

  :::details 解答
  ```ts
  class Rectangle {
    constructor(private width: number, private height: number) {}

    public calcArea() {
      return this.width * this.height;
    }

    public calcCircumference() {
      return (this.width + this.height) * 2;
    }

    public setWidth(width: number) {
      this.width = width;
    }

    public setHeight(height: number) {
      this.height = height;
    }
  }
  ```
  :::

### 7. 承第 6 題，如何在不宣告新的成員變數與成員方法的條件下，實踐出新的版本的 `Rectangle` 類別，使得呼叫實體的屬性 `area` 檢視長方形的面積、屬性 `circumference` 檢視長方形的周長也會隨 `width` 或 `height` 改變時更新？
  ```ts
  const rect = new Rectangle(4, 5);  // width 為 4 與 height 為 5 的長方形

  console.log(rect.calcArea());
  // => 20
  console.log(rect.calcCircumference());
  // => 18

  /* 修改長方形的 width 和 height */
  rect.setWidth(7); // width 被修改為 7
  rect.setHeight(4);  // height 被修改為 4

  console.log(rect.calcArea());
  // => 28
  console.log(rect.calcCircumference());
  // => 22
  ```

  :::details 解答
  ```ts
  class Rectangle {
    constructor(private width: number, private height: number) {}

    get area() {
      return this.width * this.height;
    }

    get circumference() {
      return (this.width + this.height) * 2;
    }

    public setWidth(width: number) {
      this.width = width;
    }

    public setHeight(height: number) {
      this.height = height;
    }
  }
  ```
  :::

### 8. 承第 7 題，假設今天想要實踐出 `Rectangle` 實體以下的行為：
  ```ts
  const rect = new Rectangle(4, 5);  // width 為 4 與 height 為 5 的長方形

  console.log(rect.calcArea());
  // => 20
  console.log(rect.calcCircumference());
  // => 18

  /**
   * 指派 [number, number] 型別的值進到 dimension 屬性，
   * 第一個值可以改掉 width，第二個值可以改掉 height
   */
  rect.dimension = [7, 4] as [number, number];
  // width 被修改為 7，height 被修改為 4

  console.log(rect.calcArea());
  // => 28
  console.log(rect.calcCircumference());
  // => 22
  ```

  當指派元組型別 `[number, number]` 的值到實體的屬性 `dimension` 就會修改 `width` 或 `height` 的值，試修改類別 `Rectangle` 的宣告方式。

  :::details 解答
  ```ts
  class Rectangle {
    constructor(private width: number, private height: number) {}

    get area() {
      return this.width * this.height;
    }

    get circumference() {
      return (this.width + this.height) * 2;
    }

    set dimension(input: [number, number]) {
      this.width = input[0];
      this.height = input[1];
    }
  }
  ```
  :::

### 9. 承第 8 題，試宣告正方形類別 `Square`，其特徵是只有一個輸入 `size`，並且計算面積與周長的方式跟類別 `Rectangle` 一模一樣，差異在於 -- 類別 `Square` 的屬性 `size` 為 `Rectangle` 中的成員變數 `width` 與 `height` 皆相等的情形。 (註：本題的 `size` 不一定要宣告為 `Square` 的成員變數)。

  以下是類別 `Square` 的使用情形，以及等效的 `Rectangle` 使用情形：
  ```ts
  const sq = new Square(5); // size 為 5 的正方形
  const rect = new Rectangle(5, 5); // width 為 5 與 height 為 5 的長方形

  console.log(sq.area);
  // => 25
  console.log(rect.area);
  // => 25
  ```

  :::details 解答
  ```ts
  class Rectangle {
    /* 同第 8 題宣告方式 */
  }

  class Square extends Rectangle {
    constructor(size: number) {
      super(size, size);
    }
  }
  ```
  :::

### 10. 承第 8 題，試改成新的版本的類別 `Rectangle`，滿足以下的使用方式。
  ```ts
  // 計算 width 為 4 以及 height 為 5 的長方形面積
  console.log(Rectangle.area(4, 5));
  // => 20

  // 計算 width 為 4 以及 height 為 5 的長方形周長
  console.log(Rectangle.circumference(4, 5));
  // => 18
  ```

  :::details 解答
  ```ts
  class Rectangle {
    static area(width: number, height: number) {
      return width * height;
    }

    static circumference(width: number, height: number) {
      return (width + height) * 2;
    }
  }
  ```
  :::

### 11. 類別的普通成員與靜態成員差異性在哪裡？靜態成員跟普通成員在命名上可以重複嗎？
  :::details 解答
  類別 `普通成員` 與 `靜態成員` 差異在於，
  宣告 `普通成員` 為建構出的實體之介面，
  而 `靜態成員` 則是類別建構子函式本身的成員，因此 `靜態成員` 只會建構一次，也就是類別被宣告的那個剎那；
  因為兩者性質不同，故命名可以重複。
  :::

### 12. 任何普通成員與靜態成員皆可以標註存取修飾子？
  :::details 解答
  是，但存取修飾子，必須優先於 `static` 關鍵字。
  :::

### 13. 若類別 Parent 與 類別 Child 的宣告方式如下：
  ```ts
  class Parent {
    constructor(public propA: number, public propB: string) {}

    public methodA() {}
  }

  class Child extends Parent {
    constructor(inputA: number, inputB: string) {
      super(inputA, inputB);
    }

    public methodA() {}
  }
  ```

  請問以下的指派行為會有錯誤嗎？
  ```ts
  const annotatedAsChild: Child = new Parent(123, 'Hello world');
  const annotatedAsParent: Parent = new Child(123, 'Hello world');
  ```

  :::details 解答
  事實上不會，因為子類別與父類別建構出的實體結構一樣，故不會有問題。
  :::

### 14. 承 13 題，若 `Parent` 宣告方式不變，`Child` 宣告方式為：
  ```ts
  class Child extends Parent {
    constructor(inputA: number, inputB: string) {
      super(inputA, inputB);
    }

    public methodA() {}
    public methodB() {} // 多出成員方法 methodB
  }
  ```

  這樣會造成第 13 題的指派行為出錯嗎？

  :::details 解答
  子類別建構的實體，若指派到父類別的型別變數上，是絕對可以的；
  但子類別有額外宣告父類別所沒有的成員，父類別的實體就不能指派到子類別型別的變數上。
  :::

### 15. 承 13 題，若 `Parent` 宣告方式不變，`Child` 宣告方式為：
  ```ts
  class Child extends Parent {
    constructor(inputA: number, inputB: string) {
      super(inputA, inputB);
    }

    public methodA() {}
    private methodB() {}  // 多出私有成員方法 methodB
  }
  ```

  這樣會造成第 13 題的指派行為出錯嗎？

  :::details 解答
  經過實驗結果，不管成員是否為開放模式，
  只要子類別有額外宣告父類別所沒有的成員，父類別的實體就不能指派到子類別型別的變數上。
  :::

### 16. 承 13 題，若 `Parent` 宣告方式不變，`Child` 宣告方式為：
  ```ts
  class Child extends Parent {
    constructor(inputA: number, inputB: string) {
      super(inputA, inputB);
    }

    public methodA() {}
    static methodB() {} // 多出類別方法 methodB
  }
  ```

  這樣會造成第 13 題的指派行為出錯嗎？

  :::details 解答
  由於 `靜態成員` 與 `普通成員` 性質不同，因此不會有問題。
  :::

## 第六章 TypeScript 介面
### 1. 普通介面的宣告與純函式介面的宣告差異性在哪
  :::details 解答
  - 普通介面為代表物件性質 (Property) 以及函式 (Method) 的組合；
  - 純函式介面的宣告僅止於純函式規格的宣告。
  :::

### 2. 若類別實踐介面時，以下的實踐方式是可以接受的嗎？
  ```ts
  interface ICircle {
    radius: number;
    area: number;
  }

  class Circle implements ICircle {
    constructor(public radius: number) {}

    get area(): number {
      return Math.PI * (this.radius ** 2);
    }
  }
  ```
  :::details 解答
  是，類別使用存取方法 (Accessors) 依然能夠達到模擬物件屬性的目的，差別在於內部的實作方式與普通屬性不一樣。
  :::

### 3. 以下兩種介面的宣告方式會有什麼樣的效果？
  ```ts
  interface Addition1 {
    (input1: number, input2: number): number;
  }

  interface Addition2 {
    addition(input1: number, input2: number): number;
  }
  ```
  :::details 解答
  - `Addition1` 為純函式介面的宣告，因為沒有特別命名；
  - `Addition2` 為普通介面的宣告，其規格為在物件上實踐名為 `addition` 的方法而已。
  :::

### 4. 以下介面的宣告方式會有什麼樣的效果？
  ```ts
  interface Addition {
    (input1: number, input2: number): number;
  }

  interface Addition {
    (input1: string, input2: string): number;
  }
  ```
  :::details 解答
  同一名稱的介面重複宣告時會進行融合，而剛好都是宣告純函式介面，因此融合過後會進行函式的 `超載性宣告 (Function Overloading)`。
  :::

### 5. 以下兩種介面的宣告方式是等效的嗎？
  ```ts
  interface Addition1 {
    (input1: number | string, input2: number | string): number;
  }

  interface Addition2 {
    (input1: number, input2: number): number;
    (input1: string, input2: string): number;
  }
  ```
  :::details 解答
  否，
  - `Addition1` 中的函式介面，兩個參數可以為數字或字串型別，因此有四種輸入組合 (`數字-數字`、`字串-字串`、`數字-字串`、`字串-數字`)；
  - 而後者 `Addition2` 中的函式介面，經過超載性宣告的結果，只會有兩種輸入組合 (`數字-數字`、`字串-字串`)
  :::

### 6. 宣告一個介面與型別化名的差異性在哪？
  ```ts
  type T = /* ... */;
  interface I = { /* ... */ }
  ```
  :::details 解答
  使用上儘管差異看起來不大，不過可以從幾個點簡單點出差別：
  - `型別化名` 可以表示任何一種資料型態與結構；
    `介面` 除了原始型別與特殊型別(如：元組、列舉等)之外，只能表達物件型別的結構，包含 `JSON物件`、函式與類別的規格。
  - `型別化名` 的意義是宣告靜態型資料結構，不鼓勵頻繁的更動型別化名的宣告內容；
    `介面` 則是宣告物件應實踐出的規格，使用上比較靈活，可以自由組合。
  - `型別化名` 在 `TypeScript` 裡的運作，事實上並非宣告出全新的型別，而是代替某複雜結構的 `名稱`；
    `介面` 的宣告則在 `TypeScript` 編譯過程中，用該介面的名稱代表某物件或函式規格。
  - `型別化名` 嚴格來說不能夠像 `介面` 一般進行延伸，不過仍然可以藉由 `交集複合 (Intersection)` 的方式處理；
    `介面` 則可以自由延伸 (亦或者被稱作是介面的繼承)。
  :::

## 第七章 深入型別系統 III 泛用型別
### 1. 檢視以下的範例，若想將 `isTruthy` 函式型別改成泛用的形式，要求輸入參數 input 可以為設定成特定的型別時，要如何修改？
  ```ts
  type isTruthy = (input: any) => boolean;
  ```

  :::details 解答
  ```ts
  type isTruthy<T> = (input: T) => boolean;
  ```
  :::

### 2. 承上題，若想要限制宣告的型別參數範圍，只能為 `原始型別 (Primitive Type)` 類型的值，則該如何修改泛用宣告？
  :::details 解答
  ```ts
  type Primitives = number | string | boolean | null | undefined;
  type isTruthy<T extends Primitives> = (input: T) => boolean;
  ```
  :::

### 3. 一般使用 JavaScript 陣列 (也就是 Array) 相關的方法時，其中一個最常用到的方法是 `Array.prototype.forEach`，為陣列的元素迭代方法。請在編輯器 (也就是 VSCode) 裡，檢視並且實驗以下的程式碼：
  ```ts
  const arr = [1, 2, 3, 4, 5];

  // 迭代每個元素，並且將每個元素印出來
  arr.forEach(function callback(el) {
    console.log(el);
  })
  ```
  試著想想看，為何裡面的回呼函式 `callback` 之參數不用註記，仍然不會出現錯誤訊息？

  :::details 解答
  變數 `arr` 被推論之型別為 `number[]`，而 `TypeScript` 內建陣列的另一種泛用型別表示方式為 `Array<T>`，而此時 `arr` 中的 `T` 為數字型別；由於泛用型別中的型別參數可以間接表達方法應該填入參數型別，而檢視程式碼中 `arr.forEach` 的型別提示就已經告訴開發者，該方法內部的回呼函式，參數會自動被推論為數字型別：
  ```ts
  /* 以下為 VSCode 編輯器應當出現的提示內容 */
  (method) Array<number>.forEach(
    callbackfn: (
      value: number,
      index: number,
      array: number[]
    ) => void,
    thisArg?: any
  ): void
  ```
  :::

### 4. JSON 物件型別的唯讀屬性部分，講到 `Readonly<T>` 這個 `TypeScript` 內建的 `應用型別 (Utility Type)`，它會將所有物件裡的屬性全部轉換成唯讀狀態，請問等校的宣告方式是什麼？
  :::details 解答
  ```ts
  type CustomReadonly<T> = {
    readonly [Key in keyof T]: T[Key]
  }
  ```
  :::

### 5. 請問以下的泛用介面的宣告方式， method1、method2 與 method3 三種規格的差異性在哪？
  ```ts
  interface I<T> {
    method1(input: T): T;
    method2<U>(input: U): T;
    method3<T>(input: T): T;
  }
  ```
  :::details 解答
  - 介面 `I<T>` 只有一個型別參數 `T`，而該型別參數所代表之型別會自動代入到 `method1` 中該型別參數存在的地方，以及 `method2<U>` 的輸出型別；
  - 而 `method2<U>` 的型別參數 `U` 會代入到輸入部分；
  - 最後，`method3<T>` 的型別參數恰好跟介面 `I<T>` 的型別參數命名一樣，不過它會以 `method3<T>` 的型別參數的值為主，代入到 `method3<T>` 的輸入與輸出部分。
  :::

### 6. 請問以下兩種函式的宣告方式，差異性在哪裡？
  ```ts
  interface Lengthwise {
    length: number;
  }

  function ex1(input: Lengthwise) { /* 函式實踐內容略... */ }
  function ex2<T extends Lengthwise>(input: T) { /* 函式實踐內容略... */ }
  ```

  :::details 解答
  - 函式 `ex1` 的輸入部分，如果用明文物件形式代入值時，就只能出現一個屬性，也就是 `length`；
  - `ex2` 的輸入部分，只要出現 `length` 屬性的物件 (包含陣列) 都可以代入。

  ```ts
  /* ex1 只能代入以下的值 */
  ex1({ length: 123 });

  /* ex2 可以代入至少有 length 屬性的值 */
  ex2({ length: 123 });
  ex2({ length: 123, hello: 'world' });
  ex2([1, 2, 3]);
  ```
  :::

### 7.【進階題】以下的程式碼用原生 JavaScript 宣告一個 valuesOfJSON 函式，輸入一個 JSON 物件，輸出為 JSON 物件的值的陣列：
  ```ts
  function valuesOfJSON(input) {
    const keys = Object.keys(input); // 將 JSON 的鍵 (key) 全部拔出來
    const result = [];
    for (let i = 0; i < keys.length; i += 1) {
      result.push(obj[keys[i]]);
    }
    return result;
  }
  ```
  函式 `valuesOfJSON` 的使用範例如下：
  ```ts
  // valuesOfJSON 會將 JSON 物件的值全部都輸出
  console.log(valuesOfJSON({ hello: 'world', num: 123 }));
  // => ['world', 123]

  console.log(valuesOfJSON({ prop1: true, prop2: 100, prop3: 'Max'}));
  // => [true, 100, 'Max']
  ```

  試著將函式 `valuesOfJSON` 轉換成 TypeScript 的宣告寫法，`除了必須註記輸入外，輸出也必須註記`，格式如下：
  ```ts
  function valuesOfJSON(input: /* 輸入型別 */): /* 輸出型別 */ {
    /* 實踐過程略... */
  }
  ```
  如果必要，可以將 `valuesOfJSON` 宣告成泛用型式，也可以額外宣告其他型別化名或介面進行輔助。

  :::details 解答
  ```ts
  interface Dictionary<T = any> {
    [key: string]: T;
  }

  function valuesOfJSON<T extends Dictionary, U extends keyof T> (obj: T): T[U][] {
    /* ... */
  }
  ```
  :::

## 第八章 TypeScript 模組系統
### 1. 以下兩種引入東西的方式差異性在哪？
  ```ts
  import A from './module_A';
  import { A } from './module_B';
  ```
  :::details 解答
  - 前者為引入 `預設輸出 (Default Export)` 的模組；
  - 後者則是引入 `特定的模組`。
  :::

### 2. 請問可以在型別宣告的同時進行輸出嗎？
  ```ts
  export type T = /* T 之型別內容 */
  ```
  :::details 解答
  可以。
  :::

### 3. 如何引用此模組內的所有東西？ (試著展示各種不同的寫法)
  ```ts
  type T = /* T 之型別內容 */;
  type U = /* U 之型別內容 */;

  export { T };
  export default U;
  ```
  :::details 解答
  ```ts
  /* 方法 1： */
  import U, { T } from '...';
  /* 方法 2： */
  import { default as U, T} from '...';
  /* 方法 3： */
  import * as M from '...';
  // M.default 為 U；
  // M.T 為 T
  ```
  :::

### 4. 若提供一個原生 JavaScript 的套件，其內容為：
  ```ts
  // example-module.js

  // input1 與 input2 皆可能為數字或字串型別的值
  export function addition(input1, input2) {
    const value1 = typeof input1 === 'number' ?
      input1:
      parseInt(input1, 10);

    const value2 = typeof input2 === 'number' ?
      input2:
      parseInt(input2, 10);

    return value1 + value2;
  }
  ```
  你會如何將其引入 `TypeScript` 專案裡？
  :::details 解答
  撰寫型別定義檔，並且必須命名為 `example-module.d.ts`，而後將 `addition` 函式規格定義出來：
  ```ts
  /* example-module.d.ts */
  declare function addition(
    input1: number | string,
    input2: number | string
  ): number;
  ```
  :::

### 5. Lodash 為常見的 JavaScript 套件之一，以下提供簡單的範例程式碼：
  ```ts
  import _ from 'lodash';
  _.forEach([1, 2, 3, 4, 5], function(value) {
    console.log(value);
  });
  ```
  以上的程式碼呼叫 `Lodash` 提供的 `forEach` 方法，用來迭代聚合物 (Collection) 相關的物件。

  試著將以上的程式碼成功地在 `TypeScript` 環境裡執行，並且讓 `VSCode` 推論 `forEach` 方法時，不會出現 `Any` 型別，而是型別推論出的結果。

  提示：`Lodash` 為原生 `JavaScript` 寫出來的套件。
  :::details 解答
  必須額外安裝 `Lodash` 的型別定義檔，也就是 `@types/lodash` 套件。
  :::

## 第十章 常用 ECMAScript 標準語法
### 1. 請問 JSON 物件若含有多層，也可以使用解構式解構嗎？註記方式又為何？例如以下的程式碼，`maxwell.socialLinks.personalWebsite` 可以被解構出來嗎？
  ```ts
  let maxwell = {
    name: 'Maxwell',
    age: 18,
    socialLinks: { personalWebsite: 'example.com' },
  };
  ```
  :::details 解答
  ```ts
  /* 淺層解構碼 */
  let {
    personalWebsite: ex1
  }: { personalWebsite: string} = maxwell.socialLinks

  /* 深層解構法 */
  let {
    socialLinks: { personalWebsite: ex2 }
  }: {
    socialLinks: { personalWebsite: string}
  } = maxwell;

  console.log(ex1); // => 'example.com'
  ```
  :::

### 2. 請問以下的程式碼效果為何？
  ```ts
  let arr = [1, 2];
  [arr[1], arr[0]] = [arr[0], arr[1]];
  ```
  :::details 解答
  本題的程式碼可以被看作成：
  ```ts
  let arr = [1, 2];
  [arr[1], arr[0]] = [1, 2];
  ```
  經過解構式的解讀，`arr` 的，第 `0` 個元素，被指派數值 `2`、第 `1` 個元素被指派數值 `1`，因此結果為：
  ```ts
  console.log(arr);
  // => [2, 1]
  ```

  因此推論結果為交換該陣列裡的兩個元素；本題程式碼等效於：
  ```ts
  let arr = [1, 2];

  /* 交換兩個元素 */
  let temp = arr[1];
  arr[1] = arr[0];
  arr[0] = temp;
  ```
  :::

### 3. 承上題，如果換成以下的程式碼，會有什麼結果？
  ```ts
  let arr = [1, 2];
  [arr[1], arr[0]] = arr;
  ```
  :::details 解答
  本題為陷阱題，答案結果是 `[1, 1]`，因為本題的等效程式碼為：
  ```ts
  let arr = [1, 2];
  arr[1] = arr[0];  // 此時 arr[0] 為 1，被指派到 arr[1]
  arr[0] = arr[1];  // 此時 arr[1] 為 1，被指派到 arr[0]
  ```

  與前一題差別在於，解構過程中是新建一個物件後解構：
  ```ts
  [arr[1], arr[0]] = [arr[0], arr[1]];
  ```

  然而，本題卻是直接用同一個物件參照進行解構，而後再塞到同一個物件參照對應的值，因此才會造成不同結果。
  ```ts
  [arr[1], arr[0]] = arr;   // 用同一個物件參照解構，並指派到同一個物件參照。
  ```
  :::

### 4. 匯集 - 展開操作符，可以對 `JSON` 物件進行展開的操作同時，將屬性再匯集到另一個 `JSON` 物件裡，因此你可能會看到利用匯集 - 展開操作符重新建構物件的語法：
  ```ts
  let obj1 = { foo: 'Hello', bar: 123, baz: { message: 'world' }};
  let obj2 = { ...obj1 };

  console.log(obj1 === obj2); // => false
  ```

  然而，此語法實際上只會進行淺層的物件複製 (英文為 `Shallow Copy`)，內層的屬性如果對到的也是物件時 (比如 `obj1.bar`)，複製出的物件之內層仍然會指向同一個物件：
  ```ts
  console.log(obj1.baz === obj2.baz); // => true
  ```

  因此如果對內層物件進行竄改時，原先被複製的物件對照的內層物件資料也會被篡改：
  ```ts
  obj2.baz.message = 'goodbye';
  console.log(obj1.baz); // => { message: 'goodbye' }
  ```

  試寫出一個簡單的函式 `deepCopy`，深度複製 (`Deep Copy`) 輸入的物件，使得輸出物件的內層物件不會與複製前的物件有任何 `參照 (Reference)` 上的關聯：
  ```ts
  type JSONObj = { [key: string]: any};
  function deepCopy(obj: JSONObj): JSONObj {
    // 實踐過程 ...
  }

  let obj1 = { foo: 'Hello', bar: 123, baz: { message: 'world' }};
  let obj2 = deepCopy(obj1);

  /* 對 obj2 進行竄改，obj1 不會受到影響 */
  obj2.baz.message = 'goodbye';
  console.log(obj1.baz); // => { message: 'world' }
  console.log(obj2.baz); // => { message: 'goodbye' }

  console.log(obj1 === obj2); // => false
  ```

  本題不考慮 `JSON` 物件以外的情形，例如陣列或者是函式等，因此讀者不需要管輸入到 `deepCopy` 函式裡的 `JSON` 物件裡的值有陣列或函式以外的情形。

  :::details 解答
  ```ts
  function deepCopy(input: JSONObj): JSONObj {
    // 淺層複製
    let result = { ...input };

    // 使用遞迴 Recursion：
    // 如果複製的結果，裡面的值為物件時，再進行淺層複製，一直遞迴下去
    for (let prop in input) {
      if (typeof prop  === 'object') {
        result[prop] = deepCopy(result[prop]);
      }
    }

    return result;
  }
  ```
  :::

### 5. 請問陣列 `Array` 與 `ES6 Set` 有何差異？
  :::details 解答
  最大的差異在於，陣列的元素可以重複，而 `ES6 Set` 內的元素不一樣；二來是陣列與 `ES6 Set` 提供的 `API` 具有很大的差異，像是陣列元素順序有差異，因此會有 `Push` 或 `Unshift` 之類的方法新增元素，而 `ES6 Set` 的元素無關乎順序，因此新增元素才會只有 `Add` 方法。
  :::

### 6. 請問 `JSON` 物件 與 `ES6 Map` 有何差異？
  :::details 解答
  `JSON` 物件的鍵，只能為字串或數字型別的值，而 `ES6 Map` 物件則可以以任何物件值作為鍵。
  :::

### 7. 提供任一組數字陣列 (如：[2, 3, 6, 1, 3, 6, 5, 9])，請計算陣列的元素種類個數 (本範例中，元素種類有 6 種，分別為： 1, 2, 3, 5, 6, 9)
  :::details 解答
  使用 `ES6 Set` 即可：
  ```ts
  function distinctNumberCount(input: Array<number>): number {
    return new Set(input).size;
  }
  ```
  :::

## 第十一章 常用 ECMAScript 標準語法 非同步程式設計篇
### 1. 試描述 `JavaScript` 裡同步 (Synchronous) 與 非同步 (Asynchronous) 概念與差異性。
  :::details 解答
  - 同步的程式運作過程，會按照程式碼順序一行一行地執行，也就是說，後面的程式碼必須得等到前面的程式碼執行完畢才會接續，因此遇到運算耗費量過大的程式碼，容易造成 `阻塞 (Blocking)` 問題；
  - 非同步程式碼在運作上，順序則不一定，由於 `JavaScript` 引擎 (如：`V8`) 設計上只有 `單線程 (Single-Threaded)`，因此程式運作上是 `併發 (Concurrent)` 執行的，不太會遇到阻塞問題。
  :::

### 2. 試問以下的程式碼會以什麼樣的順序印出值？
  ```ts
  console.log('Log 1');

  // 設定 3 秒計時後印出值
  setTimeout(function() {
    console.log('Log 2');
  }, 3000);

  console.log('Log 3');

  // 設定 0 秒計時後印出值
  setTimeout(function() {
    console.log('Log 4');
  }, 0);

  console.log('Log 5');
  ```
  :::details 解答
  印出訊息順序為：`Log 1` -> `Log 3` -> `Log 5` -> `Log 4` -> `Log 2`
  :::

### 3. Promise 物件初始化的過程中，會是如何執行程式碼？試分析下面的範例程式碼。
  ```ts
  new Promise<string>(function (resolve, reject) {
    console.log('Log 1');
    resolve('Hello world!');

    console.log('Log 2');               // Resolve 過後，這東西會印出來嗎？
    resolve('Hello world again!');      // 可以在度 Resolve 嗎？
  }).then(function(result) {
    console.log('Log 3');
    console.log(result);
  });

  console.log('Log 4');     // 是 Promise 裡面的函式，還是這個先執行？
  ```
  :::details 解答
  實現運行整段程式碼，其印出訊息順序為：`Log 1` -> `Log 2` -> `Log 4` -> `Log 3` -> `Hello world`；`Promise` 物件在一開始初始化時，就會執行函式的內容，因此最先印出 `Log 1` 訊息；然而，遇到 `resolve` (或 `reject`) 函式時，儘管看似應該要終止了，但 `Promise` 物件內的函式依然會繼續執行，於是印出 `Log 2`；由於 `Promise` 物件本身是非同步程式，根據 `事件迴圈 (Event Loop)` 的原理，程式碼會先執行到結束 -- 也就是印出 `Log 4` 後，`Promise` 中的 `then` 方法才會開始執行，而 `then` 方法裡依序印出 `Log 3` 以及 參數值，為 `Hello world!` 字串。
  :::

### 4. 在討論函式型別篇章時，通常函式在宣告時，參數必須要積極註記；然而宣告一個新的 `Promise` 物件時，為何本章節大部分的範例程式碼，`Promise` 物件的 `then` 方法裡的參數不太有註記的需要？
  :::details 解答
  `Promise` 物件本身為泛用型別，而 `Promise<T>` 中的型別參數 `T` 就代表了 `then` 方法裡回呼函式中的參數型別。
  :::

### 5. 假設今天宣告一個 `timeoutAfter` 函式如下：
  ```ts
  function timeoutAfter(milliseconds: number) {
    return new Promise<string>(function (resolve, reject) {
      setTimeout(function() {
        reject('Timeout Error');
      }, milliseconds);
    })
  }
  ```
  `Timeout` 通常代表著一段程式執行時間過長，必須要設一段時間進行中斷程式的動作。

  運用 `timeoutAfter` 函式，搭配哪一種 `Promise API` 就可以達到當一個非同步程式運行時間過長，可以提前終止並拋出錯誤訊息的動作。
  :::details 解答
  使用 `Promise.race`，只要 `timeoutAfter` 回傳的 `Promise` 物件 `reject` 時，就會將整個 `Promise.race` 終結。
  :::

### 6. 非同步函式可以在內部 `await` 另一個非同步函式嗎？那麼就可以 `await Promise API` 之類的東西嗎？ (譬如：await Promise.all(...) 等東西)
  :::details 解答
  是，只要是任何回傳 `Promise` 物件相關的資源，都可以在非同步函式裡，用 `await` 關鍵字進行等待該非同步程式結束的情形。
  :::

### 7.【進階題】討論 `Promise` 物件的泛型特性時，提到註記 `Promise` 物件的型別參數 `T`，就代表 `resolve` 函式也必須要填入型別 `T` 的值，但也可以填入 `PromiseLike<T>` 這種型別的值。

  `TypeScript` 事實上具有 `<Type>-Like` 相關的型別 (例如本書沒提到過的：`ArrayLike<T>`)，讀者可以想想看這類型型別的意義在哪嗎？
  :::details 解答
  `<Type>-Like` 類型的型別，可以避免輸入過於限制的情形，比如一個函式要求輸入型別為 `ArrayLike<T>` 以及另一個函式則是輸入型別為 `Array<T>`，兩者相比，前者只要有 `長得像陣列的資料結構`，譬如有 `length` 性質的物件等，就可以輸入，但後者強調 `一定要陣列型的資料結構` 輸入才行；
  
  [詳細可以參見](https://stackoverflow.com/questions/43712705/why-does-typescript-use-like-types)
  :::