---
title: IT邦 - 讓 TypeScript 成為你全端開發的 ACE !
---

# A 解答篇
## 第二章 TypeScript 型別系統概論
### 1. 試著描述 `TypeScript` 型別系統 (Type System) 的主要概念。 (型別推論與註記)
  `TypeScript` 型別系統主要分成 `型別推論(Inference)` 與 `註記(Annotation)` 的行為：
  - `推論行為` 具有類似動態語言的特色，藉由資料本身的值反推型別；
  - `註記` 則是使用者主動告訴 `TypeScript` 編譯器，特定的變數代表的型別，屬於類似靜態語言的特色。
  
  兩種機制綜合起來的系統，即`漸進式型別系統 (Gradual Typing)`。

### 2. 註記的語法中，還有再更細分成『註記』跟『斷言』，兩種語法的用途是什麼？註記方式的關鍵性差異在哪？
  - `註記 (Annotation)` 型別的用意是在告知 `TypeScript` 編譯器，宣告出來的 `變數 (Variable)` 或 `函式裡的參數 (Parameter)` 所代表之型別；
  - `斷言 (Assertion)` 則是由於某些原因 `TypeScript` 編譯器可能無法推論某 `表達式 (Expression)` 運算結果，所以進行人為告知編譯器，該表達式所代表之型別結果。

### 3. 使用『斷言』的語法要注意的地方在哪？
  由於斷言是人為強制覆蓋掉一個表達式的型別推論結果，因此必須要在很確定程式碼的運作過程時，進行型別斷言。

### 4. 試描述 敘述式(Statement) 與 表達式(Expression) 的概念。兩者之差異性在哪？
  `敘述式 (Statement)` 與 `表達式 (Expression)` 最關鍵差異在於：後者運算結果會有值出來，前者則沒有。

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
  `原始型別 (Primitive Types)` 為`數字 (Number)`、`字串 (String)`、`布林值 (Boolean)` 以及 `Undefined`、`Null`；
  
  其餘皆為物件型別，如 `陣列`、`JSON物件` 等。

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
    變數宣告指派式為敘述式，因為回傳結果為 `undefined`，為敘述式典型特徵。

  - b) `JavaScript` 裡，以上的 `變數指派式` 的範例 (也就是宣告變數 `bar` 的那一行程式碼) 是屬於敘述式還是表達式？
    純變數指派式會回傳指派的值作為結果，因此為表達式。

  - c) 按照結論 a) 與 b) 以及你對於敘述式及判斷式的理解，你能夠解釋得出多重指派 (Multiple Assignment) 的運作原理嗎？
    多重指派式的部分，變數 `foo` 是宣告的同時被指派值 (視為敘述式)，而被指派的東西為變數 `bar` 的純指派式子 (視為表達式)， `bar` 被指派的值為 1，同時也會回傳數字 1；也就是說，`foo`會被指派變數 `bar` 被指派的值 (即該表達式回傳的值)，也就是數字 1。

    ```ts
    /* 先告訴 TypeScript 編輯器 bar 是數字型別 */
    let bar: number;

    /* 多重指派 */
    let foo: number = bar = 1;
    ```

  - d) 按照結論 a) 與 b)，請問以下的註記方式是合理的嗎？
    ```ts
    /* 先告訴 TypeScript 編輯器 bar 是數字型別 */
    let bar: number;

    /* 多重指派 */
    let foo = (bar = 1) as number;
    ```

    是，因為純指派式子為表達式，理所當然也可以被型別斷言。

## 第三章
