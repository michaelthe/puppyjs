const API = {
  '/api/users': {
    'GET': {
      headers: [
        {
          key: 'X-Session-ID',
          value: '234905823409578'
        }
      ],
      status: 200,
      body: 'hello its a GET'
    },
    'POST': {
      headers: [
        {
          key: 'X-Session-ID',
          value: '234905823409578'
        }
      ],
      status: 200,
      body: 'hello its a POST'
    },
    'DEFAULT': {
      headers: [
        {
          key: 'X-Session-ID',
          value: '234905823409578'
        }
      ],
      status: 200,
      body: 'hello its a default'
    }
  },
  '/api/user': {
    'PATCH': {
      body: 'hello from a PATCH'
    }
  }
}

module.exports = API