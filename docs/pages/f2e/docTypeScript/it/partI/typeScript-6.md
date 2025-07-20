---
title: IT邦 - 讓 TypeScript 成為你全端開發的 ACE !
---

# 6 TypeScript 介面
## 6.1 介面的介紹 Introduction to Interface
- ### 6.1.1 介面的定義 Definition of Interface
  > 將複雜的系統，套上人性化的設計，這應該就是介面兩字的真諦。

  > - 將複雜系統 `簡化的過程`，叫做 `抽象化`。
  > - 將複雜系統 `簡化的結果`，叫做 `介面`。

- ### 6.1.2 TypeScript 介面的基礎宣告 Interface Declaration
  > TypeScript 提供的介面語法，著重在描述任何 `物件 (Object)` 或 `類別 (Class)` 的 `規格 (Speculation)`。

  > `TypeScript Interface` 形同 `規格` 的制定。

  一般介面的宣告，跟普通的 `JSON` 物件型別化名的宣告非常像，差別在於使用的關鍵字是 `Interface`。
  ```ts
  interface PersonalInfo {
    name: string;
    age: number;
    interest: string[];
  }
  ```

  宣告類別的規格
  ```ts
  interface Cat {
    /* 普通成員變數的規格 */
    name: string;
    breed: string;
    noise: string;

    /* 普通成員方法的規格，使用函式型別規格 */
    makeNoise(): void;
    feed(something: string): void;
  }
  ```

  - #### 介面的定義與宣告 Definition and Declaration of Interface
    - 1. 介面廣義來說，即 `一般複雜程式簡化成比較人性化的結果`。
    - 2. TypeScript 提供的介面語法偏向於 `制定物件與類別的規格 (Speculation)`。
    - 3. 宣告介面時，使用關鍵字 `interface`：
      ```ts
      interface I { /* 介面 I 的規格內容 */ }
      ```
    - 4. 由於 `TypeScript` 介面的定位是 `實作規格`，因此 `並不包含實作過程與內容`。
    - 5. 宣告介面規格的方式，與 宣告物件類型 或 可控索引型別的方式 類似。

## 6.2 介面的彈性 Flexibility of Interface
- ### 6.2.1 介面的延展 Interface Extension
  - 1. 介面可以從其他宣告過的介面延展，使得該介面 `可以擁有其他介面已宣告過的規格`。
  - 2. 介面的延展，不限於一個介面，`可以延展多個介面`。
  - 3. 使用介面延展時，使用關鍵字 `extends`：
    ```ts
    interface I extends I1, I2, ..., IN {
      /* 介面 I 的規格內容 */
    }
    ```
    其中，介面 `I1`、`I2`...`IN` 為被延展的介面。

- ### 6.2.2 介面的融合 Interface Merging
  - 1. 介面的融合，為 `定義的融合 (Declaration Merging)` 中的一種，也是最常見的融合性宣告手法。
  - 2. 介面的宣告時，若 `先前有重複宣告過同個介面` 時，就會啟動介面融合機制。
    ```ts
    interface PersonalInfo {
      name: string;
      age: number;
      interest: string[];
    }

    interface PersonalInfo {
      gender: 'Male' | 'Female';
      married: boolean;
    }

    /* 宣告性融合後，等效於 */
    interface PersonalInfo {
      /* 原先宣告時的規格 */
      name: string;
      age: number;
      interest: string[];

      // 重複宣告時的規格
      gender: 'Male' | 'Female';
      married: boolean;
    }
    ```
  - 3. 介面由於是 `嚴格宣告規格內容`，因此融合過程中產生型別衝突時，介面的融合就會失敗。

- ### 6.2.3 函式超載性宣告 Function Declaration Overloading
  - 1. 函式型別的 `宣告可以進行超載`，也就是說，可以預先略過實踐的過程，宣告輸入以及輸出型別，而後再去實踐完整的結果。
  - 2. 函式型別進行超載性宣告後，`必須馬上實踐`。
  - 3. 若將函式超載性宣告的過程，包裝在介面裡，就不需要遵守 `第2點` 的限制。

  ```ts
  interface CreateElement {
    (tagName: 'p'):      HTMLParagraphElement;
    (tagName: 'a'):      HTMLAnchorElement;
    (tagName: 'button'): HTMLButtonElement;
    (tagName: 'input'):  HTMLInputElement;
    // 其他的超載性宣告 略...
  }
  ```

