---
title: '[React官網] React 19.2 教學文件'
---

# 用 State 響應輸入
  `React` 控制 `UI` 的方式是宣告式的。你不必直接控制 `UI` 的各個部分，只需要聲明元件可以處於的不同狀態，並根據使用者的輸入在它們之間切換。這與設計師對 `UI` 的思考方式很相似。

  :::info 你會學習到
  - 了解聲明式UI 程式設計與命令式UI 程式設計有何不同
  - 了解如何列出元件可能處於的不同視圖狀態
  - 了解如何在程式碼中觸發不同視圖狀態的變化
  :::

## 聲明式 UI 與命令式 UI 的比較
  - #### 命令式 UI 程式設計
    - ##### 定義
      開發者必須針對要發生的事情，寫出明確的命令去直接操作 `DOM` 元素（例如：`啟用`、`關閉`、`顯示`或`隱藏`某個元件）。

    - ##### 缺點
      在複雜的系統中，管理 `UI` 的困難度會呈指數級增長。添加新功能或新 `UI` 元素時，必須非常小心地檢查所有既有程式碼，極易引入 `Bug`（例如忘記隱藏或顯示某個元素）。

  - #### 聲明式 UI 程式設計（React 的核心思維）
    - ##### 定義
      開發者不必事無巨細地告訴電腦「如何」去更新 `UI`。你只需要聲明你想要顯示的內容（視圖狀態），`React` 就會自動計算並得出該如何更新 `DOM`。

