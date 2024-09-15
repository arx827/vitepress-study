---
title: TypeSctipt 邁向專家之路
---

# 第一篇 TypeScript 入門準備
---
# 04 JavaScript 快速入門(下)
  本章將繼續解說有助於理解 `TypeScript` 開發的 `JavaScript` 型別系統，但重心會放在 `JavaScript` 對物件的支援，包括定義物件的不同方式、以及它們與 `JavaScript` 類別 (`class`) 的關係。也會示範如何處理值的序列、`JavaScript` 的集合，最後則來看 模組 (`module`) 機制，可把一個專案拆分成多個 `JavaScript` 檔案。

## 4-1 本章行前準備
  為了建立 `primer2` 專案，請在電腦中選擇一個位置新增 `primer` 目錄，然後於命令提示字元或終端機，從該目錄的位置初始化它：
  ```sh
  \primer2> npm init --yes
  ```

  接著新增一個 `index.js` 檔案，並輸入以下的程式碼：
  ```js
  // \primer2\index.js

  let hat = {
    name: "Hat",
    price: 100,
    getPriceIncTax() {
      return Number(this.price) * 1.2;
    }
  };

  console.log(`Hat: ${hat.price}, ${hat.getPriceIncTax()}`);
  ```

## 4-2 了解 JavaScript 的物件繼承
### 4-2-1 原型 (prototype) 物件
  和其他物件導向語言不同，`JavaScript` 並沒有類別；它的所有物件，其實都連結到一個 `原型物件`，並且會從該物件繼承屬性與方法。

  原型物件本身也是物件，它們也有自己的原型物件，使得物件之間會形成一條 `原型鏈 (prototype chain)`。

  ```js {10}
  let hat = {
    name: "Hat",
    price: 100,
    getPriceIncTax() {
      return Number(this.price) * 1.2;
    }
  };

  console.log(`Hat: ${hat.price}, ${hat.getPriceIncTax()}`);
  console.log(`toString: ${hat.toString()}`);
  ```

  第二行指令呼叫了一個 `toString()` 方法，可是並沒有先幫 `hat` 物件定義 `toString` 屬性。這使得 `JavaScript` 執行環境轉而查看 `hat` 物件上游的原型，也就是 `Object` 物件。

### 4-2-2 檢視與修改原型物件
  `JavaScript` 內建的 `Object` 不僅是絕大多數物件的原型，它本身也提供了一些不必繼承便可直接使用的方法，可藉此來取得與原型物件相關的資訊。

  | 方法                    | 說明                 |
  |-------------------------|---------------------|
  | `getPrototypeOf()`      | 傳回物件的原型物件     |
  | `setPrototypeOf(物件)`  | 設定物件的原型物件     |
  | `getOwnPropertyNames()` | 傳回物件自有屬性的名稱 |

  > 物件的 `Prototype` 屬性也可讓我們存取或修改原型物件，但這麼做對 `JavaScript` 執行環境來說，是沉重的負擔。如果可以的話，建議還是使用上表列出的方法。

  ```js
  let hat = {
    name: "Hat",
    price: 100,
    getPriceIncTax() {
      return Number(this.price) * 1.2;
    }
  };
  let boots = {
    name: "Boots",
    price: 100,
    getPriceIncTax() {
      return Number(this.price) * 1.2;
    }
  };

  let hatPrototype = Object.getPrototypeOf(hat);
  console.log(`Hat Prototype: ${hatPrototype}`);
  let bootsPrototype = Object.getPrototypeOf(boots);
  console.log(`Boots Prototype: ${bootsPrototype}`);
  console.log(`Common prototype: ${hatPrototype === bootsPrototype}`);
  ```

  結果顯示 `hat` 與 `boots` 物件共享著同一個原型物件(`Object 物件`)。

### 4-2-3 自訂原型物件
  然而，若要變更 `JavaScript` 最頂層的 `Object` 物件，就必須十分小心，因為這會影響到程式中的所有物件。
  
  ```js
  // 自訂原型物件
  let ProductProto = {
    toString: function () {
      return `toString: Name: ${this.name}, Price: ${this.price}`;
    }
  };
  let hat = {
    name: "Hat",
    price: 100,
    getPriceIncTax() {
      return Number(this.price) * 1.2;
    }
  };
  let boots = {
    name: "Boots",
    price: 100,
    getPriceIncTax() {
      return Number(this.price) * 1.2;
    }
  };

  // 將物件的原型設為 ProductProto
  Object.setPrototypeOf(hat, ProductProto);
  Object.setPrototypeOf(boots, ProductProto);
  console.log(hat.toString());
  console.log(boots.toString());
  ```

  為 `ProductProto` 物件定義了一個 `toString()` 方法，並將它設為 `hat` 與 `boots` 物件的原型。

  當 `JavaScript` 在某個物件找不到某個屬性名稱時，它會沿著原型鏈往上層尋找，直到找到符合的項目或抵達原型鏈最頂端為止。

