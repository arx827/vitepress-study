---
title: IT邦 - 讓 TypeScript 成為你全端開發的 ACE !
---

# 2 TypeScript 型別系統概論

## 2.1 型別系統的兩大基柱 - 型別的推論與註記
### 2.1.1 運用型別系統必備的核心觀念
  - 用 `文字` 標明該變數或函式的型別的方式稱為 `註記 (Annotation)`。
  - 讓程式自己判斷某變數對應其值或運算過後的表達式之結果值的型別，則稱為 `推論(Inference)`。

### 2.1.2 概觀型別推論與註記 - 各自的使用時機
  - 1. 核心守則 - `TypeScript` 的程式碼必須評估各種狀況選擇加上型別註記或者讓程式自行推論。
  - 2. 通常 `積極做註記是為了限縮型別的各種可能性`，使得程式碼可以減少要處理的例外狀況個數、增加模糊變數或方法使用上的 `可讀性` 以及讓 `TypeScript` 編譯器靜態偵測程式，`確保型別不會有衝突產生`。
  - 3. 如果某段或某行程式碼本身可讀性夠或者是從命名上直覺判斷出型別的機率夠高的話，通常 `TypeScript` 型別系統的推論機制就已足矣。

## 2.2 型別註記 - 『註記』與『斷言』的差異性
### 2.2.1 型別註記語法
  - 1. `變數的註記` - 假設宣告某一變數 `foo`，並且想將其註記為某型別 `T` 時，則基本的註記語法格式如下：
    ```ts
    <let | const> foo: T = <expression>
    ```

  - 2. `函式的宣告與註記` - 假設宣告某一函式 `bar`，並且想將其參數 `p₁` 到 `pn` 分別註記為 `T₁` 到 `Tn` 時，輸出的型別為 `TOutput`，則基本的註記語法格式如下：
    ```ts
    function bar(p₁: T₁, p₂: T₂, ..., pn: Tn): TOutput {
      /* 函式的宣告內容 */
    }
    ```

  - 3. `變數為函式型別的註記` - 假設宣告某一變數 `bar`，並且想將其註記為某函式型別 `T` 時，且 `T` 之參數 `p₁` 到 `pn` 分別註記為 `T₁` 到 `Tn`時，輸出的型別為 `TOutput`，則註記於指派運算子左方的註記方式為：
    ```ts
    const bar: (p₁: T₁, p₂: T₂, ..., pn: Tn) => TOutput = <function-declartion>;
    ```
    註記於指派運算子右方，並且合併函式的宣告時，註記方式則如下：
    ```ts
    const bar = function(p₁: T₁, p₂: T₂, ..., pn: Tn): TOutput {
      /* 函式的宣告內容 */
    }
    ```
    換成 `ES6` 箭頭函式的格式則是：
    ```ts
    const bar = (p₁: T₁, p₂: T₂, ..., pn: Tn): TOutput => {
      /* 箭頭函式的宣告內容 */
    }
    ```

### 2.2.2 型別斷言語法
  - #### 敘述式 (Statement) 與表達式 (Expression) 的定義與差別
    - 1. `敘述式` 代表的概念是程式 `運行` 的流程，例如：`JavaScript` 裡的判斷敘述式 (if...else) 以及迴圈敘述式 (for 或者是 while 迴圈)。
    - 2. `表達式` 代表的則是程式碼 `運算` 的流程，並且會將運算結果回傳 (Return)，其中，兩者最關鍵的差異是：『敘述式不會回傳值、表達式則是會』。

  - #### 斷言的基礎語法 Syntax of Type Assertion
    斷言的語法只能用在表達式上，因為 `表達式具備回傳的值`，敘述式則沒有 - 因此可以『`斷言該表達式所運算結果之代表型別`』。
    
    若想將某表達式斷言為型別 `T`，則寫法為：
    ```ts
    <expression> as T
    ```
    另一種斷言的表現形式為：
    ```ts
    <T>(<expression>)
    ```

### 2.2.3 註記 Annotation V.S. 斷言 Assertion
  - `註記` 的意義在於 - 告訴 `TypeScript` 編譯器，該變數、函式型別必須 `遵照` 指定的型別，靜態分析時若出現型別不符的相關衝突，`TypeScript`編譯器就會自動拋出警訊。
  - `斷言` 則是強制 `覆寫` 掉被斷言的表達式之型別結果，通常 `用在回傳未知結果的表達式`；使用斷言較有機率產生人為上的錯誤，因為 `TypeScript` 編譯器會果斷忽略斷言過後的表達式的運算結果之型別，採取斷言的型別作動態分析。

  儘管 `TypeScript` 編譯器會盡量防止錯誤的斷言發生，但使用時還是得小心些！

