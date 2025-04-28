---
title: IT邦 - 讓 TypeScript 成為你全端開發的 ACE !
---

# 7 深入型別系統 III 泛用型別

## 7.1 泛用型別的介紹 Introduction to Generic Types
### 7.1.1 型別參數化 Type Parameterization
  泛用型別有點像是型別版本的`函式`的概念。
  ```ts
  /* 宣告簡單的泛用型別化名 Identity<T> */
  type Identity<T> = T;
  ```
  化名 `Identity<T>` 的宣告中的 `T` 為 `型別變數 (Type Parameter)`，可以套入各種型別。
  ```ts
  let num: Identity<number> = 123;
  let str: Identity<string> = 'Hello world!';
  ```

### 7.1.2 推論未來情境的泛用型別
  型別參數化，可以輔助編譯器的靜態分析過程，造就編譯器 `提前預知型別的能力`。
  ```ts
  /* 宣告簡單的泛用函式型別 TypeConversion<T, U> */
  type TypeConversion<T, U> = (input: T) => U;
  ```
  該型別化名的參數有兩個
  ```ts
  /* T = number, U = string */
  let numberToString: TypeConversion<number, string>;
  /* T = number, U = boolean */
  let numberToString: TypeConversion<number, boolean>;
  ```
  就等效於：
  ```ts
  /* T = number, U = string */
  let numberToString: (input: number) => string;
  /* T = number, U = boolean */
  let numberToString: (input: number) => boolean;
  ```

  - #### 泛用型別 Generic Types
    - 1. 泛用型別的特徵為搭配 `參數化 (Parameterization)` 的型別宣告機制。
    - 2. 泛用型別可以用單個型別宣告表示式，呈現多種類型的型別樣貌。

## 7.2 型別泛用化
### 7.2.1 泛用基礎型別 Generic Basic Types
  只要是 `任意型別的組合或宣告` (`除了列舉` 的宣告不能改成泛用型別外) 基本上都是可以轉換成泛用型別的形式。
  ```ts
  /* 宣告簡單的泛用陣列型別 */
  type TypedArray<T> = T[];
  type TypedTwoDimensionalArray<T> = T[][];

  /* 宣告簡單的泛用元組型別 */
  type Coordinate<T> = [T, T];

  /* 宣告簡單的泛用複合型別 */
  type Either<T, U> = T | U;
  type And<T, U> = T & U;

  /* 宣告簡單的泛用 JSON 物件型別 */
  type Obj<T> = { prop: T };

  /* 宣告簡單的泛用 JSON 物件之可控索引型別 */
  type Dictionary<T> = { [key: string]: T};
  ```

  - #### 泛用型別化名的宣告 Generic Type Alias Declaration
    宣告泛用型別化名時，可以在 `型別化名名稱後方直接接上型別參數宣告`，必須使用符號 `<>` 包圍住。

### 7.2.2 泛用函式型別 Generic Function Types
  ```ts
  /* 型別參數可以宣告在函式的參數與輸出結果 */
  type IdentityTypedFunction<T> = (input: T) => T;

  /* 函式的參數輸入與輸出型別當然也可以為不同的型別參數 */
  type TypeConversion<T, U> = (input: T) => U;
  ```
  - #### 泛用函式型別的宣告 Generic Function Type Declaration
    - 1. 宣告泛用函式型別時，可以在 `函式名稱後方直接接上型別參數宣告`，必須使用符號 `<>` 包圍住。
    - 2. 函式型別的型別參數除了可以在函式參數的宣告中使用外，輸出型別也可以使用型別參數。