### 4-2-4 使用函式建構子產生物件
  可利用 `函式建構子 (function constructor)` 來產生新物件、定義其屬性與指派其原型，而且僅需使用一個 `new` 關鍵字，即可完成。

  ```js
  let Product = function (name, price) {    // 函式建構子
    this.name = name;
    this.price = price;
    this.toString = function () {
      return `toString: Name: ${this.name}, Price: ${this.price}`;
    };
  };

  let hat = new Product("Hat", 100);
  let boots = new Product("Boots", 100);
  console.log(hat.toString());
  console.log(boots.toString());
  ```

  在 `JavaScript` 中，函式本身也是物件，因此同樣可以新增屬性與方法。

### 4-2-5 建構子的串連
  ```js
  let Product = function (name, price) {
    this.name = name;
    this.price = price;
    this.toString = function () {
      return `toString: Name: ${this.name}, Price: ${this.price}`;
    };
  };

  // 第二個函式建構子
  let TaxedProduct = function (name, price, taxRate) {
    Product.call(this, name, price);    // 呼叫 Product 建構子
    this.taxRate = taxRate;
    this.getPriceIncTax = function () {
      return Number(this.price) * this.taxRate;
    };
    this.toTaxString = function () {
      // 呼叫 Product.toString()
      return `${this.toString()}, Tax: ${this.getPriceIncTax()}`;
    };
    this.toString = function(){
      return "overridden";
    }
  };

  // 將 TaxedProduct 建構子傳回的原型連結到 Product 傳回的原型
  Object.setPrototypeOf(TaxedProduct.prototype, Product.prototype);

  let hat = new TaxedProduct("Hat", 100, 1.2);
  let boots = new Product("Boots", 100);

  console.log(hat.toTaxString());
  console.log(boots.toString());

  console.log(`hat -> TaxedProduct: ${hat instanceof TaxedProduct}`);
  console.log(`hat -> Product: ${hat instanceof Product}`);
  console.log(`boots -> TaxedProduct: ${boots instanceof TaxedProduct}`);
  console.log(`boots -> Product: ${boots instanceof Product}`);
  ```

  首先，`TaxedProduct` 建構子透過 `call()` 方法呼叫它的上一層建構子 `Product`，以便正確繼承 `Product` 的屬性：
  ```js
  Product.call(this, name, price);
  ```

  使用 `call()` 方法可允許把新物件的值，透過 `this` 傳遞給下個建構子。
  然後第二步是把它們的原型串連起來。
  ```js
  Object.setPrototypeOf(TaxedProduct.prototype, Product.prototype);
  ```

  > 函式建構子的 `prototype` 屬性會指向函式建構子 `產生` 的原型物件，注意這不是建構子自身的原型。

  - #### 存取被覆蓋的原型方法
    在同一原型鏈當中，如果下層物件定義了相同名稱的屬性或方法，`JavaScript` 沿著原型鏈尋找時，就會優先使用這些東西，等同於新內容 `覆蓋 (override)` 或 `遮蔽 (shadowing)` 了上層原型的內容，因此這麼做時得格外小心。

    此外，屬性與方法都是會等到函式建構子建立物件時，才會放進去，這使得無法從 `TaxedProduct` 內直接呼叫 `Product` 的 `toString()` 方法。

    若真想呼叫上層原型物件的方法，可以在定義了建構子之後，透過它們的 `.prototype` 屬性取得原型並新增方法，並藉由方法的 `call()` 傳入正確的物件：

    ```js
    let Product = function (name, price) {
      this.name = name;
      this.price = price;
    };

    // 替 Product 傳回的原型定義 toString() 方法
    Product.prototype.toString = function () {
      return `toString: Name: ${this.name}, Price: ${this.price}`;
    };

    let TaxedProduct = function (name, price, taxRate) {
      Product.call(this, name, price);
      this.taxRate = taxRate;
      this.getPriceIncTax = function () {
        return Number(this.price) * this.taxRate;
      };
      this.toTaxString = function () {
        return `${this.toString()}, Tax: ${this.getPriceIncTax()}`;
      };
    };

    // 替 TaxedProduct 原型定義 toString()
    TaxedProduct.prototype.toString = function () {
      // 呼叫 Product 的原型方法
      return Product.prototype.toString.call(this);
    };

    Object.setPrototypeOf(TaxedProduct.prototype, Product.prototype);

    let hat = new TaxedProduct("Hat", 100, 1.2);
    let boots = new Product("Boots", 100);

    console.log(hat.toTaxString());
    console.log(boots.toString());

    console.log(`hat -> TaxedProduct: ${hat instanceof TaxedProduct}`);
    console.log(`hat -> Product: ${hat instanceof Product}`);
    console.log(`boots -> TaxedProduct: ${boots instanceof TaxedProduct}`);
    console.log(`boots -> Product: ${boots instanceof Product}`);
    ```

