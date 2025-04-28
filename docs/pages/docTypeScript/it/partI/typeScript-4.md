---
title: IT邦 - 讓 TypeScript 成為你全端開發的 ACE !
---

# 4 深入型別系統II 進階篇

## 4.1 元組型別 Tuple Type
- ### 4.1.1 元組的意義
  - #### `元組 (Tuple)` 的定義為：
    元組為擁有 固定 `個數`、固定的 `型別順序` 的元素組合。

    > 陣列為可以擁有 `任意個數`、`型別` 的元素組合。

- ### 4.1.2 型別推論機制
  元組型別，不可能被 `TypeScript` 分析時推論出來。

  因此，遇到元組型別的使用情境時，註記是必要的。

- ### 4.1.3 型別註記機制
  陣列的註記會是將 `空的中括弧放在元素的型別後方`，例如某陣列存取數字或字串型別：
  ```ts
  const arr: (number | string)[] = [1, '2', 3, '4', 5];
  ```

  元組由於有個數限制外，也有型別順序的限制，因此元組型別的註記方式，會在 `中括弧裡放置元素型別`，並且 `順序很重要`：
  ```ts
  const tup: [number, string] = [1, 'Hello world'];
  ```

  - #### 元組型別的意義與使用
    - 1. `元組 (Tuple)` 的特點在於它有 `元素個數限制` 以及 `固定的對應型別順序` (陣列則相反)。
    - 2. `元組無法經由推論而來`，畢竟是用 `JavaScript` 陣列資料型態表示，理應會推論成陣列型別。
    - 3. 元組的註記方式為在 `中括弧裡放置元素之型別`，且須注意順序。若宣告某元組型別 `Ttuple`，且內含的元素對應之型別為 `T1`、`T2`...、`TN`，則寫法如下：
      ```ts
      type Ttuple = [T1, T2, ..., TN];
      ```

## 4.2 列舉型別 Enum Type
- ### 4.2.1 列舉的意義
  宣告列舉的同時，等同於宣告新的型別化名
  ```ts
  /* Colors 既是列舉型別，其名稱本身就是型別化名 */
  enum Colors { Red, Blue, Yellow };
  ```

- ### 4.2.2 型別推論機制
  將宣告的列舉內含的元素當成物件的鍵呼叫，變數之推論結果也會是列舉型別的化名
  ```ts
  /* 把列舉型別的化名本身當成 JSON 物件，呼叫 Red 屬性，實質上是列舉的元素之一 */
  let selectedColor = Colors.Red;
  ```

- ### 4.2.3 型別註記機制
  ```ts
  let selectedColor: Colors = Colors.Red;
  ```

  - #### 列舉型別的意義與使用
    - 1. 列舉 (Enum) 為 `TypeScript` 自定義型別，為一系列性質相似之成員 (Member) 的集合，用 `JSON` 物件的方式表示，但是有別於 `JSON` 物件，`列舉會特別自成一種型別`。
    - 2. 列舉儘管說是 `JSON` 物件的一種，但內部的屬性正式名稱為 `列舉成員 (Member)`。
    - 3. 宣告列舉 `E` 時，假設成員為 `M1`、`M2`...、`MN`，則宣告方式如下：
      ```ts
      enum E { M1, M2, ..., MN };
      ```
    - 4. 列舉型別與列舉成員型別 (Enum Member Type) 不同，前者是指整個列舉化名背後代表的物件、後者是指列舉的其中一個成員。
    - 5. 若將列舉成員指派到 `常數 (Constant)` 中，則該常數的推論結果為該列舉成員值的型別，也就是列舉成員型別。

- ### 4.2.4 自訂列舉成員 Custom Members
  `TypeScript` 的列舉中，`列舉成員事實上有代表值的`。

  事實上，列舉型別在宣告時，預設為 `數字型列舉型別 (Numeric Enum Type)`，代表列舉成員會對應從 `0` 開始遞增的數字值。

  而這個數字型列舉的成員對應值是可以被修改的，例如：
  ```ts
  enum Colors {
    Red    = 1,   // console.log(Colors.Red) 之結果會是 1，而非預設的 0
    Blue   = 2,
    Yellow = 3,
  }
  ```

  以上寫法甚至可以簡寫成：
  ```ts
  enum Colors {
    Red    = 1,
    Blue,          // Colors.Blue 對應結果，預設為前一個成員值 +1，也就是 1 + 1 = 2
    Yellow,        // Colors.Yellow 對應結果，預設為前一個成員值 +1，也就是 2 + 1 = 3
  }
  ```

  - #### 字串型列舉型別 (String Enum Type)
    ```ts
    enum Colors {
      Red    = 'Red',
      Blue   = 'Blue',
      Yellow = 'Yellow',
    }
    ```

