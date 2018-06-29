describe('api', function () {
  let page

  beforeEach(async () => {
    page = await puppy.newPage('http://127.0.0.1:8080/index.html')
  })

  afterEach(async () => {
    await page.close()
  })

  it('should show ws messages', async () => {
    await page.waitFor(() => $('.ws-data').length)

    let msg = await page.evaluate(() => $('.ws-data').text())
    expect(msg).toContain('"text":"I am a notification"')

    await page.waitFor(500)

    msg = await page.evaluate(() => $('.ws-data').text())
    expect(['12', '3', '52', '23', '55'].includes(msg)).toBeTruthy()

    await page.waitFor(500)

    msg = await page.evaluate(() => $('.ws-data').text())
    expect(msg).toBe('[{"name":"Jane Doe","email":"jane@gmail.com","age":44},{"name":"John Doe","email":"john@gmail.com","age":35}]')
  })
})