### 4-2-6 檢查原型的歸屬
  若要檢查建構子的原型物件是否出現在某個物件的原型鏈上，可使用 `instanceof` 關鍵字來查驗之
  
  ```js
  let Product = function (name, price) {
    this.name = name;
    this.price = price;
    this.toString = function () {
      return `toString: Name: ${this.name}, Price: ${this.price}`;
    };
  };

  let TaxedProduct = function (name, price, taxRate) {
    Product.call(this, name, price);
    this.taxRate = taxRate;
    this.getPriceIncTax = function () {
      return Number(this.price) * this.taxRate;
    };
    this.toTaxString = function () {
      return `${this.toString()}, Tax: ${this.getPriceIncTax()}`;
    };
    this.toString = function(){
      return "overridden";
    }
  };

  Object.setPrototypeOf(TaxedProduct.prototype, Product.prototype);

  let hat = new TaxedProduct("Hat", 100, 1.2);
  let boots = new Product("Boots", 100);

  console.log(hat.toTaxString());
  console.log(boots.toString());

  console.log(`hat -> TaxedProduct: ${hat instanceof TaxedProduct}`);
  console.log(`hat -> Product: ${hat instanceof Product}`);
  console.log(`boots -> TaxedProduct: ${boots instanceof TaxedProduct}`);
  console.log(`boots -> Product: ${boots instanceof Product}`);
  ```

  > 注意：`instanceof` 算符需要搭配函式建構子使用。若你要檢查的對象不是建構子，`Object.isPrototypeOf()` 方法可以直接用在原型物件。

### 4-2-7 靜態屬性與方法的定義
  可透過物件本身存取的屬性或方法，即為所謂的 `實例屬性 (instance property)`。也可以直接對函式建構子本身加入屬性與方法。這些只能透過建構子存取，一般稱為 `靜態(static)` 屬性及方法。

  像 `Object.setPrototypeOf()` 與 `Object.getPrototypeOf()` 就是 `靜態方法` 的典型例子。

  ```js
  let Product = function (name, price) {
    this.name = name;
    this.price = price;
    this.toString = function () {
      return `toString: Name: ${this.name}, Price: ${this.price}`;
    };
  };

  Product.process = (...products) =>
    products.forEach(p => console.log(p.toString()));

  Product.process(
    new Product("Hat", 100, 1.2), 
    new Product("Boots", 100));
  ```

## 4-3 在 JavaScript 使用類別 (class)
### 4-3-1 定義類別
  ```js
  class Product {
    constructor(name, price) {    // 類別建構子
      this.name = name;
      this.price = price;
    }
    
    toString() {    // 原型方法
      return `toString: Name: ${this.name}, Price: ${this.price}`;
    }
  };

  let hat = new Product("Hat", 100);
  let boots = new Product("Boots", 100);
  console.log(hat.toString());
  console.log(boots.toString());
  ```
  
  定義類別時需使用 `class` 關鍵字，後面接上類別名稱。

  當使用 `new` 關鍵字建立類別的新物件時，`JavaScript` 執行環境會建立一個新的空物件，接著再呼叫類別內的 `constructor()` 建構子。建構子會透過 `this` 接收新物件，並對它定義屬性。

