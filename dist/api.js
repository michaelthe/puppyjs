(async () => {
  'use strict'

  await $.ajax({
    method: 'GET',
    url: '/api/users',
    success: (res) => {
      $('.http-console').append(`<br><br><div class="get">Response from GET /api/users: ${res}</div>`)
    }
  })

  await $.ajax({
    method: 'POST',
    url: '/api/users',
    success: (res) => {
      $('.http-console').append(`<br><br><div class="post">Response from POST /api/users: ${res}</div>`)
    }
  })

  await $.ajax({
    method: 'DELETE',
    url: '/api/users',
    success: (res) => {
      $('.http-console').append(`<br><br><div class="default">Response from DELETE /api/users: ${res}</div>`)
    }
  })

  await $.ajax({
    method: 'PATCH',
    url: '/api/user',
    success: (res) => {
      $('.http-console').append(`<br><br><div class="patch">Response from PATCH /api/user: ${res}</div>`)
    }
  })
})()
