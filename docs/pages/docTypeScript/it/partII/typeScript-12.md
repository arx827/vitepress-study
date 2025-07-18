---
title: IT邦 - 讓 TypeScript 成為你全端開發的 ACE !
---

# 12 TypeScript 裝飾子
  `裝飾子(Decorator)` 這個東西是物件導向裡、設計模式中的一種包裝類別或類別成員的輕量化程式碼，通常也是為了使用 `類別繼承(Inheritance)` 而產生直接耦合的情況。不過 `TypeScript` 提供的裝飾子比較偏向於 `語法糖(Syntax Sugar)` 的寫法，而非物件導向相關的語法 (諸如類別、介面等語法)。

  另外，裝飾子事實上在 `ECMAScript` 標準的規劃中還在籌備階段，因此 `TypeScript` 的裝飾子在官方被稱作為 -- 比較偏向於 `實驗性特色 (Experimental Feature)` 的語法；然而知名的框架，如 `Angular` 以及一些常見的 `NodeJS` 後端框架，如 `ExpressJS` 也都有使用到此裝飾子的語法糖。

## 12.1 裝飾子的簡介 Introduction to Decorators
### 12.1.1 啟用實驗性設定
  由於裝飾子本身是實驗性的語法特色，因此在正式進到裝飾子語法的討論之前，請先在專案裡的 `TypeScript` 設定檔 (也就是 `tsconfig.json`) 啟用兩個選項，分別是：`experimentalDecorators` 以及 `emitDecoratorMetadata`。
  ```json
  /* tsconfig.json */
  {
    // 其他設定略...

    /* Experimental Options */
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,

    // 其他設定略...
  }
  ```

### 12.1.2 Hello! Decorator!
  裝飾子的語法，以下就用簡單的範例：
  ```ts
  class Cat {
    public name: string;
    public breed: string;

    constructor(name: string, breed: string) {
      this.name = name;
      this.breed = breed;
    }

    get info() {
      return `${this.name} is a ${this.breed}`;
    }

    // 放上裝飾子 decorate
    @decorate
    public makeNoise() {
      console.log('Meow meow meow~~~');
    };
  }

  // 裝飾子函式的宣告
  function decorate(target: any, key: string, desc: PropertyDescriptor) {
    console.log('Hello world!');

    // 印出裝飾子的參數
    console.log(target);
    console.log(key);
    console.log(desc);
  }
  ```

  以上宣告一個貓咪類別 `Cat` 以及一個普通函式 `decorate`，而類別 `Cat` 的成員方法 `makeNoise` 被安裝了 `decorate` 裝飾子；如果你將其編譯並且執行時，就會出現以下的訊息：
  ```sh
  Hello world!
  Cat { info: [Getter], makeNoise: [Function]}
  makeNoise
  {
    value: [Function],
    writable: true,
    enumerable: true,
    configurable: true
  }
  ```

  - `target` 參數存有 `Cat.prototype` 這個物件，也就是說，裝飾子函式裡的 `第一個參數 `為 `被裝飾的程式碼所屬類別的原型`。
  - `第二個參數` 為 `被裝飾到的東西` (可為類別成員的方法、屬性、或類別本身甚至於方法裡的參數等) 的 `名稱`。
  - 最後一個參數 為 被裝飾到的成員對應之屬性描述器。

  裝飾子，除了省掉第一個參數外，前面的兩個參數必須存在，否則裝飾子會被 `TypeScript` 發出警告。

