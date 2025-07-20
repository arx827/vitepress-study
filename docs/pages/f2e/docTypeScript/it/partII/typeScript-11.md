---
title: IT邦 - 讓 TypeScript 成為你全端開發的 ACE !
---

# 11 常用 ECMAScript 標準語法 非同步程式設計篇
## 11.1 同步與非同步的概念
### 11.1.1 同步的概念 Synchronous
  「`同步`」表面上看起來是指多程式同時執行，很容易被誤會，實際上它是指：
  > 程式 `執行的過程` 與 `讀到的程式碼` 呈現同步狀態。

  > 程式會一行一行依照順序執行。

  > `同步的程式具有阻塞性質 (Blocking)`。

  由於程式碼在同步狀態是依序執行地，也就是說前一行若還沒執行完畢，絕對會卡在該行；一直到該行程式碼完成時，才會讀取下一行程式碼繼續執行。

  `同步程式碼執行順序不變的特性`，因此也就會延伸出程式有可能因為某行的執行過程很繁複，造成程式 `阻塞` 的可能性。

### 11.1.2 非同步的概念 Asynchronous
  儘管大多數的程式可以按照同步程式碼的概念實踐出來，但仍然會有些應用是不太可能按照同步的特性實現，有可能的原因是實踐效果不理想、成本太大、亦或者是有很大的機率會碰到 `程式阻塞` 的問題，造成 `程式沒有效率`。

  前端的程式設計，很常遇到處理使用者與瀏覽器介面複雜的互動機制，這就是 `事件處理`，或者是 `監聽事件 (Event Listener) 的註冊`。

  非同步的程式在 `JavaScript` 非常常見，在 `JavaScript` 裡註冊一個事件的語法使用的是 `addEventListener` 的方法：
  ```ts
  /* 假設網頁 HTML 裡有按鍵元素： <button id="btn">...</button> */
  const $btn = document.getElementById('btn');

  if($btn === undefined) {
    throw new Error('Button is not found');
  }

  console.log('Before event registered');

  const clickEventHandler = function () {
    console.log('Click event triggered!');
  };

  /* 事件的註冊，填入回呼函式 clickEventHandler */
  $btn.addEventListener('click', clickEventHandler);

  console.log('Event registered!');
  ```

  程式的執行過程中，印出來的結果一定會是以下的順序：
  ```ts
  Before event registered
  Event registered!
  Click event triggered!  // 如果使用者有按按鈕的話，按幾次就會印出幾次
  Click event triggered!
  Click event triggered!
  ```

  以上的程式碼，儘管看似函式 `clickEventHandler` 會再印完 `Before event registered` 字串後立馬執行，但是實際上它以函式物件形式，作為監聽按鈕事件之接收者 (Handler) 的角色；因此執行順序就會隨著使用者按下按鈕後才會觸發函式裡的程式，而且按下幾次，就會觸發幾次，所以這裡相對來說 `並沒有按照程式碼一行一行的順序執行`，理所當然就是非同步的執行狀態。

  而且非同步程式並沒有阻塞問題，註冊完事件之後，`JavaScript` 的背景會監控使用者有沒有觸發此事件，然後再去排定事件觸發歷史，呼叫對應的回呼函式。

  #### 同步與非同步的概念差異 Synchronous v.s. Asynchronous
  - 1. 同步的概念是指程式會按照順序依序執行，但遇到複雜需要花時間的運算過程時，就會出現 `阻塞 (Blocking)` 的情形。
  - 2. 非同步的概念則是程式 `不一定按照順序執行`，有可能會將某些程式放在背景執行，因此通常要避免阻塞的狀況，非同步程式的設計就會變得比較重要。

### 11.1.3 回呼函式地獄 Callback Hell
  非同步的程式結構，以 `回呼函式 (Callback Function)` 的使用最為明顯，畢竟用函式作為物件傳遞時，可以選擇在程式的任何一個時刻執行該函式 - 藉由回呼函式可以輕易改變一段程式碼執行的順序。

  ```ts
  console.log('Before execution');

  setTimeout(function callback() {
    console.log('Execute Callback');
  }, 1000);

  console.log('After execution');

  // => Before execution
  // => After execution

  // 以下這一段會在程式執行約 1000ms 後出現
  // => Execute Callback
  ```

  回呼函式很容易使得程式碼行程巢狀結構，通常一兩層看起來還好，但如果超過三層以上，可能就得考慮程式碼重構的必要性。
  ```ts
  /* 回呼函式中的回呼函式中的回呼函式中的回呼函式中的回呼函式 */
  setTimeout(function () {
    console.log('Layer 1');

    setTimeout(function() {
      console.log('Layer 2');

      setTimeout(function() {
        console.log('Layer 3');

        setTimeout(function() {
          console.log('Layer 4');

          setTimeout(function() {
            console.log('Layer 5');
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);

  // => Layer 1 <- 約第 1 秒出現
  // => Layer 2 <- 約第 2 秒出現
  // => Layer 3 <- 約第 3 秒出現
  // => Layer 4 <- 約第 4 秒出現
  // => Layer 5 <- 約第 5 秒出現
  ```

  為了能夠輕易解決掉這個俗稱回呼函式地獄 (有時候你會聽到厄運金字塔，也就是 `Pyramid of Doom` 這個稱呼) 的問題，`ECMAScript` 的標準發展到現在，提供了一系列好用的工具幫助我們解決它。

