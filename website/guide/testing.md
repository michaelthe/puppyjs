---
title: Testing
---

# Testing

Puppy was built to work with zero-config (see default config values above), so for testing you only need to run `puppy test` command. 
Puppy will search for files ending in `.e2e.js` and run the tests so bear that in mind if you save your test files in `.spec.js`. 

## Puppy Global Object

Puppy by default gives you access to the **puppy** global object _which also wraps puppeteer_ . In the example below you can observe the minimum setup for launching a test

```javascript
describe('test', () => {
  let page
  
  it('should work with empty url', async () => {
      page = await puppy.newPage()
      await page.waitFor('.test')
  })
}
``` 

As you can observe the only line of code needed to get a page reference is `page = await puppy.newPage()`

* newPage

    * when no arguments are passed corresponds to `http://localhost:${PORT}` and assumes an `index.html` file in current working directory to be used as an entry point.
    * the only argument supported at the moment is the url or path. 
    
    For example if your `index.html` file is under a `src` folder then you would use `page = await puppy.newPage('/src/[filename].html')`. **Note** The first `/` is optional.
    
    You can also provide a full url e.g `page = await puppy.newPage('http://www.google.com')`. **Note** that `http(s)` is required in front of the url.
    
## Access to the BROWSER object

You can get to the BROWSER object as exposed by Puppeteer using `puppy.browser`.
    
## Dynamic HTTP responses

The `puppy` object exposes several helper functions including `puppy.register` which you can use to register a dynamic response. This is useful for when you want to test that your front-end handles a 404 error for example gracefully and shows a relevant message.

Example:

```javascript
describe('test', () => {
  let page
  
  beforeEach(async () => {
    page = await puppy.newPage()
  })
  
  it('should work with empty url', async () => {
      await puppy.register({
         path: '/api/users',
         status?: 404,
         body?: 'No users found',
         headers?: {},
         method: 'POST'
      })
      await page.click('.btn.getUsers')
      
      await page.waitFor('.error-container')
      
      const error = await page.evaluate(() => document.getElementById('error-message').innerText)
      
      expect(error).toEqual('No users found')
  })
}
```

**Note** all parameters with `?` are optional above. Defaults are the following:

```
    body: 'ok',
    status: 200,
    headers: {}
```

## Dynamic web socket messages

As with dynamic HTTP responses you can `emit` dynamic web socket messages using `puppy.emit`

Example:

```javascript

describe('test', () => {
  let page
  
  beforeEach(async () => {
    page = await puppy.newPage()
  })
  
  it('should work with empty url', async () => {
      await puppy.emit({
         'notification': {
              interval: 1000,
              message: {seen: false, createdAt: Date.now(), text: 'I am a notification'}
          }
      })
      
      await page.click('.notifications-container')
      
      await page.waitFor('.notifications-container')
      
      const notification = await page.evaluate(() => document.querySelector('.notification').innerText)
      
      expect(error).toEqual('I am a notification')
  })
}
```

## Flushing dynamic HTTP responses

If you want to avoid any mishaps with dynamic HTTP responses you can use `puppy.flush()` to remove all previously set dynamic HTTP responses.


Example: 

```javascript

describe('test', () => {
  let page
  
  beforeEach(async () => {
    page = await puppy.newPage()
    await puppy.flush() // flush all dynamic HTTP responses
  })
  
  it('should work with empty url', async () => {
      await puppy.emit({
          'notification': {
              interval: 1000,
              message: {seen: false, createdAt: Date.now(), text: 'I am a notification'}
          }
      })
      
      await page.click('.notifications-container')
      
      await page.waitFor('.notifications-container')
      
      const notification = await page.evaluate(() => document.querySelector('.notification').innerText)
      
      expect(error).toEqual('I am a notification')
  })
}
```

## Executing specific tests

If you want to run only specific tests; for example you want to run the `users.pup.js` test file you can use `puppy test users` and Puppy will run all files containing the word `users` and end in `.pup.js`

::: tip
You can change the default extension to look for by configuring `ext-prefix`. E.g. `puppy test --ext-prefix e2e`
:::
