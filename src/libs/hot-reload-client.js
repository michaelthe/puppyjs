;(function () {
  function refreshCSS () {
    var head = document.getElementsByTagName('head')[0]
    var sheets = [].slice.call(document.getElementsByTagName('link'))

    for (var i = 0; i < sheets.length; ++i) {
      var elem = sheets[i]
      var rel = elem.rel

      head.removeChild(elem)

      if ((elem.href && typeof rel !== 'string') || rel.length === 0 || rel.toLowerCase() === 'stylesheet') {
        var url = elem.href.replace(/(&|\?)_cacheOverride=\d+/, '')
        elem.href = url + (url.includes('?') ? '&' : '?') + '_cacheOverride=' + Date.now()
      }

      head.appendChild(elem)
    }
  }

  if ('WebSocket' in window) {
    var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://'
    var address = protocol + window.location.host + '/SOCKET_ADDRESS'
    var socket = new window.WebSocket(address)

    socket.onmessage = msg => msg.data === 'stylesReload' ? refreshCSS() : window.location.reload()
    socket.onclose = () => console.log('Live reload deactivated.')
    console.log('Live reload enabled.')
  }
})()