### 12.1.3 裝飾子等效語法特性
  `裝飾子在使用時，只會被呼叫一次` -- 而唯一的那一次就是 `宣告類別的時候呼叫`。
  ```ts
  class Cat {
    // 略...

    // 放上裝飾子 decorate
    @decorate
    public makeNoise() {
      console.log('Meow meow meow~~~');
    };
  }

  // 裝飾子函式的宣告
  function decorate(target: any, key: string, desc: PropertyDescriptor) {
    // 略...
  }
  ```

  就算沒有建立任何類別 `Cat` 的 `實體 (Instance)`，該類別被宣告並且成員方法 `makeNoise` 被裝飾 `decorate` 的那一剎那就會執行 `decorate` 函式的內容。

  使用 `tsc` 進行編譯，並且檢視結果時，大致上的結構如下：
  ```ts
  var __decorate = (this && this.__decorate) ||
    function (decorators, target, key, desc) {
      // 裡面內容超複雜，因此略...
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

  var Cat = /** @class */ (function () {
    // 略...

    Cat.prototype.makeNoise = function (a) {
      console.log('Meow meow meow~~~');
    };
    ;
    __decorate([
      decorate
    ], Cat.prototype, "makeNoise");
    return Cat;
  }());

  function decorate(target, key, desc) {
    // 略...
  }
  ```

  首先，應該可以看到，`TypeScript` 在實踐裝飾子的特性時，使用 `__decorate` 函式將類別 `Cat` 以及成員名稱 `makeNoise` 套入名為 `decorate` 的裝飾子：
  ```ts
  // 略...

  __decorate([
    decorate
  ], Cat.prototype, "makeNoise");

  // 略...
  ```

  如果將編譯過後的結果，拔掉一些判斷敘述等過程，簡化之等效結果如下：
  ```ts
  function __decorate(decorators, target, key) {
    // 先取得 key 之屬性描述器
    let desc = Object.getOwnPropertyDescriptor(target, key);

    // 將每個裝飾子函式，套入原型、成員名稱以及對應之屬性描述器
    for (let i = 0; i < decorators.length; i += 1) {
      const decorator = decorators[i];

      decorator(target, key, desc);
    }
  }
  ```

  除了將屬性描述器取出外，裝飾子語法僅僅就是 `將原型、被裝飾的東西名稱和對應之屬性描述器丟進裝飾子函式罷了`。

  另外，從以上的簡化程式碼可以得知，`同一個成員目標可以附上多個裝飾子`，因為它適用 `For` 迴圈對多個裝飾子進行迭代；也就是說，以下的寫法是可以的：
  ```ts
  class Cat {
    // 略...

    // 放上多個裝飾子 decorate1
    @decorate1
    @decorate2
    public makeNoise() {
      console.log('Meow meow meow~~~');
    };
  }

  // 裝飾子函式的宣告
  function decorate1(target: any, key: string, desc: PropertyDescriptor) {
    console.log('From decorator 1');
  }

  function decorate2(target: any, key: string, desc: PropertyDescriptor) {
    console.log('From decorator 2');
  }
  ```

  但如果認為是 `From decorator 1` 這個訊息先印出來的話，那就錯了！

  以上範例運作結果為：
  ```sh
  From decorator 2
  From decorator 1
  ```

  `越靠近` 被裝飾的目標的裝飾子函式會先被觸發；也就是說，由於 `decorate2` 裝飾的位置靠近 `makeNoise` 成員，因此它最先觸發。

  事實上，要理解裝飾子，除了其基本的等效語法過程外，`裝飾子被觸發的順序` 也會是本章的重點之一。

## 12.2 裝飾子的種類
  裝飾子的種類，可能會以各種樣貌出現。

### 12.2.1 成員方法裝飾子
  `成員方法裝飾子 (Member Method Decorator)`
  ```ts
  class SomeClass {
    // 其他成員略...

    /* 使用類別成員方法裝飾子 */
    @decorate
    method() { /* 略... */ }
  }

  /* 成員方法裝飾子 */
  function decorate(target: any, key: string, desc: PropertyDescriptor) {
    console.log(target);  // 所屬類別的原型 Prototype
    console.log(key);     // 成員方法名稱
    console.log(desc);    // 成員方法之屬性描述器
  }
  ```

  基本上會有三個參數，假設裝飾在 `SomeClass` 這個類別的成員方法時，`decorate` 函式之第一個參數是 `SomeClass` 的原型物件 (也就是 `SomeClass.prototype`)、第二個 `key` 則是被裝飾的方法名稱 `method` (型別為字串)，最後一個則是該方法的屬性描述器。