## 6.3 註記與實踐介面
- ### 6.3.1 JSON 物件與介面
  ```ts
  const maxwell: PersonalInfo = {
    name: 'Maxwell',
    age: 18,
    interest: ['drawing', 'programming']
  }
  ```

- ### 6.3.2 函式與介面
  ```ts
  /* 純函式超載性宣告介面 */
  interface AdditionFunction {
    (input1: number, input2: number): number;
    (input1: string, input2: number): number;
    (input1: number, input2: string): number;
    (input1: string, input2: string): number;
  }

  const safeAddition: AdditionFunction = function {/* 實踐過程略... */}

  /* 看起來像純函式宣告，但實質上是屬性為函式型別的超載性宣告 */
  interface AdditionFunctionProperty {
    addition(input1: number, input2: number): number;
    addition(input1: string, input2: number): number;
    addition(input1: number, input2: string): number;
    addition(input1: string, input2: string): number;
  }

  const safeAdditionObj: AdditionFunctionProperty = {
    addition: function {/* 實踐過程略... */}
  }
  ```

- ### 6.3.3 類別實踐介面 Interface Implementation
  > `TypeScript Interface` 形同 `規格` 的制定。

  > `TypeScript Interface` 宣告的規格，對於類別裡的成員來說，是 `開放狀態` 的。

  `TypeScript` 介面不會規範類別的私有或保護狀態的成員，它只規範 `開放狀態 (也就是 Public)` 的成員。
  
  - #### 類別宣告與介面實踐 Class Declaration & Interface Implementation
    - 1. 類別雖然只能繼承單個父類別，但類別可以實踐多種不同的介面。
    - 2. 類別必須宣告介面裡的規格為 `開放狀態 (Public)` 的成員。
    - 3. 類別宣告時實踐介面，使用關鍵字 `implements`。

## 6.4 詭異的 TypeScript 函式參數型別檢測機制
- ### 6.4.1 明文 JSON 物件作為函式參數
  ```ts
  interface PersonalInfo {
    name: string;
    age: number;
    interest: string[];
  }

  function printInfo(info: PersonalInfo) {
    console.log(`${info.name} is ${info.age} years old.`);
    console.log(`${info.name} is interested in ${info.interest.join(', ')}.`);
  }
  ```
  如果輸入的參數，物件多一個屬性 (或少一個屬性)，由於不符合介面 `PersonalInfo` 描述的情形，就會出現錯誤訊息。

- ### 6.4.2 變數作為函式參數
  如果遇到以下的情形，將物件的值指派到不經過註記的變數 `maxwell` 中，並且將該變數作為參數傳入函式 `printInfo` 裡。
  ```ts
  const maxwell = {
    name: 'Maxwell',
    age: 18,
    interest: ['drawing', 'programming'],
  };

  // printInfo 函式接收的參數必須為 PersonalInfo 型別的值
  printInfo(maxwell);

  // => Maxwell is 18 years old.
  // => Maxwell is interested in drawing, programming.
  ```
  以上的範例，理所當然也會成立，不過將變數 `maxwell` 新增介面 `PersonalInfo` 沒有規範的規格時：
  ```ts
  const maxwell = {
    name: 'Maxwell',
    age: 18,
    interest: ['drawing', 'programming'],

    // 新增 gender 屬性，但該屬性並沒有規範到 `PersonalInfo` 介面
    gender: 'male',
  };

  // printInfo 函式接收的參數必須為 PersonalInfo 型別的值
  printInfo(maxwell);

  // => Maxwell is 18 years old.
  // => Maxwell is interested in drawing, programming.
  ```
  以上的程式碼，反而不會發生錯誤訊息。

  - #### 關鍵差異在：
    - 明文物件型別的值作為參數時，就會是 `嚴格檢測模式`，代表 `明文物件的規格必須完全符合參數的型別結構` (指德也就是介面的規格)。
    - 若函式的 `參數被傳入非明文物件型別以外的東西`，例如變數或表達式，就會變成 `鴨子型別的檢測模式` (Duck-Typing)。