### 4-3-2 類別繼承
  類別可使用類似 `Java` 的 `extends` 關鍵字來進行 `繼承 (inherit)`，並透過 `super` 關鍵字呼叫 `父類別(superclass)` 的建構式與方法，來產生共用的屬性。

  ```js
  class Product {
    constructor(name, price) {
      this.name = name;
      this.price = price;
    }

    toString() {
      return `toString: Name: ${this.name}, Price: ${this.price}`;
    }
  };

  // TaxedProduct 繼承 Product
  class TaxedProduct extends Product {
    constructor(name, price, taxRate = 1.2) {
      super(name, price);   // 呼叫父類別的建構式
      this.taxRate = taxRate;
    }

    getPriceIncTax() {
      return Number(this.price) * this.taxRate;
    }

    toString() {    // 覆蓋父類別的方法
      let chainResult = super.toString();     // 呼叫父類別方法
      return `${chainResult}, Tax: ${this.getPriceIncTax()}`;
    }
    
    static process(...products) {
      products.forEach(p => console.log(p.toString()));
    }
  };

  let hat = new TaxedProduct("Hat", 100);
  let boots = new TaxedProduct("Boots", 100, 1.3);

  console.log(hat.toString());
  console.log(boots.toString());
  TaxedProduct.process(hat, boots);
  ```

  `TaxedProduct` 類別使用 `extend` 關鍵字繼承 `Product` 類別的內容 (`Product` 即成為 `TaxedProduct` 的父類別)，而其建構子也使用 `super` 關鍵字呼叫其父類別的函式。
  ```js {2}
  constructor(name, price, taxRate = 1.2) {
    super(name, price);
    this.taxRate = taxRate;
  }
  ```

  `super` 關鍵字必須在使用 `this` 關鍵字之前呼叫，通常也會擺在建構子中的第一句。這便會在子類別中產生父類別定義過的屬性，達到繼承的效果。

  可以使用 `super` 來存取父類別的屬性與方法。

  ```js {2}
   toString() {
    let chainResult = super.toString();
    return `${chainResult}, Tax: ${this.getPriceIncTax()}`;
  }
  ```

  `TaxedProduct` 類別的 `toString()` 方法覆蓋了 父類別的 `toString()`，但仍會先呼叫後者作為其傳回值的基礎。

### 4-3-3 在類別定義靜態方法
  類別內也可以定義靜態方法，要用到 `static` 關鍵字。`靜態方法` 只能透過 `類別 (函式建構子)` 存取，不能透過實例物件。

  ```js {27-29,37}
  class Product {
    constructor(name, price) {
      this.name = name;
      this.price = price;
    }

    toString() {
      return `toString: Name: ${this.name}, Price: ${this.price}`;
    }
  };

  class TaxedProduct extends Product {
    constructor(name, price, taxRate = 1.2) {
      super(name, price);
      this.taxRate = taxRate;
    }

    getPriceIncTax() {
      return Number(this.price) * this.taxRate;
    }

    toString() {
      let chainResult = super.toString();
      return `${chainResult}, Tax: ${this.getPriceIncTax()}`;
    }
    
    static process(...products) {
      products.forEach(p => console.log(p.toString()));
    }
  };

  let hat = new TaxedProduct("Hat", 100);
  let boots = new TaxedProduct("Boots", 100, 1.3);

  console.log(hat.toString());
  console.log(boots.toString());
  TaxedProduct.process(hat, boots);
  ```

  `static` 關鍵字用來在 `TaxedProduct` 類別定義 `process()` 方法，這使得它只能透過 `TaxedProduct.process()` 的語法存取。

## 4-4 走訪器與產生器的使用
### 4-4-1 使用走訪器 (iterator)
  又稱 『 `迭代器` 』。
  `走訪器` 是個可依序傳回一系列值的物件。通常會搭配 `陣列` 或 `集合(collection)`。

  必須符合 `走訪器協定 (iterator protocol)`，也就是定義一個名為 `next()` 方法，這方法每次會傳回一個具有 `value` 與 `done` 屬性的物件。
  `value` 屬性會是序列中的下一個值，而整個序列走訪完畢後，`done`屬性會被設為 `true`，

  ```js
  class Product {
    constructor(name, price) {
      this.name = name;
      this.price = price;
    }

    toString() {
      return `toString: Name: ${this.name}, Price: ${this.price}`;
    }
  }

  // 傳回走訪器的函式
  function createProductIterator(...products) {
    let index = 0;
    return {    // 傳回走訪器
      next() {    // next() 方法
        // 看看 products 是否還有值可傳回
        if (index < products.length) {
          return { value: products[index++], done: false }
        } else {
          return { value: undefined, done: true }
        }
      }
    }
  }

  let iterator = createProductIterator(   // 建立走訪器 並傳入資料
    new Product("Hat", 100),
    new Product("Boots", 100),
    new Product("Umbrella", 23)
  );

  let result = iterator.next();   // 從走訪器取得第一筆結果
  while (!result.done) {    // 檢查是否走訪完畢
    console.log(result.value.toString());
    result = iterator.next();   // 從走訪器取得下一筆結果
  }
  ```

  `createProductIterator()` 函式會用『 `其餘參數` 』接收一系列 `Product` 型別物件，並傳回一個物件 `iterator`，而該物件定義了一個 `next()` 方法。

  每當呼叫 `next()` 方法時，它會傳回 `products` 陣列中的下一個 `Product` 物件；而當所有物件都依序傳回後，最後一個物件中的 `done` 屬性將被設為 `true`，表示走訪已經結束。

  使用 `while 迴圈` 來讀取走訪器傳回的資料，每印出一個物件，便呼叫 `next()` 以取得下一筆資料。

  - #### 閉包
    注意到 `createProductIterator()` 傳回的物件，仍然可以存取 `createProductIterator()` 內部的 `products` 參數和 `index` 變數等。這是因為從函式傳回的函式會變成 `閉包 (closure)`，即使離開上一層的執行範圍，也依舊能記得父函式的變數。

