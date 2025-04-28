---
title: IT邦 - 讓 TypeScript 成為你全端開發的 ACE !
---

# 9 物件導向進階篇章
## 9.1 物件導向進階概論
### 9.1.1「介面為主，實踐為輔」的設計思維
  > 內含變數、函式以及多種不同資料結構 `封裝 (Encapsulate)` 成的一種可被操作的介面 - 就是 `物件`。

  > - 為何要以 `物件導向中的物件 (Object)` 的設計為主？
  > - 憑什麼要用類別建構物件，而不直接用 JavaScript JSON 物件就夠了？
  > - JSON 可以封裝變數 (也就是 JSON 屬性) 以及方法，也比整個類別的語法簡單許多，何苦繞遠路還要學一個看起來很冗贅的 Class 語法？

  思考一個情境，假設想要將一坨資料進行檢視內容的動作，該資料可能是 `陣列`，也有可能是 `集合(Set)`，你可能想說可以宣告簡單的 `inspect<T>` 函式，傳入陣列，並且簡單使用 `For迴圈` 迭代印出結果：
  ```ts
  function inspect<T>(collection: Array<T>) {
    for (let i = 0; i < collection.length; i += 1) {
      console.log(collection[i]);
    }
  }

  inspect<number>([1, 2, 3, 4, 5]);
  // => 1
  // => 2
  // => 3
  // => 4
  // => 5
  ```

  這個實現功能的過程，就是時常聽到的 `實踐 (Implementation)` 的概念。

  然而，這個 `inspect<T>` 函式非常之脆弱，假設今天有另一個資料結構是 `鏈結串列 (Linked List)`：
  ```ts
  /* 鏈結串列會不停指涉下一個串列節點 (List Node)，若無下一個值，就會指向 null */
  type ListNode<T> = {
    value: T;
    next: ListNode<T> | null;
  }

  /**
   * 以下的鏈結串列可以圖解成：(1) -> (2) -> (3) -> (null)
   * 每一個值代表鏈結串列中的一個節點，若串列下一個地方沒元素時，就指向 null
   */
  let list: ListNode<number> = {
    value: 1,
    next: {
      value: 2,
      next: {
        value: 3,
        next: null
      }
    }
  }
  ```

  這時，要如何讓 `inspect<T>` 同時支援陣列或以上的鏈結串列的迭代檢視過程？

  你可能想說可以用個簡單的判斷式，根據傳入的不同的資料型態進行處理：
  ```ts
  function inspect<T>(collection: Array<T> | LinkedList<T>) {
    /* 使用型別駐防的方式檢測陣列型別 */
    if(Array.isArray(collection)) {
      for (let i = 0; i < collection.length; i += 1) {
        console.log(collection[i]);
      }
    } else {
      let node = collection;

      // 先印出第一個節點的值
      console.log(node.value);

      // 檢測有沒有下一個節點，若無則跳出
      wile (node.next !== null) {
        node = node.next;
        console.log(node.value);
      }
    }
  }

  inspect<number>(list);
  // => 1
  // => 2
  // => 3
  ```

  以上程式碼的實踐方式，實在是很糟糕，為了延伸出一個功能，讓函式的宣告多出了約莫十行的程式碼，每次要支援不同資料型態的輸入只會是一場惡夢。

  如果要是有一個 `統一的操作介面 (Interface) Collection`，該介面規定任何物件都必須有 `inspect` 方法時，此時就可以改寫成以下形式：
  ```ts
  /* 以下展示 Psudo Code 範例，意思為偽程式碼 */
  let collection1: Collection = new TypedArray<number>([1, 2, 3, 4, 5]);
  collection1.inspect();
  // => 1
  // => 2
  // => 3
  // => 4
  // => 5

  let collection2: Collection = new LinkedList<number>(list);
  collection2.inspect();
  // => 1
  // => 2
  // => 3
  ```

  若規範 `類別的宣告` 必須符合 `Collection` 的設計，就可以不用管資料結構的細節，只管可以如何規範介面的行為，以及使用介面提供的功能就好了。

  因此，物件導向的核心概念是：
  >「專注於系統的介面設計，而非專注於實踐過程」。

  物件導向設計提倡專注於，可以被操作的介面行為的設計，因此「實踐過程」被取代為「操作、組合類別規範出的行為」；這樣一來，功能可能被 `重複利用`外，`改動率可以盡量變小`，要是需要延伸出功能，就是在類別的宣告實作上，定義更多物件可以被操作的行為而已。

