module.exports = {
  title: 'Puppy JS',
  description: 'A framework agnostic E2E (end-to-end) testing and mocking tool for front end developers.',

  themeConfig: {
    repo: 'michaelthe/puppyjs',
    editLinks: true,
    docsDir: 'website',
    nav: [
      {text: 'Home', link: '/'},
      {text: 'Guide', link: '/guide/'},
      {text: 'Reference', link: '/config/'},
    ],
    sidebar: {
      '/guide/': genSidebarConfig('Guide', [
        '',
        'getting-started',
        'configuration',
        'testing'
      ]),
      '/config/': genSidebarConfig('Reference', [
        '',
        'api',
        'sockets'
      ])
    }
  }
}

function genSidebarConfig (title, children) {
  return [
    {
      title,
      collapsable: false,
      children
    }
  ]
}