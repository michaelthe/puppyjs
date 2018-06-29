describe('test', () => {
  let page

  afterEach(async () => {
    await page.close()
  })

  it('should work with empty url', async () => {
    page = await puppy.newPage()
    await page.waitFor('.test')
  })

  it('should work with index.html', async () => {
    page = await puppy.newPage('index.html')
    await page.waitFor('.test')
  })

  it('should work with /index.html', async () => {
    page = await puppy.newPage('/index.html')
    await page.waitFor('.test')
  })

  it('should work with localhost:8080', async () => {
    page = await puppy.newPage('http://localhost:8080')
    await page.waitFor('.test')
  })

  it('should work with localhost:8080/index.html', async () => {
    page = await puppy.newPage('http://localhost:8080/index.html')
    await page.waitFor('.test')
  })

  it('should work with 127.0.0.1:8080', async () => {
    page = await puppy.newPage('http://127.0.0.1:8080')
    await page.waitFor('.test')
  })

  it('should work with 127.0.0.1:8080/index.html', async () => {
    page = await puppy.newPage('http://127.0.0.1:8080/index.html')
    await page.waitFor('.test')
  })

  it('should show get request', async () => {
    page = await puppy.newPage('http://127.0.0.1:8080/index.html')
    await page.waitFor('.get')
    const getResponse = await page.evaluate(() => $('.get').text())
    expect(getResponse).toContain('hello its a GET')
  })

  it('should show post request', async () => {
    page = await puppy.newPage('http://127.0.0.1:8080/index.html')
    await page.waitFor('.post')
    const getResponse = await page.evaluate(() => $('.post').text())
    expect(getResponse).toContain('hello its a POST')
  })

  it('should show default request', async () => {
    page = await puppy.newPage('http://127.0.0.1:8080/index.html')
    await page.waitFor('.default')
    const getResponse = await page.evaluate(() => $('.default').text())
    expect(getResponse).toContain('hello its a default')
  })

  it('should show patch request', async () => {
    page = await puppy.newPage('http://127.0.0.1:8080/index.html')
    await page.waitFor('.patch')
    const getResponse = await page.evaluate(() => $('.patch').text())
    expect(getResponse).toContain('hello from a PATCH')
  })

  it('should show ws messages', async () => {
    page = await puppy.newPage('http://127.0.0.1:8080/index.html')
    await page.waitFor(() => $('.ws-data').length)
    let msg = await page.evaluate(() => $('.ws-data').text())
    expect(msg).toContain('"text":"I am a notification"')
    await page.waitFor(500)
    msg = await page.evaluate(() => $('.ws-data').text())
    expect(['12', '3', '52', '23', '55'].includes(msg)).toBeTruthy()
    await page.waitFor(500)
    msg = await page.evaluate(() => $('.ws-data').text())
    expect(msg).toBe('[{"name":"Jane Doe","email":"jane@doe.com","age":44},{"name":"John Doe","email":"john@doe.com","age":35}]')
  })
})
