---
title: IT邦 - 讓 TypeScript 成為你全端開發的 ACE !
---

# 01 TypeScript 的發展與概論

## 1.1 TypeScript 簡介
  `TypeScript` 是建立在 `JavaScript` 的基礎上，除了擁有如其名的 `型別系統(TypeSystem)` 外，也擁有額外的語法。

## 1.2 TypeScript 可以解決什麼樣的問題？
### 1.2.1 使用 JavaScript 開發時最常遇到的問題
  - #### 使用 JavaScript 開發時最常遇到的問題與麻煩點
    - 1. 除錯時，除非用眼力暴力掃瞄程式碼，否則 `免不了執行程式的步驟`
    - 2. 沒有工具的輔助，單純寫程式，`錯字機率本來就很高`
    - 3. 由於 `資料格式 / 型別 / 結構錯誤` 等，儘管程式執行過程沒錯誤，但 `出現非人類預期狀況`
    - 4. `忘記要處理邊緣情境` 相關的問題

### 1.2.2 動態語言 V.S. 靜態語言
  - #### 動態與靜態語言 Dynamically v.s. Statically Typed Language
    - 1. `動態` 語言的特色為：在 `程式運行` 的狀態下，也就是在英文文章裡會看到的 `Run-time` 期間，任何變數是經由被代入值來判斷其型別；也就是說，`變數的型別會依據存的值本身來判斷`。
    - 2. `靜態` 語言的特色則是：在 `程式正在編譯` 時，也就是所謂的 `Compilation` 期間，根據程式裡 `宣告的型別` (幾乎都適用 `文字` 來表示，如 `Int`、`Float` 等) 來監控型別的狀態。

  - #### 漸進式型別系統 Gradual Typing
    兼具動態與靜態語言的特色 - 程式碼在編譯過程中可能會遇到變數或表達式(Expression) 被顯性地型別註記，這些變數會在靜態地編譯過程中檢測並且被監控；`某些沒有被註記型別的變數或表達式等，會在程式裡自行推斷 (Inference) 型別之結果`，如果遇到型別對應錯誤時釋放警告。

  - #### 型別註記 & 型別推論
    - ##### `型別註記 (Type Annotation)`
      為對變數或表達式進行 `文字敘述上的型別宣告動作`。
    - ##### `型別推論 (Type Inference)`
      則是 `變數根據被賦予的值之型別來代表該變數之型別`；而表達式則是 `經運算結果的值之型別來代表整個表達式最後的型別結果`。

    簡而言之，撇除掉已經被註記過後的東西，決定其他沒有被註記過後的東西之型別，就是看結果值的型別是什麼就對了。

### 1.2.3 強型別語言 V.S. 弱型別語言

## 1.3 學習 TypeScript 的更多好處

## 1.4 征途路上總是也有跌跌撞撞的時候

## 1.5 旅程中的第一小步