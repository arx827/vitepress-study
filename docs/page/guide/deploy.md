---
title: 介紹
---

# 部署
  - 1. 在 `docs/.vitepress/config.js` 設定正確的 `base`。
    - 如果你想部署到  `https://<USERNAME>.github.io/`, 你可以省略這一步，因為 `base `預設為 `'/'`。

    - 如果你想部署到 `https://<USERNAME>.github.io/<REPO>/`, 例如你的倉庫是 `https://github.com/<USERNAME>/<REPO>`, 那麼需要設定 `base` 為 `'/<REPO>/'`。

  - 2. 在你的專案中建立包含以下內容的 `deploy.sh` 檔案(請自行判斷去掉高亮行的註解)。
    ```sh
    #!/usr/bin/env sh

    # 忽略錯誤
    set -e

    # 構建
    npm run docs:build

    # 進入待發布的目錄
    cd docs/.vitepress/dist

    # 如果是發布到自定義域名
    # echo 'www.example.com' > CNAME

    git init
    git add -A
    git commit -m 'deploy'

    # 如果部署到 https://<USERNAME>.github.io
    # git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

    # 如果是部署到 https://<USERNAME>.github.io/<REPO>
    git push -f https://github.com/<USERNAME>/<REPO>.git master:gh-pages

    cd -
    ```