### 4-4-2 使用產生器 (generator)
  撰寫 `走訪器` 並不輕鬆，更簡單的做法是利用所謂的 `產生器`，產生器是個只需要呼叫一次的函式，使用 `yield` 關鍵字來產生資料序列中的值。

  ```js
  class Product {
    constructor(name, price) {
      this.name = name;
      this.price = price;
    }

    toString() {
      return `toString: Name: ${this.name}, Price: ${this.price}`;
    }
  };

  // 定義產生器，用 for...of 迴圈逐次傳回一個值
  function* createProductIterator(...products) {
    for (let product of products) {
      // yield 關鍵字 只能在 for...of 中運行
      yield product;
    }
  };

  // 取得產生器和傳入資料
  let generator = createProductIterator(
    new Product("Hat", 100),
    new Product("Boots", 100),
    new Product("Umbrella", 23)
  );

  // 從產生器取值
  let result = generator.next();
  while (!result.done) {
    console.log(result.value.toString());
    result = genrator.next();
  }
  ```

  `function*` (標上星號的 function) 代表要建立一個產生器函式，這個函式會自動實作走訪器協定，會具備取值用的 `next()` 方法。

  產生器中的 `yield` 關鍵字和 `return` 很像，會傳回一個值，但它會暫停產生器的執行、而不是讓函式結束和把控制權還給呼叫者。

  每當產生器的 `next()` 被呼叫時，產生器會繼續執行，直到 `for...of` 迴圈走訪完所有元素為止。

  等到產生器真正結束 (執行到 `return` 或函式結尾)，那麼 `next()` 傳回之物件的 `done` 屬性就會設為 `true`。

  產生器亦可搭配『 展開算符 』使用，把整個序列當成其他函式的數量不定參數，或是把資料填入陣列：
  ```js
  let generator = createProductIterator(
    new Product("Hat", 100),
    new Product("Boots", 100),
    new Product("Umbrella", 23)
  );

  [...generator].forEach(p => console.log(p.toString()));
  ```

  展開算符會透過走訪器協定，從產生器取得所有結果，在走訪完畢時自動停止，再將它一一填入新陣列。

### 4-4-3 定義可走訪物件
  以獨立函式來定義走訪器和產生器，雖是不錯的選擇，但最長需要的是一個物件，能夠同時提供序列資料和產生器，並結合其他的便利功能。

  ```js {24-28}
  // 代表資料的普通類別
  class Product {
    constructor(name, price) {
      this.name = name;
      this.price = price;
    }

    toString() {
      return `toString: Name: ${this.name}, Price: ${this.price}`;
    }
  };

  // 整合資料及產生器的類別
  class GiftPack {
    constructor(name, ...products) {
      this.name = name;
      this.products = products
    }

    getTotalPrice() {
      return this.products.reduce((total, p) => total + p.price, 0);
    }

    *getGenerator() {
      for (let product of this.products) {
        yield product;
      }
    }
  };

  let winter = new GiftPack(
    "winter",
    new Product("Hat", 100),
    new Product("Boots", 80),
    new Product("Gloves", 23)
  );

  console.log(`Total price: ${winter.getTotalPrice()}`);
  [...winter.getGenerator()].forEach(p => console.log(`Product: ${p}`));
  ```

  `getGenerator()` 方法便是個產生器，能透過 `yield` 關鍵字傳回產品資訊。產生器方法和產生器函式一樣，名稱前面得加上 `星號*`。

  但是使用產生器的語法有點複雜，因為我們得刻意去呼叫 `getGenerator()` 方法。

  更優雅的另一種寫法是利用 `特殊方法名稱 [Symbol.iterator]` 來作為產生器，它會告訴 `JavaScript` 執行環境，說這個方法為物件提供了預設的走訪器支援。

  ```js {22-26}
  class Product {
    constructor(name, price) {
      this.name = name;
      this.price = price;
    }

    toString() {
      return `toString: Name: ${this.name}, Price: ${this.price}`;
    }
  };

  class GiftPack {
    constructor(name, ...products) {
      this.name = name;
      this.products = products
    }

    getTotalPrice() {
      return this.products.reduce((total, p) => total + p.price, 0);
    }
    
    *[Symbol.iterator]() {
      for (let product of this.products) {
        yield product
      }
    }
  };

  let winter = new GiftPack(
    "winter",
    new Product("Hat", 100),
    new Product("Boots", 80),
    new Product("Gloves", 23)
  );

  console.log(`Total price: ${winter.getTotalPrice()}`);
  [...winter].forEach(p => console.log(`Product: ${p}`));
  ```

  `Symbol.iterator` 屬性被用來代表物件的預設走訪器。使用 `Symbol.iterator` 作為產生器名稱，可以直接走訪物件本身。

  ```js
  [...winter].forEach(p => console.log(`Product: ${p}`));
  ```

