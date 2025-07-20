---
title: IT邦 - 讓 TypeScript 成為你全端開發的 ACE !
---

# 8 TypeScript 模組系統
## 8.1 ES6 Import / Export 模組語法
### 8.1.1 型別宣告與實踐過程的分離
  `TypeScript` 比起原生 `JavaScript` 多出了型別系統，因此編寫程式的過程中，型別宣告的部分與主程式塞在同個檔案，難免覺得有些複雜：
  ```ts
  type Shape = Circle | Rectangle |Triangle;

  type Circle = {
    type: 'Circle';
    radius: number;
  };

  type Rectangle = {
    type: 'Rectangle';
    // 略 ...
  };

  type Triangle = {
    type: 'Triangle';
    // 略 ...
  }

  function areaOfShape(info: Shape): number { /* 實踐過程略... */ }
  ```

  `ECMAScript` 在第六版提供了基礎的 `Import` 與 `Export` 相關的語法，使得程式碼可以拆分成多個 `JavaScript` 檔案。
  同理，`TypeScript` 的型別化名與介面也是可以被引入與輸出。

  將上面的程式碼拆成 型別宣告部分(`./Shape.ts`) 與 實踐部分 (`./index.ts`)
  ```ts
  // 檔案位置 ./Shape.ts
  /* 使用 export 關鍵字將型別輸出 */
  export type Shape = Circle | Rectangle | Triangle;

  export type Circle = {
    type: 'Circle';
    radius: number;
  };

  export type Rectangle = {
    type: 'Circle';
    radius: number;
  };

  export type Rectangle = {
    type: 'Rectangle';
    // 略 ...
  };

  export type Triangle = {
    type: 'Triangle';
    // 略 ...
  }
  ```
  ```ts
  // 檔案位置 ./index.ts
  /* 使用 import 關鍵字將型別輸入，記得要參照正確的檔案位置喔！ */
  import { Shape } from './Shape';

  function areaOfShape(info: Shape): number { /* 實踐過程略... */ }
  ```

### 8.1.2 預設輸出 Default Export
  另一種常見的輸出方式是 `預設輸出`，宣告方式為 `export default` 兩個關鍵字的組合。
  ```ts
  // 檔案位置： ./Shape.ts
  /* 預設輸出型別為 Shape */
  type Shape = Circle | Rectangle | Triangle;
  export default Shape; // 請注意：不能使用 export default type 的宣告方式

  /* 非預設的輸出型別 Circle */
  export type Circle = { /* 略 ... */ };

  // 略 ...
  ```

  不能宣告型別的同時設置預設輸出，因此如果出現以下的寫法就會出現錯誤訊息。
  ```ts
  export default type Shape = Circle | Rectangle | Triangle;
  ```

  接下來，引入預設輸出的型別時，就不需要用大括弧進行引入的動作：
  ```ts
  // 檔案位置： ./index.ts
  /* 引入預設輸出的型別時，不需要大括弧 */
  import Shape from './Shape';

  function areaOfShape(info: Shape): number { /* 實踐過程略 ... */ };
  ```

  如果想要同時引入預設輸出的型別，以及需要用到的普通輸出模式的型別時：
  ```ts
  // 檔案位置： ./index.ts
  /* 同時引入預設輸出與普通模式輸出下的東西 */
  import Dimension, { Circle, Rectangle, Triangle } from './Shape';

  function areaOfShape(info: Dimension): number { /* 實踐過程略 ... */ };
  ```

  預設輸出模式的型別也可以用大括弧包住，只是名稱就得用 `default` 代表，並且強制使用關鍵字 `as` 進行更名：
  ```ts
  // 檔案位置： ./index.ts
  /* 在大括弧內引入預設輸出的東西時，只能用 default 這個名稱指涉 */
  import { default as Dimension, Circle, Rectangle, Triangle } from './Shape';

  function areaOfShape(info: Dimension): number { /* 實踐過程略 ... */ };
  ```

