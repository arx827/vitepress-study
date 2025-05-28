export const sidebar = {
  '/pages/docTypeScript/it': [
    {
      text: '[博碩] IT邦 - 讓 TypeScript 成為你全端開發的 ACE !',
      items: [
        {
          text: 'Part I TypeScript 基礎篇',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '1 TypeScript 的發展與概論', link: '/pages/docTypeScript/it/partI/typeScript-1' },
            { text: '2 型別系統概論', link: '/pages/docTypeScript/it/partI/typeScript-2' },
            { text: '3 深入型別系統 I 基礎篇', link: '/pages/docTypeScript/it/partI/typeScript-3' },
            { text: '4 深入型別系統 II 進階篇', link: '/pages/docTypeScript/it/partI/typeScript-4' },
            { text: '5 TypeScript 類別基礎', link: '/pages/docTypeScript/it/partI/typeScript-5' },
            { text: '6 TypeScript 介面', link: '/pages/docTypeScript/it/partI/typeScript-6' },
            { text: '7 深入型別系統 III 泛用型別', link: '/pages/docTypeScript/it/partI/typeScript-7' },
            { text: '8 TypeScript 模組系統', link: '/pages/docTypeScript/it/partI/typeScript-8' },
          ]
        },
        {
          text: 'Part II TypeScript 應用篇',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '9 物件導向進階篇章', link: '/pages/docTypeScript/it/partII/typeScript-9' },
            { text: '10 常用 ECMAScript 標準語法', link: '/pages/docTypeScript/it/partII/typeScript-10' },
            { text: '11 常用 ECMAScript 標準語法 非同步程式設計篇', link: '/pages/docTypeScript/it/partII/typeScript-11' },
            { text: '12 TypeScript 裝飾子', link: '/pages/docTypeScript/it/partII/typeScript-12' },
          ]
        },
        {
          text: 'A 解答篇',
          link: '/pages/docTypeScript/it/A/typeScript-A'
        }
      ]
    }
  ],
  '/pages/docVue/nuxt/nuxt3/': [
    {
      text: '[IT邦] - Nuxt3快速入門 - Ryan',
      items: [
        {
          text: '1',
        }
      ]
    }
  ],


  '/pages/guide/': [
    {
      text: '介紹',
      items: [
        { 
          text: '什麼是 VitePress？',
          collapsed: true,
          link: '/page/guide/what-is-vitepress',
          items: [
            {
              text: 'Motivation',
              link: '/page/guide/what-is-vitepress#motivation',
            },
            {
              text: '對VuePress 的改進',
              link: '/page/guide/what-is-vitepress#對-vuepress-的改進',
              items: [
                {
                  text: '使用Vue 3',
                  link: '/page/guide/what-is-vitepress#使用vue-3',
                },
                {
                  text: 'It Uses Vite Under The Hood',
                  link: '/page/guide/what-is-vitepress#it-uses-vite-under-the-hood',
                },
                {
                  text: 'Lighter Page Weight',
                  link: '/page/guide/what-is-vitepress#lighter-page-weight',
                },
              ]
            },
            {
              text: '其他不同',
              link: '/page/guide/what-is-vitepress#其他不同',
            },
            {
              text: '這會成為未來的下一個VuePress 嗎？',
              link: '/page/guide/what-is-vitepress#這會成為未來的下一個vuepress-嗎',
            },
          ]
        },
        {
          text: '快速上手',
          link: '/page/guide/getting-started'
        },
        {
          text: '配置',
          link: '/page/guide/configuration'
        },
        {
          text: '部署',
          link: '/page/guide/deploy'
        },
      ],
    },
  ],
  '/pages/docTypeScript/expert': [
    {
      text: '[旗標] TypeScript 邁向專家之路',
      items: [
        {
          text: '第一篇 TypeScript 入門準備',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '01 你的第一個 TypeScript 應用程式', link: '/pages/docTypeScript/expert/typeScript-1' },
            { text: '02 認識 TypeScript 及 本書內容', link: '/pages/docTypeScript/expert/typeScript-2' },
            { text: '03 JavaScript 快速入門(上)', link: '/pages/docTypeScript/expert/typeScript-3' },
            { text: '04 JavaScript 快速入門(下)', link: '/pages/docTypeScript/expert/typeScript-4' },
            { text: '05 使用 TypeScript 編譯器', link: '/pages/docTypeScript/expert/typeScript-5' },
            { text: '06 TypeScript 程式的測試與除錯', link: '/pages/docTypeScript/expert/typeScript-6' },
          ]
        },
        {
          text: '第二篇 TypeScript 徹底解析',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '07 了解 TypeScript 的靜態型別', link: '/pages/docTypeScript/expert/typeScript-7' },
            { text: '08 在 TypeScript 使用函式', link: '/pages/docTypeScript/expert/typeScript-8' },
            { text: '09 在 TypeScript 使用陣列、tuple 與列舉', link: '/pages/docTypeScript/expert/typeScript-9' },
            { text: '10 在 TypeScript 運用物件', link: '/pages/docTypeScript/expert/typeScript-10' },
            { text: '11 在 TypeScript 使用類別與介面', link: '/pages/docTypeScript/expert/typeScript-11' },
            { text: '12 在 TypeScript 使用泛型', link: '/pages/docTypeScript/expert/typeScript-12' },
            { text: '13 TypeScript 的進階泛型功能', link: '/pages/docTypeScript/expert/typeScript-13' },
            { text: '14 在 TypeScript 專案中混用 JavaScript', link: '/pages/docTypeScript/expert/typeScript-14' },
          ]
        },
        {
          text: '第三篇 TypeScript 實戰攻略',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '15 打造獨立網路應用程式(上)', link: '/pages/docTypeScript/expert/typeScript-15' },
            { text: '16 打造獨立網路應用程式(下)', link: '/pages/docTypeScript/expert/typeScript-16' },
            { text: '17 打造 Angular 網路應用程式(上)', link: '/pages/docTypeScript/expert/typeScript-17' },
            { text: '18 打造 Angular 網路應用程式(下)', link: '/pages/docTypeScript/expert/typeScript-18' },
            { text: '19 打造 React 網路應用程式(上)', link: '/pages/docTypeScript/expert/typeScript-19' },
            { text: '20 打造 React 網路應用程式(下)', link: '/pages/docTypeScript/expert/typeScript-20' },
            { text: '21 打造 Vue.js 網路應用程式(上)', link: '/pages/docTypeScript/expert/typeScript-21' },
            { text: '22 打造 Vue.js 網路應用程式(下)', link: '/pages/docTypeScript/expert/typeScript-22' },
          ]
        },
        {
          text: '電子書',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '打造 Svelte 網路應用程式', link: '/pages/docTypeScript/expert/typeScript-e-book' },
          ]
        }
      ]
    }
  ],
  

  // 其他
  '/pages/hahow/devops': [
    {
      text: '[Hahow] 軟體開發的利器：技術人要懂的 DevOps 通識課',
      items: [
        {
          text: '前言',
          link: '/pages/hahow/devops/devops-0'
        },
        {
          text: '1. DevOps 是什麼？',
          link: '/pages/hahow/devops/devops-1'
        },
        {
          text: '2. 三步工作法',
          link: '/pages/hahow/devops/devops-2'
        },
        {
          text: '3. 如何開始 DevOps ?',
          link: '/pages/hahow/devops/devops-3'
        },
        {
          text: '4. DevOps 的技術實踐',
          link: '/pages/hahow/devops/devops-4'
        },
        {
          text: '測驗題',
          link: '/pages/hahow/devops/devops-exam'
        }
      ]
    }
  ]
}