### 12.2.2 存取方法裝飾子
  `存取方法 (Accessor Method)` 也可以使用裝飾子：
  ```ts
  class Cat {
    // 略...

    /* 存取方法可以放上裝飾子 */
    @decorate
    get info() {
      return `${this.name} is a ${this.breed}`;
    }

    // 略...
  }

  // 裝飾子函式的宣告
  function decorate(target: any, key: string, desc: PropertyDescriptor) {
    // 印出裝飾子的參數
    console.log(target);
    console.log(key);
    console.log(desc);
  }
  ```

  印出的結果如下：
  ```sh
  Cat { info: [Getter], makeNoise: [Function]}
  info
  {
    get: [Function: get],   // 取值方法
    set: undefined,         // 由於沒有宣告存值方法，因此此為 undefined
    enumerable: true,
    configurable: true
  }
  ```

### 12.2.3 成員變數裝飾子
  前面的條目中，裝飾子函式的第一個參數 `target` 指涉到的類別原型物件裡，似乎 `只有顯示成員方法但沒有成員變數`？
  ```sh
  Cat { info: [Getter], makeNoise: [Function]}
  ```

  從以上的結果發現，除了成員方法與存取方法外，`成員變數的資訊並沒有出現在上面`；基本上，成員變數綁定的時機點為 `物件被初始化` (也就是建構物件實體時) 時，成員變數的值才會出來，畢竟有時候初始化值是在 `建構子函式 (Constructor Function)` 裡進行初始化的。
  ```ts
  class Cat {
    public name: string;
    public breed: string;

    /* 成員變數除了宣告類別成員時可以指派外，大多數情形會在 constructor 函式裡初始化 */
    constructor(name: string, breed: string) {
      this.name = name;
      this.breed = breed;
    }

    // 略...
  }
  ```

  裝飾子函式會在類別剛宣告時執行，但成員變數的值，要等到實體被建構時才會確定，這時候裝飾子函式裡面的內容早就被執行過了；這也意味著，想要 `知道成員變數的屬性描述狀態是根本不可能的事情`。

  於是，可以得出很簡單的結論：成員變數的裝飾子，事實上就是省略掉成員方法修飾子的最後一個參數！
  ```ts
  class Cat {
    /* 裝飾到成員變數的宣告上 */
    @memberVariableDecorate
    public name: string;

    // 略...
  }

  // 成員變數的裝飾子函式的宣告，只有兩個參數
  function memberVariableDecorate(target: any, key: string) {
    // 印出裝飾子的參數
    console.log(target);
    console.log(key);
  }
  ```

  印出：
  ```sh
  Cat { info: [Getter], makeNoise: [Function]}
  name
  ```

### 12.2.4 靜態成員裝飾子
  靜態成員部分分成 `靜態方法`、`靜態存取方法` 與 `靜態屬性`，跟普通成員的差別就只差在 靜態成員是在類別被宣告時就出現的成員，綁定在類別本身，而非由類別建構的實體上。

  `靜態成員當然也可以被裝飾`：
  ```ts
  class Circle {
    /* 裝飾到靜態屬性的宣告上 */
    @decorateStaticProperty
    public static PI: number = Math.PI;

    /* 裝飾到靜態方法的宣告上 */
    @decorateStaticMethod
    public static area(radius: number) {
      return Circle.PI * (radius ** 2)
    }
  }

  // 靜態屬性裝飾子
  function decorateStaticProperty(target: any, key: string) {
    // 印出裝飾子的參數
    console.log(target);
    console.log(key);
  }

  // 靜態方法以及靜態存取方法裝飾子
  function decorateStaticMethod(
    target: any,
    key: string,
    desc: PropertyDescriptor
  ) {
    // 印出裝飾子的參數
    console.log(target);
    console.log(key);
    console.log(desc);
  }
  ```

  以上的範例印出的結果如下：
  ```sh
  [Function: Circle] { area: [Function], PI: 3.141592653589793}
  PI
  [Function: Circle] { area: [Function], PI: 3.141592653589793}
  area
  {
    value: [Function],
    writable: true,
    enumerable: true,
    configurable: true
  }
  ```

  靜態成員的裝飾子，`target` 指涉的東西變成了 `類別建構子函式(Constructor Function)` 本身；靜態成員與普通成員裝飾子中，第一個參數差異在於，前者是類別建構子函式，後者則是該類別的 `原型物件(Prototype)`。