### 8.1.3 引入所有模組的輸出 Import All
  如果檔案引入的是模組所有輸出的東西時，可以用更簡潔的語法方式引入：
  ```ts
  // 檔案位置：./index.ts
  /* 引入模組輸出的所有東西，並且將整個東西命名為 shapes */
  import * as shapes from './Shape';
  ```

  如果想要使用普通模式輸出下的型別，可以這樣註記：
  ```ts
  // 檔案位置：./index.ts
  import * as shapes from './Shape';

  // 使用 shapes.[輸出的型別名稱] 指涉
  let circle: shapes.Circle = {
    type: 'Circle',
    radius: 3
  };
  ```

  另外，預設輸出的型別可以用 `default` 這個屬性來指涉：
  ```ts
  // 檔案位置：./index.ts
  import * as shapes from './Shape';

  let circle: shapes.Circle = { /* ...略 */ };

  // 預設輸出必須要用 shapes.default 指涉
  let rectangle: shapes.default = {
    type: 'Rectangle',
    width: 4,
    height: 5 
  };
  ```

  不過用 `default` 這個屬性的註記方式不直觀，因此會建議用預設輸出的型別取個名稱會比較好：
  ```ts
  // 檔案位置：./index.ts
  import Shape, * as shapes from './Shape';

  // 預設輸出可以用名稱 Shape 替代 shapes.default
  let rectangle: Shape = { /* ...略 */ };
  ```

### 8.1.4 輸出引入的模組 Export From Import
  有時候寫套件會用到很多型別，散落在各個不同的檔案，造成引入時不太方便
  ```ts
  // 檔案位置： ./shapes/Circle.ts
  export type Circle = {
    type: 'Circle';
    radius: number;
  };
  ```
  ```ts
  // 檔案位置： ./shapes/Rectangle.ts
  export type Rectangle = {
    type: 'Rectangle';
    width: number;
    height: number;
  };
  ```
  ```ts
  // 檔案位置： ./shapes/Triangle.ts
  export type Triangle = {
    type: 'Triangle';
    base: number;
    height: number;
  };
  ```

  使用起來會變成以下引入方式：
  ```ts
  // 檔案位置：./index.ts
  import { Circle } from './shapes/Circle';
  import { Rectangle } from './shapes/Rectangle';
  import { Triangle } from './shapes/Triangle';
  ```

  因此通常會有一個檔案專門彙整相關的型別，統一輸出去。額外新增 `shapes/index.ts` 的檔案，並且將所有型別進行彙整輸出：
  ```ts
  // 檔案位置：./shapes/index.ts
  import { Circle } from './Circle';
  import { Rectangle } from './Rectangle';
  import { Triangle } from './Triangle';

  export { Circle, Rectangle, Triangle };
  ```

  ```ts
  // 檔案位置：./index.ts
  import * as shapes from './shapes/index';

  // 用 shapes.[型別] 的方式指涉
  let circle: shapes.Circle = {
    type: 'Circle',
    radius: 3
  };
  ```
  以上程式碼可以簡化資料夾路徑，`index` 可以省略。
  ```ts
  // 檔案位置：./index.ts
  import * as shapes from './shapes';
  ```

  由於這樣的模式很常見，因此 `ES6` 可以直接輸出載入的模組語法。
  ```ts
  // 原本寫法
  import { Circle } from './Circle';
  import { Rectangle } from './Rectangle';
  import { Triangle } from './Triangle';

  export { Circle, Rectangle, Triangle };

  // ES6 寫法
  export { Circle } from './Circle';
  export { Rectangle } from './Rectangle';
  export { Triangle } from './Triangle';
  ```

  如果 `shpaes` 資料夾裡的模組，每一個都是用預設模式輸出時，
  ```ts
  // 檔案位置： ./shapes/Circle.ts
  type Circle = { /* 略 ... */ };
  export default Circle;

  // 檔案位置： ./shapes/Rectangle.ts
  type Rectangle = { /* 略 ... */ };
  export default Rectangle;

  // 檔案位置： ./shapes/Triangle.ts
  type Triangle = { /* 略 ... */ };
  export default Triangle;
  ```

  輸出載入的語法就會變成
  ```ts
  export { default as Circle } from './Circle';
  export { default as Rectangle } from './Rectangle';
  export { default as Triangle } from './Triangle';
  ```

  - #### ES6 Import / Export 語法
    - 1. ES6 Import / Export 語法 為 `JavaScript` 標準的模組語法規範。
    - 2. 如果程式碼複雜度提升時，可以試著將型別宣告與實踐的部分進行分離。
    - 3. 任何模組要輸出東西時，一定要使用 `export` 關鍵字；從其他模組引入東西時，則使用 `import` 關鍵字，並且將要輸入的東西用大括弧框住。
    - 4. 預設輸出時，使用 `export default` 方式進行輸出；`每個模組一次只能擁有一個預設輸出`。
    - 5. `引入預設輸出的東西不需要用大括弧框住`，也不一定要按照預設輸出的名稱命名。
    - 6. 使用 `import * as <NAME> form <MODULE>` 的方式，可以將模組裡的所有東西引入。
    - 7. 任何普通模式輸入的東西，可以 `藉由 as 關鍵字改名`。
    - 8. 使用 `export {...} from <MODULE>` 的方式可以直接輸出從模組引入的東西。
    - 9. 若載入的模組路徑為資料夾時，`預設會讀取該資料夾內的 index.ts 檔案的內容`。

