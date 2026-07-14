---
title: '[React官網] React 19.2 教程'
---

# 編輯器設定
  正確的編輯器配置可以讓開發事半功倍，並且還可以在編碼時幫你提示錯誤！如果這是你第一次配置編輯器，或者想對現有編輯器進行調整，我們有一些建議可供參考。

  :::info 你將學到
  - 最受歡迎的編輯器是哪些
  - 如何自動格式化你的代碼
  :::

## 你的編輯器
  [VS Code](https://code.visualstudio.com/) 是現今最流行的編輯器之一。它擁有龐大的擴充功能市場，同時可以與 `GitHub` 等流行服務完美集成。
  下面列出的大多數功能都可以作為擴充功能添加到 `VS Code` 中，使其具有極高的可配置性！

  `React` 社群中其他較為流行的文本編輯器包括：
  - [WebStorm](https://www.jetbrains.com/webstorm/)：專為 `JavaScript` 設計的集成開發環境（IDE）。
  - [Sublime Text](https://www.sublimetext.com/)：支持 `JSX` 和 `TypeScript`，內置語法高亮和代碼自動補全功能。
  - [Vim](https://www.vim.org/)：一個高度可配置的文本編輯器，可以非常高效地創建和更改任何類型的文本。它作為 `“vi”` 包含在大多數 `UNIX` 系統和 `Apple OS X` 中。

## 推薦的文本編輯器功能
  有些編輯器內置了這些功能，但某些編輯器可能需要添加擴充功能。你需要確認你的編輯器支持了哪些能力。

  - ### 代碼檢查（Linting）
    代碼檢查工具（`Code linters`）可以在你編寫代碼時發現代碼中的問題，以幫你儘早修復。[ESLint](https://eslint.org/) 是一款流行且開源的 `JavaScript` 代碼檢查工具。

    - 可以使用 React 的 [推薦配置安裝 ESLint](https://www.npmjs.com/package/eslint-config-react-app)（需確保已安裝 Node）。
    - 可安裝 VSCode 中的 [官方 ESLint 擴充功能](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)。

    - #### 必備規則提醒
      請確保你已經為你的項目啟用了 [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) 規則。這在 `React` 項目中是必備的，同時能幫助你及早捕獲較為嚴重的 `bug`。官方推薦的 [eslint-config-react-app](https://www.npmjs.com/package/eslint-config-react-app) 預設（`preset`）中已經集成了該規則。

  - ### 格式化
    與其他貢獻者共享代碼時，為了避免爭論代碼縮進應該使用 `tabs` 還是空格，可以使用 [Prettier](https://prettier.io/)。它會根據預設配置的規則重新格式化代碼（如將 `tabs` 轉換為空格、規範縮進和引號等），以保證代碼整潔。

    - [VSCode 安裝 Prettier 擴充](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) 功能步驟：
      1. 啟動 `VS Code`
      2. 使用快速打開（快捷鍵 `Ctrl/Cmd + P`）
      3. 輸入 `ext install esbenp.prettier-vscode`
      4. 按下 `Enter`

    - #### 保存並自動格式化
      理想情況下，你應該在每次保存時自動格式化代碼。
      
      - `VS Code` 的配置步驟如下：
        1. 在 `VS Code` 中，按快捷鍵 `Ctrl/Cmd + Shift + P`
        2. 輸入 `settings`
        3. 按下 `Enter`
        4. 在搜索欄輸入 `format on save`
        5. 確保勾選 `format on save` 選項！

    :::info 衝突隱患提示
    - 如果你的 `ESLint` 預設包含格式化規則，它們可能會與 `Prettier` 發生衝突。
    - 建議使用 `eslint-config-prettier` 禁用 `ESLint` 預設中的所有格式化規則，讓 `ESLint` 只用於捕捉邏輯錯誤。
    - 如果你想在合併 `PR` 前強制執行文件的格式化，請在你的 `CI`（持續集成）中使用 `prettier --check` 命令。
    :::