- ### 4.2.5 逆向映射性 Reverse Mappings
  ```ts
  enum Colors { Red, Blue, Yellow };
  ```
  它的編譯結果為：
  ```js
  var Colors;
  (function (Colors) {
    Colors[Colors["Red"] = 0] = "Red";
    Colors[Colors["Blue"] = 1] = "Blue";
    Colors[Colors["Yellow"] = 2] = "Yellow";
  })(Colors || (Colors = {}));
  ;
  ```

  > `[Colors["Red"] = 0]`，除了會將 `Colors["Red"]` 設為數值 `0` 外，還會回傳數值 `0`。

  > 將 `Colors["Red"]` 這個成員對應的結果 (也就是數字 0) 對應到成員的名稱 `Red` 上；這種相互映射的特性，稱為 `逆向映射性 (Reverse Mapping)`。

  - #### 列舉型別的逆向映射性 Reverse Mapping
    - 1. 列舉宣告時，成員名稱會與預設的值具備逆向映射性，意思就是說，可以用值去反推成員的名稱。
    - 2. 若列舉成員對照的值為字串型別時，且若成員名稱與值為不同名稱，逆向映射性就不會成立。

- ### 4.2.6 常數列舉型別 Constant Enum Type
  ```ts
  /* 普通的列舉型別 */
  enum Colors { Red, Blue, Yellow };
  let selectedColor = Colors.Red;

  /* 常數版本的列舉型別 */
  const enum ConstantColors { Red, Blue, Yellow };
  let selectedConstantColors = ConstantColors.Red;
  ```

  - #### 常數列舉型別與普通列舉型別差異
    - 1. 普通列舉型別會被編譯成 `JSON` 物件，會佔掉一些空間。
    - 2. 常數列舉型別需要使用 `const 關鍵字` 進行列舉型別的宣告，而編譯結果會將程式後續使用到的列舉成員，取代為該成員對應的值，有效減少程式碼產生的量。
    
## 4.3 可控索引型別與索引型別 Indexable Type & Index Type
- ### 4.3.1 可控索引型別 Indexable Type
  可以控制 `JSON 物件的 鍵 (Key)`，也就是 `索引 (index)` 對應的型別
  ```ts
  type StringDictionary = { [key: string]: string };
  ```
  會嚴格要求任何被註記為 `StringDictionary` 型別的值，其 `鍵` 必須要為型別 `string`，而對應之值也是型別 `string`。
  ```ts
  const obj: StringDictionary = {};
  obj[/* 這裡面的東西只能為字串型別的值 */] = 'Hello world';
  ```

  不過以下的寫法，儘管鍵被輸入數字型別的值，但由於任何鍵都會被轉型為字串，因此是可以被接受的寫法：
  ```ts
  const obj: StringDictionary = {};

  /* 儘管 123 非字串型別，但任何型別的值作為 JSON 物件的鍵，會被自動轉型為字串型別 */
  obj[123] = 'Hello world';

  /* 以上的寫法等效於： */
  obj['123'] = 'Hello world';
  ```

  - #### 可控索引型別 Indexable Type
    - 1. 為 JSON 物件型別的延伸，可以控制鍵值對的型別，並且 `不受限於擴充屬性的個數`。
    - 2. `控制鍵的型別部分` 被稱之為 `索引簽章 (Index Signature)`。
    - 3. 索引簽章 `只能為字串型別或數字型別` 這兩種；若索引簽章為字串型別時，可以模擬普通的 `Map (或 Dictionary)` 等資料結構；若索引簽章為數字型別時，則可以模擬陣列資料結構。
    - 4. 若某 JSON 物件型別裡有索引簽章，想要擴充各種屬性對應之型別時，`每個屬性的型別都會受限於字串索引型別對應的值之型別`。