## 2.3 綜觀 TypeScript 型別種類
### 2.3.1 原始型別 Primitive Types
  - `number`
  - `string`
  - `boolean`
  - `undefined`
  - `null`
  - `void`
  - `symbol`

### 2.3.2 物件型別 Object Types
  - #### JavaScript 物件範疇
    - 1. 只要是非原始型別的資料，通通可以被歸類為 `JavaScript` 物件。
    - 2. `JavaScript` 物件的表現形式主要分成：`JSON物件`、`陣列`、`函式` 與類別建構出來的物件，也就是 `實體`。

  - #### JSON 物件的明文表現形式：
    ```ts
    const info: {
      name: string;
      age: number;
      interest: string[];
    } = {
      name: 'Maxwell',
      age: 18,
      interest: ['drawing', 'programming'],
    }
    ```

  - #### 陣列型別
    ```ts
    const data: string[] = ['Maxwell', 'Taipei', 'TypeScript 101'];
    ```

  - #### 函式型別
    ```ts
    const greet: (someone: string) => void = function (someone) {
      console.log(`Hello! ${someone}.`)
    }
    ```

### 2.3.3 明文型別 Literal Types
  - #### 明文的定義 Definition of "Literal"
    就是 `值 (Value)` 的表現方式。
    ```ts
    // 數字明文 Number Literal
    123;

    // 字串明文 String Literal
    'Hello world!';

    // 布林值明文 Boolean Literal
    true;

    // 物件明文 Object Literal
    { name: 'Maxwell', age: 18}; // JSON 物件
    [1, 2, 3];                   // Array 物件
    () => 123;                   // 函式物件 (ES6 箭頭函式表示方式)

    // 變數 foo 被限定只能被指派為數字 1、2、3 其中一種
    const foo: 1 | 2 | 3 = 1;
    ```

### 2.3.4 TypeScript 提供型別 TypeScript Provided Types
  - #### 元組 (Tuple)
    元組有 `元素 (Element) 數量的限制`、內部所存的 `元素順序 (Order)` 與各個元素對應之型別都有嚴格的規定。
    ```ts
    const foo: [number, string, boolean] = [666, 'Devil Number', false];
    ```

  - #### 列舉 (Enum)
    將相似性質的資料，用文字描述並且匯聚成的一種型別。
    ```ts
    enum Color { Red, Blue, Green, Yellow, White}

    const baz: Color = Color.Yellow;
    ```

### 2.3.5 特殊型別 Special Types
  - #### any 型別
    專案裡不確定性存在的型別，通常它會是專案裡混沌的來源。

  - #### never 型別
    專案裡如鬼魅般的存在的型別，你不會注意到它的存在，但它是默默存在各種角落的型別。

  - #### unknown 型別
    專案裡較為安全的不確定性存在的代表型別，主要用來替代 `any` 型別的狀態。

### 2.3.6 進階型別 Advanced Types
  - #### 泛用型別 (Generic Types)
    ```ts
    function echo<T>(something: T): T { return something; }
    ```
    是一種將『型別自身進行 `參數化 (Parameterize)` 後表現出來的特殊型別』。

    輸入 `echo` 函式的參數若為型別 `T`，則其輸出的型別必需等於輸入的值之型別 `T`。

  - #### 可控索引型別
    通常用來鎖定物件的 `鍵值對(Key-Value Pair)`。
    ```ts
    const dictionary: { [key: string]: string} = {
      name: 'Maxwell',
      description: 'Will always be 18 yrs old.',
      reason: 'You will never know.'
    }
    ```

  - #### 索引型別 (索引列隊操作子)
    主要功能為動態地檢測『某鍵值對物件有沒有正確地使用到該物件的 `屬性(Property`)』。
    ```ts
    const dictionary = {
      name: 'Maxwell',
      description: 'Will always be 18 yrs old.',
      reason: 'You will never know.'
    };

    let info: keyof dictionary;
    // info 的型別為 ('name' | 'description' | 'reason')
    ```

  - #### 複合型別 (Composite Type)
    ```ts
    // 聯集型別 (或)
    let numOrString: number | string;

    // 交集型別 (和)
    let numAndString: number & string;
    ```

## [本章練習](../A/typeScript-A.html#第二章-typescript-型別系統概論)