## 聲明式地考慮 UI
  要在 `React` 中以聲明式思維重新實現一個 `UI`，可以遵循以下五個步驟：
  1. 定位你的元件中不同的視圖狀態
  2. 確定是什麼觸發了這些 `state` 的改變
  3. 表示記憶體中的 `state`（需要使用 `useState` ）
  4. 刪除任何不必要的 `state` 變數
  5. 連線事件處理函數去設定 `state`

  - ### 步驟 1：定位組件中不同的視圖狀態
    開發者需要先視覺化 UI 界面中，用戶可能看到的所有不同「狀態」（State）：
    - `無資料（Empty）`：表單有一個不可用狀態的「提交」按鈕。
    - `輸入中（Typing）`：表單有一個可用狀態的「提交」按鈕。
    - `提交中（Submitting）`：表單完全處於不可用狀態，載入動畫出現。
    - `成功時（Success）`：顯示「成功」的訊息，而非表單。
    - `錯誤時（Error）`：與輸入狀態類似，但會多出錯誤訊息。

    - #### 開發技巧
      在書寫任何邏輯之前，可以先建立 `「模擬狀態」（Mock States）`。透過傳入固定的 `status` 屬性（如 `status = 'success'`）來快速迭代與預覽各種狀態下的 `UI` 外觀。這種獨立展示多個視圖狀態的頁面通常被稱為 `「Living Styleguide」` 或 `「Storybook」`。

      ```jsx
      // App.js
      import Form from './Form.js';

      let statuses = [
        'empty',
        'typing',
        'submitting',
        'success',
        'error',
      ];

      export default function App() {
        return (
          <>
            {statuses.map(status => (
              <section key={status}>
                <h4>Form ({status}):</h4>
                <Form status={status} />
              </section>
            ))}
          </>
        );
      }
      ```

      ```jsx
      // Form.js
      export default function Form({ status }) {
        if (status === 'success') {
          return <h1>That's right!</h1>
        }
        return (
          <form>
            <textarea disabled={
              status === 'submitting'
            } />
            <br />
            <button disabled={
              status === 'empty' ||
              status === 'submitting'
            }>
              Submit
            </button>
            {status === 'error' &&
              <p className="Error">
                Good guess but a wrong answer. Try again!
              </p>
            }
          </form>
        );
      }
      ```

       ![reactDev_07_01_01](/pages/f2e/docReact/reactDev/imgs/07/reactDev_07_01_01.png)

  - ### 步驟 2：確定是什麼觸發了這些狀態的改變
    - #### 狀態的更新可以由兩種輸入源觸發：
      - 人為輸入：點擊按鈕、在表單中輸入內容、導航到連結（通常需要綁定事件處理常式）。
      - 電腦輸入：網路請求得到回應、定時器被觸發、載入一張圖片。

    - #### 狀態模擬
      - `改變輸入框中的文字時`（人為）應該根據輸入框的內容是否為空值，從而決定將表單的狀態從 `空值` 狀態切換到 `輸入中` 或切換回原狀態。
      - `點擊提交按鈕時`（人為）應該將表單的狀態切換到 `提交中` 的狀態。
      - `網路請求成功後`（電腦）應該將表單的狀態切換到 `成功` 的狀態。
      - `網路請求失敗後`（電腦）應該將表單的狀態切換到 `失敗` 的狀態，同時，顯示錯誤訊息。

    - #### 開發技巧
      在寫程式碼之前，可以在紙上將每個狀態畫成圓圈，並用箭頭表示狀態之間的轉換，這能幫助你在動工前抓出許多邏輯 `Bug`。

      ![reactDev_07_01_02](/pages/f2e/docReact/reactDev/imgs/07/reactDev_07_01_02.webp)

  - ### 步驟 3：透過 useState 表示記憶體中的 state
    - #### 原則
      讓 `狀態（State）` 變數盡可能減少，因為更複雜的結構會產生更多 `Bug`。

    - #### 實踐
      先從絕對必須存在的狀態開始，例如儲存輸入內容的 `answer` 與儲存錯誤訊息的 `error`。

      ```jsx
      const [answer, setAnswer] = useState('');
      const [error, setError] = useState(null);
      ```

  - ### 步驟 4：刪除任何不必要的 state 變數
    為了避免狀態內容重複、同步出錯或產生歧義，可以透過以下三個問題來重構與精簡狀態結構，防止在記憶體中出現不對應任何有效 UI 的「不可能狀態」：
    - `這個 state 是否會導致矛盾？` （例如 `isTyping` 和 `isSubmitting` 不能同時為 `true`。解法：合併成一個單一的字串狀態 status，其值只能是 'typing'、'submitting' 或 'success' 之一）。
    - `相同的信息是否已經在另一個 state 變數中存在？` （例如 `isEmpty` 和 `isTyping` 是矛盾且重複的，可以直接移除 `isEmpty`，改用計算屬性 `message.length === 0` 來判斷）。
    - `你是否可以通過另一個 state 變數的相反值得到相同的信息？` （例如 `isError` 是多餘的，因為可以直接檢查 `error !== null`）。

    - #### 進階思維
      如果有多個狀態變數之間存在複雜的連動關係，可以考慮將狀態提取到一個 `Reducer` 中，將多個狀態變數合併為一個物件，從而鞏固所有相關的交互邏輯。

  - ### 步驟 5：連接事件處理函數以設置 state
    最後一步是建立事件處理常式，將使用者的行為或電腦的響應與 `setAnswer`、`setStatus` 等狀態設定函式進行綁定。

    ```jsx
    import { useState } from 'react';

    export default function Form() {
      const [answer, setAnswer] = useState('');
      const [error, setError] = useState(null);
      const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'

      if (status === 'success') {
        return <h1>That's right!</h1>
      }

      async function handleSubmit(e) {
        e.preventDefault();
        setStatus('submitting');
        try {
          await submitForm(answer);
          setStatus('success');
        } catch (err) {
          setStatus('typing');
          setError(err);
        }
      }

      function handleTextareaChange(e) {
        setAnswer(e.target.value);
      }

      return (
        <>
          <h2>City quiz</h2>
          <p>
            In which city is there a billboard that turns air into drinkable water?
          </p>
          <form onSubmit={handleSubmit}>
            <textarea
              value={answer}
              onChange={handleTextareaChange}
              disabled={status === 'submitting'}
            />
            <br />
            <button disabled={
              answer.length === 0 ||
              status === 'submitting'
            }>
              Submit
            </button>
            {error !== null &&
              <p className="Error">
                {error.message}
              </p>
            }
          </form>
        </>
      );
    }

    function submitForm(answer) {
      // Pretend it's hitting the network.
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let shouldError = answer.toLowerCase() !== 'lima'
          if (shouldError) {
            reject(new Error('Good guess but a wrong answer. Try again!'));
          } else {
            resolve();
          }
        }, 1500);
      });
    }
    ```

## 重點複習（Recap）
  - 聲明式程式設計意味著為每個視圖狀態聲明 UI，而非細緻地用指令去控制 UI（命令式）。
  - 當開發一個元件時的 5 大步驟：
    1. 寫出組件中所有的視圖狀態。
    2. 確定是什麼觸發了這些狀態的改變。
    3. 透過 useState 模組化記憶體中的狀態。
    4. 刪除任何不必要的狀態變數。
    5. 連接事件處理常式去設置狀態。

