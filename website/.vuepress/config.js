module.exports = {
  title: 'Puppy JS',
  description: 'A framework agnostic E2E (end-to-end) testing and mocking tool for front end developers.',

  themeConfig: {
    nav: [
      {text: 'Home', link: '/'},
      {text: 'Guide', link: '/guide/'},
      { text: 'Github', link: 'https://github.com/michaelthe/puppyjs' }
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
        'getting-started'
      ]
    }
  ]
}