## 8.2 命名空間 Namespaces
### 8.2.1 TypeScript 原先提供的模組化解法
  早期，`ESMAScript` 的 `Import/Export` 語法還沒正式釋出，
  `TypeScript` 利用 `namespaces` 以及 `module` 的模組宣告式語法。

### 8.2.2 命名空間的意義 Namespaces
  在 `TypeScript` 專案裡，引入各種不同來源的模組或套件，為了 `避免型別在命名宣告上產生衝突`，於是 `TypeScript` 提供了模組化的宣告方式，謂之 `命名空間`。
  
  注意，宣告命名空間時，由於它本身也是模組的一種，因此 `輸出型別時也需要使用關鍵字 export`！
  ```ts
  /* 宣告命名空間 Shapes */
  namespace Shapes {
    export type Circle = { /* 略 ... */ };
    export type Rectangle = { /* 略 ... */ };
    export type Triangle = { /* 略 ... */ };
  }
  ```

  使用命名空間輸出的型別，跟呼叫物件屬性的概念很像：
  ```ts
  // 使用 Shapes.Circle 型別
  let circle: Shapes.Circle = { /* 略 ... */ };
  ```
  
### 8.2.3 命名空間的融合 Namespaces Merging
  與介面的融合 (Interface Merging) 相似，命名空間若重複宣告的話，並非覆寫掉過往宣告的命名空間，而是進行 `宣告的融合 (Declaration Merging)`。
  ```ts
  /* 宣告命名空間 Shapes */
  namespace Shapes {
    export type Circle = {
      type: 'Circle';
      radius: number;
    }
  }

  /* 重複宣告命名空間 Shapes 並不會覆寫掉前面的宣告 */
  namespace Shapes {
    export type Rectangle = { /* 略 ... */ };
    export type Triangle = { /* 略 ... */ };
  }
  ```

  宣告的效果等效於：
  ```ts
  /* 宣告命名空間 Shapes */
  namespace Shapes {
    export type Circle = {
      type: 'Circle';
      radius: number;
    };

    export type Rectangle = { /* 略 ... */ };
    export type Triangle = { /* 略 ... */ };
  }
  ```

  命名空間的宣告融合過程中，若出現 `型別化名 (Type Alias)` 之名稱重複時，就會出現錯誤訊息。
  `類別 (Class)` 也不能夠使用同一個名稱重複宣告。

  然而，若是 `介面宣告` 重複時，由於介面也屬於定義的融合範疇，因此會進行融合。
  ```ts
  /* 命名空間裡的介面 Example 會進行介面融合 */
  namespace Shapes {
    export interface Example = {
      propA: string;
    };
  }

  namespace Shapes {
    export interface Example = {
      propB: number;
    };
  }
  ```
  等效於：
  ```ts
  namespace Shapes {
    export interface Example = {
      propA: string;
      propB: number;
    };
  }
  ```

