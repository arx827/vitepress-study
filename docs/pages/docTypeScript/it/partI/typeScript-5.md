---
title: IT邦 - 讓 TypeScript 成為你全端開發的 ACE !
---

# 5 TypeScript 類別基礎

## 5.1 物件導向基礎概論 OOP Fundamentals
- ### 5.1.1 什麼是物件
  原生 `JavaScript` 為 `原型導向 (Prototype-Based)` 語言，它 `並沒有物件導向` 裡的 `物件` 的概念；

  `JavaScript` 的物件，單純被定義為：
  > 具備 `屬性 (Property)` 以及對應的 `值 (Value)` 的資料結構。

  但是 `物件導向裡的物件` 的概念，確切的定義為：
  > 內含變數、函式以及多種不同資料結構 `封裝 (Encapsulate)` 成的一種可被操作的介面 -- 就是 `物件`。

- ### 5.1.2 實體與建構子函式 Instance & Constructor Function
  ```js
  const aCat = new Cat('Julia', 'Scottish Fold'); // 品種為蘇格蘭摺耳貓
  ```

  - 從 `類別 (Class)` 建構出來的物件，就是 `實體 (Instance)`。

  > 變數 `aCat` 存的東西，就是類別 `Cat` 建立出來的物件 (類別 `Cat` 的 `實體`)。

  > `new Cat(...)` 就是 `建構子函式 (Constructor Function)`，建構新的實體時，一定會先接上關鍵字 `new`。

  ```js
  function Cat(name: string, breed: string) {
    this.name  = name;    // 貓咪的名字
    this.breed = breed;   // 貓咪的品種

    /* 介紹貓咪 */
    this.introduction = function () {
      return `This is ${this.name} and it belongs to ${this.breed}`;
    }
    return this;
  }
  ```

- ### 5.1.3 類別的宣告形式 Class Declaration
  `ECMAScript` 第六版標準已經有了基礎的類別語言
  ```js
  Class Cat {
    /* 此為建構子函式，作為初始化實體的地方 */
    constructor(name, breed) {
      /* 成員變數的初始化 */
      this.name  = name;    // 貓咪的名字
      this.breed = breed;   // 貓咪的品種
    }

    /* 宣告成員方法 introduction */
    introduction() {
      return `This is ${this.name} and it belongs to ${this.breed}`;
    }
  }
  ```

  宣告類別，就是使用 `class` 關鍵字，`建構子函式 (Constructor Function)` 則是在 `類別裡宣告一個名為 constructor` 的函式，裡面的內容是對實體的 `初始化 (Initialization)` 行為。
  
- ### 5.1.4 物件導向的核心概念
  - #### 物件導向的基礎概念 Fundamentals of Object-Oriented Programming
    兩大主角 -- `類別` 與 `物件`
    - `類別 (Class)` 為物件的藍圖，內部可能包含變數、函式與不同複雜資料結構的組合，主要為描述物件的規格；宣告過後，程式運行過程中，由於不易被更動，所以具備 `靜態 (Static)` 的性質。
    - `物件 (Object)` 則是 `擁有屬性與方法的資料型態`，而物件又被稱作為建立該物件的類別的 `實體 (Instance)`，具備高度 `異變性(Mutation)`，因此才會說具有 `動態 (Dynamic)` 的性質；通常使用者是不會管物件內部是如何實作的，因為這是物件屬於的類別內部的實作過程，使用者只需要會操作物件提供的屬性與方法就好了。

    三大概念 -- `封裝`、`繼承` 與 `多型`
    - ##### 封裝 (Encapsulation)
      描述的是 `類別的實作意義`，將詳細的實作內容密封在類別內部，外面的使用者不需要去管內部到底長什麼樣子，直接操作類別提供的屬性與方法。
    - ##### 繼承 (Inheritance)
      描述的是 `類別的層級關係`，可以將類別的實作規格傳遞給繼承的其他類別。
    - ##### 多型 (Polymorphism)
      描述的是 `類別與物件的操作多樣性`，不同類別的物件可以用相同名稱的規格達到不同種類的功能，以 `函式超載 (Function Overloading)` 與 `覆寫 (Overwriting)` 的方式達成。