- ### 4.3.2 索引型別 Index Type
  索引型別，單純只是將 `JSON` 物件裡的索引名稱聯集起來變成一種型別而已。

  通常索引型別會看到使用關鍵字 `keyof`：
  ```ts
  type PersonalInfo = {
    name: string;
    age: number;
    interest: string[];
  };

  /* 將 PersonalInfo 裡的索引聯集複合 */
  type KeyofPersonalInfo = keyof PersonalInfo;
  ```
  型別 `PersonalInfo` 的屬性被拔出來形成 `'name' | 'age' | 'interest'`。

  另外，運用索引型別，也可以叫出 `JSON` 物件裡的值的型別的聯集。
  ```ts
  type PersonalInfo = {
    name: string;
    age: number;
    interest: string[];
  };

  type KeyofPersonalInfo = keyof PersonalInfo;

  /* 運用索引型別，將值裡的型別進行聯集 */
  type ValueOfPersonalInfo = PersonalInfo[KeyofPersonalInfo];
  // type ValueOfPersonalInfo = string | number | string[];
  ```

  假設想要擴充型別 `PersonalInfo`，新增 `email` 屬性對應字串型別的值，可以這樣做：
  ```ts
  /**
   * 將 PersonalInfo 裡的所有索引拔出來後，並將每個索引對應的值之型別
   * 也對照進去；最後將要新增之屬性與屬性對應的值的型別交集複合起來
   */
  type ExtendedPersonalInfo = {
    [key in keyof PersonalInfo]: PersonalInfo[Key];
  } & {
    email: string
  }
  ```

  事實上，直接簡寫成這樣就好：
  ```ts
  type ExtendedPersonalInfo = PersonalInfo & { email: string };
  ```

## 4.4 複合型別 Composite Type
- ### 4.4.1 聯集複合 Union Type
  ```ts
  type Primitives = number | string | boolean | null | undefined;
  ```

  - #### 聯集複合型別 Union Type
    - 1. 聯集型別為某變數或表達式，可能 `具備多種不同情形的型別`。
    - 2. 通常遇到程式分岔點 (Branching Point)，就有機會用到聯集型別描述變數或表達式可能的推論結果。
    - 3. 若宣告某型別 `Tunion` 為多個型別 `T1`、`T2`...、`TN` 的聯集，則寫法如下：
      ```ts
      type Tunion = T1 | T2 | ... | TN;
      ```

- ### 4.4.2 型別駐防 Type Guard
  使用 `聯集複合` 過後，免不了會遇到情境是必須根據聯集的各自型別，會有相對應的處置辦法：
  ```ts
  function safeAddition(input1: number | string, input2: number | string) {
    let safeInput1: number, safeInput2: number;

    /* 如果 input1 為字串，則轉成數字並指派到 safeInput1 */
    if (typeof input1 === 'string') {
      safeInput1 = parseInt(input1, 10);  // 十進位字串型數字轉純數字
    } else {
      safeInput1 = input1;
    }

    /* 如果 input2 為字串，則轉成數字並指派到 safeInput2 */
    if (typeof input2 === 'string') {
      safeInput2 = parseInt(input2, 10);  // 十進位字串型數字轉純數字
    } else {
      safeInput2 = input2;
    }

    return safeInput1 + safeInput2;
  }
  ```
  以上就是在做所為的 `型別駐防`，確保變數 `input1` 如果是字串時，應該要轉型成數字然後再指派到 `safeInput1`。

  『通常』原始型別的駐防，都可以用 `typeof` 操作符去處理，而 `typeof` 旁邊接的東西不管是什麼，一律只會回傳幾種值：
  - 原始型別的字串值：`number`、`string`、`boolean`、`symbol`、`undefined`。
  - 物件型別的字串值：`object`、`function`。

  `null`，無法用 `typeof` 操作符去判斷，直接用 `嚴格比較操作子`。
  ```js
  something === null;   // 若 something 為 null，則 true
  ```

  `陣列` 是特殊的 `JavaScript` 物件，用 `Array.isArray` 比較適合：
  ```js
  Array.isArray(something); // 若 something 為陣列，則 true
  ```

  `NaN`，可以使用 `Number.isNaN` 檢測：
  ```js
  Number.isNaN(something);  // 若 something 為 NaN，則 true
  ```

  `無限大的數字 (Infinity)`，可以使用 `Number.isFinite` 檢測數字是不是有限的：
  ```js
  Number.isFinite(something);   // 若 something 為 Infinity 或 -Infinity，則 false
  ```

  另外，物件的比較，通常也不用 `typeof` 操作符，而是該物件屬於的類別。類別建構出來的物件被稱為 `實體 (Instance)`，所以 `JavaScript` 衍生出 `instanceof` 操作符。
  ```js
  /* 從 Date 類別建構出實體，並指派到變數 now 裡 */
  const now = new Date();

  /* 此為 true，因為 now 存的東西，確實是 Date 類別建構出的實體 */
  now instanceof Date;
  ```

  - #### 型別駐防 Type Guard
    - 1. 由於聯集型別 (Union Type) 涵蓋多種型別的可能情境，針對不同型別採取不同處理方式時，必須用型別駐防來個別處理不同的型別狀態。
    - 2. 除了 `null` 物件外，原始型別可以用 `typeof` 操作符設立駐防條件。
    - 3. `null` 物件直接用嚴格比較操作子 設立駐防條件。
    - 4. `陣列` 可以使用 `Array.isArray` 方法檢測。
    - 5. `物件` 通常是用 `instanceof` 操作符檢測，確認該物件是否為特定類別建立出來的實體。
    - 6. 特殊數字如 `NaN` 必須用 `Number.isNaN` 檢測； `Infinity` 則是用 `Number.isFinite` 檢測。