## 11.2 ES6 Promise 物件
  由於 `Promise` 屬於 `ES6` 標準下的物件，因此在 `TypeScript` 設定檔 - 也就是 `tsconfig.json` 裡，必須要在 `lib` 設定部分 (預設只有 `dom`)，新增 `es6` (或 `es2015`) 這個選項喔！
  ```json
  {
    "compileOptions": {
      // ... 其他 TypeScript 編譯器選項
      "lib": ["dom", "ES2015"],
      // ... 其他 TypeScript 編譯器選項
    }
  }
  ```

### 11.2.1 ES6 Promise 語法基礎
  `Promise` 物件是整個非同步程式設計中，最基礎的單位，最簡單的範例程式碼如下：
  ```ts
  let p = new Promise(function (resolve, reject) {
    resolve('Hello Promise!');
  });

  /**
   * 若 p 內部的程式執行過程沒有問題，並且呼叫了 resolve 函式時，
   * 會執行 then 裡面的回呼函式
   */
  p.then(function (value) {
    console.log(value);
  });

  /**
   * 若 p 內部的程式執行過程出現錯誤，或者是呼叫了 reject 函式時，
   * 會執行 catch 裡面的回呼函式
   */
  p.catch(function (error) {
    console.log(error);
  });
  ```

  以上的程式碼，`p` 內部的程式會直接呼叫 `resolve` 方法並且傳入特定的值 (也就是字串 `Hello Promise!`)；當 `resolve` 方法被呼叫時，`p.then` 裡的回呼函式就會執行，也就是將 `resolve` 函式傳遞的東西印出來。

  但要是 `p` 內部的程式改成呼叫 `reject` 方法時：
  ```ts
  let p = new Promise(function (resolve, reject) {
    reject('Errored!');     // 從 resolve 改成 reject
  });
  ```

  就會執行 `p1.catch` 裡的回呼函式，也就是把遇到的錯誤訊息印出來。

  以上的程式碼可以用更簡潔的方式表達：
  ```ts
  new Promise(function (resolve, reject) {
    resolve('Hello Promise!');
  }).then(function (value) {
    console.log(value);
  }).catch(function (error) {
    console.log(error);
  })
  ```

  注意：`resolve` 或 `reject` `可以被改名`，畢竟它是作為 `Promise` 物件裡傳入函式中的參數，所以你可能會看到有程式碼取得更簡潔，例如 `res` 代表 `resolve` 等；

### 11.2.2 Promise 串接鏈 Promise Chain
  `Promise` 還有另一個重要性質是 - 在 `then` (或者是 `catch`) 方法裡，`傳入的回呼函式可以回傳另一個 Promise 物件`，使得 `Promise` 鏈可以不停地串接下去。

  假設有一個函式 `resolveAfter` 專門回傳一個會在若干時間 `resolve` 的 `Promise` 物件，其定義方式如下：
  ```ts
  /**
   * resolveAfter 會回傳一個 Promise 物件，
   * 該 Promise 物件會在特定時間才會 resolve
   */
  function resolveAfter(milliseconds: number) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(`Promise resolved after ${milliseconds}ms!`);
      }, milliseconds)
    })
  }
  ```

  假設如果想要實現一連串 `Promise` 依照順序執行的程式，一種寫法是：
  ```ts
  resolveAfter(2000)
    .then(function (value) {
      console.log(value);

      /* 執行下一個 Promise 物件 */
      resolveAfter(3000).then(function () => {
        console.log(value);

        /* 再執行下一個 Promise 物件 */
        resolveAfter(3000).then(function () => {
          console.log(value);
        })
      })
    })

    // => Promise resolved after 2000ms!  // 程式從開市執行到這裡約 2 秒時間
    // => Promise resolved after 3000ms!  // 程式從開市執行到這裡約 5 秒時間
    // => Promise resolved after 1000ms!  // 程式從開市執行到這裡約 6 秒時間
  ```

  然而，以上的寫法當然又是重蹈回呼函式地獄的覆轍，因此 `Promise` `允許你改寫成串接的形式`：
  ```ts
  resolveAfter(2000)
    .then(function (value) {
      console.log(value);

      /* 回傳另一個 Promise 物件 */
      return resolveAfter(3000);
    })
    .then(function () {
      console.log(value);

      /* 再回傳另一個 Promise 物件 */
      return resolveAfter(1000);
    })
    .then(function (value) {
      console.log(value);
    })

    // => Promise resolved after 2000ms!  // 程式從開市執行到這裡約 2 秒時間
    // => Promise resolved after 3000ms!  // 程式從開市執行到這裡約 5 秒時間
    // => Promise resolved after 1000ms!  // 程式從開市執行到這裡約 6 秒時間
  ```

  這樣攤平化後，就可以防止巢狀的部分繼續長下去。

