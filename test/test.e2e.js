describe('test', () => {
  let page

  beforeEach(async () => {
    page = await puppy.newPage('localhost:8080')
  })

  afterEach(async () => {
    await page.close()
  })

  it('should check the  search placeholder', async () => {
    await page.waitFor('.test')
  })
})
