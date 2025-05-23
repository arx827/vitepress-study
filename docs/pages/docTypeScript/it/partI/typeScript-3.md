---
title: IT邦 - 讓 TypeScript 成為你全端開發的 ACE !
---

# 3 深入型別系統I 基礎篇

## 3.1 深潛之前的準備
### 3.1.1 TypeScript 編譯設定檔
  `TypeScript 編譯設定`，可以造就出很多種不同 `TypeScript` 編譯的規則與條件。
  `tsconfig.json` 檔案，透過 `TypeScript` 編譯指令(也就是 `tsc`)可以初始化編譯設定檔：
  ```sh
  tsc --init
  ```

  在想建立 `TypeScript` 專案的地方，執行此指令，就會自動產生 `TypeScript 設定檔`。

  ```json
  {
    "compileOnSave": false,    //編輯器在儲存檔案的時候根據tsconfig.json重新產生編譯檔案
    "compilerOptions": {

      /* 基本選項 */
      "target": "es5",    // 指定編譯生成的JS版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
      "module": "commonjs", // 指定生成哪種模組: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
      "lib": [],          // 編譯需要引入的特定函式庫檔案
      "allowJs": true,    // 允許編譯 javascript 文件
      "checkJs": true,    // 報告 javascript 文件中的錯誤
      "jsx": "preserve",  // 指定 jsx 代碼的生成: 'preserve', 'react-native', or 'react'
      "declaration": true,  // 生成相應的 '.d.ts' 文件
      "declarationMap": true,   //生成宣告檔案的 sourceMap
      "sourceMap": true,   // 生成相應的 '.map' 文件
      "outFile": "./",     // 將輸出文件合併為一個文件
      "outDir": "./",      // 指定輸出目錄
      "rootDir": "./",     // 檔案應該要被放置的位置
      "composite": true,       // 是否编译构建引用项目
      "tsBuildInfoFile": "./", // 指定文件存儲增量編譯信息，默認為 tsconfig.tsbuildinfo
      "removeComments": true,  // 刪除編譯後的所有的註釋
      "noEmit": true,          // 不產生輸出檔案
      "importHelpers": true,   // 從 tslib 導入輔助工具函數
      "isolatedModules": true,  // 將每個文件做為單獨的module（與 'ts.transpileModule' 類似）.

      /* 嚴格的類型檢查選項 */
      "strict": true,           // 啟用所有嚴格類型檢查選項                    
      "noImplicitAny": true,    // 在表達式和聲明上有隱含的 any類型時報錯                   
      "strictNullChecks": true,  // 啟用嚴格的 null 檢查                  
      "strictFunctionTypes": true,    //啟用檢查function型別        
      "strictBindCallApply": true,   //啟用對 bind, call, apply 更嚴格的型別檢查           
      "strictPropertyInitialization": true,     //啟用class实例属性的賦值檢查
      "noImplicitThis": true,    //當 this 表達式值為 any 類型的時候，生成一個錯誤                
      "alwaysStrict": true,     // 以嚴格模式檢查每個module，並在每個文件裡加入 'use strict'                  

      /* 額外的檢查 */
      "noUnusedLocals": true,   // 有未使用的變數時，拋出錯誤
      "noUnusedParameters": true,  // 有未使用的參數時，拋出錯誤
      "noImplicitReturns": true, // 並不是所有function里的代碼都有返回值時，拋出錯誤
      "noFallthroughCasesInSwitch": true, // 報告 switch 語句的 fallthrough 錯誤。 （即，不允許 switch 的 case 語句貫穿）
      "noUncheckedIndexedAccess": true,       //檢查 index signature 屬性是否是undefined     

      /* 模組選項 */
      "moduleResolution": "node",  // 選擇模組解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
      "baseUrl": "./",         // 用於解析非相對模組名稱的基目錄
      "paths": {},            // 模組名到基於 baseUrl 的路徑映射的列表
      "rootDirs": [],        // 根文件夾列表，其組合內容表示項目運行時的結構內容
      "typeRoots": [],       // 包含類型聲明的文件列表
      "types": [],          // 需要包含的類型聲明文件名列表
      "allowSyntheticDefaultImports": true,  // 允許從沒有設置默認導出的模組中默認導入。

      /* Source Map Options */
      "sourceRoot": "./",                    // 指定調試器應該找到 TypeScript 文件而不是源文件的位置
      "mapRoot": "./",                       // 指定調試器應該找到映射文件而不是生成文件的位置
      "inlineSourceMap": true,               // 生成單個 soucemaps 文件，而不是將 sourcemaps 生成不同的文件
      "inlineSources": true,                 // 將代碼與 sourcemaps 生成到一個文件中，要求同時設置了 --inlineSourceMap 或 --sourceMap 屬性

      /* 其他選項 */
      "experimentalDecorators": true,        // 啟用裝飾器
      "emitDecoratorMetadata": true,          // 為裝飾器提供元數據的支持
          
      /* 進階選項 */
      "skipLibCheck": true,                     //不會檢查引入的函式庫檔案
      "forceConsistentCasingInFileNames": true // 確保檔案的大小寫一致
    },
    "files":[
          "hello.ts"                           //若指定 files，則只會編譯指定的 hello.ts 檔案。
    ],
    "exclude": [                               //指定編譯器需要排除的文件或文件夾
      "node_modules"
    ],
    "extends": "./tsconfig.base.json",         //把基礎配置抽離成tsconfig.base.json檔案，然後引入
    
    "references": [                             // 指定依赖的程式路徑
      {"path": "./common"}
    ],
    "typeAcquisition": {                       //自動引入函式庫相關定義文件(.d.ts)。
        "enable": false,
        "exclude": ["jquery"],
        "include": ["jest"]
    }
  }
  ```

  基本上可以在 [TypeScript 官網](https://www.typescriptlang.org/zh/tsconfig/) - `Compiler Options` 查詢更詳盡的需求。

  - 1. 初始化專案設定檔，使用指令： `tsc --init`。
  - 2. 檢查設定：確認 `strict` 設為 `true`。

### 3.1.2 檢測型別推論與註記的迭代流程
  不停的重複這幾個流程：
  1. 被動地 `型別推論 (Inference)` 時，發生的過程與原理。
  2. 主動地 `型別註記 (Annotation)` 的機制與產生的效用。
  3. 探討該型別條件下，本身適合被動式推論亦或者積極註記的時機點、優缺等細節。

### 3.1.3 型別化名介紹 - Introduction to Type Alias
  為型別或者型別的組合取一個新名字的概念。

  原始的物件型別範例：
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

  使用型別化名：
  ```ts
  type UserInfo = {
    name: string;
    age: number;
    interest: string[];
  }

  const info: UserInfo = {
    name: 'Maxwell',
    age: 18,
    interest: ['drawing', 'programming'],
  }
  ```

## 3.2 原始型別 Primitive Types
### 3.2.1 型別推論機制
  - #### 原始型別：表現資料型態的最小單位。
    ```ts
    /* 數字型別 number */
    let num = 123;

    /* 字串型別 string */
    let message = 'Hello world';

    /* 布林值型別 boolean */
    let truthy = true;

    /* Undefined 型別 undefined */
    let meansEmpty = undefined;

    /* Null 型別 null */
    let meansNothing = null;
    ```
    > 想要檢測變數被指派的結果，可以在 `VSCode` 上，將滑鼠移動到該變數，就會跳出 `TypeScript` 編譯器的推論結果相關訊息。

  - #### 沿途傳遞推論結果：
    ```ts
    /* 數字型別 number */
    let num = 123;

    /* foo 被指派變數 num */
    let foo = num;  // foo 也被推論為 number
    ```
    > `TypeScript` 編譯器型別偵測過程，會沿途 `傳遞 (Propagate)` 型別的推論結果到後面的程式。

  - #### 分岔點
    ```ts
    /* 結果是數字型別還是字串型別？ -- 機率各為五成 */
    let whatIsThis = (Math.random() > 0.5) ? 123 : '123';
    ```
    > 推論出來的型別，應該會以 `邏輯『或』(OR)` 的結果 -- 也就是 `聯集型別 (Union Type)` 來表示

    `TypeScript` 編譯器會將各自的狀況過程與回傳推論結果，用聯集型別方式來表示。
    ```ts
    /* 結果是數字型別還是字串型別？ -- 機率各為五成 */
    let whatIsThis;

    if (Math.random() > 0.5) {
      whatIsThis = 123
    } else {
      whatIsThis = '123';
    }

    whatIsThis; // 推論結果為 string | number
    ```

  - #### 一經推論過後的變數就會只固定接收該型別下的任何值
    ```ts
    /* 數字型別 number */
    let num = 123;

    /* num 被指派型別為數字的型別 */
    num = 456;

    /* num 被指派型別為字串的型別 */
    num = 'Hello world!'; // 當 num 變數被指派非 number 型別之值時，底下會出現紅色波浪狀的警告足跡
    ```

  - #### TypeScript 型別推論的運作特點
    - 1. `傳遞性`：一經推論過後的變數，會將其推論結果陸陸續續傳遞到後面的程式碼，以輔助其他變數、表達式的推論結果。
    - 2. `匯集性`：若變數的推論可能遇到程式中的分岔點 (條件敘述、三元運算表達式等) 而有所不同，`TypeScript` 會綜合各個分岔點的推論結果並匯聚成聯集型別 (Union Type)。
    - 3. `固定性`：一經宣告與推論過後的變數，後續任何指派到該變數的值，必須符合該變數被推論之型別的範疇。

### 3.2.2 型別註記機制
  - #### 簡單註記
    ```ts
    /* 數字型別 number */
    let num: number = 123;

    /* 字串型別 string */
    let message: string = 'Hello world';

    /* 布林值型別 boolean */
    let truthy: boolean = true;

    /* Undefined 型別 undefined */
    let meansEmpty: undefined = undefined;

    /* Null 型別 null */
    let meansNothing: null = null;
    ```

### 3.2.3 遲滯性指派 Delayed Initialization
  - #### 1. 定義：
    變數宣告時不進行指派值的動作，而延後至程式後面的某處再指派值的情形。
  - #### 2. 若變數採用遲滯性指派的策略，宣告方式如下：
    ```ts
    let <variable>;
    ```
    該變數 `<variable>` 會直接被推論為 `any` 型別，初始化之值則為 `undefined`。
  - #### 3. 若變數採用遲滯性指派的策略，並且有被註記特定型別 `T`，宣告方式如下：
    ```ts
    let <variable>: T;
    ```
    該變數 `<variable>` 會直接被推論為 `T` 型別，嚴格上來說，此時並沒有初始化之值可言，因為只要是在被正式指派值前使用該變數時，就會被 `TypeScript` 靜態分析過後，丟出警告訊息如下：
    ```ts
    Variable '<variable>' is used before being assigned.
    ```

## 3.3 JSON 物件型別 JSON Object Type
### 3.3.1 型別推論機制
  ```ts
  /* 先宣告 info 變數，並且指派簡單的 JSON 物件 */
  let info = {
    name: 'Maxwell',
    age: 18,
    interest: ['drawing', 'programming'],
  }
  ```
  由於物件呼叫屬性或方法也是隸屬於 `表達式 (Expression)`，因此整個表達式也可以被型別推論出結果來。

### 3.3.2 型別註記機制
  ```ts
  /* 先宣告 info 變數，註記後並且指派簡單的 JSON 物件 */
  let info: {
    name: string;
    age: number;
    interest: string[];
  } = {
    name: 'Maxwell',
    age: 18,
    interest: ['drawing', 'programming'],
  }
  ```
  首先，物件的值的寫法用逗號分隔，是絕對必須遵守的事情；但型別的部分，在 `TypeScript` 裡，想用分號分隔或者是逗號分隔，都可以。

### 3.3.3 物件的完整性不容許被動搖
  - #### 首先，單純對推論的物件做新增屬性的動作：
    ```ts
    /* 先宣告 info 變數後，指派簡單的 JSON 物件 */
    let info = {
      name: 'Maxwell',
      age: 18,
      interest: ['drawing', 'programming'],
    };

    /* 新增屬性 */
    info.email = 'example@mail.com';
    ```
    > 如果讓 `TypeScript` 編譯器分析，它是不會允許直接對物件進行新增屬性的動作。

  - #### 然而，刪除屬性這個動作時：
    ```ts
    /* 先宣告 info 變數後，指派簡單的 JSON 物件 */
    let info = {
      name: 'Maxwell',
      age: 18,
      interest: ['drawing', 'programming'],
    };

    /* 刪除屬性 */
    delete info.name;
    ```
    > 這樣的動作，反而不會造成任何問題或警告訊息的產生。

    而且如果後面再將 `info.name` 指派到其他變數時，該變數的推論會是 `string` 型別。
    ```ts
    /* 刪除屬性 */
    delete info.name;

    let myName = info.name; // 就算刪除了屬性，推論結果依然存在
    ```
  
  - #### 覆寫 JSON 物件某特定屬性或方法的行為：
    ```ts
    /* 先宣告 info 變數後，指派簡單的 JSON 物件 */
    let info = {
      name: 'Maxwell',
      age: 18,
      interest: ['drawing', 'programming'],
    };

    /**
     * 覆寫屬性的值，其中 info.name 期望被接收的值應該要為 string 型別，
     * 而 'Martin' 也屬於 string 型別
     */
    info.name = 'Martin';
    ```

  - #### 操作 JSON 物件時的注意事項 -- 保持 JSON 物件的完整性
    一旦某變數被推論為 JSON 物件時，該變數必須遵守以下規則：
    1. 不能任意新增屬性。
    2. 覆寫掉特定屬性或方法時，覆寫之值的型別不能與該屬性或方法推論過後之型別產生衝突。
    3. 覆寫掉整個變數的 JSON 物件值，覆寫之 JSON 物件的值的型別結構不能與變數原先的型別結構產生衝突。

    > 簡而言之，不能夠對物件進行型別結構上的破壞，保持物件的完整性。

    > 唯一的例外是使用 `delete` 關鍵字，進行刪除 JSON 物件的屬性或方法的動作。

### 3.3.4 選用屬性 Optional Property
  有另一個機制能讓我們創造出結構相對鬆散些的 JSON 物件。
  
  可以在該屬性宣告時，旁邊附帶一個問號：
  ```ts
  /* 先宣告名為 PersonalInfo 的型別化名 */
  type PersonalInfo = {
    name: string;
    age?: number;     // 注意這裡的屬性 age 被標上『 ？ 』了
    interest: string[];
  }

  /* 宣告 info 變數，註記 PersonalInfo 型別，可以省略 age 屬性 */
  let info: PersonalInfo = {
    name: 'Maxwell',
    interest: ['drawing', 'programming'],
  }
  ```

  - #### JSON 物件選用屬性
    若想在 JSON 物件型別 `TObject` 裡宣告出，可以被省略的某特定屬性 `<Prop>`，則寫法如下：
    ```ts
    type TObject = {
      /* 其他屬性對應型別的宣告 */
      <Prop>?: <TProp>
    }
    ```

    其中 `<TProp>` 為 `<Prop>` 屬性對應之預設型別，然而因為 `<Prop>` 被註記為選用屬性，因此在型別推論時，其推論結果慧根 `undefined` 進行聯集的作用，也就是 `<TProp> | undefined`。

    因此任何變數被註記為型別 `TProp` 時，以下的兩種寫法都可以：
    ```ts
    let foo: TObject = {
      /* 對應 TObject 型別結構宣告的其他屬性 */
      <Prop>: <VProp> // 不省略 <Prop> 屬性
    };

    let bar: TObject = {
      /* 除了 <Prop> 外，對應 TObject 型別結構宣告的其他屬性 */
    };
    ```
    其中 `<VProp>` 為代表型別 `<TProp>` 的值。

### 3.3.5 唯讀屬性 Read-Only Property
  避免開發者擅自覆寫屬性的功能。
  ```ts
  /* 先宣告名為 PersonalInfo 的型別化名 */
  type PersonalInfo = {
    name: string;
    readonly age: number; // 將 age 設定為唯讀屬性
    interest: string[];
  }

  /* 宣告 info 變數，註記為 PersonalInfo 型別 */
  let info: PersonalInfo = {
    name: 'Maxwell',
    age: 18,
    interest: ['drawing', 'programming'],
  }
  ```

  ```ts
  /* 欲覆寫 info.age 之值，然而 age 為唯讀屬性時，就會引發錯誤 */
  info.age = 20;
  
  // Cannot assign to 'age' because it is a read-only property.
  ```

  另外，唯讀屬性也禁止刪除。
  ```ts
  /* 欲刪除 info.age 之值，然而 age 為唯讀屬性時，就會引發錯誤 */
  delete info.age;
  
  // The operand of a delete operator cannot be a read-only property.
  ```

  不過，儘管裡面有唯讀狀態的屬性，覆寫全部的 `JSON` 物件，基本上依然是允許的行為，畢竟完整覆寫 `JSON` 物件，形同是換掉物件的參照(`Reference`)，而非物件的值(`Value`) 本身，畢竟唯讀操作符綁定的目標是『值的屬性』。
  ```ts
  /* 先宣告 info 變數後，註記為 PersonalInfo 型別，指派簡單的 JSON 物件 */
  let info: PersonalInfo = {
    name: 'Max',
    age: 18,
    interest: ['drawing', 'programming'],
  }

  /**
   * 使用暴力覆寫法，整個 JSON 物件，連同結構細節丟進去；雖然 age 為唯讀屬性，
   * 但唯讀效果並不是綁在變數本身，所以變數被整個覆寫是可以被接受的
   */
  info = {
    name: 'Maxwell',  // 特別覆寫掉 name 屬性
    age: info.age,  // 儘管 age 是唯讀屬性，但這裡只有讀 (Read) 的操作
    interest: info.interest,
  }
  ```

  如果想要讓變數 `info` 中的所有屬性變成唯讀狀態，一種是將型別化名裡宣告的所有屬性通通標上唯讀屬性操作符：
  ```ts
  /* PersonalInfo 通通都是唯讀屬性 */
  type PersonalInfo = {
    readonly name: string;
    readonly age: number;
    readonly interest: string[];
  }
  // 不建議這樣做，麻煩且缺乏彈性
  ```

  可使用進階寫法：
  ```ts
  type PersonalInfo = {
    name: string;
    age: number;
    interest: string[];
  }
  let info: Readonly<PersonalInfo> = {
    name: 'Max',
    age: 18,
    interest: ['drawing', 'programming'],
  }
  ```

  - #### JSON 物件唯讀屬性
    假設宣告 `JSON` 物件之型別 `Tobject`，裡面的結構中，某個屬性 `<Prop>` 被標上唯讀屬性操作符，寫法如下：
    ```ts
    type Tobject = {
      /* 其他屬性對應型別的宣告 */
      readonly <Prop>: <Tprop>;
    }
    ```
    其中，`<Tprop>` 為 `<Prop>` 對應之型別。

    任何被註記為 `Tobject` 型別的變數，不能夠覆寫掉 `<Prop>` 屬性。

## 3.4 函式型別 Function Object Type
### 3.4.1 型別推論機制
  『函式型別絕大部分情形是 `TypeScript` 無法推論的。』

  - 單純推論結果
    ```ts
    /* 宣告函式 universalNumber */
    function universalNumber() {
      return 42;
    }

    // 推論結果：function universalNumber(): number
    ```

  - 遇到類似判斷敘述式時，`TypeScript`編譯器會採取匯集型別可能出現的結果並 `聯集(Union)` 起來。
    ```ts
    /* 宣告函式 numberOrString */
    function numberOrString() {
      const probability = Math.random();

      if(probability > 0.5) {
        return probability;             // 五成機率回傳數字型態結果
      }else{
        return probability.toString();  // 五成機率回傳字串型態結果
      }
    }

    // 推論結果：function numberOrString(): string | number
    ```

  - 推論結果為更精確的值
    在函式裡，無法在函式外部更改函式內部的定義，函式內部的回傳值無法從外面修改它。因此函式可以將推論結果限縮到直接用 `明文` 的方式表示。
    ```ts
    /* 宣告函式 numberOrString */
    function numberOrString() {
      const probability = Math.random();

      if(probability > 0.5){
        return 42;    // 五成機率回傳數字型態結果
      }else{
        return '42';  // 五成機率回傳字串型態結果
      }
    }

    // 推論結果：function numberOrString(): 42 | '42'
    ```

  - 在函式外的判斷結果會有所不同
    ```ts
    /* 結果是數字型別還是字串型別？ 機率各為五成 */
    let numberOrString;
    const probability = Math.random();

    if(probability > 0.5){
      numberOrString = 42;
    }else{
      numberOrString = '42';
    }

    numberOrString;

    // 推論結果：numberOrString: string | number
    ```

  - 沒有任何回傳值時
    ```ts
    /* 宣告函式 greeting */
    function greeting() {
      console.log('Hello world!');
    }

    // 推論結果：function greeting(): void
    ```
    > `void`：意思是『虛無』，也就是說函式的回傳結果無意義。

    若有 `return`，但是回傳沒有結果，推論結果將相同
    ```ts
    /* 宣告函式 returnsVoid */
    function returnsVoid() { return }   // 單純一個 return 敘述式

    // 推論結果：function returnsVoid(): void
    ```

  - 輸入參數本質上是無法被推論的，原因是由於輸入參數的型別是由開發者使用、呼叫該函式時才能確定
    ```ts
    /* 宣告函式 echo */
    function echo(input) {
      return input;
    }

    // 參數 input 會被 "隱性地" 認定為 any 型別
    ```

  - #### 函式型別的推論與注意事項
    函式物件通常分為兩個部分 - `輸入 (Input)` 與 `輸出 (Output)`。

    `TypeScript` 靜態分析函式物件之型別過程中，尤其是宣告函式時，**大多數情形會無條件將函式之輸入參數推論為 `any` 型別**；函式之 **輸出型別則是會看 `return` 敘述式回傳的結果值(或表達式)之型別**。

    若函式的 `return` 敘述式並無回傳任何值，亦或者該函式並無任何 `return` 敘述式，其輸出型別必為 `void`。

### 3.4.2 型別註記機制
  ```ts
  /**
   * 情況一：宣告變數時註記，並將函式當成物件值
   * 使用箭頭 => 是要避免跟宣告變數時，早就在註記時用過的冒號混淆
   */
  let addition1: (a: number, b: number) => number = function(a, b) {
    return a + b;
  }

  /**
   * 情況二：宣告變數時，並將函式當成物件值
   * 並且在函式宣告輸入輸出時，一併註記
   */
  let addition2: function (a: number, b: number): number {
    return a + b;
  }

  /* 情況三：函式宣告敘述式，因此一定是在輸入輸出部分註記 */
  function addition3(a: number, b: number): number {
    return a + b;
  }

  /**
   * [較少用] 情況四：宣告變數時，將函式當成物件值
   * 此時由於函式物件值是屬於表達式，因此可以用斷言註記法
   */
  let addition4 = function (a, b) {
    return a + b;
  } as (a: number, b: number) => number; // 注意這裡是用箭頭
  ```

  > 由於函式宣告時，輸入會被無條件推論為 `any` 型別，因此大部分宣告函式時的情形，函式的輸入參數必須要進行註記的動作。

  - #### 函式型別的註記時機
    大部分的函式在宣告時，必須得註記 `輸入(input)` 部分的參數型別；而 `輸出(output)` 部分則不一定，因為可以經由 `return` 敘述式讓 `TypeScript` 判斷推論結果。

    然而在開發過程中，建議可以註記函式輸出結果的目的，主要是確保實作過程是符合註記時預期的型別結果。

    而宣告出的函式，若命名規則較直覺性等原因 (用人腦從命名原則就可以輕易猜出函式輸出之型別)，可以考慮拔除函式之註記型別的可能性，畢竟到最後 `TypeScript` 編譯器依然可以從輸出結果值 (也就是從 `return` 敘述式) 推論出函式的輸出型別。

### 3.4.3 選用參數 Optional Function noUnusedParameters
  如果想要宣告一個函式，其 `參數不一定需要用到` 時，使用 `?` 來註記：
  ```ts
  /* increment: 回傳累加的結果，若無輸入，則固定累加數字為 1 */
  function increment(input1: number, input2?: number) {
    return input1 + (input2 ? input2 : 1);
  }
  ```
  其中，第一個參數 `input1` 非選用參數，因此在函式內必定是判定為 `數字型別`；而第二個參數在宣告時，參數 `input2` 後面有標上 `?`，代表 `input2` 為選用參數。
  > 與選用屬性類似，選用參數會對 `該參數對應之型別` 與 `undefined` 進行聯集複合。

  選用參數有使用限制：只能 `宣告在函式參數的尾端，不能斷斷續續地使用選用參數宣告`，如果有宣告選用參數時，後面不能有任何必要參數。
  ```ts
  /* OK：可以宣告兩個選用參數，並且是連續性宣告在尾端 */
  function sumFrom3Nums(input1: number, input2?: number, input3?: number) {
    return input1 + (input2 ? input2 : 0) + (input3 ? input3 : 0);
  }
  ```

  - #### 函式宣告時使用選用參數 Optional noUnusedParameters
    函式的輸入部分宣告時，可以宣告出選用參數，代表該函式被呼叫時，選用參數部分不一定需要代入值。

    選用參數宣告時，`只能連續性地宣告在函式參數尾端`。

    假設宣告某一函式 `F`，擁有參數 `P1`、`P2`、...`PN`，且各自對應型別為 `T1`、`T2`、...`TN`；以及選用參數 `POption1`、`POption2`、...`POptionN`，且各自對應型別為 `TOption1`、`TOption2`、...`TOptionN`，則寫法如下：
    ```ts
    function F(P1: T1, P2: T2, ..., PN: TN, POption1?: TOption1, POption2?: TOption2, ..., POption3?: TOption3) {
      /* 函式內容 */
    }
    ```

### 3.4.4 預設參數 Default Function noUnusedParameters
  選用參數的情形有時會搭配對應的 `預設值 (Default Value)`。

  當然，另一種更常見的寫法是採用 `短路 (Short-Circuiting)` 寫法才處理預設值：
  ```ts
  function increment(input1: number, input2?: number) {
    /* 若 input2 為 Falsey 相關的值，則指派數字 1 */
    const value = input2 || 1;
    return input1 + value;
  }
  ```

  `TypeScript` 於 `3.7` 版推出了新的、也是更安全的 `空值連結操作符 (Nullish Coalescing Operator)` 的寫法：
  ```ts
  function increment(input1: number, input2?: number) {
    /* 若 input2 為 null 或 undefined，則指派數字 1 */
    const value = input2 ?? 1;
    return input1 + value;
  }
  ```

  而 `ECMAScript` 標準規範下，可以改寫成：
  ```ts
  function increment(input1: number, input2?: number = 1) {
    return input1 + input2;
  }
  ```

  - #### 函式宣告時提供預設值給參數 Default Function noUnusedParameters
    - 1. 函式的輸入部分宣告時，可以宣告出預設參數值，代表該函式被呼叫時，預設參數部分不一定需要代入值。
    - 2. 預設參數由於已提供`預設值`，因此在函式內該參數被使用時，並不會出現與 `undefined` 進行聯集複合的情形。
    - 3. 預設參數宣告時，`建議` 連續性地宣告在函式參數尾端 -- 要是想要在呼叫函式時，某些參數使用預設值，則必須填入 `undefined`。

## 3.5 陣列型別 Array Object Type
### 3.5.1 型別推論機制
  - 通常只有存 『單個型別』的陣列，被稱為 `同質性陣列 (Homogeneous Array)`；
    ```ts
    /* 推論為 number[] */
    const fibSeq = [1, 1, 2, 3, 5, 8, 11];
    ```
  - 如果陣列存放『多種不同型別』的陣列，稱它為 `異質性陣列 (Heterogeneous Array)`。
    ```ts
    /* 推論為 (string | number | boolean | number[] | {a: number; b: number})[] */
    const arr = [123, 'Hello', false, {a: 123, b: 456}, 1, [4, 5, 6]];
    ```

  另外，有時候會使用到 `多維陣列 (Multi-dimensional Array)`
  ```ts
  /* 二維陣列 */
  /* 推論為 number[][]*/
  const points = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]
  ```

  最後，需注意的地方，`空陣列`：
  ```ts
  /* 推論為 any[] */
  const emptyArr = []
  ```

### 3.5.2 型別註記機制
  ```ts
  /* 一般陣列註記方式 */
  const fibSeq: number[] = [1, 1, 2, 3, 5, 8, 11];
  ```

  ```ts
  /* 異質性陣列註記方式 */
  const ex: (number | string)[] = [123, 'Hello'];
  ```

  - #### 陣列型別的推論與註記之注意事項
    - 陣列型別註記時，後面會尾隨 `中括號符號 []`，假設宣告陣列除存型別為 `T`，寫法為：
      ```ts
      let <variable>: T[] = [ ... ]
      ```
    - 其中，空陣列由於沒有任何值可以參考，因此推論型別必為 `any[]`；為了避免 `any 型別` 的出現，`主動註記空陣列是必要的行為`。

## 3.6 明文型別 Literal Type
### 3.6.1 型別推論機制
  `明文 (Literal)`：顧名思義就是直接將值表現出來。

  所以在程式中看到的，`任何值皆可自成一種型別`。
  ```ts
  // 名為數字 123 的明文數字，但也可以自成一種型別
  123;

  // 名為字串 'Maxwell' 的明文字串，但也可以自成一種型別
  'Maxwell';
  ```

  如果遇到指派隸屬於原始資料型態的明文到變數中，分成兩種情形：
  - 如果直接將明文值，指派到 `使用 let 關鍵字宣告的變數` 裡，通常該 `變數不是明文值型別`，而是 `以該明文本身代表的型別而定`。
  - `使用 const 關鍵字宣告的變數` (又名 `常數`，Constant)，會 `直接被推論為明文值型別`，畢竟常數的值不能改。
  
  如果是指派物件的明文到變數時，不管是用 `let` 或 `const` 關鍵字，都只會 `描述該物件的結構` (JSON 物件、陣列與函式物件皆是)，而非物件本身的明文值。
  ```ts
  /**
   * 不管是使用 let 或 const 宣告變數並指派 `物件值`，被推論都是明文的 "結構";
   * 以下推論結果 皆為 { foo: number; bar: string}
   */
  let   jsonObj      = {foo: 123, bar: 'Hello'};
  const constJsonObj = {foo: 123, bar: 'Hello'};
  ```

### 3.6.2 型別註記機制
  明文型別的註記方式：
  ```ts
  let devilNumber: 666 = 666;
  ```
  可以直接用 `const` 簡寫
  ```ts
  const devilNumber = 666;
  ```

  然而，如果是物件，明文值若是這樣指派下去：
  ```ts
  let jsonObj: {foo: 123, bar: 'Hello'} = {foo: 123, bar: 'Hello'};
  ```
  其實等效於，將物件凍結的效果
  ```ts
  // 會推論成 const jsonObj: Readonly<{foo: number; bar: string;}> 唯讀狀態，不可變更
  const jsonObj = Object.freeze({foo: 123, bar: 'Hello'});
  ```

  > 結論：
  > - 明文型別值，基本上不需要註記，直接宣告成 `常數` 就好了。
  > - 如果遇到 `JSON` 物件或其他種類物件，也可以使用 `Object.freeze` 將其凍結。

  有一種情況，會使用明文值，但會搭配 `聯集複合` 的技巧。
  ```ts
  let something: 123 | 456 = 123
  ```

  - #### 明文型別的推論與註記之注意事項
    - 1. 每一個 `明文值` 都可以 `自成一個型別`。
    - 2. 通常只要將原始型別值宣告成 `常數 (Constant)`，該常數的推論結果就是原始型別的明文值。
    - 3. 物件明文值，雖然也可以宣告成常數，但由於傳遞的方式是以 `參照(Reference)` 傳遞，因此內部的屬性對應的值還是有被篡改的可能，因此推論結果會是物件型別而非物件的明文型別。
    - 4. 若想要實實在在地封住物件被篡改的權限，使用 `Object.freeze` 是一種方式。
    - 5. 明文型別 `除非搭配 聯集複合 (Union)` 的方式，否則是相對沒必要註記的。

### 3.6.3 互斥聯集 Discriminated Unions
  `FLUX` 架構重點：
  - 1. 統一管理資料狀態
    ```ts
    let state = {
      items: [
        { id: 1, title: 'Have Lunch',       done: true},
        { id: 2, title: 'Learn TypeScript', done: false},
      ],
      trackID: 3, // 隨時紀錄下一個 item 被新增時需要指派的 ID 值
    }
    ```

  - 2. 限制可以採取的資料更新行為
    
    使用 `型別化名` 方式宣告四種不同的行為，
    ```ts
    // 新增代辦事項
    type NewItemAction = {
      type: 'NEW_ITEM',
      payload: { title: string };
    };

    // 刪除代辦事項
    type RemoveItemAction = {
      type: 'REMOVE_ITEM',
      payload: { id: number };
    };

    // 完成代辦事項
    type CompleteItemAction = {
      type: 'COMPLETE_ITEM',
      payload: { id: number };
    };

    // 將代辦事項重設為未完成狀態
    type UndoneItemAction = {
      type: 'UNDONE_ITEM',
      payload: { id: number };
    };
    ```

    可以用屬性 `type` 作為辨識基準，從單一屬性互相排除其他型別的可能性，使用一個 `Action` 對這四種不同的型別進行聯集：
    ```ts
    type Action = (
      NewItemAction |
      RemoveItemAction |
      CompleteItemAction |
      UndoneItemAction
    )
    ```

    而當確認互斥聯集中的其中一種型別的話，後續就會出現該型別化名的規格方面的提示。

    藉由此特性，可以設計出統一更新資料的函式 `dispatch`，其結構大致上如下：
    ```ts
    /* 簡易版本 dispatch 函式 */
    function dispatch(action: Action) {
      switch( action.type) {
        case 'NEW_ITEM':
          newItem(action.payload.title);
          break;
        case 'REMOVE_ITEM':
          removeItem(action.payload.id);
          break;
        case 'COMPLETE_ITEM':
          completeItem(action.payload.id);
          break;
        case 'NEW_ITEM':
          undoneItem(action.payload.id);
          break;
      }
    }
    ```

## [本章練習](../A/typeScript-A.html#第三章-深入型別系統i-基礎篇)