### 11.2.3 Promise 物件狀態機 State Machine
  `Promise` 物件的狀態分成三種：`Pending` (執行中，或等待結果狀態)、`Resolved` (完成) 以及 `Rejected` (失敗)。

  理所當然地，`Pending` 狀態就是在等待最後到底是被 `resolve` 函式或 `reject` 函式呼叫，而 `resolve` 函式就會觸發 `Resolved` 狀態；相對地，只要呼叫 `reject` 函式，就會觸發 `Rejected` 狀態。

  在 `then` 或 `catch` 的回呼函式裡，只要回傳新的 `Promise` 物件，又會再以該 `Promise` 物件重新回到 `Pending` 狀態。

### 11.2.4 Promise 物件為泛用型別
  而在 `TypeScript` 的型別系統裡，`Promise` 物件本身是一種泛用類型；

  `Promise` 物件主要有一個型別參數，用途是 `註記 resolve 函式回傳的型別值`。

  譬如，`Promise` 物件若在建立時，註記型別參數為字串型別時，`resolve` 函式回傳的東西也必須是字串型別值：
  ```ts
  /* Promise<string> 必須 resolve 字串型別值 */
  new Promise<string>(function (resolve, reject) {
    resolve('Hello Promise!');
  })
  ```

  如果 `resolve` 函式輸入非字串型別值，會告誡你必須傳入字串型別或 `PromiseLike<string>` 型別的值。

  如果型別不去註記，那麼 `Promise` 物件會被推論為 `Promise<unknown>`。

  這代表著如果要在 `then` 的回呼函式裡使用 `resolve` 所傳入的值，就必須積極註記，畢竟 `unknown` 型別，為的就是強迫開發者主動斷言它的型別。
  ```ts
  p.then(function(value) {
    /* 使用 as <TYPE> 進行型別斷言 */
    console.log((value as string).toUpperCase());
  })
  ```

  #### ES6 Promise 狀態轉換
  - 1. 通常想要將同步程式轉換成非同步程式時，可以將該程式包裝至 `Promise` 物件裡。
  - 2. `Promise` 在 `建構的那一瞬間就會轉換到 Pending 狀態`。
  - 3. `Promise` 的建構子函式需要傳入一個回呼函式，裡面包含兩個參數；第一個參數為非同步程式執行完畢時，用以轉換到 `Resolved` 狀態的函式；第二個則是如果非同步函式出現錯誤時，可以呼叫並且轉換到 `Rejected` 狀態的函式。
  - 4. 當轉換到 `Resolved` 狀態時，`Promise` 物件若有 `then` 方法，就會執行內部的函式，並且附帶 `Resolve` 的參數值。
  - 5. 當轉換到 `Rejected` 狀態時，`Promise` 物件若有 `catch` 方法，就會執行內部的函式，並且附帶 `Reject` 的參數值。
  - 6. `Promise` 物件的 `then` (與 `catch`) 方法內的回呼函式，若回傳新的 `Promise` 物件，則會以該物件為主體，可以繼續串接 `then` (與 `ccatch`) 方法下去，這個特性被稱之為 `Promise` 串接練。
  