### 9.1.2 抽象化的概念 Abstraction
  事實上，整個物件導向設計的概念，都在對整個實踐過程進行抽象化的動作，只是將其抽象化成 - 專注於介面設計 - 的概念。

  建構符合 `Collection` 介面的實體 (Instance) 時，使用 `inspect` 方法不會特別關注到底是陣列還是鏈結串列，只管凡事符合 `Collection` 介面的東西，可以使用名為 `inspect` 的方法。

  只要記得把不同的資料型態轉換成 (或者抽象化成) 統一的介面來操作就夠了。

### 9.1.3 內聚與耦合 Cohesion & Coupling
  「內聚」與「耦合」這兩個詞彙，互為相對關係。

  「內聚性高」的程式碼，代表「耦合程度低」。

  `內聚` 描述的是，將程式碼裡 `各種功能、函式等東西打包成的一個模組`狀態，而這個模組可以為任意形式的東西。

  `inspect<T>` 的實作方式，就是一種內聚的表現：
  ```ts
  function inspect<T>(collection: Array<T> | LinkedList<T>) {
    if (Array.isArray(collection)) {
      // 實踐過程略...
    } else {
      // 實踐過程略...
    }
  }
  ```
  它負責將檢視陣列或鏈結串列內容的過程實踐進同一個函式裡。

  內聚的形式方法有很多種，以上範例程式碼屬於 `邏輯性內聚 (Logical Cohesion)`，因為用的是判斷敘述式的手法，針對不同的資料型態有不同的行為，這也是最常見、但 `最容易產生不好的程式碼` 的寫法；

  有沒有好的 `內聚` 寫法案例？
  
  有的，最常見的是 `順序性內聚 (Sequential Cohesion)` 的寫法。

  順序性內聚要理解非常簡單，譬如說描述一道料理製作過程的食譜，即順序性內聚的典型案例，它會告訴你步驟與過程，但是每個步驟或過程都會是互相獨立的。
  ```ts
  function cake(flavor: 'Chocolate' | 'Vanilla' | 'Strawberry') {
    let milk = new Milk(2);           // 兩公升的牛奶
    let butter = milk.whip();         // 製作奶油 (其實應該是要製作麵團才對)
    butter.mix(flavor);               // 摻入風味

    let bakingPan = new Pan(butter);  // 將奶油倒入烤盤

    let oven = new Oven(bakingPan);                     // 將烤盤放入烤箱
    oven.cook({ temperature: 100, duration: 30 * 60 }); // 烤箱溫度與時長

    // 從烤箱取出蛋糕
    return oven.result;
  }
  ```
  `描述步驟的過程屬於順序性內聚的寫法`，而此寫法被歸類為好的內聚形式。

  相對於內聚的概念，就是「耦合」- `衡量模組與模組之間的相依程度 (Dependency)`，譬如兩個模組共同使用一個 `全域變數 (Global Variable)`、函式、物件、類別等東西，這些東西就是該模組相依的東西。

  以剛剛的 `cake` 函式來說，由於它有使用到很多類別，諸如 `Milk`、`Pan`、`Oven` 類別，就可以說 `cake` 函式 `直接相依`(或`直接耦合`)於這三個類別；若是其他食譜，比如說製作冰淇淋 `icecream` 的函式剛好也需要 `Milk` 類別，我們可以說 `icecream` 也相依 `Milk` 類別。

  程式碼的相依程度越高，會造成開發上會越來越複雜。

  因此 `不建議直接耦合的行為`，但是模組與模組間的溝通，勢必還是要進行耦合或者相依的行為，這時，會建議改採 `抽象耦合` 的模式；用 `TypeScript` 來說，與其直接相依物件的類別 (Class)，不如 `相依於介面 (Interface)`。

  ```ts
  interface DairyProduct {
    // DiaryProduct 奶製品介面的規格
  }

  class Milk implements DairyProduct {
    // Milk 實踐 DairyProduct 的規格
  }

  class GoatMilk implements DairyProduct {
    // GoatMilk 實踐 DairyProduct 的規格
  }

  // 烤蛋糕可以選擇口味外，還可以選擇採用的奶製品原料
  function cake(flavor: /* flavor 的型別 */, dairyType: DairyProduct) {
    // 略 ...
  }

  // 冰淇淋可以選擇口味外，還可以選擇採用的奶製品原料
  function icecream(flavor: /* flavor 的型別 */, dairyType: DairyProduct) {
    // 略 ...
  }

  // 製作巧克力風味的蛋糕，原物料為牛奶
  cake('Chocolate', new Milk(/* Milk 類別的建構子函式參數 */));

  // 製作香草風味的冰淇淋，原物料為羊奶
  cake('Vanilla', new GoatMilk(/* GoatMilk 類別的建構子函式參數 */));
  ```

  `好的內聚通常是將程式中不相關的東西整合在一起`。

  `相似性質的程式，採取抽象耦合的策略`。

