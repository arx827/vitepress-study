---
title: '[React官網] React 19.2 教程'
---

# React 開發者工具
  使用 `React` 開發者工具（`React Developer Tools`）來檢查 `React` 組件（`components`）、編輯 `props` 和 `state`，並識別效能問題。

  :::info 你將學到
  如何安裝 `React` 開發者工具
  :::

## 瀏覽器擴充功能
  調試（`Debug`）由 `React` 建構的網站，最簡單的方法就是安裝 `React` 開發者工具的瀏覽器擴充功能。
  
  它支援以下幾種主流瀏覽器：
  - [安裝 Chrome 擴充功能](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
  - [安裝 Firefox 擴充功能](https://addons.mozilla.org/zh-CN/firefox/addon/react-devtools/)
  - [安裝 Edge 擴充功能](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

  安裝完成後，當你造訪一個由 `React` 建構的網站時，開發者工具中將會出現 `Components（組件）` 和 `Profiler（效能分析器`）面板。

  - ### Safari 與其他瀏覽器
    對於其他瀏覽器（例如 `Safari`），可以透過安裝 `react-devtools` `npm` 套件來使用：

    ```sh
    # 使用 Yarn 安裝
    yarn global add react-devtools

    # 使用 Npm 安裝
    npm install -g react-devtools
    ```

    接下來，從終端機（`Terminal`）打開此開發者工具：

    ```sh
    react-devtools
    ```

    接著，在你想調試的網站 `<head>` 標籤的最開頭，添加以下 `<script>` 標籤來進行連線：
    ```html
    <html>
      <head>
        <script src="http://localhost:8097"></script>
    ```

    完成後在瀏覽器中重新整理你的網站，就可以在獨立的開發者工具視窗中查看它。

## 行動端（React Native）
  你可以使用 `React Native DevTools` 來檢查 `React Native` 應用程式，其內建的調試器與 `React Developer Tools` 進行了深度整合。
  所有功能（包括原生元素的突顯與選取）的工作方式都與瀏覽器擴充功能相同。

  :::info 版本相容提示
  對於 `React Native` `0.76` 之前的版本，請按照上方「`Safari 與其他瀏覽器`」的指南，使用獨立建構的 `React DevTools` 來進行調試。
  :::