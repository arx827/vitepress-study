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
git push -f https://github.com/arx827/vitepress-study.git master:gh-pages

cd -