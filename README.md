# PuppyJS | [Docs :notebook:](https://github.com/michaelthe/puppyjs/wiki)

![npm](https://img.shields.io/npm/l/puppyjs.svg?style=flat-square)
![npm](https://img.shields.io/npm/v/puppyjs.svg?style=flat-square)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/michaelthe/puppyjs/master.svg?style=flat-square)
![CircleCI branch](https://img.shields.io/circleci/project/github/michaelthe/puppyjs/master.svg?style=flat-square)

## Puppy.JS with socket enhancements

[PuppyJS](https://github.com/michaelthe/puppyjs) is a great HTTP and WebSocket testing and mocking tool, but currently only supports sending web socket messages on an interval to test a front end client.   I needed something that could receive socket messages and then optionally send subsequent events back to the client application.   

The presence of an _action_ property determines whether the socket is configured as an emitter or a receiver.
See extended samples below for setting up action/reaction socket messaging in the puppy.ws.js configuration file.

## Puppeteer + Jest + awesome-code = Puppy.JS

PuppyJS is a framework agnostic E2E (end-to-end) testing and mocking tool for front end developers.
Puppy depends on [Jest](http://jestjs.io/) for tests and [Puppeteer](https://github.com/GoogleChrome/puppeteer) 
for the testing environment so if you know these tools then you already know 80% of Puppy.

Puppy also lets you mock HTTP APIs and web socket events so you can 
develop your application until the backend is ready as well as
run your E2E tests against the same mock API and socket events you used for development.  

## Getting Started

### Install  
```bash
npm install puppyjs --save-dev
```

### Install globally
```bash
npm install puppyjs --global
```

### Get some help
```bash
puppy --help
```

### Run mocking servers
```bash
puppy serve
```

### Run tests
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
    ├── users.pup.js
    └── notifications.pup.js
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

Sample periodic emitter:

```javascript
module.exports = {
  'notification': {
      delay: 1000,
      interval: 1000,
      message: [
        {seen: false, createdAt: Date.now(), text: 'I am a notification'}
      ]
    }
}
```

Simple socket receive:

```javascript
module.exports = {
  'action': {
    delay: 1000,
    message: 'get-server-list',
    action: () => {}
  }
}
```
The presence of an action property identifies this as a receiver and will delay 1 second to perform the _get-server-list_ message.   The function is empty, so no action will take place once this message has been received.


Simple action/reaction socket receive:

```javascript
module.exports = {
  'simpleReaction': {
    delay: 1000,
    message: 'get-server-list',
    action: function() {
      return 'initialize-server-list';
    }
  }
}
```
This configuration will wait for the message  _get-server-list_ then, after 1 second, it will return a simple message back to the client socket with the contents of _initialize-server-list_ for processing.

Action/reaction with payload via sockets:

```javascript
module.exports = {
  'payloadReaction': {
    delay: 1000,
    message: 'get-server-list',
    action: function(data) {
      return {
        message: 'load-server-list',
        servers: [ 'Server abc1', 'Server abc2', 'Server abc3' ],
        pattern: data.pattern,
        param: data.param2
      };
    }
  }
}
```
This configuration will wait for the message  _get-server-list_ then, after 1 second, it will return an object message back to the client.  Notice that this also recieves and includes a payload from the original event.  See section below for client message format for sending socket payloads.

Multiple Action/reaction via sockets:

If you need to have multiple reactions from a single client message, you can simply create multiple definitions using the same _message_ value.

```javascript
module.exports = {
  'simpleReaction': {
    delay: 1000,
    message: 'get-server-list',
    action: function() {
      return 'initialize-server-list';
    }
  },
  'payloadReaction': {
    delay: 1000,
    message: 'get-server-list',
    action: function(data) {
      return {
        message: 'load-server-list',
        servers: [ 'Server abc1', 'Server abc2', 'Server abc3' ],
        pattern: data.pattern,
        param: data.param2
      };
    }
  }  
}
```

The above configuration will send two messages to the client _initialize-server-list_, followed by _load-server-list_ for each _get-server-list_ request.

#### puppy.config.js

Sample:

```javascript
module.exports = {
    port: 1337
}
```

### Your first End-to-End test

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

To run this use the command

```javascript
puppy test
```

### Puppy Development Mock Server

You can use the same `puppy.api.js` file that you configure above for development purpose. Run `puppy serve` and you can now make a `GET` request to `/api/users` and get a reply back as set in the `puppy.api.js` file. 


## Client Socket Messages:

When using socket receiver actions, there are two recognized formats sending the client messages as a payload:

### Transmitting a Simple String

When a socket reciever is set up in the configuration file, a request from the client can be a simple string with the name of the event to trigger.   For example:

  get-server-list

This payload will execute the action setup in the configuration file with a _message_ property of _get-server-list_.


### Transmitting a Payload Object

In order to transmit a payload to the receiver action configuration, define the message payload to be a stringified JSON object using the format:

```Javascript
{
  "event": "get-server-list",
  "payload": { ... }
}
```

The event property will match the action(s) in the configuration file and pass in the _payload_ as a parameter to the action.   The payload can be any type (object, array, string) and will be preserved as such in the action function.   

The following message submitted by the client:

```Javascript
{
  "event": "get-server-list",
  "payload": { 
    "pattern": "abc*",
    "param2": "some text value"
  }
}
```

can be received and used by the action function:

```Javascript
    action: function(data) {
      return {
        message: 'load-server-list',
        servers: [ 'Server abc1', 'Server abc2', 'Server abc3' ],
        pattern: data.pattern,
        param: data.param2
      };
```

