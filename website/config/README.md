---
sidebar: auto
---

# Config Reference


You can fine-tune Puppy by passing arguments to `puppy serve` and `puppy test`. Below you can find all the options. 

::: danger
While for the most part the configuration options are the same for the command-line and config file some arguments cannot be passed in command line and vice-versa.
:::

## Example command-line format

```sh
puppy serve --port 8080
```

## Default config options

::: warning
Please note that the options below are in **camelCase** whereas command-line arguments are passed in using **kebab-case**.
In the config file snapshot below, what you see there are the `default` values. 
:::

```javascript
// puppy.config.js

const path = require('path')

module.exports = {
    // General config options
    port: 8080,
    verbose: false,
    headless: false,
    indexFile: 'index.html',
    staticDir: path.resolve(process.cwd(), 'dist')
    extPrefix: 'pup',
    
    // Web socket options
    ws: path.resolve(process.cwd(), 'puppy.ws.js'),
    wsUrl: '/ws',
    wsPort: 8080,
     
    // API options
    api: path.resolve(process.cwd(), 'puppy.api.js'),
    apiPort: 8080,
    
    // Puppeteer options
    devtools: true,
    windowWidth: 1920,
    windowHeight: 1080,
    viewportWidth: 1300,
    viewportHeight: 1080
}

```

## General config options

### port

- Type: `number`
- Default: `8080`

This sets the port for all servers (Websocket, API, Static files) except the internal server app.

### verbose

- Type: `boolean`
- Default: `false`

You can set this option to true if you want to have more specific logs spat out by Puppy.

### inspect

- Type: `boolean`
- Default: `false`

You can set this option to true if you want to be able to use a debugger in Puppy's source code.

### static-dir

- Type: `string`
- Default: `dist`

Define your own static dir in the current working directory for serving static assets

### index-file

- Type: `string`
- Default: `index.html`

Define your own index.html as an entrypoint in the current working directory

### ext-prefix

- Type: `string`
- Default: `pup`

Define the extension prefix for the test suites you wish to run. You can omit the `.js` part.

## Web socket options

### ws

- Type: `string`
- Default: `puppy.ws.js`

Flag for setting a custom file for the web socket definition file, Puppy needs it to be at the top level of the current directory next to package.json

### ws-port

- Type: `number`
- Default: `8080`

Flag for setting a custom port for connecting using web socket.

### ws-url

- Type: `string`
- Default: `/ws`

Set a custom url for connecting using web socket

## HTTP API options

### api

- Type: `string`
- Default: `puppy.api.js`

Flag for setting a custom file for the HTTP API definition file. Note this file needs to be at the top level of the current working directory next to the package.json file.

### api-port

- Type: `number`
- Default: `8080`

Flag for setting a custom port for connecting using HTTP

## Puppeteer options

### headless

- Type: `boolean`
- Default: `false`

You can set this option to true if you want avoid showing a browser window when running end-to-end tests.

### devtools

- Type: `boolean`
- Default: `true`

Whether devtools should be open when running tests

### window-height

- Type: `number`
- Default: `1920`

Defines the window height when running tests.

::: danger
Can only be passed in a configuration file. i.e `puppy.ws.js`
:::

### window-width

- Type: `number`
- Default: `1080`

Defines the window width when running tests.

::: danger
Can only be passed in a configuration file. i.e `puppy.ws.js`
:::

### viewport-height

- Type: `number`
- Default: `1080`

Defines the window height when running tests. This is the height inside the browser page. 

::: danger
Can only be passed in a configuration file. i.e `puppy.ws.js`
:::

### viewport-width

- Type: `number`
- Default: `1920`

Defines the viewport width when running tests. This is the width inside the browser page. 
Beware that if devtools are enabled, you need to compensate for the width lost. From our tests the devtools default width is about 580px.

::: danger
Can only be passed in a configuration file. i.e `puppy.ws.js`
:::