## 9.2 物件導向設計原則 SOLID Principles
  從物件導向的概念延伸出最基礎的五大原則；以下條列的五大原則英文開頭分別就是 `S`、`O`、`L`、`I`、`D` 這五個字母，故又稱為 `SOLID 原則`。

### 9.2.1 單一職責原則 Single-Responsibility Principle
  原文的定義是：
  > "A class should have only one reason to change."

  「`單一職責原則`」- 主要建議任何類別 (或函式、方法、資料等) 只要能夠簡單地完成一項事情就可以了。

  類別 (或函式、方法、資料等) 本身要 `負擔的責任太大` 時，可能會考慮將該是情切分成更細的細節處理；

  例如一個在描述動物的類別 `Animal`，它可能是鳥類所以會飛，可能是魚類會游泳等：
  ```ts
  class Animal {
    public canFly:  boolean;
    public canSwim: boolean;

    public fly(): void { /* 飛！ */ }
    public swim(): void { /* 游泳！ */ }

    // 其他成員變數或成員方法的宣告
  }
  ```
  不過這個類別負擔的責任太大，因此可能會將 `Animal` 設計成 `介面(Interface)`，並且分別實踐出 `Bird` 或者是 `Fish` 類別。
  ```ts
  interface Animal {
    /* 動物介面的基礎規格略 ... */
    fly(): void;
    swim(): void;
  }

  /* 各種類型的動物去實踐 Animal 介面 */
  class Bird implements Animal { /* 鳥類的類別實踐 */ }
  class Fish implements Animal { /* 魚類的類別實踐 */ }
  ```
  實踐過程還是得根據規格或需求而定。

  單一職責原則更精確來說，是在 `建議一段程式盡量增強內聚力，不相關的東西，應該要拆到其他的介面或類別實踐`，並且用 `抽象耦合` 的方式處理。

  也就是說，也許動物類別 `Animal` 介面的設計，會飛或者是會游泳都是在描述動物可以做的行為，乾脆將其再拆成 `Flyable` 介面 (代表可以飛) 或者是 `Swimmable` 介面 (代表可以游泳)，並且將鳥類同時實踐 `Animal` 與 `Flyable` 介面，依此類推。
  ```ts
  interface Animal {
    /* 動物介面的基礎規格 略... */
  }

  interface Flyable {
    /* Flyable 其他基礎規格 略... */
    fly(): void;
  }

  interface Swimmable {
    /* Swimmable 其他基礎規格 略... */
    swim(): void;
  }

  /* 各種類型被動物去實踐 Animal 介面，有需要再去額外實踐其他功能 */
  class Bird implements Animal, Flyable { /* 鳥類的類別實踐 */ }
  class Fish implements Animal, Swimmable { /* 魚類的類別實踐 */ }
  ```

### 9.2.2 開放封閉原則 Open-Closed Principle
  定義是：
  > "Software entities (class, modules, function, etc.) should be `open for extension`. but `closed for modification`."
  
  「`開放封閉原則`」- 一段程式碼的模組 (可能是類別、方法等) 對於 `擴充(Extension) 的行為是開放` 的；對於 `修改(Modification) 的行為是封閉的`。

  在前面 9.1.3 討論的 `cake` 函式中，如果奶製品種類還有其他種，可以宣告奶製品介面 `DairyProduct` 的方式，所有奶製品 (包含 `Milk` 與 `GoatMilk`) 必須實踐此介面，並且用抽象耦合的方式實踐 `cake` 函式。

  一但新增了新的奶製品，實踐 `DairyProduct` 介面就可以多出新的奶製品，而 `cake` 函式不需要更動。

  結合 `抽象化` 的技巧，`避免程式碼的實作被寫死，才相對可以有擴充的空間`。

