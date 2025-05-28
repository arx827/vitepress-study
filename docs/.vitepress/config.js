import { head, nav, sidebar } from './configs'

// 主題 配置
const themeConfig = {
  logo: '/apple-touch-icon.png',
  siteTitle: 'Study 學習筆記',
  outline: [2, 3],
  nav,
  sidebar,

  // socialLinks: [
  //   { icon: 'github', link: 'https://github.com/gumingWu/vitepress-fun' }
  // ],
  footer: {
    copyright: 'MIT Lincensed | Copyright © 2024-present Eason',
  }
}

// markdown 配置
const markdown = {
  lineNumbers: true
}

export default {
  base: '/vitepress-study/',   // 站點將部署在這個 base URL路徑
  lang: 'zh-TW',
  title: 'Study',
  description: '學習筆記',
  head,
  themeConfig,
  markdown,
  vite: {
    server: {
      port: 8509
    }
  }
}