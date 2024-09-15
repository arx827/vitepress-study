---
title: TypeSctipt 邁向專家之路
---

# 第一篇 TypeScript 入門準備
---
# 05 使用 TypeScript 編譯器

## 5-1 本章行前準備
### 5-1-1 建立 tools 專案
  - 新增 tools 目錄
  - 打開命令提示字元
  - 切換到該目錄，執行初始化
    ```sh
    npm init --yes
    ```
    > 如果不加 `--yes`(或者 `-y` )，`Node.js` 會詢問一些建立 `package.json` 的選項。

  - 完成後，繼續安裝相關套件
    ```sh
    npm install --save-dev typescript@4.3.5
    npm install --save-dev tsc-watch@4.0.0
    ```

    > `--save-dev` 參數，用來告訴 `npm` 工具，這些是開發時要用的套件、不是隨著應用程式發布的東西，也可以在套件名稱後面使用 `@latest` 或 去掉 `@` 及 版本號來下載最新版本。

  - 建立 `TypeScript` 編譯器的 組態設定檔，在 tools 目錄下新增一個 `tsconfig.json` 檔案。
    ```json
    {
      "compilerOptions": {
        "target": "es2020",
        "outDir": "./dist",
        "rootDir": "./src",
      }
    }
    ```

    > 可使用指令來產生 `tsconfig.json`
      ```sh
      tsc --inin
      ```

### 5-1-2 了解專案的結構
  ```sh
  \tools
    \dist
      index.js
    \node_modules
      ...
    \src
      index.ts
    package-lock.json
    package.json
    tsconfig.json
  ```

  | 名稱                  | 說明                                      |
  |-----------------------|-----------------------------------------|
  | `dist` (distribution) | 存放 `TypeScript` 編譯器的輸出結果。         |
  | `node_modules`        | 存放應用程式與開發工具所需的套件              |
  | `src` (source)        | 存放準備要進行編譯的 `TypeScript` 原始碼檔案』 |
  | `package-lock.json`   | 這個檔案包含專案套件的完整相依性列表。         |
  | `package.json`        | 這個檔案包含專案頂層套件的相依性設定。         |
  | `tsconfig.json`       | 這個檔案包含 `TypeScript` 編譯器的設定資料    |

## 5-2 套件管理與 package.json
### 5-2-1 使用 NPM 安裝套件
  `TypeScript` 與 `JavaScript` 專案的開發必須仰賴許多套件，而這些套件已經發展成豐富的生態系。

  `Node.js` 的 `NPM` 工具可協助下載這些套件，並將它們加到專案的 `node_modules` 目錄底下。`NPM` 會根據它們的相依鏈找出每個套件需要的版本，並下載必須的額外檔案。

  專案根目錄下的 `package.json` 檔案，便是用來記錄使用者以 `npm install` 指令加入的套件。

  | 名稱         | 說明                                                                                                                     |
  |--------------|------------------------------------------------------------------------------------------------------------------------|
  | `tsc-watch`  | 用來機看原始碼目錄，並且在偵測到變動時，自動啟動編譯器、執行編譯出來的 `JavaScript` 程式碼，相當於 `TypeScript` 版本的 `nodemon` 套件。 |
  | `typescript` | 包含 `TypeScript` 編譯器以及相關工具。                                                                                      |

  - #### 版本號格式
    | 格式               | 描述                                                                                                                         |
    |--------------------|-----------------------------------------------------------------------------------------------------------------------------|
    | 4.3.5              | 直接寫出版本編號，表示只接受這個版本，例如：4.3.5版。                                                                               |
    | *                  | *星號表示接受任何版本                                                                                                          |
    | >4.3.5<br> >=4.3.5 | 任何大於、或大於等於此版本的套件均可使用。                                                                                         |
    | <4.3.5<br> <=4.3.5 | 任何小於、或大於等於此版本的套件均可使用。                                                                                         |
    | ~4.3.5             | 加上 `~` 表示修訂版本號 (revision version number, 版本編號三個數字中的最後一個) 以外的版本編號相同即可。                                |
    | ^4.3.5             | 加上 `^` 表示只要主版號 (major version number) 相同，次版本號 (minor version number) 或 修訂版本號不同也可接受。 以外的版本編號相同即可。 |

  - #### 常用的 npm 指令
    | 指令                                                             | 說明                                                                                                                             |
    |------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|
    | `npm install`                                                    | 在本地安裝 `package.json` 設定檔內已記錄的所有套件(NPM 會試著尋找符合條件的最新版本)。                                            |
    | `npm install 套件@版本`                                          | 在本地安裝此套件的指定版本(`@latest` 代表最新版)，並更新 `package.json` 檔案裡面的 `dependencies` 紀錄                            |
    | `npm install 套件`                                               | 同上，但安裝此套件登陸的最新版本                                                                                                  |
    | `npm install --save-dev 套件@版本`<br>`npm install -D 套件@版本` | 在本地安裝此討間的指定版本，並更新 `package.json` 檔案裡的 `devDependencies` 紀錄。此套件會成為開發所需的套件，而非應用程式的一部分 |
    | `npm install --global 套件@版本`<br>`npm install -g 套件@版本`   | 在全域安裝此套件的指定版本(不會更新專案的 `package.json`)                                                                        |
    | `npm list`                                                       | 列出所有本地安裝的套件                                                                                                           |
    | `npm list --global`<br>`nmp list --g`                            | 列出所有全域安裝的套件                                                                                                           |
    | `npm run`                                                        | 執行 `package.json` 檔案中『 `scripts` 』區塊定義的程式碼                                                                          |
    | `npx 套件`                                                       | 執行一個套件工具。`NPX (Node Package Execute)` 是附加在 `NPM` 內的套件執行工具                                                    |
  
  > 千萬別修改 `dist` 目錄下的檔案，因為下次執行編譯器時，他們就會被覆蓋。