### 11.2.5 常用的 Promise 物件 API
  單純想要將某個值轉成 `Promise` 的格式，直接進行 `resolve` (亦或者是 `reject`)：
  ```ts
  /* 直接 Resolve */
  let p1 = new Promise(function (resolve, reject) {
    resolve('Hello Promise!');
  })

  /* 直接 Reject */
  let p2 = new Promise(function (resolve, reject) {
    reject('Error from Promise!');
  })
  ```

  其實可以用 `Promise` 物件提供的靜態方法 `Promise.resolve` (以及 `Promise.reject`) 簡化以上的寫法：
  ```ts
  /* 直接 Resolve */
  let p1 = Promise.resolve('Hello Promise!')
  /* 直接 Reject */
  let p2 = Promise.reject('Error from Promise!');
  ```

  這就是將原本是同步程式處理的值，改以非同步方式將值包裝在 `Promise` 的簡化語法。

  另外，有時候希望程式執行的方式並不是 `序列 (Series)` 的方式(也就是 `Promise` 串接鏈)，而是 `並列 (Parallel)` 的方式執行；這時，可以採用 `Promise.all` 這個靜態方法，傳入多個不同的 `promise` 物件，並且會 `等待所有 Promise 進入 Resolved 狀態，才會完整地 Resolve`。
  ```ts
  /* 全部一起等待完畢後一起 Resolve */
  Promise.all([
    resolveAfter(3000),     // 3秒後 Resolve
    resolveAfter(1000),     // 1秒後 Resolve
    resolveAfter(5000),     // 5秒後 Resolve
  ]).then(function (result) {
    console.log(result);
  });

  // 約 5000ms 會印出以下訊息
  // => [
  //     'Promise resolved after 3000 ms!',
  //     'Promise resolved after 1000 ms!',
  //     'Promise resolved after 5000 ms!',
  //    ]
  ```

  另外，`Promise.all` 由於是等待多個 `Promise` 物件同時 `Resolve`，因此只要其中一個 `Promise` 物件進入 `Rejected` 狀態，就等於整個 `Promise` 會進入 `Rejected` 狀態：
  ```ts
  /* 全部一起等待完畢一起 Resolve */
  Promise.all([
    resolveAfter(3000),         // 3 秒後 Resolve
    resolveAfter(1000),         // 1 秒後 Resolve
    resolveAfter(5000),         // 5 秒後 Resolve
    Promise.reject('Rejected'), // 整個會被 Reject 掉
  ]).then(function (result) {
    console.log(result);
  }).catch(function (error) {
    console.log(`Error: ${error}`);
  });

  // 立即印出以下訊息
  // => Error: Rejected
  ```

  另外，由於 `Promise.all` 會將所有的值進行 `Resolve`，`then` 裡面傳的回呼函式，推論結果會是元祖型別的 `Promise` 物件。
  ```ts
  Promise.all([
    Promise.resolve(123),               // 為 Promise<number> 型別
    Promise.resolve('Hello world'),     // 為 Promise<string> 型別
    Promise.resolve(true),              // 為 Promise<boolean> 型別
  ]).then(function (result) {
    /* result 的型別推論為 [number, string, boolean] 型別 */
    console.log(result);
  })
  ```

  另外，還有一種 `Promise API` 為 `Promise.race`，代表所有傳入的 `Promise` 物件會進行比賽，最先被 `Resolve` 的 `Promise` 就會以該 `Resolve` 結果作為整個 `Promise.race` 的結果。
  ```ts
  /* 所有 Promise 比賽看誰最先被 Resolve */
  Promise.race([
    resolveAfter(3000),   // 3 秒後 Resolve
    resolveAfter(1000),   // 1 秒後 Resolve
    resolveAfter(5000),   // 5 秒後 Resolve
  ]).then(function (result) {
    console.log(result);
  });

  // 沒有任何意外的話，會是 1000ms 的 Promise 物件最先被 Resolve
  // `Promise resolved after 1000ms!`
  ```

  而 `Promise.race` 既然可能會有任何一個 `Promise` 被 `Resolve`，因此 `then` 方法裡的回呼函式的值，推論結果為所有傳入 `Promise` 的 `Resolve` 型別進行 `聯集 (Union)` 複合的結果。
  ```ts
  Promise.race([
    Promise.resolve(123),               // 為 Promise<number> 型別
    Promise.resolve('Hello world'),     // 為 Promise<string> 型別
    Promise.resolve(true),              // 為 Promise<boolean> 型別
  ]).then(function (result) {
    /* result 的型別推論為 number | string | boolean 型別 */
    console.log(result);
  })
  ```

  #### ES6 Promise 常見 API
  - 1. `Promise.resolve` 可以回傳一個立即進入 `Resolved` 狀態的 `Promise` 物件。
  - 2. `Promise.reject` 可以回傳一個立即進入 `Rejected` 狀態的 `Promise` 物件。
  - 3. `Promise.all` 可以傳入一系列的 `Promise` 物件，並且待所有物件進入 `Resolved` 狀態時，最外層的 `Promise.all` 回傳的 `Promise` 才會正式進入 `Resolved` 狀態；否則為 `Rejected` 狀態。
  - 4. `Promise.race` 則是傳入一系列的 `Promise` 物件，`最先進入 Resolved (或 Rejected) 狀態` 的 `Promise` 物件，就會以該 `Promise` 的狀態作為整個 `Promise.race` 的狀態。 