### 8.2.4 巢狀命名空間 Nested Namespaces
  命名空間裡也可以宣告命名空間，要輸出就得使用關鍵字 `export`。
  ```ts
  /* 巢狀命名空間的宣告 */
  namespace Outer {
    export namespace Inner {
      export type Example = {
        propA: string;
        propB: number;
      };
    }
  }

  /* 使用巢狀命名空間內部輸出的型別 */
  let obj: Outer.Inner.Example = {
    propA: 'Hello world',
    propB: 123
  };
  ```

  由於命名空間本身具備定義融合性質，因此以下的宣告手法：
  ```ts
  namespace Outer {
    export namespace Inner {
      export type Example1 = /* Example1 的型別化名宣告 */;
    }
  }

  namespace Outer {
    export namespace Inner {
      export type Example2 = /* Example2 的型別化名宣告 */;
    }
  }
  ```
  等效於融合過後的寫法：
  ```ts
  namespace Outer {
    export namespace Inner {
      export type Example1 = /* Example1 的型別化名宣告 */;
      export type Example2 = /* Example2 的型別化名宣告 */;
    }
  }
  ```

### 8.2.5 引入命名空間 Import Namespaces
  事實上，`ES6 Import / Export` 也可以引入 `TypeScript` 的命名空間。宣告命名空間時，記得附上 `export` 關鍵字。
  ```ts
  // 檔案名稱 ./Shapes.ts
  // 記得要把命名空間輸出
  export namespace Shapes {
    export type Circle = {
      type: 'Circle';
      radius: number;
    };

    export type Rectangle = { /* 略 ... */ };
    export type Triangle = { /* 略 ... */ };
  }
  ```

  ```ts
  // 檔案位置： ./index.ts
  import { Shapes } type './Shapes';

  // 使用命名空間提供的 Circle 型別
  let circle: Shapes.Circle = { /* 略 ... */ };
  ```

## 8.3 型別宣告 Type Declaration
### 8.3.1 連結 JavaScript 與 TypeScript 的橋樑
  從模組化系統出來後，`TypeScript` 提供了一個管道，讓開發者不需將整個 `JavaScript` 寫成的套件轉成 `TypeScript`，仍然可以和 `TypeScript` 共同協作，這個中間溝通的橋樑被稱之為 `型別宣告 (Type Declaration)`。
  ```ts
  /* 宣告一個字串型別的型別化名 message */
  declare type message = string;
  ```
  > 主要是為了解決，可以在 `TypeScript` 程式碼引入原生 `JavaScript` 寫成的模組。

### 8.3.2 引入原生 JavaScript 寫成的模組
  ```js
  // 檔案路徑： ./hello-world.js
  const message = 'Hello world';

  /* Node Module 輸出的方式 */
  module.exports = { message };
  ```

  如果直接在 `TypeScript` 的專案裡引用 `JavaScript` 檔案，絕對無法編譯。

  從錯誤訊息可以得知，從 `JavaScript` 裡引入的東西是無法被 `TypeScript` 分析過程時推論，因此必須 `主動告訴 TypeScript，從原生 JavaScript 套件引入的東西之型別`。