### 5-2-2 了解 TypeScript 編譯器的組織設定檔案
  `TypeScript` 的許多功能，譬如靜態型別系統，是透過 `TypeScript 編譯器` `tsc` (即 `TypeScript Compiler`) 來實現的。
  `TypeScript` 程式碼經過它編譯之後，其專屬的關鍵字和表達方式會被 `tsc` 去掉，生成純 `JavaScript` 程式碼。

  `tsc` 有許多設定選項，能調整編譯過程的行為。每個 `TypeScript` 專案都應該建立自己的組態設定檔 (`tsconfig.json`)，好蓋過預設值

  ```json
  {
    "compilerOptions": {
      "target": "es2020",
      "outDir": "./dist",
      "rootDir": "./src",
    }
  } 
  ```

  - #### tsconfig.json 組態選項
    | 名稱             | 說明                                                                                                                   |
    |------------------|-----------------------------------------------------------------------------------------------------------------------|
    | `compilerOption` | 這部分集結了 `TypeScript` 編譯器自身要使用的設定。                                                                          |
    | `target`         | 指定編譯 `JavaScript` 程式碼時，要採用的目標版本。                                                                          |
    | `outDir`         | 指定編譯出來的 `JavaScript` 檔的存放位置。                                                                                 |
    | `rootDir`        | 指定要編譯的 `TypeScript` 檔的存放位置。                                                                                   |
    | `files`          | 指定要編譯的檔案。這會蓋過編譯器預設的行為 (讓編譯器自行搜尋檔案來編譯)。                                                          |
    | `include`        | 以檔名規則指定編譯時要包含哪些檔案。若無特別指定，預設會選擇 `.tx`, `.tsx`, 與 `.d.ts` 副檔名的檔案。                              |
    | `exclude`        | 指定編譯時要排除哪些檔案。                                                                                                 |
    | `compileOnSave`  | 若為 `true`，這是在告訴程式編輯器說，說檔案每次儲存後都要執行 `tsc 編譯器`。不是每個開發環境都支援此功能，更何況 `watch` 功能反而更實用。 |

  - #### 檢查編譯器能存取的檔案
    如果想確認編譯器在進行編譯時找到了哪些檔案，可在 `tsconfig.json` 檔案中的 `compilerOption` 屬性底下加入一行 `"listFiles": true` (啟用 listFiles 設定)，或是直接在命令列執行以下命令：
    ```sh
    tsc --listFiles
    ```