### 9.2.3 里氏替換原則 Liskov Substitution Principle
  此原則算是描述 `類別繼承`，或者是 `介面實踐`，必須遵守的原則。

  原文定義：
  > "Subtypes must be substitutable for their base types."

  「`里氏替換原則`」- 凡是父類別的物件，子類別可以替換掉它，但仍然可以操作父類別規範的行為，而不影響整體程式的執行。

  ```ts
  interface Geometry {
    area(): number;           // 計算幾何圖形的面積
    circumference(): number;  // 計算幾何圖形的周長
  }

  class Circle implements Geometry {
    // radius 為圓形的半徑
    constructor(public radius: number) {}

    // 實踐 Geometry 的規格
    area() {
      return Math.PI * (this.radius ** 2);
    }

    circumference() {
      return 2 * Math.PI * this.radius;
    }
  }

  class Rectangle implements Geometry {
    // width, height 為長方形的長與寬
    constructor(public width: number, public height: number) {}

    // 實踐 Geometry 的規格
    area() {
      return this.width * this.height;
    }

    circumference() {
      return (this.width + this.height) * 2;
    }
  }
  ```

  `Geometry` 介面，為里氏替換原則的 `Base Type`；類別 `Circle` 與 `Rectangle` 由於實踐 `Geometry` 介面，因此它們的角色為 `Subtypes`。

  里氏原則告訴我們必須遵守 `Base Type` 的物件，可以被替換成 `Subtypes`：
  ```ts
  let someShape1: Geometry = new Circle(3);
  let someShape2: Geometry = new Rectangle(4, 5);
  ```
  上面的 `someShape` 系列的變數，儘管指向的事 `Geometry` 介面描述的物件型別，但是它可以指向或者被取代為 `Subtypes` 建構的物件，即類別 `Circle` 與 `Rectangle` 建構出的實體 (Instance)。

  然後，里氏替換原則強調：`Base Type` 被替換成 `Subtypes` 時，可以使用 `Base Type` 所規範的操作行為。
  ```ts
  // 假設不知道 someShape1 是什麼樣的值，但一定知道它可以呼叫 Geometry 介面所規範的行為
  someShape1.area();
  someShape1.circumference();

  // 同理，someShape2 也一定可以呼叫 Geometry 介面所規範的行為
  someShape2.area();
  someShape2.circumference();
  ```

### 9.2.4 介面隔離原則 Interface Segregation Principle
  原文定義：
  > "No client should be forced to depend on methods it does not use."

  「`介面隔離原則 ISP`」主要的目的是，避免過度地將不必要的規格塞在單一個介面，像 9.2.1 講過的動物的介面設計 `Animal`：
  ```ts
  interface Animal {
    /* 動物介面的基礎規格 略... */
    fly(): void;
    swim(): void;
  }

  /* 各種類型的動物去實踐 Animal 介面 */
  class Bird implements Animal { /* 鳥類的類別實踐 */ }
  class Fish implements Animal { /* 魚類的類別實踐 */ }
  ```
  並不是所有的動物要會飛或者是要會游泳，因此才再被拆成 `Flyable` 或 `Swimmable` 介面；

  本原則強調，`抽象過程 的精確性` - 基本上就是設計介面的過程中，`判斷規格有沒有存在該特定介面的必要性，若無必要時，就隔離出新的介面`。

  而這些被隔離出的特定介面，被稱為 `角色介面 (Role Interface)`。