## 挑戰（Challenges）
  - #### 1. 新增和刪除一個 CSS class
    - 嘗試實現點擊圖片時，刪除外部 `<div>` 的 CSS class `background--active`，並將 `picture--active` 的 CSS class 加入到 `<img>` 上。當再次點擊背景圖片時將恢復最開始的 CSS class。

      ```jsx
      export default function Picture() {
        return (
          <div className="background background--active">
            <img
              className="picture"
              alt="Rainbow houses in Kampung Pelangi, Indonesia"
              src="https://react.dev/images/docs/scientists/5qwVYb1.jpeg"
            />
          </div>
        );
      }
      ```

    - ##### 解答
      這個元件有兩個視圖狀態：當圖片處於啟動狀態時以及當圖片處於非啟動狀態時：
      - `當圖片處於啟動狀態時`，CSS class 是 `background` 和 `picture` `picture--active`。
      - `當圖片處於非啟動狀態時`，CSS class 是 `background` `background--active` 和 `picture`。

      ```jsx
      import { useState } from 'react';

      export default function Picture() {
        const [isActive, setIsActive] = useState(false);

        let backgroundClassName = 'background';
        let pictureClassName = 'picture';
        if (isActive) {
          pictureClassName += ' picture--active';
        } else {
          backgroundClassName += ' background--active';
        }

        return (
          <div
            className={backgroundClassName}
            onClick={() => setIsActive(false)}
          >
            <img
              onClick={e => {
                e.stopPropagation();
                setIsActive(true);
              }}
              className={pictureClassName}
              alt="Rainbow houses in Kampung Pelangi, Indonesia"
              src="https://react.dev/images/docs/scientists/5qwVYb1.jpeg"
            />
          </div>
        );
      }
      ```

  - #### 2. 個人資訊編輯器
    - 這個表單在兩種模式間切換：`編輯模式`，你可以看到輸入框；`檢視模式`，你只能看到結果。
    - 按鈕的標籤會根據你所處的模式在 `「編輯」` 和 `「儲存」` 兩者中切換。
    - 當你改變輸入框的內容時，歡迎資訊會最下面即時更新。

    你的任務是在下方的沙盒中用 React 再次實現它。為了方便，標籤已經轉換為 JSX，但你需要讓它像原版一樣顯示和隱藏輸入框。

    - ##### 解答
      ```jsx
      import { useState } from 'react';

      export default function EditProfile() {
        const [isEditing, setIsEditing] = useState(false);
        const [firstName, setFirstName] = useState('Jane');
        const [lastName, setLastName] = useState('Jacobs');

        return (
          <form onSubmit={e => {
            e.preventDefault();
            setIsEditing(!isEditing);
          }}>
            <label>
              First name:{' '}
              {isEditing ? (
                <input
                  value={firstName}
                  onChange={e => {
                    setFirstName(e.target.value)
                  }}
                />
              ) : (
                <b>{firstName}</b>
              )}
            </label>
            <label>
              Last name:{' '}
              {isEditing ? (
                <input
                  value={lastName}
                  onChange={e => {
                    setLastName(e.target.value)
                  }}
                />
              ) : (
                <b>{lastName}</b>
              )}
            </label>
            <button type="submit">
              {isEditing ? 'Save' : 'Edit'} Profile
            </button>
            <p><i>Hello, {firstName} {lastName}!</i></p>
          </form>
        );
      }
      ```

  - #### 3. 不使用 React 去重構命令式的解決方案
    ```jsx
    let firstName = 'Jane';
    let lastName = 'Jacobs';
    let isEditing = false;

    function handleFormSubmit(e) {
      e.preventDefault();
      setIsEditing(!isEditing);
    }

    function handleFirstNameChange(e) {
      setFirstName(e.target.value);
    }

    function handleLastNameChange(e) {
      setLastName(e.target.value);
    }

    function setFirstName(value) {
      firstName = value;
      updateDOM();
    }

    function setLastName(value) {
      lastName = value;
      updateDOM();
    }

    function setIsEditing(value) {
      isEditing = value;
      updateDOM();
    }

    function updateDOM() {
      if (isEditing) {
        editButton.textContent = 'Save Profile';
        hide(firstNameText);
        hide(lastNameText);
        show(firstNameInput);
        show(lastNameInput);
      } else {
        editButton.textContent = 'Edit Profile';
        hide(firstNameInput);
        hide(lastNameInput);
        show(firstNameText);
        show(lastNameText);
      }
      firstNameText.textContent = firstName;
      lastNameText.textContent = lastName;
      helloText.textContent = (
        'Hello ' +
        firstName + ' ' +
        lastName + '!'
      );
    }

    function hide(el) {
      el.style.display = 'none';
    }

    function show(el) {
      el.style.display = '';
    }

    let form = document.getElementById('form');
    let editButton = document.getElementById('editButton');
    let firstNameInput = document.getElementById('firstNameInput');
    let firstNameText = document.getElementById('firstNameText');
    let lastNameInput = document.getElementById('lastNameInput');
    let lastNameText = document.getElementById('lastNameText');
    let helloText = document.getElementById('helloText');
    form.onsubmit = handleFormSubmit;
    firstNameInput.oninput = handleFirstNameChange;
    lastNameInput.oninput = handleLastNameChange;
    ```