### 7.2.3 泛用類別宣告 Generic Class Declaration
  ```ts
  class TypedArray<T> {
    constructor(public elements: T[]) {}

    public at(index: number): T {
      return this.elements[index];
    }

    public map(func: (input: T) => T): TypedArray<T> {
      const result = new Typedarray<T>([]);

      for (let i = 0; i < this.elements.length; i += 1) {
        const currentElement = this.at(i);
        const mappedResult = func(currentelement);
        result.elements.push(mappedResult);
      }

      return result;
    }

    // 可以自由宣告更多不同的成員 ...
  }
  ```

  另外，類別的繼承時，父類別的型別參數必須指定型別：
  ```ts
  class child extends Parent<number> {/* 子類別的宣告 */}
  ```
  但不能寫成：
  ```ts
  class child extends Parent<T> {/* 子類別的宣告 */}
  ```
  因為 `宣告的重點是子類別，應該是由子類別宣告型別參數` 後，將子類別的型別參數套入父類別
  ```ts
  /* 子類別的宣告中，型別參數 T 可以套入父類別 */
  class Child<T> extends Parent<T> {/* 子類別的宣告 */}
  /* 子類別的宣告中，父類別也可以選擇套入其他已知型別 */
  class Child<T> extends Parent<number> {/* 子類別的宣告 */}
  ```

  此外，`抽象類別` 的宣告，也可以轉換成泛用的形式。
  ```ts
  abstract class Sorter<T> {
    constructor(public input: T) {}

    public sort() {
      /* 泡泡演算法，注意裡面的 this.input.length  */
      for (let i = this.length; i > 0; i-= 1) {
        for (let j = 0; j < i - 1; j += 1) {
          if (this.compare(j, j + 1)) this.swap(j, j + 1);
        }
      }
    }

    /**
     * 由於 input 的 T 中的 T，不一定為陣列型別，input 自然而然就不一定
     * 擁有 length 屬性，因此必須強制宣告 length 成員的規格
     */
    abstract length: number;

    abstract compare(index1: number, index2: number): boolean;
    abstract swap(index1: number, index2: number): void;
  }
  ```

  - #### 泛用類別的宣告 Generic Class Declaration
    - 1. 宣告泛用類別時，可以在 `類別名稱後方直接接上型別參數宣告`，必須使用符號 `<>` 包圍住。
    - 2. 泛用類別的型別參數除了可以在類別內部使用外，也可以填入繼承的父類別 (若為泛用類別的話) 或者是實踐的介面 (若為泛用介面的話)。

### 7.2.4 泛用介面宣告 Generic Interface Declaration
  ```ts
  interface TypedArray<T> {
    elements: Array<T>;
    at(index: number): T;
    map(func: (input: T) => T): T;
    mapToType<U>(func: (input: T) => U): T;
  }
  ```
  此外，類別由於可以同時間進行繼承與實踐介面：
  ```ts
  /* 普通類別繼承泛用類別與實踐泛用介面 */
  class Child extends Parent<number> implements Interface<number> {
    /* 類別成員規格宣告略 */
  }

  /* 泛用類別繼承泛用類別與實踐泛用介面 */
  class GenericChild<T> extends Parent<T> implements Interface<T> {
    /* 類別成員規格宣告略 */
  }
  ```

## 7.3 型別參數額外功能
### 7.3.1 預設型別參數 Default Type Parameter
  ```ts
  /* 宣告簡單的泛用 JSON 物件之可控索引型別，其中 Dictionary 的型別參數值預設為字串型別 */
  type Dictionary<T = string> = { [key: string]: T };
  ```

  因此以下範例，兩種宣告方式會一樣
  ```ts
  /* Dictionary 的型別參數為 string */
  type StringDictionary1 = Dictionary<string>;
  /* Dictionary 的型別參數為預設型別值，也就是 string */
  type StringDictionary2 = Dictionary;
  ```

  型別參數的預設值不能斷斷續續地預設，要設置在宣告型別參數部分的尾端。
  ```ts
  type Alias3<T, U = string, V = number> = /* 泛用型別宣告 */
  ```

  - #### 預設型別參數 Default Type Parameter
    - 1. 宣告任何泛用型別時，皆 `可以指派預設型別到宣告的型別參數`。
    - 2. 型別參數的預設 `必須連續性地設置在尾端`。

### 7.3.2 型別參數限制 Type Constraint
  泛用型別通常在宣告時，不一定希望使用者填任何型別。
  ```ts
  /* NonNullPrimitves 為非 null 或 undefined 的原始型別 */
  type NonNullPrimitves = number | string | boolean;

  /* 宣告簡單的泛用 JSON 物件之可控索引型別，限制型別參數只能為 NonNullPrimitves */
  type Dictionary<T extends NonNullPrimitves> = { [key: string]: T };
  ```

  限制的部分也可以用介面的方式進行參數限制。
  ```ts
  interface Containsdescription {
    description: string;
  }

  /* 任何填入 logDetail 函式的參數必須符合 Containsdescription 介面的規格 */
  function logDetail<T extends Containsdescription>(something: T) {
    console.log(something.description);
  }
  ```

  當然可以同時結合 `預設型別值` 與 `型別限制` 技巧：
  ```ts
  /* 先限制 NonNullPrimitives 的限制，而後預設為 string 型別 */
  type Dictionary<T extends NonNullPrimitives = string> = { [key: string]: T };
  ```

  - #### 型別參數限制 Type Constraints
    - 1. 泛用型別之型別參數宣告時，可以使用 `關鍵字 extends 限制被填入的參數型別範圍`。
    - 2. 若想要在限制範圍的同時，指派預設型別值，記得 `先限制範圍，後指派預設值` 的順序。
    - 3. 使用型別參數限制時，若限制型別為介面時，就代表填入型別參數之型別只要 `至少符合介面的規格就算達標`。

## [本章練習](../A/typeScript-A.html#第七章-深入型別系統-iii-泛用型別)