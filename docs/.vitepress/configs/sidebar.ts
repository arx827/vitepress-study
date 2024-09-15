export const sidebar = {
  '/page/guide/': [
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
}