### 9.2.5 依賴倒轉原則 Dependency Inversion Principle
  原文定義：
  > "High-level modules should not depend on low-level modules. Both should `depend on abstractions.`"

  > "Abstractions should not depend on details. Details should `depend on abstractions.`"

  模組的實踐過程中，必須仰賴抽象介面；而實踐細節，也是仰賴抽象介面。

  - `開閉原則` 強調避免寫死的原因，是為了 `方便擴充程式碼`；
  - `依賴倒轉原則` 強調 `如何實現「 不要寫死程式碼 」`的過程與解法；

  "High-level modules should not depend on low-level modules. Both should `depend on abstractions.`"
  可以用 9.1.3 舉的 `cake` 函式作為簡單的範例，其中 `cake` 最初的寫法就是直接依賴於 牛奶`Milk` 類別：
  ```ts
  function cake(flavor: /* 口味的型別 */) {
    let milk = new Milk(2); // 食譜中，奶製品被寫死 Milk 類別
    // 略 ...
  }
  ```
  - `High-level modules` 只的角色是 `cake` 函式。
  - `Low-level modules` 則是 `Mike` 類別。
  - 依賴倒轉原則，不鼓勵上下模組 (也就是類別、函式等) 直接相依 (或耦合) 的情形。

  想要避免直接耦合的現象，於是就宣告 `DairyProduct` 奶製品介面，並且讓 `Milk` 與 `GoatMilk` 類別實踐，`cake` 函式就可以藉由奶製品介面進行抽象耦合。
  ```ts
  interface DairyProduct {
    // DiaryProduct 奶製品介面的規格
  }

  class Milk implements DairyProduct {
    // Milk 實踐 DairyProduct 的規格
  }

  class GoatMilk implements DairyProduct {
    // GoatMilk 實踐 DairyProduct 的規格
  }

  // 烤蛋糕可以選擇口味外，還可以選擇採用的奶製品原料
  function cake(flavor: /* flavor 的型別 */, dairyType: DairyProduct) {
    // 略 ...
  }
  ```

  過程會變成不管是 `High-level` 或 `Low-level` 模組，想要建立關聯 (也就是進行耦合時)，`必須要同時改成 依賴於抽象的介面`。

  - 這樣一來，想要使用奶製品相關的模組 (此為 `High-level` 的模組)，可以直接依賴 `DairyProduct` 介面；
  - 相對的，想要擴充奶製品的種類 (也就是 `Low-level` 的模組)，只要按照 `DairyProduct` 介面的規格實踐就好了。

  "Abstractions should not depend on details. Details should depend on abstractions."
  就是規格的制定，不可能會根據實踐的結果而定；而 `實踐的結果必須根據規格而定`。

### 9.2.6 統整 SOLID 原則
  - #### 關鍵重點
    - 1. 程式碼模組 (Module) 必須具備高聚合性 (High Cohesion)。
    - 2. 模組必須有相依時建議進行抽象耦合 (Abstract Coupling)。
    - 3. 忌諱修改程式碼。

  - #### SOLID 原則
    - `S`RP：即 `單一職責原則`，代表模組盡量傾向於  `高聚合性的設計`。(不要一次承攬太多無關緊要的責任，這樣反而會降低聚合性)。
    - `O`CP：即 `開放封閉原則`，代表模組藉由 `抽象耦合` 的方式進行 `程式碼的擴充`，`以防止程式碼內部的修改`。
    - `L`SP：即 `里氏替換原則`，代表某介面 (或某父類別) 的東西，可以被實踐該介面 (或者繼承父類別的子類別) 的物件給替換；畢竟達成抽象耦合的條件就是實踐介面 (或類別的繼承) 時，不能有任何例外狀況出現。
    - `I`SP：即 `介面隔離原則`，強調 `介面職責分配的精確性`；跟 `SRP` 差異在於，`ISP`強調 `非必要的職責可以再獨立隔離成其他角色介面 (Role Interface)`。(然而，
    `角色介面不能獨立實踐`，必須配合主要介面一併使用)。
    - `D`IP：即 `依賴倒轉原則`，解釋了 `抽象耦合的方法`，也就是任何模組互相依賴時，必須依靠中間的抽象介面進行耦合；而任何實踐出來的東西必須遵照抽象的規格。

  - `SRP` 與 `ISP` 差異在於，前者提倡模組應具備高聚合性；後者則是聚合過程中，非必要的聚合，再特地隔離出新的介面。
  - `LSP` 、 `DIP` 與 `OCP` 都有講到抽象耦合的機制，然而 `LSP` 講的是達成抽象耦合的基本要件；`DIP` 則是抽象耦合的實踐方式；最後，`OCP` 則是提倡開發過程中，鼓勵用抽象耦合的方式 - 擴充程式碼、防止修改程式碼。

