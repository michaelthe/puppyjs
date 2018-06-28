# PuppyJS 

![npm](https://img.shields.io/npm/l/puppyjs.svg?style=flat-square)
![npm](https://img.shields.io/npm/v/puppyjs.svg?style=flat-square)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/michaelthe/puppyjs/master.svg?style=flat-square)
![CircleCI branch](https://img.shields.io/circleci/project/github/michaelthe/puppyjs/master.svg?style=flat-square)

## Puppeteer + Jest + awesome-code = Puppy.JS

PuppyJS is a framework agnostic E2E (end-to-end) testing and mocking tool for front end developers.
Puppy depends on [Jest](http://jestjs.io/) for tests and [Puppeteer](https://github.com/GoogleChrome/puppeteer) 
for the testing environment so if you know these tools then you already know 80% of Puppy.

Puppy also lets you mock HTTP APIs and web socket events so you can 
develop your application until the backend is ready as well as
run your E2E tests against the same mock API and socket events you used for development.  

## Install  
```bash
npm install puppyjs --save-dev
```

## Install globally
```bash
npm install puppyjs --global
```

## Get some help
```bash
puppy --help
```

## Run mocking servers
```bash
puppy serve
```

## Run tests
```bash
puppy test
```

### Sample directory structure

Below you can find a sample directory structure. The important thing to notice are the `puppy.api.js`, `puppy.ws.js` and `puppy.config.js` and that they are at the root level of the directory.

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
    ├── users.e2e.js
    └── notifications.e2e.js
```

#### puppy.api.js

Sample:

```javascript
module.exports = {
  '/api/users': {
    'GET': {
      headers: {
        'Authorization': 'Bearer some-token'
      },
      status: 200,
      body: 'hello its a GET'
    }
  }
}
```

#### puppy.ws.js

Sample:

```javascript
module.exports = [
  {
    delay: 1000,
    interval: 1000,
    messages: [
      {seen: false, createdAt: Date.now(), text: 'I am a notification'}
    ]
  }
}
```

#### puppy.config.js

Sample:

```javascript
module.exports = {
    port: 1337
}
```

### Your first End-to-End test

Underneath, Puppy uses Jest for asserting and Puppeteer for executing actions in the browser. Please head to their documentation if you are not familiar.
In the example below it assumes a file `index.html` inside `src` folder and a file with any name but ends with `.e2e.js` which will hold the test.

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

To run this use the command

```javascript
puppy test
```

### Puppy Development Mock Server

You can use the same `puppy.api.js` file that you configure above for development purpose. Run `puppy serve` and you can now make a `GET` request to `/api/users` and get a reply back as set in the `puppy.api.js` file. 
