const helpers = require('./helpers')

describe('api', function () {
  let page

  beforeEach(async () => {
    page = await puppy.newPage('http://127.0.0.1:8080/index.html')
  })

  afterEach(async () => {
    await page.close()
    helpers.resetFiles()
  })

  it('should show ws messages', async () => {
    await page.waitFor(() => $('.ws-default').text().match(/notification/))
    let msg = await page.evaluate(() => $('.ws-default').text())
    expect(msg).toContain('"text":"I am a notification"')

    await page.waitFor(() => [1, 2, 3, 4, 5].map(n => '' + n).includes($('.ws-default').text()))
    msg = await page.evaluate(() => $('.ws-default').text())
    expect([1, 2, 3, 4, 5].map(n => '' + n).includes(msg)).toBeTruthy()

    await page.waitFor(() => $('.ws-default').text().match(/john/i))
    msg = await page.evaluate(() => $('.ws-default').text())
    expect(msg.match(/john/i)).toBeTruthy()

    await page.waitFor(() => $('.ws-default').text().match(/notification/))
    msg = await page.evaluate(() => $('.ws-default').text())
    expect(msg).toContain('"text":"I am a notification"')
  })

  it('should show the emitted message', async () => {
    await page.waitFor(() => $('.ws-default').text().match(/notification/))
    let msg = await page.evaluate(() => $('.ws-default').text())
    expect(msg).toContain('"text":"I am a notification"')

    await puppy.emit('emitted message')

    await page.waitFor(() => $('.ws-default').text().match(/emitted message/i))
    msg = await page.evaluate(() => $('.ws-default').text())
    expect(msg.match(/message/i)).toBeTruthy()

    await page.waitFor(() => [1, 2, 3, 4, 5].map(n => '' + n).includes($('.ws-default').text()))
    msg = await page.evaluate(() => $('.ws-default').text())
    expect([1, 2, 3, 4, 5].map(n => '' + n).includes(msg)).toBeTruthy()
  })

  it('should receive the new messages', async () => {
    helpers.updateWS({ somemessage: { message: 'some new message' } })
    await page.waitFor(100)

    await page.reload()
    await page.waitFor(() => $('.ws-default').text().match(/some new message/i))

    const msg = await page.evaluate(() => $('.ws-default').text())
    expect(msg.match(/some new message/i)).toBeTruthy()
  })

  it('should receive hello friend after receiving connected message', async () => {
    await page.waitFor(500)
    let result = await page.evaluate(() => $('.ws-connected').text())

    expect(result).toBeFalsy()

    await page.waitFor('.ws-connected')
    result = await page.evaluate(() => $('.ws-connected').text())
    expect(result.match(/hello friend/)).toBeTruthy()
  })
})