- ### 6.4.3 鴨子型別檢測模式 Duck-Typing
  >「走路像鴨子、叫得也像鴨子的話，那麼它就是鴨子。」

  鴨子型別的概念很簡單，轉換成 `TypeScript` 的想法，只要物件值的結構 `至少` 符合特定介面的規格，那麼該物件就是符合該介面的規格。

  ```ts
  interface Duck {
    noise: string;
    feetCount: number;
  }

  const cat = {
    noise: 'Meow meow meow~~~~',
    feetCount: 4,

    // 新增 nocturnal (夜行性) 屬性，但該屬性不屬於 Duck 介面
    nocturnal: true,
  }

  // 這一行不會出錯，因為是基於鴨子型別的判斷準則
  const duck: Duck = cat;
  ```

  但如果強行註記原先宣告的變數 `cat` 為 `Duck` 介面時，就代表物件值必須嚴格實踐介面 `Duck` 所規範的型別，因此會出現錯誤訊息。
  ```ts
  const cat: Duck = {
    noise: 'Meow meow meow~~~~',
    feetCount: 4,

    // 新增 nocturnal (夜行性) 屬性，但該屬性不屬於 Duck 介面
    nocturnal: true,
  }
  ```

  - 同理
    ```ts
    printInfo(maxwell);   // 接收值為變數或表達式，為 `鴨子型別檢測模式`

    printInfo({  // 接收值為明文物件型別，為 `嚴格檢測模式`，此範例會出現錯誤
      name: 'Maxwell',
      age: 18,
      interest: ['drawing', 'programming'],

      // 多出 PersonalInfo 原先沒規範的屬性，造成錯誤
      gender: 'male',
    })
    ```

  - 函式接收參數若為明文物件型別，就必須嚴格遵守參數型別的格式或規格；
  - 若為普通變數或表達式，則檢測基準變成 `鴨子型別檢測模式`。

  - #### 嚴格檢測模式 v.s. 鴨子型別檢測模式
    - 1. 嚴格檢測模式，代表物件的值之屬性規格，必須 `完全` 符合介面的規範。
    - 2. 鴨子型別檢測模式，代表物件的值之屬性規格，`至少` 符合介面的規範。
    - 3. 一般變數或表達式，若指派到被註記的變數，亦或者是作為函式參數時，評判基準為 `鴨子型別模式`；若為明文物件型別時，則為嚴格檢測模式。

## 6.5 型別化名 V.S. 介面
- ### 6.5.1 型別化名推論時會 "蒸發掉"
  基本上，一般 `型別化名` 與 `介面宣告` 方式，看起來都是在宣告物件格式的型別：
  ```ts
  /* 型別化名的宣告 */
  type ObjType = {
    /* 規格內容... */
  };

  /* 介面的宣告 */
  interface ObjInterface {
    /* 規格內容... */
  }
  ```
  型別化名，可以表示任何複雜型別的組成結構，但精確一點的說法是 - 型別化名單純就只是幫該型別結構 `取名字` 而已。
  ```ts
  type NumberOrString = number | string;

  let ex1: NumberOrString = 123;
  let ex2: number | string = ex1;
  ```
  型別化名為 `NumberOrString` 為複合型別 `number | string` 的名稱，也就是說完全等效於：
  ```ts
  let ex1: number | string = 123;
  let ex2: number | string = ex1;
  ```
  所以 `宣告型別化名並不是創建新的型別`，而是用那個名字代表 `宣告化名` 背後代表的型別結構而已。

- ### 6.5.2 意義上的差別
  型別化名比較適合用來表示靜態的資料結構。
  ```ts
  type PersonalInfo = {
    name: string;
    age: number;
    interest: string[];
  }
  ```

  介面宣告的結構變化性，相對型別化名而言，是動態的。
  ```ts
  interface PersonalInfo {
    name: string;
    age: number;
    interest: string[];
  }
  ```

  型別化名單純只是宣告資料結構 (Structure)；
  介面則是宣告一個系統 (可為單純 JSON 物件、類別的成員規格、純函式等東西)的規格 (Spec.)。

  - #### 型別化名 V.S. 介面
    - 1. `型別化名規範單純的資料結構`，因此宣告出來的名稱，在推論過程中會蒸發掉，變成它所代表的型別結構。
    - 2. `介面規範的是實踐功能的基本規格`，因此為了達到方便的抽象化，相對型別化名而言，彈性固然比較高。

## [本章練習](../A/typeScript-A.html#第六章-typescript-介面)