(async () => {
  'use strict'
  const ws = new WebSocket('ws://localhost:8080/ws')
  // event emmited when connected
  ws.onopen = function () {
    console.log('websocket is connected ...')
    setTimeout(() => ws.send('connected'), 1000)
  }

  let wsCounter = 0

  $('.ws-console').append(`<div class="ws-count">Responses from WS: ${wsCounter}</div>`)
  $('.ws-console').append(`<div class="ws-default"></div>`)

  ws.onmessage = function (ev) {
    wsCounter++

    $('.ws-count').text(wsCounter)
    let message = ev.data
    try {
      message = JSON.parse(message)
    } catch (e) {
      // message is not json
    }

    switch (message) {
      case 'hello friend':
        $('.ws-console').append(`<div class="ws-connected">${message}</div>`)
        break
      default:
        $('.ws-default').text(JSON.stringify(message))
    }
  }
})()