## 4-5 JavaScript 集合的操作
  `JavaScript` 中的資料集合是以物件與陣列來管理的，物件會透過 `鍵 (key)` 來存取資料，而陣列則仰賴 `索引 (index)` 存取資料。

### 4-5-1 在 物件 透過鍵 存放資料
  物件屬性其實也是一組 `鍵與值 (key/value pair)`，屬性名稱就是 `鍵`，可用『`物件["屬性名稱"]`』的形式存取屬性值。

  ```js
  class Product {
    constructor(name, price) {
      this.name = name;
      this.price = price;
    }
    
    toString() {
      return `toString: Name: ${this["name"]}, Price: ${this["price"]}`;
    }
  };

  let data = {
    hat: new Product("Hat", 100)
  };
  data["boots"] = new Product("Boots", 100);

  Object.keys(data).forEach(key => console.log(`${key} -> ${data[key].toString()}`));
  ```

  - #### Object 的相關功能
    | 名稱                  | 說明                            |
    |----------------------|--------------------------------|
    | `Object.keys(物件)`   | 傳回一個陣列，內容為物件個屬性的名稱 |
    | `Object.values(物件)` | 傳回一個陣列，內容為物件個屬性的值   |

### 4-5-2 在映射表 (Map) 透過 鍵 存放資料
  物件有限制，譬如它只能拿 `字串` 作為 `鍵`。
  `JavaScript` 另外提供了 `Map (映射表) 集合`，可使用任何型別的值為 `鍵`。

  ```js {12-15}
  class Product {
    constructor(name, price) {
      this.name = name;
      this.price = price;
    }
    
    toString() {
      return `toString: Name: ${this.name}, Price: ${this.price}`;
    }
  };

  let data = new Map();   // 建立 Map
  data.set("hat", new Product("Hat", 100));
  data.set("boots", new Product("Boots", 100));
  [...data.keys()].forEach(key => console.log(`${key} -> ${data.get(key).toString()}`));
  ```

  - #### Map 物件的常用方法
    |名稱|說明|
    |---|---|
    |`set(鍵, 值)`|根據指定的鍵存入一個值。|
    |`get(鍵)`|根據指定的鍵取出一個值。|
    |`has(鍵)`|傳回一個布林值，代表 `Map` 是否包含指定的鍵。|
    |`delete(鍵)`|在 `Map` 刪除指定的鍵，成功時傳回 `true`，反之傳回 `false`。|
    |`keys()`|傳回一個走訪器，包含 `Map` 裡所有元素的鍵。|
    |`values()`|傳回一個走訪器，包含 `Map` 裡所有元素的值。|
    |`entries()`|傳回一個走訪器，包含 `Map` 裡每個元素的鍵與值 (鍵與值會構成子陣列形式)。這亦是 `Map` 物件的預設走訪器，也就是直接走訪 `Map` 集合本身時得到的結果。|
    |`forEach(callback)`|將每個值傳入回呼函式執行。|

  > 若不需要持續新增或刪除鍵與值，使用 `Map` 的效率就會優於物件。