### 12.2.5 參數裝飾子
  類別裡方法所宣告的 `參數 (Parameter)` 也可以被裝飾，所以又被稱作 `參數裝飾子 (Parameter Decorator)`。

  然而，參數裝飾子並沒有所謂的屬性描述器，`取而代之的是該參數所在的位置`。
  ```ts
  class Cat {
    // 略...

    public makeNoise(
      @decorateParameter noise: string = 'Meow meow meow~~~'
    ) {
      console.log(noise);
    }
  }

  // 參數裝飾子函式的宣告，第三個參數 index 為被裝飾之參數位置
  function decorateParameter(target: any, key: string, index: number) {
    // 印出裝飾子的參數
    console.log(target);
    console.log(key);
    console.log(index);
  }
  ```

  而以上的程式碼運作結果，參數 `target`，其代表的值就是 `Cat` 類別的原型物件。

  第二個參數 `key`，實際上 `參數裝飾子函式之第二個參數的值，是該參數所宣告在的方法名稱`，所以結果是 `makeNoise`。

  因此，為了區隔參數的種類，就出現了第三個參數 `index`，也就是代表參數的位置，跟陣列的索引邏輯一樣，參數位置由數字0開始計數。
  ```sh
  Cat { info: [Getter], makeNoise: [Function]}
  makeNoise   // 注意：並非參數名稱 noise，而是參數所在的方法名稱 makeNoise
  0           // noise 為 makeNoise 方法裡的第一個參數，所以 0
  ```

### 12.2.6 類別裝飾子
  裝飾子難在 `它可以裝飾在類別裡的任何地方` (甚至 `連類別本身`)，若沒搞清楚類別裡宣告的東西的特性，裝飾子的宣告與使用會變成一場惡夢。

  類別裝飾子就是 `裝飾在類別宣告的裝飾子`；既然是裝飾在類別的宣告上，`裝飾子就只會`(而且 `絕對`)`需要一個參數`，代表的是 `該類別的建構子函式`，以下舉類別 `Cat` 為範例：
  ```ts
  @decorateClass
  class Cat { /* 略... */ }

  // 類別裝飾子的宣告
  function decorateClass(constructor: Function) {
    // 印出類別裝飾子的參數
    console.log(constructor);
  }
  ```

  類別裝飾子的函式宣告簡單許多，畢竟跟類別成員不一樣的地方除了本身沒有屬性描述器外，想要知道被裝飾的類別名稱，可以使用 `constructor.name` 來代表；
  因此，可以想說之前講過的裝飾子都需要 `key` 這個參數，代表被裝飾的東西的名稱，而這次不需要宣告的理由就是因爲 `constructor` (也就是類別裝飾子的第一個參數) 所提供的資訊已足夠。