## 5-3 編譯 TypeScript 程式
### 5-3-1 將 TypeScript 編譯為 JavaScript
  `TypeScript` 編譯器在編譯專案時，會檢查 `TypeScript` 程式碼檔案、套用靜態型別等等的檢查，並且刪去 `TypeScript` 語法，以便生成純 `JavaScript` 程式碼。

### 5-3-2 編譯器的錯誤訊息
  `TypeScript` 編譯器會檢查它要編譯的程式碼，確保它符合 `JavaScript` 語言的規範，並套用靜態型別檢查與存取控制關鍵字等功能，遇到錯誤便會在主控台丟出訊息。
  ```ts
  function printMessage(msg: string): void {
    console.log(`Message: ${msg}`);
  }
  printMessage("Hello, TypeScript");
  printMessage(100);    // 傳入型別不正確的引數 (要求字串卻得到數值)
  ```

  範例中的 `printMessage()` 函式對 `msg` 參數加上了型別註記，限制它的參數 `msg` 只能接受 `string(字串)` 資料型別，若將一個數值引數傳給 `msg` 參數，就會讓 `TypeScript` 編譯器跳出錯誤訊息。

  ```sh
  tsc

  src/index.ts:5:14 - error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.
  5 printMessage(100); <-- 錯誤發生位置

  Found 1 error.
  ```

  在預設狀況下，即使 `TypeScript` 編譯器遇到錯誤，它仍會繼續生成 `JavaScript` 程式碼。

  可以在 `tsconfig.json` 檔案中將 `noEmitOnError` 設定為 `true`，即可關閉這個行為。

  ```json
  // \tools\tsconfig.json

  {
    "compilerOptions": {
      "target": "es2020",
      "outDir": "./dist",
      "rootDir": "./src",
      "noEmitOnError": true
    }
  }
  ```

  如此一來，`TypeScript` 編譯器就只有在完全沒有偵測到錯誤時，才會生成 `JavaScript` 程式碼。

### 5-3-3 使用 watch 模式自動監看並編譯程式碼
  如果每次改寫程式碼，都得手動執行一次編譯器，應該很快就會感到厭倦。

  `TypeScript` 編譯器支援所謂的 `watch` 模式，它會監看專案的變化，並且在偵測到檔案變更時，自動編譯。

  在 `tools` 根目錄執行以下指令，開啟編譯器的 `watch` 模式
  ```sh
  tsc --watch
  ```