### 4-5-3 用 Symbol 當作 Map 鍵
  使用 `Map` 的最大好處是任何值都可以當作鍵，包括 `Symbol` 值。每個 `Symbol` 值都是獨一無二、而且不可變更，非常適合用來當作 `Map` 元素的鍵。
  > Symbol 值雖然好用，卻有一定的使用難度，因為無法直接檢視它的值，建立和使用時都得格外小心。

  ```js
  // 產品資料類別
  class Product {
    constructor(name, price, supplier) {
      this.id = Symbol();   // 產生獨一無二 id
      this.name = name;
      this.price = price;
      this.supplier = supplier;
    }
  };

  // 不同廠商的產品資料
  let acmeProducts = [
    new Product("Hat", 100, "Acme"),
    new Product("Boots", 100, "Acme")
  ];
  let zoomProducts = [
    new Product("Hat", 75, "Zoom"),
    new Product("Boots", 125, "Zoom")
  ];

  // 將資料集合成陣列後，以物件 id 為鍵，將物件存入 Map
  let products = new Map();
  [...acmeProducts, ...zoomProducts].forEach(p => products.set(p.id, p));

  // 走訪 Map 並印出特定供應商的產品
  products.forEach(p => {
    if (p["supplier"] == "Zoom") {
      console.log(`Name: ${p.name}, Price: ${p.price}, Supplier: ${p.supplier}`)
    }
  })
  ```
  用 `Symbol` 值當鍵的好處是，絕對不會有兩組鍵起衝突，反過來說 `Symbol` 值，無法以字串形式印出。
  
  ```js
  Map(4) {
    Symbol() => Product { id: Symbol(), name: "Hat", price: 100},
    Symbol() => Product { id: Symbol(), name: "Boots", price: 100},
    Symbol() => Product { id: Symbol(), name: "Hat", price: 75},
    Symbol() => Product { id: Symbol(), name: "Boots", price: 125},
  }
  ```

  > ## Symbol 的特性與其他用途
  > `Symbol` 值的另一個用途是替物件加入某種意義上的私有屬性，實現 `弱裝備 (weak encapsulation)` 的效果。以往物件只能使用字串作為鍵，但從 `ES6` 起也可以用 `Symbol` 值為鍵 (當成屬性名稱)。

  ```js
  obj = {}
  obj.data = "open data"  // 用字串當屬性名
  obj[Symbol()] = "secret data"   // 用 Symbol 值當屬性名

  console.log(obj);   // 印出物件
  console.log(JSON.stringify(obj));     // 轉成 JSON 格式
  console.log(Object.keys(obj));      // 印出物件的 鍵
  console.log(Object.getOwnPropertySymbols(obj));     // 印出物件的 Symbol 鍵
  ```

  > 可以看到 `JSON.stringify()` 和 `Object.keys()` 都會忽略名稱是 `Symbol` 值的鍵。必須直接印出物件或使用 `Object.getOwnPropertySymbols()` 才能看到它們。

  > 使用 `Symbol` 值當屬性名稱，也能避免物件之間的屬性重複、以致你替它加入其他物件的屬性時，將資料覆蓋掉。

### 4-5-4 使用 Set 存放資料
  `Set` 物件的效能不僅更佳，而且它最有用處的地方在於，他只會存放不重複的值。

  ```js
  class Product {
    constructor(name, price) {
      this.id = Symbol();
      this.name = name;
      this.price = price;
    }
  };

  let product = new Product("Hat", 100);
  let productArray = [];
  let productSet = new Set();

  for (let i = 0; i < 5; i++) {
    productArray.push(product);     // 在陣列加入 product
    productSet.add(product);        // 在 `Set` 加入 product
  }

  console.log(`Array length: ${productArray.length}`);
  console.log(`Set size: ${productSet.size}`);
  ```

  究竟該選擇一班陣列還是 `Set` 物件來存取資料，取決於是否禁止出現重複值。

  - ### `Set` 物件的常用方法
    |方法|說明|
    |---|---|
    |`add(value)`|將指定的值加入 `Set` 物件。|
    |`has(key)`|傳回一個布林值，代表 `Set` 是否包含指定的鍵。|
    |`delete(value)`|在 `Set` 物件刪除指定的值。|
    |`keys()`|傳回一個走訪器物件，其內包含 `Set` 物件中的所有項目，且依插入順序排列。|
    |`values()`|功能同 `keys()` (`Set` 的鍵與值相同)|
    |`has(value)`|檢查  `Set`  物件中是否存在指定的值，若有則傳回 true。｜
    |`forEach(callback)`|將 `Set` 中的每個值傳入回呼函式執行。|

