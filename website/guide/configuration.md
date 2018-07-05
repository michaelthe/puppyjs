# Configuration

Puppy was designed to work out of the box with **zero-configuration**. However, each project is different so depending on the situation it might be required to adjust the configuration to fit the project's needs.

## Config file

The entry point for configuring Puppy is the `puppy.config.js` file and must be placed in the root of your project which exports a javascript object.

### Example:

```javascript
module.exports = {
    port: 1337,
    devtools: false
}
``` 

If you now run `puppy serve` or `puppy test` the port for the API, WSocket and Static file servers will be `1337` and if you are running tests, the devtools won't be open in the browser window that opens (if you are not running headless).

Consult [config reference]() for a complete breakdown of the configuration options.

::: tip
The same options can be provided as arguments. E.g. `puppy serve --port 1337 --devtools false`. There are some exceptions which you can consult in  [config reference]()
:::

## Puppy API file

The `puppy.api.js` file is used to define the default mocked responses when a client makes a request to an endpoint.
 It can be used to quickly mock the back-end part of an application as well as used in testing to provide 
 default responses instead of hitting an actual API.

The default filename can be changed by providing a flag.

```javascript
puppy serve --api mocked.api.js

puppy test --api mocked.api.js
```

### Example API definition file

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

Default values if not given for any response provided in the API definition file:

```javascript
{
  status: 200,
  body: 'EMPTY-BODY',
  headers: {}
}
```

## Puppy WS file

The `puppy.ws.js` file is used to simulate the websocket portion of a back-end system. It can simulate and emit messages with delay and/or interval or once-off dispatching.

The default filename can be changed by providing a flag.

```javascript
puppy serve --ws mocked.api.js

puppy test --ws mocked.api.js
````

**API**
   
   * Event: 
      * delay: Number (in milliseconds) **optional**
      * interval: Number (in milliseconds) **optional**
      * message: any

```javascript
module.exports = {
  notification: {
    delay: 300,
    interval: 1000,
    message: {
      seen: false,
      date: Date.now(),
      text: 'I am a notification'
    }
  },
  randomNumber: {
    delay: 600,
    interval: 1000,
    message: async () => {
      const numbers = [1, 2, 3, 4, 5]
      return numbers[Math.floor(Math.random() * numbers.length)]
    }
  },
  users: {
    delay: 900,
    interval: 1000,
    message: [
      {name: 'Jane Doe', email: 'jane@gmail.com', age: 44},
      {name: 'John Doe', email: 'john@gmail.com', age: 35}
    ]
  }
}
```
