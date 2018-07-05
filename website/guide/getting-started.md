---
title: Getting started
---

# Getting Started
  
::: warning COMPATIBILITY NOTE
PuppyJS requires Node.js >= 8.
:::

Depending on your use case you can install both globally and locally.

## Global installation

```bash
npm install puppyjs --global
```

## Local installation

If you want PuppyJS to run on your CI/CD platforms its best to install locally as well.

```bash
npm install puppyjs --save-dev
```

In your `package.json`

```json

"scripts": {
  ...
  "puppy:serve": puppy serve,
  "puppy:test": puppy test
}
```

## Useful commands

### Help
```bash
puppy --help
```

### For development
```bash
puppy serve
```

### For testing
```bash
puppy test
```

## Sample project structure

Below you can find a sample project directory structure. The important files to notice are:

`puppy.api.js`
`puppy.ws.js` 
`puppy.config.js`

They must be located at the **root level** of the directory. Also of importance is the `.pup.js` extension of files in the **tests** folder.

```
.
|
├── puppy.config.js <optional>
├── puppy.api.js <optional>
├── puppy.ws.js <optional>
|
├── package.json
|
├── dist
|   ├── background.jpg
|   ├── index.html
|   └── fonts
|
└── tests
    ├── users.pup.js
    └── notifications.pup.js
```

These files are all **optional** and depending on your needs you can find the breakdown of each file in [configuration](./configuration.md).

## Mocking an HTTP call

First you need to create a `puppy.api.js` file in the root directory. Then change the content of the sample below to fit your app and you are good to go. 

::: tip
In a nutshell the sample says "When you make a GET request to `/api/users` Puppy will return a **JSON** response with status code **200** and an **object**.
:::

Sample:

```javascript
module.exports = {
  '/api/users': {
    'GET': {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 200,
      body: { message: 'Hello its a GET' }
    }
  }
}
```

## Mocking a Web Socket connection

If you want to mock your web socket connection and transmit messages from the Mock to your front facing app then you need to create a `puppy.ws.js` in your root directory. Then change the content of the sample below to fit your needs.

::: tip
In a nutshell the sample says "When the Web Socket Connection is established, send through a 'notification' every second with an initial delay of one second.
::: 

Sample:

```javascript
module.exports = {
  'notification': {
      delay: 1000, // optional
      interval: 1000, // optional
      message: {seen: false, createdAt: Date.now(), text: 'I am a notification'}
    }
}
```

## Your first End-to-End test

Underneath, Puppy uses Jest for asserting and Puppeteer for executing actions in the browser. Please head to their documentation if you are not familiar.

In the example below it assumes a file `index.html` inside `src` folder and a file with any name but ends with `.pup.js` which will hold the test.

```javascript
describe('test', () => {
  let page
  
  it('check that puppy works', async () => {
      page = await puppy.newPage('http://localhost:1337/src/index.html') // page instance is a puppeteer page instance
      
      ... your code
      
      expect(...) // Jest
  })
}
``` 

To run your test use the command

```sh
puppy test
```