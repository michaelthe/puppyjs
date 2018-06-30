describe('api', function () {
  let page

  beforeEach(async () => {
    page = await puppy.newPage('http://127.0.0.1:8080/index.html')
  })

  afterEach(async () => {
    await page.close()
  })

  it('should show ws messages', async () => {
    await page.waitFor(() => $('.ws-data').text().match(/notification/))
    let msg = await page.evaluate(() => $('.ws-data').text())
    expect(msg).toContain('"text":"I am a notification"')

    await page.waitFor(() => [1, 2, 3, 4, 5].map(n => '' + n).includes($('.ws-data').text()))
    msg = await page.evaluate(() => $('.ws-data').text())
    expect([1, 2, 3, 4, 5].map(n => '' + n).includes(msg)).toBeTruthy()

    await page.waitFor(() => $('.ws-data').text().match(/john/i))
    msg = await page.evaluate(() => $('.ws-data').text())
    expect(msg.match(/john/i)).toBeTruthy()

    await page.waitFor(() => $('.ws-data').text().match(/notification/))
    msg = await page.evaluate(() => $('.ws-data').text())
    expect(msg).toContain('"text":"I am a notification"')
  })

  it('should show the emitted message', async () => {
    await page.waitFor(() => $('.ws-data').text().match(/notification/))
    let msg = await page.evaluate(() => $('.ws-data').text())
    expect(msg).toContain('"text":"I am a notification"')

    await puppy.emit('emitted message')

    await page.waitFor(() => $('.ws-data').text().match(/emitted message/i))
    msg = await page.evaluate(() => $('.ws-data').text())
    expect(msg.match(/message/i)).toBeTruthy()

    await page.waitFor(() => [1, 2, 3, 4, 5].map(n => '' + n).includes($('.ws-data').text()))
    msg = await page.evaluate(() => $('.ws-data').text())
    expect([1, 2, 3, 4, 5].map(n => '' + n).includes(msg)).toBeTruthy()
  })
})