## 9.3 物件導向延伸應用
### 9.3.1 耦合與解耦 Coupling & Decoupling
  > 『 `解耦` 』泛指解構程式模組中的 `直接耦合` 的現象。

  『 `直接耦合` 』最簡單也最直觀的案例，`類別的繼承 (Class Inheritance)`
  ```ts
  class Parent {/* 父類別的實踐過程 */}
  class Child extends Parent {/* 子類別的實踐過程 */}
  ``` 

  - 父類別所規劃出來的方法，子類別也必須跟進實踐；因此父類別一但新增了成員，子類別可能也會連帶連動到內部的設計。
  - 子類別由於繼承自父類別，而類別一次只能繼承自一個父類別，因此子類別的規格也就會跟父類別綁得死死的；

### 9.3.2 物件的委任 Object Delegation
  常見的解耦方式就是所謂的 `物件的委任 (Object Delegation)`。
  ```ts
  /* 角色 */
  class Character {
    constructor(
      public name: string,
    ){}

    public attack(enemy: Character) {
      console.log(`${this.name} is attacking ${enemy.name}.`);
    }
  }

  /* 戰士 */
  class Warrior extends Character {
    constructor(name: string){
      super(name);
    }

    public attack(enemy: Character) {
      console.log(`${this.name} pierces through ${enemy.name} using a sword.`);
    }
  }

  /* 巫師 */
  class Wizard extends Character {
    constructor(name: string){
      super(name);
    }

    public attack(enemy: Character) {
      console.log(`${this.name} freezes ${enemy.name} using a spell.`);
    }
  }
  ```
  由於類別繼承的特性，父類別一但有新的成員增加時，子類別也不得不做出一些變化。

  因此，為了解耦，此時就有一種稱做為 `物件委任 (Object Delegation)` 技巧
  > 將 `要被解耦的目標模組` (在這裡是指子類別) 替換成 `主模組` (父類別) `的成員變數指涉目標`；主模組的任何行為皆由被指涉的目標主導，也就是說，`將主模組的行為委任給被指涉的模組執行`。

  將原本 `Character` 類別的設計改成以下模式：
  ```ts
  interface CharacterInfo {
    healthPoint: number;
    strength: number;
    intelligence: number;

    attack(character: Character, enemy: Character): void;
  }

  class Character {
    constructor(
      public name: string,
      public character: CharacterInfo // 指涉目標為 CharacterInfo 介面
    ) {}

    public attack(enemy: Character) {
      this.character.attack(this, enemy);
    }
  }
  ```

  本範例額外宣告了新的介面 `CharacterInfo` 代表的是 `Warrior` 與 `Wizard` 的基礎規格 (生命值、力量等能力值)，將 `Character` 原本直接耦合的類別 (也就是要解耦的目標類別 `Warrior` 與 `Wizard`)，改成使用成員變數方式與 `CharacterInfo` 介面進行抽象耦合。

  原本 `Character` 可以做的行為是呼叫 `attack` 方法進行攻擊；這次的改寫則是委任被指涉的抽象目標 (也就是 `CharacterInfo`) 進行攻擊。

  你會發現 `Character` 不再管細節層面的資料，例如生命值(Health Point) 以及力量(Strength) 等能力值，它只會專注描述一個角色可以做的事情 (例如：攻擊敵人)，符合 `單一職責原則`。(`Character` 的責任減輕了)。

  只要按照里氏替換原則，根據 `CharacterInfo` 介面設計出 `Warrior` 與 `Wizard` 這兩個類別，就可以將這兩個類別與 `Character` 進行抽象耦合：
  ```ts
  class Warrior implements CharacterInfo {
    public intelligence: number = 0;

    constructor(
      public healthPoint: number,
      public strength: number
    ){}

    public attack(character: Character, enemy: Character) {
      console.log(
        `${character.name} pierces through ${enemy.name} using a sword.`
      );

      /* 戰士攻擊時，會對對方造成一定程度的物理性傷害 */
      enemy.character.healthPoint -= this.strength;
    }
  }

  class Wizard implements CharacterInfo {
    public strength: number = 0;

    constructor(
      public healthPoint: number,
      public strength: number
    )

    public attack(character: Character, enemy: Character) {
      console.log(
        `${character.name} freezes ${enemy.name} using a spell.`
      );

      /* 法師攻擊時，會對對方造成一定程度的魔法性傷害 */
      enemy.character.healthPoint -= this.intelligence;
    }
  }
  ```

  我們專注 `Warrior` 程式碼中的建構子函式前後改寫的差異：
  ```ts
  /* 改寫前... */
  class Warrior extends Character {
    constructor(name: string, healthPoint: number, strength: number) {
      super(name, healthPoint, strength, 0);
    }

    // 其他成員略...
  }

  /* 改寫後... */
  class Warrior implements CharacterInfo {
    public intelligence: number = 0;

    constructor(
      public healthPoint: number,
      public strength: number
    ) {}

    // 其他成員略...
  }
  ```
  你會發現，原本 `Warrior` 與它的父類別 `Character` 是很親密的關係 (因為必須使用 `super` 關鍵字初始化父類別的成員變數值)；經過 `物件委任` 的結果，`Warrior` 與 `Character` 正式脫離了直接耦合的繼承關係，取而代之的是 `Warrior` 專注於描述戰士的能力性質與攻擊的手法，剩下就是根據 `CharacterInfo` 介面與父類別 `Character` 進行抽象耦合。