### 5-3-4 在編譯後自動執行
  `tsc` 編譯器的 `watch` 模式，並不會自動執行編譯完成的程式。

  如果使用的是 `Angular`、`React`、`Vue.js` 等框架來開發專案，`TypeScript` 編譯器會被整合到更大規模的工具鏈當中，也能夠自動執行編譯完成後的程式碼。

  至於獨立專案，則可仰賴一些開源套件來給編譯器加上額外功能，如 `tsc-watch` 套件。
  `tsc-watch` 套件會以 `watch` 模式啟動編譯器，並根據 `tsc` 的編譯結果來自動執行專案。

  請在 `tools` 目錄下執行以下指令，使用 `npx` 啟動安裝於專案內的 `tsc-watch` 套件

  ```sh
  npx tsc-watch --onsuccess "node dist/index.js"
  ```

  `tsc-watch` 會使用安裝在專案內的 `TypeScript` 編譯器來編譯。
  `--onsuccess` 參數的意思是，若編譯過程沒有錯誤時，就執行後面雙引號間的命令。

  > 若對 `tsc-watch` 的其他控制選項有興趣，可[參閱](https://github.com/gilamran/tsc-watch)

  > `TypeScript` 編譯器亦有提供一套 `API`，可用來創造自訂編譯器。[參考](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API)

### 5-3-5 以 NPM 啟動自動編譯器
  可以把指令放進 `package.json` 檔案中的 『`scripts`』項目，能大幅簡化指令。

  ```json
  // \tools\package.json

  {
    "name": "tools",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "start": "tsc-watch --onsuccess \"node dist/index.js\""
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "tsc-watch": "^4.4.0",
      "typescript": "^4.3.5"
    }
  }
  ```

  `package.json` 的 `scripts` 區，可用來撰寫一些指令碼，簡化執行工具的過程。儲存變更後，在 `tools` 目錄裡執行下方指令
  ```sh
  npm start
  ```

## 5-4 設定編譯輸出版本
### 5-4-1 指定要輸出的 `JavaScript` 版本
  在開發階段得以運用較新的 `TypeScript` 功能，又能讓編譯出來的程式在較舊的 `JavaScript` 環境執行 (如舊版瀏覽器)。

  `tsconfig.json` 編譯選項中的 `target` 可用來指定編譯器輸出的 `JavaScript` 版本。

  ```json
  // \tools2\tsconfig.json

  {
    "compilerOptions": {
      "target": "es2020",
      "outDir": "./dist",
      "rootDir": "./src",
      "noEmitOnError": true,
    }
  }
  ```
  > `es2020` 便代表編譯目標為 `ES2020` 版的 `JavaScript`。
  > `ES` 是 `ECMAScript` 的縮寫，近期已改用釋出年份來稱呼。

  下表列出可選擇的版本：
  | 名稱              | 說明                                                                                                                                                                  |
  |-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
  | `es3`             | 輸出符合第3版規範的程式碼 (制定於1999年)，也被視為 `JavaScript` 的最基礎版本。若沒有設定 `target` 屬性，編譯器的預設值就是 `es3`。(第4版被廢棄，沒有推出。)                 |
  | `es5`             | 輸出符合第5版規範的程式碼 (制定於2009年)，主要重點在於改進一致性、提供嚴格模式、`let` 關鍵字等。                                                                          |
  | `es6`<br>`es2015` | 輸出 `ES2015/ES6` 版程式碼 (制定於2015年)。這版提出許多新語法，包括類別、模組、箭頭函式與 `Promise` 物件的支援，若要用 `JavaScript` 開發複雜的應用程式，就至少得使用此版本。 |
  | `es2016`          | 輸出 `ES2016` 程式碼。這個版本替陣列新增 `includes` 方法，並支援 `**` 指數算符。                                                                                         |
  | `es2017`          | 輸出 `ES2017` 程式碼。新功能包括檢視物件與非同步運算的新關鍵字。                                                                                                        |
  | `es2018`          | 輸出 `ES2018` 程式碼。新功能包括展開與其餘運算子、字串處理，以及非同步運算的優化。                                                                                        |
  | `es2019`          | 輸出 `ES2019` 程式碼。新功能包括陣列和`Object` 提供的一些新方法。                                                                                                       |
  | `es2020`          | 輸出 `ES2020` 程式碼。新功能包括 `BigInt` 型別、零值合併算符和 `globalThis` 關鍵字。                                                                                     |
  | `es2021`          | 輸出 `ES2021` 程式碼。新功能包括 `replaceAll()` 函式、邏輯指派算符並改良 `ES2020` 的一些功能。                                                                           |
  | `esNext`          | 採用預定於未來規範版本加入，而安裝的 `TypeScript` 也支援的新功能。注意 `TypeScript` 編譯器支援的新功能，將隨編譯器版本而有所更動，所以得謹慎使用。                         |
  
### 5-4-2 設定編譯時要加入的函式庫
  `tsc --listFiles` 指令會列出編譯器找到的檔案清單，其中包含不少型別宣告檔。這些檔案提供編譯器所需的資訊，包括不同版本的 `JavaScript` 所擁有的功能，以及應用程式在瀏覽器環境執行時能夠擁有的功能，這樣程式就得以透過 `DOM (Document Object Model，文件物件模型)` 的 `API` 來生成與管理 `HTML` 網頁內容。

  `TypeScript` 編譯器會根據 `target` 屬性的設定內容，去尋找它需要的型別資訊，因此當使用比指定版本還新的功能時，就會產生錯誤 (編譯器會找不到辦法在舊版 `JavaScript` 產生對應版本)。

  ```ts
  // \tools2\src\index.ts

  let printMessage = (msg: string): void => console.log(`Message: ${msg}`);
  let message = ("Hello, TypeScript");
  printMessage(message);

  let data = new Map();
  data.set("Bob", "London");
  data.set("Alice", "Paris");
  data.forEach((val, key) => console.log(`${key} lives in ${val}`));
  ```

  `Map` 是 `ES2015` 才加入 `JavaScript` 的功能，它並不存在於我們的組態檔中指定的 `ES5` 版本。因此當儲存這段變更和重新編譯時，編譯器會跳出以下警告訊息，建議將編譯目標改成 `ES2015` 或更晚的版本：

  ```sh
  \tools2 > tsc

  src/index.ts:5:16 - error TS2583: Cannot find name 'Map'. Do you need to change your target library? Try changing the 'lib' compiler option to 'es2015' or later.
  5 let data = new Map();
                   ~~~
  Found 1 error.
  ```

  可用兩種方式解決這個問題。一是把編譯目標改成較新版本的 `JavaScript` (比如錯誤訊息中建議的 `es2015`)，或是在 `compilerOptions` 中透過 `lib` 屬性來改變編譯器要使用的型別宣告檔。`lib` 屬性的值是個陣列，可包含的項目如下表：

  `compilerOptions` 中 `lib` 屬性的選項
  | 名稱                                     | 說明                                                                                                                                                           |
  |------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
  | `es5`、`es2015`、<br>`es2016`、`es2017`、... | 引入這幾個值所對應之版本的定義。舊的命名法同樣可用，所以 `es6` 亦可寫成 `es2015`。                                                                                |
  | `esnext`                                 | 引用 `JavaScript` 預定新增、但尚未正式採用的新功能，其實際內容將隨時間而改變。                                                                                    |
  | `dom`                                    | 引入 `DOM` 文件物件模型的相關定義，`console` 物件也是定義在這裡。網頁應用程式需要依賴它們來操作瀏覽器內的 `HTML` 元素內容。這個設定同樣可用於 `Node.js` 應用程式。 |
  | `dom.iterable`                           | 引入 `DOM API` 的額外相關定義，讓應用程式能走訪 `HTML` 元素。                                                                                                    |
  | `scriptHost`                             | 引入 `Windows Script Host` 的相關定義，以便在 `Windows` 系統自動執行程式。                                                                                       |
  | `webworker`                              | 引入 `web worker` 的相關定義，讓網頁應用程式得以執行背景工作。                                                                                                   |

  也可以透過 `lib` 屬性選擇性地加入特定 `JavaScript` 版本的部分功能。下面列出最常用的部分：
  `compilerOptions` 中 `lib` 屬性常用的個別版本功能：
  | 名稱                                         | 說明                                                     |
  |----------------------------------------------|--------------------------------------------------------|
  | `es2015.core`                                | 加入 `ES2015` 新增到 `JavaScript` 的主要功能的定義。      |
  | `es2015.collection`                          | 加入 `Map` 與 `Set` 集合的定義。                          |
  | `es2015.generator`<br>`es2015.iterable`      | 加入走訪器與產生器的定義。                                |
  | `es2015.promise`                             | 加入 `promise` 非同步處理機制的定義。                     |
  | `es2015.reflect`                             | 加入 `reflection` 功能的定義，可讓我們存取物件屬性和原型。 |
  | `es2015.symbol`<br>`es2015.symbol.wellknown` | 加入 `symbol` 相關的定義。                                |
  | `es2016.array.include`                       | 加入 `ES2016` 陣列的 `include()` 方法。                   |

  > 這些其實就是型別宣告檔的檔名。可以在 [官方Github](https://github.com/microsoft/TypeScript/tree/main/lib) 儲存庫找到完整的型別宣告檔列表。將列表中檔案開頭的 `lib.` 和 副檔名 `.d.ts` 去掉，就是要寫在 `lib` 中的名稱。

  使用
  
## 5-5 常用的編譯器設定
## 5-6 本章總結