- ### 4.4.3 交集複合 Intersection Type
  ```ts
  type PersonalInfo = {
    name: string;
    age: number;
    interest: string[];
  };

  type AccountInfo = {
    email: string;
    username: string;
    subscribed: boolean;
  };

  type UserAccount = PersonalInfo & AccountInfo;
  ```

  任何變數被註記為 `UserAccount` 型別時，內含的物件必須要有型別 `PersonalInfo` 與 `AccountInfo` 的屬性。
  必須同時要有 `PersonalInfo` 以及 `AccountInfo` 的屬性。

  - #### 交集複合型別 Intersection Type
    - 1. 交集型別代表某變數或表達式，同時具備兩個型別特徵。
    - 2. 通常交集型別只會用到 `JSON` 物件型別的交集，同時將多個物件型別的結構特徵融合再一起；而除了 `JSON` 物件型別以外的交集，`多數` 的交集結果會變成 `never` 型別。
    - 3. 若宣告某型別 `Tintersection` 為多個型別 `T1`、`T2`、...、`TN`的交集，則寫法如下：
      ```ts
      type Tintersection = T1 & T2 & ... & TN;
      ```

## 4.5 Never 型別
- ### 4.5.1 程式執行不到結尾的應變措施
  只要 `程式執行不到結尾的地方` 就會自動推論出 `Never` 型別。
  或 `型別本身不可能發生時` 也會自動推論出 `Never` 型別。

  第一種是 `無窮迴圈`。
  ```ts
  /* 無窮迴圈 */
  function forever(): never {
    while (true) {
      console.log('Executing...');
    }
  }
  ```

  另一種比較常見的案例是 `丟出錯誤訊息`：
  ```ts
  /* 丟出錯誤訊息 */
  function throwError(): never {
    throw new Error('Will never execute next line...');
  }
  ```

  由於看不到 `return` 敘述式，與前面的程式碼案例一樣，如果不去註記輸出為 `never` 型別時，輸出型別就會被推論為 `void` 型別。

- ### 4.5.2 整個型別系統裡的基層型別
  > `Never` 型別包含於所有型別集合裡，就連 `Never` 型別也是屬於 `Never` 型別本身的集合。

  > 任何型別集合都有 `涵蓋例外事件 (Exception)` 發生的可能。

  ```ts
  /* 有機率丟出錯誤訊息或輸出數字，輸出型別為 number */
  function possiblyThrowsErrorOrReturnsNumber(): number {
    if (Math.random() > .5) {
      return 123;
    }
    throw new Error('Will never execute next line...');
  };
  ```
  > 數字型別集合 `涵蓋例外事件 (Exception)` 發生的可能。

  也就是
  > 數字型別集合裡有包含 `Never` 型別。

  - #### Never 型別的意義
    - 1. `Never` 型別為所有型別子集合，`Never` 型別也是 `Never` 型別本身的子集合。
    - 2. `Never` 型別代表的意義，廣義來說是 `程式無法執行到結束` 的概念，其中以代表 `例外 (Exception)` 發生的意義為主。
    - 3. 同第2點，任何型別都有包含 `Never` 型別這個 `Case`，以程式的觀點來看，就是指 `任何型別也涵蓋例外發生的可能性`。