## 11.3 ES7 非同步函式 Asynchronous Functions
### 11.3.1 以 Promise 為基礎的函式
  普通的 JavaScript 函式 以及 非同步函式差異性：
  ```ts
  /* 普通函式宣告 */
  function syncMessage() {
    return 'Sync: Hello World!';
  }

  /* 非同步函式宣告時，使用 async 關鍵字 */
  async function asyncMessage() {
    return 'Async: Hello World!';
  }
  ```

  以上面的例子來說，普通函式的推論結果是 `() => string`，輸出的型別可以經由 `return` 敘述式回傳的型別來推論；然而，`asyncMessage` 儘管也是回傳字串型別的函式，可是推論結果就不是字串型別。

  也就是，使用 非同步函式有點像是在 `呼叫一個產生 Promise 物件的函式`，因此可以接上 `then` (或者是 `catch`) 方法。
  ```ts
  asyncMessage()
    .then(function (value) {
      console.log(value);
    })

  // => Async: Hello World!
  ```

  因此，`asyncMessage` 的宣告等效於以下普通函式的寫法，只是回傳的東西包覆一層 `Promise` 物件，由於沒有註記時會被認定為 `Promise<unknown>`型別，因此 `回傳的Promise 物件，必須註記型別才能完全等效`。
  ```ts
  /* 非同步函式 asyncMessage 等效的宣告手法 */
  function asyncMessage() {
    return new Promise<string>(function (resolve, reject) {
      resolve('Async: Hello World!')
    })
  }
  ```

### 11.3.2 自由操作 Promise 的函式
  非同步函式的另一個關鍵字 `await` 可以負責將 `Promise` 物件 `resolve` 出來的結果拔出來。
  ```ts
  resolveAfter(2000)
    .then(function(value) {
      console.log(value);
      return resolveAfter(3000);
    })
    .then(function(value) {
      console.log(value);
      return resolveAfter(1000);
    })
    .then(function(value) {
      console.log(value);
    })
  ```

  可以改寫為：
  ```ts
  async function example() {
    const result1 = await resolveAfter(2000);
    console.log(result1);

    const result2 = await resolveAfter(3000);
    console.log(result2);

    const result3 = await resolveAfter(1000);
    console.log(result3);
  }

  example().then(function (value) {
    console.log(value);
  })
  ```

  要注意的一件事情是，`await` 關鍵字接的東西是 `Promise` 相關的物件，畢竟非同步函式裡，通常 `需要被等待的東西是另一個非同步函式`。

### 11.3.3 輕鬆進行 `Promise` 例外處理的函式
  如果想要幫 `Promise` 進行例外處理 (Exception Handling) 相關的事物，會非常麻煩：
  ```ts
  /* 回傳一半機率會 Resolve 或 Reject 的 Promise 物件 */
  function possiblyReject(message: string) {
    return new Promise(function (resolve, reject) {
      if (Math.random() > 0.5) {
        resolve(`Resolved: ${message}`);
      } else {
        reject(`Rejected: ${message}`);
      }
    })
  }

  possiblyReject('Promise 1')
    .then(function() {
      return possiblyReject('Promise 2');
    })
    .catch(function(error) {
      /* 處理錯誤必須要集體處理 */
      if (error === 'Rejected: Promise 1') {
        // Promise 1 失敗時的處理
      } else {
        // Promise 2 失敗時的處理
      }
    })
  ```

  以上的程式碼，會發現 `Promise` 串接鏈 有個相對來說比較不好的地方，例外處理的部分會根據串接不同 `Promise` 物件會需要進行分流的狀態。這樣寫真的會很痛苦，因此可以將以上的範例程式碼，運用例外處理的 `try...catch...` 語法，將其改寫成以下的等效寫法：
  ```ts
  async function example() {
    try {
      await possiblyReject('Promise 1');
    } catch (error) {
      console.log(`${error}`);
      return;
    }

    try {
      await possiblyReject('Promise 2');
    } catch (error) {
      console.log(`${error}`);
      return;
    }
  }
  ```

  以上的程式碼除了可讀性高以外，`寫起來的樣子跟同步的程式碼很像`；儘管它描述的是非同步的行為，但是它會按照順序執行，在 `await` 關鍵字部分等待非同步程式的執行結果。

## [本章練習](../A/typeScript-A.html#第十一章-常用-ecmascript-標準語法-非同步程式設計篇)