## 5.2 TypeScript 類別語法 Class Syntax
- ### 5.2.1 類別的宣告 Class Declaration
  - 1. 類別的宣告形同宣告一個新的型別。
  - 2. 類別宣告過程，總共有三大部分要注意：
    - 成員變數的宣告
    - 初始化過程
    - 成員方法的宣告
  - 3. 初始化的過程一律都是使用 `建構子函式`，也就是名為 `constructor` 的函式。
  - 4. 在 `使用任何成員變數前，一定要先行宣告`。
  - 5. 假設宣告類別 `C`，其成員變數為 `V1`、`V2`...、`VN`，對應型別為 `T1`、`T2`...、`TN`，成員方法則為 `M1`、`M2`...、`MN`，則語法如下：
    ```ts
    class C {
      V1: T1;
      V2: T2;
      // ...
      VN: TN;

      constructor(/* 建構子函式的參數 */) {
        /* 初始化流程 */
      }

      M1(/* M1 的參數 */) { /* ... */ }
      M2(/* M2 的參數 */) { /* ... */ }
      // ...
      MN(/* MN 的參數 */) { /* ... */ }
    }
    ```

  請記得，如果成員變數的宣告過程，沒有初始化型別對應的值，就會出現警告訊息。

  除了將成員變數對應的型別與 `undefined` 進行聯集外，否則宣告的同時將它設定成 `選用成員 (Optional Member)`，亦或者是在建構子函式內指派初始值。

- ### 5.2.2 存取修飾子 Access Modifiers
  - 1. 存取修飾子，主要在 `控制類別成員的使用權限`。
  - 2. 分成三種模式
    - 開放 `public`
    - 私有 `private`
    - 保護 `protected`
  - 3. 若類別內的成員沒有指定任何存取模式，一切都 `預設為開放模式`，代表該類別成員，可以在類別內部與外面被使用。
  - 4. 若 `僅限定某類別成員在類別內` 使用時，可以標註為 `私有模式`。
  - 5. 若 `僅限定某類別成員在類別內` 或 `繼承該類別的其他類別` 使用時，可以標註為 `保護模式`。
  - 6. 若要標示存取修飾子在某類別 `C` 的成員時，寫法如下：
    ```ts
    class C {
      /* 宣告成員變數 */
      <public | private | protected> V: T;

      constructor(/* 建構子函式的參數 */) {
        /* 初始化流程 */
      }

      /* 宣告成員方法 */
      <public | private | protected> M(/* M 的參數 */) { /* ... */ };
    }
    ```
    
    若建構子函式，有參數可以直接初始化成員變數時，可以將寫法簡化如下：
    ```ts
    class C {
      constructor(
        /* 宣告建構子函式的參數同時，宣告類別的成員變數 */
        <public | private | protected> V: T;

        // 其餘建構子函式的參數...
      ) { /* 初始化流程 */ }

      /* 宣告成員方法 */
      <public | private | protected> M(/* M 的參數 */) { /* ... */ };
    }
    ```

- ### 5.2.3 存取方法 Accessors
  - 1. 存取方法，主要是 `動態模擬物件屬性的存取與取值行為`。
  - 2. `取值方法 (Getter Methods)` 的宣告，就是在類別成員方法前面標上 `get` 關鍵字，並且該方法的宣告不能有任何參數。
  - 3. `存值方法 (Setter Methods)` 的宣告，就是在類別成員方法前面標上 `set` 關鍵字，並且該方法的宣告一定要有一個參數。
  - 4. 存取方法 `可以被標上存取修飾子 (Access Modifiers)`，意思是說存取方法可以被設定為開放、私有與保護模式。

- ### 5.2.4 靜態成員 Static Members
  - 1. 靜態成員主要為 `類別本身的屬性與方法`。
  - 2. 靜態成員的宣告，必須使用關鍵字 `static`。
  - 3. 靜態成員也 `可以標上存取修飾子 (Access Modifiers)`，使得該靜態成員的模式為開放、私有或者是保護狀態。