## 4-6 撰寫與匯入 JavaScript 模組
  大多數應用程式的複雜度較高，故開發者不會將程式碼全部集中寫在單獨一個檔案內。`JavaScript` 支援 `模組 (module)` 功能，可將應用程式切割成多個更容易管理的區塊。

  模組的定義與匯入方式，目前主要分為 `CommonJS` 與 `ECMAScript Modules` (或稱 `ES6 Modules`) 兩大類。`CommonJS` 是最早期的產物，也是 `Node.js` 一開始的支援方向。不過 `ECMAScript Modules` 的支援已經日益普及，如今也獲得 `Node.js` 的支援，

  > 需要 `Node.js` v13 或更新的版本，才能直接使用 `ECMAScript Modules`。

### 4-6-1 建立一個 JavaScript 模組
  - #### 建立專案，並初始化
    ```sh
    cd \primer_modules
    npm init --yes
    ```

  - #### 調整 package.json
    ```json
    {
      "name": "primer_modules",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specifies\" && exit 1"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "type": "module"
    }
    ```

  - #### 新增一個獨立的 JavaScript
    ```js
    // tax.js

    export default function (price) {     // 函式沒有名稱
      return Number(price) * 1.2;
    }
    ```
    - `export` 關鍵字代表函式是要 `匯出` 給外部檔案引用的內容。
    - `default` 關鍵字則只能用在模組中的一個函式，作為匯入時的預設功能。

### 4-6-2 使用 JavaScript 模組
  ```js
  // 從 tax.js 匯入預設函式，取名為 calcTax
  import { calculateTax } from "./tax.js";

  class Product {
    constructor(name, price) {
      this.id = Symbol();
      this.name = name;
      this.price = price;
    }
  };

  let product = new Product("Hat", 100);
  let taxedPrice = calculateTax(product.price);       // 呼叫匯入的函式
  console.log(`Name: ${product.name}, Taxed Price: ${taxedPrice}`);
  ```

  在 `JavaScript` 中，使用模組的另一個必要關鍵字是 `import`，用來宣告程式檔對於模組的相依性。

  - #### 到指定的路徑位置載入 tax.js
    ```ts
    import calcTax from "./tax.js";
    ```

  - #### 可使用 clacTax 來呼叫匯入的函式，就像在自身檔案中定義的任何函式一樣
    ```ts
    let taxedPrice = calaTax(product.price);
    ```

### 4-6-3 從模組匯出有名稱的功能
  可以為模組中匯出的函式取一個辨識名稱，這個方式稱為 `具名匯出 (named export)`。
  ```js
  export function calculateTax(price) {
    return Number(price) * 1.2;
  }
  ```

  相對的，得在 `index.js` 使用這個新名稱來匯入：
  ```js
  import { calculateTax } from "./tax.js";

  class Product {
    constructor(name, price) {
      this.id = Symbol();
      this.name = name;
      this.price = price;
    }
  };

  let product = new Product("Hat", 100);
  let taxedPrice = calculateTax(product.price);
  console.log(`Name: ${product.name}, Taxed Price: ${taxedPrice}`);
  ```

  要匯入的函式名稱寫在 `{}` 大括號裡，接著便可在程式碼中以這個名稱來呼叫之。

  一個模組也能同時做 `預設匯出` 與 `命中匯出`
  ```js
  export function calculateTax(price) {
    return Number(price) * 1.2;
  }

  export default function (...prices) {
    return prices.reduce((total, p) => total += calculateTax(p), 0);
  }
  ```

### 4-6-4 宣告多個具名匯出
  模組亦可將多個函式或值以具名方式匯出。
  ```js
  // utils.js
  import { calculateTax } from "./tax.js";

  export function printDetails(product) {
    let taxedPrice = calculateTax(product.price);
    console.log(`Name: ${product.name}, Taxed Price: ${taxedPrice}`);
  }

  export function applyDiscount(product, discount = 5) {
    product.price = product.price - 5;
  }
  ```

  ```js
  // index3.js
  import calcTaxAndSum, { calculateTax } from "./tax.js";
  import { printDetails, applyDiscount } from "./utils.js";

  class Product {
    constructor(name, price) {
      this.id = Symbol();
      this.name = name;
      this.price = price;
    }
  };

  let product = new Product("Hat", 100);
  applyDiscount(product, 10);

  let taxedPrice = calculateTax(product.price);
  printDetails(product);

  let products = [new Product("Gloves", 23), new Product("Boots", 100)];
  let totalPrice = calcTaxAndSum(...products.map(p => p.price));
  console.log(`Total Price: ${totalPrice.toFixed(2)}`);
  ```

## 4-7 本章總結
  本章介紹了 `JavaScript` 的物件、類別、走訪器和產生器、集合，以及如何使用 `JavaScript` 模組。