### 9.3.3 依賴的注入 Dependency Injection
  物件的委任又跟另一個技巧很像 - `依賴的注入 (Dependency Injection)`，物件的委任實質上就是依賴的注入，只是解釋的看法角度不同而已。

  譬如，資料庫的設計會有代表 `資料庫連線 (Database Connection)` 的物件，任何要跟資料庫溝通的行為都必須依靠此物件：
  ```ts
  class Database {
    // 資料庫的連線物件
    public connection = new SQLDatabase();

    // 執行資料庫的指令並回傳結果
    public execute(query: string) {
      return this.connection.execute(query);
    }

    // 關掉與資料庫的連線
    public close() {
      this.connection.close();
    }

    // 其他成員方法...
  }
  ```
  你會發現，它跟物件的委任很像的點在於，`Database` 類別若要執行一些方法 (諸如 `execute` 或 `close` 方法)，都會委任 `connection` 成員所指涉的物件來執行。

  然而，這裡並非為物件委任的寫法，原因是 `connection` 指涉的是一個 `實體 (Instance)`，因此造成直接耦合的情形；因此如果想要改成 `Database` 可以用各種不同版本的資料庫連線方式，必須改成：
  ```ts
  interface DatabaseConnection {
    close(): void;
    execute(query: string): /* execute 方法的回傳型別 ... */

    /* DatabaseConnection 的其他規格 ... */
  }

  class Database {
    // 資料庫的連線物件，可以為各種不同的東西，只要符合所謂 DatabaseConnection 這個介面
    constructor(public connection: DatabaseConnection) {}

    // 成員方法略...
  }
  ```
  這樣 `Database` 就可以擁有不只一種資料庫連接的版本：
  ```ts
  let db1 = new Database(new SQLDatabase());
  let db2 = new Database(new MySQLDatabase());
  let db3 = new Database(new PostgreSQLDatabase());
  // ... 更多不同版本的資料庫實體 ...
  ```

  這種寫法就好像是將相依的模組 (`SQLDatabase`、`MySQLDatabase`、`PostgreSQLDatabase`) 從外面 `注入 (Inject)` 到 `Database` 類別裡，單單這樣的技巧就得到一個正式名稱 - `依賴的注入`。

  依賴注入的解耦手法僅僅是把直接依賴 (或 直接耦合) 的部分，藉函式傳參數的方式注入到主要的模組裡，`只是注入的物件必須遵從同一個介面的設計`；

  `依賴倒轉 (Dependency Inversion)` 以及 `依賴注入 (Dependency Injection)` 並不全等，甚至代表性質與意義差很多。
  > `依賴倒轉 (Dependency Inversion)` 是一個 `原則 (Principle)`，描述的是 `模組解耦的方法`。 (將 High-Level 與 Low-Level 的模組共同依賴於一個抽象介面)

  > `依賴注入 (Dependency Injection)` 則是將 `外來的模組注入到主要的模組裡`，最常見的手法就是用參數傳遞方式注入，避免模組直接耦合的情形。

  因此，依賴倒轉跟依賴注入的關係是：
  > `依賴倒轉` 原則描述的解耦手法中 - 其中一種就是 `依賴的注入`。