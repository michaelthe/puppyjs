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

```javascript
.
|
├── puppy.api.js
├── puppy.ws.js
├── puppy.config.js <optional>
|
├── package.json
|
├── public
|   ├── background.jpg
|   └── fonts
|
├── tests
|   ├── users.e2e.js
|   └── notifications.e2e.js
|
└── src
    ├──components
    └──index.html
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
const path = require('path')

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

`puppy test`

### Understanding what makes Puppy tick

Puppy creates four servers with three of the four on the **same** port. It supports both HTTP and Web sockets for mocking as you probably deduced by now and it supports serving static files as well. 
However, to avoid conflicts with Puppy internal routes, there is also an internal server which Puppy will proxy requests made by the tool. 
For example Puppy handles a `/register` route  for dynamically registering HTTP responses. **This means that if your app
was using a `/register` for registering users, it wouldn't work.** Instead of namespacing the Puppy's specific routes, 
we chose to have an internal server handle that which automatically choses a free port in the 65000+ range and saves it in a `.puppy` folder in the current directory.

`.puppy` folder is used for directory specific settings by Puppy. For now it only saves the current internal server port.

### How to use 

There are two ways that you can use Puppy. For development purposes and for end-to-end testing using Jest and Puppeteer.

For `development` you can use the following command:

`puppy serve`

For `testing` you can use the following command:

`puppy test`

When Puppy is used in development mode, it automatically watches for changes made to `puppy.ws.js` and `puppy.api.js` files and reloads them. 

**Note** Changes made to `puppy.ws.js` need a page reload in the browser to take effect while changes to `puppy.api.js` are instant.

When using `puppy serve` you can observe the current values used for the ports, static dir etc as seen below

```javascript
Puppy is listening on port 65000!
Puppy static is listening on port 8080!
Puppy static dir is: <current project DIR>/dist!
Puppy static index file: index.html!
Puppy static api is listening on port 8080!
Puppy ws is listening on port 8080!
Puppy ws URL is set to /ws!

```

### The Puppy configuration options

#### Using command-line arguments

You can fine-tune Puppy by passing arguments to `puppy serve` and `puppy test`

Example: 

```javascript
puppy serve --port 9090
```

* **port**
    
    This sets the port for all servers (Websocket, API, Static files)

* **ws** 

    is the flag for setting a custom file for the web socket definition file, Puppy needs it to be at the top level of the current directory next to package.json 
    
* **ws-port** 

    is the flag for setting a custom port for connecting using web socket.  Default port is **8080**
    
* **ws-url** 

    is the flag for setting a custom url for connecting using web socket. Default url is **/ws** 

* **api**

    is the flag for setting a custom file for the HTTP API definition file. **Note** this file needs to be at the top level of the current working directory next to the package.json file. Default file that Puppy will search for use **puppy.api.js**.
    
* **api-port** 
    
    is the flag for setting a custom port for connecting using HTTP.  Default port is **8080**
    
* **verbose**

    You can set this option to `true` if you want to have more specific logs spat out by Puppy. Default value is **false**.
    
* **headless**

    You can set this option to `true` if you want avoid showing a browser window when running end-to-end tests. Default **false**
    
* **inspect**

    You can set this option to `true` if you want to be able to use a debugger in Puppy's source code. Default **false**
    
* **static-dir**
    
   Define your own static dir in the current working directory for serving static assets. Default **dist**
   
* **index-file**
    
   Define your own index.html as an entrypoint in the current working directory. Default **index.html**
    

#### Using Puppy config file `puppy.config.js`

Please note that the options below are in **camelCase** whereas above are defined in **kebab-case**.
In the config file snapshot below, what you see there are the `default` values. 

```javascript
const path = require('path')

module.exports = {
    ws: path.resolve(process.cwd(), 'puppy.ws.js'),
    api: path.resolve(process.cwd(), 'puppy.api.js'),
    
    port: 8080,
    wsPort: 8080,
    apiPort: 8080,
    
    verbose: false,
    headless: false,
    
    wsUrl: '/ws',
    indexFile: 'index.html',
    staticDir: path.resolve(process.cwd(), 'dist')
}