## 12.3 裝飾子的運用
### 12.3.1 屬性描述器的介紹 Property Descriptor
  裝飾子函式中，屬性描述器只會出現在裝飾於成員方法、存取方法 (以及靜態方法與靜態存取方法) 中；裝飾子函式的目的是避免程式碼直接耦合的情形，而改採用裝飾子包裝的方式處理。

  通常需要被裝飾子包裝、避免直接耦合的程式碼，自然而然就是指函式、方法類型的東西，而不會是純屬性類型的東西。(屬性就是一個值而已，但函式、方法等可以經由組合的方式產生不同結果)。

  因此只有成員方法等類型的裝飾子函式，才會提供屬性描述器這個物件；屬性描述器長相有兩種版本，而且這兩種版本是互不相容的，分別是 `資料描述器 (Data Descriptor)` 以及 `存取描述器 (Accessor Descriptor)`。

  想要取得物件的屬性描述器，可以使用 `Object.getOwnPropertyDescriptor` 這個方法；以下面的 `JSON` 物件為例，假設想要取得 `maxwell` 物件的 `name` 屬性的屬性描述器：
  ```ts
  let maxwell = {
    name: 'Maxwell',
    age: 18,
    interests: ['Programming', 'Drawing']
  };

  /* 取得 maxwell.name 之屬性描述器 */
  console.log(Object.getOwnPropertyDescriptor(maxwell, 'name'));
  ```

  以上的 `console.log` 印出來的結果為：
  ```text {2-3}
  {
    value: 'Maxwell',
    writable: true,
    enumerable: true,
    configurable: true
  }
  ```

  資料描述器有四大屬性 -- 其中 `value` 是為該物件屬性對應的值，也就是說，`maxwell.name` 的值為字串 `'Maxwell'`；而 `writable` 為該物件之屬性是否為可被覆寫的狀態，如果 `writable` 為 `false` 時，則 `maxwell.name` 就是不可覆寫狀態，俗稱 `唯獨狀態 (Read-Only)`。

  資料描述器裡的 `enumerable` 則代表該屬性 (也就是 `maxwell.name` 裡的 `name` 屬性) 是否可以在 `for...in...` 迴圈被迭代，意思是說：
  ```ts
  let maxwell = {
    name: 'Maxwell',
    age: 18,
    interests: ['Programming', 'Drawing']
  };

  for (let prop in maxwell) {
    console.log(prop);
  }
  // => 'name'
  // => 'age'
  // => 'interests'
  ```

  以上的範例程式碼使用 `for...in...` 迴圈，可以迭代出 `maxwell` 這個物件裡所有的屬性；相對地，如果 `enumerable` 為 `false`，`for...in...` 迴圈就不會出現該屬性。

  最後，`configurable` 則是指能不能夠修改該屬性的描述器資訊，亦或者是刪掉該屬性。

  假設想要讓 `maxwell.age` 修改成唯獨狀態、不能夠被迭代，並且不能夠被修改，可以使用 `Object.defineProperty`，第一個參數填上 `maxwell` 物件、第二個則是目標屬性 `age`，最後則是屬性的資料描述器：
  ```ts
  let maxwell = {
    name: 'Maxwell',
    age: 18,
    interests: ['Programming', 'Drawing']
  };

  Object.defineProperty(maxwell, 'age', {
    value: 18,
    writable: false,
    enumerable: false,
    configurable: false
  });
  ```

  - 這樣一來，想要覆寫掉 `maxwell.age` 就會出現錯誤訊息。
  - 想要使用 `for...in...` 迴圈檢視物件時，`maxwell.age` 就會被跳過。
  - 想要重新宣告 `maxwell.age` 的資料描述性質時，也會出現錯誤訊息。

  以上為資料描述器的簡單介紹；另一種屬性描述器的形式為 `存取描述器`，以下面 `JSON` 物件的例子為範例：
  ```ts
  let circle = {
    _radius: 0,
    area: 0,

    /* 宣告 radius 為存取方法 */
    get radius() { return this._radius; },
    set radius(value: number) {
      this._radius = value;
      this.area = Math.PI * ( value ** 2 );
    },
  };
  ```

  以上的範例可以發現，`circle.radius` 為存取方法，亦可以被視為動態的物件屬性，與類別存取方法的宣告方式近似，而使用起來的效果也很接近：
  ```ts
  /* 初始值 */
  console.log(circle.radius);   // => 0
  console.log(circle.area);   // => 0

  /* 動態設定 radius 屬性 */
  circle.radius = 5;
  console.log(circle.radius);   // => 5
  console.log(circle.area);     // => 78.53981633974483
  ```

  如果用 `Object.getOwnPropertyDescriptor` 檢視 `circle.radius` 屬性時，會發現存取描述器的結構如下：
  ```text{2-3}
  {
    get: [Function: get radius],
    set: [Function: set radius],
    enumerable: true,
    configurable: true
  }
  ```

  存取描述器有別於資料描述器的特徵，存取描述器會描述存取方法 (也就是 `get` 以及 `set` 屬性) 以及該屬性是否可以被 `for...in...` 迴圈 `迭代 (enumerable)` 以及是否可以修改該存取描述器的性質 `(configurable)`。

