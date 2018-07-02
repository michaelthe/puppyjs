(async () => {
  'use strict'
  const ws = new WebSocket('ws://localhost:8080/ws')
  // event emmited when connected
  ws.onopen = function () {
    console.log('websocket is connected ...')
    // sending a send event to websocket server
    ws.send('connected')
  }

  let wsCounter = 0

  $('.test').append('<br><br><div class="ws-count">Responses from WS: ' + wsCounter + '</div>')

  $('.test').append('<br><br><div class="ws-last">Latest response from WS: </div>')
  // event emmited when receiving message

  ws.onmessage = function (ev) {
    wsCounter++
    console.log(ev)
    $('.ws-count').text('Responses from WS: ' + wsCounter)
    $('.ws-last').html('Latest response from WS: <span class="ws-data">' + ev.data + '</span>')
  }
})()
