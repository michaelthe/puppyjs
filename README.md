# Puppy.JS 

![npm](https://img.shields.io/npm/l/puppyjs.svg?style=flat-square)
![npm](https://img.shields.io/npm/v/puppyjs.svg?style=flat-square)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/michaelthe/puppyjs/master.svg?style=flat-square)
![CircleCI branch](https://img.shields.io/circleci/project/github/michaelthe/puppyjs/master.svg?style=flat-square)

## Puppeteer + Jest + awesome-code = Puppy.JS

Puppy.JS is a framework agnostic E2E (end-to-end) testing and mocking tool for front end developers.
Puppy depends on [Jest](http://jestjs.io/) for tests and [Puppeteer](https://github.com/GoogleChrome/puppeteer) 
for the testing environment so if you know these tools then you already know 80% of PuppyJS.

Puppy also lets you mock HTTP APIs and web socket events so you can 
develop your application until the backend is ready as well as
run your e2e tests against the same mock API and socket events you used for development.  

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

## The puppy config file `puppy.config.js`

You can fine-tune puppy by creating a puppy.config.js file in the top level of the current directory you want to use PuppyJS.

* **ws** 

    is the flag for setting a custom file for the web socket definition file, puppy needs it to be at the top level of the current directory next to package.json 

* **api**

    is the flag for setting a custom file for the HTTP API definition file. **Note** this file needs to be at the top level of the current working directory next to the package.json file. Default file that Puppy will search for use **puppy.api.js**.
    
* **verbose**

    You can set this option to `true` if you want to have more specific logs spit out by PuppyJS. Default value is **false**.


In the config file snapshot below, what you see there are the `default` values.

```javascript
const path = require('path')

module.exports = {
  'ws': path.resolve(process.cwd(), 'puppy.ws.js'),
  'api': path.resolve(process.cwd(), 'puppy.api.js'),

  'port': 8080,
  'ws-port': 8080,
  'api-port': 8080,

  'verbose': false,
  'headless': false,
  'inspect': false

  'ws-url': '/ws',
  'index-file': 'index.html',
  'static-dir': path.resolve(process.cwd(), 'dist'),
}

```

### Understanding what makes Puppy tick



## The puppy api file `puppy.api.js`

The `puppy.api.js` file is used to define the default mocked responses when a client makes a request to an endpoint.
 It can be used to quickly mock the back-end part of an application as well as used in testing to provide 
 default responses instead of hitting an actual API.

The default filename can be changed by providing a flag.

```javascript
puppy serve --api mocked.api.js

puppy test --api mocked.api.js
```
####Example API definition file

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
  {name: 'Andrew', email: '9pitop@gmail.com', age: 44},
  {name: 'Kostis', email: 'yolo@gmail.com', age: 35}
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