### 12.3.2 善用屬性描述器
  可以修改成員方法 (以及存取方法等) 的性質，如將該成員方法設定成 `唯讀狀態`：
  ```ts
  class Cat {
    public name: string;
    public breed: string;

    // 略...

    @readonly
    public makeNoise() {
      console.log('Meow meow meow~~~');
    };
  }

  // readonly 裝飾子函式的宣告
  function readonly(target: any, key: string, desc: PropertyDescriptor) {
    desc.writable = false;
  }
  ```

  如果建構出 `Cat` 實體時，使用 `Object.getOwnPropertyDescriptor` 檢視 `makeNoise` 方法的屬性描述器，就會發現 `writable` 就被篡改了：
  ```ts
  let cat = new Cat('Julia', 'Scottish Fold');

  // 檢視 cat.makeNoise 的屬性描述
  console.log(Object.getOwnPropertyDescriptor(cat, 'makeNoise'));
  ```

  因此，如果程式碼擅自想要覆寫掉 `makeNoise` 方法時，就會出現一長串錯誤訊息。

  另外，類別在宣告的過程中，也可以寫個簡單的裝飾子，專門輔助我們除 `Bug`，例如：
  ```ts
  class SomeClass {
    // 略...

    @debug
    public someMethod(message: string) {
      throw new Error(message);
    };
  }

  // debug 裝飾子函式的宣告
  function debug(target: any, key: string, desc: PropertyDescriptor) {
    /* 取得原本的方法 */
    const method = desc.value;

    /* 包裝原本的方法到 try ... catch ... 敘述式 */
    desc.value = function (...params: any[]) {
      try {
        /* 如果呼叫方法時出現錯誤，就會進入到 catch 敘述式那邊 */
        method(...params);
      } catch (err) {
        const className = target.constructor.name;
        console.log(`Error occurred in ${className}.prototype.${key}`);
        console.log(`Error: ${err.message}`);
      }
    }
  }
  ```

  該範例就是從屬性描述器中，將原本的方法拔出來，並且用新的函式宣告覆寫掉原本的方法。

  而新的函式宣告就是將一個簡單的 `try...catch...` 敘述式包在舊的函式宣告裡，因此如果建構出 `SomeClass` 的實體，並且呼叫被 `@debug` 裝飾子包裝過後的 `someMethod` 方法時，就會出現以下的結果：
  ```ts
  let instance = new SomeClass();

  instance.someMethod('Hello world!');
  // Error occurred in SomeClass.prototype.someMethod
  // Error：Hello world!
  ```

  裝飾子的好處即是 -- 簡簡單單一行裝飾在類別成員上，就可以重複利用這些裝飾子內部的程式碼。