```

### Testing

Puppy was built to work with zero-config (see default config values above), so for testing you only need to run `puppy test` command. 
Puppy will search for files ending in `.e2e.js` and run the tests so bear that in mind if you save your test files in `.spec.js`. 

#### Puppy Global Object

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
    
##### Access to the BROWSER object

You can get to the BROWSER object as exposed by Puppeteer using `puppy.browser`.
    
##### Registering dynamic responses for use in tests

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
         data?: 'No users found',
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
    data: 'ok',
    status: 200,
    headers: {}
```

##### Registering dynamic web socket messages

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
         delay?: 0,
         interval?: 1000,
         messages: [
           {seen: false, createdAt: Date.now(), text: 'I am a notification'}
         ]
      })
      
      await page.click('.notifications-container')
      
      await page.waitFor('.notifications-container')
      
      const notification = await page.evaluate(() => document.querySelector('.notification').innerText)
      
      expect(error).toEqual('I am a notification')
  })
}
```

**Note** all parameters with `?` are optional above. Defaults are the following:

```
    delay: 0,
    interval: unset
```

##### Flushing all dynamic HTTP responses

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
         delay?: 0,
         interval?: 1000,
         messages: [
           {seen: false, createdAt: Date.now(), text: 'I am a notification'}
         ]
      })
      
      await page.click('.notifications-container')
      
      await page.waitFor('.notifications-container')
      
      const notification = await page.evaluate(() => document.querySelector('.notification').innerText)
      
      expect(error).toEqual('I am a notification')
  })
}
```

#### Run specific tests

If you want to run only specific tests for example you want to run the `users.e2e.js` test file you can use `puppy test users` and Puppy will run all files containing the word `users` and end in `.e2e.js`


## The puppy api file `puppy.api.js`

The `puppy.api.js` file is used to define the default mocked responses when a client makes a request to an endpoint.
 It can be used to quickly mock the back-end part of an application as well as used in testing to provide 
 default responses instead of hitting an actual API.

The default filename can be changed by providing a flag.

```javascript
puppy serve --api mocked.api.js

puppy test --api mocked.api.js
```

#### Example API definition file

```javascript
module.exports = {
  '/api/users': {
    'GET': {
      headers: {
        'Authorization': 'Bearer some-token'
      },
      status: 200,
      body: 'hello its a GET'
    },
    'POST': {
      headers: {
        'Authorization': 'Bearer some-token'
      },
      status: 200,
      body: 'hello its a POST'
    },
    'DEFAULT': {
      headers: {
        'Authorization': 'Bearer some-token'
      },
      status: 200,
      body: 'hello its a default'
    }
  }
}
```

**Note** the `DEFAULT` key can be used to define a fallback response when the client makes a request with a method other than the specified ones. 
In the example below if the client makes a `PATCH` request, the `DEFAULT` response will be given back to the client.

Default values if not given for any default response provided in the API definition file:

```javascript
{
  status: 200,
  body: 'EMPTY-BODY',
  headers: {}
}
```

#### Defining responses dynamically

Sometimes you might want to register a dynamic response for a request so that your app can receive a specific response once.

## The puppy web socket file `puppy.ws.js`

The `puppy.ws.js` file is used to simulate the websocket portion of a back-end system. It can simulate and emit messages with delay and/or interval or once-off dispatching.

The default filename can be changed by providing a flag.

```javascript
puppy serve --ws mocked.api.js

puppy test --ws mocked.api.js
````

API

   * Events: Array(Objects)
   
   * Event: 
      * label: String **optional**
      * delay: Number **optional**
      * interval: Number **optional**
      * messages: \<Object | function>[] | Object | Function

```javascript
const users = [
  {name: 'Jane Doe', email: 'jane@gmail.com', age: 44},
  {name: 'John Doe', email: 'john@gmail.com', age: 35}
]

module.exports = [
  {
    delay: 1000,
    interval: 1000,
    messages: [
      users,
      {seen: false, createdAt: Date.now(), text: 'I am a notification'}
    ]
  },
  {
    messages: async () => {
      const items = [12,3,52,23]
      return items[Math.floor(Math.random()*items.length)]
    },
    interval: 3000
  }
]
```
