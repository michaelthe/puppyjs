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
      {text: 'Config Reference', link: '/config/'}
    ],
    sidebar: {
      '/guide/': genSidebarConfig('Guide')
    }
  }
}

function genSidebarConfig (title) {
  return [
    {
      title,
      collapsable: false,
      children: [
        '',
        'getting-started',
        'configuration',
        'testing'
      ]
    }
  ]
}