### 12.3.3 裝飾子工廠函式
  裝飾子的另一種用法是搭配 `工廠方法 (Factory Method)` 模式，也就是所謂的 `裝飾子工廠 (Decorator Factory)`。

  它的概念很簡單，也可以將其理解為裝飾子函式 `參數化 (Parameterization)` 的一種手段；以前面的裝飾子 `@readonly` 為例，假設今天想要改成，`@readonly` 可以填入一個布林值參數，作為設定成唯讀模式的依據：
  ```ts
  class Cat {
    public name: string;
    public breed: string;

    // 略...

    @readonly(true)           // 設定成唯讀模式
    public makeNoise() {
      console.log('Meow meow meow~~~');
    };
  }
  ```

  這種情況下，原本的 `@readonly` 裝飾子函式宣告方式為：
  ```ts
  function readonly(target: any, key: string, desc: PropertyDescriptor) {
    desc.writable = false;
  }
  ```

  由於 `@readonly` 想要改成 `@readonly(active: boolean)` 這種情形，勢必不能用以上的寫法；此時可以將其改成以下的宣告形式：
  ```ts
  // 宣告 readonly 裝飾子工廠函式
  function readonly(active: boolean) {
    /* 回傳正式的裝飾子函式 */
    return function (target: any, key: string, desc: PropertyDescriptor) {
      desc.writable = active;
    };
  }
  ```

  其實裝飾子工廠函式 -- 正如其名，就是 `回傳裝飾子函式` 的工廠函式，頂多就是增加了可被參數化的性質。

### 12.3.4 裝飾子執行順序
  裝飾子最重要的東西是它的 `執行順序`：
  ```ts
  @decorateClass
  class Cat {
    @decorateProperty
    public name: string;
    public breed: string;

    constructor(name: string, breed: string) {
      this.name = name;
      this.breed = breed;
    }

    @decorateMethod
    get info() {
      return `${this.name} is a ${this.breed}`;
    }

    @decorateMethod
    public makeNoise() {
      console.log('Meow meow meow~~~');
    };
  }

  function decorateClass(constructor: Function) {
    const name = constructor.name;
    console.log(`Class Decorator Invoked: ${name}`);
  }

  function decorateProperty(target: any, key: string) {
    console.log(`Property Decorator Invoked: ${key}`);
  }

  function decorateMethod(target: any, key: string, desc: PropertyDescriptor) {
    console.log(`Member Method Decorator Invoked: ${key}`);
  }
  ```

  以上的程式碼簡單測試常見的裝飾子，其印出結果為：
  ```sh
  Property Decorator Invoked: name            // 屬性裝飾子
  Member Method Decorator Invoked: info       // 成員方法裝飾子 (存取方法 info)
  Member Method Decorator Invoked: makeNoise  // 成員方法裝飾子 (方法 makeNoise)
  Class Decorator Invoked: Cat                // 類別裝飾子
  ```

  順序看起來很複雜，不過只要記得一個重點 -- `類別裝飾子裡的程式最後執行`，其餘皆按照成員先後宣告順序執行。

  也就是說，裡面的成員變數、方法等，先被宣告並且被裝飾的東西會最先執行裝飾子的程式，最後才是類別裝飾子；原因其實不難理解，如果類別裝飾子先執行的話，裝飾子函式裡的參數 -- 也就是建構子函式等於是在類別成員為宣告完畢的狀況下執行，這樣會造成建構子函式形同空殼子，沒有什麼用處。

  另外，如果是多個裝飾子的情形，如下所示：
  ```ts
  class Cat {
    // 略...

    @decorateMethod1
    @decorateMethod2
    public makeNoise() {
      console.log('Meow meow meow~~~');
    };
  }

  function decorateMethod1(target: any, key: string, desc: PropertyDescriptor) {
    console.log(`Member Method Decorator 1 Invoked: ${key}`);
  }

  function decorateMethod2(target: any, key: string, desc: PropertyDescriptor) {
    console.log(`Member Method Decorator 2 Invoked: ${key}`);
  }
  ```

  這時候，裝飾子的執行順序是 `內層優先於外層`；也就是說，儘管 `@decorateMethod1` 先於 `@decorateMethod2` 裝飾在 `makeNoise` 方法上，但是執行順序反而是相反的：
  ```sh
  Member Method Decorator 2 Invoked: makeNoise
  Member Method Decorator 1 Invoked: makeNoise
  ```

  由於裝飾子的概念具備層層包裝的效果，因此越內層的裝飾子才會優先於外層的裝飾子執行。

  以上就是常見的裝飾子語法特性。