- ### 5.2.5 唯讀成員 Read-Only Members
  - #### 唯讀成員變數 Read-Only Members Variables
    - 1. 類別宣告成員變數時，可以附上唯讀屬性操作符 `readonly` 使該成員被設定為 `唯讀狀態`。
    - 2. 類別靜態屬性，也可以附上唯讀屬性操作符。

- ### 5.2.6 類別繼承 Class Inferitance
  - 1. 類別的繼承過程中，被繼承的類別為 `父類別 (Parent Class 或 Super Class)`，繼承的類別相對來說就是 `子類別 (Child Class 或 Subclass)`。
  - 2. 繼承過後的類別，將 `擁有父類別的所有開放模式 (Public)` 與 `保護模式 (Protected) 下的成員`。
  - 3. 繼承過後的類別，若想要在初始化過程中，初始化父類別的成員變數，可以 `使用關鍵字 super 函式`，因為它就是`父類別的建構子函式`。
  - 4. 類別繼承的語法必須使用關鍵字 `extends`，宣告方式為：
    ```ts
    class <subclass> extends <super-class> {}
    ```

- ### 5.2.7 抽象類別 Abstract Class
  - 1. 當某個類別被設計為 `專門被繼承` 時，以及 `強制要求開發者必須實踐特定的規格或成員` 時，該類別可以被宣告為 `抽象類別`。
  - 2. 抽象類別既然是專門被繼承用，理論上單獨使用是不合理的，因此 `不能拿抽象類別建立實體`。
  - 3. 任何繼承抽象類別的 `子類別，都必須實踐抽象類別裡的抽象成員`。
  - 4. 抽象類別以及任何抽象成員，必須使用關鍵字 `abstract` 進行宣告。
  - 5. 由於抽象成員被規定是必須實作的規格，因此 `抽象成員並無存取權限狀態`；也就是說，私有或保護模式的抽象成員是不存在的。

## 5.3 型別系統中的類別
- ### 5.3.1 型別推論機制
  類別本身自成一種型別
  ```ts
  class Cat {
    constructor(public name: string, public breed: string) {}

    public introduction() { /* 略... */ }
  }

  /* aCat 會被推論為型別 Cat */
  const aCat = new Cat('Julia', 'Scottish Fold');
  ```

  不管類別到底繼承自誰，只要哪個類別初始化實體，就會推論為哪種類別
  ```ts
  class Vehicle {
    constructor(public type: string, public wheels: number) {}

    public makeNoise() { /* 略... */ }
  }

  class Car extends Vehicle {
    constructor(public brand: string, public color: string) {
      super('Car', 4);
    }
  }

  /* vehicle 會被推論為型別 Vehicle */
  const vehicle = new Vehicle('Bus', 8);

  /* car 則會被推論為型別 Car */
  const car = new Car('Cadillac', 'Black');
  ```

- ### 5.3.2 型別註記機制
  可以拿類別名稱來註記
  ```ts
  /* definitelyACat 被註記為 Cat 型別 */
  const definitelyACat: Cat = new Cat('Julia', 'Scottish Fold');
  ```

  父子繼承關係的類別，子類別除了可以註記為子類別的型別外，也可以選擇註記為父類別的型別。
  ```ts
  /* Car 為 Vehicle 的子類別，註記為 Car 或 Vehicle */
  const car1: Car     = new Car('Cadillac', 'Black');
  const car2: Vehicle = new Car('Cadillac', 'Black');
  ```

  - #### 類別的推論與註記機制 Type Inference & Annotation of Class
    - 1. 當為註記的變數被指派某類別建構的實體時，`推論結果就是該類別建構子的名稱`。
    - 2. 子類別建構出的實體，絕對可以指派到被註記為子類別或者是父類別型別的變數中。
    - 3. 父類別建構出的實體，除了可以被指派到被註記為父類別的變數外，如果 `繼承的子類別並沒有額外宣告新的成員時，父類別實體也可以被指派到該子類別型別的變數`，關鍵都是在看父子類別結構有沒有相等。

## [本章練習](../A/typeScript-A.html#第五章-typescript-類別基礎)