- ### 4.5.3 Never 型別衍生特性
  - #### Never 型別與型別複合性質
    - 1. 吸收律：任何與 `Never` 型別聯集複合的型別 `T`，結果會是型別 `T` 吸收掉 `Never` 型別；相對地，任何與 `Never` 型別交集複合的型別 `T`，結果會是 `Never` 型別吸收掉型別 `T`。
      ```ts
      type T = <Type> | never;
      // 等同於 type T = <Type>，任何型別包含 never
      ```

      ```ts
      type T = <Type> & never;
      // 等同於 type T = never，共通點只剩 never
      ```
    - 2. 互斥律：任意兩種不同型別，若性質本身無任何共通性 (也就是互斥時)，交集複合結果會是 `Never` 型別。
      ```ts
      type NumberAndString = number & string;
      // type NumberAndString = never
      ```

## 4.6 Any 與 Unknown 型別
- ### 4.6.1 所有型別的聯集 - Any 型別
  `Any` 型別是 `TypeScript` 所有型別的聯集結果。通常會建議能夠避免出現 `Any` 型別就盡量避免。

  - #### Any 型別出現的情境如下
    - 遲滯性指派 (Delayed Initialization)
    - 函式宣告時的參數型別
    - 空陣列
    - 會回傳 Any 型別結果的函式或方法，如 `JSON.parse`
    - 直接註記變數或表達式為 Any 型別

  > 任何型別與 Any 型別發生聯集，就等於 Any 型別
  ```ts
  type T = <Type> | any;
  // 等同於 type T = any;
  ```

  > 任何 (非 Unknown) 型別跟 Any 型別交集複合
  ```ts
  type T = <Non-Unknown-Type> & any;
  // 等同於 type T = any;
  ```

- ### 4.6.2 安全版本的所有型別的聯集 - Unknown 型別
  這個型別的發明，最主要是為了開發上能夠兼具 `Any` 型別的特性，但多了一層防護性的功能 - 凡是使用 `Unknown` 型別結果的變數或表達式，`TypeScript` 靜態分析時，會 `強制開發者使用斷言語法` 輔助型別檢測。

  ```ts
  let anyFoo:     any     = 123;
  let unknownFoo: unknown = 123;

  /* 使用 anyFoo 不會發生什麼事情 */
  anyFoo + 1;

  /* 使用 unknownFoo 就會出現警告訊息 */
  unknownFoo + 1;
  ```

  ```ts
  /* 使用 unknownFoo 時，搭配斷言告訴編譯器，靜態分析時就不會有出現警告訊息 */
  (unknownFoo as number) + 1;
  ```

  - #### Any 型別與 Unknown 型別
    - 1. `Any` 型別為整個 `TypeScript` 型別系統的聯集結果，也就是說，任何型別都可以被指派到 `Any` 型別的變數下。
    - 2. `Unknown` 型別有別於 `Any` 型別，多了 `未知` 的意義，代表使用型別為 `Unknown` 的變數或表達式時，`通常會提醒要用斷言語法輔助`。

  - #### Any 型別的複合性質
    - 1. 任何與 `Any` 型別 `聯集 (Union) 複合` 的型別 `T`，會被 `Any` 型別吸收，結果為 `Any` 型別。
    - 2. 任何與 `Any` 型別 `交集 (Intersection) 複合` 的型別 `T`，且型別 `T` 不為 `Unknown` 時，會被型別 `Any` 吸收，結果為型別 `Any`。
    - 3. `Any` 型別與 `Unknown` 型別，交集複合的結果為 `Any` 型別。

  - #### Unknown 型別的複合性質
    - 1. 任何與 `Unknown` 型別 `聯集 (Union) 複合` 的型別 `T`，且型別 `T` 不為 `Any` 時，會被 `Unknown` 型別吸收，結果為 `Unknown` 型別。
    - 2. `Unknown` 型別與 `Any` 型別 `聯集複合` 的結果為 `Any` 型別。
    - 3. 任何與 `Unknown` 型別 `交集 (Intersection) 複合` 的型別 `T`，會被型別 `T` 吸收，結果為型別 `T`。

## [本章練習](../A/typeScript-A.html#第四章-深入型別系統ii-進階篇)