### 8.3.3 型別定義檔 Type Definition File
  通常宣告型別定義時，會將它們放到名為 `定義檔 (Definition File)` 的地方，檔案的命名結尾為 `.d.ts`，由於引入的 `JavaScript` 套件名稱為 `hello-world.js`，相對應得定義檔，命名為 `hello-world.d.ts`。
  ```ts
  // 檔案路徑： ./hello-world.d.ts
  export declare const message: string;
  ```

  這樣就能正常運行了。

  這就是可以在不將原生 `JavaScript` 轉換成 `TypeScript` 程式碼的情形下，就由單純的型別定義，讓 `TypeScript` 程式碼使用 `JavaScript` 程式提供的功能。

  有 `declare` 關鍵字跟沒有 `declare` 關鍵字的宣告情形下，差異在於，`型別宣告部分 (也就是有 declare 關鍵字的宣告) 只有單純宣告型別的作用`。

  `declare` 關鍵字，可以用在各種型別的宣告：
  ```ts
  /* 變數型別宣告 */
  declare var   foo: number;
  declare let   bar: string;
  declare const baz: boolean;

  /* 函式型別宣告 (超載也可以喔！) */
  declare function addition(input1: number, input2: number): number;
  declare function addition(input1: string, input2: string): number;

  /* 類別宣告 */
  declare class Person {
    /* 各種存取修飾模式都可以宣告 */
    public    name: string;
    private   age: number;
    protected interest: string[];

    /* 成員方法也可以宣告 */
    public getInfo(): string;
  };

  /* 型別化名宣告 */
  declare type PersonalInfo = {
    name: string;
    age: number;
    interests: string[];
  }

  /* 介面宣告 */
  declare interface UserAccount {
    email: string;
    password: string;
    subscribed: boolean;
  }
  ```
  尤其在 `函式與類別的 declare 型別宣告部分，不需要去實踐內容`；`定義檔的目的只是描述那些 JavaScript 程式碼提供的功能對應之型別介面`。

  另外，如果該定義宣告需要輸出時，一定要加上 `export` 關鍵字。

  - #### 型別宣告 Type Declaration
    - 1. 使用 `declare` 關鍵字，可以進行型別的宣告。
    - 2. `型別宣告的東西不需要進行實踐`，它僅只具備提供型別資訊輔助 `TypeScript` 的型別檢測與編譯過程而已。
    - 3. 想要從原生 `JavaScript` 寫出來的模組，引入到 `TypeScript` 專案時，必須提供 `型別定義檔 (Type Definition File)`；`型別定義檔固定會有 .d.ts 的後綴`。

## 8.4 引入純 JavaScript 套件的流程
### 8.4.1 開源社群提供之型別定義檔
  熱心的開源社群，將幾乎常見的原生 `JavaScript` 對應的型別定義檔 `集中放置在名為 DefinitelyTyped` 的 [GitHub 資料庫 (Repository)](https://github.com/DefinitelyTyped/Definitelytyped)。

  已經翻寫成 `TypeScript` 的開源套件，就不需要這樣的安裝手法，可直接在 `TypeScript` 專案使用。

### 8.4.2 安裝原生 JavaScript 開發的套件
  以 `JQuery` 為例，展示如何安裝原生 `JavaScript` 的套件到 `TypeScript` 專案裡；

  由於要用 `JQuery` 作為示範，必須下載該套件
  ```sh
  npm init -y

  npm install jquery
  ```

  接下來，新增 `index.ts` 檔案，並填入簡單的測試程式碼：
  ```ts
  /* 將 JQuery 套件引入 */
  import $ from 'jquery';

  /* 當瀏覽器的 document 載入時，console 就會印出 Hello world 字串 */
  $(document).ready(function() {
    console.log('Hello world!');
  })
  ```

  想當然，因為 `JQuery` 套件本身是用純 `JavaScript` 寫出來的，並沒有 `TypeScript` 型別系統的指引，因此使用 `JQuery` 相關的方法，出現的推論結果基本上都會被視為 `Any` 型別。

  為了讓 `TypeScript` 專案能夠順利開發，就需要依賴 `JQuery` 的型別定義檔。然而下載這些型別定義檔時，會用以下的格式下載：
  ```sh
  npm install @types/<PACKAGE_NAME>
  ```

  也就是說，`JQuery` 套件的型別定義檔可以用以下指令下載
  ```sh
  npm install @types/jquery
  ```

  前面的 `@types` 為 NPM 套件的命名空間，任何有 `@types` 名稱前綴的套件通常就是型別定義檔。

  - #### 型別定義檔的下載
    - 1. 開源社群裡，大部分原生 `JavaScript` 的套件對應的 `TypeScript` 型別定義檔會放在名為 `Definitely Typed` 的 GitHub 資料庫裡。
    - 2. 套件對應的型別定義檔，固定會有 `@types` 的前綴命名。
    - 3. 大部分的套件 (原生 JavaScript 開發或編譯出來的結果)，若想要和 `TypeScript` 專案協作，就必須同時下載該套件 `以及該套件對應的型別定義檔`。
    - 4. 少數本身套件若為 `TypeScript` 開發出來的，則不需要經歷 第3點 講到的步驟。

## [本章練習](../A/typeScript-A.html#第八章-typescript-模組系統)